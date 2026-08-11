<?php

namespace App\Services\Backend;

use App\Models\User;
use App\Repository\Backend\UserRepository;

class UserService
{
    protected $repo;
    /**
     * Create a new class instance.
     */
    public function __construct(
        UserRepository $repo
    ) {
        $this->repo = $repo;
    }

    public function store($validated)
    {
        return $this->repo->store(
            $validated
        );
    }

    public function update(
        $id,
        $validated
    ) {
        // dd($validated);
        return $this->repo->update(
            $id,
            $validated
        );
    }
}
