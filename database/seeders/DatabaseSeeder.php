<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Admin User
        User::firstOrCreate(
            ['email' => 'admin@kaupod.com'],
            [
                'name' => 'Admin User',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
                'role' => 'admin',
            ]
        );

        // Client Users for Testing
        $clients = [
            [
                'email' => 'jane.smith@example.com',
                'name' => 'Jane Smith',
                'personal_info' => [
                    'date_of_birth' => '1995-03-15',
                    'address' => '123 Main St, New York, NY 10001',
                    'phone' => '+1-555-0101',
                ],
            ],
            [
                'email' => 'maria.rodriguez@example.com', 
                'name' => 'Maria Rodriguez',
                'personal_info' => [
                    'date_of_birth' => '1988-07-22',
                    'address' => '456 Oak Avenue, Los Angeles, CA 90210',
                    'phone' => '+1-555-0102',
                ],
            ],
            [
                'email' => 'alex.chen@example.com',
                'name' => 'Alex Chen',
                'personal_info' => [
                    'date_of_birth' => '1992-11-08',
                    'address' => '789 Pine Road, Chicago, IL 60601',
                    'phone' => '+1-555-0103',
                ],
            ],
            [
                'email' => 'taylor.johnson@example.com',
                'name' => 'Taylor Johnson',
                'personal_info' => [
                    'date_of_birth' => '1990-01-30',
                    'address' => '321 Elm Street, Miami, FL 33101',
                    'phone' => '+1-555-0104',
                ],
            ],
            [
                'email' => 'sarah.wilson@example.com',
                'name' => 'Sarah Wilson',
                'personal_info' => [
                    'date_of_birth' => '1993-09-12',
                    'address' => '654 Maple Drive, Seattle, WA 98101',
                    'phone' => '+1-555-0105',
                ],
            ]
        ];

        foreach ($clients as $clientData) {
            User::firstOrCreate(
                ['email' => $clientData['email']],
                array_merge($clientData, [
                    'password' => Hash::make('password'),
                    'email_verified_at' => now(),
                    'role' => 'client',
                ])
            );
        }

        $this->call([
            SettingsSeeder::class,
            HubSeeder::class,
        ]);
    }
}
