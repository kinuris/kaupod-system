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
            $table->string('phone', 20)->nullable()->after('user_id');
            $table->date('preferred_date')->nullable()->after('phone');
            $table->string('preferred_time', 10)->nullable()->after('preferred_date');
            $table->string('consultation_type')->nullable()->after('preferred_time');
            $table->text('reason')->nullable()->after('consultation_type');
            $table->text('medical_history')->nullable()->after('reason');
            $table->json('timeline')->nullable()->after('notes');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('consultation_requests', function (Blueprint $table) {
            $table->dropColumn([
                'phone',
                'preferred_date',
                'preferred_time',
                'consultation_type',
                'reason',
                'medical_history',
                'timeline'
            ]);
        });
    }
};
