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
        Schema::table('users', function (Blueprint $table) {
            $table->boolean('email_notifications')->after('password')->default(true);
            $table->boolean('push_notifications')->after('email_notifications')->default(true);
            $table->boolean('sms_notifications')->after('push_notifications')->default(false);
            $table->boolean('match_notifications')->after('sms_notifications')->default(true);
            $table->boolean('message_notifications')->after('match_notifications')->default(true);
            $table->boolean('like_notifications')->after('message_notifications')->default(true);
            $table->boolean('marketing_notifications')->after('like_notifications')->default(false);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                "email_notifications",
                "push_notifications",
                "sms_notifications",
                "match_notifications",
                "message_notifications",
                "like_notifications",
                "marketing_notifications",
            ]);
        });
    }
};
