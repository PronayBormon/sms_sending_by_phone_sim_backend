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
            $table->enum('two_factor_type', ['none', 'authenticator', 'email'])->default('none')->after('two_factor_recovery_codes');
            $table->string('two_factor_email_code')->nullable()->after('two_factor_type');
            $table->timestamp('two_factor_email_code_expires_at')->nullable()->after('two_factor_email_code');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'two_factor_type',
                'two_factor_email_code',
                'two_factor_email_code_expires_at',
            ]);
        });
    }
};
