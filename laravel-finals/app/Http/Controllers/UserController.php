<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Log;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;
use Inertia\Inertia;

class UserController extends Controller
{
    /**
     * Display a listing of users
     */
    public function index()
    {
        $users = User::orderBy('user_id')
            ->get(['user_id', 'full_name', 'username', 'email', 'role', 'avatar_path']);

        return Inertia::render('Users/Index', [
            'users' => $users,
        ]);
    }

    /**
     * Store a newly created user
     */
    public function store(Request $request)
    {
        // Validate the request
        $validated = $request->validate([
            'full_name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'role' => 'required|in:admin,employee',
            'username' => 'nullable|string|max:255|unique:users,username',
            'password' => 'nullable|string|min:6',
            'avatar' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
        ]);

        // Generate username if not provided
        if (empty($validated['username'])) {
            $validated['username'] = strtolower(str_replace(' ', '', $validated['full_name']));

            // Ensure username is unique
            $baseUsername = $validated['username'];
            $counter = 1;
            while (User::where('username', $validated['username'])->exists()) {
                $validated['username'] = $baseUsername . $counter;
                $counter++;
            }
        }

        // Set default password if not provided
        if (empty($validated['password'])) {
            $validated['password'] = 'P@ssw0rd';
        }

        // Hash the password
        $validated['password'] = Hash::make($validated['password']);

        // Handle avatar upload
        if ($request->hasFile('avatar')) {
            $avatar = $request->file('avatar');
            $filename = time() . '_' . $validated['username'] . '.webp';
            $destinationPath = public_path('images/avatars/' . $filename);

            // Convert image to WebP
            $this->convertToWebp($avatar->getRealPath(), $destinationPath);

            $validated['avatar_path'] = 'images/avatars/' . $filename;
        } else {
            // Generate initials-based avatar path (placeholder)
            $initials = $this->getInitials($validated['full_name']);
            $validated['avatar_path'] = 'initials:' . $initials;
        }

        // Create the user
        $user = User::create($validated);

        // Create activity log
        $currentUser = Auth::user();
        Log::create([
            'user_id' => $currentUser->user_id,
            'action' => "Created new {$user->role} account: {$user->full_name} ({$user->username})",
            'created_at' => now(),
        ]);

        return redirect()->route('users.index')->with('success', 'User created successfully!');
    }

    /**
     * Get initials from full name
     */
    private function getInitials($name)
    {
        $words = explode(' ', $name);
        $initials = '';

        foreach ($words as $word) {
            if (!empty($word)) {
                $initials .= strtoupper($word[0]);
            }
        }

        return substr($initials, 0, 2);
    }

    /**
     * Convert image to WebP format using Intervention Image
     */
    private function convertToWebp($sourcePath, $destinationPath)
    {
        try {
            // Create image manager instance with GD driver
            $manager = new ImageManager(new Driver());

            // Load and convert the image
            $image = $manager->read($sourcePath);

            // Encode to WebP with quality 90 and save
            $image->toWebp(90)->save($destinationPath);
        } catch (\Exception $e) {
            throw new \Exception('Failed to convert image to WebP: ' . $e->getMessage());
        }
    }
}
