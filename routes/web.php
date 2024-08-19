<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use Illuminate\Support\Facades\Route;

Route::post('login', [AuthenticatedSessionController::class, 'store']);
Route::post('logout', [AuthenticatedSessionController::class, 'destroy']);


// pointing any route to the dashboard view
// this will let the Vue code handle the routing
Route::view('/{any?}', 'dashboard')
    ->where('any', '.*');
