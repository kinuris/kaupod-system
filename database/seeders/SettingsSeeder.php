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
    }
}
