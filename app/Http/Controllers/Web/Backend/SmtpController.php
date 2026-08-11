<?php

namespace App\Http\Controllers\Web\Backend;

use App\Http\Controllers\Controller;
use App\Models\Smtp;
use App\Models\Team;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Crypt;

class SmtpController extends Controller
{
    public function index(Request $request)
    {
        $smtps = Smtp::query()
            ->with(['team'])
            ->when($request->search, function ($query, $search) {
                $query->where('host', 'like', "%{$search}%")
                      ->orWhere('username', 'like', "%{$search}%");
            })
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('backend/smtps/index', [
            'smtps' => $smtps,
            'filters' => $request->only(['search']),
        ]);
    }

    public function create()
    {
        return Inertia::render('backend/smtps/create', [
            'teams' => Team::select('id', 'team_name')->get(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'team_id' => ['nullable', 'exists:teams,id'],
            'host' => ['nullable', 'string', 'max:255'],
            'port' => ['nullable', 'string', 'max:50'],
            'username' => ['nullable', 'string', 'max:255'],
            'password' => ['nullable', 'string', 'max:255'],
            'encryption' => ['nullable', 'string', 'max:50'],
        ]);

        if (isset($validated['password'])) {
            // Optional: Encrypt the password if you wish to store it safely
            // $validated['password'] = Crypt::encryptString($validated['password']);
        }

        Smtp::create($validated);

        return back()->with('success', 'SMTP configuration created successfully');
    }

    public function show($id)
    {
        $smtp = Smtp::with(['team'])->findOrFail($id);

        return Inertia::render('backend/smtps/show', [
            'smtp' => $smtp
        ]);
    }

    public function edit($id)
    {
        $smtp = Smtp::findOrFail($id);

        return Inertia::render('backend/smtps/edit', [
            'smtp' => $smtp,
            'teams' => Team::select('id', 'team_name')->get(),
        ]);
    }

    public function update(Request $request, $id)
    {
        $smtp = Smtp::findOrFail($id);

        $validated = $request->validate([
            'team_id' => ['nullable', 'exists:teams,id'],
            'host' => ['nullable', 'string', 'max:255'],
            'port' => ['nullable', 'string', 'max:50'],
            'username' => ['nullable', 'string', 'max:255'],
            'password' => ['nullable', 'string', 'max:255'],
            'encryption' => ['nullable', 'string', 'max:50'],
        ]);

        if (empty($validated['password'])) {
            unset($validated['password']);
        } else {
            // $validated['password'] = Crypt::encryptString($validated['password']);
        }

        $smtp->update($validated);

        return back()->with('success', 'SMTP configuration updated successfully');
    }

    public function destroy($id)
    {
        $smtp = Smtp::findOrFail($id);
        $smtp->delete();

        return back()->with('success', 'SMTP configuration deleted successfully');
    }
}
