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
        ]);

        KitOrder::create([
            'user_id' => Auth::id(),
            'price' => $calculator->kitPrice(),
            'delivery_notes' => $data['delivery_notes'] ?? null,
            'status' => KitOrderStatus::Confirmed,
            'timeline' => [now()->toDateTimeString() => 'confirmed'],
        ]);

        return redirect()->route('dashboard')->with('status', 'Kit order requested.');
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
