<?php

namespace App\Enums;

enum KitOrderStatus: string
{
    case InReview = 'in_review';
    case Shipping = 'shipping';
    case OutForDelivery = 'out_for_delivery';
    case Returning = 'returning';
    case Received = 'received';

    public function nextAllowed(): array
    {
        return match ($this) {
            self::InReview => [self::Shipping],
            self::Shipping => [self::OutForDelivery],
            self::OutForDelivery => [self::Returning],
            self::Returning => [self::Received],
            self::Received => [],
        };
    }
}
