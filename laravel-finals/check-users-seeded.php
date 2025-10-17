<?php

require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use App\Models\User;

echo "Total users: " . User::count() . "\n\n";

echo str_pad("ID", 5) . " | " . str_pad("Full Name", 20) . " | " . str_pad("Username", 15) . " | " . str_pad("Role", 10) . " | Email\n";
echo str_repeat("-", 100) . "\n";

User::orderBy('user_id')->get()->each(function ($user) {
    echo str_pad($user->user_id, 5) . " | " .
        str_pad($user->full_name, 20) . " | " .
        str_pad($user->username, 15) . " | " .
        str_pad($user->role, 10) . " | " .
        $user->email . "\n";
});

echo "\nPassword for all accounts: password123\n";
