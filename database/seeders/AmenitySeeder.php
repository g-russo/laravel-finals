<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Amenity;

class AmenitySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $amenities = [
            [
                'amenity_name' => 'Swimming Pool',
                'description' => 'Olympic-sized swimming pool with temperature control, perfect for both leisurely swims and serious training.',
                'price_per_use' => 25.00,
                'image_path' => null,
            ],
            [
                'amenity_name' => 'Jacuzzi',
                'description' => 'Luxury hot tub with massage jets and stunning views, ideal for relaxation after a long day.',
                'price_per_use' => 30.00,
                'image_path' => null,
            ],
            [
                'amenity_name' => 'Nature Trails',
                'description' => 'Scenic walking trails through beautiful landscapes, perfect for morning walks and bird watching.',
                'price_per_use' => 10.00,
                'image_path' => null,
            ],
            [
                'amenity_name' => 'Hiking Routes',
                'description' => 'Challenging hiking routes with breathtaking mountain views and expert guides available.',
                'price_per_use' => 15.00,
                'image_path' => null,
            ],
            [
                'amenity_name' => 'Jet Ski',
                'description' => 'High-performance jet skis with safety equipment included, experience the thrill of water sports.',
                'price_per_use' => 75.00,
                'image_path' => null,
            ],
            [
                'amenity_name' => 'Spa & Wellness Center',
                'description' => 'Full-service spa offering massages, facials, and various wellness treatments by certified therapists.',
                'price_per_use' => 80.00,
                'image_path' => null,
            ],
            [
                'amenity_name' => 'Fitness Gym',
                'description' => 'State-of-the-art gym with modern equipment, personal trainers, and group fitness classes.',
                'price_per_use' => 20.00,
                'image_path' => null,
            ],
            [
                'amenity_name' => 'Tennis Court',
                'description' => 'Professional tennis courts with equipment rental and coaching services available.',
                'price_per_use' => 35.00,
                'image_path' => null,
            ],
            [
                'amenity_name' => 'Private Beach Access',
                'description' => 'Exclusive private beach with pristine sands, beach chairs, umbrellas, and water sports equipment.',
                'price_per_use' => 40.00,
                'image_path' => null,
            ],
            [
                'amenity_name' => 'Golf Course',
                'description' => '18-hole championship golf course with club rentals and caddy services available.',
                'price_per_use' => 90.00,
                'image_path' => null,
            ],
            [
                'amenity_name' => 'Yoga Studio',
                'description' => 'Peaceful yoga studio with various classes for all skill levels, including meditation sessions.',
                'price_per_use' => 25.00,
                'image_path' => null,
            ],
            [
                'amenity_name' => 'Kayaking',
                'description' => 'Single and tandem kayaks available for exploring calm waters and hidden coves.',
                'price_per_use' => 45.00,
                'image_path' => null,
            ],
        ];

        foreach ($amenities as $amenity) {
            Amenity::create($amenity);
        }
    }
}
