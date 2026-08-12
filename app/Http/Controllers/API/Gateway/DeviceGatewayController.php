<?php

namespace App\Http\Controllers\API\Gateway;

use App\Concerns\ApiResponse;
use App\Http\Controllers\Controller;
use App\Models\Campaign;
use App\Models\Device;
use App\Models\DeviceSim;
use App\Models\SmsLog;
use App\Models\TeamMember;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class DeviceGatewayController extends Controller
{
    use ApiResponse;

    public function storeDeviceId(Request $request): JsonResponse
    {
        $userId = Auth::id();
        $user = User::with(['teams'])->find($userId);

        dd($user);

        try {
            $data = $request->validate([
                // 'team_id' => ['required', 'exists:teams,id'],
                'device_id' => ['required', 'string', 'max:255'],
                'device_token' => ['required', 'string', 'max:255'],
                'name' => ['nullable', 'string', 'max:255'],
            ]);


            if (!TeamMember::where('team_id', $data['team_id'])->where('user_id', $request->user()->id)->exists()) {
                return $this->errorResponse('You are not a member of the selected team.', 403);
            }
            $device = Device::updateOrCreate(['device_id' => $data['device_id']], [
                'team_id' => $data['team_id'],
                'name' => $data['name'] ?: "Gateway {$data['device_id']}",
                'device_token' => $data['device_token'],
                'status' => 'online',
                'last_seen_at' => now(),
                'is_active' => true,
            ]);
            return $this->successResponse('Firebase device token stored.', $device->only(['id', 'team_id', 'device_id', 'device_token', 'status']));
        } catch (ValidationException $exception) {
            return $this->errorResponse('Validation failed.', 422, $exception->errors());
        }
    }

    public function storeDeviceInformation(Request $request): JsonResponse
    {
        try {
            $device = $this->device($request);
            $data = $request->validate([
                'name' => ['nullable', 'string', 'max:255'],
                'imei' => ['nullable', 'string', 'max:255'],
                'manufacturer' => ['nullable', 'string', 'max:255'],
                'model' => ['nullable', 'string', 'max:255'],
                'android_version' => ['nullable', 'string', 'max:255'],
                'app_version' => ['nullable', 'string', 'max:255'],
                'sims' => ['nullable', 'array'],
                'sims.*.slot_number' => ['required', 'integer', 'min:1', 'max:255'],
                'sims.*.phone_number' => ['nullable', 'string', 'max:255'],
                'sims.*.operator' => ['nullable', 'string', 'max:255'],
                'sims.*.country_code' => ['nullable', 'string', 'max:10'],
                'sims.*.subscription_id' => ['nullable', 'string', 'max:255'],
                'sims.*.sim_serial_number' => ['nullable', 'string', 'max:255'],
                'sims.*.carrier_name' => ['nullable', 'string', 'max:255'],
                'sims.*.status' => ['nullable', Rule::in(['active', 'inactive', 'no_signal', 'disabled'])],
                'sims.*.is_enabled' => ['nullable', 'boolean'],
            ]);
            DB::transaction(function () use ($device, $data) {
                $device->update(array_merge(collect($data)->except('sims')->filter(fn($value) => $value !== null)->all(), ['status' => 'online', 'last_seen_at' => now()]));
                foreach ($data['sims'] ?? [] as $sim) {
                    DeviceSim::updateOrCreate(['device_id' => $device->id, 'slot_number' => $sim['slot_number']], array_merge($sim, ['team_id' => $device->team_id, 'status' => $sim['status'] ?? 'active', 'is_enabled' => $sim['is_enabled'] ?? true]));
                }
            });
            return $this->successResponse('Device information synchronized.', $device->fresh()->load('sims'));
        } catch (ValidationException $exception) {
            return $this->errorResponse('Validation failed.', 422, $exception->errors());
        }
    }

    public function campaigns(Request $request): JsonResponse
    {
        $device = $this->device($request);
        $campaigns = Campaign::with(['template:id,title,message,variables', 'sim:id,device_id,slot_number,phone_number'])
            ->where('team_id', $device->team_id)->whereHas('sim', fn($query) => $query->where('device_id', $device->id))
            ->whereIn('status', ['sending', 'scheduled'])->where('is_active', true)->get();
        return $this->successResponse('Device campaigns retrieved.', $campaigns);
    }

    public function smsLogs(Request $request): JsonResponse
    {
        $device = $this->device($request);
        $perPage = min((int) $request->input('per_page', 50), 100);
        $logs = SmsLog::where('device_id', $device->id)->when($request->status, fn($query, $status) => $query->where('status', $status))->latest()->paginate($perPage);
        return $this->successResponse('SMS logs retrieved.', $logs);
    }

    public function updateSmsLogStatus(Request $request, SmsLog $smsLog): JsonResponse
    {
        try {
            $device = $this->device($request);
            abort_unless($smsLog->device_id === $device->id, 403, 'This SMS log does not belong to this device.');
            $data = $request->validate([
                'status' => ['required', Rule::in(['sending', 'sent', 'delivered', 'failed', 'cancelled'])],
                'gateway_message_id' => ['nullable', 'string', 'max:255'],
                'gateway_status' => ['nullable', 'string', 'max:255'],
                'gateway_response' => ['nullable'],
                'error_message' => ['nullable', 'string'],
            ]);
            $timestamps = match ($data['status']) {
                'sent' => ['sent_at' => now()],
                'delivered' => ['delivered_at' => now()],
                'failed' => ['failed_at' => now()],
                default => []
            };
            $smsLog->update(array_merge($data, $timestamps));
            return $this->successResponse('SMS log status updated.', $smsLog->fresh());
        } catch (ValidationException $exception) {
            return $this->errorResponse('Validation failed.', 422, $exception->errors());
        }
    }

    private function device(Request $request): Device
    {
        $deviceId = $request->input('device_id');
        $token = $request->header('X-Device-Token', $request->input('device_token'));
        abort_unless($deviceId && $token, 401, 'device_id and X-Device-Token are required.');
        return Device::where('device_id', $deviceId)->where('device_token', $token)->firstOrFail();
    }
}
