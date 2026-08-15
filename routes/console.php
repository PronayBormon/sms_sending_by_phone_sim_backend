<?php

use App\Models\Campaign;
use App\Services\CampaignDispatchService;
use Illuminate\Support\Facades\Schedule;
use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Log;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Artisan::command('campaigns:dispatch-due', function (CampaignDispatchService $dispatcher) {
    Campaign::query()
        ->where('status', 'scheduled')
        ->where('is_active', true)
        ->where('is_draft', false)
        ->each(function (Campaign $campaign) use ($dispatcher) {
            $timezone = $campaign->timezone ?: config('app.timezone');

            if (
                $campaign->date &&
                $campaign->time &&
                \Carbon\Carbon::parse(
                    "{$campaign->date->format('Y-m-d')} {$campaign->time}",
                    $timezone
                )->lte(now($timezone))
            ) {
                $dispatcher->queue($campaign);
            }
        });
})->purpose('Queue scheduled SMS campaigns that are due.');

Schedule::command('campaigns:dispatch-due')->everyMinute();

// QR Token Cleanup
Schedule::command('app:clean-expired-qr-tokens')
    ->everyFiveMinutes()
    ->onSuccess(function () {
        Log::info('Expired QR tokens cleaned successfully.');
    });
