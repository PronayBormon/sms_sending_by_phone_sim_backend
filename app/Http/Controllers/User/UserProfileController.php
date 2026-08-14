<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Http\Requests\User\ProfileUpdateRequest;
use App\Http\Requests\User\SecurityUpdateRequest;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;

class UserProfileController extends Controller
{
    /**
     * Show the user profile edit page.
     */
    public function edit(): InertiaResponse
    {
        $user = auth()->user();
        return Inertia::render('frontend/user/profile', [
            'user' => $user->only(['id', 'name', 'email', 'avatar']),
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $user = auth()->user();
        $data = $request->validated();
        if ($request->hasFile('avatar')) {
            $path = $request->file('avatar')->store('avatars', 'public');
            $data['avatar'] = $path;
        }
        $user->update($data);
        return redirect()->back()->with('success', 'Profile updated successfully.');
    }

    /**
     * Update the user's password.
     */
    public function updatePassword(SecurityUpdateRequest $request): RedirectResponse
    {
        $user = auth()->user();
        $user->update(['password' => bcrypt($request->input('password'))]);
        return redirect()->back()->with('success', 'Password updated successfully.');
    }
}
?>
