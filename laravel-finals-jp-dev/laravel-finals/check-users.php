<?php

/**
 * Check registered users in NeonDB
 * Run: php check-users.php
 */

require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

echo "=== Registered Users in NeonDB ===\n\n";

try {
    $users = \App\Models\User::all();
    
    if ($users->count() === 0) {
        echo "No users registered yet.\n";
    } else {
        echo "Total users: " . $users->count() . "\n\n";
        
        foreach ($users as $user) {
            echo "ID: {$user->id}\n";
            echo "Name: {$user->name}\n";
            echo "Email: {$user->email}\n";
            echo "Created: {$user->created_at}\n";
            echo str_repeat('-', 50) . "\n";
        }
    }
} catch (\Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
