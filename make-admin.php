<?php

/**
 * Quick script to make a user admin
 * Usage: php make-admin.php user@email.com
 */

require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use App\Models\User;

if (!isset($argv[1])) {
    echo "Usage: php make-admin.php user@email.com\n";
    exit(1);
}

$email = $argv[1];

$user = User::where('email', $email)->first();

if (!$user) {
    echo "User with email '{$email}' not found.\n";
    exit(1);
}

if ($user->role === 'admin') {
    echo "User '{$user->full_name}' ({$email}) is already an admin.\n";
    exit(0);
}

$user->update(['role' => 'admin']);

echo "Successfully made '{$user->full_name}' ({$email}) an admin!\n";