<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;

// pointing any route to the dashboard view
// this will let the Vue code handle the routing
Route::view('/{any?}', 'dashboard')
    ->where('any', '.*');
