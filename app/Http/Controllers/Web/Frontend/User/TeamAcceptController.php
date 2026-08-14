<?php

namespace App\Http\Controllers\Web\Frontend\User;

use App\Http\Controllers\Controller;
use App\Models\TeamInvite;
use App\Models\TeamMember;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class TeamAcceptController extends Controller
{
    public function accept($token)
    {
        $invite = TeamInvite::with('team')->where('token', $token)->first();

        if (!$invite || $invite->status !== 'pending') {
            return redirect('/user/dashboard')->with('error', 'This invitation is invalid or has already been processed.');
        }

        // If user is not logged in, redirect to login with the redirect path back to here
        if (!auth()->check()) {
            return redirect('/login?redirect=' . urlencode('/team/accept/' . $token));
        }

        $user = auth()->user();

        // Enforce: user can only be in 1 team
        $existingMembership = TeamMember::where('user_id', $user->id)
            ->where('status', 'active')
            ->first();

        if ($existingMembership) {
            return redirect('/user/dashboard')->with('error', 'You are already a member of a team. You must leave your current team before joining another.');
        }

        return Inertia::render('frontend/user/team/accept', [
            'invite' => [
                'token' => $invite->token,
                'team_name' => $invite->team->name ?? 'Team',
                'role' => $invite->role,
                'email' => $invite->email,
            ]
        ]);
    }

    public function confirm($token)
    {
        $invite = TeamInvite::where('token', $token)->where('status', 'pending')->firstOrFail();
        $user = auth()->user();

        // Enforce: user can only be in 1 team
        $existingMembership = TeamMember::where('user_id', $user->id)
            ->where('status', 'active')
            ->first();

        if ($existingMembership) {
            return redirect('/user/dashboard')->with('error', 'You are already a member of a team. You must leave your current team before joining another.');
        }

        // Accept the invitation: update invite status and create TeamMember row
        DB::transaction(function() use ($invite, $user) {
            $invite->update(['status' => 'accepted']);
            
            TeamMember::create([
                'team_id' => $invite->team_id,
                'user_id' => $user->id,
                'role' => $invite->role,
                'status' => 'active',
                'last_active_at' => now(),
            ]);
        });

        return redirect('/user/dashboard')->with('success', 'You have successfully joined the team!');
    }

    public function decline($token)
    {
        $invite = TeamInvite::where('token', $token)->where('status', 'pending')->firstOrFail();
        
        $invite->update(['status' => 'rejected']);

        return redirect('/user/dashboard')->with('success', 'Invitation declined.');
    }
}
