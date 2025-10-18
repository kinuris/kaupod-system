<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\ConsultationRequest;
use App\Models\User;
use App\Models\PartnerDoctor;
use App\Enums\ConsultationStatus;

class ConsultationTestDataSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get existing users or use first available user
        $users = User::where('role', '!=', 'admin')->get();
        if ($users->isEmpty()) {
            // Create basic test users if none exist
            $user1 = User::create([
                'name' => 'John Doe',
                'email' => 'testclient1@example.com',
                'email_verified_at' => now(),
                'password' => bcrypt('password'),
                'role' => 'client'
            ]);

            $user2 = User::create([
                'name' => 'Jane Smith',
                'email' => 'testclient2@example.com',
                'email_verified_at' => now(),
                'password' => bcrypt('password'),
                'role' => 'client'
            ]);
        } else {
            $user1 = $users->first();
            $user2 = $users->count() > 1 ? $users->skip(1)->first() : $user1;
        }

        // Use existing partner doctor or create one
        $doctor = PartnerDoctor::first();
        if (!$doctor) {
            $doctor = PartnerDoctor::create([
                'name' => 'Dr. Test Doctor',
                'specialty' => 'General Medicine',
                'contact_details' => [
                    'email' => 'doctor@example.com',
                    'phone' => '09555555555'
                ],
                'is_active' => true
            ]);
        }

        // Create test consultation requests with confirmed status and meeting links
        $consultations = [
            [
                'user_id' => $user1->id,
                'phone' => '09123456789',
                'preferred_date' => now()->addDays(1)->format('Y-m-d'),
                'preferred_time' => '10:00',
                'consultation_type' => 'routine',
                'consultation_mode' => 'online',
                'reason' => 'Regular health checkup and consultation',
                'medical_history' => 'No significant medical history',
                'status' => ConsultationStatus::Confirmed,
                'assigned_partner_doctor_id' => $doctor->id,
                'meeting_link' => 'https://meet.kaupod.com/kaupod-consultation-' . time() . '-' . substr(str_shuffle('abcdefghijklmnopqrstuvwxyz0123456789'), 0, 8),
                'subscription_tier' => 'basic_monthly',
                'tier_price' => 299,
                'timeline' => [
                    now()->subHours(2)->format('Y-m-d H:i:s') => 'in_review',
                    now()->subHours(1)->format('Y-m-d H:i:s') => 'coordinating',
                    now()->format('Y-m-d H:i:s') => 'confirmed',
                ],
                'schedule_preferences' => [
                    'preferred_date' => now()->addDays(1)->format('Y-m-d'),
                    'preferred_time' => '10:00',
                    'consultation_type' => 'routine',
                    'consultation_mode' => 'online',
                    'subscription_tier' => 'basic_monthly',
                    'tier_price' => 299
                ]
            ],
            [
                'user_id' => $user2->id,
                'phone' => '09987654321',
                'preferred_date' => now()->addDays(2)->format('Y-m-d'),
                'preferred_time' => '14:00',
                'consultation_type' => 'emergency',
                'consultation_mode' => 'online',
                'reason' => 'Urgent medical consultation needed',
                'medical_history' => 'Hypertension, diabetes',
                'status' => ConsultationStatus::Confirmed,
                'assigned_partner_doctor_id' => $doctor->id,
                'meeting_link' => 'https://meet.kaupod.com/kaupod-consultation-' . (time() + 1) . '-' . substr(str_shuffle('abcdefghijklmnopqrstuvwxyz0123456789'), 0, 8),
                'subscription_tier' => 'moderate_annual',
                'tier_price' => 1190,
                'timeline' => [
                    now()->subHours(3)->format('Y-m-d H:i:s') => 'in_review',
                    now()->subHours(2)->format('Y-m-d H:i:s') => 'coordinating',
                    now()->subMinutes(30)->format('Y-m-d H:i:s') => 'confirmed',
                ],
                'schedule_preferences' => [
                    'preferred_date' => now()->addDays(2)->format('Y-m-d'),
                    'preferred_time' => '14:00',
                    'consultation_type' => 'emergency',
                    'consultation_mode' => 'online',
                    'subscription_tier' => 'moderate_annual',
                    'tier_price' => 1190
                ]
            ],
            [
                'user_id' => $user1->id,
                'phone' => '09123456789',
                'preferred_date' => now()->addDays(3)->format('Y-m-d'),
                'preferred_time' => '16:00',
                'consultation_type' => 'follow_up',
                'consultation_mode' => 'online',
                'reason' => 'Follow-up consultation for previous treatment',
                'medical_history' => 'Previous consultation last month',
                'status' => ConsultationStatus::Confirmed,
                'assigned_partner_doctor_id' => $doctor->id,
                'meeting_link' => 'https://meet.kaupod.com/kaupod-consultation-' . (time() + 2) . '-' . substr(str_shuffle('abcdefghijklmnopqrstuvwxyz0123456789'), 0, 8),
                'subscription_tier' => 'premium_annual',
                'tier_price' => 1990,
                'timeline' => [
                    now()->subHours(4)->format('Y-m-d H:i:s') => 'in_review',
                    now()->subHours(3)->format('Y-m-d H:i:s') => 'coordinating',
                    now()->subHours(1)->format('Y-m-d H:i:s') => 'confirmed',
                ],
                'schedule_preferences' => [
                    'preferred_date' => now()->addDays(3)->format('Y-m-d'),
                    'preferred_time' => '16:00',
                    'consultation_type' => 'follow_up',
                    'consultation_mode' => 'online',
                    'subscription_tier' => 'premium_annual',
                    'tier_price' => 1990
                ]
            ]
        ];

        foreach ($consultations as $consultationData) {
            ConsultationRequest::create($consultationData);
        }

        $this->command->info('Created 3 test consultation requests with confirmed status and meeting links.');
    }
}
