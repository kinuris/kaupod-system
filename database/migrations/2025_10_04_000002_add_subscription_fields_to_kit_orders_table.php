<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('kit_orders', function (Blueprint $table) {
            $table->foreignId('subscription_id')->nullable()->constrained()->nullOnDelete()->after('user_id');
            $table->enum('purchase_type', ['one_time', 'subscription'])->default('one_time')->after('subscription_id');
        });
    }

    public function down(): void
    {
        Schema::table('kit_orders', function (Blueprint $table) {
            $table->dropForeign(['subscription_id']);
            $table->dropColumn(['subscription_id', 'purchase_type']);
        });
    }
};