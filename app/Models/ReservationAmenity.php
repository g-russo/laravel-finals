<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ReservationAmenity extends Model
{
    use HasFactory;

    protected $fillable = [
        'reservation_id',
        'amenity_id',
        'price',
        'booking_date',
        'start_time',
        'end_time',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'booking_date' => 'date',
    ];

    public function reservation(): BelongsTo
    {
        return $this->belongsTo(Reservation::class, 'reservation_id', 'reservation_id');
    }

    public function amenity(): BelongsTo
    {
        return $this->belongsTo(Amenity::class, 'amenity_id', 'amenity_id');
    }
}
