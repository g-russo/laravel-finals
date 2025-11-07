<?php

namespace App\Http\Controllers;

use App\Models\Accommodation;
use App\Models\Amenity;
use Inertia\Inertia;

class WelcomeController extends Controller
{
    public function index()
    {
        $accommodations = Accommodation::where('availability_status', 'available')
            ->take(8)
            ->get()
            ->map(function ($accommodation) {
                return [
                    'id' => $accommodation->accommodation_id,
                    'title' => $accommodation->accommodation_name,
                    'description' => $accommodation->description,
                    'price' => $accommodation->price_per_night,
                    'capacity' => $accommodation->capacity,
                    'image' => $accommodation->image_url ?? $accommodation->image_path,
                    'formatted_price' => '₱' . number_format($accommodation->price_per_night, 2),
                ];
            });

        // GET ALL AMENITIES (remove any limit)
        $amenities = Amenity::orderBy('amenity_name')
            ->get()
            ->map(function ($amenity) {
                return [
                    'amenity_id' => $amenity->amenity_id,
                    'amenity_name' => $amenity->amenity_name,
                    'description' => $amenity->description,
                    'price_per_use' => $amenity->price_per_use,
                    'image_path' => $amenity->image_path,
                ];
            });

        $stats = [
            'total_accommodations' => Accommodation::count(),
            'available_accommodations' => Accommodation::where('availability_status', 'available')->count(),
            'premium_suites' => Accommodation::where('price_per_night', '>=', 20000)->count(),
            'years_experience' => 15,
        ];

        return Inertia::render('welcome', [
            'accommodations' => $accommodations,
            'amenities' => $amenities, // All 12 amenities
            'stats' => $stats,
        ]);
    }
}
