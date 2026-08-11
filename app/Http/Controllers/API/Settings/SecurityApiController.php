<?php

namespace App\Http\Controllers\API\Settings;

use App\Concerns\ApiResponse;
use App\Http\Controllers\Controller;
use App\Models\LoginHistory;
use Closure;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpKernel\Exception\HttpExceptionInterface;
use Throwable;
use Jenssegers\Agent\Agent;
use Laravel\Fortify\Actions\EnableTwoFactorAuthentication;
use Laravel\Fortify\Actions\DisableTwoFactorAuthentication;
use Laravel\Fortify\Actions\ConfirmTwoFactorAuthentication;
use Illuminate\Validation\Rule;
use App\Mail\TwoFactorEmailCode;
use Illuminate\Support\Facades\Mail;
use Ichtrojan\Otp\Otp;

class SecurityApiController extends Controller
{
    use ApiResponse;

    /**
     * GET /api/v1/settings/security
     * Get 2FA status, active sessions (tokens), and recent login history.
     */
    public function getSecurityData(Request $request): JsonResponse
    {
        return $this->respondSafely(function () use ($request) {
            $user = $request->user();

            // 1. 2FA Status
            $twoFactorEnabled = $user->hasEnabledTwoFactorAuthentication() || $user->two_factor_type !== 'none';
            $twoFactorType = $user->two_factor_type;

            if ($user->hasEnabledTwoFactorAuthentication() && $twoFactorType === 'none') {
                $twoFactorType = 'authenticator';
                $user->update(['two_factor_type' => 'authenticator']);
            }

            $twoFactorData = [
                'enabled' => $twoFactorEnabled,
                'type' => $twoFactorType,
            ];

            // 2. Active Sessions (Personal Access Tokens)
            $tokens = $user->tokens()->orderBy('last_used_at', 'desc')->get()->map(function ($token) use ($request) {
                return [
                    'id' => $token->id,
                    'name' => $token->name,
                    'ip_address' => $token->ip_address,
                    'user_agent' => $token->user_agent,
                    'location' => $token->location,
                    'last_used_at' => $token->last_used_at,
                    'is_current' => $token->id === $request->user()->currentAccessToken()->id,
                ];
            });

            // 3. Login History
            $loginHistory = LoginHistory::where('user_id', $user->id)
                ->orWhere('email', $user->email)
                ->orderBy('created_at', 'desc')
                ->take(10)
                ->get()
                ->map(function ($history) {
                    return [
                        'id' => $history->id,
                        'ip_address' => $history->ip_address,
                        'user_agent' => $history->user_agent,
                        'location' => $history->location,
                        'status' => $history->status,
                        'date' => $history->created_at,
                    ];
                });

            return $this->successResponse('Security data retrieved.', [
                'two_factor' => $twoFactorData,
                'sessions' => $tokens,
                'login_history' => $loginHistory,
            ]);
        });
    }

    /**
     * DELETE /api/v1/settings/security/sessions/{id}
     * Revoke a specific session (token).
     */
    public function revokeSession(Request $request, $id): JsonResponse
    {
        return $this->respondSafely(function () use ($request, $id) {
            $token = $request->user()->tokens()->where('id', $id)->firstOrFail();
            $token->delete();

            return $this->successResponse('Session revoked successfully.');
        });
    }

    /**
     * DELETE /api/v1/settings/security/sessions
     * Revoke all other sessions except the current one.
     */
    public function revokeAllOtherSessions(Request $request): JsonResponse
    {
        return $this->respondSafely(function () use ($request) {
            $currentAccessTokenId = $request->user()->currentAccessToken()->id;

            $request->user()->tokens()->where('id', '!=', $currentAccessTokenId)->delete();

            return $this->successResponse('All other sessions revoked successfully.');
        });
    }

    /**
     * POST /api/v1/settings/security/two-factor
     * Enable Two-Factor Authentication and get QR code / recovery codes.
     */
    public function enable2fa(Request $request, EnableTwoFactorAuthentication $enable): JsonResponse
    {
        return $this->respondSafely(function () use ($request, $enable) {
            $user = $request->user();

            if ($user->hasEnabledTwoFactorAuthentication()) {
                throw ValidationException::withMessages([
                    'two_factor' => ['Two-Factor Authentication is already enabled.']
                ]);
            }

            $enable($user);

            return $this->successResponse('Two-Factor Authentication enabled. Please scan the QR code.', [
                'qr_code' => 'data:image/svg+xml;base64,' . base64_encode($user->twoFactorQrCodeSvg()),
                'recovery_codes' => $user->recoveryCodes(),
            ]);
        });
    }

