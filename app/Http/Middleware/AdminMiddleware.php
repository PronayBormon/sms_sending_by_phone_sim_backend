<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class AdminMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if (!$user || $user->role !== 'admin') {
            if ($request->expectsJson() || $request->is('api/*')) {
                if ($user && $request->bearerToken()) {
                    $user->currentAccessToken()?->delete();
                }

                abort(403, 'Unauthorized');
            }

            if (Auth::guard('web')->check()) {
                Auth::guard('web')->logout();
            }

            return redirect()->route('login')->with('status', 'Administrator access is required.');
        }

        return $next($request);
    }
}
