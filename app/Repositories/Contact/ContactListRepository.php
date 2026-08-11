<?php

namespace App\Repositories\Contact;

use App\Models\ContactList;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

class ContactListRepository
{
    public function query(int $teamId)
    {
        return ContactList::where('team_id', $teamId)
            ->with('creator:id,name,email', 'contacts');
    }

    public function paginate(int $teamId, int $perPage = 10, ?string $search = null): LengthAwarePaginator
    {
        $query = $this->query($teamId);

        if ($search) {
            $query->where('name', 'like', "%{$search}%");
        }

        return $query->latest()->paginate($perPage);
    }

    public function findForTeam(int $teamId, int $listId): ?ContactList
    {
        return ContactList::where('team_id', $teamId)
            ->with('creator:id,name,email', 'contacts')
            ->find($listId);
    }

    public function store(array $data): ContactList
    {
        return ContactList::create($data);
    }

    public function update(ContactList $list, array $data): ContactList
    {
        $list->update($data);

        return $list->fresh(['creator:id,name,email', 'contacts']);
    }

    public function delete(ContactList $list): bool
    {
        return (bool) $list->delete();
    }

    public function existsByName(int $teamId, string $name, ?int $excludeId = null): bool
    {
        return ContactList::where('team_id', $teamId)
            ->where('name', $name)
            ->when($excludeId, fn($q) => $q->where('id', '!=', $excludeId))
            ->exists();
    }
}
