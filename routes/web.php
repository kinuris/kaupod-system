<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Http\Controllers\ChatbotController;
use App\Http\Controllers\KitOrderController;
use App\Http\Controllers\ConsultationRequestController;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::get('/about', function () {
    return Inertia::render('about');
})->name('about');

Route::get('/chat', function () {
    return Inertia::render('chat');
})->name('chat');

Route::post('/chatbot/message', [ChatbotController::class, 'message'])->name('chatbot.message');
Route::post('/chatbot/message/stream', [ChatbotController::class, 'messageStream'])->name('chatbot.message.stream');
Route::post('/chatbot/clear', [ChatbotController::class, 'clearConversation'])->name('chatbot.clear');

Route::middleware(['auth', 'verified'])->group(function () {
    // Dashboard - only for admin users
    Route::get('dashboard', function () {
        $user = request()->user();
        
        // Admins see all recent orders, regular users see their own
        if ($user->isAdmin()) {
            $kitOrders = \App\Models\KitOrder::latest()->take(5)->get(['id','status','user_id','created_at']);
            $consults = \App\Models\ConsultationRequest::latest()->take(5)->get(['id','status','user_id','created_at']);
            
            // Admin statistics for dashboard cards
            $stats = [
                'totalUsers' => \App\Models\User::count(),
                'activePartnerDoctors' => \App\Models\PartnerDoctor::where('is_active', true)->count(),
                'thisMonthKitOrders' => \App\Models\KitOrder::whereMonth('created_at', now()->month)
                    ->whereYear('created_at', now()->year)
                    ->count(),
                'thisMonthConsultations' => \App\Models\ConsultationRequest::whereMonth('created_at', now()->month)
                    ->whereYear('created_at', now()->year)
                    ->count(),
                'pendingKitOrders' => \App\Models\KitOrder::whereIn('status', ['pending', 'approved', 'sent'])
                    ->count(),
                'pendingConsultations' => \App\Models\ConsultationRequest::whereIn('status', ['in_review', 'coordinating'])
                    ->count(),
            ];
        } else {
            $kitOrders = $user->kitOrders()->latest()->take(5)->get(['id','status']);
            $consults = $user->consultationRequests()->latest()->take(5)->get(['id','status']);
            $stats = null; // Regular users don't see admin statistics
        }
        
        return Inertia::render('dashboard', [
            'kitOrders' => $kitOrders,
            'consultationRequests' => $consults,
            'stats' => $stats,
        ]);
    })->name('dashboard')->middleware(\App\Http\Middleware\RestrictClientAccess::class);

    // Service request routes - available to all authenticated users
    Route::post('/request/kit', [KitOrderController::class, 'store'])->name('kit-order.store');
    Route::delete('/kit-orders/{kitOrder}/cancel', [KitOrderController::class, 'cancel'])->name('kit-order.cancel');
    Route::post('/request/consultation', [ConsultationRequestController::class, 'store'])->name('consultation-request.store');
    Route::post('/consultations/{consultationRequest}/reschedule', [ConsultationRequestController::class, 'reschedule'])->name('consultation-request.reschedule');
    Route::get('/request/kit', function() {
        $user = request()->user();
        $ongoingKitOrder = $user->kitOrders()
            ->whereNotIn('status', ['cancelled', 'sent_result'])
            ->first();
        
        $priceCalculator = new \App\Services\PriceCalculator();
        
        return Inertia::render('request/kit', [
            'hasOngoingKitOrder' => !!$ongoingKitOrder,
            'ongoingKitOrder' => $ongoingKitOrder,
            'kitPrice' => $priceCalculator->kitPrice(),
        ]);
    })->name('kit-order.form');
    Route::get('/request/consultation', function() {
        $user = request()->user();
        $ongoingConsultation = $user->consultationRequests()
            ->whereIn('status', ['in_review', 'coordinating', 'confirmed', 'reminder_sent'])
            ->first();
        
        $priceCalculator = new \App\Services\PriceCalculator();
        
        return Inertia::render('request/consultation', [
            'hasOngoingConsultation' => !!$ongoingConsultation,
            'ongoingConsultation' => $ongoingConsultation,
            'consultationPrice' => $priceCalculator->consultationPrice(),
            'platformFee' => $priceCalculator->consultationPlatformFee(),
            'expertFee' => $priceCalculator->consultationExpertFee(),
        ]);
    })->name('consultation-request.form');
    
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

    Route::get('/consultation-requests', function(Request $request) {
        $query = \App\Models\ConsultationRequest::with(['user', 'assignedPartnerDoctor']);

        // Apply filters
        if ($request->filled('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        if ($request->filled('date_from')) {
            $query->whereDate('created_at', '>=', $request->date_from);
        }

        if ($request->filled('date_to')) {
            $query->whereDate('created_at', '<=', $request->date_to);
        }

        if ($request->filled('search')) {
            $searchTerm = $request->search;
            $query->where(function($q) use ($searchTerm) {
                $q->whereHas('user', function($userQuery) use ($searchTerm) {
                    $userQuery->where('name', 'like', "%{$searchTerm}%")
                             ->orWhere('email', 'like', "%{$searchTerm}%");
                })->orWhere('phone', 'like', "%{$searchTerm}%");
            });
        }

        // Apply sorting
        $sortField = $request->get('sort', 'created_at');
        $sortDirection = $request->get('direction', 'desc');
        
        if ($sortField === 'name') {
            $query->join('users', 'consultation_requests.user_id', '=', 'users.id')
                  ->orderBy('users.name', $sortDirection)
                  ->select('consultation_requests.*');
        } else {
            $query->orderBy($sortField, $sortDirection);
        }

        $requests = $query->paginate(20);

        return Inertia::render('Admin/consultation-requests/index', [
            'requests' => $requests,
            'statuses' => array_map(fn($c)=>$c->value, \App\Enums\ConsultationStatus::cases()),
            'partnerDoctors' => \App\Models\PartnerDoctor::where('is_active', true)->get(['id', 'name', 'specialty']),
            'filters' => [
                'status' => $request->get('status', 'all'),
                'date_from' => $request->get('date_from'),
                'date_to' => $request->get('date_to'),
                'search' => $request->get('search'),
                'sort' => $sortField,
                'direction' => $sortDirection,
            ],
        ]);
    })->name('consultation-requests.index');
    Route::patch('/consultation-requests/{consultationRequest}/status', [ConsultationRequestController::class, 'updateStatus'])->name('consultation-requests.update-status');
    Route::post('/consultation-requests/{consultationRequest}/assign-partner', [ConsultationRequestController::class, 'assignPartnerDoctor'])->name('consultation-requests.assign-partner');

    // Partner Doctors Management
    Route::get('/partner-doctors', [\App\Http\Controllers\Admin\PartnerDoctorController::class, 'index'])->name('partner-doctors.index');
    Route::post('/partner-doctors', [\App\Http\Controllers\Admin\PartnerDoctorController::class, 'store'])->name('partner-doctors.store');
    Route::patch('/partner-doctors/{partnerDoctor}', [\App\Http\Controllers\Admin\PartnerDoctorController::class, 'update'])->name('partner-doctors.update');
    Route::delete('/partner-doctors/{partnerDoctor}', [\App\Http\Controllers\Admin\PartnerDoctorController::class, 'destroy'])->name('partner-doctors.destroy');

    // Client Management routes
    Route::get('/clients', [\App\Http\Controllers\Admin\ClientController::class, 'index'])->name('clients.index');
    Route::get('/clients/{client}', [\App\Http\Controllers\Admin\ClientController::class, 'show'])->name('clients.show');
    Route::get('/clients/{client}/edit', [\App\Http\Controllers\Admin\ClientController::class, 'edit'])->name('clients.edit');
    Route::patch('/clients/{client}', [\App\Http\Controllers\Admin\ClientController::class, 'update'])->name('clients.update');
    Route::delete('/clients/{client}', [\App\Http\Controllers\Admin\ClientController::class, 'destroy'])->name('clients.destroy');
    Route::post('/clients/{client}/toggle-status', [\App\Http\Controllers\Admin\ClientController::class, 'toggleStatus'])->name('clients.toggle-status');

    // Pricing settings routes
    Route::get('/pricing', [\App\Http\Controllers\Admin\PricingController::class, 'index'])->name('pricing.index');
    Route::patch('/pricing', [\App\Http\Controllers\Admin\PricingController::class, 'update'])->name('pricing.update');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
