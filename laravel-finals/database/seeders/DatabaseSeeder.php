<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create 3 Admin accounts
        User::create([
            'full_name' => 'Kirk Lagos',
            'role' => 'admin',
            'username' => 'kirklagos',
            'email' => 'kirklagos@gmail.com',
            'password' => Hash::make('password123'),
        ]);

        User::create([
            'full_name' => 'Mark Daniel',
            'role' => 'admin',
            'username' => 'markdaniel',
            'email' => 'markdaniel@gmail.com',
            'password' => Hash::make('password123'),
        ]);

        User::create([
            'full_name' => 'Sarah Dimatibag',
            'role' => 'admin',
            'username' => 'sarahdimatibag',
            'email' => 'sarahdimatibag@gmail.com',
            'password' => Hash::make('password123'),
        ]);

        // Create 3 Employee accounts
        User::create([
            'full_name' => 'Joseph Lim',
            'role' => 'employee',
            'username' => 'josephlim',
            'email' => 'josephlim@gmail.com',
            'password' => Hash::make('password123'),
        ]);

        User::create([
            'full_name' => 'Mike Wazowski',
            'role' => 'employee',
            'username' => 'mikewazowski',
            'email' => 'mike@gmail.com',
            'password' => Hash::make('password123'),
        ]);

        User::create([
            'full_name' => 'Lisa Simpson',
            'role' => 'employee',
            'username' => 'lisasimpson',
            'email' => 'lisa@gmail.com',
            'password' => Hash::make('password123'),
        ]);

        // Create 4 Customer accounts
        User::create([
            'full_name' => 'Zoro Roronoa',
            'role' => 'customer',
            'username' => 'zoro',
            'email' => 'zoro@gmail.com',
            'password' => Hash::make('password123'),
        ]);

        User::create([
            'full_name' => 'Itachi Uchiha',
            'role' => 'customer',
            'username' => 'itachiuchiha',
            'email' => 'itachi@gmail.com',
            'password' => Hash::make('password123'),
        ]);

        User::create([
            'full_name' => 'Bob Richards',
            'role' => 'customer',
            'username' => 'bobrichards',
            'email' => 'bob@gmail.com',
            'password' => Hash::make('password123'),
        ]);

        User::create([
            'full_name' => 'Alice Johnson',
            'role' => 'customer',
            'username' => 'alicejohnson',
            'email' => 'alice@gmail.com',
            'password' => Hash::make('password123'),
        ]);
    }
}
