<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Amenity extends Model
{
    use HasFactory;

    protected $primaryKey = 'amenity_id';

    protected $fillable = [
        'amenity_name',
        'description',
        'price_per_use',
        'image_path',
    ];

    protected $casts = [
        'price_per_use' => 'decimal:2',
    ];

    public function getFormattedPriceAttribute()
    {
        return '₱' . number_format($this->price_per_use, 2);
    }

    public function getImageUrlAttribute()
    {
        if ($this->image_path) {
            return asset('storage/' . $this->image_path);
        }
        return null;
    }
}
