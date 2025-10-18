<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserController extends Controller
{
    /**
     * Display a listing of users
     */
    public function index()
    {
        $users = User::orderBy('user_id')
            ->get(['user_id', 'full_name', 'username', 'email', 'role']);

        return Inertia::render('Users/Index', [
            'users' => $users,
        ]);
    }
}
