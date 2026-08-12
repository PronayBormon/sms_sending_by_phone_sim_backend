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
        Schema::create('device_sims', function (Blueprint $table) {
            $table->id();
            // Team
            $table->foreignId('team_id')
                ->constrained()
                ->cascadeOnDelete();

            // Gateway device
            $table->foreignId('device_id')
                ->constrained('devices')
                ->cascadeOnDelete();

            // SIM slot
            $table->unsignedTinyInteger('slot_number');

            // SIM information
            $table->string('phone_number')->nullable();
            $table->string('operator')->nullable();
            $table->string('country_code')->nullable();

            // Android SIM information
            $table->string('subscription_id')->nullable();
            $table->string('sim_serial_number')->nullable();
            $table->string('carrier_name')->nullable();

            // Status
            $table->enum('status', [
                'active',
                'inactive',
                'no_signal',
                'disabled',
            ])->default('active');

            // SMS capability
            $table->boolean('is_enabled')->default(true);

            // Statistics
            $table->unsignedBigInteger('total_sent')->default(0);
            $table->unsignedBigInteger('total_failed')->default(0);

            $table->timestamp('last_used_at')->nullable();

            $table->timestamps();

            // One SIM slot per device
            $table->unique([
                'device_id',
                'slot_number',
            ]);

            $table->index([
                'team_id',
                'status',
            ]);

            $table->index('phone_number');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('device_sims');
    }
};
