<?php

// use App\Http\Controllers\Settings\ProfileController;
use App\Http\Controllers\Web\Backend\DashboardController;
use App\Http\Controllers\Web\Backend\DynamicPageController;
use App\Http\Controllers\Web\Backend\FaqController;
use App\Http\Controllers\Web\Backend\LogController;
use App\Http\Controllers\Web\Backend\ProfileController;
use App\Http\Controllers\Web\Backend\QueueController;
use App\Http\Controllers\Web\Backend\SystemSettingsController;
use App\Http\Controllers\Web\Backend\UserController;
use App\Http\Controllers\Web\Backend\TeamController;
use App\Http\Controllers\Web\Backend\ContactController;
use App\Http\Controllers\Web\Backend\ContactListController;
use App\Http\Controllers\Web\Backend\EmailTemplateController;
use App\Http\Controllers\Web\Backend\SmtpController;
use App\Http\Controllers\Web\Backend\CampaignController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:sanctum', 'admin'])->prefix('admin')->group(function () {

    Route::get('/dashboard', [DashboardController::class, 'index'])->name('admin.dashboard.index');

    // User APIs controller 
    Route::get('/users/search', [UserController::class, 'search'])->name('admin.users.search');
    Route::get('/users', [UserController::class, 'index'])->name('admin.user.index');
    Route::get('/users/create', [UserController::class, 'create'])->name('admin.users.create');
    Route::post('/users', [UserController::class, 'store'])->name('admin.users.store');
    Route::get('/user/edit/{id}', [UserController::class, 'edit'])->name('admin.users.edit');
    Route::get('/user/show/{id}', [UserController::class, 'show'])->name('admin.users.show');
    Route::put('/users/{id}', [UserController::class, 'update'])->name('admin.users.update');
    Route::delete('/users/{user}', [UserController::class, 'destroy'])->name('admin.users.destroy');
    Route::get('users/{user}/sessions', [UserController::class, 'sessions'])->name('admin.users.sessions');

    // CRM Routes
    Route::resource('teams', TeamController::class);
    Route::post('/teams/{team}/members', [TeamController::class, 'addMember'])->name('admin.teams.members.add');
    Route::delete('/teams/{team}/members/{user}', [TeamController::class, 'removeMember'])->name('admin.teams.members.remove');
    Route::resource('contacts', ContactController::class);
    Route::resource('contact-lists', ContactListController::class);
    
    // Bulk add contacts to a list and search available contacts (Select2)
    Route::get('contact-lists/{id}/available-contacts', [ContactListController::class, 'availableContacts'])
        ->name('admin.contact-lists.available-contacts');
    Route::post('contact-lists/{id}/add-contacts', [ContactListController::class, 'addContacts'])
        ->name('admin.contact-lists.add-contacts');
    Route::post('contact-lists/{id}/remove-contacts', [ContactListController::class, 'removeContacts'])
        ->name('admin.contact-lists.remove-contacts');

    Route::resource('email-templates', EmailTemplateController::class);
    Route::resource('smtps', SmtpController::class);
    Route::resource('campaigns', CampaignController::class);


    // System setting here 
    Route::get('/settings/system', [SystemSettingsController::class, 'index'])->name('admin.settings.system.index');
    Route::post('/settings/system/update', [SystemSettingsController::class, 'update'])->name('admin.settings.system.update');


    Route::get('/settings/smtp', [SystemSettingsController::class, 'smtp'])->name('admin.settings.smtp');
    Route::post('/settings/smtp/update', [SystemSettingsController::class, 'updateSmtp'])->name('admin.settings.smtp.update');
    Route::get('/settings/stripe', [SystemSettingsController::class, 'stripe'])->name('admin.settings.stripe');
    Route::post('/settings/stripe/update', [SystemSettingsController::class, 'updateStripe'])->name('admin.settings.stripe.update');


    //profile routes and controller
    Route::get('/profile', [ProfileController::class, 'index'])->name('admin.profile.index');
    Route::put('/profile', [ProfileController::class, 'update'])->name('admin.profile.update');
    Route::put('/profile/password', [ProfileController::class, 'updatePassword'])->name('admin.profile.password.update');

    //Dynamic Pages routes and controller
    Route::get('/page/{slug}', [DynamicPageController::class, 'dynamicPage'])->name('admin.page.index');
    Route::post('/page/update/{slug}', [DynamicPageController::class, 'updatePage'])->name('admin.page.update');

    //profile routes and controller
    Route::get('/faq/list', [FaqController::class, 'index'])->name('admin.faq.index');
    Route::get('/faq/create', [FaqController::class, 'create'])->name('admin.faq.create');
    Route::post('/faq/store', [FaqController::class, 'store'])->name('admin.faq.store');
    Route::get('/faq/edit/{id}', [FaqController::class, 'edit'])->name('admin.faq.edit');
    Route::post('/faq/update/{id}', [FaqController::class, 'update'])->name('admin.faq.update');
    Route::delete('/faq/delete/{id}', [FaqController::class, 'destroy'])->name('admin.faq.delete');

    //Logs controller
    Route::get('/logs', [LogController::class, 'index'])->name('admin.log.index');
    Route::delete('/logs', [LogController::class, 'clear'])->name('admin.log.clear');

    Route::get('/queues', [QueueController::class, 'index'])->name('admin.queues.index');
    Route::get('/failed-jobs', [QueueController::class, 'failed'])->name('admin.failed-jobs.index');
    Route::post('/failed-jobs/{id}/retry', [QueueController::class, 'retry'])->name('admin.failed-jobs.retry');
    Route::delete('/failed-jobs/{id}', [QueueController::class, 'destroy'])->name('admin.failed-jobs.destroy');
});
