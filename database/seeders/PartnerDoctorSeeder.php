<?php

namespace Database\Seeders;

use App\Models\PartnerDoctor;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PartnerDoctorSeeder extends Seeder
{
    /**
     * Run the database seeder.
     */
    public function run(): void
    {
        $partnerDoctors = [
            [
                'name' => 'Dr. Sarah Chen',
                'specialty' => 'Reproductive Health Specialist',
                'contact_details' => [
                    'email' => 'sarah.chen@partners.kaupod.com',
                    'phone' => '+1-555-0101',
                    'license' => 'MD-12345',
                ],
                'is_active' => true,
            ],
            [
                'name' => 'Dr. Michael Rodriguez',
                'specialty' => 'General Practitioner',
                'contact_details' => [
                    'email' => 'michael.rodriguez@partners.kaupod.com',
                    'phone' => '+1-555-0102',
                    'license' => 'MD-12346',
                ],
                'is_active' => true,
            ],
            [
                'name' => 'Dr. Emily Johnson',
                'specialty' => 'Contraception & Family Planning',
                'contact_details' => [
                    'email' => 'emily.johnson@partners.kaupod.com',
                    'phone' => '+1-555-0103',
                    'license' => 'MD-12347',
                ],
                'is_active' => true,
            ],
            [
                'name' => 'Dr. David Kim',
                'specialty' => 'Sexual Health Expert',
                'contact_details' => [
                    'email' => 'david.kim@partners.kaupod.com',
                    'phone' => '+1-555-0104',
                    'license' => 'MD-12348',
                ],
                'is_active' => true,
            ],
            [
                'name' => 'Dr. Lisa Thompson',
                'specialty' => 'Counseling & Mental Health',
                'contact_details' => [
                    'email' => 'lisa.thompson@partners.kaupod.com',
                    'phone' => '+1-555-0105',
                    'license' => 'PHD-5678',
                ],
                'is_active' => true,
            ],
        ];

        foreach ($partnerDoctors as $doctor) {
            PartnerDoctor::create($doctor);
        }
    }
}
