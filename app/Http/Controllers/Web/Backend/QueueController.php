<?php

namespace App\Http\Controllers\Web\Backend;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class QueueController extends Controller
{
    public function index(Request $request)
    {
        $jobs = DB::table('jobs')
            ->latest('id')
            ->paginate(20);

        return Inertia::render('backend/queues/index', [
            'jobs' => $jobs,
        ]);
    }

    public function failed()
    {
        $jobs = DB::table('failed_jobs')
            ->latest('id')
            ->paginate(25);

        return Inertia::render('backend/queues/failed', [
            'jobs' => [
                'data' => $jobs->items(),
            ],
            'links' => $jobs->linkCollection()->toArray(),
            'pagination' => [
                'from' => $jobs->firstItem(),
                'to' => $jobs->lastItem(),
                'total' => $jobs->total(),
            ],
        ]);
    }

    public function destroy($id)
    {
        DB::table('failed_jobs')
            ->where('id', $id)
            ->delete();

        return back()->with('success', 'Failed job deleted.');
    }

    public function retry($id)
    {
        Artisan::call('queue:retry', [
            'id' => [$id]
        ]);

        return back()->with('success', 'Job retried successfully.');
    }
}
