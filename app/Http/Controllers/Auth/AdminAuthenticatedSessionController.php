<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class AdminAuthenticatedSessionController extends Controller
{
    /**
     * Display the admin login view.
     */
    public function create(): Response
    {
        return Inertia::render('auth/admin-login', [
            'status' => session('status'),
        ]);
    }

    /**
     * Handle an incoming admin authentication request.
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'email' => 'required|string', // This field accepts either email or username
            'password' => 'required|string',
        ]);

        $login = $request->input('email');
        $remember = $request->boolean('remember');

        // Find user by email or username
        $user = \App\Models\User::where('email', $login)
            ->orWhere('username', $login)
            ->first();

        if ($user && \Illuminate\Support\Facades\Hash::check($request->password, $user->password)) {
            // Check if user is admin or employee
            if ($user->role === 'admin' || $user->role === 'employee') {
                Auth::login($user, $remember);
                $request->session()->regenerate();

                return redirect()->intended(route('admin.dashboard'));
            }

            // If customer tries to login via admin portal, don't log them in
            return back()->withErrors([
                'email' => 'Access denied. This portal is for staff members only.',
            ])->onlyInput('email');
        }

        return back()->withErrors([
            'email' => 'The provided credentials do not match our records.',
        ])->onlyInput('email');
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/admin/login');
    }
}
