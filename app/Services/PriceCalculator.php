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

    public function consultationPrice(): float
    {
        $platform = (float) Setting::get('consultation_platform_fee', 0);
        $expert = (float) Setting::get('consultation_expert_fee', 0);
        return round($platform + $expert, 2);
    }

    public function consultationPlatformFee(): float
    {
        return (float) Setting::get('consultation_platform_fee', 0);
    }

    public function consultationExpertFee(): float
    {
        return (float) Setting::get('consultation_expert_fee', 0);
    }
}
