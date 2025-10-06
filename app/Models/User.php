<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Fortify\TwoFactorAuthenticatable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, TwoFactorAuthenticatable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'personal_info',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'personal_info' => 'array',
        ];
    }

    /**
     * Get the kit orders for the user.
     */
    public function kitOrders()
    {
        return $this->hasMany(KitOrder::class);
    }

    /**
     * Get the consultation requests for the user.
     */
    public function consultationRequests()
    {
        return $this->hasMany(ConsultationRequest::class);
    }

    /**
     * Get the subscriptions for the user.
     */
    public function subscriptions()
    {
        return $this->hasMany(Subscription::class);
    }

    /**
     * Get the active subscription with remaining kits.
     */
    public function getActiveSubscription()
    {
        return $this->subscriptions()
            ->active()
            ->withRemainingKits()
            ->orderBy('created_at', 'desc')
            ->first();
    }

    /**
     * Check if user has an active subscription.
     */
    public function hasActiveSubscription(): bool
    {
        return $this->getActiveSubscription() !== null;
    }

    /**
     * Check if user has admin role.
     */
    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }

    /**
     * Check if user has client role.
     */
    public function isClient(): bool
    {
        return $this->role === 'client';
    }

    /**
     * Get the active annual consultation subscription with remaining consultations.
     */
    public function getActiveConsultationSubscription()
    {
        // Get the most recent annual consultation subscription
        $annualSubscription = $this->consultationRequests()
            ->whereIn('subscription_tier', ['moderate_annual', 'high_annual'])
            ->whereIn('status', ['confirmed', 'completed'])
            ->orderBy('created_at', 'desc')
            ->first();

        if (!$annualSubscription) {
            return null;
        }

        // Count completed consultations for this subscription period (within 1 year)
        $subscriptionDate = $annualSubscription->created_at;
        $oneYearLater = $subscriptionDate->copy()->addYear();
        
        $completedConsultations = $this->consultationRequests()
            ->whereIn('subscription_tier', ['moderate_annual', 'high_annual'])
            ->whereIn('status', ['completed'])
            ->where('created_at', '>=', $subscriptionDate)
            ->where('created_at', '<=', $oneYearLater)
            ->count();

        // Determine allowed consultations based on tier
        $allowedConsultations = $annualSubscription->subscription_tier === 'moderate_annual' ? 2 : 4;
        
        // Check if subscription is still active and has remaining consultations
        if (now() <= $oneYearLater && $completedConsultations < $allowedConsultations) {
            return [
                'subscription' => $annualSubscription,
                'completed_consultations' => $completedConsultations,
                'allowed_consultations' => $allowedConsultations,
                'remaining_consultations' => $allowedConsultations - $completedConsultations,
                'expires_at' => $oneYearLater
            ];
        }

        return null;
    }

    /**
     * Check if user has an active annual consultation subscription with remaining consultations.
     */
    public function hasActiveConsultationSubscription(): bool
    {
        return $this->getActiveConsultationSubscription() !== null;
    }
}
