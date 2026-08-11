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
        Schema::create('settings', function (Blueprint $table) {
            $table->id();

            $table->string('site_name')->nullable();
            $table->string('site_email')->nullable();
            $table->string('site_phone')->nullable();

            $table->text('site_address')->nullable();

            $table->string('timezone')->nullable();
            $table->string('currency')->nullable();

            $table->boolean('maintenance_mode')->default(false);

            $table->string('light_logo')->nullable();
            $table->string('dark_logo')->nullable();

            $table->string('favicon')->nullable();

            $table->string('meta_title')->nullable();

            $table->longText('meta_description')->nullable();

            $table->string('facebook')->nullable();
            $table->string('twitter')->nullable();
            $table->string('linkedin')->nullable();
            $table->string('instagram')->nullable();

            $table->longText('footer_text')->nullable();
            $table->string('copyright_text')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('settings');
    }
};
