<?php

use App\Http\Controllers\API\Auth\AuthApiController;
use App\Http\Controllers\API\Settings\SettingsController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;


Route::controller(SettingsController::class)->prefix('settings')->group(function () {
    Route::get('system', 'systemSetting');
    Route::get('faqs', 'faqList');
    Route::get('page/{slug}', 'dynamicPage');
});
