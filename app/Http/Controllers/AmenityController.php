<?php

namespace App\Http\Controllers;

use App\Models\Amenity;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class AmenityController extends Controller
{
    /**
     * Display the admin amenities management page.
     */
    public function manage(Request $request)
    {
        $query = Amenity::query();

        // Search functionality
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('amenity_name', 'LIKE', "%{$search}%")
                    ->orWhere('description', 'LIKE', "%{$search}%")
                    ->orWhere('price_per_use', 'LIKE', "%{$search}%");
            });
        }

        // Get paginated amenities
        $amenities = $query->orderBy('amenity_name')->paginate(15);

        // Calculate statistics
        $stats = [
            'total' => Amenity::count(),
            'active' => Amenity::count(), // All amenities are active in this context
            'premium' => Amenity::where('price_per_use', '>', 1000)->count(),
        ];

        return Inertia::render('admin/amenities-management', [
            'amenities' => $amenities,
            'filters' => [
                'search' => $request->search,
            ],
            'stats' => $stats,
        ]);
    }

    /**
     * Display a listing of the amenities.
     */
    public function index(Request $request)
    {
        $query = Amenity::query();

        // Search functionality
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('amenity_name', 'LIKE', "%{$search}%")
                    ->orWhere('description', 'LIKE', "%{$search}%");
            });
        }

        $amenities = $query->orderBy('amenity_name')->get();

        return response()->json($amenities);
    }

    /**
     * Store a newly created amenity.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'amenity_name' => 'required|string|max:255',
            'description' => 'required|string',
            'price_per_use' => 'required|numeric|min:0',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
        ]);

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('amenities', 'public');
            $validated['image_path'] = $path;
        }

        $amenity = Amenity::create($validated);

        return back()->with('success', 'Amenity created successfully!');
    }

    /**
     * Display the specified amenity.
     */
    public function show($id)
    {
        $amenity = Amenity::findOrFail($id);
        return response()->json($amenity);
    }

    /**
     * Update the specified amenity.
     */
    public function update(Request $request, $id)
    {
        $amenity = Amenity::findOrFail($id);
        
        $validated = $request->validate([
            'amenity_name' => 'sometimes|required|string|max:255',
            'description' => 'sometimes|required|string',
            'price_per_use' => 'sometimes|required|numeric|min:0',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
        ]);

        if ($request->hasFile('image')) {
            // Delete old image if exists
            if ($amenity->image_path) {
                Storage::disk('public')->delete($amenity->image_path);
            }
            $path = $request->file('image')->store('amenities', 'public');
            $validated['image_path'] = $path;
        }

        $amenity->update($validated);

        return back()->with('success', 'Amenity updated successfully!');
    }

    /**
     * Remove the specified amenity.
     */
    public function destroy($id)
    {
        $amenity = Amenity::findOrFail($id);
        
        // Delete image if exists
        if ($amenity->image_path) {
            Storage::disk('public')->delete($amenity->image_path);
        }

        $amenity->delete();

        return back()->with('success', 'Amenity deleted successfully!');
    }
}
