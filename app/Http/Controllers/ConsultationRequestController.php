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
            'preferred_date' => 'required|date|after:today',
            'preferred_time' => 'required|string',
            'consultation_type' => 'required|string',
            'phone' => 'required|string|max:20',
            'reason' => 'required|string|max:2000',
            'medical_history' => 'nullable|string|max:2000',
        ]);

        ConsultationRequest::create([
            'user_id' => Auth::id(),
            'phone' => $data['phone'],
            'preferred_date' => $data['preferred_date'],
            'preferred_time' => $data['preferred_time'],
            'consultation_type' => $data['consultation_type'],
            'reason' => $data['reason'],
            'medical_history' => $data['medical_history'] ?? null,
            'status' => ConsultationStatus::Received,
            'timeline' => [now()->toDateTimeString() => 'received'],
        ]);

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
}
