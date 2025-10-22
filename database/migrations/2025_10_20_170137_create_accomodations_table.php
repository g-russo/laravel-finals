<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('accommodations', function (Blueprint $table) {
            $table->id('accommodation_id');
            $table->string('accommodation_name');
            $table->text('description');
            $table->integer('capacity');
            $table->decimal('price_per_night', 10, 2);
            $table->enum('availability_status', ['available', 'occupied', 'maintenance', 'reserved'])->default('available');
            $table->string('image_url')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('accommodations');
    }
};