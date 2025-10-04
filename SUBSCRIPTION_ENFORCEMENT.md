# Subscription Kit Enforcement Feature

## Overview
This feature ensures that clients with active subscriptions that have remaining kits must use their subscription benefits before being allowed to purchase additional kits through one-time purchases or new subscriptions.

## Business Logic

### When Subscription is Active with Remaining Kits
- **Frontend Behavior**:
  - Purchase type is automatically set to "subscription"
  - One-time purchase option is visually disabled with overlay
  - New subscription options (Annual Moderate/High) are disabled with overlay
  - Clear messaging explains the user must use their active subscription
  - Order summary shows "Free with subscription"

- **Backend Validation**:
  - Rejects any non-subscription purchase attempts
  - Returns validation error: "You have an active subscription with remaining kits"
  - Forces users to use subscription purchase type

### When Subscription is Exhausted or Inactive
- **Frontend Behavior**:
  - All purchase options are available and enabled
  - User can choose one-time purchase or create new subscription
  - Normal pricing and selection behavior

- **Backend Validation**:
  - Accepts all valid purchase types
  - Normal validation and processing flow

## Implementation Details

### Frontend (kit.tsx)
```typescript
// Check if user has active subscription with remaining kits
const hasRemainingKits = hasActiveSubscription && activeSubscription && 
  (activeSubscription.kits_used < activeSubscription.kits_allowed);

// Force subscription purchase type when user has remaining kits
const [purchaseType, setPurchaseType] = useState<'one_time' | 'subscription'>(
    hasRemainingKits ? 'subscription' : 'one_time'
);
```

### Backend (KitOrderController.php)
```php
// Check if user has active subscription with remaining kits
$activeSubscription = $user->getActiveSubscription();
$hasRemainingKits = $activeSubscription && $activeSubscription->hasRemainingKits();

// If user has remaining subscription kits, they must use subscription purchase type
if ($hasRemainingKits && $purchaseType !== 'subscription') {
    return back()->withErrors([
        'purchase_type' => 'You have an active subscription with remaining kits. You must use your subscription before purchasing additional kits.'
    ])->withInput();
}
```

## User Experience

### Visual Indicators
1. **Active Subscription Notice**: Blue-themed notice explaining mandatory subscription usage
2. **Disabled Options**: Grayed out options with "Use Active Subscription" overlay
3. **Clear Messaging**: Explicit text explaining why other options are unavailable
4. **Usage Counter**: Shows remaining kits and expiration date

### Benefits
- **Prevents Confusion**: Users can't accidentally purchase additional kits when they have unused subscription benefits
- **Maximizes Value**: Ensures users get full value from their subscription purchases
- **Clear Communication**: Users understand exactly what they need to do
- **Consistent Experience**: Same enforcement on both frontend and backend

## Technical Notes

### User Model Methods Used
- `getActiveSubscription()`: Gets the user's current active subscription with remaining kits
- `hasActiveSubscription()`: Returns true only if user has subscription with remaining kits

### Subscription Model Methods Used
- `hasRemainingKits()`: Checks if subscription has unused kits available
- `getRemainingKits()`: Returns count of unused kits
- `useKit()`: Decrements available kit count when order is placed

### State Management
- Subscription usage is tracked at the database level
- Real-time kit count updates when orders are placed
- Automatic subscription status changes when kits are exhausted

## Testing Scenarios

1. **User with 4 remaining kits**: Must use subscription, all other options disabled
2. **User with 1 remaining kit**: Must use subscription, can't purchase additional
3. **User with 0 remaining kits**: All purchase options available
4. **User with no subscription**: All purchase options available
5. **Backend validation**: Properly rejects invalid purchase type attempts

This enforcement system ensures optimal user experience while protecting subscription value and preventing unnecessary purchases.