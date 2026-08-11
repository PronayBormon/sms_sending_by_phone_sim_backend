<?php

use App\Http\Controllers\Web\Backend\DashboardController;
use App\Http\Controllers\Web\Frontend\PageController;
use Illuminate\Support\Facades\Route;

// Route::inertia('/', 'welcome')->name('home');
Route::get('/', [DashboardController::class, 'home'])->name('home');

Route::get('/privacy-policy', [PageController::class, 'privacyPolicy'])->name('frontend.privacy.policy');
Route::get('/terms-and-conditions', [PageController::class, 'termsAndConditions'])->name('frontend.terms.conditions');
Route::get('/logout', [PageController::class, 'logout']);

require __DIR__ . '/backend.php';
require __DIR__ . '/settings.php';
