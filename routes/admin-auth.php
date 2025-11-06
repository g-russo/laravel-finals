<?php

use App\Http\Controllers\Auth\AdminAuthenticatedSessionController;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;

Route::prefix('admin')->name('admin.')->group(function () {
    // Root admin route - redirect based on auth status
    Route::get('/', function () {
        if (Auth::check()) {
            $user = Auth::user();
            // Only allow admin and employee to access admin area
            if ($user->role === 'admin' || $user->role === 'employee') {
                return redirect()->route('admin.dashboard');
            }
            // Customers should not access admin area
            Auth::logout();
            return redirect()->route('admin.login')->with('error', 'Access denied. This area is for staff members only.');
        }
        return redirect()->route('admin.login');
    });

    Route::middleware('guest')->group(function () {
        Route::get('login', [AdminAuthenticatedSessionController::class, 'create'])
            ->name('login');

        Route::post('login', [AdminAuthenticatedSessionController::class, 'store'])
            ->name('login.store');
    });

    Route::middleware('auth')->group(function () {
        Route::post('logout', [AdminAuthenticatedSessionController::class, 'destroy'])
            ->name('logout');
    });
});
