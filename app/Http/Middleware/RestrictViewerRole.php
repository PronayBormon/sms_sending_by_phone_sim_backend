<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use App\Models\TeamMember;

class RestrictViewerRole
{
    /**
     * Block viewer-role members from any mutating action.
     * Only read (GET / HEAD) requests are allowed.
     */
    public function handle(Request $request, Closure $next)
    {
        // Allow safe HTTP verbs unconditionally
        if ($request->isMethod('GET') || $request->isMethod('HEAD')) {
            return $next($request);
        }

        $user = auth()->user();
        if (!$user) {
            return $next($request);
        }

        $teamId = $user->currentTeamId();
        if (!$teamId) {
            return $next($request);
        }

        $member = TeamMember::where('team_id', $teamId)
            ->where('user_id', $user->id)
            ->first();

        if ($member && $member->role === 'viewer') {
            if ($request->expectsJson() || $request->wantsJson()) {
                return response()->json([
                    'message' => 'Viewers are not allowed to make changes.',
                ], 403);
            }

            return back()->withErrors(['permission' => 'Viewers are not allowed to make changes.']);
        }

        return $next($request);
    }
}
