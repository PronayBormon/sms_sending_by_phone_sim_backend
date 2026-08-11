<?php

use App\Http\Controllers\API\Team\TeamManagementController;
use Illuminate\Support\Facades\Route;

Route::controller(TeamManagementController::class)
    ->middleware('auth:sanctum')
    ->prefix('team')
    ->group(function () {
        Route::get('/members',                 'members');    // GET    /api/v1/team/members
        Route::post('/members/invite',         'invite');     // POST   /api/v1/team/members/invite
        Route::post('/members/{member}/role',  'updateRole'); // POST   /api/v1/team/members/{id}/role
        Route::delete('/members/{member}',     'remove');     // DELETE /api/v1/team/members/{id}
        Route::get('/activity',                'activity');   // GET    /api/v1/team/activity
    });
