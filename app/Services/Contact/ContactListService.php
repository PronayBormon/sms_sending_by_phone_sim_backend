<?php

namespace App\Services\Contact;

use App\Repositories\Contact\ContactListRepository;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class ContactListService
{
    public function __construct(protected ContactListRepository $repository) {}

    public function list(int $teamId, Request $request)
    {
        return $this->repository->paginate(
            $teamId,
            (int) ($request->items ?? 10),
            $request->search
        );
    }

    public function find(int $teamId, int $listId)
    {
        $list = $this->repository->findForTeam($teamId, $listId);

        if (!$list) {
            abort(404, 'Contact list not found.');
        }

        $list->contacts = $list->contacts->map(fn($c) => $c->makeHidden('pivot'));

        return $list;
    }

    public function create(int $teamId, int $creatorId, array $data)
    {
        if ($this->repository->existsByName($teamId, $data['name'])) {
            throw ValidationException::withMessages([
                'name' => ['A list with this name already exists.'],
            ]);
        }

        return $this->repository->store([
            'team_id'     => $teamId,
            'creator_id'  => $creatorId,
            'name'        => $data['name'],
            'description' => $data['description'] ?? null,
            'color'       => $data['color'] ?? '#3b82f6',
        ]);
    }

    public function update(int $teamId, int $listId, array $data)
    {
        $list = $this->repository->findForTeam($teamId, $listId);

        if (!$list) {
            abort(404, 'Contact list not found.');
        }

        if (isset($data['name']) && $this->repository->existsByName($teamId, $data['name'], $listId)) {
            throw ValidationException::withMessages([
                'name' => ['A list with this name already exists.'],
            ]);
        }

        return $this->repository->update($list, $data);
    }

    public function delete(int $teamId, int $listId): void
    {
        $list = $this->repository->findForTeam($teamId, $listId);

        if (!$list) {
            abort(404, 'Contact list not found.');
        }

        $this->repository->delete($list);
    }
}
