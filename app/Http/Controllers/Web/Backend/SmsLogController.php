<?php

namespace App\Http\Controllers\Web\Backend;

use App\Http\Controllers\Controller;
use App\Models\SmsLog;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SmsLogController extends Controller
{
    public function index(Request $request)
    {
        $logs = SmsLog::with([
            'team:id,team_name',
            'device:id,name,device_id',
            'campaign:id,campaign_name',
        ])
            ->when($request->search, fn ($query, $search) => $query->where(fn ($builder) => $builder
                ->where('recipient', 'like', "%{$search}%")
                ->orWhere('sender', 'like', "%{$search}%")
                ->orWhere('gateway_message_id', 'like', "%{$search}%")))
            ->when($request->status, fn ($query, $status) => $query->where('status', $status))
            ->when($request->date, fn ($query, $date) => $query->whereDate('created_at', $date))
            ->latest()
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('backend/sms-logs/index', [
            'logs' => $logs,
            'filters' => $request->only(['search', 'status', 'date']),
        ]);
    }
}
