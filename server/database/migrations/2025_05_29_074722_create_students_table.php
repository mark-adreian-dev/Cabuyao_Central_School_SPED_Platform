<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('students', function (Blueprint $table) {
            $table->unsignedBigInteger('id')->primary();
            $table->foreignId('user_id')->constrained();
            $table->integer('grade_level');
            $table->string('mother_tongue');
            $table->string('LRN');
            $table->string('current_school');
            $table->timestamps();
        });

        $year = now()->format('y');
        $startId = intval($year) * 1000;

        DB::statement("ALTER TABLE students AUTO_INCREMENT = $startId;");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('students');
    }
};
