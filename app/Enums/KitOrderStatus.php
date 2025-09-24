<?php

namespace App\Enums;

enum KitOrderStatus: string
{
    case Confirmed = 'confirmed';
    case Procured = 'procured';
    case Dispatched = 'dispatched';
    case OutForDelivery = 'out_for_delivery';
    case Delivered = 'delivered';
    case ReadyForPickup = 'ready_for_pickup';
    case PickupScheduled = 'pickup_scheduled';
    case Collected = 'collected';
    case ReturnedForProcessing = 'returned_for_processing';

    public function nextAllowed(): array
    {
        return match ($this) {
            self::Confirmed => [self::Procured],
            self::Procured => [self::Dispatched],
            self::Dispatched => [self::OutForDelivery],
            self::OutForDelivery => [self::Delivered],
            self::Delivered => [self::ReadyForPickup],
            self::ReadyForPickup => [self::PickupScheduled],
            self::PickupScheduled => [self::Collected],
            self::Collected => [self::ReturnedForProcessing],
            self::ReturnedForProcessing => [],
        };
    }
}
