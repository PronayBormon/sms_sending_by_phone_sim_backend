<?php

namespace App\Http\Controllers\Web\Backend;

use App\Http\Controllers\Controller;
use App\Models\Contact;
use App\Models\ContactList;
use App\Models\Team;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ContactListController extends Controller
{
    public function index(Request $request)
    {
        $contactLists = ContactList::query()
            ->with(['team', 'creator'])
            ->when($request->search, function ($query, $search) {
                $query->where('name', 'like', "%{$search}%");
            })
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('backend/contact-lists/index', [
            'contactLists' => $contactLists,
            'filters' => $request->only(['search']),
        ]);
    }

    public function create()
    {
        return Inertia::render('backend/contact-lists/create', [
            'teams' => Team::select('id', 'team_name')->get(),
            'users' => User::select('id', 'first_name', 'last_name', 'email')->get(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'team_id' => ['nullable', 'exists:teams,id'],
            'creator_id' => ['nullable', 'exists:users,id'],
            'name' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'color' => ['nullable', 'string', 'max:50'],
        ]);

        ContactList::create($validated);

        return back()->with('success', 'Contact List created successfully');
    }

    public function show($id)
    {
        $contactList = ContactList::with(['team', 'creator', 'contacts'])->findOrFail($id);

        return Inertia::render('backend/contact-lists/show', [
            'contactList' => $contactList,
            'contacts' => $contactList->contacts->map(fn($c) => [
                'id' => $c->id,
                'name' => $c->name,
                'email' => $c->email,
            ]),
        ]);
    }

    public function edit($id)
    {
        $contactList = ContactList::with(['contacts'])->findOrFail($id);

        return Inertia::render('backend/contact-lists/edit', [
            'contactList' => $contactList,
            'contacts' => $contactList->contacts->map(fn($c) => [
                'id' => $c->id,
                'name' => $c->name,
                'email' => $c->email,
            ]),
            'teams' => Team::select('id', 'team_name')->get(),
            'users' => User::select('id', 'first_name', 'last_name', 'email')->get(),
        ]);
    }

    public function update(Request $request, $id)
    {
        $contactList = ContactList::findOrFail($id);

        $validated = $request->validate([
            'team_id' => ['nullable', 'exists:teams,id'],
            'creator_id' => ['nullable', 'exists:users,id'],
            'name' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'color' => ['nullable', 'string', 'max:50'],
        ]);

        $contactList->update($validated);

        return back()->with('success', 'Contact List updated successfully');
    }

    public function destroy($id)
    {
        $contactList = ContactList::findOrFail($id);
        $contactList->delete();

        return back()->with('success', 'Contact List deleted successfully');
    }

    /**
     * Return contacts NOT already in the list, filtered by search query.
     * Used by Select2 AJAX in the bulk-add modal.
     */
    public function availableContacts(Request $request, $id)
    {
        $contactList = ContactList::findOrFail($id);

        $existingIds = $contactList->contacts()->pluck('contacts.id');

        $contacts = Contact::query()
            ->whereNotIn('id', $existingIds)
            ->when($request->team_id, function ($query, $teamId) {
                $query->where('team_id', $teamId);
            })
            ->when($request->q, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                      ->orWhere('email', 'like', "%{$search}%");
                });
            })
            ->select('id', 'name', 'email')
            ->paginate($request->get('per_page', 20));

        return response()->json($contacts);
    }

    /**
     * Bulk-attach contacts to the list.
     */
    public function addContacts(Request $request, $id)
    {
        $contactList = ContactList::findOrFail($id);

        $validated = $request->validate([
            'contact_ids'   => ['required', 'array', 'min:1'],
            'contact_ids.*' => ['integer', 'exists:contacts,id'],
        ]);

        $contactList->contacts()->syncWithoutDetaching($validated['contact_ids']);

        return back()->with('success', count($validated['contact_ids']) . ' contact(s) added to the list successfully.');
    }

    /**
     * Bulk-remove contacts from the list.
     */
    public function removeContacts(Request $request, $id)
    {
        $contactList = ContactList::findOrFail($id);

        $validated = $request->validate([
            'contact_ids'   => ['required', 'array', 'min:1'],
            'contact_ids.*' => ['integer', 'exists:contacts,id'],
        ]);

        $contactList->contacts()->detach($validated['contact_ids']);

        return back()->with('success', count($validated['contact_ids']) . ' contact(s) removed from the list successfully.');
    }
}
