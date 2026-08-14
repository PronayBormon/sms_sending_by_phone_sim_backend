<?php

namespace App\Http\Controllers\Web\Frontend\User;

use App\Http\Controllers\Controller;
use App\Models\Contact;
use App\Models\ContactList;
use App\Services\TeamActivityService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserContactController extends Controller
{
    public function index(Request $request)
    {
        $teamId = auth()->user()->currentTeamId();

        $query = Contact::where('team_id', $teamId);

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('phone', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('company', 'like', "%{$search}%");
            });
        }

        $contacts = $query->orderBy('created_at', 'desc')->paginate(50)->withQueryString();
        $lists = ContactList::where('team_id', $teamId)->get(['id', 'name']);

        return Inertia::render('frontend/user/contacts/index', [
            'contacts' => $contacts,
            'lists'    => $lists,
            'filters'  => $request->only('search')
        ]);
    }

    public function create()
    {
        return Inertia::render('frontend/user/contacts/create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'phone'   => 'required|string|max:20',
            'name'    => 'nullable|string|max:150',
            'email'   => 'nullable|email|max:150',
            'company' => 'nullable|string|max:150',
        ]);

        $teamId = auth()->user()->currentTeamId();
        $validated['team_id'] = $teamId;
        $contact = Contact::create($validated);

        TeamActivityService::log($teamId, 'created a contact', $contact->name ?? $contact->phone);

        return redirect()->route('contacts.index')->with('success', 'Contact created successfully.');
    }

    public function edit(Contact $contact)
    {
        if ($contact->team_id !== auth()->user()->currentTeamId()) abort(403);
        return Inertia::render('frontend/user/contacts/edit', [
            'contact' => $contact
        ]);
    }

    public function update(Request $request, Contact $contact)
    {
        $teamId = auth()->user()->currentTeamId();
        if ($contact->team_id !== $teamId) abort(403);

        $validated = $request->validate([
            'phone'   => 'required|string|max:20',
            'name'    => 'nullable|string|max:150',
            'email'   => 'nullable|email|max:150',
            'company' => 'nullable|string|max:150',
        ]);

        $contact->update($validated);

        TeamActivityService::log($teamId, 'updated a contact', $contact->name ?? $contact->phone);

        return redirect()->route('contacts.index')->with('success', 'Contact updated successfully.');
    }

    public function destroy(Contact $contact)
    {
        $teamId = auth()->user()->currentTeamId();
        if ($contact->team_id !== $teamId) abort(403);

        $name = $contact->name ?? $contact->phone;
        $contact->delete();

        TeamActivityService::log($teamId, 'deleted a contact', $name);

        return redirect()->route('contacts.index')->with('success', 'Contact deleted successfully.');
    }

    public function bulkDelete(Request $request)
    {
        $request->validate([
            'ids'   => 'required|array',
            'ids.*' => 'exists:contacts,id'
        ]);

        $teamId = auth()->user()->currentTeamId();
        $count = Contact::where('team_id', $teamId)->whereIn('id', $request->ids)->delete();

        TeamActivityService::log($teamId, "bulk deleted {$count} contacts");

        return redirect()->route('contacts.index')->with('success', 'Selected contacts deleted successfully.');
    }

    public function bulkAddToList(Request $request)
    {
        $request->validate([
            'ids'             => 'required|array',
            'ids.*'           => 'exists:contacts,id',
            'contact_list_id' => 'required|exists:contact_lists,id'
        ]);

        $teamId = auth()->user()->currentTeamId();

        $list = ContactList::where('team_id', $teamId)->findOrFail($request->contact_list_id);
        $contacts = Contact::where('team_id', $teamId)->whereIn('id', $request->ids)->get();

        foreach ($contacts as $contact) {
            $exists = $list->contacts()->where('contact_id', $contact->id)->exists();
            if (!$exists) {
                $list->contacts()->attach($contact->id);
            }
        }

        TeamActivityService::log($teamId, 'added contacts to a list', $list->name);

        return redirect()->route('contacts.index')->with('success', 'Contacts added to list successfully.');
    }

    public function import(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:csv,xlsx,xls,txt'
        ]);

        $file = $request->file('file');
        $teamId = auth()->user()->currentTeamId();

        try {
            $spreadsheet = \PhpOffice\PhpSpreadsheet\IOFactory::load($file->getRealPath());
            $worksheet = $spreadsheet->getActiveSheet();
            $rows = $worksheet->toArray();

            if (count($rows) <= 1) {
                return back()->withErrors(['file' => 'The uploaded file is empty.']);
            }

            $headers = array_map('strtolower', array_map('trim', $rows[0]));

            $nameIdx    = -1;
            $phoneIdx   = -1;
            $emailIdx   = -1;
            $companyIdx = -1;

            foreach ($headers as $idx => $header) {
                if (in_array($header, ['name', 'full name', 'first name', 'contact name'])) {
                    $nameIdx = $idx;
                } elseif (in_array($header, ['phone', 'phone number', 'mobile', 'mobile number', 'number', 'recipient'])) {
                    $phoneIdx = $idx;
                } elseif (in_array($header, ['email', 'email address', 'mail'])) {
                    $emailIdx = $idx;
                } elseif (in_array($header, ['company', 'organization', 'org'])) {
                    $companyIdx = $idx;
                }
            }

            if ($nameIdx === -1)    $nameIdx    = 0;
            if ($phoneIdx === -1)   $phoneIdx   = count($headers) > 1 ? 1 : 0;
            if ($emailIdx === -1)   $emailIdx   = count($headers) > 2 ? 2 : -1;
            if ($companyIdx === -1) $companyIdx = count($headers) > 3 ? 3 : -1;

            $contactsImported = 0;
            $skipped = 0;

            for ($i = 1; $i < count($rows); $i++) {
                $row   = $rows[$i];
                $phone = $phoneIdx !== -1 && isset($row[$phoneIdx]) ? trim($row[$phoneIdx]) : null;

                if (empty($phone)) { $skipped++; continue; }

                $exists = Contact::where('team_id', $teamId)->where('phone', $phone)->exists();
                if ($exists) { $skipped++; continue; }

                Contact::create([
                    'team_id' => $teamId,
                    'name'    => $nameIdx !== -1 && isset($row[$nameIdx]) ? trim($row[$nameIdx]) : 'Unnamed',
                    'phone'   => $phone,
                    'email'   => $emailIdx !== -1 && isset($row[$emailIdx]) ? trim($row[$emailIdx]) : null,
                    'company' => $companyIdx !== -1 && isset($row[$companyIdx]) ? trim($row[$companyIdx]) : null,
                    'tags'    => [],
                ]);
                $contactsImported++;
            }

            TeamActivityService::log($teamId, "imported {$contactsImported} contacts from file");

            return redirect()->route('contacts.index')->with('success', "Imported {$contactsImported} contacts successfully. Skipped {$skipped} duplicate/empty records.");

        } catch (\Exception $e) {
            return back()->withErrors(['file' => 'Error reading the file: ' . $e->getMessage()]);
        }
    }
}
