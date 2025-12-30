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
                'discount_percentage' => 10.00,
                'max_guests' => 6,
                'inclusion_details' => 'Includes 2 nights accommodation, breakfast for 4 persons, access to swimming pool, free WiFi, and complimentary parking.',
                'status' => 'active',
                'accommodations' => [1 => 1], // accommodation_id => quantity
                'amenities' => [1 => 4, 2 => 1], // amenity_id => quantity
            ],
            [
                'package_name' => 'Romantic Couples Retreat',
                'description' => 'Intimate package designed for couples seeking a romantic escape with premium amenities and services.',
                'price' => 12000.00,
                'discount_percentage' => 15.00,
                'max_guests' => 2,
                'inclusion_details' => 'Includes 3 nights in premium suite, candlelit dinner, spa access, couples massage, complimentary wine, and late checkout.',
                'status' => 'active',
                'accommodations' => [2 => 1], // Assuming accommodation_id 2 is a premium room
                'amenities' => [1 => 2, 6 => 2], // Pool access and spa services
            ],
            [
                'package_name' => 'Adventure Seeker Package',
                'description' => 'Action-packed package for adventure enthusiasts with access to various outdoor activities and facilities.',
                'price' => 6500.00,
                'discount_percentage' => 5.00,
                'max_guests' => 4,
                'inclusion_details' => 'Includes 2 nights accommodation, adventure gear rental, guided tours, all meals, and activity insurance.',
                'status' => 'active',
                'accommodations' => [1 => 1],
                'amenities' => [4 => 1, 5 => 1, 12 => 1], // Hiking, Jet Ski, Kayaking
            ],
            [
                'package_name' => 'Corporate Team Building',
                'description' => 'Comprehensive package for corporate groups focusing on team building activities and meeting facilities.',
                'price' => 25000.00,
                'discount_percentage' => 20.00,
                'max_guests' => 20,
                'inclusion_details' => 'Includes meeting room rental, team building activities, lunch and dinner, accommodation for key personnel, and event coordination.',
                'status' => 'active',
                'accommodations' => [3 => 2, 1 => 2], // Multiple rooms for key personnel
                'amenities' => [1 => 10, 7 => 5], // Pool access for group, gym access
            ],
            [
                'package_name' => 'Wellness Retreat',
                'description' => 'Rejuvenating package focused on wellness and relaxation with spa treatments and healthy dining options.',
                'price' => 9800.00,
                'discount_percentage' => 12.00,
                'max_guests' => 2,
                'inclusion_details' => 'Includes 3 nights accommodation, daily yoga sessions, spa treatments, healthy meals, meditation sessions, and wellness consultation.',
                'status' => 'active',
                'accommodations' => [2 => 1],
                'amenities' => [6 => 3, 11 => 2, 1 => 1], // Spa services, yoga, and pool access
            ],
            [
                'package_name' => 'Ultimate Luxury Experience',
                'description' => 'The most exclusive package featuring our finest accommodations, premium amenities, and personalized butler service.',
                'price' => 85000.00,
                'discount_percentage' => 0.00,
                'max_guests' => 4,
                'inclusion_details' => 'Includes 5 nights in Penthouse Suite, private chef, unlimited spa access, golf course access, jet ski rental, private beach cabana, airport transfers, and 24/7 butler service.',
                'status' => 'active',
                'accommodations' => [4 => 1], // Penthouse Suite
                'amenities' => [1 => 4, 5 => 2, 6 => 4, 9 => 1, 10 => 2], // Pool, Jet Ski, Spa, Private Beach, Golf
            ],
            [
                'package_name' => 'Beach Paradise Package',
                'description' => 'Sun, sand, and sea - everything you need for the perfect beach vacation.',
                'price' => 15500.00,
                'discount_percentage' => 8.00,
                'max_guests' => 4,
                'inclusion_details' => 'Includes 3 nights beachfront accommodation, private beach access, jet ski session, kayaking adventure, beach BBQ dinner, and sunset cruise.',
                'status' => 'active',
                'accommodations' => [5 => 1], // Beachfront Cabana
                'amenities' => [9 => 1, 5 => 1, 12 => 2], // Private Beach, Jet Ski, Kayaking
            ],
            [
                'package_name' => 'Sports Enthusiast Package',
                'description' => 'Perfect for active guests who want to stay fit while on vacation with premium sports facilities.',
                'price' => 11000.00,
                'discount_percentage' => 10.00,
                'max_guests' => 4,
                'inclusion_details' => 'Includes 3 nights accommodation, unlimited gym access, tennis court reservations, golf course access, and sports equipment rental.',
                'status' => 'active',
                'accommodations' => [1 => 1],
                'amenities' => [7 => 3, 8 => 2, 10 => 1], // Gym, Tennis, Golf
            ],
            [
                'package_name' => 'Honeymoon Paradise',
                'description' => 'Create unforgettable memories with your loved one in our romantic honeymoon package.',
                'price' => 45000.00,
                'discount_percentage' => 15.00,
                'max_guests' => 2,
                'inclusion_details' => 'Includes 5 nights in Private Villa, champagne on arrival, couples spa treatment, private candlelit dinner on the beach, sunset cruise, and romantic room decoration.',
                'status' => 'active',
                'accommodations' => [2 => 1], // Private Villa
                'amenities' => [6 => 2, 9 => 1, 2 => 2], // Spa, Private Beach, Jacuzzi
            ],
            [
                'package_name' => 'Nature Explorer Package',
                'description' => 'Immerse yourself in nature with guided trails, hiking adventures, and outdoor experiences.',
                'price' => 7500.00,
                'discount_percentage' => 5.00,
                'max_guests' => 6,
                'inclusion_details' => 'Includes 2 nights in Garden Bungalow, guided nature trail walks, hiking excursion, kayaking trip, and picnic lunch in the forest.',
                'status' => 'active',
                'accommodations' => [3 => 1], // Garden Bungalow
                'amenities' => [3 => 2, 4 => 1, 12 => 1], // Nature Trails, Hiking, Kayaking
            ],
            [
                'package_name' => 'Family Fun Package',
                'description' => 'Keep the whole family entertained with activities for all ages.',
                'price' => 22000.00,
                'discount_percentage' => 12.00,
                'max_guests' => 8,
                'inclusion_details' => 'Includes 3 nights in Family Resort Villa, unlimited pool access, nature trail adventures, kids activities, family BBQ night, and complimentary breakfast.',
                'status' => 'active',
                'accommodations' => [8 => 1], // Family Resort Villa
                'amenities' => [1 => 6, 3 => 2, 12 => 2], // Pool, Nature Trails, Kayaking
            ],
            [
                'package_name' => 'Executive Retreat',
                'description' => 'Unwind from the corporate world with premium relaxation and wellness services.',
                'price' => 18000.00,
                'discount_percentage' => 10.00,
                'max_guests' => 2,
                'inclusion_details' => 'Includes 3 nights in Ocean View Suite, spa treatments, yoga sessions, gym access, healthy gourmet meals, and business center access.',
                'status' => 'active',
                'accommodations' => [1 => 1], // Ocean View Suite
                'amenities' => [6 => 2, 11 => 3, 7 => 3], // Spa, Yoga, Gym
            ],
            [
                'package_name' => 'Summer Splash Package',
                'description' => 'Beat the heat with our water-focused summer package featuring aquatic activities.',
                'price' => 13500.00,
                'discount_percentage' => 15.00,
                'max_guests' => 4,
                'inclusion_details' => 'Includes 3 nights accommodation, unlimited pool access, jet ski rental, kayaking session, jacuzzi access, and poolside lunch.',
                'status' => 'active',
                'accommodations' => [7 => 1], // Luxury Pool Suite
                'amenities' => [1 => 4, 2 => 2, 5 => 1, 12 => 1], // Pool, Jacuzzi, Jet Ski, Kayaking
            ],
            [
                'package_name' => 'Weekend Escape',
                'description' => 'Short on time? Get the most out of your weekend with this action-packed getaway.',
                'price' => 5500.00,
                'discount_percentage' => 5.00,
                'max_guests' => 2,
                'inclusion_details' => 'Includes 2 nights accommodation, pool access, one spa treatment, breakfast, and late checkout on Sunday.',
                'status' => 'active',
                'accommodations' => [1 => 1],
                'amenities' => [1 => 2, 6 => 1], // Pool, Spa
            ],
            [
                'package_name' => 'Golf & Spa Retreat',
                'description' => 'The perfect combination of sport and relaxation for golf enthusiasts.',
                'price' => 28000.00,
                'discount_percentage' => 10.00,
                'max_guests' => 4,
                'inclusion_details' => 'Includes 4 nights in Mountain View Chalet, daily golf course access, spa treatments, golf club rental, caddy service, and post-golf massage.',
                'status' => 'active',
                'accommodations' => [6 => 1], // Mountain View Chalet
                'amenities' => [10 => 4, 6 => 2], // Golf, Spa
            ],
            [
                'package_name' => 'Budget Friendly Vacation',
                'description' => 'Experience our resort without breaking the bank. Perfect for budget-conscious travelers.',
                'price' => 4200.00,
                'discount_percentage' => 0.00,
                'max_guests' => 3,
                'inclusion_details' => 'Includes 2 nights in Garden Bungalow, pool access, nature trail walk, and continental breakfast.',
                'status' => 'active',
                'accommodations' => [3 => 1], // Garden Bungalow
                'amenities' => [1 => 2, 3 => 1], // Pool, Nature Trails
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