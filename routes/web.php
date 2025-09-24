<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\ChatbotController;
use App\Http\Controllers\KitOrderController;
use App\Http\Controllers\ConsultationRequestController;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::post('/chatbot/message', [ChatbotController::class, 'message'])->name('chatbot.message');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
    $user = request()->user();
        $kitOrders = $user->kitOrders()->latest()->take(5)->get(['id','status']);
        $consults = $user->consultationRequests()->latest()->take(5)->get(['id','status']);
        return Inertia::render('dashboard', [
            'kitOrders' => $kitOrders,
            'consultationRequests' => $consults,
        ]);
    })->name('dashboard');

    Route::post('/request/kit', [KitOrderController::class, 'store'])->name('kit-order.store');
    Route::post('/request/consultation', [ConsultationRequestController::class, 'store'])->name('consultation-request.store');
    Route::get('/request/kit', function() { return Inertia::render('request/kit'); })->name('kit-order.form');
    Route::get('/request/consultation', function() { return Inertia::render('request/consultation'); })->name('consultation-request.form');
});

// Admin routes
Route::middleware(['auth','verified', \App\Http\Middleware\IsAdmin::class])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/kit-orders', function() {
        $orders = \App\Models\KitOrder::latest()->paginate(20, ['id','status','price','user_id']);
        return Inertia::render('admin/kit-orders/index', [
            'orders' => $orders,
            'statuses' => array_map(fn($c)=>$c->value, \App\Enums\KitOrderStatus::cases()),
        ]);
    })->name('kit-orders.index');
    Route::patch('/kit-orders/{kitOrder}/status', [KitOrderController::class, 'updateStatus'])->name('kit-orders.update-status');

    Route::get('/consultation-requests', function() {
        $requests = \App\Models\ConsultationRequest::latest()->paginate(20, ['id','status','user_id']);
        return Inertia::render('admin/consultation-requests/index', [
            'requests' => $requests,
            'statuses' => array_map(fn($c)=>$c->value, \App\Enums\ConsultationStatus::cases()),
        ]);
    })->name('consultation-requests.index');
    Route::patch('/consultation-requests/{consultationRequest}/status', [ConsultationRequestController::class, 'updateStatus'])->name('consultation-requests.update-status');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
