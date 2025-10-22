<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\AccommodationController;
use App\Http\Controllers\AmenityController;
use App\Http\Controllers\WelcomeController;
use App\Http\Controllers\PublicAccommodationController;

// Public routes
Route::get('/', [WelcomeController::class, 'index'])->name('home');
Route::get('/accommodations/{id}', [PublicAccommodationController::class, 'show'])->name('accommodation.show');

// Admin-only routes
Route::middleware(['auth', 'verified', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', DashboardController::class)->name('dashboard');
    Route::resource('accommodations', AccommodationController::class);
    
    // Amenities management routes
    Route::get('/amenities', [AmenityController::class, 'manage'])->name('amenities.index');
    Route::post('/amenities', [AmenityController::class, 'store'])->name('amenities.store');
    Route::get('/amenities/{amenity}', [AmenityController::class, 'show'])->name('amenities.show');
    Route::put('/amenities/{amenity}', [AmenityController::class, 'update'])->name('amenities.update');
    Route::delete('/amenities/{amenity}', [AmenityController::class, 'destroy'])->name('amenities.destroy');
    
    // API routes for amenities (for AJAX calls)
    Route::prefix('api')->name('api.')->group(function () {
        Route::get('/amenities', [AmenityController::class, 'index'])->name('amenities.index');
        Route::post('/amenities/{amenity}', [AmenityController::class, 'update'])->name('amenities.update');
    });
});

// Redirect dashboard to admin dashboard for backward compatibility
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', function () {
        if (Auth::user()->role === 'admin') {
            return redirect()->route('admin.dashboard');
        }
        abort(403, 'Unauthorized. Admin access required.');
    })->name('dashboard');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
