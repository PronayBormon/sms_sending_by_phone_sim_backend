<?php

namespace App\Http\Controllers\Web\Frontend\User;

use App\Http\Controllers\Controller;
use App\Models\MessageTemplate;
use App\Services\TeamActivityService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserTemplateController extends Controller
{
    public function index()
    {
        $teamId = auth()->user()->currentTeamId();
        $templates = MessageTemplate::where('team_id', $teamId)
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return Inertia::render('frontend/user/templates/index', ['templates' => $templates]);
    }

    public function create()
    {
        return Inertia::render('frontend/user/templates/create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title'         => 'required|string|max:200',
            'sub_title'     => 'nullable|string|max:200',
            'message'       => 'required|string',
            'template_type' => 'required|in:private,public',
            'variables'     => 'nullable|array',
            'is_active'     => 'boolean',
        ]);

        $teamId = auth()->user()->currentTeamId();
        $validated['team_id']    = $teamId;
        $validated['creator_id'] = auth()->id();
        $template = MessageTemplate::create($validated);

        TeamActivityService::log($teamId, 'created a template', $template->title);

        return redirect()->route('templates.index')->with('success', 'Template created successfully.');
    }

    public function edit(MessageTemplate $template)
    {
        if ($template->team_id !== auth()->user()->currentTeamId()) abort(403);
        return Inertia::render('frontend/user/templates/edit', ['template' => $template]);
    }

    public function update(Request $request, MessageTemplate $template)
    {
        $teamId = auth()->user()->currentTeamId();
        if ($template->team_id !== $teamId) abort(403);

        $validated = $request->validate([
            'title'         => 'required|string|max:200',
            'sub_title'     => 'nullable|string|max:200',
            'message'       => 'required|string',
            'template_type' => 'required|in:private,public',
            'variables'     => 'nullable|array',
            'is_active'     => 'boolean',
        ]);

        $template->update($validated);

        TeamActivityService::log($teamId, 'updated a template', $template->title);

        return redirect()->route('templates.index')->with('success', 'Template updated successfully.');
    }

    public function destroy(MessageTemplate $template)
    {
        $teamId = auth()->user()->currentTeamId();
        if ($template->team_id !== $teamId) abort(403);

        $title = $template->title;
        $template->delete();

        TeamActivityService::log($teamId, 'deleted a template', $title);

        return redirect()->route('templates.index')->with('success', 'Template deleted successfully.');
    }
}
