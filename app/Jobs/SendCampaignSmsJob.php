<?php

namespace App\Jobs;

use App\Models\SmsLog;
use App\Services\FirebaseSmsService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Throwable;

class SendCampaignSmsJob implements ShouldQueue
{
    use Queueable;

    public int $tries = 3;

    public function __construct(public int $smsLogId) {}

    public function handle(FirebaseSmsService $firebase): void
    {
        $log = SmsLog::with(['device', 'campaign.template'])->find($this->smsLogId);
        if (!$log || !$log->device || !$log->campaign || !$log->campaign->template) return;

        if (!$log->device->device_token) {
            $log->update(['status' => 'failed', 'failed_at' => now(), 'error_message' => 'The selected device has no Firebase token.', 'attempts' => $log->attempts + 1]);
            return;
        }

        $log->update(['status' => 'sending', 'attempts' => $log->attempts + 1]);

        try {
            $response = $firebase->send($log->device->device_token, [
                'type' => 'send_sms', 'sms_log_id' => $log->id, 'campaign_id' => $log->campaign_id,
                'recipient' => $log->recipient, 'message' => $log->message, 'sim_slot' => $log->sim_slot,
            ]);
            $log->update(['status' => 'sent', 'sent_at' => now(), 'gateway_message_id' => $response['name'] ?? null, 'gateway_status' => 'accepted', 'gateway_response' => json_encode($response)]);
        } catch (Throwable $exception) {
            $log->update(['status' => 'failed', 'failed_at' => now(), 'error_message' => $exception->getMessage()]);
            throw $exception;
        }
    }
}
