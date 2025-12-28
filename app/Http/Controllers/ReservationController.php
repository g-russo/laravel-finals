<?php

namespace App\Http\Controllers;

use App\Models\Reservation;
use App\Models\Accommodation;
use App\Models\Package;
use App\Models\Amenity;
use App\Models\User;
use App\Services\BookingValidationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Carbon\Carbon;

class ReservationController extends Controller
{
    protected $validationService;

    public function __construct(BookingValidationService $validationService)
    {
        $this->validationService = $validationService;
    }

    /**
     * Display reservations index
     */
    public function index()
    {
        $reservations = Reservation::with(['user', 'accommodation', 'package'])
            ->where('user_id', Auth::id())
            ->orderBy('check_in_date', 'desc')
            ->paginate(10);

        return Inertia::render('Reservations/Index', [
            'reservations' => $reservations
        ]);
    }

    /**
     * Show booking form
     */
    public function create()
    {
        $accommodations = Accommodation::where('availability_status', 'available')
            ->get()
            ->map(function ($accommodation) {
                return [
                    'id' => $accommodation->accommodation_id,
                    'name' => $accommodation->accommodation_name,
                    'capacity' => $accommodation->capacity,
                    'price_per_night' => $accommodation->price_per_night,
                    'description' => $accommodation->description,
                ];
            });

        $packages = Package::active()
            ->with(['accommodations', 'amenities'])
            ->get()
            ->map(function ($package) {
                return [
                    'id' => $package->package_id,
                    'name' => $package->package_name,
                    'price' => $package->price,
                    'max_guests' => $package->max_guests,
                    'description' => $package->description,
                    'accommodations' => $package->accommodations,
                    'amenities' => $package->amenities,
                ];
            });

        $amenities = Amenity::all()->map(function ($amenity) {
            return [
                'id' => $amenity->amenity_id,
                'name' => $amenity->amenity_name,
                'price' => $amenity->price_per_use,
                'description' => $amenity->description,
            ];
        });

        $bookingTypes = collect([
            'day_tour' => $this->validationService->getBookingTypeDetails('day_tour'),
            'night_tour' => $this->validationService->getBookingTypeDetails('night_tour'),
            'overnight' => $this->validationService->getBookingTypeDetails('overnight'),
            'alternative_overnight' => $this->validationService->getBookingTypeDetails('alternative_overnight'),
        ]);

        return Inertia::render('Reservations/Create', [
            'accommodations' => $accommodations,
            'packages' => $packages,
            'amenities' => $amenities,
            'bookingTypes' => $bookingTypes,
        ]);
    }

    /**
     * Check availability for accommodation
     */
    public function checkAvailability(Request $request)
    {
        $validated = $request->validate([
            'accommodation_id' => 'required|exists:accommodations,accommodation_id',
            'check_in_date' => 'required|date',
            'check_out_date' => 'required|date|after:check_in_date',
            'booking_type' => 'required|in:day_tour,night_tour,overnight,alternative_overnight',
        ]);

        $result = $this->validationService->isAccommodationAvailable(
            $validated['accommodation_id'],
            Carbon::parse($validated['check_in_date']),
            Carbon::parse($validated['check_out_date']),
            $validated['booking_type']
        );

        return response()->json($result);
    }

