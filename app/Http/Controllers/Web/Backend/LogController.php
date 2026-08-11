<?php

namespace App\Http\Controllers\Web\Backend;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Opcodes\LogViewer\Facades\LogViewer;
use Opcodes\LogViewer\Http\Resources\LevelCountResource;
use Opcodes\LogViewer\Http\Resources\LogResource;

class LogController extends Controller
{
    public function index(Request $request)
    {
        $file = LogViewer::getFiles()->first();

        if (! $file) {
            return Inertia::render('backend/logs/index', [
                'logs' => [
                    'data' => [],
                    'links' => [],
                ],
                'pagination' => null,
            ]);
        }

        $logQuery = $file->logs();

        $logQuery->scan();

        $logs = $logQuery->paginate(50);
        $logs->withPath(route('admin.log.index'));

        return Inertia::render('backend/logs/index', [
            'logs' => LogResource::collection($logs)->resolve(),
            'links' => $logs->linkCollection()->toArray(),
            'pagination' => [
                'from' => $logs->firstItem(),
                'to' => $logs->lastItem(),
                'total' => $logs->total(),
            ],
        ]);
    }

    public function clear()
    {
        file_put_contents(storage_path('logs/laravel.log'), '');

        return back()->with('success', 'Logs cleared successfully.');
    }
}
