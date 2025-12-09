<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Carbon\Carbon;

class Reservation extends Model
{
    use HasFactory;

    protected $primaryKey = 'reservation_id';

    protected $fillable = [
        'user_id',
        'accommodation_id',
        'package_id',
        'check_in_date',
        'check_out_date',
        'booking_type',
        'number_of_guests',
        'start_time',
        'end_time',
        'accommodation_price',
        'package_price',
        'amenities_price',
        'total_price',
        'status',
        'payment_status',
        'cancellation_reason',
        'confirmed_at',
        'cancelled_at',
        'special_requests',
    ];

    protected $casts = [
        'check_in_date' => 'date',
        'check_out_date' => 'date',
        'accommodation_price' => 'decimal:2',
        'package_price' => 'decimal:2',
        'amenities_price' => 'decimal:2',
        'total_price' => 'decimal:2',
        'confirmed_at' => 'datetime',
        'cancelled_at' => 'datetime',
        'number_of_guests' => 'integer',
    ];

    // Booking type time mappings
    public const BOOKING_TYPES = [
        'day_tour' => ['start' => '08:00:00', 'end' => '17:00:00'],
        'night_tour' => ['start' => '19:00:00', 'end' => '06:00:00'], // Next day
        'overnight' => ['start' => '14:00:00', 'end' => '12:00:00'], // Next day
        'alternative_overnight' => ['start' => '19:00:00', 'end' => '17:00:00'], // Next day
    ];

    // Relationships
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function accommodation(): BelongsTo
    {
        return $this->belongsTo(Accommodation::class, 'accommodation_id', 'accommodation_id');
    }

    public function package(): BelongsTo
    {
        return $this->belongsTo(Package::class, 'package_id', 'package_id');
    }

    public function amenities(): BelongsToMany
    {
        return $this->belongsToMany(
            Amenity::class,
            'reservation_amenities',
            'reservation_id',
            'amenity_id',
            'reservation_id',
            'amenity_id'
        )->withPivot('price', 'booking_date', 'start_time', 'end_time')->withTimestamps();
    }

    public function reservationAmenities(): HasMany
    {
        return $this->hasMany(ReservationAmenity::class, 'reservation_id', 'reservation_id');
    }

    // Scopes
    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    public function scopeConfirmed($query)
    {
        return $query->where('status', 'confirmed');
    }

    public function scopeActive($query)
    {
        return $query->whereIn('status', ['pending', 'confirmed']);
    }

    // Helper methods
    public function isOvernight(): bool
    {
        return in_array($this->booking_type, ['overnight', 'alternative_overnight', 'night_tour']);
    }

    public function getActualCheckOutDate(): Carbon
    {
        if ($this->isOvernight()) {
            return $this->check_out_date->copy();
        }
        return $this->check_in_date->copy();
    }

    public function hasPackage(): bool
    {
        return !is_null($this->package_id);
    }

    public function calculateTotalPrice(): float
    {
        $total = 0;

        if ($this->accommodation_price) {
            $total += $this->accommodation_price;
        }

        if ($this->package_price) {
            $total += $this->package_price;
        }

        if ($this->amenities_price) {
            $total += $this->amenities_price;
        }

        return $total;
    }
}
