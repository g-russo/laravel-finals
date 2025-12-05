<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Package;
use App\Models\Accommodation;
use App\Models\Amenity;

class PackageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $accommodations = Accommodation::all();
        $amenities = Amenity::all();

        if ($accommodations->isEmpty() || $amenities->isEmpty()) {
            $this->command->warn('Please run accommodation and amenity seeders first!');
            return;
        }

        $packages = [
            [
                'package_name' => 'Family Weekend Getaway',
                'description' => 'Perfect package for families looking for a relaxing weekend retreat with comfortable accommodations and fun amenities.',
                'price' => 8500.00,
                'inclusion_details' => 'Includes 2 nights accommodation, breakfast for 4 persons, access to swimming pool, free WiFi, and complimentary parking.',
                'status' => 'active',
                'accommodations' => [1 => 1], // accommodation_id => quantity
                'amenities' => [1 => 4, 2 => 1], // amenity_id => quantity
            ],
            [
                'package_name' => 'Romantic Couples Retreat',
                'description' => 'Intimate package designed for couples seeking a romantic escape with premium amenities and services.',
                'price' => 12000.00,
                'inclusion_details' => 'Includes 3 nights in premium suite, candlelit dinner, spa access, couples massage, complimentary wine, and late checkout.',
                'status' => 'active',
                'accommodations' => [2 => 1], // Assuming accommodation_id 2 is a premium room
                'amenities' => [1 => 2, 3 => 2], // Pool access and spa services
            ],
            [
                'package_name' => 'Adventure Seeker Package',
                'description' => 'Action-packed package for adventure enthusiasts with access to various outdoor activities and facilities.',
                'price' => 6500.00,
                'inclusion_details' => 'Includes 2 nights accommodation, adventure gear rental, guided tours, all meals, and activity insurance.',
                'status' => 'active',
                'accommodations' => [1 => 1],
                'amenities' => [2 => 1, 4 => 1], // Assuming various activity amenities
            ],
            [
                'package_name' => 'Corporate Team Building',
                'description' => 'Comprehensive package for corporate groups focusing on team building activities and meeting facilities.',
                'price' => 15000.00,
                'inclusion_details' => 'Includes meeting room rental, team building activities, lunch and dinner, accommodation for key personnel, and event coordination.',
                'status' => 'active',
                'accommodations' => [3 => 2], // Multiple rooms for key personnel
                'amenities' => [1 => 10, 2 => 1], // Pool access for group, meeting facilities
            ],
            [
                'package_name' => 'Wellness Retreat',
                'description' => 'Rejuvenating package focused on wellness and relaxation with spa treatments and healthy dining options.',
                'price' => 9800.00,
                'inclusion_details' => 'Includes 3 nights accommodation, daily yoga sessions, spa treatments, healthy meals, meditation sessions, and wellness consultation.',
                'status' => 'inactive', // Example of inactive package
                'accommodations' => [2 => 1],
                'amenities' => [3 => 3, 1 => 1], // Spa services and pool access
            ]
        ];

        foreach ($packages as $packageData) {
            $accommodationData = $packageData['accommodations'];
            $amenityData = $packageData['amenities'];
            
            unset($packageData['accommodations'], $packageData['amenities']);
            
            $package = Package::create($packageData);

            // Attach accommodations
            foreach ($accommodationData as $accommodationId => $quantity) {
                if ($accommodations->where('accommodation_id', $accommodationId)->first()) {
                    $package->accommodations()->attach($accommodationId, ['quantity' => $quantity]);
                }
            }

            // Attach amenities
            foreach ($amenityData as $amenityId => $quantity) {
                if ($amenities->where('amenity_id', $amenityId)->first()) {
                    $package->amenities()->attach($amenityId, ['quantity' => $quantity]);
                }
            }
        }

        $this->command->info('Package seeder completed successfully!');
    }
}