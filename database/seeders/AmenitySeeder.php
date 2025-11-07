<?php

namespace Database\Seeders;

use App\Models\Amenity;
use Illuminate\Database\Seeder;

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
                'description' => 'Olympic-sized heated swimming pool with crystal-clear water, perfect for laps or leisurely swimming. Features shallow and deep ends suitable for all ages.',
                'price_per_use' => 1412.50,
                'image_path' => 'amenities/swimming-pool.jpg'
            ],
            [
                'amenity_name' => 'Jacuzzi',
                'description' => 'Luxurious hot tub with therapeutic jets and temperature control. Ideal for relaxation and hydrotherapy after a long day.',
                'price_per_use' => 1695.00,
                'image_path' => 'amenities/jacuzzi.jpg'
            ],
            [
                'amenity_name' => 'Nature Trails',
                'description' => 'Scenic walking paths through lush tropical gardens and native vegetation. Perfect for morning walks and nature photography.',
                'price_per_use' => 565.00,
                'image_path' => 'amenities/nature-trails.jpg'
            ],
            [
                'amenity_name' => 'Hiking Routes',
                'description' => 'Challenging hiking trails with breathtaking mountain views and natural landmarks. Various difficulty levels available for all fitness levels.',
                'price_per_use' => 847.50,
                'image_path' => 'amenities/hiking.jpg'
            ],
            [
                'amenity_name' => 'Jet Ski',
                'description' => 'High-performance jet skis for adrenaline-pumping water adventures. Safety equipment and instruction provided.',
                'price_per_use' => 4237.50,
                'image_path' => 'amenities/jetski.jpg'
            ],
            [
                'amenity_name' => 'Spa & Wellness Center',
                'description' => 'Full-service spa offering massages, facials, body treatments, and wellness therapies. Features sauna, steam room, and relaxation lounges.',
                'price_per_use' => 4520.00,
                'image_path' => 'amenities/spa-wellness.jpg'
            ],
            [
                'amenity_name' => 'Fitness Gym',
                'description' => 'State-of-the-art fitness center with modern equipment, free weights, and cardio machines. Personal trainers available upon request.',
                'price_per_use' => 1130.00,
                'image_path' => 'amenities/fitness-gym.jpg'
            ],
            [
                'amenity_name' => 'Tennis Court',
                'description' => 'Professional-grade tennis courts with high-quality surfaces. Equipment rental and coaching services available.',
                'price_per_use' => 1977.50,
                'image_path' => 'amenities/tennis-court.jpg'
            ],
            [
                'amenity_name' => 'Private Beach Access',
                'description' => 'Exclusive access to pristine white sand beaches with crystal-clear waters. Beach chairs, umbrellas, and water sports equipment available.',
                'price_per_use' => 2260.00,
                'image_path' => 'amenities/private-beach.jpg'
            ],
            [
                'amenity_name' => 'Golf Course',
                'description' => '18-hole championship golf course designed by renowned architects. Features challenging holes, beautiful landscapes, and a clubhouse.',
                'price_per_use' => 5085.00,
                'image_path' => 'amenities/golf-course.webp'
            ],
            [
                'amenity_name' => 'Yoga Studio',
                'description' => 'Serene yoga studio with expert instructors offering various styles. Daily classes for beginners to advanced practitioners.',
                'price_per_use' => 1412.50,
                'image_path' => 'amenities/yoga-studio.webp'
            ],
            [
                'amenity_name' => 'Kayaking',
                'description' => 'Explore scenic waterways in our high-quality kayaks. Single and tandem kayaks available with safety gear included.',
                'price_per_use' => 2542.50,
                'image_path' => 'amenities/kayaking.jpg'
            ],
        ];

        foreach ($amenities as $amenityData) {
            Amenity::updateOrCreate(
                ['amenity_name' => $amenityData['amenity_name']], // Fixed: was using 'name'
                [
                    'description' => $amenityData['description'],
                    'price_per_use' => $amenityData['price_per_use'], // Fixed: was using 'price'
                    'image_path' => $amenityData['image_path'] // Fixed: was using 'image'
                ]
            );
        }

        $this->command->info('✅ All amenities seeded successfully!');
    }
}
