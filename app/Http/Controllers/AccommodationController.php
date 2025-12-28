<?php

namespace App\Http\Controllers;

use App\Models\Accommodation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;
use Inertia\Inertia;

class AccommodationController extends Controller
{
    /**
     * Display a listing of the accommodations.
     */
    public function index(Request $request)
    {
        $query = Accommodation::query();

        // Search functionality
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('accommodation_name', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%")
                    ->orWhere('availability_status', 'like', "%{$search}%")
                    ->orWhere('capacity', $search)
                    ->orWhere('price_per_night', $search);
            });
        }

        // Filter by availability status
        if ($request->filled('status')) {
            $query->where('availability_status', $request->status);
        }

        $accommodations = $query->orderBy('accommodation_name')->get();
        $archivedCount = Accommodation::onlyTrashed()->count();

        return Inertia::render('admin/accommodation', [
            'accommodations' => $accommodations,
            'archivedCount' => $archivedCount,
        ]);
    }

    /**
     * Display a listing of the archived accommodations.
     */
    public function archive(Request $request)
    {
        $query = Accommodation::onlyTrashed();

        // Search functionality for archived items
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('accommodation_name', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%")
                    ->orWhere('availability_status', 'like', "%{$search}%")
                    ->orWhere('capacity', $search)
                    ->orWhere('price_per_night', $search);
            });
        }

        $archivedAccommodations = $query->orderBy('deleted_at', 'desc')->get();

        return Inertia::render('admin/accommodation-archive', [
            'accommodations' => $archivedAccommodations,
        ]);
    }

    /**
     * Show the form for creating a new accommodation.
     */
    public function create()
    {
        return Inertia::render('Accommodations/Create');
    }

    /**
     * Store a newly created accommodation in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'accommodation_name' => 'required|string|max:255',
            'description' => 'required|string',
            'capacity' => 'required|integer|min:1|max:20',
            'price_per_night' => 'required|numeric|min:0',
            'availability_status' => 'required|in:available,occupied,maintenance,reserved',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:5120', // 5MB max
        ]);

        // Handle image upload with WebP conversion
        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $filename = time() . '_' . str_replace(' ', '_', $validated['accommodation_name']) . '.webp';
            $destinationPath = public_path('accommodations/' . $filename);

            // Ensure accommodations directory exists
            if (!file_exists(public_path('accommodations'))) {
                mkdir(public_path('accommodations'), 0755, true);
            }

            // Convert image to WebP
            $this->convertToWebp($image->getRealPath(), $destinationPath);

            $validated['image_url'] = '/accommodations/' . $filename;
        }

        // Remove 'image' from validated data since we're storing 'image_url'
        unset($validated['image']);

        Accommodation::create($validated);

        return redirect()->route('accommodations.index')
            ->with('success', 'Accommodation created successfully.');
    }

    /**
     * Display the specified accommodation.
     */
    public function show(Accommodation $accommodation)
    {
        return Inertia::render('Accommodations/Show', [
            'accommodation' => $accommodation
        ]);
    }

    /**
     * Show the form for editing the specified accommodation.
     */
    public function edit(Accommodation $accommodation)
    {
        return Inertia::render('Accommodations/Edit', [
            'accommodation' => $accommodation
        ]);
    }

    /**
     * Update the specified accommodation in storage.
     */
    public function update(Request $request, Accommodation $accommodation)
    {
        $validated = $request->validate([
            'accommodation_name' => 'required|string|max:255',
            'description' => 'required|string',
            'capacity' => 'required|integer|min:1|max:20',
            'price_per_night' => 'required|numeric|min:0',
            'availability_status' => 'required|in:available,occupied,maintenance,reserved',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:5120', // 5MB max
        ]);

        // Handle image upload with WebP conversion
        if ($request->hasFile('image')) {
            // Delete old image if exists
            if ($accommodation->image_url) {
                $oldImagePath = public_path($accommodation->image_url);
                if (file_exists($oldImagePath)) {
                    unlink($oldImagePath);
                }
            }

            $image = $request->file('image');
            $filename = time() . '_' . str_replace(' ', '_', $validated['accommodation_name']) . '.webp';
            $destinationPath = public_path('accommodations/' . $filename);

            // Ensure accommodations directory exists
            if (!file_exists(public_path('accommodations'))) {
                mkdir(public_path('accommodations'), 0755, true);
            }

            // Convert image to WebP
            $this->convertToWebp($image->getRealPath(), $destinationPath);

            $validated['image_url'] = '/accommodations/' . $filename;
        }

        // Remove 'image' from validated data since we're storing 'image_url'
        unset($validated['image']);

        $accommodation->update($validated);

        return redirect()->route('admin.accommodations.index')
            ->with('success', 'Accommodation updated successfully.');
    }

    /**
     * Soft delete the specified accommodation.
     */
    public function destroy(Accommodation $accommodation)
    {
        $accommodation->delete();

        return redirect()->route('admin.accommodations.index')
            ->with('success', 'Accommodation archived successfully.');
    }

    /**
     * Restore the specified accommodation from archive.
     */
    public function restore($id)
    {
        $accommodation = Accommodation::onlyTrashed()->findOrFail($id);
        $accommodation->restore();

        return redirect()->route('admin.accommodations.archive')
            ->with('success', 'Accommodation restored successfully.');
    }

    /**
     * Permanently delete the specified accommodation.
     */
    public function forceDelete($id)
    {
        $accommodation = Accommodation::onlyTrashed()->findOrFail($id);

        // Delete associated image if exists
        if ($accommodation->image_url) {
            $imagePath = public_path($accommodation->image_url);
            if (file_exists($imagePath)) {
                unlink($imagePath);
            }
        }

        $accommodation->forceDelete();

        return redirect()->route('admin.accommodations.archive')
            ->with('success', 'Accommodation permanently deleted.');
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
