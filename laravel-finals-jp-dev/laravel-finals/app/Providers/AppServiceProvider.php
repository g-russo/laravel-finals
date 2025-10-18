<?php

namespace App\Providers;

use App\Database\NeonConnector;
use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Database\PostgresConnection;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        // Register custom NeonDB connector for PostgreSQL
        $this->app->singleton('db.connector.pgsql', function () {
            return new NeonConnector();
        });
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        ResetPassword::createUrlUsing(function (object $notifiable, string $token) {
            return config('app.frontend_url') . "/password-reset/$token?email={$notifiable->getEmailForPasswordReset()}";
        });
    }
}
