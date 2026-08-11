<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('smtps', function (Blueprint $table) {
            $table->boolean('is_active')->default(false)->after('encryption');
            $table->timestamp('last_tested_at')->nullable()->after('is_active');
            $table->integer('last_test_response_ms')->nullable()->after('last_tested_at');
            $table->boolean('last_test_passed')->nullable()->after('last_test_response_ms');
            $table->text('last_test_error')->nullable()->after('last_test_passed');
        });
    }

    public function down(): void
    {
        Schema::table('smtps', function (Blueprint $table) {
            $table->dropColumn([
                'is_active',
                'last_tested_at',
                'last_test_response_ms',
                'last_test_passed',
                'last_test_error',
            ]);
        });
    }
};
