<?php

namespace App\Repositories\Campaign;

use App\Models\Campaign;

class CampaignRepository
{
    public function getTeamCampaigns(int $teamId, ?string $status = null, int $perPage = 15)
    {
        $query = Campaign::with('stats')->where('team_id', $teamId);

        if ($status && $status !== 'all') {
            $query->where('status', $status);
        }

        return $query->orderBy('created_at', 'desc')->paginate($perPage);
    }

    public function getCampaignStats(int $teamId)
    {
        return [
            'all' => Campaign::where('team_id', $teamId)->count(),
            'draft' => Campaign::where('team_id', $teamId)->where('status', 'draft')->count(),
            'scheduled' => Campaign::where('team_id', $teamId)->where('status', 'scheduled')->count(),
            'sending' => Campaign::where('team_id', $teamId)->where('status', 'sending')->count(),
            'completed' => Campaign::where('team_id', $teamId)->where('status', 'completed')->count(),
            'paused' => Campaign::where('team_id', $teamId)->where('status', 'paused')->count(),
            'failed' => Campaign::where('team_id', $teamId)->where('status', 'failed')->count(),
        ];
    }

    public function findById(int $id, int $teamId)
    {
        return Campaign::with(['stats', 'template'])->where('id', $id)
            ->where('team_id', $teamId)
            ->first();
    }

    public function create(array $data)
    {
        return Campaign::create($data);
    }

    public function update(Campaign $campaign, array $data)
    {
        $campaign->update($data);
        return $campaign->fresh();
    }

    public function delete(Campaign $campaign)
    {
        return $campaign->delete();
    }
}
