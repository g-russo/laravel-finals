<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\AccommodationController;
use App\Http\Controllers\AmenityController;
use App\Http\Controllers\PackageController;
use App\Http\Controllers\WelcomeController;
use App\Http\Controllers\PublicAccommodationController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ReservationController;

// Public routes
Route::get('/', [WelcomeController::class, 'index'])->name('home');
Route::get('/accommodations/{id}', [PublicAccommodationController::class, 'show'])->name('accommodation.show');

// This section has been moved to the consolidated admin routes below

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

    // Accommodation routes
    Route::get('accommodations', [AccommodationController::class, 'index'])->name('admin.accommodations.index');
    Route::get('accommodations/archive', [AccommodationController::class, 'archive'])->name('admin.accommodations.archive');
    Route::post('accommodations', [AccommodationController::class, 'store'])->name('admin.accommodations.store');
    Route::get('accommodations/{accommodation}', [AccommodationController::class, 'show'])->name('admin.accommodations.show');
    Route::get('accommodations/{accommodation}/edit', [AccommodationController::class, 'edit'])->name('admin.accommodations.edit');
    Route::put('accommodations/{accommodation}', [AccommodationController::class, 'update'])->name('admin.accommodations.update');
    Route::post('accommodations/{accommodation}', [AccommodationController::class, 'update'])->name('admin.accommodations.update.post'); // For file uploads with _method
    Route::delete('accommodations/{accommodation}', [AccommodationController::class, 'destroy'])->name('admin.accommodations.destroy');
    Route::post('accommodations/{id}/restore', [AccommodationController::class, 'restore'])->name('admin.accommodations.restore');
    Route::delete('accommodations/{id}/force-delete', [AccommodationController::class, 'forceDelete'])->name('admin.accommodations.force-delete');

    // Package routes
    Route::get('packages', [PackageController::class, 'index'])->name('admin.packages.index');
    Route::get('packages/create', [PackageController::class, 'create'])->name('admin.packages.create');
    Route::get('packages/archive', [PackageController::class, 'archive'])->name('admin.packages.archive');
    Route::post('packages', [PackageController::class, 'store'])->name('admin.packages.store');
    Route::get('packages/{package}', [PackageController::class, 'show'])->name('admin.packages.show');
    Route::get('packages/{package}/edit', [PackageController::class, 'edit'])->name('admin.packages.edit');
    Route::put('packages/{package}', [PackageController::class, 'update'])->name('admin.packages.update');
    Route::post('packages/{package}', [PackageController::class, 'update'])->name('admin.packages.update.post'); // For file uploads with _method
    Route::delete('packages/{package}', [PackageController::class, 'destroy'])->name('admin.packages.destroy');
    Route::post('packages/{id}/restore', [PackageController::class, 'restore'])->name('admin.packages.restore');
    Route::delete('packages/{id}/force-delete', [PackageController::class, 'forceDelete'])->name('admin.packages.force-delete');

    // User management routes
    Route::get('users', [UserController::class, 'index'])->name('admin.users.index');
    Route::get('users/trashed', [UserController::class, 'trashed'])->name('admin.users.trashed');
    Route::post('users', [UserController::class, 'store'])->name('admin.users.store');
    Route::get('users/{id}/edit', [UserController::class, 'edit'])->name('admin.users.edit');
    Route::put('users/{id}', [UserController::class, 'update'])->name('admin.users.update');
    Route::post('users/{id}', [UserController::class, 'update'])->name('admin.users.update.post'); // For file uploads with _method
    Route::delete('users/{id}', [UserController::class, 'destroy'])->name('admin.users.destroy');

    // Soft delete routes
    Route::post('/users/{id}/restore', [UserController::class, 'restore'])->name('admin.users.restore');
    Route::delete('/users/{id}/force-delete', [UserController::class, 'forceDelete'])->name('admin.users.force-delete');

    // Reservation management routes
    Route::get('reservations', [ReservationController::class, 'admin'])->name('admin.reservations.index');
    Route::get('reservations/cancelled', [ReservationController::class, 'cancelled'])->name('admin.reservations.cancelled');
    Route::post('reservations/{reservation}/confirm', [ReservationController::class, 'confirm'])->name('admin.reservations.confirm');
    Route::delete('reservations/{reservation}', [ReservationController::class, 'destroy'])->name('admin.reservations.destroy');

    // Logs management route
    Route::get('logs', [\App\Http\Controllers\Admin\LogController::class, 'index'])->name('admin.logs.index');
});

// User reservation routes - authenticated users only
Route::middleware(['auth', 'verified'])->prefix('reservations')->group(function () {
    Route::get('/', [ReservationController::class, 'index'])->name('reservations.index');
    Route::get('/create', [ReservationController::class, 'create'])->name('reservations.create');
    Route::post('/', [ReservationController::class, 'store'])->name('reservations.store');
    Route::get('/{reservation}', [ReservationController::class, 'show'])->name('reservations.show');
    Route::post('/{reservation}/cancel', [ReservationController::class, 'cancel'])->name('reservations.cancel');
    Route::post('/check-availability', [ReservationController::class, 'checkAvailability'])->name('reservations.check-availability');
});

// Customer profile routes
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/profile', [\App\Http\Controllers\ProfileController::class, 'index'])->name('profile');
    Route::put('/profile', [\App\Http\Controllers\ProfileController::class, 'update'])->name('customer.profile.update');
    Route::post('/profile', [\App\Http\Controllers\ProfileController::class, 'update'])->name('customer.profile.update.post');
    Route::put('/profile/password', [\App\Http\Controllers\ProfileController::class, 'updatePassword'])->name('customer.profile.password');
});

// Payment routes
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/payment', [\App\Http\Controllers\PaymentController::class, 'index'])->name('payment.index');
    Route::post('/payments/{reservation}', [\App\Http\Controllers\PaymentController::class, 'store'])->name('payments.store');
});

// Redirect dashboard to admin dashboard for backward compatibility
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', DashboardController::class)->name('dashboard');
});

require __DIR__ . '/admin-auth.php';
require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
