<?php

namespace App\Http\Controllers\Web\Backend;

use App\Http\Controllers\Controller;
use App\Models\MessageTemplate;
use App\Models\Team;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MessageTemplateController extends Controller
{
    public function index(Request $request)
    {
        return Inertia::render('backend/message-templates/index', [
            'messageTemplates' => MessageTemplate::with(['team', 'creator'])
                ->when($request->search, fn ($query, $search) => $query->where('title', 'like', "%{$search}%"))
                ->latest()->paginate(10)->withQueryString(),
            'filters' => $request->only('search'),
        ]);
    }

    public function create()
    {
        return Inertia::render('backend/message-templates/create', $this->formOptions());
    }

    public function store(Request $request)
    {
        MessageTemplate::create($this->validated($request));
        return redirect()->route('message-templates.index')->with('success', 'Message template created successfully.');
    }

    public function show(MessageTemplate $messageTemplate)
    {
        return Inertia::render('backend/message-templates/show', [
            'messageTemplate' => $messageTemplate->load(['team', 'creator']),
        ]);
    }

    public function edit(MessageTemplate $messageTemplate)
    {
        return Inertia::render('backend/message-templates/edit', array_merge([
            'messageTemplate' => $messageTemplate,
        ], $this->formOptions()));
    }

    public function update(Request $request, MessageTemplate $messageTemplate)
    {
        $messageTemplate->update($this->validated($request));
        return redirect()->route('message-templates.show', $messageTemplate)->with('success', 'Message template updated successfully.');
    }

    public function destroy(MessageTemplate $messageTemplate)
    {
        $messageTemplate->delete();
        return redirect()->route('message-templates.index')->with('success', 'Message template deleted successfully.');
    }

    private function formOptions(): array
    {
        return [
            'teams' => Team::select('id', 'team_name')->get(),
            'users' => User::select('id', 'first_name', 'last_name')->get(),
        ];
    }

    private function validated(Request $request): array
    {
        $data = $request->validate([
            'team_id' => ['nullable', 'exists:teams,id'],
            'creator_id' => ['nullable', 'exists:users,id'],
            'template_type' => ['required', 'in:private,public'],
            'title' => ['required', 'string', 'max:255'],
            'sub_title' => ['nullable', 'string', 'max:255'],
            'message' => ['required', 'string', 'max:1600'],
            'variables' => ['nullable', 'array'],
            'variables.*' => ['string', 'max:100'],
            'is_active' => ['boolean'],
        ]);
        $data['is_active'] = $request->boolean('is_active');
        return $data;
    }
}
