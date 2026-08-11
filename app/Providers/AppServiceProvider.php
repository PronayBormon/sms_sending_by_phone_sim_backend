<?php

namespace App\Providers;

use App\Models\Credential;
use Carbon\CarbonImmutable;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Str;
use Illuminate\Validation\Rules\Password;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $this->configureDefaults();
        $this->configureApiRateLimiting();


        /**
         * Bootstrap any application services.
         */
        try {
            if (!Schema::hasTable('credentials')) {
                return;
            }

            $smtp = Credential::where('provider', 'smtp')
                ->pluck('value', 'key')
                ->toArray();

            $value = fn(string $key, mixed $default = null) => filled($smtp[$key] ?? null)
                ? $smtp[$key]
                : $default;

            if (!empty($smtp)) {
                $scheme = match (strtolower((string) $value('encryption', config('mail.mailers.smtp.scheme')))) {
                    'ssl', 'smtps' => 'smtps',
                    'tls', 'starttls', 'smtp' => 'smtp',
                    default => null,
                };

                config([
                    'mail.default' => $value('mailer', config('mail.default')),
                    'mail.mailers.smtp.host'       => $value('host', config('mail.mailers.smtp.host')),
                    'mail.mailers.smtp.port'       => (int) $value('port', config('mail.mailers.smtp.port')),
                    'mail.mailers.smtp.username'   => $value('username', config('mail.mailers.smtp.username')),
                    'mail.mailers.smtp.password'   => $value('password', config('mail.mailers.smtp.password')),
                    'mail.mailers.smtp.scheme'     => $scheme,
                    'mail.mailers.smtp.encryption' => $value('encryption', config('mail.mailers.smtp.encryption')),

                    'mail.from.address' => $value('from_email', config('mail.from.address')),
                    'mail.from.name'    => $value('from_name', config('mail.from.name')),
                ]);
            }
        } catch (\Throwable $e) {
            // Prevent app crash if DB not ready
            logger()->error('SMTP load failed: ' . $e->getMessage());
        }
    }

    /**
     * Configure default behaviors for production-ready applications.
     */
    protected function configureDefaults(): void
    {
        Date::use(CarbonImmutable::class);

        DB::prohibitDestructiveCommands(
            app()->isProduction(),
        );

        Password::defaults(
            fn(): ?Password => app()->isProduction()
                ? Password::min(12)
                ->mixedCase()
                ->letters()
                ->numbers()
                ->symbols()
                ->uncompromised()
                : null,
        );
    }

    protected function configureApiRateLimiting(): void
    {
        RateLimiter::for('auth-api', function (Request $request) {
            $key = Str::lower((string) $request->input('email', 'guest')) . '|' . $request->ip();

            return Limit::perMinute(10)->by($key);
        });

        RateLimiter::for('profile-api', function (Request $request) {
            return Limit::perMinute(60)->by(
                optional($request->user())->id ?: $request->ip()
            );
        });

        RateLimiter::for('api', function (Request $request) {
            return Limit::perMinute(120)->by(
                optional($request->user())->id ?: $request->ip()
            );
        });
    }
}
