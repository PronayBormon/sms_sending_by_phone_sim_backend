<?php

namespace App\Services\Auth;

use App\Concerns\ApiResponse;
use App\Mail\ForgetPassword;
use App\Mail\VerifyRegister;
use App\Mail\WelcomeMail;
use App\Models\User;
use App\Repositories\Auth\AuthRepository;
use Ichtrojan\Otp\Otp;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Password;
use Illuminate\Validation\ValidationException;
use App\Models\LoginHistory;
use Illuminate\Support\Facades\Request;
use Laravel\Fortify\Contracts\TwoFactorAuthenticationProvider;

class AuthService
{
    use ApiResponse;

    public function __construct(
        protected AuthRepository $repository
    ) {}

    public function register(array $data)
    {
        $data['password'] = Hash::make($data['password']);

        $exists = $this->repository->findByEmail($data['email']);

        if ($exists) {
            if ($exists->email_verified_at != null) {
                throw new \Exception('Email already verified');
            }

            $otp = (new Otp)->generate($data['email'], 'numeric', 6, 15);

            Mail::to($data['email'])->send(new VerifyRegister($exists, $otp->token));

            return [
                'token' => $otp->token,
                'user' => $exists,
            ];
        }

        $user = $this->repository->createUser($data);


        $otp = (new Otp)->generate($data['email'], 'numeric', 6, 15);


        // $token = $user->createToken('api-token')->plainTextToken;

        return [
            'token' => $otp->token,
            'user' => $user,
        ];
    }

    public function verifyEmail(array $data): array
    {
        $user = $this->repository->findByEmail($data['email']);

        if (!$user) {
            throw new \Exception('User not found');
        }

        if (!$user->email_verified_at) {
            $user->update([
                'email_verified_at' => now(),
            ]);
        }

        Mail::to($user->email)->send(new WelcomeMail($user->name));


        $token = $user->createToken('api-token')->plainTextToken;

        return [
            'token' => $token,
            'user'  => $user->fresh(),
        ];
    }


    public function login(array $credentials)
    {
        $ip = Request::ip();
        $userAgent = Request::userAgent();

        if (!Auth::attempt($credentials)) {
            LoginHistory::create([
                'email' => $credentials['email'] ?? null,
                'ip_address' => $ip,
                'user_agent' => $userAgent,
                'status' => 'failed',
            ]);

            throw ValidationException::withMessages([
                'email' => ['Invalid credentials.']
            ]);
        }

        $auth = Auth::user();
        $user = User::find($auth->id);

        if ($user->hasEnabledTwoFactorAuthentication() || $user->two_factor_type === 'email') {
            if ($user->two_factor_type === 'email') {
                $otp = (new Otp)->generate($user->email, 'numeric', 6, 15);
                $user->update([
                    'two_factor_email_code' => $otp->token,
                    'two_factor_email_code_expires_at' => now()->addMinutes(15),
                ]);
                Mail::to($user->email)->send(new \App\Mail\TwoFactorEmailCode($otp->token));
            }

            return [
                'two_factor_required' => true,
                'type' => $user->two_factor_type === 'none' ? 'authenticator' : $user->two_factor_type,
                'user_id' => $user->id,
            ];
        }

        LoginHistory::create([
            'user_id' => $user->id,
            'email' => $user->email,
            'ip_address' => $ip,
            'user_agent' => $userAgent,
            'status' => 'success',
        ]);

        $tokenResult = $user->createToken('api-token');
        $tokenResult->accessToken->update([
            'ip_address' => $ip,
            'user_agent' => $userAgent,
        ]);

        return [
            'token' => $tokenResult->plainTextToken,
            'user' => $user,
        ];
    }

    public function twoFactorLogin(array $data)
    {
        $user = User::findOrFail($data['user_id']);
        
        $ip = Request::ip();
        $userAgent = Request::userAgent();

        if ($user->two_factor_type === 'email') {
            $validate = (new Otp)->validate($user->email, $data['code']);
            if (!$validate->status) {
                LoginHistory::create(['email' => $user->email, 'ip_address' => $ip, 'user_agent' => $userAgent, 'status' => 'failed']);
                throw ValidationException::withMessages(['code' => [$validate->message]]);
            }
            $user->update([
                'two_factor_email_code' => null,
                'two_factor_email_code_expires_at' => null,
            ]);
        } else {
            $engine = app(TwoFactorAuthenticationProvider::class);
            if (!$engine->verify(decrypt($user->two_factor_secret), $data['code'])) {
                // Check recovery codes
                $validRecoveryCode = collect($user->recoveryCodes())->first(function ($code) use ($data) {
                    return hash_equals($code, $data['code']) ? $code : null;
                });
                
                if (!$validRecoveryCode) {
                    LoginHistory::create(['email' => $user->email, 'ip_address' => $ip, 'user_agent' => $userAgent, 'status' => 'failed']);
                    throw ValidationException::withMessages(['code' => ['The provided two factor authentication code is invalid.']]);
                }
                $user->replaceRecoveryCode($validRecoveryCode);
            }
        }

        Auth::login($user);

        LoginHistory::create([
            'user_id' => $user->id,
            'email' => $user->email,
            'ip_address' => $ip,
            'user_agent' => $userAgent,
            'status' => 'success',
        ]);

        $tokenResult = $user->createToken('api-token');
        $tokenResult->accessToken->update([
            'ip_address' => $ip,
            'user_agent' => $userAgent,
        ]);

        return [
            'token' => $tokenResult->plainTextToken,
            'user' => $user,
        ];
    }

    public function forgotPassword(string $email): string
    {

        $user = $this->repository->findByEmail($email);

        if (!$user) {
            throw new \Exception('User not found');
        }
        $otp = (new Otp)->generate($email, 'numeric', 6, 15);
        Mail::to($email)->send(new ForgetPassword($user, $otp->token));

        return $otp->token;
    }


    public function verifyForgetPass(array $data): array
    {
        $user = $this->repository->findByEmail($data['email']);

        if (!$user) {
            throw new \Exception('User not found');
        }

        // Generate password reset token
        $resetToken = Password::createToken($user);


        if ($user) {
            $user->update([
                'remember_token' => $resetToken,
            ]);
        }

        return [
            'reset_token' => $resetToken,
            'user'  => $user->fresh(),
        ];
    }


    public function resetPassword(array $data): string
    {
        return Password::reset(
            $data,
            function ($user, $password) {
                $user->password = Hash::make($password);
                $user->save();
            }
        );
    }
}
