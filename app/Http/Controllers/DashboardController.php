<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Accommodation;
use App\Models\Amenity;
use App\Models\Package;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Schema;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function __invoke(Request $request)
    {
        $search = trim((string) $request->query('search', ''));

        $nameColumn = Schema::hasColumn('users', 'full_name') ? 'full_name' : 'name';

        $users = User::query()
            ->select(['id', 'email', 'created_at'])
            ->selectRaw("$nameColumn as name")
            ->when(Schema::hasColumn('users', 'username'), fn($q) => $q->addSelect('username'))
            ->when(Schema::hasColumn('users', 'role'), fn($q) => $q->addSelect('role'))
            ->when($search !== '', function ($q) use ($search, $nameColumn) {
                $q->where(function ($q) use ($search, $nameColumn) {
                    if (ctype_digit($search)) {
                        $q->orWhere('id', (int) $search);
                    }
                    $q->orWhere($nameColumn, 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%");

                    if (Schema::hasColumn('users', 'username')) {
                        $q->orWhere('username', 'like', "%{$search}%");
                    }
                    if (Schema::hasColumn('users', 'role')) {
                        $q->orWhere('role', 'like', "%{$search}%");
                    }

                    $q->orWhere('created_at', 'like', "%{$search}%");
                });
            })
            ->orderByDesc('id')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('dashboard', [
            'users' => $users,
            'filters' => [
                'search' => $search,
            ],
            'stats' => [
                // User stats
                'total_users' => User::count(),
                'admin_users' => User::where('role', 'admin')->count(),
                'regular_users' => User::where('role', 'user')->count(),

                // Accommodation stats
                'total_accommodations' => Accommodation::count(),
                'available_accommodations' => Accommodation::where('availability_status', 'available')->count(),
                'occupied_accommodations' => Accommodation::where('availability_status', 'occupied')->count(),
                'maintenance_accommodations' => Accommodation::where('availability_status', 'maintenance')->count(),

                // Amenity stats
                'total_amenities' => Amenity::count(),
                'active_amenities' => Amenity::count(), // Assuming all amenities are active
                'premium_amenities' => Amenity::where('price_per_use', '>', 500)->count(),

                // Package stats
                'total_packages' => Package::count(),
                'active_packages' => Package::count(), // Assuming all packages are active
            ],
        ]);
    }
}
