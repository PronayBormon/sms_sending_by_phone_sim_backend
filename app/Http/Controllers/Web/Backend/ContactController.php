<?php

namespace App\Http\Controllers\Web\Backend;

use App\Http\Controllers\Controller;
use App\Models\Contact;
use App\Models\Team;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ContactController extends Controller
{
    public function index(Request $request)
    {
        $contacts = Contact::query()
            ->with(['team'])
            ->when($request->search, function ($query, $search) {
                $query->where('name', 'like', "%{$search}%")
                      ->orWhere('email', 'like', "%{$search}%");
            })
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('backend/contacts/index', [
            'contacts' => $contacts,
            'filters' => $request->only(['search']),
        ]);
    }

    public function create()
    {
        $teams = Team::select('id', 'team_name')->get();
        return Inertia::render('backend/contacts/create', [
            'teams' => $teams
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'team_id' => ['nullable', 'exists:teams,id'],
            'name' => ['nullable', 'string', 'max:255'],
            'email' => ['nullable', 'email', 'max:255'],
            'phone' => ['nullable', 'string', 'max:255'],
            'company' => ['nullable', 'string', 'max:255'],
            'tags' => ['nullable', 'array'],
        ]);

        Contact::create($validated);

        return back()->with('success', 'Contact created successfully');
    }

    public function show($id)
    {
        $contact = Contact::with(['team'])->findOrFail($id);

        return Inertia::render('backend/contacts/show', [
            'contact' => $contact
        ]);
    }

    public function edit($id)
    {
        $contact = Contact::findOrFail($id);
        $teams = Team::select('id', 'team_name')->get();

        return Inertia::render('backend/contacts/edit', [
            'contact' => $contact,
            'teams' => $teams
        ]);
    }

    public function update(Request $request, $id)
    {
        $contact = Contact::findOrFail($id);

        $validated = $request->validate([
            'team_id' => ['nullable', 'exists:teams,id'],
            'name' => ['nullable', 'string', 'max:255'],
            'email' => ['nullable', 'email', 'max:255'],
            'phone' => ['nullable', 'string', 'max:255'],
            'company' => ['nullable', 'string', 'max:255'],
            'tags' => ['nullable', 'array'],
        ]);

        $contact->update($validated);

        return back()->with('success', 'Contact updated successfully');
    }

    public function destroy($id)
    {
        $contact = Contact::findOrFail($id);
        $contact->delete();

        return back()->with('success', 'Contact deleted successfully');
    }
}
