<?php

namespace App\Services;

use App\Enums\SubscriptionTier;
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

    public function subscriptionPrice(SubscriptionTier $tier): float
    {
        return match($tier) {
            SubscriptionTier::OneTime => $this->kitPrice(),
            SubscriptionTier::AnnualModerate => (float) Setting::get('annual_moderate_subscription_price', 0),
            SubscriptionTier::AnnualHigh => (float) Setting::get('annual_high_subscription_price', 0),
        };
    }

    public function getSubscriptionOptions(): array
    {
        return [
            'one_time' => [
                'tier' => SubscriptionTier::OneTime,
                'name' => SubscriptionTier::OneTime->getDisplayName(),
                'description' => SubscriptionTier::OneTime->getDescription(),
                'price' => $this->subscriptionPrice(SubscriptionTier::OneTime),
                'kits_allowed' => SubscriptionTier::OneTime->getKitsAllowed(),
                'annual' => false,
            ],
            'annual_moderate' => [
                'tier' => SubscriptionTier::AnnualModerate,
                'name' => SubscriptionTier::AnnualModerate->getDisplayName(),
                'description' => SubscriptionTier::AnnualModerate->getDescription(),
                'price' => $this->subscriptionPrice(SubscriptionTier::AnnualModerate),
                'kits_allowed' => SubscriptionTier::AnnualModerate->getKitsAllowed(),
                'annual' => true,
            ],
            'annual_high' => [
                'tier' => SubscriptionTier::AnnualHigh,
                'name' => SubscriptionTier::AnnualHigh->getDisplayName(),
                'description' => SubscriptionTier::AnnualHigh->getDescription(),
                'price' => $this->subscriptionPrice(SubscriptionTier::AnnualHigh),
                'kits_allowed' => SubscriptionTier::AnnualHigh->getKitsAllowed(),
                'annual' => true,
            ],
        ];
    }
}
