<?php


namespace App\Http\Controllers;

use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        $users = User::query()
            ->select(['id', 'full_name', 'name', 'email', 'role', 'username', 'created_at'])
            ->latest('id')
            ->paginate(10)
            ->through(fn ($u) => [
                'id' => $u->id,
                'name' => $u->full_name ?? $u->name,
                'email' => $u->email,
                'role' => $u->role ?? null,
                'username' => $u->username ?? null,
                'created_at' => optional($u->created_at)->toDateTimeString(),
            ]);

        return Inertia::render('dashboard', [
            'users' => $users,
        ]);
    }
}