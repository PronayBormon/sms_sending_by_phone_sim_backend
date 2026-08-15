<?php

use App\Http\Controllers\API\Gateway\DeviceGatewayController;
use Illuminate\Support\Facades\Route;

Route::controller(DeviceGatewayController::class)->prefix('gateway')->group(function () {
    // Authenticate once with the user's Sanctum token to register the Firebase device token.
    Route::post('device-id', 'storeDevice')->middleware('auth:sanctum');

    // All gateway calls below authenticate with X-Device-Token (or device_token in the request body).
    // Route::post('device-information', 'storeDeviceInformation');
    Route::get('campaigns', 'campaigns');
    Route::get('sms-logs', 'smsLogs');
    Route::post('sms-logs/{smsLog}/status', 'updateSmsLogStatus');
});
