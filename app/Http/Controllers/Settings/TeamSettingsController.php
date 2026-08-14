<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Http\Requests\Settings\TeamProfileUpdateRequest;
use App\Models\Team;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;

class TeamSettingsController extends Controller
{
    /**
     * Show the team settings page.
     */
    public function edit(): Response
    {
        $team = auth()->user()->currentTeam();
        return Inertia::render('team/settings', [
            'team' => $team->only(['id', 'name', 'logo', 'sender_name', 'from_email', 'email_footer']),
        ]);
    }

    /**
     * Update the team profile.
     */
    public function update(TeamProfileUpdateRequest $request): RedirectResponse
    {
        $team = auth()->user()->currentTeam();
        $team->update($request->validated());
        // Handle logo upload if present
        if ($request->hasFile('logo')) {
            $path = $request->file('logo')->store('team-logos', 'public');
            $team->update(['logo' => $path]);
        }
        Inertia::flash('toast', ['type' => 'success', 'message' => __('Team settings updated.')]);
        return redirect()->back();
    }
}
