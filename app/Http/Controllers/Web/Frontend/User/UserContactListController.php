<?php

namespace App\Http\Controllers\Web\Frontend\User;

use App\Http\Controllers\Controller;
use App\Models\Contact;
use App\Models\ContactList;
use App\Services\TeamActivityService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserContactListController extends Controller
{
    public function index()
    {
        $teamId = auth()->user()->currentTeamId();
        $lists = ContactList::where('team_id', $teamId)->withCount('contacts')->orderBy('created_at', 'desc')->paginate(12);
        return Inertia::render('frontend/user/lists/index', ['lists' => $lists]);
    }

    public function show($id)
    {
        $teamId = auth()->user()->currentTeamId();
        $list = ContactList::where('team_id', $teamId)->withCount('contacts')->findOrFail($id);
        $contacts = $list->contacts()->orderBy('created_at', 'desc')->paginate(50);

        $inListIds = $list->contacts()->pluck('contacts.id')->toArray();
        $availableContacts = Contact::where('team_id', $teamId)
            ->whereNotIn('id', $inListIds)
            ->orderBy('name')
            ->get(['id', 'name', 'phone', 'email']);

        return Inertia::render('frontend/user/lists/show', [
            'list'              => $list,
            'contacts'          => $contacts,
            'availableContacts' => $availableContacts,
        ]);
    }

    public function create()
    {
        return Inertia::render('frontend/user/lists/create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'   => 'required|string|max:100',
            'status' => 'required|in:active,inactive',
        ]);

        $teamId = auth()->user()->currentTeamId();
        $validated['team_id'] = $teamId;
        $validated['user_id'] = auth()->id();
        $list = ContactList::create($validated);

        TeamActivityService::log($teamId, 'created a contact list', $list->name);

        return redirect()->route('lists.index')->with('success', 'List created successfully.');
    }

    public function edit(ContactList $list)
    {
        if ($list->team_id !== auth()->user()->currentTeamId()) abort(403);
        return Inertia::render('frontend/user/lists/edit', ['list' => $list]);
    }

    public function update(Request $request, ContactList $list)
    {
        $teamId = auth()->user()->currentTeamId();
        if ($list->team_id !== $teamId) abort(403);

        $validated = $request->validate([
            'name'   => 'required|string|max:100',
            'status' => 'required|in:active,inactive',
        ]);

        $list->update($validated);

        TeamActivityService::log($teamId, 'updated a contact list', $list->name);

        return redirect()->route('lists.index')->with('success', 'List updated successfully.');
    }

    public function destroy(ContactList $list)
    {
        $teamId = auth()->user()->currentTeamId();
        if ($list->team_id !== $teamId) abort(403);

        $name = $list->name;
        $list->delete();

        TeamActivityService::log($teamId, 'deleted a contact list', $name);

        return redirect()->route('lists.index')->with('success', 'List deleted successfully.');
    }

    public function removeContact(Request $request, $id)
    {
        $teamId = auth()->user()->currentTeamId();
        $list = ContactList::where('team_id', $teamId)->findOrFail($id);

        $validated = $request->validate(['contact_id' => 'required|exists:contacts,id']);

        $list->contacts()->detach($validated['contact_id']);

        TeamActivityService::log($teamId, 'removed a contact from list', $list->name);

        return back()->with('success', 'Contact removed from list successfully.');
    }

    public function bulkRemoveContacts(Request $request, $id)
    {
        $teamId = auth()->user()->currentTeamId();
        $list = ContactList::where('team_id', $teamId)->findOrFail($id);

        $validated = $request->validate([
            'ids'   => 'required|array',
            'ids.*' => 'exists:contacts,id',
        ]);

        $list->contacts()->detach($validated['ids']);

        TeamActivityService::log($teamId, 'bulk removed contacts from list', $list->name);

        return back()->with('success', count($validated['ids']) . ' contacts removed from the list.');
    }

    public function addContacts(Request $request, $id)
    {
        $teamId = auth()->user()->currentTeamId();
        $list = ContactList::where('team_id', $teamId)->findOrFail($id);

        $validated = $request->validate([
            'ids'   => 'required|array',
            'ids.*' => 'exists:contacts,id',
        ]);

        $validIds = Contact::where('team_id', $teamId)->whereIn('id', $validated['ids'])->pluck('id');

        foreach ($validIds as $contactId) {
            $list->contacts()->syncWithoutDetaching([$contactId]);
        }

        TeamActivityService::log($teamId, 'added contacts to list', $list->name);

        return back()->with('success', count($validIds) . ' contacts added to the list.');
    }
}
