<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PricingController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Pricing/Index', [
            'pricing' => [
                'kit_base_price' => Setting::get('kit_base_price', '0.00'),
                'shipping_fee' => Setting::get('shipping_fee', '0.00'),
            ]
        ]);
    }

    public function update(Request $request)
    {
        $request->validate([
            'kit_base_price' => 'required|numeric|min:0',
            'shipping_fee' => 'required|numeric|min:0',
        ]);

        Setting::set('kit_base_price', $request->kit_base_price);
        Setting::set('shipping_fee', $request->shipping_fee);

        return back()->with('success', 'Pricing settings updated successfully.');
    }
}