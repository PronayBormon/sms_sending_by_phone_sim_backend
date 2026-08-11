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
        Schema::table('campaigns', function (Blueprint $table) {
            // Drop old column
            $table->dropForeign(['recipients_list_ids']);
            $table->dropColumn('recipients_list_ids');

            // Add new columns
            $table->json('recipient_list_ids')->nullable()->after('tags');
            $table->enum('status', ['draft', 'scheduled', 'sending', 'completed', 'paused', 'failed'])->default('draft')->after('is_draft');
        });

        Schema::create('campaign_stats', function (Blueprint $table) {
            $table->id();
            $table->foreignId('campaign_id')->constrained('campaigns')->cascadeOnDelete();
            $table->integer('total_recipients')->default(0);
            $table->integer('delivered_count')->default(0);
            $table->integer('opened_count')->default(0);
            $table->integer('clicked_count')->default(0);
            $table->integer('bounced_count')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('campaign_stats');

        Schema::table('campaigns', function (Blueprint $table) {
            $table->dropColumn('status');
            $table->dropColumn('recipient_list_ids');
            $table->foreignId('recipients_list_ids')->nullable()->constrained('contact_lists')->nullOnDelete();
        });
    }
};
