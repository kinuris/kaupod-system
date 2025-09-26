<?php

namespace App\Enums;

enum KitOrderStatus: string
{
    case InReview = 'in_review';
    case Shipping = 'shipping';
    case OutForDelivery = 'out_for_delivery';
    case Accepted = 'accepted';
    case Returning = 'returning';
    case Received = 'received';
    case Cancelled = 'cancelled';

    public function nextAllowed(): array
    {
        return match ($this) {
            self::InReview => [self::Shipping, self::Cancelled],
            self::Shipping => [self::OutForDelivery],
            self::OutForDelivery => [self::Accepted],
            self::Accepted => [self::Returning],
            self::Returning => [self::Received],
            self::Received => [],
            self::Cancelled => [],
        };
    }

    public function adminNextAllowed(): array
    {
        return match ($this) {
            self::InReview => [self::Shipping, self::Cancelled],
            self::Shipping => [self::OutForDelivery],
            self::OutForDelivery => [self::Accepted],
            self::Accepted => [], // Admin cannot move from Accepted - client must initiate return
            self::Returning => [self::Received],
            self::Received => [],
            self::Cancelled => [],
        };
    }

    public function clientNextAllowed(): array
    {
        return match ($this) {
            self::InReview => [self::Cancelled], // Client can only cancel orders in review
            self::Accepted => [self::Returning], // Client initiates return process
            default => [], // Client cannot change other statuses
        };
    }
}
