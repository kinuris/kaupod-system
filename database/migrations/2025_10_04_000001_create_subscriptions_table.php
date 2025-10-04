<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('subscriptions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->enum('tier', ['one_time', 'annual_moderate', 'annual_high']);
            $table->decimal('price', 8, 2);
            $table->integer('kits_allowed'); // Number of kits allowed per subscription
            $table->integer('kits_used')->default(0); // Number of kits used so far
            $table->date('expires_at')->nullable(); // Only for annual subscriptions
            $table->enum('status', ['active', 'expired', 'cancelled'])->default('active');
            $table->json('timeline')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('subscriptions');
    }
};