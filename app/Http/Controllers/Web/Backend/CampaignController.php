<?php

namespace App\Http\Controllers\Web\Backend;

use App\Http\Controllers\Controller;
use App\Models\Campaign;
use App\Models\Team;
use App\Models\EmailTemplate;
use App\Models\Smtp;
use App\Models\ContactList;
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
                      ->orWhere('subject_line', 'like', "%{$search}%");
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
            'templates' => EmailTemplate::select('id', 'title')->get(),
            'smtps' => Smtp::select('id', 'host', 'username')->get(),
            'contactLists' => ContactList::select('id', 'name')->get(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'team_id' => ['nullable', 'exists:teams,id'],
            'template_id' => ['nullable', 'exists:email_templates,id'],
            'smtp_id' => ['nullable', 'exists:smtps,id'],
            'campaign_name' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'campaign_type' => ['required', 'string', 'in:regular,automated,ab_test'],
            'tags' => ['nullable', 'string'],
            'recipients_list_ids' => ['nullable', 'integer'], // Assuming single list for now based on UI
            'from_name' => ['nullable', 'string', 'max:255'],
            'from_email' => ['nullable', 'email', 'max:255'],
            'reply_email' => ['nullable', 'email', 'max:255'],
            'subject_line' => ['nullable', 'string', 'max:255'],
            'preview_text' => ['nullable', 'string', 'max:255'],
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

        Campaign::create($validated);

        return back()->with('success', 'Campaign created successfully');
    }

    public function show($id)
    {
        $campaign = Campaign::with(['team', 'template', 'smtp'])->findOrFail($id);
        
        // Load contact list manually since it's stored as ID in this simple example
        if ($campaign->recipients_list_ids) {
            $campaign->recipients_list = ContactList::find($campaign->recipients_list_ids);
        }

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
            'templates' => EmailTemplate::select('id', 'title')->get(),
            'smtps' => Smtp::select('id', 'host', 'username')->get(),
            'contactLists' => ContactList::select('id', 'name')->get(),
        ]);
    }

    public function update(Request $request, $id)
    {
        $campaign = Campaign::findOrFail($id);

        $validated = $request->validate([
            'team_id' => ['nullable', 'exists:teams,id'],
            'template_id' => ['nullable', 'exists:email_templates,id'],
            'smtp_id' => ['nullable', 'exists:smtps,id'],
            'campaign_name' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'campaign_type' => ['required', 'string', 'in:regular,automated,ab_test'],
            'tags' => ['nullable', 'string'],
            'recipients_list_ids' => ['nullable', 'integer'],
            'from_name' => ['nullable', 'string', 'max:255'],
            'from_email' => ['nullable', 'email', 'max:255'],
            'reply_email' => ['nullable', 'email', 'max:255'],
            'subject_line' => ['nullable', 'string', 'max:255'],
            'preview_text' => ['nullable', 'string', 'max:255'],
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

        return back()->with('success', 'Campaign updated successfully');
    }

    public function destroy($id)
    {
        $campaign = Campaign::findOrFail($id);
        $campaign->delete();

        return back()->with('success', 'Campaign deleted successfully');
    }
}
