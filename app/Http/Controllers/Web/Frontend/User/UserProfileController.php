<?php

namespace App\Http\Controllers\Web\Frontend\User;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Inertia\Inertia;


class UserProfileController extends Controller
{
    public function edit()
    {
        $user = auth()->user();
        return Inertia::render('frontend/user/profile/index', [
            'user' => $user->only(['id', 'first_name', 'last_name', 'email', 'avatar']),
        ]);
    }

    public function update(Request $request)
    {
        // dd($request->all()); // removed debug
        $user = auth()->user();

        $validated = $request->validate([
            'first_name' => ['required', 'string', 'max:100'],
            'last_name' => ['nullable', 'string', 'max:100'],
            'email' => [
                'required',
                'email',
                'max:255',
                Rule::unique('users', 'email')->ignore($user->id),
            ],
            'avatar' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
        ]);

        if ($request->hasFile('avatar')) {
            // Delete old avatar
            if ($user->avatar && Storage::disk('public')->exists($user->avatar)) {
                Storage::disk('public')->delete($user->avatar);
            }

            // Store new avatar
            $validated['avatar'] = "storage/" . $request->file('avatar')
                ->store('avatars', 'public');
        }

        $user->update($validated);

        return redirect()
            ->to('/user/profile')
            ->with('success', 'Profile updated successfully.');
    }

    public function updatepassword(Request $request)
    {
        $user = auth()->user();

        $validated = $request->validate([
            'current_password' => ['required', 'current_password'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ]);

        $user->update([
            'password' => Hash::make($validated['password']),
        ]);

        return back()->with('success', 'Password updated successfully.');
    }
}
