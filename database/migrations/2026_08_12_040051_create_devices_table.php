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
        Schema::create('devices', function (Blueprint $table) {
            $table->id();

            // Device owner
            $table->foreignId('team_id')
                ->constrained()
                ->cascadeOnDelete();

            // Device identification
            $table->string('name');
            $table->string('device_id')->unique();
            $table->string('imei')->nullable()->index();

            // Android/device information
            $table->string('manufacturer')->nullable();
            $table->string('model')->nullable();
            $table->string('android_version')->nullable();
            $table->string('app_version')->nullable();

            // SIM information
            // $table->unsignedTinyInteger('sim_slots')->default(1);
            // $table->string('sim_1_number')->nullable();
            // $table->string('sim_2_number')->nullable();
            // $table->string('sim_1_operator')->nullable();
            // $table->string('sim_2_operator')->nullable();

            // Gateway status
            $table->enum('status', [
                'online',
                'offline',
                'inactive',
            ])->default('offline');

            $table->timestamp('last_seen_at')->nullable();

            // Optional device token for API authentication
            $table->string('device_token')->nullable()->unique();

            $table->boolean('is_active')->default(true);

            $table->timestamps();

            $table->index(['team_id', 'status']);
            $table->index('last_seen_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('devices');
    }
};
