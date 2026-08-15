<?php

namespace App\Http\Middleware;

use App\Models\Setting;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $setting = Setting::first();

        $teamRole = null;
        if ($user = $request->user()) {
            $teamId = $user->currentTeamId();
            if ($teamId) {
                $member = \App\Models\TeamMember::where('team_id', $teamId)
                    ->where('user_id', $user->id)
                    ->first();
                $teamRole = $member?->role;
            }
        }

        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'site_settings' => $setting?->site_name,
            'setting' => $setting,
            'light_logo' => $setting?->light_logo,
            'dark_logo' => $setting?->dark_logo,
            'auth' => [
                'user' => $request->user(),
                'teamRole' => $teamRole,
            ],
            'flash' => [
                'success' => fn() => $request->session()->get('success'),
                'error'   => fn() => $request->session()->get('error'),
                'warning' => fn() => $request->session()->get('warning'),
                'info'    => fn() => $request->session()->get('info'),
                'toast'   => fn() => $request->session()->get('toast'),
            ],
            'sidebarOpen' => ! $request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
        ];
    }
}
