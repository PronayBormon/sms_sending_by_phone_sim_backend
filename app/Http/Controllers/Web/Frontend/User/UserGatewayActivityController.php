<?php

namespace App\Http\Controllers\Web\Frontend\User;

use App\Http\Controllers\Controller;
use App\Models\SmsLog;
use Inertia\Inertia;

class UserGatewayActivityController extends Controller
{
    public function index()
    {
        $teamId = auth()->user()->currentTeamId();
        $logs = SmsLog::with(['campaign:id,title', 'device:id,name'])
            ->where('team_id', $teamId)
            ->orderBy('created_at', 'desc')
            ->paginate(50)
            ->withQueryString();

        return Inertia::render('frontend/user/gateway-activity/index', [
            'smsLogs' => $logs,
        ]);
    }
}
