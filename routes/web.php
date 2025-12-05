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
    Route::post('users', [UserController::class, 'store'])->name('users.store');
    Route::get('users/{id}/edit', [UserController::class, 'edit'])->name('users.edit');
    Route::put('users/{id}', [UserController::class, 'update'])->name('users.update');
    Route::post('users/{id}', [UserController::class, 'update'])->name('users.update.post'); // For file uploads with _method
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

// Admin routes - only admins and employees
Route::middleware(['auth', 'verified', 'admin'])->prefix('admin')->group(function () {
    Route::get('/dashboard', DashboardController::class)->name('admin.dashboard');
    
    // Amenities
    Route::get('/amenities', [AmenityController::class, 'manage'])->name('admin.amenities.index');
    Route::post('/amenities', [AmenityController::class, 'store'])->name('admin.amenities.store');
    Route::put('/amenities/{amenity}', [AmenityController::class, 'update'])->name('admin.amenities.update');
    Route::post('/amenities/{amenity}', [AmenityController::class, 'update'])->name('admin.amenities.update.post');
    Route::delete('/amenities/{amenity}', [AmenityController::class, 'destroy'])->name('admin.amenities.destroy');
    
    // Soft delete routes
    Route::post('/amenities/{id}/restore', [AmenityController::class, 'restore'])->name('admin.amenities.restore');
    Route::delete('/amenities/{id}/force-delete', [AmenityController::class, 'forceDelete'])->name('admin.amenities.force-delete');
    
    // Accommodations
    Route::get('/accommodations', [AccommodationController::class, 'index'])->name('admin.accommodations.index');
    Route::post('accommodations', [AccommodationController::class, 'store'])->name('admin.accommodations.store');
    Route::get('accommodations/{accommodation}', [AccommodationController::class, 'show'])->name('admin.accommodations.show');
    Route::get('accommodations/{accommodation}/edit', [AccommodationController::class, 'edit'])->name('admin.accommodations.edit');
    Route::put('accommodations/{accommodation}', [AccommodationController::class, 'update'])->name('admin.accommodations.update');
    Route::post('accommodations/{accommodation}', [AccommodationController::class, 'update'])->name('admin.accommodations.update.post'); // For file uploads with _method
    Route::delete('accommodations/{accommodation}', [AccommodationController::class, 'destroy'])->name('admin.accommodations.destroy');

    // User management routes
    Route::get('users', [UserController::class, 'index'])->name('admin.users.index');
    Route::post('users', [UserController::class, 'store'])->name('admin.users.store');
    Route::get('users/{id}/edit', [UserController::class, 'edit'])->name('admin.users.edit');
    Route::put('users/{id}', [UserController::class, 'update'])->name('admin.users.update');
    Route::post('users/{id}', [UserController::class, 'update'])->name('admin.users.update.post'); // For file uploads with _method
    Route::delete('users/{id}', [UserController::class, 'destroy'])->name('admin.users.destroy');

    // Soft delete routes
    Route::post('/users/{id}/restore', [UserController::class, 'restore'])->name('admin.users.restore');
    Route::delete('/users/{id}/force-delete', [UserController::class, 'forceDelete'])->name('admin.users.force-delete');
});

// Redirect dashboard to admin dashboard for backward compatibility
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', DashboardController::class)->name('dashboard');
});

require __DIR__ . '/admin-auth.php';
require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
