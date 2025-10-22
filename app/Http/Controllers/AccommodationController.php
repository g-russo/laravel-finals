<?php

namespace App\Http\Controllers;

use App\Models\Accommodation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
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

        $accommodations = $query->orderBy('accommodation_name')->paginate(10)->withQueryString();

        return Inertia::render('Accommodations/Index', [
            'accommodations' => $accommodations,
            'filters' => $request->only(['search', 'status']),
            'stats' => [
                'total' => Accommodation::count(),
                'available' => Accommodation::available()->count(),
                'occupied' => Accommodation::occupied()->count(),
                'maintenance' => Accommodation::where('availability_status', 'maintenance')->count(),
            ]
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
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:5120', // 5MB max
        ]);

        // Handle image upload
        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $imageName = time() . '_' . $image->getClientOriginalName();
            $imagePath = $image->storeAs('accommodations', $imageName, 'public');
            $validated['image_url'] = '/storage/' . $imagePath;
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
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:5120', // 5MB max
        ]);

        // Handle image upload
        if ($request->hasFile('image')) {
            // Delete old image if exists
            if ($accommodation->image_url) {
                $oldImagePath = str_replace('/storage/', '', $accommodation->image_url);
                Storage::disk('public')->delete($oldImagePath);
            }

            $image = $request->file('image');
            $imageName = time() . '_' . $image->getClientOriginalName();
            $imagePath = $image->storeAs('accommodations', $imageName, 'public');
            $validated['image_url'] = '/storage/' . $imagePath;
        }

        // Remove 'image' from validated data since we're storing 'image_url'
        unset($validated['image']);

        $accommodation->update($validated);

        return redirect()->route('accommodations.index')
            ->with('success', 'Accommodation updated successfully.');
    }

    /**
     * Remove the specified accommodation from storage.
     */
    public function destroy(Accommodation $accommodation)
    {
        // Delete associated image if exists
        if ($accommodation->image_url) {
            $imagePath = str_replace('/storage/', '', $accommodation->image_url);
            Storage::disk('public')->delete($imagePath);
        }

        $accommodation->delete();

        return redirect()->route('accommodations.index')
            ->with('success', 'Accommodation deleted successfully.');
    }
}