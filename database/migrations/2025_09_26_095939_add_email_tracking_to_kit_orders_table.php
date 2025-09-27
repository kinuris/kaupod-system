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
            $table->boolean('result_email_sent')->default(false)->after('return_notes');
            $table->timestamp('result_email_sent_at')->nullable()->after('result_email_sent');
            $table->text('result_email_notes')->nullable()->after('result_email_sent_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('kit_orders', function (Blueprint $table) {
            $table->dropColumn([
                'result_email_sent',
                'result_email_sent_at',
                'result_email_notes'
            ]);
        });
    }
};
