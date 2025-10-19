<?php

namespace App\Http\Controllers;

use App\Enums\KitOrderStatus;
use App\Enums\SubscriptionTier;
use App\Models\KitOrder;
use App\Models\Subscription;
use App\Services\PriceCalculator;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rules\Enum;

class KitOrderController extends Controller
{
    public function store(Request $request, PriceCalculator $calculator)
    {
        $data = $request->validate([
            'kit_type' => 'required|in:hiv,gonorrhea,syphilis,chlamydia',
            'delivery_notes' => 'nullable|string|max:2000',
            'delivery_latitude' => 'nullable|numeric|between:-90,90',
            'delivery_longitude' => 'nullable|numeric|between:-180,180',
            'delivery_location_address' => 'nullable|string|max:1000',
            'delivery_address' => 'nullable|string|max:2000',
            'phone' => 'required|string|max:20',
            'special_instructions' => 'nullable|string|max:1000',
            'purchase_type' => 'required|in:one_time,subscription',
            'subscription_tier' => 'nullable|in:one_time,annual_moderate,annual_high',
        ]);

        $user = Auth::user();
        $purchaseType = $data['purchase_type'];
        
        // Check if user has an ongoing kit order
        $ongoingKitOrder = $user->kitOrders()
            ->whereNotIn('status', ['cancelled', 'sent_result'])
            ->first();

        if ($ongoingKitOrder) {
            return back()->withErrors([
                'kit_order' => 'You already have an ongoing kit order. Please wait for it to be completed before ordering a new kit.'
            ])->withInput();
        }

        // Check if user has active subscription with remaining kits
        $activeSubscription = $user->getActiveSubscription();
        $hasRemainingKits = $activeSubscription && $activeSubscription->hasRemainingKits();
        
        // If user has remaining subscription kits, they must use subscription purchase type
        if ($hasRemainingKits && $purchaseType !== 'subscription') {
            return back()->withErrors([
                'purchase_type' => 'You have an active subscription with remaining kits. You must use your subscription before purchasing additional kits.'
            ])->withInput();
        }
        
        // If user doesn't have remaining kits but tries to use subscription purchase type
        if (!$hasRemainingKits && $purchaseType === 'subscription' && empty($data['subscription_tier'])) {
            return back()->withErrors([
                'subscription_tier' => 'You must select a subscription tier to create a new subscription.'
            ])->withInput();
        }
        $subscriptionId = null;
        $price = $calculator->kitPrice(); // Default one-time price
        
        DB::transaction(function () use ($user, $data, $calculator, $purchaseType, &$subscriptionId, &$price) {
            if ($purchaseType === 'subscription') {
                // Handle subscription purchase
                $activeSubscription = $user->getActiveSubscription();
                
                if ($activeSubscription && $activeSubscription->hasRemainingKits()) {
                    // Use existing subscription
                    $subscriptionId = $activeSubscription->id;
                    $price = 0; // No additional charge for subscription users
                    $activeSubscription->useKit();
                } else {
                    // Create new subscription if tier is provided
                    if (!empty($data['subscription_tier'])) {
                        $tier = SubscriptionTier::from($data['subscription_tier']);
                        $subscriptionPrice = $calculator->subscriptionPrice($tier);
                        $expiresAt = $tier->isAnnual() ? now()->addYear() : null;
                        
                        $subscription = Subscription::create([
                            'user_id' => $user->id,
                            'tier' => $tier,
                            'price' => $subscriptionPrice,
                            'kits_allowed' => $tier->getKitsAllowed(),
                            'kits_used' => 1, // First kit
                            'expires_at' => $expiresAt,
                            'status' => 'active',
                            'timeline' => [now()->toDateTimeString() => 'subscription_created'],
                        ]);
                        
                        $subscriptionId = $subscription->id;
                        $price = $subscriptionPrice;
                    } else {
                        return back()->withErrors([
                            'subscription_tier' => 'Please select a subscription tier.'
                        ])->withInput();
                    }
                }
            }
            
            KitOrder::create([
                'user_id' => $user->id,
                'kit_type' => $data['kit_type'],
                'subscription_id' => $subscriptionId,
                'purchase_type' => $purchaseType,
                'phone' => $data['phone'],
                'price' => $price,
                'delivery_notes' => $data['special_instructions'] ?? null,
                'delivery_latitude' => $data['delivery_latitude'] ?? null,
                'delivery_longitude' => $data['delivery_longitude'] ?? null,
                'delivery_location_address' => $data['delivery_location_address'] ?? null,
                'delivery_address' => $data['delivery_address'] ?? null,
                'status' => KitOrderStatus::InReview,
                'timeline' => [now()->toDateTimeString() => 'in_review'],
            ]);
        });

        // For clients, redirect to home instead of dashboard
        $redirectRoute = $request->user()->isClient() ? 'home' : 'dashboard';
        return redirect()->route($redirectRoute)->with('status', 'Privacy kit order submitted successfully! You will receive delivery updates via SMS.');
    }

