<?php

namespace App\Http\Controllers\Web\Backend;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function home(Request $request)
    {
        return redirect()->route('admin.dashboard.index');
    }

    public function index(Request $request)
    {

        return Inertia::render('backend/dashboard/index');
    }
}
