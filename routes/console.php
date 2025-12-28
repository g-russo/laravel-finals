<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// Schedule to process unpaid reservations
// Send reminders at 6 PM daily
Schedule::command('reservations:process-unpaid --send-reminders')
    ->dailyAt('18:00')
    ->description('Send payment reminder emails for unpaid reservations');

// Cancel overdue unpaid reservations at midnight
Schedule::command('reservations:process-unpaid --cancel-overdue')
    ->dailyAt('00:01')
    ->description('Cancel reservations that were not paid by end of day');
