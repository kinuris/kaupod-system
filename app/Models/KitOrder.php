<?php

namespace App\Models;

use App\Enums\KitOrderStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class KitOrder extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id', 'price', 'delivery_notes', 'status', 'timeline'
    ];

    protected $casts = [
        'timeline' => 'array',
        'status' => KitOrderStatus::class,
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
