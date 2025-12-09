<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    public function create(): Response
    {
        return Inertia::render('auth/register');
    }

    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'full_name' => [
                'required',
                'string',
                'max:255',
                'regex:/^[a-zA-Z\s]+$/', // Only letters and spaces
            ],
            'username' => [
                'required',
                'string',
                'max:255',
                'unique:users',
                'alpha_dash', // Letters, numbers, dashes, and underscores only
            ],
            'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
            'phone_number' => [
                'required',
                'string',
                'max:20',
                'regex:/^[\d\s\-\+\(\)]+$/', // Valid phone number format
            ],
            'address' => 'required|string|max:500',
            'city' => 'required|string|max:100',
            'country' => 'required|string|max:100',
            'date_of_birth' => [
                'required',
                'date',
                'before:-18 years', // Must be at least 18 years old
            ],
            'password' => [
                'required',
                'confirmed',
                'min:8',
                'regex:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]+$/', // Min 8, lowercase, uppercase, number, special char
            ],
        ], [
            'full_name.regex' => 'The full name must contain only letters and spaces.',
            'phone_number.regex' => 'The phone number format is invalid.',
            'date_of_birth.before' => 'You must be at least 18 years old to register.',
            'password.regex' => 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.',
        ]);

        $user = User::create([
            'full_name' => $request->full_name,
            'username' => $request->username,
            'email' => $request->email,
            'phone_number' => $request->phone_number,
            'address' => $request->address,
            'city' => $request->city,
            'country' => $request->country ?? 'Philippines',
            'date_of_birth' => $request->date_of_birth,
            'password' => Hash::make($request->password),
            'role' => 'customer',
        ]);

        event(new Registered($user));

        // Don't auto-login, user needs to verify email first
        // Auth::login($user);

        // Redirect to landing page with verification message
        return redirect()->route('welcome')->with('status', 'Registration successful! Please check your email to verify your account.');
    }
}