    /**
     * POST /api/v1/settings/security/two-factor/confirm
     * Confirm Two-Factor Authentication setup using the authenticator app code.
     */
    public function confirm2fa(Request $request, ConfirmTwoFactorAuthentication $confirm): JsonResponse
    {
        return $this->respondSafely(function () use ($request, $confirm) {
            $request->validate([
                'code' => ['required', 'string'],
            ]);

            $user = $request->user();

            $confirm($user, $request->code);

            $user->update(['two_factor_type' => 'authenticator']);

            return $this->successResponse('Two-Factor Authentication confirmed and activated successfully.');
        });
    }

    /**
     * POST /api/v1/settings/security/two-factor/email
     * Request to enable Email Two-Factor Authentication (Sends OTP).
     */
    public function enableEmail2fa(Request $request): JsonResponse
    {
        return $this->respondSafely(function () use ($request) {
            $user = $request->user();

            if ($user->two_factor_type === 'email') {
                throw ValidationException::withMessages([
                    'two_factor' => ['Email Two-Factor Authentication is already enabled.']
                ]);
            }

            $otp = (new Otp)->generate($user->email, 'numeric', 6, 15);

            $user->update([
                'two_factor_email_code' => $otp->token,
                'two_factor_email_code_expires_at' => now()->addMinutes(15),
            ]);

            Mail::to($user->email)->send(new TwoFactorEmailCode($otp->token));

            return $this->successResponse('A 6-digit verification code has been sent to your email.');
        });
    }

    /**
     * POST /api/v1/settings/security/two-factor/email/confirm
     * Confirm Email Two-Factor Authentication using the emailed code.
     */
    public function confirmEmail2fa(Request $request, DisableTwoFactorAuthentication $disableTotp): JsonResponse
    {
        return $this->respondSafely(function () use ($request, $disableTotp) {
            $request->validate([
                'code' => ['required', 'string'],
            ]);

            $user = $request->user();

            $validate = (new Otp)->validate($user->email, $request->code);

            if (!$validate->status) {
                return $this->errorResponse($validate->message, 422);
            }

            // Disable TOTP if it was enabled
            if ($user->hasEnabledTwoFactorAuthentication()) {
                $disableTotp($user);
            }

            $user->update([
                'two_factor_type' => 'email',
                'two_factor_email_code' => null,
                'two_factor_email_code_expires_at' => null,
            ]);

            return $this->successResponse('Email Two-Factor Authentication enabled successfully.');
        });
    }

    /**
     * DELETE /api/v1/settings/security/two-factor
     * Disable Two-Factor Authentication (both types).
     */
    public function disable2fa(Request $request, DisableTwoFactorAuthentication $disable): JsonResponse
    {
        return $this->respondSafely(function () use ($request, $disable) {
            $user = $request->user();

            if (!$user->hasEnabledTwoFactorAuthentication() && $user->two_factor_type === 'none') {
                throw ValidationException::withMessages([
                    'two_factor' => ['Two-Factor Authentication is not enabled.']
                ]);
            }

            if ($user->hasEnabledTwoFactorAuthentication()) {
                $disable($user);
            }

            $user->update([
                'two_factor_type' => 'none',
                'two_factor_email_code' => null,
                'two_factor_email_code_expires_at' => null,
            ]);

            return $this->successResponse('Two-Factor Authentication disabled successfully.');
        });
    }

    private function respondSafely(Closure $callback): JsonResponse
    {
        try {
            return $callback();
        } catch (ValidationException $e) {
            return $this->errorResponse('Validation failed.', 422, $e->errors());
        } catch (HttpExceptionInterface $e) {
            return $this->errorResponse($e->getMessage() ?: 'Request failed.', $e->getStatusCode());
        } catch (Throwable $e) {
            report($e);
            return $this->errorResponse('Something went wrong. Please try again later.', 500);
        }
    }
}
