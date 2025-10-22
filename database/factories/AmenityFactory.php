<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Amenity>
 */
class AmenityFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'amenity_name' => fake()->words(2, true),
            'description' => fake()->sentence(),
            'price_per_use' => fake()->randomFloat(2, 10, 100),
            'image_path' => null,
        ];
    }
}
