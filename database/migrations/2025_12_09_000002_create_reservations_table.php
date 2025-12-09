<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('reservations', function (Blueprint $table) {
            $table->id('reservation_id');
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('accommodation_id')->nullable()->constrained('accommodations', 'accommodation_id')->onDelete('cascade');
            $table->foreignId('package_id')->nullable()->constrained('packages', 'package_id')->onDelete('set null');
            
            // Booking details
            $table->date('check_in_date');
            $table->date('check_out_date');
            $table->enum('booking_type', ['day_tour', 'night_tour', 'overnight', 'alternative_overnight']);
            $table->integer('number_of_guests');
            
            // Time slots based on booking type
            $table->time('start_time');
            $table->time('end_time');
            
            // Pricing
            $table->decimal('accommodation_price', 10, 2)->default(0);
            $table->decimal('package_price', 10, 2)->default(0);
            $table->decimal('amenities_price', 10, 2)->default(0);
            $table->decimal('total_price', 10, 2);
            
            // Status
            $table->enum('status', ['pending', 'confirmed', 'cancelled', 'completed'])->default('pending');
            $table->text('cancellation_reason')->nullable();
            $table->timestamp('confirmed_at')->nullable();
            $table->timestamp('cancelled_at')->nullable();
            
            $table->text('special_requests')->nullable();
            $table->timestamps();
            
            // Indexes for performance
            $table->index(['check_in_date', 'check_out_date']);
            $table->index(['status']);
            $table->index(['user_id', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reservations');
    }
};
