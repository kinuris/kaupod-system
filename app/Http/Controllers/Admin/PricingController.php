<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;

class PricingController extends Controller
{
    public function index()
    {
        // Clear cache to ensure fresh data
        Cache::forget('setting_kit_base_price');
        Cache::forget('setting_shipping_fee');
        
        return Inertia::render('Admin/Pricing/Index', [
            'pricing' => [
                'kit_base_price' => Setting::get('kit_base_price', '0.00'),
                'shipping_fee' => Setting::get('shipping_fee', '0.00'),
            ]
        ]);
    }

    public function update(Request $request)
    {
        Log::info('Pricing update request received', [
            'data' => $request->all(),
            'user' => $request->user()->id ?? 'anonymous'
        ]);

        $request->validate([
            'kit_base_price' => 'required|numeric|min:0',
            'shipping_fee' => 'required|numeric|min:0',
        ]);

        Setting::set('kit_base_price', $request->kit_base_price);
        Setting::set('shipping_fee', $request->shipping_fee);

        Log::info('Pricing settings updated successfully', [
            'kit_base_price' => $request->kit_base_price,
            'shipping_fee' => $request->shipping_fee
        ]);

        return back()->with('success', 'Pricing settings updated successfully.');
    }
}