<?php

namespace App\Models;

use App\Enums\ConsultationStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ConsultationRequest extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id', 'phone', 'preferred_date', 'preferred_time', 'consultation_type', 'subscription_tier', 'tier_price',
        'consultation_mode', 'consultation_latitude', 'consultation_longitude', 'consultation_location_address',
        'reason', 'medical_history', 'schedule_preferences', 'status', 'confirmed_datetime', 'scheduled_datetime',
        'assigned_partner_doctor_id', 'rescheduling_reason', 'last_rescheduled_at', 'notes', 'timeline'
    ];

    protected $casts = [
        'schedule_preferences' => 'array',
        'timeline' => 'array',
        'confirmed_datetime' => 'datetime',
        'scheduled_datetime' => 'datetime',
        'last_rescheduled_at' => 'datetime',
        'preferred_date' => 'date',
        'status' => ConsultationStatus::class,
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function assignedPartnerDoctor(): BelongsTo
    {
        return $this->belongsTo(PartnerDoctor::class, 'assigned_partner_doctor_id');
    }
}
