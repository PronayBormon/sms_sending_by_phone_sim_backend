<?php

namespace App\Http\Controllers\Web\Backend;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\Backend\UserService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Jenssegers\Agent\Agent;

class UserController extends Controller
{
    protected $service;

    public function __construct(
        UserService $service
    ) {
        $this->service = $service;
    }

    public function index(Request $request)
    {
        $users = User::query()

            ->when($request->search, function ($query, $search) {

                $query->where(function ($q) use ($search) {

                    $q->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%");
                });
            })

            ->when($request->join_date, function ($query, $joinDate) {

                $query->whereDate('created_at', $joinDate);
            })

            ->latest()

            ->paginate(10)

            ->withQueryString();

        return Inertia::render('backend/users/index', [
            'users' => $users,
            'filters' => $request->only([
                'search',
                'join_date',
            ]),
        ]);
    }

    public function create()
    {
        return Inertia::render('backend/users/create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'first_name' => ['required'],
            'last_name' => ['required'],
            'email' => ['required', 'email', 'unique:users,email'],
            'password' => ['required', 'min:6'],
            'avatar' => ['nullable'],
            'role' => [
                'nullable',
                'string',
            ],
        ]);

        $data = $this->service->store($validated);


        return back()->with('success', 'User created successfully');
    }

    public function edit($id)
    {
        $user = User::find($id);

        return Inertia::render('backend/users/edit', [
            'user' => $user
        ]);
    }
    public function show($id)
    {
        $user = User::find($id);

        return Inertia::render('backend/users/show', [
            'user' => $user
        ]);
    }

    public function update(
        Request $request,
        $id
    ) {
        $user = User::findOrFail($id);

        $validated = $request->validate([
            'first_name' => ['required'],
            'last_name' => ['required'],
            'email' => [
                'required',
                'email',
                'unique:users,email,' . $user->id,
            ],

            'avatar' => [
                'nullable',
                'image',
                'mimes:jpg,jpeg,png,webp',
                'max:2048',
            ],

            'role' => [
                'nullable',
                'string',
            ],

            'password' => [
                'nullable',
                'confirmed',
                'min:6',
            ],
        ]);




        $this->service->update(
            $id,
            $validated
        );

        return back()->with(
            'success',
            'User updated successfully'
        );
    }

    public function destroy(User $user)
    {
        $user->delete();

        return back()->with('success', 'User deleted successfully');
    }

    public function sessions(User $user)
    {
        $sessions = DB::table('sessions')
            ->where('user_id', $user->id)
            ->orderByDesc('last_activity')
            ->get()
            ->map(function ($session) {

                $agent = new Agent();
                $agent->setUserAgent($session->user_agent);

                return [
                    'id' => $session->id,
                    'ip_address' => $session->ip_address,
                    'browser' => $agent->browser(),
                    'platform' => $agent->platform(),
                    'device' => $agent->device() ?: 'Desktop',
                    'last_activity' => $session->last_activity,
                ];
            });

        return Inertia::render('backend/users/sessions', [
            'user' => $user,
            'sessions' => $sessions,
        ]);
    }
}
