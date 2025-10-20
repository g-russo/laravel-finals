<?php

namespace App\Http\Controllers;

use App\Models\User;
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
            ->when(Schema::hasColumn('users', 'username'), fn ($q) => $q->addSelect('username'))
            ->when(Schema::hasColumn('users', 'role'), fn ($q) => $q->addSelect('role'))
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
        ]);
    }
}