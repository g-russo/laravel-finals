<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;

class MakeUserAdmin extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'user:make-admin {email : The email of the user to make admin}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Make a user admin by their email address';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $email = $this->argument('email');
        
        $user = User::where('email', $email)->first();
        
        if (!$user) {
            $this->error("User with email '{$email}' not found.");
            return 1;
        }
        
        if ($user->role === 'admin') {
            $this->info("User '{$user->full_name}' ({$email}) is already an admin.");
            return 0;
        }
        
        $user->update(['role' => 'admin']);
        
        $this->info("Successfully made '{$user->full_name}' ({$email}) an admin!");
        
        return 0;
    }
}
