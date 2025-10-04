<?php

namespace App\Models;

use App\Enums\SubscriptionTier;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Carbon\Carbon;

class Subscription extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id', 'tier', 'price', 'kits_allowed', 'kits_used', 
        'expires_at', 'status', 'timeline',
    ];

    protected $casts = [
        'tier' => SubscriptionTier::class,
        'timeline' => 'array',
        'expires_at' => 'date',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function kitOrders(): HasMany
    {
        return $this->hasMany(KitOrder::class);
    }

    /**
     * Check if subscription is active and not expired
     */
    public function isActive(): bool
    {
        if ($this->status !== 'active') {
            return false;
        }

        // One-time purchases don't expire
        if ($this->tier === SubscriptionTier::OneTime) {
            return $this->kits_used < $this->kits_allowed;
        }

        // Annual subscriptions expire after one year
        return $this->expires_at && $this->expires_at->isFuture();
    }

    /**
     * Check if subscription has remaining kits
     */
    public function hasRemainingKits(): bool
    {
        return $this->kits_used < $this->kits_allowed;
    }

    /**
     * Get remaining kits
     */
    public function getRemainingKits(): int
    {
        return max(0, $this->kits_allowed - $this->kits_used);
    }

    /**
     * Use a kit from the subscription
     */
    public function useKit(): bool
    {
        if (!$this->isActive() || !$this->hasRemainingKits()) {
            return false;
        }

        $this->increment('kits_used');
        
        // Add timeline entry
        $timeline = $this->timeline ?? [];
        $timeline[now()->toDateTimeString()] = "kit_used";
        $this->update(['timeline' => $timeline]);

        return true;
    }

    /**
     * Get tier display name
     */
    public function getTierDisplayName(): string
    {
        return $this->tier->getDisplayName();
    }

    /**
     * Get tier description
     */
    public function getTierDescription(): string
    {
        return $this->tier->getDescription();
    }

    /**
     * Scope for active subscriptions
     */
    public function scopeActive($query)
    {
        return $query->where('status', 'active')
                    ->where(function ($q) {
                        $q->where('tier', SubscriptionTier::OneTime)
                          ->orWhere(function ($subq) {
                              $subq->whereIn('tier', [SubscriptionTier::AnnualModerate, SubscriptionTier::AnnualHigh])
                                   ->where('expires_at', '>', now());
                          });
                    });
    }

    /**
     * Scope for subscriptions with remaining kits
     */
    public function scopeWithRemainingKits($query)
    {
        return $query->whereColumn('kits_used', '<', 'kits_allowed');
    }
}