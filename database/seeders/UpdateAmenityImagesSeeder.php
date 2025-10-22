<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Amenity;

class UpdateAmenityImagesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $conversionRate = 56.5;

        $amenitiesData = [
            'Swimming Pool' => [
                'image' => 'amenities/swimming-pool.jpg',
                'price' => 25.00 * $conversionRate,
            ],
            'Jacuzzi' => [
                'image' => 'amenities/jacuzzi.jpg',
                'price' => 30.00 * $conversionRate,
            ],
            'Nature Trails' => [
                'image' => 'amenities/nature-trails.jpg',
                'price' => 10.00 * $conversionRate, 
            ],
            'Hiking Routes' => [
                'image' => 'amenities/hiking.jpg',
                'price' => 15.00 * $conversionRate, 
            ],
            'Jet Ski' => [
                'image' => 'amenities/jetski.jpg',
                'price' => 75.00 * $conversionRate, 
            ],
            'Spa & Wellness Center' => [
                'image' => 'amenities/spa-wellness.jpg',
                'price' => 80.00 * $conversionRate,
            ],
            'Fitness Gym' => [
                'image' => 'amenities/fitness-gym.jpg',
                'price' => 20.00 * $conversionRate, 
            ],
            'Tennis Court' => [
                'image' => 'amenities/tennis-court.jpg',
                'price' => 35.00 * $conversionRate, 
            ],
            'Private Beach Access' => [
                'image' => 'amenities/private-beach.jpg',
                'price' => 40.00 * $conversionRate, 
            ],
            'Golf Course' => [
                'image' => 'amenities/golf-course.webp',
                'price' => 90.00 * $conversionRate, 
            ],
            'Yoga Studio' => [
                'image' => 'amenities/yoga-studio.webp',
                'price' => 25.00 * $conversionRate, 
            ],
            'Kayaking' => [
                'image' => 'amenities/kayaking.jpg',
                'price' => 45.00 * $conversionRate, 
            ],
        ];

        foreach ($amenitiesData as $name => $data) {
            $amenity = Amenity::where('amenity_name', $name)->first();
            
            if ($amenity) {
                $amenity->update([
                    'image_path' => $data['image'],
                    'price_per_use' => $data['price'],
                ]);
                
                $this->command->info("✓ Updated: {$name} - ₱" . number_format($data['price'], 2));
            } else {
                $this->command->warn("✗ Not found: {$name}");
            }
        }
        
        $this->command->info("\n✅ All amenities updated with images and PHP pricing!");
    }
}
