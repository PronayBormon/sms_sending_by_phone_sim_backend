<?php

namespace App\Repository\Backend;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;

class UserRepository
{
    /**
     * Create a new class instance.
     */
    public function __construct()
    {
        //
    }


    public function find($id)
    {
        $user = User::find($id);
        return $user;
    }

    public function store(array $data)
    {
        /*
        |--------------------------------------------------------------------------
        | Upload Avatar
        |--------------------------------------------------------------------------
        */

        if (
            isset($data['avatar']) &&
            $data['avatar']
        ) {
            $file =
                $data['avatar'];

            $fileName =
                time() .
                '.' .
                $file->getClientOriginalExtension();

            $path = $file->storeAs(
                'uploads/avatar',
                $fileName,
                'public'
            );

            $data['avatar'] = 'storage/' . $path;
        }

        /*
        |--------------------------------------------------------------------------
        | Password Hash
        |--------------------------------------------------------------------------
        */

        $data['password'] =
            Hash::make(
                $data['password']
            );

        return User::create($data);
    }


    public function update(
        $id,
        array $data
    ) {
        $user = User::findOrFail($id);

        /*
        |--------------------------------------------------------------------------
        | Avatar Upload
        |--------------------------------------------------------------------------
        */

        if (
            isset($data['avatar']) &&
            $data['avatar']
        ) {

            if (
                $user->avatar &&
                Storage::exists(
                    str_replace(
                        'storage/',
                        'public/',
                        $user->avatar
                    )
                )
            ) {
                Storage::delete(
                    str_replace(
                        'storage/',
                        'public/',
                        $user->avatar
                    )
                );
            }

            $file =
                $data['avatar'];

            $fileName =
                time() .
                '.' .
                $file->getClientOriginalExtension();

            $path = $file->storeAs(
                'uploads/avatar',
                $fileName,
                'public'
            );

            $data['avatar'] = 'storage/' . $path;
        } else {
            unset($data['avatar']);
        }

        /*
        |--------------------------------------------------------------------------
        | Password
        |--------------------------------------------------------------------------
        */

        if (!empty($data['password'])) {

            $data['password'] =
                Hash::make(
                    $data['password']
                );
        } else {

            unset($data['password']);
        }

        unset(
            $data['password_confirmation']
        );

        $user->update($data);

        // dd($user);

        return $user;
    }
}
