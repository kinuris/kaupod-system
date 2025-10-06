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

    public function consultationModerateDiscount(): float
    {
        return (float) Setting::get('consultation_moderate_discount', 15.00);
    }

    public function consultationHighDiscount(): float
    {
        return (float) Setting::get('consultation_high_discount', 25.00);
    }

    public function consultationTierPrice(string $tier): float
    {
        $basePrice = $this->consultationPrice();
        
        return match($tier) {
            'one_time' => $basePrice,
            'moderate_annual' => $basePrice * 2 * (1 - $this->consultationModerateDiscount() / 100),
            'high_annual' => $basePrice * 4 * (1 - $this->consultationHighDiscount() / 100),
            default => $basePrice,
        };
    }

    public function getConsultationOptions(): array
    {
        $basePrice = $this->consultationPrice();
        $moderateDiscount = $this->consultationModerateDiscount();
        $highDiscount = $this->consultationHighDiscount();

        return [
            'one_time' => [
                'name' => 'Single Consultation',
                'description' => 'One professional consultation',
                'price' => $basePrice,
                'consultations_allowed' => 1,
                'discount_percent' => 0,
                'savings' => 0,
            ],
            'moderate_annual' => [
                'name' => 'Annual Moderate (2 consultations)',
                'description' => '2 consultations per year with discount',
                'price' => $basePrice * 2 * (1 - $moderateDiscount / 100),
                'consultations_allowed' => 2,
                'discount_percent' => $moderateDiscount,
                'savings' => $basePrice * 2 * ($moderateDiscount / 100),
            ],
            'high_annual' => [
                'name' => 'Annual High (4 consultations)',
                'description' => '4 consultations per year with discount',
                'price' => $basePrice * 4 * (1 - $highDiscount / 100),
                'consultations_allowed' => 4,
                'discount_percent' => $highDiscount,
                'savings' => $basePrice * 4 * ($highDiscount / 100),
            ],
        ];
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
