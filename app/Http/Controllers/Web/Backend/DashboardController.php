<?php

namespace App\Http\Controllers\Web\Backend;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function home(Request $request)
    {
        $faqs = \App\Models\Faq::active()->orderBy('sort_order')->get();
        return Inertia::render('frontend/home/index', [
            'faqs' => $faqs
        ]);
    }

    public function index(Request $request)
    {

        return Inertia::render('backend/dashboard/index');
    }
}
