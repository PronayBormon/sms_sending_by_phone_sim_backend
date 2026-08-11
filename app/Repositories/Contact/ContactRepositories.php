<?php

namespace App\Repositories\Contact;

use App\Models\Contact;
use App\Models\ContactList;
use Illuminate\Database\Eloquent\Collection;

class ContactRepositories
{
    /**
     * Create a new class instance.
     */
    public function query($teamId)
    {
        return Contact::with('lists')->where('team_id', $teamId);
    }
    public function store(array $data)
    {
        return Contact::create($data);
    }

    public function existsByEmail(int $teamId, string $email): bool
    {
        return Contact::where('team_id', $teamId)
            ->where('email', $email)
            ->exists();
    }

    public function findForTeam(int $teamId, int $contactId): ?Contact
    {
        return $this->query($teamId)->find($contactId);
    }

    public function findManyForTeam(int $teamId, array $contactIds): Collection
    {
        return $this->query($teamId)
            ->whereIn('id', $contactIds)
            ->get();
    }

    public function findListForTeam(int $teamId, int $listId): ?ContactList
    {
        return ContactList::where('team_id', $teamId)->find($listId);
    }

    public function update(Contact $contact, array $data): Contact
    {
        $contact->update($data);

        return $contact->fresh('lists');
    }

    public function delete(Contact $contact): bool
    {
        return (bool) $contact->delete();
    }

    public function deleteManyForTeam(int $teamId, array $contactIds): int
    {
        return Contact::where('team_id', $teamId)
            ->whereIn('id', $contactIds)
            ->delete();
    }

    public function contactsForExport(int $teamId): Collection
    {
        return Contact::where('team_id', $teamId)->orderBy('id')->get();
    }
}
