<?php

use App\Http\Controllers\API\Template\EmailTemplateApiController;
use Illuminate\Support\Facades\Route;

Route::controller(EmailTemplateApiController::class)->middleware('auth:sanctum')->prefix('templates')->group(function () {
    Route::get('/', 'index');
    Route::post('/', 'store');
    Route::get('/{id}', 'show');
    Route::post('/update/{id}', 'update');
    Route::delete('/{id}', 'destroy');
});
