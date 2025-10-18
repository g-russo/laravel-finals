<?php

/**
 * Supabase Connection Test Script
 * This script tests the connection to your Supabase PostgreSQL database
 */

require __DIR__ . '/vendor/autoload.php';

// Bootstrap Laravel
$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

echo "=== Supabase Connection Test ===\n\n";

// Get database credentials from Laravel config
$host = config('database.connections.pgsql.host');
$port = config('database.connections.pgsql.port');
$database = config('database.connections.pgsql.database');
$username = config('database.connections.pgsql.username');
$password = config('database.connections.pgsql.password');
$sslmode = config('database.connections.pgsql.sslmode');

echo "Testing with the following credentials:\n";
echo "Host: $host\n";
echo "Port: $port\n";
echo "Database: $database\n";
echo "Username: $username\n";
echo "Password: " . (empty($password) ? '[EMPTY]' : '[SET - ' . strlen($password) . ' characters]') . "\n";
echo "SSL Mode: $sslmode\n\n";

// Check if required credentials are set
if (!$host || !$database || !$username) {
    die("Error: Missing required database credentials in .env file!\n");
}

// Check if PDO PostgreSQL extension is loaded
if (!extension_loaded('pdo_pgsql')) {
    die("Error: PDO PostgreSQL extension is not loaded!\n");
}

echo "✓ PDO PostgreSQL extension is loaded\n\n";

// Build connection string
$dsn = "pgsql:host=$host;port=$port;dbname=$database;sslmode=$sslmode";

echo "Attempting to connect to Supabase...\n";
echo "DSN: $dsn\n\n";

try {
    $pdo = new PDO($dsn, $username, $password, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_TIMEOUT => 10
    ]);

    echo "✓ SUCCESS! Connected to Supabase PostgreSQL database!\n\n";

    // Test a simple query
    $stmt = $pdo->query("SELECT version()");
    $version = $stmt->fetchColumn();
    echo "Database Version: $version\n\n";

    // Check if migrations table exists
    $stmt = $pdo->query("SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'migrations'
    )");
    $migrationsExist = $stmt->fetchColumn();

    if ($migrationsExist) {
        echo "✓ Migrations table exists\n";
    } else {
        echo "⚠ Migrations table does not exist (run 'php artisan migrate')\n";
    }

    // List all tables
    $stmt = $pdo->query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name");
    $tables = $stmt->fetchAll(PDO::FETCH_COLUMN);

    if (count($tables) > 0) {
        echo "\nExisting tables:\n";
        foreach ($tables as $table) {
            echo "  - $table\n";
        }
    } else {
        echo "\n⚠ No tables found in the database\n";
    }

    echo "\n=== Connection Test Complete ===\n";
    echo "Your Supabase credentials are correct and working!\n";
} catch (PDOException $e) {
    echo "✗ CONNECTION FAILED!\n\n";
    echo "Error: " . $e->getMessage() . "\n\n";

    // Provide troubleshooting tips
    echo "Troubleshooting tips:\n";
    echo "1. Verify your database credentials in the .env file\n";
    echo "2. Check if your IP address is whitelisted in Supabase\n";
    echo "3. Ensure your firewall allows outbound connections on port 5432\n";
    echo "4. Verify the database is running in the Supabase dashboard\n";
    echo "5. Try using 'sslmode=require' if connection fails\n";
}
