<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('reservation_amenities', function (Blueprint $table) {
            $table->id();
            $table->foreignId('reservation_id')->constrained('reservations', 'reservation_id')->onDelete('cascade');
            $table->foreignId('amenity_id')->constrained('amenities', 'amenity_id')->onDelete('cascade');
            $table->decimal('price', 10, 2); // Price at time of booking
            $table->date('booking_date'); // Specific date for amenity use
            $table->time('start_time')->nullable();
            $table->time('end_time')->nullable();
            $table->timestamps();

            // Prevent duplicate amenity bookings for same reservation and date
            $table->unique(['reservation_id', 'amenity_id', 'booking_date'], 'reservation_amenity_unique');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reservation_amenities');
    }
};
