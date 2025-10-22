<?php

namespace App\Http\Controllers;

use App\Models\Accommodation;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PublicAccommodationController extends Controller
{
    /**
     * Display the specified accommodation for public viewing.
     */
    public function show($id)
    {
        $accommodation = Accommodation::where('accommodation_id', $id)
            ->where('availability_status', 'available')
            ->firstOrFail();

        // Get related accommodations (same price range or similar capacity)
        $relatedAccommodations = Accommodation::where('accommodation_id', '!=', $id)
            ->where('availability_status', 'available')
            ->where(function ($query) use ($accommodation) {
                $query->whereBetween('price_per_night', [
                    $accommodation->price_per_night * 0.7,
                    $accommodation->price_per_night * 1.3
                ])
                ->orWhere('capacity', $accommodation->capacity);
            })
            ->take(3)
            ->get()
            ->map(function ($acc) {
                return [
                    'id' => $acc->accommodation_id,
                    'title' => $acc->accommodation_name,
                    'description' => $acc->description,
                    'price' => 'From ₱' . number_format($acc->price_per_night, 0) . '/night',
                    'image' => $acc->image_url ?: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
                    'capacity' => $acc->capacity,
                    'formatted_price' => $acc->price_per_night,
                ];
            });

        return Inertia::render('AccommodationDetail', [
            'accommodation' => [
                'id' => $accommodation->accommodation_id,
                'title' => $accommodation->accommodation_name,
                'description' => $accommodation->description,
                'price' => $accommodation->price_per_night,
                'formatted_price' => '₱' . number_format($accommodation->price_per_night, 0),
                'image' => $accommodation->image_url ?: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
                'capacity' => $accommodation->capacity,
                'status' => $accommodation->availability_status,
            ],
            'relatedAccommodations' => $relatedAccommodations,
        ]);
    }
}
