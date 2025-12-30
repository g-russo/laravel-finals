<?php
$laravelPath = __DIR__;

// Load Laravel
require $laravelPath . '/../vendor/autoload.php';
$app = require_once $laravelPath . '/../bootstrap/app.php';

$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);

echo "<h2>Clearing Laravel Cache...</h2>";
echo "<p><strong>Time:</strong> " . date('Y-m-d H:i:s') . "</p>";

// Check storage permissions
$viewCachePath = $laravelPath . '/../storage/framework/views';
echo "<p>View cache path: " . $viewCachePath . "</p>";
echo "<p>Path writable: " . (is_writable($viewCachePath) ? '✓ Yes' : '✗ No - Check permissions!') . "</p>";

// Clear config cache
echo "<p>Clearing config cache...</p>";
$kernel->call('config:clear');
echo "<p>✓ Config cache cleared</p>";

// Clear application cache
echo "<p>Clearing application cache...</p>";
$kernel->call('cache:clear');
echo "<p>✓ Application cache cleared</p>";

// Clear route cache
echo "<p>Clearing route cache...</p>";
$kernel->call('route:clear');
echo "<p>✓ Route cache cleared</p>";

// Clear view cache
echo "<p>Clearing view cache...</p>";
$kernel->call('view:clear');
echo "<p>✓ View cache cleared</p>";

// Rebuild config cache
echo "<p>Rebuilding config cache...</p>";
$kernel->call('config:cache');
echo "<p>✓ Config cache rebuilt</p>";

// Clear and rebuild route cache
echo "<p>Rebuilding route cache...</p>";
$kernel->call('route:cache');
echo "<p>✓ Route cache rebuilt</p>";

echo "<h3 style='color: green;'>✓ All caches cleared successfully!</h3>";
echo "<p><strong>IMPORTANT: Delete this file now for security!</strong></p>";
