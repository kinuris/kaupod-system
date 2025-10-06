<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SettingsController extends Controller
{
    public function index()
    {
        $settings = [
            'consultation_pricing' => [
                'consultation_platform_fee' => Setting::get('consultation_platform_fee', '200.00'),
                'consultation_expert_fee' => Setting::get('consultation_expert_fee', '500.00'),
            ],
            'kit_pricing' => [
                'kit_base_price' => Setting::get('kit_base_price', '350.00'),
                'shipping_fee' => Setting::get('shipping_fee', '120.00'),
            ],
            'subscription_pricing' => [
                'annual_moderate_subscription_price' => Setting::get('annual_moderate_subscription_price', '800.00'),
                'annual_high_subscription_price' => Setting::get('annual_high_subscription_price', '1400.00'),
            ]
        ];

        return Inertia::render('Admin/Settings/Index', [
            'settings' => $settings
        ]);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'consultation_platform_fee' => 'required|numeric|min:0',
            'consultation_expert_fee' => 'required|numeric|min:0',
            'kit_base_price' => 'required|numeric|min:0',
            'shipping_fee' => 'required|numeric|min:0',
            'annual_moderate_subscription_price' => 'required|numeric|min:0',
            'annual_high_subscription_price' => 'required|numeric|min:0',
        ]);

        foreach ($validated as $key => $value) {
            Setting::set($key, number_format($value, 2, '.', ''));
        }

        return redirect()->back()->with('success', 'Settings updated successfully.');
    }
}