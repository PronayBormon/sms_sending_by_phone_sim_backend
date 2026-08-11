<?php

use App\Http\Controllers\API\Auth\AuthApiController;
use App\Http\Controllers\API\Settings\SettingsController;
use App\Http\Controllers\API\Settings\SmtpController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;


use App\Http\Controllers\API\Settings\SecurityApiController;

Route::controller(SettingsController::class)->prefix('settings')->group(function () {
    Route::get('system', 'systemSetting');
    Route::get('faqs', 'faqList');
    Route::get('page/{slug}', 'dynamicPage');
});

// Security & Sessions
Route::controller(SecurityApiController::class)->middleware('auth:sanctum')->prefix('settings/security')->group(function () {
    Route::get('/', 'getSecurityData');                            // GET    /api/v1/settings/security
    
    // 2FA
    Route::post('/two-factor', 'enable2fa');                       // POST   /api/v1/settings/security/two-factor
    Route::post('/two-factor/confirm', 'confirm2fa');              // POST   /api/v1/settings/security/two-factor/confirm
    Route::post('/two-factor/email', 'enableEmail2fa');            // POST   /api/v1/settings/security/two-factor/email
    Route::post('/two-factor/email/confirm', 'confirmEmail2fa');   // POST   /api/v1/settings/security/two-factor/email/confirm
    Route::delete('/two-factor', 'disable2fa');                    // DELETE /api/v1/settings/security/two-factor
    
    // Sessions
    Route::delete('/sessions', 'revokeAllOtherSessions');          // DELETE /api/v1/settings/security/sessions
    Route::delete('/sessions/{id}', 'revokeSession');              // DELETE /api/v1/settings/security/sessions/{id}
});

// SMTP Configuration
Route::controller(SmtpController::class)->middleware('auth:sanctum')->prefix('smtp')->group(function () {
    Route::get('/',      'show');    // GET    /api/v1/smtp
    Route::post('/',     'save');    // POST   /api/v1/smtp
    Route::post('/test', 'test');    // POST   /api/v1/smtp/test
    Route::delete('/',   'destroy'); // DELETE /api/v1/smtp
});

