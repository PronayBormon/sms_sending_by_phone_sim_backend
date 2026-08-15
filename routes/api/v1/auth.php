<?php

use App\Http\Controllers\API\Auth\AuthApiController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;


Route::controller(AuthApiController::class)->prefix('auth')->middleware('throttle:auth-api')->group(function () {
    Route::post('register', 'register');
    Route::post('verify/register', 'verifyRegister');
    Route::post('login', 'login');
    Route::post('qr/verify', 'verifyQrToken');
    
    Route::post('login/two-factor', 'twoFactorLogin');
    Route::post('logout', 'logout')->middleware('auth:sanctum');
    Route::post('forgetpass', 'forgotPassword');
    Route::post('verify-email', 'verifyForgetPass');
    Route::post('change-password', 'resetPassword');
});
