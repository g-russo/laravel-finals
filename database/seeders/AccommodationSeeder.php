<?php

namespace Database\Seeders;

use App\Models\Accommodation;
use Illuminate\Database\Seeder;

class AccommodationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $accommodations = [
            [
                'accommodation_name' => 'Ocean View Suite',
                'description' => 'Spacious suite with panoramic ocean views, featuring a king-size bed, private balcony, and luxury amenities.',
                'capacity' => 2,
                'price_per_night' => 13000.00,
                'availability_status' => 'available',
                'image_url' => 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80'
            ],
            [
                'accommodation_name' => 'Private Villa',
                'description' => 'Exclusive villa with private beach access, infinity pool, and dedicated concierge service.',
                'capacity' => 6,
                'price_per_night' => 27000.00,
                'availability_status' => 'available',
                'image_url' => 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80'
            ],
            [
                'accommodation_name' => 'Garden Bungalow',
                'description' => 'Cozy bungalow surrounded by tropical gardens with outdoor dining area and hammock.',
                'capacity' => 3,
                'price_per_night' => 8999.00,
                'availability_status' => 'occupied',
                'image_url' => 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80'
            ],
            [
                'accommodation_name' => 'Penthouse Suite',
                'description' => 'Ultimate luxury with rooftop infinity pool, panoramic views, and butler service.',
                'capacity' => 4,
                'price_per_night' => 50000.00,
                'availability_status' => 'available',
                'image_url' => 'https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80'
            ],
            [
                'accommodation_name' => 'Beachfront Cabana',
                'description' => 'Intimate beachfront accommodation with direct beach access and outdoor shower.',
                'capacity' => 2,
                'price_per_night' => 15000.00,
                'availability_status' => 'maintenance',
                'image_url' => 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80'
            ],
            [
                'accommodation_name' => 'Mountain View Chalet',
                'description' => 'Rustic chalet with stunning mountain views, fireplace, and private deck.',
                'capacity' => 4,
                'price_per_night' => 18000.00,
                'availability_status' => 'reserved',
                'image_url' => 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80'
            ],
            [
                'accommodation_name' => 'Luxury Pool Suite',
                'description' => 'Premium suite featuring private pool, outdoor living area, and personalized concierge service.',
                'capacity' => 3,
                'price_per_night' => 35000.00,
                'availability_status' => 'available',
                'image_url' => 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80'
            ],
            [
                'accommodation_name' => 'Family Resort Villa',
                'description' => 'Spacious family villa with multiple bedrooms, kids play area, and family pool.',
                'capacity' => 8,
                'price_per_night' => 45000.00,
                'availability_status' => 'available',
                'image_url' => 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80'
            ]
        ];

        foreach ($accommodations as $accommodation) {
            Accommodation::create($accommodation);
        }
    }
}