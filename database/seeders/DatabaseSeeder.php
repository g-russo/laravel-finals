<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Schema;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $users = [
            // Admins
            ['full_name' => 'Kirk Lagos', 'role' => 'admin', 'username' => 'kirklagos', 'email' => 'kirklagos@gmail.com', 'password' => 'password123'],
            ['full_name' => 'Mark Daniel', 'role' => 'admin', 'username' => 'markdaniel', 'email' => 'markdaniel@gmail.com', 'password' => 'password123'],
            ['full_name' => 'Sarah Dimatibag', 'role' => 'admin', 'username' => 'sarahdimatibag', 'email' => 'sarahdimatibag@gmail.com', 'password' => 'password123'],

            // Employees
            ['full_name' => 'Joseph Lim', 'role' => 'employee', 'username' => 'josephlim', 'email' => 'josephlim@gmail.com', 'password' => 'password123'],
            ['full_name' => 'Mike Wazowski', 'role' => 'employee', 'username' => 'mikewazowski', 'email' => 'mike@gmail.com', 'password' => 'password123'],
            ['full_name' => 'Lisa Simpson', 'role' => 'employee', 'username' => 'lisasimpson', 'email' => 'lisa@gmail.com', 'password' => 'password123'],

            // Customers
            ['full_name' => 'Zoro Roronoa', 'role' => 'customer', 'username' => 'zoro', 'email' => 'zoro@gmail.com', 'password' => 'password123'],
            ['full_name' => 'Itachi Uchiha', 'role' => 'customer', 'username' => 'itachiuchiha', 'email' => 'itachi@gmail.com', 'password' => 'password123'],
            ['full_name' => 'Bob Richards', 'role' => 'customer', 'username' => 'bobrichards', 'email' => 'bob@gmail.com', 'password' => 'password123'],
            ['full_name' => 'Alice Johnson', 'role' => 'customer', 'username' => 'alicejohnson', 'email' => 'alice@gmail.com', 'password' => 'password123'],
        ];

        foreach ($users as $user) {
            $attrs = $this->mapUserAttributes($user);
            User::updateOrCreate(['email' => $attrs['email']], $attrs);
        }
    }

    protected function mapUserAttributes(array $u): array
    {
        $attrs = [
            'email' => $u['email'],
            'password' => Hash::make($u['password']),
        ];

        // name vs full_name
        if (Schema::hasColumn('users', 'full_name')) {
            $attrs['full_name'] = $u['full_name'];
        } elseif (Schema::hasColumn('users', 'name')) {
            $attrs['name'] = $u['full_name'];
        }

        if (Schema::hasColumn('users', 'username')) {
            $attrs['username'] = $u['username'];
        }

        if (Schema::hasColumn('users', 'role')) {
            $attrs['role'] = $u['role'];
        }

        if (Schema::hasColumn('users', 'email_verified_at')) {
            $attrs['email_verified_at'] = now();
        }

        return $attrs;
    }
}
