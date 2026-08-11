<?php

use App\Http\Controllers\API\Contact\ContactApiController;
use App\Http\Controllers\API\Contact\ContactListApiController;
use Illuminate\Support\Facades\Route;


Route::controller(ContactApiController::class)->middleware('auth:sanctum')->prefix('contact')->group(function () {
    Route::get('/list', 'index');
    Route::post('/store', 'store');
    Route::get('/{contacts:id}', 'show');
    Route::post('/update/{contact:id}', 'update');
    Route::delete('/{contact:id}', 'destroy');
    Route::delete('/', 'bulkDelete');
    Route::post('/add-to-list', 'addToList');
    Route::post('/remove-from-list', 'removeFromList');
    Route::post('/import', 'import');
    Route::get('/export/list', 'export');

});

// Contact Lists
Route::controller(ContactListApiController::class)->middleware('auth:sanctum')->prefix('contact-list')->group(function () {
    Route::get('/',        'index');   // GET    /api/v1/contact-list
    Route::post('/',       'store');   // POST   /api/v1/contact-list
    Route::get('/{id}',    'show');    // GET    /api/v1/contact-list/{id}
    Route::post('/update/{id}',    'update');  // PUT    /api/v1/contact-list/update/{id}
    Route::delete('/{id}', 'destroy'); // DELETE /api/v1/contact-list/{id}
});
