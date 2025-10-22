<?php

namespace App\Http\Controllers;

use App\Models\Accommodation;
use App\Models\Amenity;
use Illuminate\Http\Request;
use Inertia\Inertia;

class WelcomeController extends Controller
{
    /**
     * Display the welcome page with accommodation and amenity data.
     */
    public function index()
    {
        // Get featured accommodations (available ones, limited to 6 for homepage)
        $accommodations = Accommodation::where('availability_status', 'available')
            ->orderBy('price_per_night', 'desc') // Show premium accommodations first
            ->take(6)
            ->get()
            ->map(function ($accommodation) {
                return [
                    'id' => $accommodation->accommodation_id,
                    'title' => $accommodation->accommodation_name,
                    'description' => $accommodation->description,
                    'price' => 'From ₱' . number_format($accommodation->price_per_night, 0) . '/night',
                    'image' => $accommodation->image_url ?: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
                    'capacity' => $accommodation->capacity,
                    'formatted_price' => $accommodation->price_per_night,
                ];
            });

        // Get featured amenities (limited to 6 for homepage)
        $amenities = Amenity::orderBy('amenity_name')
            ->take(6)
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

        // Get stats for the homepage
        $stats = [
            'total_accommodations' => Accommodation::count(),
            'available_accommodations' => Accommodation::where('availability_status', 'available')->count(),
            'premium_suites' => Accommodation::where('price_per_night', '>', 15000)->count(),
            'years_experience' => 15, // Static for now
        ];

        return Inertia::render('welcome', [
            'accommodations' => $accommodations,
            'amenities' => $amenities,
            'stats' => $stats,
        ]);
    }
}
