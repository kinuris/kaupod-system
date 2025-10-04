<?php

namespace App\Enums;

enum SubscriptionTier: string
{
    case OneTime = 'one_time';
    case AnnualModerate = 'annual_moderate';
    case AnnualHigh = 'annual_high';

    public function getDisplayName(): string
    {
        return match($this) {
            self::OneTime => 'One-Time Purchase',
            self::AnnualModerate => 'Annual Subscription - Moderate',
            self::AnnualHigh => 'Annual Subscription - High',
        };
    }

    public function getDescription(): string
    {
        return match($this) {
            self::OneTime => 'Single kit purchase',
            self::AnnualModerate => '2 kits per year',
            self::AnnualHigh => '4 kits per year',
        };
    }

    public function getKitsAllowed(): int
    {
        return match($this) {
            self::OneTime => 1,
            self::AnnualModerate => 2,
            self::AnnualHigh => 4,
        };
    }

    public function isAnnual(): bool
    {
        return in_array($this, [self::AnnualModerate, self::AnnualHigh]);
    }
}