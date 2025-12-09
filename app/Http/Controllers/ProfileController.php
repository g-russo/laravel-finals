<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Reservation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;

class ProfileController extends Controller
{
    /**
     * Display the user's profile with bookings and ratings.
     */
    public function index()
    {
        /** @var User $user */
        $user = Auth::user();
        
        // Get user's reservations with accommodation details
        $reservations = $user->reservations()
            ->with('accommodation')
            ->orderBy('check_in_date', 'desc')
            ->get()
            ->map(function ($reservation) {
                $checkInDate = \Carbon\Carbon::parse($reservation->check_in_date);
                $checkOutDate = \Carbon\Carbon::parse($reservation->check_out_date);
                $now = \Carbon\Carbon::now();
                
                return [
                    'id' => $reservation->id,
                    'accommodation' => [
                        'id' => $reservation->accommodation->id,
                        'name' => $reservation->accommodation->name,
                        'type' => $reservation->accommodation->type,
                        'images' => $reservation->accommodation->images,
                    ],
                    'check_in_date' => $checkInDate->format('M d, Y'),
                    'check_out_date' => $checkOutDate->format('M d, Y'),
                    'total_price' => $reservation->total_price,
                    'status' => $reservation->status,
                    'is_upcoming' => $checkInDate->isFuture(),
                    'is_past' => $checkOutDate->isPast(),
                    'can_rate' => $checkOutDate->isPast() && $reservation->status === 'confirmed',
                ];
            });

        return Inertia::render('customer/profile', [
            'user' => [
                'id' => $user->id,
                'full_name' => $user->full_name,
                'username' => $user->username,
                'email' => $user->email,
                'phone_number' => $user->phone_number,
                'country' => $user->country,
                'date_of_birth' => $user->date_of_birth ? \Carbon\Carbon::parse($user->date_of_birth)->format('Y-m-d') : '',
                'avatar' => $user->avatar,
            ],
            'reservations' => [
                'upcoming' => $reservations->where('is_upcoming', true)->values(),
                'past' => $reservations->where('is_past', true)->values(),
            ],
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(Request $request)
    {
        /** @var User $user */
        $user = Auth::user();
        
        $validated = $request->validate([
            'full_name' => ['required', 'string', 'max:255', 'regex:/^[a-zA-Z\s]+$/'],
            'username' => ['required', 'string', 'max:255', 'alpha_dash', 'unique:users,username,' . $user->id],
            'email' => ['required', 'email', 'max:255', 'unique:users,email,' . $user->id],
            'phone_number' => ['required', 'string', 'regex:/^[\d\s\-\+\(\)]+$/'],
            'country' => ['required', 'string', 'max:255'],
            'date_of_birth' => ['required', 'date', 'before:-18 years'],
            'avatar' => ['nullable', 'image', 'max:2048'],
        ]);

        // Handle avatar upload
        if ($request->hasFile('avatar')) {
            $file = $request->file('avatar');
            $filename = time() . '_' . $file->getClientOriginalName();
            $file->move(public_path('avatars'), $filename);
            $validated['avatar'] = 'avatars/' . $filename;
        }

        $user->update($validated);

        return redirect()->back()->with('success', 'Profile updated successfully!');
    }

    /**
     * Update the user's password.
     */
    public function updatePassword(Request $request)
    {
        $validated = $request->validate([
            'current_password' => ['required', 'current_password'],
            'password' => ['required', 'confirmed', Password::min(8)
                ->mixedCase()
                ->numbers()
                ->symbols()],
        ]);

        /** @var User $user */
        $user = Auth::user();
        $user->update([
            'password' => Hash::make($validated['password']),
        ]);

        return redirect()->back()->with('success', 'Password updated successfully!');
    }
}
