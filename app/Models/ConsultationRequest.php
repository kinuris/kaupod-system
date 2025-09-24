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
        'user_id', 'schedule_preferences', 'status', 'confirmed_datetime', 'notes'
    ];

    protected $casts = [
        'schedule_preferences' => 'array',
        'confirmed_datetime' => 'datetime',
        'status' => ConsultationStatus::class,
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
