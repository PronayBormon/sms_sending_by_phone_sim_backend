<?php

namespace App\Http\Controllers\Web\Frontend\User;

use App\Http\Controllers\Controller;
use App\Models\SmsLog;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserSmsLogController extends Controller
{
    public function index(Request $request)
    {
        $teamId = auth()->user()->currentTeamId();

        $query = SmsLog::with(['campaign:id,campaign_name', 'device:id,name'])
            ->where('team_id', $teamId);

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('recipient', 'like', "%{$search}%")
                    ->orWhereHas('campaign', function ($q2) use ($search) {
                        $q2->where('campaign_name', 'like', "%{$search}%");
                    });
            });
        }

        if ($request->filled('status') && $request->status !== 'All') {
            $query->where('status', $request->status);
        }

        $messages = $query->orderBy('created_at', 'desc')->paginate(50)->withQueryString();

        return Inertia::render('frontend/user/messages/index', [
            'messages' => $messages,
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    public function show($id)
    {
        $teamId = auth()->user()->currentTeamId();

        $message = SmsLog::with(['campaign', 'device'])
            ->where('team_id', $teamId)
            ->findOrFail($id);

        return Inertia::render('frontend/user/messages/show', [
            'messageLog' => $message,
        ]);
    }
}
