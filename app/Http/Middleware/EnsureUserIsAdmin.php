<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserIsAdmin
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // If user is not authenticated, redirect to admin login
        if (!$request->user()) {
            return redirect()->route('admin.login');
        }

        // If user is not admin or employee, log them out and deny access
        if ($request->user()->role !== 'admin' && $request->user()->role !== 'employee') {
            Auth::logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();

            return redirect()->route('admin.login')
                ->with('error', 'Access denied. This area is for staff members only.');
        }

        return $next($request);
    }
}
