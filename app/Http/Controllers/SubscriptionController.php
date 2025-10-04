<?php

namespace App\Http\Controllers;

use App\Enums\SubscriptionTier;
use App\Models\Subscription;
use App\Services\PriceCalculator;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class SubscriptionController extends Controller
{

    public function index()
    {
        $user = Auth::user();
        $subscriptions = $user->subscriptions()
            ->with('kitOrders')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($subscription) {
                return [
                    'id' => $subscription->id,
                    'tier' => $subscription->tier->value, // Convert enum to string
                    'price' => $subscription->price,
                    'kits_allowed' => $subscription->kits_allowed,
                    'kits_used' => $subscription->kits_used,
                    'expires_at' => $subscription->expires_at?->toISOString(),
                    'status' => $subscription->status,
                    'created_at' => $subscription->created_at->toISOString(),
                    'kit_orders' => $subscription->kitOrders->map(function ($order) {
                        return [
                            'id' => $order->id,
                            'status' => $order->status->value,
                            'created_at' => $order->created_at->toISOString(),
                            'price' => $order->price,
                        ];
                    }),
                ];
            });
        
        $activeSubscription = $user->getActiveSubscription();
        if ($activeSubscription) {
            $activeSubscription = [
                'id' => $activeSubscription->id,
                'tier' => $activeSubscription->tier->value,
                'kits_allowed' => $activeSubscription->kits_allowed,
                'kits_used' => $activeSubscription->kits_used,
                'expires_at' => $activeSubscription->expires_at?->toISOString(),
                'status' => $activeSubscription->status,
            ];
        }
        
        $priceCalculator = new PriceCalculator();
        $subscriptionOptions = $priceCalculator->getSubscriptionOptions();

        return Inertia::render('subscriptions/index', [
            'subscriptions' => $subscriptions,
            'activeSubscription' => $activeSubscription,
            'subscriptionOptions' => $subscriptionOptions,
        ]);
    }

    public function create()
    {
        $user = Auth::user();
        $activeSubscription = $user->getActiveSubscription();
        
        // Check if user already has an active subscription
        if ($activeSubscription) {
            return redirect()->route('subscriptions.index')
                ->with('warning', 'You already have an active subscription.');
        }

        $priceCalculator = new PriceCalculator();
        $subscriptionOptions = $priceCalculator->getSubscriptionOptions();

        return Inertia::render('subscriptions/create', [
            'subscriptionOptions' => $subscriptionOptions,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'tier' => 'required|in:one_time,annual_moderate,annual_high',
        ]);

        $user = Auth::user();
        
        // Check if user already has an active subscription
        if ($user->hasActiveSubscription()) {
            return back()->withErrors([
                'subscription' => 'You already have an active subscription.'
            ]);
        }

        $tier = SubscriptionTier::from($request->tier);
        $priceCalculator = new PriceCalculator();
        $price = $priceCalculator->subscriptionPrice($tier);

        DB::transaction(function () use ($user, $tier, $price) {
            $expiresAt = $tier->isAnnual() ? now()->addYear() : null;
            
            Subscription::create([
                'user_id' => $user->id,
                'tier' => $tier,
                'price' => $price,
                'kits_allowed' => $tier->getKitsAllowed(),
                'kits_used' => 0,
                'expires_at' => $expiresAt,
                'status' => 'active',
                'timeline' => [now()->toDateTimeString() => 'subscription_created'],
            ]);
        });

        return redirect()->route('subscriptions.index')
            ->with('success', 'Subscription created successfully!');
    }

    public function show(Subscription $subscription)
    {
        // Basic ownership check
        if ($subscription->user_id !== Auth::id()) {
            abort(403, 'Unauthorized access to subscription.');
        }
        
        return Inertia::render('subscriptions/show', [
            'subscription' => $subscription->load('kitOrders'),
        ]);
    }

    public function cancel(Subscription $subscription)
    {
        // Basic ownership check
        if ($subscription->user_id !== Auth::id()) {
            abort(403, 'Unauthorized access to subscription.');
        }
        
        if ($subscription->status === 'cancelled') {
            return back()->withErrors([
                'subscription' => 'Subscription is already cancelled.'
            ]);
        }

        $subscription->update([
            'status' => 'cancelled',
            'timeline' => array_merge(
                $subscription->timeline ?? [], 
                [now()->toDateTimeString() => 'subscription_cancelled']
            ),
        ]);

        return back()->with('success', 'Subscription cancelled successfully.');
    }
}