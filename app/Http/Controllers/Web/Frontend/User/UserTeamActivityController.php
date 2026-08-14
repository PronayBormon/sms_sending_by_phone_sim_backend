<?php

namespace App\Http\Controllers\Web\Frontend\User;

use App\Http\Controllers\Controller;
use App\Models\TeamActivityLog;
use Inertia\Inertia;

class UserTeamActivityController extends Controller
{
    public function index()
    {
        $teamId = auth()->user()->currentTeamId();
        $logs = TeamActivityLog::where('team_id', $teamId)
            ->orderBy('created_at', 'desc')
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('frontend/user/team-activity/index', [
            'activityLogs' => $logs,
        ]);
    }
}
