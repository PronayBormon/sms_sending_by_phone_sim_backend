<?php

namespace App\Http\Controllers\Web\Frontend\User;

use App\Http\Controllers\Controller;
use App\Models\Campaign;
use App\Models\ContactList;
use App\Models\MessageTemplate;
use App\Models\DeviceSim;
use App\Services\TeamActivityService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserCampaignController extends Controller
{
    public function index()
    {
        $teamId = auth()->user()->currentTeamId();
        $campaigns = Campaign::with('template:id,title', 'stats')
            ->where('team_id', $teamId)
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return Inertia::render('frontend/user/campaigns/index', [
            'campaigns' => $campaigns
        ]);
    }

    public function scheduled()
    {
        $teamId = auth()->user()->currentTeamId();
        $campaigns = Campaign::with('template:id,title', 'sim:id,phone_number')
            ->where('team_id', $teamId)
            ->where('schedule_type', 'scheduled')
            ->orderBy('date', 'asc')
            ->orderBy('time', 'asc')
            ->paginate(10);

        return Inertia::render('frontend/user/scheduled/index', [
            'scheduled' => $campaigns
        ]);
    }

    public function create()
    {
        $teamId = auth()->user()->currentTeamId();
        return Inertia::render('frontend/user/campaigns/create', [
            'templates' => MessageTemplate::where('team_id', $teamId)->where('is_active', true)->get(['id', 'title']),
            'lists' => ContactList::where('team_id', $teamId)->get(['id', 'name']),
            'sims' => DeviceSim::where('team_id', $teamId)->where('status', 'active')->select('id', 'phone_number', \DB::raw("COALESCE(carrier_name, phone_number, CONCAT('Slot ', slot_number)) as label"))->get(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'campaign_name'     => 'required|string|max:200',
            'description'       => 'nullable|string|max:500',
            'campaign_type'     => 'required|in:regular,automated,ab_test',
            'template_id'       => 'nullable|exists:message_templates,id',
            'sim_id'            => 'nullable|exists:device_sims,id',
            'recipient_list_ids'=> 'nullable|array',
            'schedule_type'     => 'required|in:now,later',
            'date'              => 'nullable|date',
            'time'              => 'nullable|string',
            'status'            => 'nullable|in:draft,scheduled,sending,completed,paused,failed',
            'is_active'         => 'nullable|boolean',
            'is_draft'          => 'nullable|boolean',
        ]);

        $teamId = auth()->user()->currentTeamId();
        $validated['team_id'] = $teamId;
        if (!isset($validated['is_draft'])) {
            $validated['is_draft'] = ($validated['status'] ?? 'draft') === 'draft';
        }
        $campaign = Campaign::create($validated);

        TeamActivityService::log(
            $teamId,
            'created a campaign',
            $campaign->campaign_name,
            route('campaigns.edit', $campaign->id)
        );

        if ($campaign->schedule_type === 'now' && $campaign->status === 'sending' && !$campaign->is_draft) {
            app(\App\Services\CampaignDispatchService::class)->queue($campaign);
        }

        return redirect()->route('campaigns.index')->with('success', 'Campaign created successfully.');
    }

    public function show(Campaign $campaign)
    {
        $teamId = auth()->user()->currentTeamId();
        if ($campaign->team_id !== $teamId) abort(403);

        $campaign->load(['template', 'sim']);
        
        $campaign->setAttribute('stats', [
            'sent' => \App\Models\SmsLog::where('campaign_id', $campaign->id)->whereIn('status', ['sent', 'delivered'])->count(),
            'delivered' => \App\Models\SmsLog::where('campaign_id', $campaign->id)->where('status', 'delivered')->count(),
            'failed' => \App\Models\SmsLog::where('campaign_id', $campaign->id)->whereIn('status', ['failed', 'cancelled'])->count(),
        ]);

        $logs = \App\Models\SmsLog::with('device:id,name')->where('campaign_id', $campaign->id)->orderBy('created_at', 'desc')->paginate(50);
        
        $lists = \App\Models\ContactList::whereIn('id', $campaign->recipient_list_ids ?? [])->get(['id', 'name']);

        return Inertia::render('frontend/user/campaigns/show', [
            'campaign' => $campaign,
            'logs' => $logs,
            'lists' => $lists,
        ]);
    }

    public function edit(Campaign $campaign)
    {
        $teamId = auth()->user()->currentTeamId();
        if ($campaign->team_id !== $teamId) abort(403);

        return Inertia::render('frontend/user/campaigns/edit', [
            'campaign'  => $campaign,
            'templates' => MessageTemplate::where('team_id', $teamId)->where('is_active', true)->get(['id', 'title']),
            'lists'     => ContactList::where('team_id', $teamId)->get(['id', 'name']),
            'sims'      => DeviceSim::where('team_id', $teamId)->where('status', 'active')->select('id', 'phone_number', \DB::raw("COALESCE(carrier_name, phone_number, CONCAT('Slot ', slot_number)) as label"))->get(),
        ]);
    }

    public function update(Request $request, Campaign $campaign)
    {
        $teamId = auth()->user()->currentTeamId();
        if ($campaign->team_id !== $teamId) abort(403);

        $validated = $request->validate([
            'campaign_name'     => 'required|string|max:200',
            'description'       => 'nullable|string|max:500',
            'campaign_type'     => 'required|in:regular,automated,ab_test',
            'template_id'       => 'nullable|exists:message_templates,id',
            'sim_id'            => 'nullable|exists:device_sims,id',
            'recipient_list_ids'=> 'nullable|array',
            'schedule_type'     => 'required|in:now,later',
            'date'              => 'nullable|date',
            'time'              => 'nullable|string',
            'status'            => 'nullable|in:draft,scheduled,sending,completed,paused,failed',
            'is_active'         => 'nullable|boolean',
            'is_draft'          => 'nullable|boolean',
        ]);

        if (isset($validated['status']) && !isset($validated['is_draft'])) {
            $validated['is_draft'] = $validated['status'] === 'draft';
        }

        $campaign->update($validated);

        TeamActivityService::log(
            $teamId,
            'updated a campaign',
            $campaign->campaign_name,
            route('campaigns.edit', $campaign->id)
        );

        if ($campaign->wasChanged('status') && $campaign->schedule_type === 'now' && $campaign->status === 'sending' && !$campaign->is_draft) {
            app(\App\Services\CampaignDispatchService::class)->queue($campaign);
        }

        return redirect()->route('campaigns.index')->with('success', 'Campaign updated successfully.');
    }

    public function destroy(Campaign $campaign)
    {
        $teamId = auth()->user()->currentTeamId();
        if ($campaign->team_id !== $teamId) abort(403);

        $name = $campaign->campaign_name;
        $campaign->delete();

        TeamActivityService::log($teamId, 'deleted a campaign', $name);

        return redirect()->route('campaigns.index')->with('success', 'Campaign deleted successfully.');
    }
}
