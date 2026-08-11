<?php

use App\Http\Controllers\API\Campaign\CampaignApiController;
use Illuminate\Support\Facades\Route;

Route::controller(CampaignApiController::class)->middleware('auth:sanctum')->prefix('campaigns')->group(function () {
    Route::get('/export', 'export');
    Route::get('/', 'index');
    Route::post('/', 'store');
    Route::get('/{id}', 'show');
    Route::post('/update/{id}', 'update');
    Route::delete('/{id}', 'destroy');
    Route::get('/{id}/analytics', 'analytics');
});