    /**
     * Store new reservation
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'accommodation_id' => 'nullable|exists:accommodations,accommodation_id',
            'package_id' => 'nullable|exists:packages,package_id',
            'check_in_date' => 'required|date',
            'check_out_date' => 'required|date|after:check_in_date',
            'booking_type' => 'required|in:day_tour,night_tour,overnight,alternative_overnight',
            'number_of_guests' => 'required|integer|min:1',
            'special_requests' => 'nullable|string',
            'amenities' => 'nullable|array',
            'amenities.*.amenity_id' => 'required|exists:amenities,amenity_id',
            'amenities.*.booking_date' => 'required|date',
        ]);

        // Validate at least one booking option is selected
        if (empty($validated['accommodation_id']) && empty($validated['package_id'])) {
            return back()->withErrors([
                'booking' => 'Please select either an accommodation or a package.'
            ]);
        }

        // Comprehensive validation
        $validationResult = $this->validationService->validateBooking($validated);

        if (!$validationResult['valid']) {
            return back()->withErrors([
                'booking' => $validationResult['errors']
            ])->withInput();
        }

        DB::beginTransaction();

        try {
            // Get booking times
            $bookingDetails = $this->validationService->getBookingTypeDetails($validated['booking_type']);

            // Calculate prices
            $accommodationPrice = 0;
            $packagePrice = 0;
            $nights = 1;

            if ($validated['accommodation_id']) {
                $accommodation = Accommodation::find($validated['accommodation_id']);
                // Calculate number of nights
                $checkIn = Carbon::parse($validated['check_in_date']);
                $checkOut = Carbon::parse($validated['check_out_date']);
                $nights = max(1, $checkOut->diffInDays($checkIn));
                $accommodationPrice = $accommodation->price_per_night * $nights;
            }

            if ($validated['package_id']) {
                $package = Package::find($validated['package_id']);
                $packagePrice = $package->price;
            }

            // Create reservation
            $reservation = Reservation::create([
                'user_id' => Auth::id(),
                'accommodation_id' => $validated['accommodation_id'] ?? null,
                'package_id' => $validated['package_id'] ?? null,
                'check_in_date' => $validated['check_in_date'],
                'check_out_date' => $validated['check_out_date'],
                'booking_type' => $validated['booking_type'],
                'start_time' => $bookingDetails['start_time'],
                'end_time' => $bookingDetails['end_time'],
                'number_of_guests' => $validated['number_of_guests'],
                'accommodation_price' => $accommodationPrice,
                'package_price' => $packagePrice,
                'amenities_price' => 0, // Will calculate after adding amenities
                'total_price' => 0, // Will calculate after adding amenities
                'status' => 'pending',
                'payment_status' => 'unpaid',
                'special_requests' => $validated['special_requests'] ?? null,
            ]);

            // Add amenities if selected
            $amenitiesPrice = 0;
            if (isset($validated['amenities']) && is_array($validated['amenities'])) {
                foreach ($validated['amenities'] as $amenityData) {
                    $amenity = Amenity::find($amenityData['amenity_id']);

                    if (!$amenity) {
                        continue;
                    }

                    // Skip if amenity is included in package
                    if (
                        $validated['package_id'] &&
                        $this->validationService->isAmenityIncludedInPackage($validated['package_id'], $amenity->amenity_id)
                    ) {
                        continue;
                    }

                    $reservation->amenities()->attach($amenity->amenity_id, [
                        'price' => $amenity->price_per_use,
                        'booking_date' => $amenityData['booking_date'],
                        'start_time' => $bookingDetails['start_time'],
                        'end_time' => $bookingDetails['end_time'],
                    ]);

                    $amenitiesPrice += $amenity->price_per_use;
                }
            }

            // Update final prices
            $totalPrice = $accommodationPrice + $packagePrice + $amenitiesPrice;
            $reservation->update([
                'amenities_price' => $amenitiesPrice,
                'total_price' => $totalPrice,
            ]);

            DB::commit();

            // Redirect to payment page after successful reservation
            return redirect()->route('payment.index')->with('success', 'Reservation created successfully! Please complete your payment.');
        } catch (\Exception $e) {
            DB::rollBack();

            return back()->withErrors([
                'booking' => 'An error occurred while creating your reservation. Please try again.'
            ])->withInput();
        }
    }

    /**
     * Display reservation details
     */
    public function show(Reservation $reservation)
    {
        // Ensure user can only view their own reservations (or admin)
        /** @var \App\Models\User $user */
        $user = Auth::user();
        if ($reservation->user_id !== Auth::id() && !$user->canAccessAdmin()) {
            abort(403);
        }

        $reservation->load(['user', 'accommodation', 'package', 'amenities']);

        return Inertia::render('Reservations/Show', [
            'reservation' => [
                'id' => $reservation->reservation_id,
                'check_in_date' => $reservation->check_in_date->format('Y-m-d'),
                'check_out_date' => $reservation->check_out_date->format('Y-m-d'),
                'booking_type' => $reservation->booking_type,
                'booking_type_label' => $this->validationService->getBookingTypeDetails($reservation->booking_type)['label'],
                'start_time' => $reservation->start_time,
                'end_time' => $reservation->end_time,
                'number_of_guests' => $reservation->number_of_guests,
                'status' => $reservation->status,
                'accommodation' => $reservation->accommodation,
                'package' => $reservation->package,
                'amenities' => $reservation->amenities,
                'accommodation_price' => $reservation->accommodation_price,
                'package_price' => $reservation->package_price,
                'amenities_price' => $reservation->amenities_price,
                'total_price' => $reservation->total_price,
                'special_requests' => $reservation->special_requests,
                'created_at' => $reservation->created_at->format('M d, Y'),
                'confirmed_at' => $reservation->confirmed_at?->format('M d, Y'),
                'cancelled_at' => $reservation->cancelled_at?->format('M d, Y'),
            ]
        ]);
    }

