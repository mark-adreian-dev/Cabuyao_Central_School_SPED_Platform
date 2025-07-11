<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('activity_sections', function (Blueprint $table) {
            $table->id();
            $table->foreignId('activity_id')->constrained()->onDelete("cascade");
            $table->foreignId('section_id')->constrained()->onDelete("cascade");
            $table->dateTime("deadline");
            $table->integer("grading_period");
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('activity_sections');
    }
};