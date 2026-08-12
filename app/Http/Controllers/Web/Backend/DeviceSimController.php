<?php

namespace App\Http\Controllers\Web\Backend;

use App\Http\Controllers\Controller;
use App\Models\Device;
use App\Models\DeviceSim;
use App\Models\Team;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class DeviceSimController extends Controller
{
    public function create()
    {
        return Inertia::render('backend/sims/create', [
            'teams' => Team::select('id', 'team_name')->get(),
            'devices' => Device::select('id', 'team_id', 'name', 'device_id')->get(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'team_id' => ['required', 'exists:teams,id'],
            'device_id' => ['required', 'exists:devices,id'],
            'slot_number' => ['required', 'integer', 'min:1', 'max:255', Rule::unique('device_sims')->where(fn ($query) => $query->where('device_id', $request->device_id))],
            'phone_number' => ['nullable', 'string', 'max:255'], 'operator' => ['nullable', 'string', 'max:255'],
            'country_code' => ['nullable', 'string', 'max:10'], 'subscription_id' => ['nullable', 'string', 'max:255'],
            'sim_serial_number' => ['nullable', 'string', 'max:255'], 'carrier_name' => ['nullable', 'string', 'max:255'],
            'status' => ['required', Rule::in(['active', 'inactive', 'no_signal', 'disabled'])], 'is_enabled' => ['boolean'],
        ]);
        $device = Device::findOrFail($validated['device_id']);
        if ((int) $device->team_id !== (int) $validated['team_id']) return back()->withErrors(['device_id' => 'The selected device does not belong to this team.'])->withInput();
        $validated['is_enabled'] = $request->boolean('is_enabled');
        DeviceSim::create($validated);
        return redirect()->route('devices.show', $device)->with('success', 'SIM added successfully.');
    }
}
