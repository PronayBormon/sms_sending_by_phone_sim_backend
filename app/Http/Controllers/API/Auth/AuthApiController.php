<?php

namespace App\Http\Controllers\API\Auth;

use App\Concerns\ApiResponse;
use App\Http\Controllers\Controller;
use App\Http\Requests\ForgotPasswordRequest;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\OtpVerify;
use App\Http\Requests\RegisterRequest;
use App\Http\Requests\ResetPasswordRequest;
use App\Models\User;
use App\Services\Auth\AuthService;
use Ichtrojan\Otp\Otp;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Validator;

class AuthApiController extends Controller
{
    use ApiResponse;

    public function __construct(
        protected AuthService $service
    ) {}

    public function register(RegisterRequest $request)
    {

        $result = $this->service->register(
            $request->validated()
        );

        return $this->successResponse(
            'Otp Send to Email',
            $result,
            201
        );
    }

    public function verifyRegister(OtpVerify $request)
    {
        $validate = (new Otp)->validate(
            $request->email,
            $request->otp
        );

        if (!$validate->status) {
            return $this->errorResponse(
                $validate->message,
                422
            );
        }

        $verify = $this->service->verifyEmail(
            $request->validated()
        );

        return $this->successResponse(
            'Email verified successfully',
            $verify,
            200
        );
    }

    public function login(LoginRequest $request)
    {
        $result = $this->service->login(
            $request->validated()
        );

        return $this->successResponse(
            'Login successful',
            $result,
        );
    }

    public function forgotPassword(ForgotPasswordRequest $request)
    {
        $data = $this->service->forgotPassword(
            $request->email
        );

        return $this->successResponse(
            'Otp sent to your email',
            $data,
        );
    }


    public function verifyForgetPass(OtpVerify $request)
    {
        $validate = (new Otp)->validate(
            $request->email,
            $request->otp
        );

        if (!$validate->status) {
            return $this->errorResponse(
                $validate->message,
                422
            );
        }

        $verify = $this->service->verifyForgetPass(
            $request->validated()
        );

        return $this->successResponse(
            'Email verified successfully',
            $verify,
            200
        );
    }


    public function resetPassword(ResetPasswordRequest $request)
    {
        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return $this->errorResponse('User not found', 404);
        }

        if ($user->remember_token != $request->reset_token) {
            return $this->errorResponse('Token is not match', 401);
        }

        if (!$user->remember_token) {
            return $this->errorResponse('Invalid or expired reset token', 422);
        }

        $user->update([
            'remember_token' => null,
        ]);

        Password::deleteToken($user);

        return $this->successResponse(
            'Password reset successfully',
            null,
            200
        );
    }

    // logout
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return $this->successResponse(
            'Logged out successfully',
            null,
            200
        );
    }
}
