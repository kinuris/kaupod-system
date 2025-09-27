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
        Schema::table('consultation_requests', function (Blueprint $table) {
            // Drop the existing foreign key constraint that points to users table
            $table->dropForeign(['assigned_partner_doctor_id']);
            
            // Add the correct foreign key constraint that points to partner_doctors table
            $table->foreign('assigned_partner_doctor_id')->references('id')->on('partner_doctors');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('consultation_requests', function (Blueprint $table) {
            // Drop the correct foreign key constraint
            $table->dropForeign(['assigned_partner_doctor_id']);
            
            // Restore the incorrect foreign key constraint (for rollback purposes)
            $table->foreign('assigned_partner_doctor_id')->references('id')->on('users');
        });
    }
};
