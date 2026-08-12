<?php

namespace App\Http\Controllers\Web\Backend;

use App\Http\Controllers\Controller;
use App\Models\Device;
use App\Models\Team;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DeviceController extends Controller
{
    public function create()
    {
        return Inertia::render('backend/devices/create', [
            'teams' => Team::select('id', 'team_name')->get(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'team_id' => ['required', 'exists:teams,id'],
            'name' => ['required', 'string', 'max:255'],
            'device_id' => ['required', 'string', 'max:255', 'unique:devices,device_id'],
            'imei' => ['nullable', 'string', 'max:255'],
            'manufacturer' => ['nullable', 'string', 'max:255'],
            'model' => ['nullable', 'string', 'max:255'],
            'android_version' => ['nullable', 'string', 'max:255'],
            'app_version' => ['nullable', 'string', 'max:255'],
            'status' => ['required', 'in:online,offline,inactive'],
            'device_token' => ['nullable', 'string', 'max:255', 'unique:devices,device_token'],
            'is_active' => ['boolean'],
        ]);

        $validated['is_active'] = $request->boolean('is_active');
        $device = Device::create($validated);

        return redirect()->route('devices.show', $device)->with('success', 'Device added successfully.');
    }

    public function index(Request $request)
    {
        return Inertia::render('backend/devices/index', [
            'devices' => Device::with(['team', 'sims'])
                ->when($request->search, fn ($query, $search) => $query->where(fn ($q) => $q->where('name', 'like', "%{$search}%")->orWhere('device_id', 'like', "%{$search}%")->orWhere('imei', 'like', "%{$search}%")))
                ->latest()->paginate(10)->withQueryString(),
            'filters' => $request->only('search'),
        ]);
    }

    public function show(Device $device)
    {
        return Inertia::render('backend/devices/show', [
            'device' => $device->load(['team', 'sims']),
        ]);
    }

    public function destroy(Device $device)
    {
        $device->delete();

        return redirect()->route('devices.index')
            ->with('success', 'Device and its SIMs were removed successfully.');
    }
}
