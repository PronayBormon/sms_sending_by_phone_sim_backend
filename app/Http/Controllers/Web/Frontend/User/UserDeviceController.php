<?php

namespace App\Http\Controllers\Web\Frontend\User;

use App\Http\Controllers\Controller;
use App\Models\Device;
use App\Models\DeviceSim;
use App\Models\QrLoginToken;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Inertia\Inertia;

class UserDeviceController extends Controller
{
    public function index()
    {
        $teamId = auth()->user()->currentTeamId();

        $devices = Device::withCount(['sims as active_sims_count' => function ($query) {
            $query->where('status', 'active');
        }])
            ->with(['sims' => function ($q) {
                $q->select('id', 'device_id', 'slot_number', 'phone_number', 'carrier_name', 'status', 'total_sent');
            }])
            ->where('team_id', $teamId)
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('frontend/user/devices/index', [
            'devices' => $devices
        ]);
    }

    public function show($id)
    {
        $teamId = auth()->user()->currentTeamId();

        $device = Device::with('sims')
            ->where('team_id', $teamId)
            ->findOrFail($id);

        $device->setAttribute('stats', [
            'today' => \App\Models\SmsLog::where('device_id', $device->id)->whereDate('created_at', Carbon::today())->count(),
            'month' => \App\Models\SmsLog::where('device_id', $device->id)->whereMonth('created_at', Carbon::now()->month)->count(),
            'failed' => \App\Models\SmsLog::where('device_id', $device->id)->whereIn('status', ['failed', 'cancelled'])->count(),
            'delivered' => \App\Models\SmsLog::where('device_id', $device->id)->where('status', 'delivered')->count(),
            'total' => \App\Models\SmsLog::where('device_id', $device->id)->count(),
        ]);

        return Inertia::render('frontend/user/devices/show', [
            'device' => $device
        ]);
    }

    // public function connect(Request $request)
    // {
    //     $token = Str::upper(Str::random(8));
    //     $hashed = Hash::make($token);
    //     $request->session()->put('qr_login_token', $hashed);
    //     $expiresAt = Carbon::now()->addMinutes(2);
    //     $request->session()->put('qr_login_expires_at', $expiresAt);

    //     return Inertia::render('frontend/user/devices/connect',[
    //         "token" => $token,
    //         "expiresAt" => $expiresAt,
    //     ]);
    // }

    public function connect(Request $request)
    {
        $token = bin2hex(random_bytes(12));

        $expiresAt = now()->addMinutes(2);

        QrLoginToken::create([
            'token_hash' => Hash::make($token),
            'user_id' => auth()->id(),
            'browser_session_id' => $request->session()->getId(),
            'expires_at' => $expiresAt,
        ]);

        return Inertia::render('frontend/user/devices/connect', [
            'token' => $token,
            'expiresAt' => $expiresAt,
        ]);
    }

    public function simCards()
    {
        $teamId = auth()->user()->currentTeamId();

        $sims = DeviceSim::with('device:id,name,model,status')
            ->where('team_id', $teamId)
            ->orderBy('device_id')
            ->orderBy('slot_number')
            ->paginate(50);

        return Inertia::render('frontend/user/sim-cards/index', [
            'sims' => $sims
        ]);
    }

    public function storeDemoDevice(Request $request)
    {
        $teamId = auth()->user()->currentTeamId();

        $validated = $request->validate([
            'name'            => 'required|string|max:100',
            'manufacturer'    => 'nullable|string|max:100',
            'model'           => 'nullable|string|max:100',
            'android_version' => 'nullable|string|max:10',
            'sim_count'       => 'required|in:1,2',
            'sim1_phone'      => 'nullable|string|max:20',
            'sim1_carrier'    => 'nullable|string|max:100',
            'sim1_operator'   => 'nullable|string|max:100',
            'sim1_subscription_id' => 'nullable|string|max:50',
            'sim2_phone'      => 'nullable|string|max:20',
            'sim2_carrier'    => 'nullable|string|max:100',
            'sim2_operator'   => 'nullable|string|max:100',
            'sim2_subscription_id' => 'nullable|string|max:50',
        ]);

        // Create the demo device
        $device = Device::create([
            'team_id'         => $teamId,
            'name'            => $validated['name'],
            'device_id'       => 'DEMO-' . strtoupper(Str::random(8)),
            'manufacturer'    => $validated['manufacturer'] ?? 'Demo',
            'model'           => $validated['model'] ?? null,
            'android_version' => $validated['android_version'] ?? null,
            'status'          => 'offline',
            'is_active'       => true,
        ]);

        // Create SIM 1
        DeviceSim::create([
            'team_id'         => $teamId,
            'device_id'       => $device->id,
            'slot_number'     => 1,
            'phone_number'    => $validated['sim1_phone'] ?? null,
            'carrier_name'    => $validated['sim1_carrier'] ?? null,
            'operator'        => $validated['sim1_operator'] ?? null,
            'subscription_id' => $validated['sim1_subscription_id'] ?? null,
            'status'          => 'inactive',
        ]);

        // Create SIM 2 if dual SIM
        if ((int) $validated['sim_count'] === 2) {
            DeviceSim::create([
                'team_id'         => $teamId,
                'device_id'       => $device->id,
                'slot_number'     => 2,
                'phone_number'    => $validated['sim2_phone'] ?? null,
                'carrier_name'    => $validated['sim2_carrier'] ?? null,
                'operator'        => $validated['sim2_operator'] ?? null,
                'subscription_id' => $validated['sim2_subscription_id'] ?? null,
                'status'          => 'inactive',
            ]);
        }

        return redirect()->route('devices.index')->with('success', 'Demo device "' . $device->name . '" created successfully.');
    }

    public function toggleSim($id)
    {
        $teamId = auth()->user()->currentTeamId();
        $sim = DeviceSim::where('team_id', $teamId)->findOrFail($id);

        $sim->is_enabled = !$sim->is_enabled;
        $sim->status = $sim->is_enabled ? 'inactive' : 'disabled';
        $sim->save();

        return back()->with('success', 'SIM card status updated successfully.');
    }

    public function destroy($id)
    {
        $teamId = auth()->user()->currentTeamId();
        $device = Device::where('team_id', $teamId)->findOrFail($id);

        // Delete associated SIMs explicitly
        DeviceSim::where('device_id', $device->id)->delete();
        
        $name = $device->name;
        $device->delete();

        \App\Services\TeamActivityService::log($teamId, 'deleted a device', $name);

        return redirect()->route('devices.index')->with('success', 'Device deleted successfully.');
    }
}
