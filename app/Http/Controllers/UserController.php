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
        $users = User::orderBy('id')
            ->get(['id', 'full_name', 'username', 'email', 'role', 'avatar_path', 'phone_number', 'address', 'city', 'country', 'date_of_birth']);
        $trashedCount = User::onlyTrashed()->count();

        return Inertia::render('admin/user', [
            'users' => $users,
            'currentUser' => Auth::user(),
            'trashedCount' => $trashedCount,
        ]);
    }

    /**
     * Display a listing of soft-deleted users
     */
    public function trashed()
    {
        $trashedUsers = User::onlyTrashed()
            ->orderBy('deleted_at', 'desc')
            ->get(['id', 'full_name', 'username', 'email', 'role', 'avatar_path', 'phone_number', 'address', 'city', 'country', 'date_of_birth', 'deleted_at']);

        return Inertia::render('admin/user', [
            'users' => $trashedUsers,
            'currentUser' => Auth::user(),
            'showingTrashed' => true,
        ]);
    }

    /**
     * Restore a soft-deleted user
     */
    public function restore($id)
    {
        // Only admins can restore users
        if (Auth::user()->role !== 'admin') {
            return redirect()->route('admin.users.index')->with('error', 'Unauthorized action!');
        }

        $user = User::onlyTrashed()->findOrFail($id);
        $user->restore();

        // Create activity log
        $currentUser = Auth::user();
        Log::create([
            'user_id' => $currentUser->id,
            'action' => "Restored {$user->role} account: {$user->full_name} ({$user->username})",
            'created_at' => now(),
        ]);

        return redirect()->route('admin.users.trashed')->with('success', 'User restored successfully!');
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
            'password' => [
                'nullable',
                'string',
                'min:8',
                'regex:/[a-z]/',      // must contain at least one lowercase letter
                'regex:/[A-Z]/',      // must contain at least one uppercase letter
                'regex:/[0-9]/',      // must contain at least one digit
                'regex:/[@$!%*#?&]/', // must contain at least one special character
            ],
            'phone_number' => 'nullable|string|max:20',
            'address' => 'nullable|string|max:500',
            'city' => 'nullable|string|max:100',
            'country' => 'nullable|string|max:100',
            'date_of_birth' => 'nullable|date|before:today',
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
            $destinationPath = public_path('avatars/' . $filename);

            // Ensure avatars directory exists
            if (!file_exists(public_path('avatars'))) {
                mkdir(public_path('avatars'), 0755, true);
            }

            // Convert image to WebP
            $this->convertToWebp($avatar->getRealPath(), $destinationPath);

            $validated['avatar_path'] = 'avatars/' . $filename;
        } else {
            // Generate initials-based avatar path (placeholder)
            $initials = $this->getInitials($validated['full_name']);
            $validated['avatar_path'] = 'initials:' . $initials;
        }

        // Create the user with all validated fields
        $user = User::create($validated);

        // Create activity log
        $currentUser = Auth::user();
        Log::create([
            'user_id' => $currentUser->id,
            'action' => "Created new {$user->role} account: {$user->full_name} ({$user->username})",
            'created_at' => now(),
        ]);

        return redirect()->route('admin.users.index')->with('success', 'User created successfully!');
    }

    /**
     * Show the form for editing the specified user
     */
    public function edit($id)
    {
        $user = User::findOrFail($id);
        $users = User::orderBy('id')
            ->get(['id', 'full_name', 'username', 'email', 'role', 'avatar_path', 'phone_number', 'address', 'city', 'country', 'date_of_birth']);

        return Inertia::render('admin/user', [
            'users' => $users,
            'editingUser' => $user,
            'openEditDialog' => true,
        ]);
    }

    /**
     * Update the specified user
     */
    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        // Debug: Log request data
        \Illuminate\Support\Facades\Log::info('Update request data:', [
            'has_file' => $request->hasFile('avatar'),
            'files' => $request->allFiles(),
            'all_data' => $request->except(['password']),
        ]);

        // Validate the request - fields are not required since we're editing
        $validated = $request->validate([
            'full_name' => 'nullable|string|max:255',
            'email' => 'nullable|email|unique:users,email,' . $id,
            'role' => 'nullable|in:admin,employee,customer',
            'username' => 'nullable|string|max:255|unique:users,username,' . $id,
            'password' => [
                'nullable',
                'string',
                'min:8',
                'regex:/[a-z]/',      // must contain at least one lowercase letter
                'regex:/[A-Z]/',      // must contain at least one uppercase letter
                'regex:/[0-9]/',      // must contain at least one digit
                'regex:/[@$!%*#?&]/', // must contain at least one special character
            ],
            'phone_number' => 'nullable|string|max:20',
            'address' => 'nullable|string|max:500',
            'city' => 'nullable|string|max:100',
            'country' => 'nullable|string|max:100',
            'date_of_birth' => 'nullable|date|before:today',
            'avatar' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
        ]);

        // Update username if provided
        if (!empty($validated['username'])) {
            $user->username = $validated['username'];
        }

        // Update password if provided
        if (!empty($validated['password'])) {
            $validated['password'] = Hash::make($validated['password']);
            $user->password = $validated['password'];
        } else {
            unset($validated['password']);
        }

        // Handle avatar upload
        if ($request->hasFile('avatar')) {
            // Delete old avatar if it's not an initials placeholder
            if ($user->avatar_path && !str_starts_with($user->avatar_path, 'initials:')) {
                $oldAvatarPath = public_path($user->avatar_path);
                if (file_exists($oldAvatarPath)) {
                    unlink($oldAvatarPath);
                }
            }

            $avatar = $request->file('avatar');
            $filename = time() . '_' . ($user->username ?? $user->id) . '.webp';
            $destinationPath = public_path('avatars/' . $filename);

            // Ensure avatars directory exists
            if (!file_exists(public_path('avatars'))) {
                mkdir(public_path('avatars'), 0755, true);
            }

            // Convert image to WebP
            $this->convertToWebp($avatar->getRealPath(), $destinationPath);

            $validated['avatar_path'] = 'avatars/' . $filename;
        }

        // Update user - only update provided fields
        $updateData = [];
        if (isset($validated['full_name'])) $updateData['full_name'] = $validated['full_name'];
        if (isset($validated['email'])) $updateData['email'] = $validated['email'];
        if (isset($validated['role'])) $updateData['role'] = $validated['role'];
        if (isset($validated['phone_number'])) $updateData['phone_number'] = $validated['phone_number'];
        if (isset($validated['address'])) $updateData['address'] = $validated['address'];
        if (isset($validated['city'])) $updateData['city'] = $validated['city'];
        if (isset($validated['country'])) $updateData['country'] = $validated['country'];
        if (isset($validated['date_of_birth'])) $updateData['date_of_birth'] = $validated['date_of_birth'];
        if (isset($validated['avatar_path'])) $updateData['avatar_path'] = $validated['avatar_path'];

        $user->update($updateData);

        // Create activity log
        $currentUser = Auth::user();
        Log::create([
            'user_id' => $currentUser->id,
            'action' => "Updated user account: {$user->full_name} ({$user->username})",
            'created_at' => now(),
        ]);

        return redirect()->route('admin.users.index')->with('success', 'User updated successfully!');
    }

    /**
     * Remove the specified user (soft delete)
     */
    public function destroy($id)
    {
        $user = User::findOrFail($id);
        $currentUser = Auth::user();

        // Prevent deleting yourself
        if ($user->id === $currentUser->id) {
            return redirect()->route('admin.users.index')->with('error', 'You cannot delete your own account!');
        }

        // Authorization rules:
        // - Employees cannot delete anyone
        // - Admins can only delete employees and customers, not other admins
        if ($currentUser->role === 'employee') {
            return redirect()->route('admin.users.index')->with('error', 'Employees are not authorized to delete users!');
        }

        if ($currentUser->role === 'admin' && $user->role === 'admin') {
            return redirect()->route('admin.users.index')->with('error', 'Admins cannot delete other admin accounts!');
        }

        // Delete avatar if it exists and is not an initials placeholder
        if ($user->avatar_path && !str_starts_with($user->avatar_path, 'initials:')) {
            $avatarPath = public_path($user->avatar_path);
            if (file_exists($avatarPath)) {
                unlink($avatarPath);
            }
        }

        // Store user info for log before deletion
        $userName = $user->full_name;
        $userUsername = $user->username;
        $userRole = $user->role;

        // Soft delete the user
        $user->delete();

        // Create activity log (currentUser already declared above)
        Log::create([
            'user_id' => $currentUser->id,
            'action' => "Deleted {$userRole} account: {$userName} ({$userUsername})",
            'created_at' => now(),
        ]);

        return redirect()->route('admin.users.index')->with('success', 'User deleted successfully!');
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