    /**
     * Cancel reservation
     */
    public function cancel(Reservation $reservation)
    {
        // Ensure user can only cancel their own reservations
        /** @var \App\Models\User $user */
        $user = Auth::user();
        if ($reservation->user_id !== Auth::id() && !$user->canAccessAdmin()) {
            abort(403);
        }

        if ($reservation->status !== 'pending' && $reservation->status !== 'confirmed') {
            return back()->withErrors([
                'cancellation' => 'This reservation cannot be cancelled.'
            ]);
        }

        $reservation->update([
            'status' => 'cancelled',
            'cancelled_at' => now(),
        ]);

        return back()->with('success', 'Reservation cancelled successfully.');
    }

    /**
     * Admin: Confirm reservation
     * Note: Reservations can only be confirmed after payment is completed
     */
    public function confirm(Reservation $reservation)
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();
        if (!$user->canAccessAdmin()) {
            abort(403);
        }

        if ($reservation->status !== 'pending') {
            return back()->withErrors([
                'confirmation' => 'Only pending reservations can be confirmed.'
            ]);
        }

        // Check if payment is completed before allowing confirmation
        if ($reservation->payment_status !== 'paid') {
            return back()->withErrors([
                'confirmation' => 'Reservation can only be confirmed after payment is completed.'
            ]);
        }

        $reservation->update([
            'status' => 'confirmed',
            'confirmed_at' => now(),
        ]);

