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
        'user_id', 'phone', 'price', 'delivery_notes', 'delivery_latitude', 'delivery_longitude', 
        'delivery_location_address', 'delivery_address', 'status', 'timeline'
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
