<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\AccommodationController;
use App\Http\Controllers\AmenityController;
use App\Http\Controllers\WelcomeController;
use App\Http\Controllers\PublicAccommodationController;
use App\Http\Controllers\UserController;

// Public routes
Route::get('/', [WelcomeController::class, 'index'])->name('home');
Route::get('/accommodations/{id}', [PublicAccommodationController::class, 'show'])->name('accommodation.show');

// Admin-only routes
Route::middleware(['auth', 'verified', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('dashboard', DashboardController::class)->name('dashboard');

    // Accommodation routes
    Route::get('accommodations', [AccommodationController::class, 'index'])->name('accommodations.index');
    Route::post('accommodations', [AccommodationController::class, 'store'])->name('accommodations.store');
    Route::get('accommodations/{accommodation}', [AccommodationController::class, 'show'])->name('accommodations.show');
    Route::get('accommodations/{accommodation}/edit', [AccommodationController::class, 'edit'])->name('accommodations.edit');
    Route::put('accommodations/{accommodation}', [AccommodationController::class, 'update'])->name('accommodations.update');
    Route::post('accommodations/{accommodation}', [AccommodationController::class, 'update'])->name('accommodations.update.post'); // For file uploads with _method
    Route::delete('accommodations/{accommodation}', [AccommodationController::class, 'destroy'])->name('accommodations.destroy');

    // User management routes
    Route::get('users', [UserController::class, 'index'])->name('users.index');
    Route::get('users/trashed', [UserController::class, 'trashed'])->name('users.trashed');
    Route::post('users', [UserController::class, 'store'])->name('users.store');
    Route::get('users/{id}/edit', [UserController::class, 'edit'])->name('users.edit');
    Route::put('users/{id}', [UserController::class, 'update'])->name('users.update');
    Route::post('users/{id}', [UserController::class, 'update'])->name('users.update.post'); // For file uploads with _method
    Route::post('users/{id}/restore', [UserController::class, 'restore'])->name('users.restore');
    Route::delete('users/{id}', [UserController::class, 'destroy'])->name('users.destroy');

    // Amenities management routes
    Route::get('amenities', [AmenityController::class, 'manage'])->name('amenities.index');
    Route::post('amenities', [AmenityController::class, 'store'])->name('amenities.store');
    Route::get('amenities/{amenity}', [AmenityController::class, 'show'])->name('amenities.show');
    Route::put('amenities/{amenity}', [AmenityController::class, 'update'])->name('amenities.update');
    Route::post('amenities/{amenity}', [AmenityController::class, 'update'])->name('amenities.update.post');
    Route::delete('amenities/{amenity}', [AmenityController::class, 'destroy'])->name('amenities.destroy');

    // API routes for amenities (for AJAX calls)
    Route::prefix('api')->name('api.')->group(function () {
        Route::get('amenities', [AmenityController::class, 'index'])->name('amenities.index');
        Route::post('amenities/{amenity}', [AmenityController::class, 'update'])->name('amenities.update');
    });
});

// Redirect dashboard to admin dashboard for backward compatibility
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        if (Auth::user()->role === 'admin') {
            return redirect()->route('admin.dashboard');
        }
        abort(403, 'Unauthorized. Admin access required.');
    })->name('dashboard');
});

require __DIR__ . '/admin-auth.php';
require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
