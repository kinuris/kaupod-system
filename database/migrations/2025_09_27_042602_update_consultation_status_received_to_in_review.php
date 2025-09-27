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
        // Update existing 'received' status to 'in_review'
        DB::table('consultation_requests')
            ->where('status', 'received')
            ->update(['status' => 'in_review']);
        
        // Update timeline entries
        DB::table('consultation_requests')
            ->whereJsonContains('timeline', 'received')
            ->get()
            ->each(function ($consultation) {
                $timeline = json_decode($consultation->timeline, true);
                if ($timeline) {
                    foreach ($timeline as $timestamp => $status) {
                        if ($status === 'received') {
                            $timeline[$timestamp] = 'in_review';
                        }
                    }
                    DB::table('consultation_requests')
                        ->where('id', $consultation->id)
                        ->update(['timeline' => json_encode($timeline)]);
                }
            });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Revert 'in_review' status back to 'received'
        DB::table('consultation_requests')
            ->where('status', 'in_review')
            ->update(['status' => 'received']);
        
        // Revert timeline entries
        DB::table('consultation_requests')
            ->whereJsonContains('timeline', 'in_review')
            ->get()
            ->each(function ($consultation) {
                $timeline = json_decode($consultation->timeline, true);
                if ($timeline) {
                    foreach ($timeline as $timestamp => $status) {
                        if ($status === 'in_review') {
                            $timeline[$timestamp] = 'received';
                        }
                    }
                    DB::table('consultation_requests')
                        ->where('id', $consultation->id)
                        ->update(['timeline' => json_encode($timeline)]);
                }
            });
    }
};
