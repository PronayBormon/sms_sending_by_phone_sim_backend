<?php

namespace App\Services\Campaign;

use App\Repositories\Campaign\CampaignRepository;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

class CampaignAnalyticsService
{
    public function __construct(
        protected CampaignRepository $repository
    ) {}

    private function getTeamId(): int
    {
        $teamId = auth()->user()->currentTeamId();
        if (!$teamId) {
            throw ValidationException::withMessages(['team' => 'Team not found.']);
        }
        return $teamId;
    }

    public function getAnalytics(int $campaignId)
    {
        $campaign = $this->repository->findById($campaignId, $this->getTeamId());

        if (!$campaign || !$campaign->stats) {
            throw ValidationException::withMessages(['campaign' => 'Campaign analytics not found.']);
        }

        $s = $campaign->stats;

        $deliveredRate = $s->total_recipients > 0 ? round(($s->delivered_count / $s->total_recipients) * 100, 1) : 0;
        $openRate = $s->delivered_count > 0 ? round(($s->opened_count / $s->delivered_count) * 100, 1) : 0;
        $clickRate = $s->delivered_count > 0 ? round(($s->clicked_count / $s->delivered_count) * 100, 1) : 0;
        $bounceRate = $s->total_recipients > 0 ? round(($s->bounced_count / $s->total_recipients) * 100, 1) : 0;

        return [
            'recipients' => $s->total_recipients,
            'delivered' => [
                'count' => $s->delivered_count,
                'percentage' => $deliveredRate
            ],
            'opened' => [
                'count' => $s->opened_count,
                'percentage' => $openRate
            ],
            'clicked' => [
                'count' => $s->clicked_count,
                'percentage' => $clickRate
            ],
            'bounced' => [
                'count' => $s->bounced_count,
                'percentage' => $bounceRate
            ]
        ];
    }
}
