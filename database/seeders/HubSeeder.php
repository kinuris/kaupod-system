<?php

namespace Database\Seeders;

use App\Models\Hub;
use Illuminate\Database\Seeder;

class HubSeeder extends Seeder
{
    public function run(): void
    {
        Hub::create([
            'name' => 'Capiz Provincial Health Office',
            'address' => 'Roxas City, Capiz',
            'latitude' => 11.5853,
            'longitude' => 122.7511,
            'contact_info' => ['phone' => '+63-36-000-0000'],
            'services_offered' => 'Counseling, Testing, Follow-up',
        ]);
    }
}
