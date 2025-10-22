<?php

namespace App\Http\Controllers;

use App\Models\Log;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class LogController extends Controller
{
    /**
     * Display a listing of the logs.
     */
    public function index(Request $request): Response
    {
        $user = $request->user();

        // Only allow admins and employees to access
        if (!in_array($user->role, ['admin', 'employee'])) {
            abort(403, 'Unauthorized access to activity logs.');
        }

        // Get sorting parameters
        $sortField = $request->input('sort_field', 'created_at');
        $sortDirection = $request->input('sort_direction', 'desc');

        // Validate sort field
        $allowedSortFields = ['log_id', 'action', 'created_at'];
        if (!in_array($sortField, $allowedSortFields)) {
            $sortField = 'created_at';
        }

        // Validate sort direction
        if (!in_array($sortDirection, ['asc', 'desc'])) {
            $sortDirection = 'desc';
        }

        $query = Log::with('user:user_id,full_name,email,role');

        // Filter logs based on user role
        if ($user->role === 'admin') {
            // Admins can see both employees and customers actions + system logs
            $query->where(function ($q) {
                $q->whereHas('user', function ($subQuery) {
                    $subQuery->whereIn('role', ['employee', 'customer']);
                })->orWhereNull('user_id');
            });
        } elseif ($user->role === 'employee') {
            // Employees can only see customers actions
            $query->whereHas('user', function ($q) {
                $q->where('role', 'customer');
            });
        }

        // Filter by user if provided
        if ($request->has('user_id') && $request->user_id !== '') {
            $query->where('user_id', $request->user_id);
        }

        // Search by action
        if ($request->has('search') && $request->search !== '') {
            $query->where('action', 'like', '%' . $request->search . '%');
        }

        // Filter by date range
        if ($request->has('date_from') && $request->date_from !== '') {
            $query->whereDate('created_at', '>=', \Carbon\Carbon::parse($request->date_from));
        }

        if ($request->has('date_to') && $request->date_to !== '') {
            $query->whereDate('created_at', '<=', \Carbon\Carbon::parse($request->date_to));
        }

        // Apply sorting after all filters
        $query->orderBy($sortField, $sortDirection);

        // Use cursor pagination for better performance (lazy loading)
        $logs = $query->cursorPaginate(20)->withQueryString();

        return Inertia::render('Admin/Logs', [
            'logs' => $logs,
            'filters' => $request->only(['user_id', 'search', 'date_from', 'date_to', 'sort_field', 'sort_direction']),
        ]);
    }
}
