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
        Schema::table('kit_orders', function (Blueprint $table) {
            $table->string('return_location_address')->nullable()->after('delivery_address');
            $table->decimal('return_latitude', 10, 8)->nullable()->after('return_location_address');
            $table->decimal('return_longitude', 11, 8)->nullable()->after('return_latitude');
            $table->string('return_address')->nullable()->after('return_longitude');
            $table->datetime('return_date')->nullable()->after('return_address');
            $table->text('return_notes')->nullable()->after('return_date');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('kit_orders', function (Blueprint $table) {
            $table->dropColumn([
                'return_location_address',
                'return_latitude',
                'return_longitude',
                'return_address',
                'return_date',
                'return_notes'
            ]);
        });
    }
};
