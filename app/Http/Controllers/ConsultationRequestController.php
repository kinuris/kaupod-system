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
            'schedule_preferences' => 'required|array',
            'schedule_preferences.preferred_days' => 'nullable|array',
            'schedule_preferences.time_range' => 'nullable|string|max:255',
            'notes' => 'nullable|string|max:2000',
        ]);

        ConsultationRequest::create([
            'user_id' => Auth::id(),
            'schedule_preferences' => $data['schedule_preferences'],
            'status' => ConsultationStatus::Received,
            'notes' => $data['notes'] ?? null,
        ]);

        return redirect()->route('dashboard')->with('status', 'Consultation request submitted.');
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
        $consultationRequest->update(['status' => $new]);
        return back()->with('status', 'Status updated');
    }
}
