<?php

namespace App\Services;

use App\Jobs\SendCampaignSmsJob;
use App\Models\Campaign;
use App\Models\ContactList;
use App\Models\SmsLog;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use RuntimeException;

class CampaignDispatchService
{
    public function queue(Campaign $campaign): int
    {
        $campaign->loadMissing(['template', 'sim.device']);
        if (!$campaign->template || !$campaign->sim || !$campaign->sim->device) throw new RuntimeException('Campaign needs a message template and sending SIM.');

        $contacts = ContactList::whereIn('id', $campaign->recipient_list_ids ?? [])
            ->with('contacts:id,phone,name')->get()->pluck('contacts')->flatten()->filter(fn ($contact) => filled($contact->phone))->unique('id');
        if ($contacts->isEmpty()) throw new RuntimeException('No contacts with phone numbers were found in the selected lists.');

        $logIds = DB::transaction(function () use ($campaign, $contacts) {
            $campaign->update(['status' => 'sending', 'is_draft' => false]);
            return $contacts->map(function ($contact) use ($campaign) {
                $message = $this->render($campaign->template->message, $contact);
                return SmsLog::create([
                    'team_id' => $campaign->team_id, 'device_id' => $campaign->sim->device_id, 'campaign_id' => $campaign->id,
                    'sim_slot' => $campaign->sim->slot_number, 'sender' => $campaign->sim->phone_number,
                    'recipient' => $contact->phone, 'message' => $message, 'status' => 'queued', 'queued_at' => now(),
                ])->id;
            });
        });
        $logIds->each(fn ($id) => SendCampaignSmsJob::dispatch($id));
        return $logIds->count();
    }

    private function render(string $message, object $contact): string
    {
        return str_replace(['{{name}}', '{{phone}}'], [(string) ($contact->name ?? ''), (string) $contact->phone], $message);
    }
}
