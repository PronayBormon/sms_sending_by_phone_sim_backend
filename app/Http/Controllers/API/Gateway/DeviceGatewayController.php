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


    public function storeDevice(Request $request): JsonResponse
    {
        try {
            $userId = Auth::id();
            $teamId = auth()->user()->currentTeamId();
            $data = $request->validate([
                'device_id' => ['required', 'string', 'max:255'],
                'device_token' => ['required', 'string', 'max:255'],
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
                'sims.*.status' => ['nullable', Rule::in(['active', 'inactive', 'no_signal', 'disabled']),],
                'sims.*.is_enabled' => ['nullable', 'boolean'],
            ]);

            /*
        |--------------------------------------------------------------------------
        | Check Team Membership
        |--------------------------------------------------------------------------
        */

            if (!TeamMember::where('team_id', $teamId)
                ->where('user_id', $userId)
                ->exists()) {
                return $this->errorResponse(
                    'You are not a member of the selected team.',
                    403
                );
            }

            /*
        |--------------------------------------------------------------------------
        | Store Device + SIMs
        |--------------------------------------------------------------------------
        */

            $device = DB::transaction(function () use ($data, $teamId) {

                $device = Device::updateOrCreate(
                    [
                        'device_id' => $data['device_id'],
                    ],
                    [
                        'team_id' => $teamId,
                        'name' => $data['name']
                            ?? "Gateway {$data['device_id']}",
                        'device_token' => $data['device_token'],
                        'imei' => $data['imei'] ?? null,
                        'manufacturer' => $data['manufacturer'] ?? null,
                        'model' => $data['model'] ?? null,
                        'android_version' => $data['android_version'] ?? null,
                        'app_version' => $data['app_version'] ?? null,
                        'status' => 'online',
                        'last_seen_at' => now(),
                        'is_active' => true,
                    ]
                );

                /*
            |--------------------------------------------------------------------------
            | Store SIMs
            |--------------------------------------------------------------------------
            */

                foreach ($data['sims'] ?? [] as $sim) {

                    DeviceSim::updateOrCreate(
                        [
                            'device_id' => $device->id,
                            'slot_number' => $sim['slot_number'],
                        ],
                        [
                            'team_id' => $device->team_id,
                            'phone_number' => $sim['phone_number'] ?? null,
                            'operator' => $sim['operator'] ?? null,
                            'country_code' => $sim['country_code'] ?? null,
                            'subscription_id' => $sim['subscription_id'] ?? null,
                            'sim_serial_number' => $sim['sim_serial_number'] ?? null,
                            'carrier_name' => $sim['carrier_name'] ?? null,
                            'status' => $sim['status'] ?? 'active',
                            'is_enabled' => $sim['is_enabled'] ?? true,
                        ]
                    );
                }

                return $device;
            });

            /*
        |--------------------------------------------------------------------------
        | Response
        |--------------------------------------------------------------------------
        */

            return $this->successResponse(
                'Device and SIM information synchronized.',
                $device
                    ->fresh()
                    ->load('sims')
            );
        } catch (ValidationException $exception) {

            return $this->errorResponse(
                'Validation failed.',
                422,
                $exception->errors()
            );
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
        $deviceToken = $request->input('device_token');

        if (!$deviceId || !$deviceToken) {
            throw new \Exception('device_id and device_token are required.', 401);
        }

        $device = Device::where('device_id', $deviceId)
            ->where('device_token', $deviceToken)
            ->firstOrFail();

        return $device;
    }
}
