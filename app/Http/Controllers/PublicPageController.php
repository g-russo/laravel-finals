<?php

namespace App\Http\Controllers;

use App\Models\Accommodation;
use App\Models\Amenity;
use App\Models\Package;
use Inertia\Inertia;

class PublicPageController extends Controller
{
    /**
     * Display all accommodations page.
     */
    public function accommodations()
    {
        $accommodations = Accommodation::where('availability_status', 'available')
            ->orderBy('accommodation_name')
            ->get()
            ->map(function ($accommodation) {
                return [
                    'id' => $accommodation->accommodation_id,
                    'title' => $accommodation->accommodation_name,
                    'description' => $accommodation->description,
                    'price' => $accommodation->price_per_night,
                    'capacity' => $accommodation->capacity,
                    'image' => $accommodation->image_url ?? $accommodation->image_path,
                    'formatted_price' => $accommodation->price_per_night,
                ];
            });

        return Inertia::render('public/Accommodations', [
            'accommodations' => $accommodations,
        ]);
    }

    /**
     * Display all amenities page.
     */
    public function amenities()
    {
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

        return Inertia::render('public/Amenities', [
            'amenities' => $amenities,
        ]);
    }

    /**
     * Display contact page.
     */
    public function contact()
    {
        return Inertia::render('public/Contact');
    }

    /**
     * Display all packages page.
     */
    public function packages()
    {
        $packages = Package::active()
            ->with(['accommodations', 'amenities'])
            ->orderBy('package_name')
            ->get()
            ->map(function ($package) {
                return [
                    'id' => $package->package_id,
                    'name' => $package->package_name,
                    'description' => $package->description,
                    'price' => (float) $package->price,
                    'discount_percentage' => (float) ($package->discount_percentage ?? 0),
                    'max_guests' => $package->max_guests,
                    'inclusion_details' => $package->inclusion_details,
                    'image_path' => $package->image_path,
                    'accommodations' => $package->accommodations->map(function ($acc) {
                        return [
                            'accommodation_id' => $acc->accommodation_id,
                            'accommodation_name' => $acc->accommodation_name,
                        ];
                    }),
                    'amenities' => $package->amenities->map(function ($amenity) {
                        return [
                            'amenity_id' => $amenity->amenity_id,
                            'amenity_name' => $amenity->amenity_name,
                        ];
                    }),
                ];
            });

        // Check if any package has a discount for the modal
        $hasDiscounts = $packages->contains(fn($pkg) => $pkg['discount_percentage'] > 0);

        return Inertia::render('public/Packages', [
            'packages' => $packages,
            'showWelcomeModal' => $hasDiscounts,
        ]);
    }
}
