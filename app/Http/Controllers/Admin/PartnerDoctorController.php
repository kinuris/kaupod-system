<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PartnerDoctor;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PartnerDoctorController extends Controller
{
    public function index()
    {
        $doctors = PartnerDoctor::orderBy('name')->get();
        
        return Inertia::render('Admin/partner-doctors/index', [
            'doctors' => $doctors,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'specialty' => 'required|string|max:255',
            'contact_email' => 'nullable|email|max:255',
            'contact_phone' => 'nullable|string|max:20',
            'is_active' => 'boolean',
        ]);

        $contactDetails = [];
        if ($validated['contact_email'] ?? null) {
            $contactDetails['email'] = $validated['contact_email'];
        }
        if ($validated['contact_phone'] ?? null) {
            $contactDetails['phone'] = $validated['contact_phone'];
        }

        PartnerDoctor::create([
            'name' => $validated['name'],
            'specialty' => $validated['specialty'],
            'contact_details' => $contactDetails,
            'is_active' => $validated['is_active'] ?? true,
        ]);

        return redirect()->back()->with('success', 'Partner doctor added successfully.');
    }

    public function update(Request $request, PartnerDoctor $partnerDoctor)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'specialty' => 'required|string|max:255',
            'contact_email' => 'nullable|email|max:255',
            'contact_phone' => 'nullable|string|max:20',
            'is_active' => 'boolean',
        ]);

        $contactDetails = [];
        if ($validated['contact_email'] ?? null) {
            $contactDetails['email'] = $validated['contact_email'];
        }
        if ($validated['contact_phone'] ?? null) {
            $contactDetails['phone'] = $validated['contact_phone'];
        }

        $partnerDoctor->update([
            'name' => $validated['name'],
            'specialty' => $validated['specialty'],
            'contact_details' => $contactDetails,
            'is_active' => $validated['is_active'] ?? true,
        ]);

        return redirect()->back()->with('success', 'Partner doctor updated successfully.');
    }

    public function destroy(PartnerDoctor $partnerDoctor)
    {
        // Check if doctor has any assigned consultations
        $hasAssignments = \App\Models\ConsultationRequest::where('assigned_partner_doctor_id', $partnerDoctor->id)->exists();
        
        if ($hasAssignments) {
            return redirect()->back()->with('error', 'Cannot delete partner doctor with active consultations. Deactivate instead.');
        }

        $partnerDoctor->delete();
        return redirect()->back()->with('success', 'Partner doctor deleted successfully.');
    }
}