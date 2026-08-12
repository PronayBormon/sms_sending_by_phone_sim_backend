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
        Schema::create('sms_logs', function (Blueprint $table) {
            $table->id();
            // Team
            $table->foreignId('team_id')
                ->constrained()
                ->cascadeOnDelete();

            // User who initiated/scheduled the SMS
            $table->foreignId('user_id')
                ->nullable()
                ->constrained()
                ->nullOnDelete();

            // Gateway device
            $table->foreignId('device_id')
                ->nullable()
                ->constrained('devices')
                ->nullOnDelete();

            // Campaign
            $table->foreignId('campaign_id')
                ->nullable()
                ->constrained('campaigns')
                ->nullOnDelete();

            // SIM slot
            $table->unsignedTinyInteger('sim_slot')->nullable();

            // SMS details
            $table->string('sender')->nullable();
            $table->string('recipient');
            $table->text('message');

            // Status
            $table->enum('status', [
                'pending',
                'queued',
                'sending',
                'sent',
                'delivered',
                'failed',
                'cancelled',
            ])->default('pending');

            // Gateway information
            $table->string('gateway_message_id')->nullable()->index();
            $table->string('gateway_status')->nullable();
            $table->text('gateway_response')->nullable();
            $table->text('error_message')->nullable();

            // Timing
            $table->timestamp('queued_at')->nullable();
            $table->timestamp('sent_at')->nullable();
            $table->timestamp('delivered_at')->nullable();
            $table->timestamp('failed_at')->nullable();

            // Retry
            $table->unsignedTinyInteger('attempts')->default(0);
            $table->timestamp('next_retry_at')->nullable();

            $table->timestamps();

            // Indexes
            $table->index(['team_id', 'status']);
            $table->index(['team_id', 'campaign_id']);
            $table->index(['team_id', 'device_id']);
            $table->index(['team_id', 'created_at']);
            $table->index('recipient');
            $table->index('sent_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sms_logs');
    }
};
