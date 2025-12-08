<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Package extends Model
{
    use HasFactory, SoftDeletes;

    protected $primaryKey = 'package_id';

    protected $fillable = [
        'package_name',
        'description',
        'price',
        'discount_percentage',
        'inclusion_details',
        'image_path',
        'status',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'discount_percentage' => 'decimal:2',
        'deleted_at' => 'datetime',
    ];

    protected $dates = ['deleted_at'];

    /**
     * Get the route key for the model.
     */
    public function getRouteKeyName()
    {
        return 'package_id';
    }

    // Relationships
    public function accommodations()
    {
        return $this->belongsToMany(
            Accommodation::class,
            'package_accommodations',
            'package_id',
            'accommodation_id'
        )->withPivot('quantity')->withTimestamps();
    }

    public function amenities()
    {
        return $this->belongsToMany(
            Amenity::class,
            'package_amenities',
            'package_id',
            'amenity_id'
        )->withPivot('quantity')->withTimestamps();
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    public function scopeInactive($query)
    {
        return $query->where('status', 'inactive');
    }

    // Accessors
    public function getFormattedPriceAttribute()
    {
        return '₱' . number_format($this->price, 2);
    }

    public function getImageUrlAttribute()
    {
        if ($this->image_path) {
            return asset('storage/' . $this->image_path);
        }
        return null;
    }

    public function getStatusColorAttribute()
    {
        return match($this->status) {
            'active' => 'green',
            'inactive' => 'red',
            default => 'gray'
        };
    }

    public function getStatusLabelAttribute()
    {
        return ucfirst($this->status);
    }

    // Helper methods
    public function getTotalAccommodationsAttribute()
    {
        return $this->accommodations->sum('pivot.quantity');
    }

    public function getTotalAmenitiesAttribute()
    {
        return $this->amenities->sum('pivot.quantity');
    }
}
