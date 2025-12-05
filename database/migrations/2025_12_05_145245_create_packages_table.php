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
        Schema::create('packages', function (Blueprint $table) {
            $table->id('package_id');
            $table->string('package_name');
            $table->text('description');
            $table->decimal('price', 10, 2);
            $table->text('inclusion_details');
            $table->string('image_path')->nullable();
            $table->enum('status', ['active', 'inactive'])->default('active');
            $table->timestamps();
            $table->softDeletes();
        });

        // Create pivot table for package-accommodation relationship
        Schema::create('package_accommodations', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('package_id');
            $table->unsignedBigInteger('accommodation_id');
            $table->integer('quantity')->default(1);
            $table->timestamps();
            
            $table->foreign('package_id')->references('package_id')->on('packages')->onDelete('cascade');
            $table->foreign('accommodation_id')->references('accommodation_id')->on('accommodations')->onDelete('cascade');
            $table->unique(['package_id', 'accommodation_id']);
        });

        // Create pivot table for package-amenity relationship
        Schema::create('package_amenities', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('package_id');
            $table->unsignedBigInteger('amenity_id');
            $table->integer('quantity')->default(1);
            $table->timestamps();
            
            $table->foreign('package_id')->references('package_id')->on('packages')->onDelete('cascade');
            $table->foreign('amenity_id')->references('amenity_id')->on('amenities')->onDelete('cascade');
            $table->unique(['package_id', 'amenity_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('package_amenities');
        Schema::dropIfExists('package_accommodations');
        Schema::dropIfExists('packages');
    }
};
