<?php

namespace App\Http\Controllers\Web\Frontend\User;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserDashboardController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        $teamId = $user->currentTeamId();

        $invitations = \App\Models\TeamInvite::with('team', 'creator')
            ->where('email', $user->email)
            ->where('status', 'pending')
            ->get();

        $totalSent = \App\Models\SmsLog::where('team_id', $teamId)
            ->whereIn('status', ['sent', 'delivered'])
            ->count();
            
        $totalDelivered = \App\Models\SmsLog::where('team_id', $teamId)
            ->where('status', 'delivered')
            ->count();
            
        $deliveryRate = $totalSent > 0 ? round(($totalDelivered / $totalSent) * 100, 1) : 0;

        $activeContacts = \App\Models\Contact::where('team_id', $teamId)->count();

        $campaignsRunning = \App\Models\Campaign::where('team_id', $teamId)
            ->whereIn('status', ['running', 'scheduled'])
            ->count();

        // Chart Data (Last 7 Days)
        $chartDataRaw = \App\Models\SmsLog::where('team_id', $teamId)
            ->whereIn('status', ['sent', 'delivered'])
            ->where('created_at', '>=', now()->subDays(6)->startOfDay())
            ->selectRaw('DATE(created_at) as date, count(*) as count')
            ->groupBy('date')
            ->orderBy('date')
            ->get();
            
        $chartLabels = [];
        $chartSeriesData = [];
        
        for ($i = 6; $i >= 0; $i--) {
            $dateStr = now()->subDays($i)->format('Y-m-d');
            $chartLabels[] = now()->subDays($i)->format('D'); // e.g. 'Mon', 'Tue'
            
            $dayData = $chartDataRaw->firstWhere('date', $dateStr);
            $chartSeriesData[] = $dayData ? $dayData->count : 0;
        }

        $recentCampaigns = \App\Models\Campaign::with(['template', 'sim', 'stats'])
            ->where('team_id', $teamId)
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get();

        return Inertia::render('frontend/dashboard/index', [
            'invitations' => $invitations,
            'stats' => [
                'totalMessagesSent' => number_format($totalSent),
                'activeContacts' => number_format($activeContacts),
                'deliveryRate' => $deliveryRate . '%',
                'campaignsRunning' => number_format($campaignsRunning),
            ],
            'chartData' => [
                'categories' => $chartLabels,
                'series' => $chartSeriesData
            ],
            'recentCampaigns' => $recentCampaigns
        ]);
    }
}
