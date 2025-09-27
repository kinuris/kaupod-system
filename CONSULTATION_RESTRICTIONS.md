# Consultation Restriction System

## Overview
The consultation restriction system prevents users from creating new consultation requests while they have an ongoing consultation in any of the following statuses:
- In Review
- Coordinating 
- Confirmed

## Implementation Details

### Backend Validation
**File:** `app/Http/Controllers/ConsultationRequestController.php`

The `store()` method now includes validation to check for ongoing consultations:

```php
// Check if user already has an ongoing consultation
$ongoingConsultation = ConsultationRequest::where('user_id', auth()->id())
    ->whereIn('status', ['in_review', 'coordinating', 'confirmed'])
    ->first();

if ($ongoingConsultation) {
    return back()->withErrors([
        'consultation' => 'You already have an ongoing consultation. Please complete or cancel your current consultation before requesting a new one.'
    ]);
}
```

### Route Enhancement
**File:** `routes/web.php`

The consultation form route now passes ongoing consultation information:

```php
Route::get('/request/consultation', function () {
    $hasOngoingConsultation = false;
    $ongoingConsultation = null;
    
    if (auth()->check()) {
        $ongoingConsultation = ConsultationRequest::where('user_id', auth()->id())
            ->whereIn('status', ['in_review', 'coordinating', 'confirmed'])
            ->first();
        $hasOngoingConsultation = $ongoingConsultation !== null;
    }
    
    return Inertia::render('request/consultation', [
        'hasOngoingConsultation' => $hasOngoingConsultation,
        'ongoingConsultation' => $ongoingConsultation,
    ]);
})->name('consultation.form');
```

### Frontend Integration
**File:** `resources/js/Pages/request/consultation.tsx`

#### Props Interface
```typescript
interface OngoingConsultation {
    id: number;
    consultation_mode: string;
    status: string;
    created_at: string;
}

interface ConsultationRequestProps {
    hasOngoingConsultation: boolean;
    ongoingConsultation?: OngoingConsultation;
}
```

#### Warning Message
When a user has an ongoing consultation, a warning message is displayed:

```tsx
{hasOngoingConsultation && ongoingConsultation && (
    <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
        <div className="flex items-start space-x-3">
            <CircleAlert className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
                <h3 className="text-sm font-medium text-amber-800 mb-1">
                    You have an ongoing consultation
                </h3>
                <p className="text-sm text-amber-700 mb-3">
                    You already have a consultation request in progress. Please complete or manage your current consultation before requesting a new one.
                </p>
                <div className="bg-white p-3 rounded border border-amber-200 mb-3">
                    <div className="text-xs text-amber-600 space-y-1">
                        <div><span className="font-medium">Mode:</span> {ongoingConsultation.consultation_mode}</div>
                        <div><span className="font-medium">Status:</span> {ongoingConsultation.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</div>
                        <div><span className="font-medium">Requested:</span> {new Date(ongoingConsultation.created_at).toLocaleDateString()}</div>
                    </div>
                </div>
                <Link
                    href="/consultation-tracker"
                    className="inline-flex items-center text-sm font-medium text-amber-700 hover:text-amber-800"
                >
                    View your consultation in Plus Tracker →
                </Link>
            </div>
        </div>
    </div>
)}
```

#### Form Restrictions
- **Visual State**: Form fields are styled with reduced opacity when restricted
- **Submit Button**: Disabled when `hasOngoingConsultation` is true
- **Form Submission**: `handleFormSubmit` prevents submission when there's an ongoing consultation

## User Experience Flow

1. **User visits consultation form**: System checks for ongoing consultations
2. **If ongoing consultation exists**:
   - Warning message displayed with consultation details
   - Form fields visually disabled (reduced opacity)
   - Submit button disabled
   - Plus Tracker link provided for managing existing consultation
3. **If no ongoing consultation**: Form functions normally
4. **Backend validation**: Additional server-side check prevents submission even if frontend is bypassed

## Status Definitions

### Ongoing Statuses (Prevent new consultations)
- **In Review**: Consultation request submitted and being reviewed
- **Coordinating**: Appointment being scheduled with partner doctor
- **Confirmed**: Appointment confirmed and scheduled

### Final Statuses (Allow new consultations)
- **Cancelled**: Consultation was cancelled
- **Reminder Sent**: Final status after consultation completion

## Testing

1. **Create a consultation request** and verify it's stored with "in_review" status
2. **Try to create another consultation** while the first is ongoing
3. **Verify warning message appears** and form is disabled
4. **Complete or cancel existing consultation** and verify new consultations are allowed
5. **Test backend validation** by attempting direct form submission

## Integration Points

- **Plus Tracker**: Users can view and manage ongoing consultations
- **Admin Interface**: Staff can update consultation statuses
- **Partner Doctor Assignment**: Required before moving from "Confirmed" status