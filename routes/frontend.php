<?php

use App\Http\Controllers\Web\Frontend\User\UserDashboardController;
use App\Http\Controllers\Web\Frontend\User\UserContactController;
use App\Http\Controllers\Web\Frontend\User\UserContactListController;
use App\Http\Controllers\Web\Frontend\User\UserCampaignController;
use App\Http\Controllers\Web\Frontend\User\UserTemplateController;
use App\Http\Controllers\Web\Frontend\User\UserTeamController;
use App\Http\Controllers\Web\Frontend\User\TeamAcceptController;
use App\Http\Controllers\Web\Frontend\User\UserSmsLogController;
use App\Http\Controllers\Web\Frontend\User\UserDeviceController;
use App\Http\Controllers\Web\Frontend\User\UserGatewayActivityController;
use App\Http\Controllers\User\UserProfileController;
use App\Http\Controllers\Web\Frontend\User\UserProfileController as UserUserProfileController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:sanctum'])->prefix('user')->group(function () {
    Route::controller(UserDashboardController::class)->group(function () {
        Route::get('/dashboard', 'index');
    });

    // ─── Read-only routes (viewers allowed) ─────────────────────────────────
    Route::get('/contacts',           [UserContactController::class, 'index'])->name('contacts.index');
    Route::get('/contacts/create',    [UserContactController::class, 'create'])->name('contacts.create');
    Route::get('/contacts/{contact}', [UserContactController::class, 'show'])->name('contacts.show');
    Route::get('/contacts/{contact}/edit', [UserContactController::class, 'edit'])->name('contacts.edit');

    Route::get('/lists',              [UserContactListController::class, 'index'])->name('lists.index');
    Route::get('/lists/create',       [UserContactListController::class, 'create'])->name('lists.create');
    Route::get('/lists/{list}',       [UserContactListController::class, 'show'])->name('lists.show');
    Route::get('/lists/{list}/edit',  [UserContactListController::class, 'edit'])->name('lists.edit');

    Route::get('/campaigns',                  [UserCampaignController::class, 'index'])->name('campaigns.index');
    Route::get('/campaigns/create',           [UserCampaignController::class, 'create'])->name('campaigns.create');
    Route::get('/campaigns/{campaign}',       [UserCampaignController::class, 'show'])->name('campaigns.show');
    Route::get('/campaigns/{campaign}/edit',  [UserCampaignController::class, 'edit'])->name('campaigns.edit');

    Route::get('/templates',                  [UserTemplateController::class, 'index'])->name('templates.index');
    Route::get('/templates/create',           [UserTemplateController::class, 'create'])->name('templates.create');
    Route::get('/templates/{template}',       [UserTemplateController::class, 'show'])->name('templates.show');
    Route::get('/templates/{template}/edit',  [UserTemplateController::class, 'edit'])->name('templates.edit');

    Route::get('/team',        [UserTeamController::class, 'index'])->name('team.index');
    Route::get('/scheduled',   [UserCampaignController::class, 'scheduled'])->name('campaigns.scheduled');
    Route::get('/messages',    [UserSmsLogController::class, 'index'])->name('messages.index');
    Route::get('/messages/{id}', [UserSmsLogController::class, 'show'])->name('messages.show');
    Route::get('/devices',         [UserDeviceController::class, 'index'])->name('devices.index');
    Route::get('/devices/connect', [UserDeviceController::class, 'connect'])->name('devices.connect');
    Route::get('/devices/{id}',    [UserDeviceController::class, 'show'])->name('devices.show');
    Route::get('/sim-cards',       [UserDeviceController::class, 'simCards'])->name('simcards.index');
    Route::get('/gateway-activity', [UserGatewayActivityController::class, 'index']);

    // User Profile routes
    Route::get('/profile', [UserUserProfileController::class, 'edit'])->name('profile.edit');
    Route::post('/profile', [UserUserProfileController::class, 'update'])->name('profile.update');
    Route::post('/password', [UserUserProfileController::class, 'updatepassword'])->name('profile.update');
    Route::get('/settings', function () {
        return \Inertia\Inertia::render('frontend/user/settings/index');
    });
    Route::get('/settings', function () {
        return \Inertia\Inertia::render('frontend/user/settings/index');
    });

    // ─── Mutating routes – viewers blocked ───────────────────────────────────
    Route::middleware('viewer_restrict')->group(function () {
        // Contacts
        Route::post('/contacts/bulk-delete',      [UserContactController::class, 'bulkDelete'])->name('contacts.bulkDelete');
        Route::post('/contacts/bulk-add-to-list', [UserContactController::class, 'bulkAddToList'])->name('contacts.bulkAddToList');
        Route::post('/contacts/import',           [UserContactController::class, 'import'])->name('contacts.import');
        Route::post('/contacts',                  [UserContactController::class, 'store'])->name('contacts.store');
        Route::put('/contacts/{contact}',         [UserContactController::class, 'update'])->name('contacts.update');
        Route::patch('/contacts/{contact}',       [UserContactController::class, 'update']);
        Route::delete('/contacts/{contact}',      [UserContactController::class, 'destroy'])->name('contacts.destroy');

        // Lists
        Route::post('/lists',                                  [UserContactListController::class, 'store'])->name('lists.store');
        Route::put('/lists/{list}',                            [UserContactListController::class, 'update'])->name('lists.update');
        Route::patch('/lists/{list}',                          [UserContactListController::class, 'update']);
        Route::delete('/lists/{list}',                         [UserContactListController::class, 'destroy'])->name('lists.destroy');
        Route::post('/lists/{id}/remove-contact',              [UserContactListController::class, 'removeContact'])->name('lists.removeContact');
        Route::post('/lists/{id}/bulk-remove-contacts',        [UserContactListController::class, 'bulkRemoveContacts'])->name('lists.bulkRemoveContacts');
        Route::post('/lists/{id}/add-contacts',                [UserContactListController::class, 'addContacts'])->name('lists.addContacts');

        // Campaigns
        Route::post('/campaigns',              [UserCampaignController::class, 'store'])->name('campaigns.store');
        Route::put('/campaigns/{campaign}',    [UserCampaignController::class, 'update'])->name('campaigns.update');
        Route::patch('/campaigns/{campaign}',  [UserCampaignController::class, 'update']);
        Route::delete('/campaigns/{campaign}', [UserCampaignController::class, 'destroy'])->name('campaigns.destroy');

        // Templates
        Route::post('/templates',              [UserTemplateController::class, 'store'])->name('templates.store');
        Route::put('/templates/{template}',    [UserTemplateController::class, 'update'])->name('templates.update');
        Route::patch('/templates/{template}',  [UserTemplateController::class, 'update']);
        Route::delete('/templates/{template}', [UserTemplateController::class, 'destroy'])->name('templates.destroy');

        // Team management (only owner/admin can invite or change roles)
        Route::post('/team/invite',                    [UserTeamController::class, 'invite'])->name('team.invite');
        Route::put('/team/member/{member}/role',       [UserTeamController::class, 'updateRole'])->name('team.updateRole');
        Route::delete('/team/member/{member}',         [UserTeamController::class, 'removeMember'])->name('team.removeMember');

        // Devices / SIM
        Route::post('/devices/demo',        [UserDeviceController::class, 'storeDemoDevice'])->name('devices.storeDemoDevice');
        // User Profile updates\n        Route::patch('/profile', [\App\Http\Controllers\User\UserProfileController::class, 'update'])->name('profile.update');\n        Route::patch('/password', [\App\Http\Controllers\User\UserProfileController::class, 'updatePassword'])->name('profile.updatePassword');
    });
});

// Public routes for accepting team invitations (auth checked inside controller)
Route::get('/team/accept/{token}',          [TeamAcceptController::class, 'accept'])->name('team.accept');
Route::post('/team/accept/{token}/confirm', [TeamAcceptController::class, 'confirm'])->name('team.accept.confirm');
Route::post('/team/accept/{token}/decline', [TeamAcceptController::class, 'decline'])->name('team.accept.decline');
