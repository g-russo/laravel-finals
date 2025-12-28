<?php

namespace App\Console\Commands;

use App\Mail\PaymentReminderMail;
use App\Models\Reservation;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class ProcessUnpaidReservations extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'reservations:process-unpaid 
                            {--send-reminders : Send payment reminder emails}
                            {--cancel-overdue : Cancel reservations that are past due}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Process unpaid reservations: send payment reminders and cancel overdue bookings';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Processing unpaid reservations...');

        $sendReminders = $this->option('send-reminders');
        $cancelOverdue = $this->option('cancel-overdue');

        // If no options specified, do both
        if (!$sendReminders && !$cancelOverdue) {
            $sendReminders = true;
            $cancelOverdue = true;
        }

        if ($sendReminders) {
            $this->sendPaymentReminders();
        }

        if ($cancelOverdue) {
            $this->cancelOverdueReservations();
        }

        $this->info('Done processing unpaid reservations.');

        return Command::SUCCESS;
    }

    /**
     * Send payment reminder emails to users with unpaid reservations
     */
    private function sendPaymentReminders(): void
    {
        $this->info('Sending payment reminder emails...');

        // Get pending reservations created today that haven't been paid
        $unpaidReservations = Reservation::with(['user', 'accommodation', 'package'])
            ->where('status', 'pending')
            ->where('payment_status', 'unpaid')
            ->whereDate('created_at', Carbon::today())
            ->get();

        $count = 0;
        foreach ($unpaidReservations as $reservation) {
            if ($reservation->user && $reservation->user->email) {
                try {
                    Mail::to($reservation->user->email)
                        ->send(new PaymentReminderMail($reservation));

                    $count++;
                    $this->line("  Sent reminder to: {$reservation->user->email} for reservation #{$reservation->reservation_id}");

                    Log::info('Payment reminder sent', [
                        'reservation_id' => $reservation->reservation_id,
                        'user_email' => $reservation->user->email,
                    ]);
                } catch (\Exception $e) {
                    $this->error("  Failed to send to: {$reservation->user->email} - {$e->getMessage()}");
                    Log::error('Failed to send payment reminder', [
                        'reservation_id' => $reservation->reservation_id,
                        'error' => $e->getMessage(),
                    ]);
                }
            }
        }

        $this->info("  Sent {$count} payment reminder(s).");
    }

    /**
     * Cancel reservations that were created yesterday and still unpaid
     */
    private function cancelOverdueReservations(): void
    {
        $this->info('Cancelling overdue unpaid reservations...');

        // Get pending reservations created before today that are still unpaid
        $overdueReservations = Reservation::with(['user', 'accommodation', 'package'])
            ->where('status', 'pending')
            ->where('payment_status', 'unpaid')
            ->whereDate('created_at', '<', Carbon::today())
            ->get();

        $count = 0;
        foreach ($overdueReservations as $reservation) {
            $reservation->update([
                'status' => 'cancelled',
                'cancelled_at' => now(),
                'cancellation_reason' => 'Automatically cancelled due to non-payment',
            ]);

            $count++;
            $this->line("  Cancelled reservation #{$reservation->reservation_id} for user: {$reservation->user->email}");

            Log::info('Reservation auto-cancelled due to non-payment', [
                'reservation_id' => $reservation->reservation_id,
                'user_id' => $reservation->user_id,
            ]);
        }

        $this->info("  Cancelled {$count} overdue reservation(s).");
    }
}
