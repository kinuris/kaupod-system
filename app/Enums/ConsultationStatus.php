<?php

namespace App\Enums;

enum ConsultationStatus: string
{
    case InReview = 'in_review';
    case Coordinating = 'coordinating';
    case Confirmed = 'confirmed';
    case ReminderSent = 'reminder_sent';
    case Finished = 'finished';
    case Canceled = 'canceled';

    public function nextAllowed(): array
    {
        return match ($this) {
            self::InReview => [self::Coordinating, self::Canceled],
            self::Coordinating => [self::Confirmed, self::Canceled],
            self::Confirmed => [self::ReminderSent, self::Canceled],
            self::ReminderSent => [self::Finished, self::Canceled],
            self::Finished => [],
            self::Canceled => [],
        };
    }
}
