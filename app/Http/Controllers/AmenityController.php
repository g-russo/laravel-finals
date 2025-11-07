<?php

namespace App\Http\Controllers;

use App\Models\Amenity;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class AmenityController extends Controller
{
    /**
     * Display a listing of amenities (API)
     */
    public function index(Request $request)
    {
        $query = Amenity::query();

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('amenity_name', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        $amenities = $query->orderBy('amenity_name')->get();

        return response()->json($amenities);
    }

    /**
     * Display admin amenities management page
     */
    public function manage()
    {
        $amenities = Amenity::orderBy('amenity_name')->get()->map(function ($amenity) {
            return [
                'amenity_id' => $amenity->amenity_id,
                'amenity_name' => $amenity->amenity_name,
                'description' => $amenity->description,
                'price_per_use' => $amenity->price_per_use,
                'image_path' => $amenity->image_path,
                'image_url' => $amenity->image_url,
                'formatted_price' => $amenity->formatted_price,
            ];
        });

        return Inertia::render('admin/amenities', [
            'amenities' => $amenities
        ]);
    }

    /**
     * Store a newly created amenity
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'amenity_name' => 'required|string|max:255',
            'description' => 'required|string',
            'price_per_use' => 'required|numeric|min:0',
            'image' => 'nullable|image|mimes:jpeg,jpg,png,webp|max:5120',
        ]);

        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('amenities', 'public');
        }

        Amenity::create([
            'amenity_name' => $validated['amenity_name'],
            'description' => $validated['description'],
            'price_per_use' => $validated['price_per_use'],
            'image_path' => $imagePath,
        ]);

        return redirect()->route('admin.amenities.index')->with('success', 'Amenity created successfully!');
    }

    /**
     * Display the specified amenity
     */
    public function show(Amenity $amenity)
    {
        return response()->json($amenity);
    }

    /**
     * Update the specified amenity
     */
    public function update(Request $request, Amenity $amenity)
    {
        $validated = $request->validate([
            'amenity_name' => 'required|string|max:255',
            'description' => 'required|string',
            'price_per_use' => 'required|numeric|min:0',
            'image' => 'nullable|image|mimes:jpeg,jpg,png,webp|max:5120',
        ]);

        // Handle image upload
        if ($request->hasFile('image')) {
            // Delete old image if exists
            if ($amenity->image_path) {
                Storage::disk('public')->delete($amenity->image_path);
            }
            
            $validated['image_path'] = $request->file('image')->store('amenities', 'public');
        }

        $amenity->update([
            'amenity_name' => $validated['amenity_name'],
            'description' => $validated['description'],
            'price_per_use' => $validated['price_per_use'],
            'image_path' => $validated['image_path'] ?? $amenity->image_path,
        ]);

        return redirect()->route('admin.amenities.index')->with('success', 'Amenity updated successfully!');
    }

    /**
     * Remove the specified amenity
     */
    public function destroy(Amenity $amenity)
    {
        // Delete image if exists
        if ($amenity->image_path) {
            Storage::disk('public')->delete($amenity->image_path);
        }

        $amenity->delete();

        return redirect()->route('admin.amenities.index')->with('success', 'Amenity deleted successfully!');
    }
}
