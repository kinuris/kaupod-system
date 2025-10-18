<?php

namespace App\Http\Controllers;

use App\Enums\ConsultationStatus;
use App\Models\ConsultationRequest;
use App\Services\PriceCalculator;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rules\Enum;

class ConsultationRequestController extends Controller
{
    public function store(Request $request)
    {
        $user = $request->user();

        // Check if user has an ongoing consultation (exclude finished and canceled)
        $ongoingConsultation = ConsultationRequest::where('user_id', Auth::id())
            ->whereIn('status', ['in_review', 'coordinating', 'confirmed', 'reminder_sent'])
            ->first();

        if ($ongoingConsultation) {
            return back()->withErrors([
                'consultation' => 'You already have an ongoing consultation request. Please wait for it to be completed before requesting a new one.'
            ])->withInput();
        }

        // Check if user has an active annual consultation subscription
        $activeConsultationSubscription = $user->getActiveConsultationSubscription();
        
        // Get the subscription tier from the request
        $requestedTier = $request->input('subscription_tier');
        
        // If user has active subscription but is trying to buy a new subscription instead of using the active one
        if ($activeConsultationSubscription && $requestedTier !== $activeConsultationSubscription['subscription']['subscription_tier']) {
            $remainingConsultations = $activeConsultationSubscription['remaining_consultations'];
            $subscriptionTier = $activeConsultationSubscription['subscription']['subscription_tier'];
            $tierName = $subscriptionTier === 'moderate_annual' ? 'Moderate Annual' : 'High Annual';
            
            return back()->withErrors([
                'consultation' => "You have an active {$tierName} subscription with {$remainingConsultations} consultation(s) remaining. Please use your existing subscription before purchasing a new one. Your subscription expires on " . $activeConsultationSubscription['expires_at']->format('M d, Y') . "."
            ])->withInput();
        }
        
        // If user has active subscription and is using it, check if they have remaining consultations
        if ($activeConsultationSubscription && $requestedTier === $activeConsultationSubscription['subscription']['subscription_tier']) {
            if ($activeConsultationSubscription['remaining_consultations'] <= 0) {
                return back()->withErrors([
                    'consultation' => 'You have used all consultations in your current subscription. Please purchase a new subscription to continue.'
                ])->withInput();
            }
        }

        $data = $request->validate([
            'preferred_month' => 'required|string|in:01,02,03,04,05,06,07,08,09,10,11,12',
            'preferred_day' => 'required|string|in:01,02,03,04,05,06,07,08,09,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31',
            'preferred_year' => 'required|string|in:2025,2026',
            'preferred_time' => 'required|string',
            'consultation_type' => 'required|string',
            'subscription_tier' => 'required|string|in:one_time,moderate_annual,high_annual',
            'consultation_mode' => 'required|in:online,in-person',
            'consultation_latitude' => 'nullable|numeric|required_if:consultation_mode,in-person',
            'consultation_longitude' => 'nullable|numeric|required_if:consultation_mode,in-person',
            'consultation_location_address' => 'nullable|string|required_if:consultation_mode,in-person',
            'phone' => 'required|string|max:20',
            'reason' => 'required|string|max:2000',
            'medical_history' => 'nullable|string|max:2000',
        ]);

        // Combine the separate date fields into a single date
        $preferredDate = $data['preferred_year'] . '-' . $data['preferred_month'] . '-' . $data['preferred_day'];
        
        // Validate the combined date is valid and after today
        $dateObj = \DateTime::createFromFormat('Y-m-d', $preferredDate);
        if (!$dateObj || $dateObj->format('Y-m-d') !== $preferredDate) {
            return back()->withErrors(['preferred_day' => 'Invalid date selected.']);
        }
        
        if ($dateObj <= new \DateTime('today')) {
            return back()->withErrors(['preferred_day' => 'Preferred date must be after today.']);
        }

        // Calculate tier price
        $priceCalculator = new PriceCalculator();
        $tierPrice = $priceCalculator->consultationTierPrice($data['subscription_tier']);

        // Create schedule preferences JSON
        $schedulePreferences = [
            'preferred_date' => $preferredDate,
            'preferred_time' => $data['preferred_time'],
            'consultation_type' => $data['consultation_type'],
            'consultation_mode' => $data['consultation_mode'],
            'subscription_tier' => $data['subscription_tier'],
            'tier_price' => $tierPrice,
        ];

        $consultationData = [
            'user_id' => Auth::id(),
            'phone' => $data['phone'],
            'preferred_date' => $preferredDate,
            'preferred_time' => $data['preferred_time'],
            'consultation_type' => $data['consultation_type'],
            'subscription_tier' => $data['subscription_tier'],
            'tier_price' => $tierPrice,
            'consultation_mode' => $data['consultation_mode'],
            'reason' => $data['reason'],
            'medical_history' => $data['medical_history'] ?? null,
            'schedule_preferences' => $schedulePreferences,
            'status' => ConsultationStatus::InReview,
            'timeline' => [now()->toDateTimeString() => 'in_review'],
        ];

        // Add location data if in-person consultation
        if ($data['consultation_mode'] === 'in-person') {
            $consultationData['consultation_latitude'] = $data['consultation_latitude'];
            $consultationData['consultation_longitude'] = $data['consultation_longitude'];
            $consultationData['consultation_location_address'] = $data['consultation_location_address'];
        }

        ConsultationRequest::create($consultationData);

        // For clients, redirect to home instead of dashboard
        $redirectRoute = $request->user()->isClient() ? 'home' : 'dashboard';
        return redirect()->route($redirectRoute)->with('status', 'Consultation request submitted successfully! We will contact you soon to confirm your appointment.');
    }

