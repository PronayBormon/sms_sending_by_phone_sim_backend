<?php

namespace App\Http\Controllers\Web\Frontend\User;

use App\Http\Controllers\Controller;
use App\Models\Team;
use App\Services\TeamActivityService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TeamSettingsController extends Controller
{
    /**
     * Show the team settings form.
     */
    public function edit()
    {
        $team = auth()->user()->currentTeam();
        if (! $team) abort(404);

        return Inertia::render('frontend/user/settings/team', [
            'team' => $team,
        ]);
    }

    /**
     * Update the team settings.
     */
    public function update(Request $request)
    {
        $team = auth()->user()->currentTeam();
        if (! $team) abort(404);

        $validated = $request->validate([
            'team_name'   => 'required|string|max:255',
            'sender_name' => 'nullable|string|max:255',
            'from_mail'   => 'nullable|email|max:255',
            'email_footer'=> 'nullable|string|max:500',
            'logo'        => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
        ]);

        if ($request->hasFile('logo')) {
            // Delete old logo if exists
            if ($team->logo) {
                \Illuminate\Support\Facades\Storage::delete($team->logo);
            }
            $path = $request->file('logo')->store('images', 'public');
            $validated['logo'] = 'storage/' . $path;
        } else {
            // Preserve existing logo if not uploading a new one
            unset($validated['logo']);
        }

        $team->update($validated);

        TeamActivityService::log($team->id, 'updated team settings', $team->team_name);

        return back()->with('success', 'Team settings updated successfully.');
    }
}
