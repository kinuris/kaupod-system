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
            $table->decimal('delivery_latitude', 10, 8)->nullable()->after('delivery_notes');
            $table->decimal('delivery_longitude', 11, 8)->nullable()->after('delivery_latitude');
            $table->text('delivery_location_address')->nullable()->after('delivery_longitude');
            $table->text('delivery_address')->nullable()->after('delivery_location_address');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('kit_orders', function (Blueprint $table) {
            $table->dropColumn([
                'delivery_latitude',
                'delivery_longitude', 
                'delivery_location_address',
                'delivery_address'
            ]);
        });
    }
};
