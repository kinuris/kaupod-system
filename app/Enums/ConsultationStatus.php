<?php

namespace App\Enums;

enum ConsultationStatus: string
{
    case InReview = 'in_review';
    case Coordinating = 'coordinating';
    case Confirmed = 'confirmed';
    case ReminderSent = 'reminder_sent';

    public function nextAllowed(): array
    {
        return match ($this) {
            self::InReview => [self::Coordinating],
            self::Coordinating => [self::Confirmed],
            self::Confirmed => [self::ReminderSent],
            self::ReminderSent => [],
        };
    }
}