        return back()->with('success', 'Reservation confirmed successfully.');
    }

    /**
     * Admin: List all reservations
     */
    public function admin()
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();
        if (!$user->canAccessAdmin()) {
            abort(403);
        }

        // Get all reservations for table view
        $reservations = Reservation::with(['user', 'accommodation', 'package'])
            ->orderBy('check_in_date', 'desc')
            ->paginate(20)
            ->through(function ($reservation) {
                // Determine booking name
                $bookingName = 'N/A';
                $packageName = null;
                if ($reservation->accommodation) {
                    $bookingName = $reservation->accommodation->accommodation_name;
                }
                if ($reservation->package) {
                    $packageName = $reservation->package->package_name;
                    if (!$reservation->accommodation) {
                        $bookingName = $packageName . ' (Package)';
                    }
                }

                return [
                    'reservation_id' => $reservation->reservation_id,
                    'user' => $reservation->user,
                    'accommodation' => $reservation->accommodation,
                    'package' => $reservation->package,
                    'booking_name' => $bookingName,
                    'package_name' => $packageName,
                    'check_in_date' => $reservation->check_in_date->format('Y-m-d'),
                    'check_out_date' => $reservation->check_out_date->format('Y-m-d'),
                    'number_of_guests' => $reservation->number_of_guests,
                    'total_cost' => $reservation->total_price,
                    'status' => $reservation->status,
                    'payment_status' => $reservation->payment_status,
                ];
            });

        // Get calendar events (all reservations for calendar view)
        $calendarEvents = Reservation::with(['user', 'accommodation', 'package'])
            ->where('status', '!=', 'cancelled')
            ->get()
            ->map(function ($reservation) {
                // Determine booking name for calendar
                $bookingName = 'Unknown';
                if ($reservation->accommodation) {
                    $bookingName = $reservation->accommodation->accommodation_name;
                } elseif ($reservation->package) {
                    $bookingName = $reservation->package->package_name . ' (Package)';
                }

                return [
                    'id' => $reservation->reservation_id,
                    'title' => $bookingName,
                    'start' => $reservation->check_in_date->format('Y-m-d'),
                    'end' => $reservation->check_out_date->format('Y-m-d'),
                    'accommodation_name' => $bookingName,
                    'package_name' => $reservation->package?->package_name ?? null,
                    'guest_name' => $reservation->user->full_name ?? $reservation->user->name ?? 'N/A',
                    'guests' => $reservation->number_of_guests,
                    'status' => $reservation->status,
                    'payment_status' => $reservation->status === 'confirmed' ? 'paid' : ($reservation->payment_status ?? 'unpaid'),
                    'total_cost' => $reservation->total_price,
                ];
            });

        // Get accommodations for filtering
        $accommodations = Accommodation::select('accommodation_id', 'accommodation_name')
            ->orderBy('accommodation_name')
            ->get();

        // Get cancelled reservations count
        $cancelledCount = Reservation::where('status', 'cancelled')->count();

        return Inertia::render('admin/Reservations/Index', [
            'reservations' => $reservations,
            'calendarEvents' => $calendarEvents,
            'accommodations' => $accommodations,
            'cancelledCount' => $cancelledCount,
        ]);
    }

    /**
     * Admin: Delete a cancelled reservation
     */
    public function destroy(Reservation $reservation)
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();
        if (!$user->canAccessAdmin()) {
            abort(403);
        }

        // Only allow deleting cancelled reservations
        if ($reservation->status !== 'cancelled') {
            return back()->withErrors([
                'deletion' => 'Only cancelled reservations can be deleted.'
            ]);
        }

        // Delete associated amenities first
        $reservation->amenities()->detach();

        // Delete the reservation
        $reservation->delete();

        return back()->with('success', 'Reservation deleted successfully.');
    }

    /**
     * Admin: List all cancelled reservations
     */
    public function cancelled()
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();
        if (!$user->canAccessAdmin()) {
            abort(403);
        }

        $reservations = Reservation::with(['user', 'accommodation', 'package'])
            ->where('status', 'cancelled')
            ->orderBy('updated_at', 'desc')
            ->paginate(20)
            ->through(function ($reservation) {
                $bookingName = 'N/A';
                $packageName = null;
                if ($reservation->accommodation) {
                    $bookingName = $reservation->accommodation->accommodation_name;
                }
                if ($reservation->package) {
                    $packageName = $reservation->package->package_name;
                    if (!$reservation->accommodation) {
                        $bookingName = $packageName . ' (Package)';
                    }
                }

                return [
                    'reservation_id' => $reservation->reservation_id,
                    'user' => $reservation->user,
                    'accommodation' => $reservation->accommodation,
                    'package' => $reservation->package,
                    'booking_name' => $bookingName,
                    'package_name' => $packageName,
                    'check_in_date' => $reservation->check_in_date->format('Y-m-d'),
                    'check_out_date' => $reservation->check_out_date->format('Y-m-d'),
                    'number_of_guests' => $reservation->number_of_guests,
                    'total_cost' => $reservation->total_price,
                    'status' => $reservation->status,
                    'cancelled_at' => $reservation->updated_at->format('Y-m-d H:i'),
                ];
            });

        return Inertia::render('admin/Reservations/Cancelled', [
            'reservations' => $reservations,
        ]);
    }
}
