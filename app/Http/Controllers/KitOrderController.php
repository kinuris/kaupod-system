<?php

namespace App\Http\Controllers;

use App\Enums\KitOrderStatus;
use App\Models\KitOrder;
use App\Services\PriceCalculator;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rules\Enum;

class KitOrderController extends Controller
{
    public function store(Request $request, PriceCalculator $calculator)
    {
        $data = $request->validate([
            'delivery_notes' => 'nullable|string|max:2000',
            'delivery_latitude' => 'nullable|numeric|between:-90,90',
            'delivery_longitude' => 'nullable|numeric|between:-180,180',
            'delivery_location_address' => 'nullable|string|max:1000',
            'delivery_address' => 'nullable|string|max:2000',
            'phone' => 'required|string|max:20',
            'special_instructions' => 'nullable|string|max:1000',
        ]);

        KitOrder::create([
            'user_id' => Auth::id(),
            'phone' => $data['phone'],
            'price' => $calculator->kitPrice(),
            'delivery_notes' => $data['special_instructions'] ?? null,
            'delivery_latitude' => $data['delivery_latitude'] ?? null,
            'delivery_longitude' => $data['delivery_longitude'] ?? null,
            'delivery_location_address' => $data['delivery_location_address'] ?? null,
            'delivery_address' => $data['delivery_address'] ?? null,
            'status' => KitOrderStatus::InReview,
            'timeline' => [now()->toDateTimeString() => 'in_review'],
        ]);

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
        if (! in_array($new, $current->nextAllowed(), true)) {
            return back()->withErrors(['status' => 'Invalid status transition']);
        }
        $timeline = $kitOrder->timeline ?? [];
        $timeline[now()->toDateTimeString()] = $new->value;
        $kitOrder->update([
            'status' => $new,
            'timeline' => $timeline,
        ]);

        return back()->with('status', 'Status updated');
    }
}
