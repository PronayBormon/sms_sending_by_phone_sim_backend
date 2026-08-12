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
        Schema::create('campaigns', function (Blueprint $table) {
            $table->id();
            $table->foreignId('team_id')->nullable()->constrained('teams')->cascadeOnDelete();
            $table->foreignId('template_id')->nullable()->constrained('message_templates')->nullOnDelete();
            $table->foreignId('sim_id')->nullable()->constrained('device_sims')->nullOnDelete();
            $table->string('campaign_name')->nullable();
            $table->longText('description')->nullable();
            $table->enum('campaign_type', ['regular', 'automated', 'ab_test'])->default('regular');
            $table->json('tags')->nullable();
            $table->foreignId('recipients_list_ids')->nullable()->constrained('contact_lists')->nullOnDelete();
            $table->string('from_name')->nullable();
            $table->string('from_email')->nullable();
            $table->string('reply_email')->nullable();
            $table->string('subject_line')->nullable();
            $table->text('preview_text')->nullable();
            $table->enum('schedule_type', ['now', 'later'])->default('now');
            $table->date('date')->nullable();
            $table->time('time')->nullable();
            $table->string('timezone')->nullable();
            $table->boolean('is_draft')->default(false);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('campaigns');
    }
};
