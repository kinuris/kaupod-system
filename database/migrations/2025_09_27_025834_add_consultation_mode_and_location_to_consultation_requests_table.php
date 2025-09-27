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
            $table->enum('consultation_mode', ['online', 'in-person'])->after('consultation_type');
            $table->decimal('consultation_latitude', 10, 8)->nullable()->after('consultation_mode');
            $table->decimal('consultation_longitude', 11, 8)->nullable()->after('consultation_latitude');
            $table->text('consultation_location_address')->nullable()->after('consultation_longitude');
            $table->foreignId('assigned_partner_doctor_id')->nullable()->constrained('users')->after('consultation_location_address');
            $table->timestamp('scheduled_datetime')->nullable()->after('confirmed_datetime');
            $table->text('rescheduling_reason')->nullable()->after('scheduled_datetime');
            $table->timestamp('last_rescheduled_at')->nullable()->after('rescheduling_reason');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('consultation_requests', function (Blueprint $table) {
            $table->dropColumn([
                'consultation_mode',
                'consultation_latitude',
                'consultation_longitude',
                'consultation_location_address',
                'assigned_partner_doctor_id',
                'scheduled_datetime',
                'rescheduling_reason',
                'last_rescheduled_at'
            ]);
        });
    }
};
