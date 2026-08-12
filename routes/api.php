<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');


Route::prefix('v1')->group(function () {
    require base_path('routes/api/v1/auth.php');
    require base_path('routes/api/v1/user.php');
    require base_path('routes/api/v1/settings.php');
    require base_path('routes/api/v1/contact.php');
    require base_path('routes/api/v1/team.php');
    require base_path('routes/api/v1/template.php');
    require base_path('routes/api/v1/campaign.php');
    require base_path('routes/api/v1/gateway.php');
});
