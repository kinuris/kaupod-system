<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\PartnerDoctor;

class SamplePartnerDoctorSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $sampleDoctors = [
            [
                'name' => 'Dr. Sarah Johnson',
                'specialty' => 'General Practice',
                'contact_details' => [
                    'email' => 'sarah.johnson@medical.com',
                    'phone' => '+1 (555) 123-4567'
                ],
                'is_active' => true,
            ],
            [
                'name' => 'Dr. Michael Chen',
                'specialty' => 'Cardiology',
                'contact_details' => [
                    'email' => 'michael.chen@medical.com',
                    'phone' => '+1 (555) 234-5678'
                ],
                'is_active' => true,
            ],
            [
                'name' => 'Dr. Emily Rodriguez',
                'specialty' => 'Internal Medicine',
                'contact_details' => [
                    'email' => 'emily.rodriguez@medical.com',
                    'phone' => '+1 (555) 345-6789'
                ],
                'is_active' => true,
            ],
            [
                'name' => 'Dr. David Kim',
                'specialty' => 'Endocrinology',
                'contact_details' => [
                    'email' => 'david.kim@medical.com',
                    'phone' => '+1 (555) 456-7890'
                ],
                'is_active' => true,
            ],
            [
                'name' => 'Dr. Lisa Thompson',
                'specialty' => 'Dermatology',
                'contact_details' => [
                    'email' => 'lisa.thompson@medical.com',
                    'phone' => '+1 (555) 567-8901'
                ],
                'is_active' => false, // This one is inactive for testing
            ],
        ];

        foreach ($sampleDoctors as $doctor) {
            PartnerDoctor::create($doctor);
        }
    }
}
