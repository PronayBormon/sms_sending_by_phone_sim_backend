<?php

namespace App\Http\Controllers\Web\Frontend\User;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\TeamMember;
use App\Models\TeamInvite;
use App\Models\TeamActivityLog;
use Illuminate\Support\Facades\Mail;
use App\Mail\TeamInvitationMailable;
use Illuminate\Support\Str;

class UserTeamController extends Controller
{
    public function index()
    {
        $teamId = auth()->user()->currentTeamId();
        
        $members = TeamMember::with('user:id,first_name,last_name,email,avatar')
            ->where('team_id', $teamId)
            ->where('status', 'active')
            ->get()
            ->map(function($m) {
                return [
                    'id' => $m->id,
                    'user' => $m->user,
                    'invited_email' => null,
                    'role' => $m->role,
                    'status' => 'active',
                    'last_active_at' => $m->last_active_at ? $m->last_active_at->toIso8601String() : null,
                    'is_invite' => false,
                ];
            });

        $pendingInvites = TeamInvite::where('team_id', $teamId)
            ->where('status', 'pending')
            ->get()
            ->map(function($invite) {
                return [
                    'id' => $invite->id,
                    'user' => null,
                    'invited_email' => $invite->email,
                    'role' => $invite->role,
                    'status' => 'invited', // maps to existing frontend invited UI
                    'last_active_at' => null,
                    'is_invite' => true,
                ];
            });

        $activityLogs = TeamActivityLog::with('user:id,first_name,last_name')
            ->where('team_id', $teamId)
            ->orderBy('created_at', 'desc')
            ->take(10)
            ->get();

        return Inertia::render('frontend/user/team/index', [
            'members' => $members->concat($pendingInvites),
            'activityLogs' => $activityLogs,
        ]);
    }

    public function invite(Request $request)
    {
        $request->validate([
            'email' => 'required|email|max:150',
            'role' => 'required|in:owner,admin,editor,viewer',
        ]);

        $teamId = auth()->user()->currentTeamId();
        
        // Check if already a member in team_members
        $isMember = TeamMember::where('team_id', $teamId)
            ->whereHas('user', function($q) use ($request) {
                $q->where('email', $request->email);
            })->exists();

        if ($isMember) {
            return back()->withErrors(['email' => 'User is already a member of this team.']);
        }

        // Check if already has a pending invite in team_invites
        $isInvited = TeamInvite::where('team_id', $teamId)
            ->where('email', $request->email)
            ->where('status', 'pending')
            ->exists();

        if ($isInvited) {
            return back()->withErrors(['email' => 'User already has a pending invitation.']);
        }

        $invite = TeamInvite::create([
            'team_id' => $teamId,
            'email' => $request->email,
            'role' => $request->role,
            'token' => Str::random(40),
            'status' => 'pending',
            'created_by' => auth()->id(),
        ]);

        $inviteUrl = url('/team/accept/' . $invite->token);

        Mail::to($request->email)->send(new TeamInvitationMailable(auth()->user(), $inviteUrl));

        return back()->with('success', 'Invitation sent successfully.');
    }

    public function updateRole(Request $request, $id)
    {
        $request->validate(['role' => 'required|in:owner,admin,editor,viewer']);
        $teamId = auth()->user()->currentTeamId();
        
        if ($request->get('is_invite')) {
            $invite = TeamInvite::where('team_id', $teamId)->findOrFail($id);
            $invite->update(['role' => $request->role]);
        } else {
            $member = TeamMember::where('team_id', $teamId)->findOrFail($id);
            $member->update(['role' => $request->role]);
        }

        return back()->with('success', 'Role updated successfully.');
    }

    public function removeMember(Request $request, $id)
    {
        $teamId = auth()->user()->currentTeamId();
        
        if ($request->get('is_invite')) {
            $invite = TeamInvite::where('team_id', $teamId)->findOrFail($id);
            $invite->delete();
            return back()->with('success', 'Invitation cancelled successfully.');
        } else {
            $member = TeamMember::where('team_id', $teamId)->findOrFail($id);
            $member->delete();
        }

        return back()->with('success', 'Member removed successfully.');
    }
}
