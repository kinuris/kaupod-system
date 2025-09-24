<?php

namespace App\Services;

use App\Models\Setting;

class PriceCalculator
{
    public function kitPrice(): float
    {
        $base = (float) Setting::get('kit_base_price', 0);
        $shipping = (float) Setting::get('shipping_fee', 0);
        return round($base + $shipping, 2);
    }
}
