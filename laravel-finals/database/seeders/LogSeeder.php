<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\User;

class LogSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get all users
        $users = User::all();

        if ($users->isEmpty()) {
            $this->command->warn('No users found. Please run UserSeeder first.');
            return;
        }

        $actions = [
            'User logged in',
            'User logged out',
            'Profile updated',
            'Password changed',
            'Email verified',
            'Room booking created',
            'Room booking confirmed',
            'Room booking cancelled',
            'Room booking modified',
            'Check-in completed',
            'Check-out completed',
            'Payment processed',
            'Refund issued',
            'Room availability checked',
            'Amenity added to booking',
            'Special request submitted',
            'Booking invoice generated',
            'Guest details updated',
            'Discount applied',
            'Review submitted',
            'Complaint filed',
            'Resort services requested',
            'Spa booking created',
            'Restaurant reservation made',
            'Event booking created',
            'Room preferences saved',
        ];

        $logs = [];

        foreach ($users as $user) {
            // Create 5-10 random logs per user
            $logCount = rand(5, 10);

            for ($i = 0; $i < $logCount; $i++) {
                $logs[] = [
                    'user_id' => $user->user_id,
                    'action' => $actions[array_rand($actions)],
                    'created_at' => now()->subDays(rand(0, 30))->subHours(rand(0, 23)),
                ];
            }
        }

        // Also add some logs with null user_id (system logs or deleted users)
        for ($i = 0; $i < 15; $i++) {
            $systemActions = [
                'System maintenance performed',
                'Database backup completed',
                'Room rates updated',
                'Seasonal promotions activated',
                'Booking reminder sent',
                'System health check completed',
                'Cache cleared',
            ];

            $logs[] = [
                'user_id' => null,
                'action' => $systemActions[array_rand($systemActions)],
                'created_at' => now()->subDays(rand(0, 30)),
            ];
        }

        // Insert all logs
        DB::table('logs')->insert($logs);

        $this->command->info('Logs seeded successfully!');
    }
}
