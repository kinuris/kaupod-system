<?php

namespace App\Http\Controllers;

use App\Enums\ConsultationStatus;
use App\Models\ConsultationRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rules\Enum;

class ConsultationRequestController extends Controller
{
    public function store(Request $request)
    {
        $data = $request->validate([
            'preferred_month' => 'required|string|in:01,02,03,04,05,06,07,08,09,10,11,12',
            'preferred_day' => 'required|string|in:01,02,03,04,05,06,07,08,09,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31',
            'preferred_year' => 'required|string|in:2025,2026',
            'preferred_time' => 'required|string',
            'consultation_type' => 'required|string',
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

        // Create schedule preferences JSON
        $schedulePreferences = [
            'preferred_date' => $preferredDate,
            'preferred_time' => $data['preferred_time'],
            'consultation_type' => $data['consultation_type'],
            'consultation_mode' => $data['consultation_mode'],
        ];

        $consultationData = [
            'user_id' => Auth::id(),
            'phone' => $data['phone'],
            'preferred_date' => $preferredDate,
            'preferred_time' => $data['preferred_time'],
            'consultation_type' => $data['consultation_type'],
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
            'scheduled_datetime' => 'required|date|after:now',
        ]);

        $timeline = $consultationRequest->timeline ?? [];
        $timeline[now()->toDateTimeString()] = 'partner_doctor_assigned';

        $consultationRequest->update([
            'assigned_partner_doctor_id' => $data['partner_doctor_id'],
            'scheduled_datetime' => $data['scheduled_datetime'],
            'status' => ConsultationStatus::Confirmed,
            'timeline' => $timeline,
        ]);

        return back()->with('status', 'Partner doctor assigned and consultation confirmed.');
    }
}
