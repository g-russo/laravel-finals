<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Log;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class LogController extends Controller
{
    /**
     * Display a listing of the logs.
     */
    public function index()
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();
        
        if (!$user->canAccessAdmin()) {
            abort(403);
        }

        $logs = Log::with('user')
            ->orderBy('created_at', 'desc')
            ->paginate(50);

        return Inertia::render('admin/Logs/Index', [
            'logs' => $logs,
        ]);
    }
}
