<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Accommodation extends Model
{
    use HasFactory;

    protected $primaryKey = 'accommodation_id';

    protected $fillable = [
        'accommodation_name',
        'description',
        'capacity',
        'price_per_night',
        'availability_status',
        'image_url',
    ];

    protected $casts = [
        'price_per_night' => 'decimal:2',
        'capacity' => 'integer',
    ];

    // Scope for available accommodations
    public function scopeAvailable($query)
    {
        return $query->where('availability_status', 'available');
    }

    // Scope for occupied accommodations
    public function scopeOccupied($query)
    {
        return $query->where('availability_status', 'occupied');
    }

    // Get formatted price
    public function getFormattedPriceAttribute()
    {
        return '₱' . number_format($this->price_per_night, 2);
    }

    // Get status badge color
    public function getStatusColorAttribute()
    {
        return match($this->availability_status) {
            'available' => 'green',
            'occupied' => 'red',
            'maintenance' => 'yellow',
            'reserved' => 'blue',
            default => 'gray'
        };
    }
}