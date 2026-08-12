<?php

use App\Http\Controllers\API\User\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;


Route::controller(UserController::class)->prefix('user')->middleware(['auth:sanctum', 'throttle:profile-api'])->group(function () {
    Route::get('details', 'profile');
    Route::post('update', 'update');
    Route::post('update-password', 'updatePassword');
    Route::post('notifications', 'updateNotifications');
    Route::post('team/create', 'createTeam');
});
