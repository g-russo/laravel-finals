<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    /**
     * Show dashboard
     */
    public function index()
    {
        $stats = [
            'users' => User::count(),
            'products' => 0, // Add your products count
            'orders' => 0, // Add your orders count
            'revenue' => 0, // Add your revenue calculation
        ];

        return Inertia::render('Dashboard/Index', [
            'stats' => $stats,
        ]);
    }
}
