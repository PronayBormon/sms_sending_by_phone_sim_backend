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
        $invitations = \App\Models\TeamInvite::with('team', 'creator')
            ->where('email', $user->email)
            ->where('status', 'pending')
            ->get();

        return Inertia::render('frontend/dashboard/index', [
            'invitations' => $invitations
        ]);
    }
}
