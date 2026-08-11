<?php

namespace App\Services\Campaign;

use App\Repositories\Campaign\CampaignRepository;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

class CampaignService
{
    public function __construct(
        protected CampaignRepository $repository
    ) {}

    private function getTeamId(): int
    {
        $auth = Auth::user();
        if (!$auth || $auth->teams->isEmpty()) {
            throw ValidationException::withMessages(['team' => 'Team not found.']);
        }
        return $auth->teams->first()->id;
    }

    public function listCampaigns(?string $status = null, int $perPage = 15)
    {
        $teamId = $this->getTeamId();
        
        $campaigns = $this->repository->getTeamCampaigns($teamId, $status, $perPage);
        $stats = $this->repository->getCampaignStats($teamId);

        // Format for frontend
        $campaigns->getCollection()->transform(function ($campaign) {
            $s = $campaign->stats;
            $openRate = $s && $s->delivered_count > 0 ? round(($s->opened_count / $s->delivered_count) * 100, 1) : 0;
            $ctr = $s && $s->delivered_count > 0 ? round(($s->clicked_count / $s->delivered_count) * 100, 1) : 0;
            $progress = $s && $s->total_recipients > 0 ? round(($s->delivered_count / $s->total_recipients) * 100, 1) : 0;

            return [
                'id' => $campaign->id,
                'campaign_name' => $campaign->campaign_name,
                'description' => $campaign->description,
                'status' => $campaign->status,
                'recipients' => $s ? $s->total_recipients : 0,
                'progress' => $progress,
                'open_rate' => $openRate,
                'ctr' => $ctr,
                'date' => $campaign->created_at->format('M d, Y'),
            ];
        });

        return [
            'summary' => $stats,
            'campaigns' => $campaigns,
        ];
    }

    public function storeCampaign(array $data)
    {
        $data['team_id'] = $this->getTeamId();
        
        // Setup default status based on data
        if (!isset($data['status'])) {
            $data['status'] = 'draft';
        }

        $campaign = $this->repository->create($data);

        // Create empty stats record
        $campaign->stats()->create([
            'total_recipients' => count($data['recipient_list_ids'] ?? []) * 100, // mock calculation
        ]);

        return $campaign;
    }

    public function showCampaign(int $id)
    {
        $campaign = $this->repository->findById($id, $this->getTeamId());

        if (!$campaign) {
            throw ValidationException::withMessages(['campaign' => 'Campaign not found.']);
        }

        return $campaign;
    }

    public function updateCampaign(int $id, array $data)
    {
        $campaign = $this->repository->findById($id, $this->getTeamId());

        if (!$campaign) {
            throw ValidationException::withMessages(['campaign' => 'Campaign not found.']);
        }

        return $this->repository->update($campaign, $data);
    }

    public function deleteCampaign(int $id)
    {
        $campaign = $this->repository->findById($id, $this->getTeamId());

        if (!$campaign) {
            throw ValidationException::withMessages(['campaign' => 'Campaign not found.']);
        }

        return $this->repository->delete($campaign);
    }
}
