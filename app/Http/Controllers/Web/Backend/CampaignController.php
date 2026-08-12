<?php

namespace App\Http\Controllers\Web\Backend;

use App\Http\Controllers\Controller;
use App\Models\Campaign;
use App\Models\Team;
use App\Models\MessageTemplate;
use App\Models\DeviceSim;
use App\Models\ContactList;
use App\Services\CampaignDispatchService;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CampaignController extends Controller
{
    public function index(Request $request)
    {
        $campaigns = Campaign::query()
            ->with(['team', 'template'])
            ->when($request->search, function ($query, $search) {
                $query->where('campaign_name', 'like', "%{$search}%")
                      ->orWhere('description', 'like', "%{$search}%");
            })
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('backend/campaigns/index', [
            'campaigns' => $campaigns,
            'filters' => $request->only(['search']),
        ]);
    }

    public function create()
    {
        return Inertia::render('backend/campaigns/create', [
            'teams' => Team::select('id', 'team_name')->get(),
            'templates' => MessageTemplate::select('id', 'title')->where('is_active', true)->get(),
            'sims' => DeviceSim::with('device:id,name,device_id')->where('is_enabled', true)->get(['id', 'device_id', 'phone_number', 'slot_number', 'operator', 'status']),
            'contactLists' => ContactList::select('id', 'name')->get(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'team_id' => ['nullable', 'exists:teams,id'],
            'template_id' => ['nullable', 'exists:message_templates,id'],
            'sim_id' => ['nullable', 'exists:device_sims,id'],
            'campaign_name' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'campaign_type' => ['required', 'string', 'in:regular,automated,ab_test'],
            'tags' => ['nullable', 'string'],
            'recipient_list_ids' => ['nullable', 'array'],
            'recipient_list_ids.*' => ['integer', 'exists:contact_lists,id'],
            'schedule_type' => ['required', 'string', 'in:now,later'],
            'date' => ['nullable', 'date'],
            'time' => ['nullable', 'string'],
            'timezone' => ['nullable', 'string'],
            'is_draft' => ['boolean'],
            'is_active' => ['boolean'],
        ]);
        
        if (isset($validated['tags']) && !empty($validated['tags'])) {
            $validated['tags'] = array_map('trim', explode(',', $validated['tags']));
        } else {
            $validated['tags'] = null;
        }

        $campaign = Campaign::create($validated);
        $this->queueWhenDue($campaign, $request);

        return redirect()->route('campaigns.show', $campaign)->with('success', 'Campaign created successfully.');
    }

    public function show($id)
    {
        $campaign = Campaign::with(['team', 'template', 'sim.device'])->findOrFail($id);
        $campaign->recipient_lists = ContactList::whereIn('id', $campaign->recipient_list_ids ?? [])->get(['id', 'name']);

        return Inertia::render('backend/campaigns/show', [
            'campaign' => $campaign
        ]);
    }

    public function edit($id)
    {
        $campaign = Campaign::findOrFail($id);

        return Inertia::render('backend/campaigns/edit', [
            'campaign' => $campaign,
            'teams' => Team::select('id', 'team_name')->get(),
            'templates' => MessageTemplate::select('id', 'title')->where('is_active', true)->get(),
            'sims' => DeviceSim::with('device:id,name,device_id')->where('is_enabled', true)->get(['id', 'device_id', 'phone_number', 'slot_number', 'operator', 'status']),
            'contactLists' => ContactList::select('id', 'name')->get(),
        ]);
    }

    public function update(Request $request, $id)
    {
        $campaign = Campaign::findOrFail($id);

        $validated = $request->validate([
            'team_id' => ['nullable', 'exists:teams,id'],
            'template_id' => ['nullable', 'exists:message_templates,id'],
            'sim_id' => ['nullable', 'exists:device_sims,id'],
            'campaign_name' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'campaign_type' => ['required', 'string', 'in:regular,automated,ab_test'],
            'tags' => ['nullable', 'string'],
            'recipient_list_ids' => ['nullable', 'array'],
            'recipient_list_ids.*' => ['integer', 'exists:contact_lists,id'],
            'schedule_type' => ['required', 'string', 'in:now,later'],
            'date' => ['nullable', 'date'],
            'time' => ['nullable', 'string'],
            'timezone' => ['nullable', 'string'],
            'is_draft' => ['boolean'],
            'is_active' => ['boolean'],
        ]);

        if (isset($validated['tags']) && !empty($validated['tags'])) {
            $validated['tags'] = array_map('trim', explode(',', $validated['tags']));
        } else {
            $validated['tags'] = null;
        }

        $campaign->update($validated);
        $this->queueWhenDue($campaign->fresh(), $request);

        return back()->with('success', 'Campaign updated successfully');
    }

    public function destroy($id)
    {
        $campaign = Campaign::findOrFail($id);
        $campaign->delete();

        return back()->with('success', 'Campaign deleted successfully');
    }

    private function queueWhenDue(Campaign $campaign, Request $request): void
    {
        if (!$campaign->is_active || $campaign->is_draft || in_array($campaign->status, ['sending', 'completed'], true)) return;

        $dueNow = $campaign->schedule_type === 'now';
        if ($campaign->schedule_type === 'later' && $campaign->date && $campaign->time) {
            $dueNow = Carbon::parse("{$campaign->date->format('Y-m-d')} {$campaign->time}", $campaign->timezone ?: config('app.timezone'))->lte(now($campaign->timezone ?: config('app.timezone')));
        }

        if (!$dueNow) {
            $campaign->update(['status' => 'scheduled']);
            return;
        }

        try {
            $count = app(CampaignDispatchService::class)->queue($campaign);
            session()->flash('success', "Campaign queued for {$count} contacts.");
        } catch (\RuntimeException $exception) {
            throw \Illuminate\Validation\ValidationException::withMessages(['campaign' => $exception->getMessage()]);
        }
    }
}
