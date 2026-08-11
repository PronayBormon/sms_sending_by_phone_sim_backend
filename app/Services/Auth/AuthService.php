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
                // return $this->errorResponse('Email already verified', 409);
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
        if (!Auth::attempt($credentials)) {
            throw ValidationException::withMessages([
                'email' => ['Invalid credentials.']
            ]);
        }

        $auth = Auth::user();

        $user = User::find($auth->id);

        $token = $user->createToken('api-token')->plainTextToken;

        return [
            'token' => $token,
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
