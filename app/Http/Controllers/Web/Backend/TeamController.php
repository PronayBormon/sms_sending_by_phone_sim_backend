<?php

namespace App\Http\Controllers\Web\Backend;

use App\Http\Controllers\Controller;
use App\Models\Team;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class TeamController extends Controller
{
    public function index(Request $request)
    {
        $teams = Team::query()
            ->with(['creator'])
            ->when($request->search, function ($query, $search) {
                $query->where('team_name', 'like', "%{$search}%");
            })
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('backend/teams/index', [
            'teams' => $teams,
            'filters' => $request->only(['search']),
        ]);
    }

    public function create()
    {
        return Inertia::render('backend/teams/create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'team_name' => ['required', 'string', 'max:255'],
            'sender_name' => ['nullable', 'string', 'max:255'],
            'from_mail' => ['nullable', 'string', 'max:255'],
            'email_footer' => ['nullable', 'string', 'max:255'],
            'logo' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
        ]);
        
        $validated['creator_id'] = auth()->id() ?? 1;

        if ($request->hasFile('logo')) {
            $path = $request->file('logo')->store('images', 'public');
            $validated['logo'] = 'storage/' . $path;
        }

        Team::create($validated);

        return back()->with('success', 'Team created successfully');
    }

    public function show($id)
    {
        $team = Team::with(['creator', 'members.user'])->findOrFail($id);

        return Inertia::render('backend/teams/show', [
            'team' => $team
        ]);
    }

    public function edit($id)
    {
        $team = Team::with('members.user')->findOrFail($id);

        return Inertia::render('backend/teams/edit', [
            'team' => $team
        ]);
    }

    public function update(Request $request, $id)
    {
        $team = Team::findOrFail($id);

        $validated = $request->validate([
            'team_name' => ['required', 'string', 'max:255'],
            'sender_name' => ['nullable', 'string', 'max:255'],
            'from_mail' => ['nullable', 'string', 'max:255'],
            'email_footer' => ['nullable', 'string', 'max:255'],
            'logo' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
        ]);

        if($request->hasFile('logo')) {
            if($team->logo) {
                Storage::delete($team->logo);
            }
            $path = $request->file('logo')->store('images', 'public');
            $validated['logo'] = 'storage/' . $path;
        }else {
            unset($validated['logo']);
        }

        $team->update($validated);

        return back()->with('success', 'Team updated successfully');
    }

    public function destroy($id)
    {
        $team = Team::findOrFail($id);
        $team->delete();

        return back()->with('success', 'Team deleted successfully');
    }

    public function addMember(Request $request, Team $team)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'role' => 'nullable|string'
        ]);

        if (!$team->members()->where('user_id', $validated['user_id'])->exists()) {
            $team->members()->create([
                'user_id' => $validated['user_id'],
                'role' => $validated['role'] ?? 'viewer'
            ]);
            return back()->with('success', 'Team member added successfully');
        }

        return back()->with('error', 'User is already a member of this team');
    }

    public function removeMember(Team $team, $user_id)
    {
        $team->members()->where('user_id', $user_id)->delete();
        return back()->with('success', 'Team member removed successfully');
    }
}
