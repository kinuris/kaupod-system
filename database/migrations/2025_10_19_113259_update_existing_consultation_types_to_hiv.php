<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Update all existing consultation types to 'hiv'
        DB::table('consultation_requests')
            ->whereNotIn('consultation_type', ['hiv', 'gonorrhea', 'syphilis', 'chlamydia'])
            ->update(['consultation_type' => 'hiv']);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // This migration is irreversible since we don't know the original values
        // Optionally, you could restore to a default like 'general' if needed
    }
};
