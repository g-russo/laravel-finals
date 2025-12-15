<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Models\Reservation;
use App\Models\Payment;

class PaymentController extends Controller
{
    /**
     * Display the payment page
     */
    public function index()
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        // Get the user's most recent pending reservation
        $reservation = Reservation::where('user_id', $user->id)
            ->where('status', 'pending')
            ->orderBy('created_at', 'desc')
            ->first();

        if ($reservation) {
            // Get the name - either accommodation or package
            $bookingName = 'N/A';
            if ($reservation->accommodation) {
                $bookingName = $reservation->accommodation->accommodation_name;
            } elseif ($reservation->package) {
                $bookingName = $reservation->package->package_name;
            }

            return Inertia::render('Payment', [
                'reservation' => [
                    'reservation_id' => $reservation->reservation_id,
                    'accommodation_name' => $bookingName,
                    'check_in_date' => $reservation->check_in_date->format('Y-m-d'),
                    'check_out_date' => $reservation->check_out_date->format('Y-m-d'),
                    'number_of_guests' => $reservation->number_of_guests,
                    'total_cost' => $reservation->total_price,
                    'status' => $reservation->status,
                ],
            ]);
        }

        return Inertia::render('Payment', [
            'reservation' => null,
        ]);
    }

    /**
     * Process payment
     */
    public function store(Request $request, Reservation $reservation)
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        // Verify the reservation belongs to the user
        if ($reservation->user_id !== $user->id) {
            return back()->withErrors(['error' => 'Unauthorized access to reservation.']);
        }

        $validated = $request->validate([
            'payment_method' => 'required|in:credit_card,bank_transfer,e_wallet',
            'card_number' => 'required_if:payment_method,credit_card',
            'card_name' => 'required_if:payment_method,credit_card',
            'expiry_date' => 'required_if:payment_method,credit_card',
            'cvv' => 'required_if:payment_method,credit_card',
            'billing_address' => 'nullable|string',
        ]);

        // Create payment record
        $payment = Payment::create([
            'reservation_id' => $reservation->reservation_id,
            'amount' => $reservation->total_price,
            'payment_method' => $validated['payment_method'],
            'payment_status' => 'completed',
            'transaction_id' => 'TXN-' . strtoupper(uniqid()),
            'paid_at' => now(),
        ]);

        // Update reservation status
        $reservation->update([
            'status' => 'confirmed',
            'payment_status' => 'paid',
        ]);

        return redirect()->route('profile')->with('success', 'Payment successful! Your booking is confirmed.');
    }
}
