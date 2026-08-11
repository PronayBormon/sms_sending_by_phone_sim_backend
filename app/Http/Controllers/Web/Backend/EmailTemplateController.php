<?php

namespace App\Http\Controllers\Web\Backend;

use App\Http\Controllers\Controller;
use App\Models\EmailTemplate;
use App\Models\Team;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class EmailTemplateController extends Controller
{
    public function index(Request $request)
    {
        $emailTemplates = EmailTemplate::query()
            ->with(['team', 'creator'])
            ->when($request->search, function ($query, $search) {
                $query->where('title', 'like', "%{$search}%");
            })
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('backend/email-templates/index', [
            'emailTemplates' => $emailTemplates,
            'filters' => $request->only(['search']),
        ]);
    }

    public function create()
    {
        return Inertia::render('backend/email-templates/create', [
            'teams' => Team::select('id', 'team_name')->get(),
            'users' => User::select('id', 'first_name', 'last_name', 'email')->get(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'team_id' => ['nullable', 'exists:teams,id'],
            'creator_id' => ['nullable', 'exists:users,id'],
            'template_type' => ['required', 'in:private,public'],
            'title' => ['nullable', 'string', 'max:255'],
            'sub_title' => ['nullable', 'string', 'max:255'],
            'template' => ['nullable', 'string'],
            'design' => ['nullable', 'string'],
        ]);

        EmailTemplate::create($validated);

        return back()->with('success', 'Email Template created successfully');
    }

    public function show($id)
    {
        $emailTemplate = EmailTemplate::with(['team', 'creator'])->findOrFail($id);
        return Inertia::render('backend/email-templates/show', [
            'emailTemplate' => $emailTemplate
        ]);
    }

    public function edit($id)
    {
        $emailTemplate = EmailTemplate::findOrFail($id);

        return Inertia::render('backend/email-templates/edit', [
            'emailTemplate' => $emailTemplate,
            'teams' => Team::select('id', 'team_name')->get(),
            'users' => User::select('id', 'first_name', 'last_name', 'email')->get(),
        ]);
    }

    public function update(Request $request, $id)
    {
        $emailTemplate = EmailTemplate::findOrFail($id);

        $validated = $request->validate([
            'team_id' => ['nullable', 'exists:teams,id'],
            'creator_id' => ['nullable', 'exists:users,id'],
            'template_type' => ['required', 'in:private,public'],
            'title' => ['nullable', 'string', 'max:255'],
            'sub_title' => ['nullable', 'string', 'max:255'],
            'template' => ['nullable', 'string'],
            'design' => ['nullable'],
        ]);

        // Decode design JSON string if needed (model casts to array)
        if (isset($validated['design']) && is_string($validated['design'])) {
            $decoded = json_decode($validated['design'], true);
            $validated['design'] = $decoded ?? $validated['design'];
        }

        $emailTemplate->update($validated);

        return back()->with('success', 'Email Template updated successfully');
    }

    public function destroy($id)
    {
        $emailTemplate = EmailTemplate::findOrFail($id);
        $emailTemplate->delete();

        return back()->with('success', 'Email Template deleted successfully');
    }
}