    public function updateStatus(Request $request, KitOrder $kitOrder)
    {
        // Only admins allowed; route will have admin middleware but double check
        abort_unless($request->user()?->isAdmin(), 403);

        $data = $request->validate([
            'status' => [ 'required', new Enum(KitOrderStatus::class) ],
        ]);

        $current = $kitOrder->status; /** @var KitOrderStatus $current */
        $new = KitOrderStatus::from($data['status']);
        
        // Check if this is an admin making the change
        $user = $request->user();
        $allowedTransitions = $user && $user->isAdmin() 
            ? $current->adminNextAllowed()
            : $current->clientNextAllowed();
            
        if (! in_array($new, $allowedTransitions, true)) {
            $errorMessage = $user && $user->isAdmin() 
                ? 'Invalid admin status transition'
                : 'Invalid client status transition';
            return back()->withErrors(['status' => $errorMessage]);
        }
        $timeline = $kitOrder->timeline ?? [];
        $timeline[now()->toDateTimeString()] = $new->value;
        $kitOrder->update([
            'status' => $new,
            'timeline' => $timeline,
        ]);

        return back()->with('status', 'Status updated');
    }

    public function clientUpdateStatus(Request $request, KitOrder $kitOrder)
    {
        // Only the owner can update status via client actions
        if ($request->user()->id !== $kitOrder->user_id) {
            abort(403, 'Unauthorized');
        }

        $data = $request->validate([
            'status' => [ 'required', new Enum(KitOrderStatus::class) ],
            'return_location_address' => 'nullable|string|max:255',
            'return_latitude' => 'nullable|numeric|between:-90,90',
            'return_longitude' => 'nullable|numeric|between:-180,180',
            'return_address' => 'nullable|string|max:500',
            'return_date' => 'nullable|date|after:now',
            'return_notes' => 'nullable|string|max:1000',
        ]);

        $current = $kitOrder->status; /** @var KitOrderStatus $current */
        $new = KitOrderStatus::from($data['status']);
        
        // Use client-specific allowed transitions
        if (! in_array($new, $current->clientNextAllowed(), true)) {
            return back()->withErrors(['status' => 'Invalid status transition']);
        }
        
        // Prepare update data
        $updateData = [
            'status' => $new,
        ];

        // If transitioning to returning status, require return details
        if ($new === KitOrderStatus::Returning) {
            if (!$data['return_location_address'] || !$data['return_date']) {
                return back()->withErrors([
                    'return_location_address' => 'Return location is required',
                    'return_date' => 'Return date is required'
                ]);
            }
            
            $updateData = array_merge($updateData, [
                'return_location_address' => $data['return_location_address'],
                'return_latitude' => $data['return_latitude'],
                'return_longitude' => $data['return_longitude'],
                'return_address' => $data['return_address'],
                'return_date' => $data['return_date'],
                'return_notes' => $data['return_notes'],
            ]);
        }
        
        $timeline = $kitOrder->timeline ?? [];
        $timeline[now()->toDateTimeString()] = $new->value;
        $updateData['timeline'] = $timeline;
        
        $kitOrder->update($updateData);

        return back()->with('status', 'Return details saved and status updated');
    }

    public function cancel(Request $request, KitOrder $kitOrder)
    {
        // Only the owner or admin can cancel
        abort_unless(
            $request->user()?->id === $kitOrder->user_id || $request->user()?->isAdmin(), 
            403
        );

        // Can only cancel if status is InReview
        if ($kitOrder->status !== KitOrderStatus::InReview) {
            return back()->withErrors(['cancel' => 'Kit order can only be cancelled when it is still in review.']);
        }

        $timeline = $kitOrder->timeline ?? [];
        $timeline[now()->toDateTimeString()] = 'cancelled';
        
        $kitOrder->update([
            'status' => KitOrderStatus::Cancelled,
            'timeline' => $timeline,
        ]);

        $redirectRoute = $request->user()->isClient() ? 'home' : 'dashboard';
        return redirect()->route($redirectRoute)->with('status', 'Kit order has been cancelled successfully.');
    }

    public function markEmailSent(Request $request, KitOrder $kitOrder)
    {
        // Only admins allowed
        abort_unless($request->user()?->isAdmin(), 403);

        $data = $request->validate([
            'result_email_notes' => 'nullable|string|max:1000',
        ]);

        $kitOrder->update([
            'result_email_sent' => true,
            'result_email_sent_at' => now(),
            'result_email_notes' => $data['result_email_notes'] ?? null,
        ]);

        return back()->with('status', 'Email marked as sent successfully.');
    }

    public function unmarkEmailSent(Request $request, KitOrder $kitOrder)
    {
        // Only admins allowed
        abort_unless($request->user()?->isAdmin(), 403);

        $kitOrder->update([
            'result_email_sent' => false,
            'result_email_sent_at' => null,
            'result_email_notes' => null,
        ]);

        return back()->with('status', 'Email status reset successfully.');
    }
}