    public function updateStatus(Request $request, ConsultationRequest $consultationRequest)
    {
        abort_unless($request->user()?->isAdmin(), 403);

        $data = $request->validate([
            'status' => ['required', new Enum(ConsultationStatus::class)],
        ]);

        $current = $consultationRequest->status; /** @var ConsultationStatus $current */
        $new = ConsultationStatus::from($data['status']);
        if (! in_array($new, $current->nextAllowed(), true)) {
            return back()->withErrors(['status' => 'Invalid status transition']);
        }
        
        $timeline = $consultationRequest->timeline ?? [];
        $timeline[now()->toDateTimeString()] = $new->value;
        
        $consultationRequest->update([
            'status' => $new,
            'timeline' => $timeline,
        ]);
        
        return back()->with('status', 'Status updated');
    }

    public function reschedule(Request $request, ConsultationRequest $consultationRequest)
    {
        // Ensure the user owns this consultation or is admin
        abort_unless(
            $consultationRequest->user_id === Auth::id() || $request->user()?->isAdmin(), 
            403
        );

        $data = $request->validate([
            'new_preferred_date' => 'required|date|after:4 hours',
            'new_preferred_time' => 'required|string',
            'rescheduling_reason' => 'required|string|max:500',
        ]);

        // Check if it's at least 4 hours in advance
        $newDateTime = $data['new_preferred_date'] . ' ' . $data['new_preferred_time'];
        $newDateTimeObj = new \DateTime($newDateTime);
        $now = new \DateTime();
        $interval = $now->diff($newDateTimeObj);
        
        if ($interval->h < 4 && $interval->days == 0) {
            return back()->withErrors(['new_preferred_date' => 'Rescheduling must be done at least 4 hours in advance.']);
        }

        $timeline = $consultationRequest->timeline ?? [];
        $timeline[now()->toDateTimeString()] = 'rescheduled';

        $consultationRequest->update([
            'preferred_date' => $data['new_preferred_date'],
            'preferred_time' => $data['new_preferred_time'],
            'rescheduling_reason' => $data['rescheduling_reason'],
            'last_rescheduled_at' => now(),
            'status' => ConsultationStatus::InReview, // Reset to in_review for re-coordination
            'timeline' => $timeline,
        ]);

        return back()->with('status', 'Consultation rescheduled successfully. We will contact you to confirm the new appointment.');
    }

    public function assignPartnerDoctor(Request $request, ConsultationRequest $consultationRequest)
    {
        abort_unless($request->user()?->isAdmin(), 403);

        $data = $request->validate([
            'partner_doctor_id' => 'required|exists:partner_doctors,id',
            'scheduled_datetime' => 'nullable|date|after:now',
        ]);

        $timeline = $consultationRequest->timeline ?? [];
        $timeline[now()->toDateTimeString()] = 'partner_doctor_assigned';

        $updateData = [
            'assigned_partner_doctor_id' => $data['partner_doctor_id'],
            'status' => ConsultationStatus::Confirmed,
            'timeline' => $timeline,
        ];

        // Only update scheduled_datetime if provided
        if (isset($data['scheduled_datetime'])) {
            $updateData['scheduled_datetime'] = $data['scheduled_datetime'];
        }

        $consultationRequest->update($updateData);

        // Generate meeting link for online consultations when confirmed
        if ($consultationRequest->consultation_mode === 'online') {
            $consultationRequest->generateMeetingLink();
        }

        return back()->with('status', 'Partner doctor assigned and consultation confirmed.');
    }
}
