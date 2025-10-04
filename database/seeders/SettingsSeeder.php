<?php

namespace Database\Seeders;

use App\Models\Setting;
use Illuminate\Database\Seeder;

class SettingsSeeder extends Seeder
{
    public function run(): void
    {
        Setting::set('kit_base_price', '350.00');
        Setting::set('shipping_fee', '120.00');
        Setting::set('consultation_platform_fee', '200.00');
        Setting::set('consultation_expert_fee', '500.00');
        
        // Subscription pricing - configurable by admin
        Setting::set('annual_moderate_subscription_price', '800.00'); // 2 kits per year
        Setting::set('annual_high_subscription_price', '1400.00');    // 4 kits per year
    }
}
