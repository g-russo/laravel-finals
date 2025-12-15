<?php

namespace App\Http\Controllers;

use App\Models\Package;
use App\Models\Accommodation;
use App\Models\Amenity;
use App\Models\Log;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class PackageController extends Controller
{
    /**
     * Display a listing of the packages.
     */
    public function index(Request $request)
    {
        $query = Package::with(['accommodations', 'amenities']);

        // Search functionality
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('package_name', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%")
                    ->orWhere('inclusion_details', 'like', "%{$search}%")
                    ->orWhere('status', 'like', "%{$search}%")
                    ->orWhere('price', $search);
            });
        }

        // Filter by status
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $packages = $query->orderBy('package_name')->get();

        // Get count of archived packages
        $archivedCount = Package::onlyTrashed()->count();

        // Get available accommodations and amenities
        $accommodations = Accommodation::where('availability_status', 'available')
            ->orderBy('accommodation_name')
            ->get(['accommodation_id', 'accommodation_name', 'description', 'capacity', 'price_per_night', 'availability_status']);
        
        $amenities = Amenity::orderBy('amenity_name')
            ->get(['amenity_id', 'amenity_name', 'description', 'price_per_use']);

        return Inertia::render('admin/packages', [
            'packages' => $packages,
            'accommodations' => $accommodations,
            'amenities' => $amenities,
            'archivedCount' => $archivedCount,
        ]);
    }

    /**
     * Display a listing of the archived packages.
     */
    public function archive(Request $request)
    {
        $query = Package::onlyTrashed()->with(['accommodations', 'amenities']);

        // Search functionality for archived items
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('package_name', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%")
                    ->orWhere('inclusion_details', 'like', "%{$search}%")
                    ->orWhere('status', 'like', "%{$search}%")
                    ->orWhere('price', $search);
            });
        }

        $archivedPackages = $query->orderBy('deleted_at', 'desc')->get();

        return Inertia::render('admin/packages-archive', [
            'packages' => $archivedPackages,
        ]);
    }

    /**
     * Show the form for creating a new package.
     */
    public function create()
    {
        $accommodations = Accommodation::where('availability_status', 'available')->get();
        $amenities = Amenity::all();

        return Inertia::render('admin/packages-create', [
            'accommodations' => $accommodations,
            'amenities' => $amenities,
        ]);
    }

    /**
     * Store a newly created package in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'package_name' => 'required|string|max:255',
            'description' => 'required|string',
            'price' => 'required|numeric|min:0',
            'discount_percentage' => 'nullable|numeric|min:0|max:100',
            'max_guests' => 'required|integer|min:1|max:100',
            'inclusion_details' => 'required|string',
            'status' => 'required|in:active,inactive',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:5120', // 5MB max
            'accommodations' => 'nullable|array',
            'accommodations.*.accommodation_id' => 'exists:accommodations,accommodation_id',
            'accommodations.*.quantity' => 'integer|min:1',
            'amenities' => 'nullable|array',
            'amenities.*.amenity_id' => 'exists:amenities,amenity_id',
            'amenities.*.quantity' => 'integer|min:1',
        ]);

        // Handle image upload without Intervention Image
        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $filename = time() . '_' . str_replace(' ', '_', $validated['package_name']) . '.' . $image->getClientOriginalExtension();
            
            // Ensure packages directory exists
            if (!file_exists(public_path('packages'))) {
                mkdir(public_path('packages'), 0755, true);
            }

            // Move uploaded file
            $image->move(public_path('packages'), $filename);

            $validated['image_path'] = 'packages/' . $filename;
        }

        // Remove arrays from validated data for package creation
        $accommodations = $validated['accommodations'] ?? [];
        $amenities = $validated['amenities'] ?? [];
        unset($validated['image'], $validated['accommodations'], $validated['amenities']);

        $package = Package::create($validated);

        // Attach accommodations if provided
        if (!empty($accommodations)) {
            foreach ($accommodations as $accommodation) {
                $package->accommodations()->attach(
                    $accommodation['accommodation_id'],
                    ['quantity' => $accommodation['quantity']]
                );
            }
        }

        // Attach amenities if provided
        if (!empty($amenities)) {
            foreach ($amenities as $amenity) {
                $package->amenities()->attach(
                    $amenity['amenity_id'],
                    ['quantity' => $amenity['quantity']]
                );
            }
        }

        // Log the action
        Log::create([
            'user_id' => Auth::id(),
            'action' => 'Created package: ' . $package->package_name,
            'created_at' => now(),
        ]);

        return redirect()->route('admin.packages.index')
            ->with('success', 'Package created successfully.');
    }

    /**
     * Display the specified package.
     */
    public function show(Package $package)
    {
        $package->load(['accommodations', 'amenities']);

        return Inertia::render('admin/packages-show', [
            'package' => $package
        ]);
    }

    /**
     * Show the form for editing the specified package.
     */
    public function edit(Package $package)
    {
        $package->load(['accommodations', 'amenities']);
        $accommodations = Accommodation::where('availability_status', 'available')->get();
        $amenities = Amenity::all();

        return Inertia::render('admin/packages-edit', [
            'package' => $package,
            'accommodations' => $accommodations,
            'amenities' => $amenities,
        ]);
    }

    /**
     * Update the specified package in storage.
     */
    public function update(Request $request, Package $package)
    {
        $validated = $request->validate([
            'package_name' => 'required|string|max:255',
            'description' => 'required|string',
            'price' => 'required|numeric|min:0',
            'discount_percentage' => 'nullable|numeric|min:0|max:100',
            'max_guests' => 'required|integer|min:1|max:100',
            'inclusion_details' => 'required|string',
            'status' => 'required|in:active,inactive',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:5120',
            'accommodations' => 'nullable|array',
            'accommodations.*.accommodation_id' => 'exists:accommodations,accommodation_id',
            'accommodations.*.quantity' => 'integer|min:1',
            'amenities' => 'nullable|array',
            'amenities.*.amenity_id' => 'exists:amenities,amenity_id',
            'amenities.*.quantity' => 'integer|min:1',
        ]);

        // Handle image upload if provided
        if ($request->hasFile('image')) {
            // Delete old image if exists
            if ($package->image_path && file_exists(public_path($package->image_path))) {
                unlink(public_path($package->image_path));
            }

            $image = $request->file('image');
            $filename = time() . '_' . str_replace(' ', '_', $validated['package_name']) . '.' . $image->getClientOriginalExtension();

            // Ensure packages directory exists
            if (!file_exists(public_path('packages'))) {
                mkdir(public_path('packages'), 0755, true);
            }

            // Move uploaded file
            $image->move(public_path('packages'), $filename);

            $validated['image_path'] = 'packages/' . $filename;
        }

        // Handle accommodations and amenities
        $accommodations = $validated['accommodations'] ?? [];
        $amenities = $validated['amenities'] ?? [];
        unset($validated['image'], $validated['accommodations'], $validated['amenities']);

        $package->update($validated);

        // Sync accommodations
        $accommodationSync = [];
        foreach ($accommodations as $accommodation) {
            $accommodationSync[$accommodation['accommodation_id']] = [
                'quantity' => $accommodation['quantity']
            ];
        }
        $package->accommodations()->sync($accommodationSync);

        // Sync amenities
        $amenitySync = [];
        foreach ($amenities as $amenity) {
            $amenitySync[$amenity['amenity_id']] = [
                'quantity' => $amenity['quantity']
            ];
        }
        $package->amenities()->sync($amenitySync);

        // Log the action
        Log::create([
            'user_id' => Auth::id(),
            'action' => 'Updated package: ' . $package->package_name,
            'created_at' => now(),
        ]);

        return redirect()->route('admin.packages.index')
            ->with('success', 'Package updated successfully.');
    }

    /**
     * Remove the specified package from storage (soft delete).
     */
    public function destroy(Package $package)
    {
        // Log the action
        Log::create([
            'user_id' => Auth::id(),
            'action' => 'Archived package: ' . $package->package_name,
            'created_at' => now(),
        ]);

        $package->delete();

        return redirect()->route('admin.packages.index')
            ->with('success', 'Package archived successfully.');
    }

    /**
     * Restore the specified package from archive.
     */
    public function restore($id)
    {
        $package = Package::onlyTrashed()->findOrFail($id);

        // Log the action
        Log::create([
            'user_id' => Auth::id(),
            'action' => 'Restored package: ' . $package->package_name,
            'created_at' => now(),
        ]);

        $package->restore();

        return redirect()->route('admin.packages.archive')
            ->with('success', 'Package restored successfully.');
    }

    /**
     * Permanently delete the specified package.
     */
    public function forceDelete($id)
    {
        $package = Package::onlyTrashed()->findOrFail($id);
        $packageName = $package->package_name;

        // Delete image if exists
        if ($package->image_path && file_exists(public_path($package->image_path))) {
            unlink(public_path($package->image_path));
        }

        // Log the action
        Log::create([
            'user_id' => Auth::id(),
            'action' => 'Permanently deleted package: ' . $packageName,
            'created_at' => now(),
        ]);

        $package->forceDelete();

        return redirect()->route('admin.packages.archive')
            ->with('success', 'Package permanently deleted.');
    }

}