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
    // Dashboard - only for admin users
    Route::get('dashboard', function () {
        $user = request()->user();
        
        // Admins see all recent orders, regular users see their own
        if ($user->isAdmin()) {
            $kitOrders = \App\Models\KitOrder::latest()->take(5)->get(['id','status','user_id','created_at']);
            $consults = \App\Models\ConsultationRequest::latest()->take(5)->get(['id','status','user_id','created_at']);
        } else {
            $kitOrders = $user->kitOrders()->latest()->take(5)->get(['id','status']);
            $consults = $user->consultationRequests()->latest()->take(5)->get(['id','status']);
        }
        
        return Inertia::render('dashboard', [
            'kitOrders' => $kitOrders,
            'consultationRequests' => $consults,
        ]);
    })->name('dashboard')->middleware(\App\Http\Middleware\RestrictClientAccess::class);

    // Service request routes - available to all authenticated users
    Route::post('/request/kit', [KitOrderController::class, 'store'])->name('kit-order.store');
    Route::delete('/kit-orders/{kitOrder}/cancel', [KitOrderController::class, 'cancel'])->name('kit-order.cancel');
    Route::post('/request/consultation', [ConsultationRequestController::class, 'store'])->name('consultation-request.store');
    Route::post('/consultations/{consultationRequest}/reschedule', [ConsultationRequestController::class, 'reschedule'])->name('consultation-request.reschedule');
    Route::get('/request/kit', function() { return Inertia::render('request/kit'); })->name('kit-order.form');
    Route::get('/request/consultation', function() { return Inertia::render('request/consultation'); })->name('consultation-request.form');
    
    // Plus Tracker - Enhanced consultation tracking
    Route::get('/plus-tracker', function() {
        $user = request()->user();
        $consultations = $user->consultationRequests()
            ->with('assignedPartnerDoctor')
            ->latest()->get([
                'id', 'status', 'phone', 'preferred_date', 'preferred_time', 'consultation_type', 
                'consultation_mode', 'consultation_latitude', 'consultation_longitude', 
                'consultation_location_address', 'reason', 'medical_history', 'scheduled_datetime',
                'assigned_partner_doctor_id', 'rescheduling_reason', 'last_rescheduled_at', 
                'timeline', 'created_at'
            ]);
        
        return Inertia::render('consultation-tracker', [
            'consultationRequests' => $consultations,
        ]);
    })->name('consultation-tracker');
    
    // My Orders page - for clients to check status
    Route::get('/my-orders', function() {
        $user = request()->user();
        $showCancelled = request()->boolean('show_cancelled', false);
        
        $kitOrdersQuery = $user->kitOrders()->latest();
        if (!$showCancelled) {
            $kitOrdersQuery->where('status', '!=', 'cancelled');
        }
        $kitOrders = $kitOrdersQuery->get(['id', 'status', 'phone', 'delivery_location_address', 'delivery_address', 'delivery_latitude', 'delivery_longitude', 'return_location_address', 'return_address', 'return_latitude', 'return_longitude', 'return_date', 'return_notes', 'created_at', 'timeline']);
        
        $consultations = $user->consultationRequests()->latest()->get(['id', 'status', 'phone', 'preferred_date', 'preferred_time', 'consultation_type', 'created_at', 'timeline']);
        
        return Inertia::render('my-orders', [
            'kitOrders' => $kitOrders,
            'consultationRequests' => $consultations,
            'filters' => [
                'show_cancelled' => $showCancelled,
            ],
        ]);
    })->name('my-orders');
    
    // Client can update their own kit order status (e.g., mark as returning)
    Route::patch('/kit-orders/{kitOrder}/client-status', [KitOrderController::class, 'clientUpdateStatus'])->name('kit-orders.client-update-status');
});

// Admin routes
Route::middleware(['auth','verified', \App\Http\Middleware\IsAdmin::class])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/kit-orders', function() {
        $query = \App\Models\KitOrder::with('user:id,name,email');
        
        // Filter by status
        if (request('status') && request('status') !== 'all') {
            $query->where('status', request('status'));
        }
        
        // Filter by date range
        if (request('date_from')) {
            $query->whereDate('created_at', '>=', request('date_from'));
        }
        if (request('date_to')) {
            $query->whereDate('created_at', '<=', request('date_to'));
        }
        
        // Search by customer name or email
        if (request('search')) {
            $search = request('search');
            $query->whereHas('user', function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            })->orWhere('phone', 'like', "%{$search}%");
        }
        
        // Sort
        $sortField = request('sort', 'created_at');
        $sortDirection = request('direction', 'desc');
        $query->orderBy($sortField, $sortDirection);
        
        $orders = $query->paginate(20, ['id','status','price','user_id','phone','delivery_address','delivery_location_address','return_location_address','return_address','return_date','return_notes','result_email_sent','result_email_sent_at','result_email_notes','created_at','timeline'])
                       ->withQueryString();
        
        return Inertia::render('Admin/kit-orders/index', [
            'orders' => $orders,
            'statuses' => array_map(fn($c)=>$c->value, \App\Enums\KitOrderStatus::cases()),
            'filters' => [
                'status' => request('status', 'all'),
                'date_from' => request('date_from'),
                'date_to' => request('date_to'),
                'search' => request('search'),
                'sort' => request('sort', 'created_at'),
                'direction' => request('direction', 'desc'),
            ]
        ]);
    })->name('kit-orders.index');
    Route::patch('/kit-orders/{kitOrder}/status', [KitOrderController::class, 'updateStatus'])->name('kit-orders.update-status');
    Route::patch('/kit-orders/{kitOrder}/mark-email-sent', [KitOrderController::class, 'markEmailSent'])->name('kit-orders.mark-email-sent');
    Route::patch('/kit-orders/{kitOrder}/unmark-email-sent', [KitOrderController::class, 'unmarkEmailSent'])->name('kit-orders.unmark-email-sent');

    Route::get('/consultation-requests', function() {
        $requests = \App\Models\ConsultationRequest::latest()->paginate(20, ['id','status','user_id']);
        return Inertia::render('Admin/consultation-requests/index', [
            'requests' => $requests,
            'statuses' => array_map(fn($c)=>$c->value, \App\Enums\ConsultationStatus::cases()),
        ]);
    })->name('consultation-requests.index');
    Route::patch('/consultation-requests/{consultationRequest}/status', [ConsultationRequestController::class, 'updateStatus'])->name('consultation-requests.update-status');
    Route::post('/consultation-requests/{consultationRequest}/assign-partner', [ConsultationRequestController::class, 'assignPartnerDoctor'])->name('consultation-requests.assign-partner');

    // Pricing settings routes
    Route::get('/pricing', [\App\Http\Controllers\Admin\PricingController::class, 'index'])->name('pricing.index');
    Route::patch('/pricing', [\App\Http\Controllers\Admin\PricingController::class, 'update'])->name('pricing.update');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
