<?php

namespace App\Services;

use App\Models\Reservation;
use App\Models\Accommodation;
use App\Models\Amenity;
use App\Models\Package;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class BookingValidationService
{
    /**
     * Check if accommodation is available for the given dates and time slot
     */
    public function isAccommodationAvailable(
        int $accommodationId,
        Carbon $checkInDate,
        Carbon $checkOutDate,
        string $bookingType,
        ?int $excludeReservationId = null
    ): array {
        $times = Reservation::BOOKING_TYPES[$bookingType];

        $query = Reservation::where('accommodation_id', $accommodationId)
            ->whereIn('status', ['pending', 'confirmed'])
            ->where(function ($q) use ($checkInDate, $checkOutDate) {
                $q->whereBetween('check_in_date', [$checkInDate, $checkOutDate])
                    ->orWhereBetween('check_out_date', [$checkInDate, $checkOutDate])
                    ->orWhere(function ($q2) use ($checkInDate, $checkOutDate) {
                        $q2->where('check_in_date', '<=', $checkInDate)
                            ->where('check_out_date', '>=', $checkOutDate);
                    });
            });

        if ($excludeReservationId) {
            $query->where('reservation_id', '!=', $excludeReservationId);
        }

        $conflictingReservations = $query->get();

        // Check for time overlaps
        foreach ($conflictingReservations as $reservation) {
            if ($this->timeSlotsOverlap(
                $times['start'],
                $times['end'],
                $reservation->start_time,
                $reservation->end_time,
                $checkInDate,
                $checkOutDate,
                $reservation->check_in_date,
                $reservation->check_out_date
            )) {
                return [
                    'available' => false,
                    'message' => 'This accommodation is already booked for the selected dates and time slot.',
                    'conflicting_reservation' => $reservation
                ];
            }
        }

        return ['available' => true];
    }

    /**
     * Check if time slots overlap considering date changes for overnight bookings
     */
    private function timeSlotsOverlap(
        string $start1,
        string $end1,
        string $start2,
        string $end2,
        Carbon $date1Start,
        Carbon $date1End,
        Carbon $date2Start,
        Carbon $date2End
    ): bool {
        // If dates don't overlap at all, no conflict
        if ($date1End->lt($date2Start) || $date2End->lt($date1Start)) {
            return false;
        }

        // Check if dates overlap
        $datesOverlap = !($date1End->lt($date2Start) || $date1Start->gt($date2End));

        if (!$datesOverlap) {
            return false;
        }

        // For same-day bookings, check time overlap
        $start1Time = Carbon::parse($start1);
        $end1Time = Carbon::parse($end1);
        $start2Time = Carbon::parse($start2);
        $end2Time = Carbon::parse($end2);

        // Handle overnight time slots (end time is next day)
        if ($end1Time->lessThan($start1Time)) {
            $end1Time->addDay();
        }
        if ($end2Time->lessThan($start2Time)) {
            $end2Time->addDay();
        }

        // Check time overlap
        return !($end1Time->lte($start2Time) || $start1Time->gte($end2Time));
    }

    /**
     * Check if amenity is available (not a pool on Monday maintenance time)
     */
    public function isAmenityAvailable(Amenity $amenity, Carbon $date, string $startTime): array
    {
        // Check if it's a pool amenity
        $isPool = stripos($amenity->amenity_name, 'pool') !== false;

        if ($isPool && $date->isMonday()) {
            $maintenanceStart = Carbon::parse('08:00:00');
            $maintenanceEnd = Carbon::parse('14:00:00');
            $bookingStart = Carbon::parse($startTime);

            if ($bookingStart->between($maintenanceStart, $maintenanceEnd)) {
                return [
                    'available' => false,
                    'message' => 'Pools are closed on Mondays from 8:00 AM to 2:00 PM for routine maintenance.'
                ];
            }
        }

        return ['available' => true];
    }

    /**
     * Validate number of guests against accommodation capacity
     */
    public function validateGuestCapacity(int $accommodationId, int $numberOfGuests): array
    {
        $accommodation = Accommodation::find($accommodationId);

        if (!$accommodation) {
            return [
                'valid' => false,
                'message' => 'Accommodation not found.'
            ];
        }

        if ($numberOfGuests > $accommodation->capacity) {
            return [
                'valid' => false,
                'message' => "Number of guests ({$numberOfGuests}) exceeds accommodation capacity ({$accommodation->capacity})."
            ];
        }

        return ['valid' => true];
    }

    /**
     * Validate number of guests against package max guests
     */
    public function validatePackageGuestCapacity(int $packageId, int $numberOfGuests): array
    {
        $package = Package::find($packageId);

        if (!$package) {
            return [
                'valid' => false,
                'message' => 'Package not found.'
            ];
        }

        if ($numberOfGuests > $package->max_guests) {
            return [
                'valid' => false,
                'message' => "Number of guests ({$numberOfGuests}) exceeds package maximum ({$package->max_guests})."
            ];
        }

        return ['valid' => true];
    }

    /**
     * Check if amenity is included in package
     */
    public function isAmenityIncludedInPackage(?int $packageId, int $amenityId): bool
    {
        if (!$packageId) {
            return false;
        }

        $package = Package::find($packageId);

        if (!$package) {
            return false;
        }

        return $package->amenities()->where('package_amenities.amenity_id', $amenityId)->exists();
    }

    /**
     * Validate entire booking before creation
     */
    public function validateBooking(array $data): array
    {
        $errors = [];

        // Validate dates
        $checkIn = Carbon::parse($data['check_in_date']);
        $checkOut = Carbon::parse($data['check_out_date']);

        if ($checkIn->lt(Carbon::today())) {
            $errors[] = 'Check-in date cannot be in the past.';
        }

        if ($checkOut->lt($checkIn)) {
            $errors[] = 'Check-out date must be after check-in date.';
        }

        // Validate accommodation availability
        if (isset($data['accommodation_id'])) {
            $availabilityCheck = $this->isAccommodationAvailable(
                $data['accommodation_id'],
                $checkIn,
                $checkOut,
                $data['booking_type']
            );

            if (!$availabilityCheck['available']) {
                $errors[] = $availabilityCheck['message'];
            }

            // Validate guest capacity
            $capacityCheck = $this->validateGuestCapacity(
                $data['accommodation_id'],
                $data['number_of_guests']
            );

            if (!$capacityCheck['valid']) {
                $errors[] = $capacityCheck['message'];
            }
        }

        // Validate package if selected
        if (isset($data['package_id'])) {
            $packageCheck = $this->validatePackageGuestCapacity(
                $data['package_id'],
                $data['number_of_guests']
            );

            if (!$packageCheck['valid']) {
                $errors[] = $packageCheck['message'];
            }
        }

        // Validate amenities
        if (isset($data['amenities']) && is_array($data['amenities'])) {
            foreach ($data['amenities'] as $amenityData) {
                $amenity = Amenity::find($amenityData['amenity_id']);

                if ($amenity) {
                    $amenityCheck = $this->isAmenityAvailable(
                        $amenity,
                        Carbon::parse($amenityData['booking_date']),
                        $data['start_time'] ?? '08:00:00'
                    );

                    if (!$amenityCheck['available']) {
                        $errors[] = $amenityCheck['message'];
                    }

                    // Check if amenity is included in package
                    if (
                        isset($data['package_id']) &&
                        $this->isAmenityIncludedInPackage($data['package_id'], $amenityData['amenity_id'])
                    ) {
                        $errors[] = "Amenity '{$amenity->amenity_name}' is already included in your selected package.";
                    }
                }
            }
        }

        return [
            'valid' => empty($errors),
            'errors' => $errors
        ];
    }

    /**
     * Get booking type details
     */
    public function getBookingTypeDetails(string $bookingType): array
    {
        $types = [
            'day_tour' => [
                'label' => 'Day Tour',
                'description' => '8:00 AM - 5:00 PM',
                'start_time' => '08:00:00',
                'end_time' => '17:00:00',
                'overnight' => false,
            ],
            'night_tour' => [
                'label' => 'Night Tour',
                'description' => '7:00 PM - 6:00 AM (Next Day)',
                'start_time' => '19:00:00',
                'end_time' => '06:00:00',
                'overnight' => true,
            ],
            'overnight' => [
                'label' => 'Overnight Stay',
                'description' => '2:00 PM - 12:00 PM (Next Day)',
                'start_time' => '14:00:00',
                'end_time' => '12:00:00',
                'overnight' => true,
            ],
            'alternative_overnight' => [
                'label' => 'Alternative Overnight',
                'description' => '7:00 PM - 5:00 PM (Next Day)',
                'start_time' => '19:00:00',
                'end_time' => '17:00:00',
                'overnight' => true,
            ],
        ];

        return $types[$bookingType] ?? $types['day_tour'];
    }
}
