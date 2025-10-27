<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ProductOrder;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductOrderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = ProductOrder::with('user')->latest();

        // Apply filters
        if ($request->filled('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        if ($request->filled('payment_status') && $request->payment_status !== 'all') {
            $query->where('payment_status', $request->payment_status);
        }

        if ($request->filled('date_from')) {
            $query->whereDate('created_at', '>=', $request->date_from);
        }

        if ($request->filled('date_to')) {
            $query->whereDate('created_at', '<=', $request->date_to);
        }

        // Search by customer name, email, or phone
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('customer_name', 'like', "%{$search}%")
                  ->orWhere('customer_email', 'like', "%{$search}%")
                  ->orWhere('customer_phone', 'like', "%{$search}%")
                  ->orWhereHas('user', function($userQuery) use ($search) {
                      $userQuery->where('name', 'like', "%{$search}%")
                               ->orWhere('email', 'like', "%{$search}%");
                  });
            });
        }

        // Sort
        $sortField = $request->get('sort', 'created_at');
        $sortDirection = $request->get('direction', 'desc');
        $query->orderBy($sortField, $sortDirection);

        $orders = $query->paginate(20, [
            'id', 'user_id', 'customer_name', 'customer_email', 'customer_phone', 
            'delivery_address', 'total_amount', 'items', 'status', 'payment_status', 
            'payment_method', 'created_at', 'updated_at'
        ])->withQueryString();

        // Map the data to include calculated fields
        $orders->getCollection()->transform(function ($order) {
            $order->formatted_total = '₱' . number_format($order->total_amount, 2);
            $order->items_count = is_array($order->items) ? count($order->items) : 0;
            $order->total_quantity = is_array($order->items) ? 
                array_sum(array_column($order->items, 'quantity')) : 0;
            return $order;
        });

        return Inertia::render('Admin/ProductOrders/Index', [
            'orders' => $orders,
            'statuses' => [
                'pending' => 'Pending',
                'processing' => 'Processing', 
                'shipped' => 'Shipped',
                'delivered' => 'Delivered',
                'cancelled' => 'Cancelled'
            ],
            'paymentStatuses' => [
                'pending' => 'Pending',
                'paid' => 'Paid',
                'failed' => 'Failed',
                'refunded' => 'Refunded'
            ],
            'filters' => [
                'status' => $request->get('status', 'all'),
                'payment_status' => $request->get('payment_status', 'all'),
                'date_from' => $request->get('date_from'),
                'date_to' => $request->get('date_to'),
                'search' => $request->get('search'),
                'sort' => $sortField,
                'direction' => $sortDirection,
            ]
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(ProductOrder $productOrder)
    {
        $productOrder->load('user');
        
        // Cast numeric values in items array
        $items = collect($productOrder->items)->map(function ($item) {
            return [
                'product_id' => (int) $item['product_id'],
                'product_name' => $item['product_name'],
                'price' => (float) $item['price'],
                'quantity' => (int) $item['quantity'],
                'subtotal' => (float) $item['subtotal']
            ];
        })->toArray();

        return Inertia::render('Admin/ProductOrders/Show', [
            'order' => [
                'id' => $productOrder->id,
                'customer_name' => $productOrder->customer_name,
                'customer_email' => $productOrder->customer_email,
                'customer_phone' => $productOrder->customer_phone,
                'delivery_address' => $productOrder->delivery_address,
                'total_amount' => (float) $productOrder->total_amount,
                'formatted_total' => $productOrder->formatted_total,
                'items' => $items,
                'status' => $productOrder->status,
                'payment_status' => $productOrder->payment_status,
                'payment_method' => $productOrder->payment_method,
                'notes' => $productOrder->notes,
                'user' => $productOrder->user,
                'created_at' => $productOrder->created_at,
                'updated_at' => $productOrder->updated_at,
            ]
        ]);
    }

    /**
     * Update the order status.
     */
    public function updateStatus(Request $request, ProductOrder $productOrder)
    {
        $validated = $request->validate([
            'status' => 'required|in:pending,processing,shipped,delivered,cancelled',
        ]);

        $productOrder->update([
            'status' => $validated['status']
        ]);

        return redirect()->back()->with('success', 'Order status updated successfully.');
    }

    /**
     * Update the payment status.
     */
    public function updatePaymentStatus(Request $request, ProductOrder $productOrder)
    {
        $validated = $request->validate([
            'payment_status' => 'required|in:pending,paid,failed,refunded',
        ]);

        $productOrder->update([
            'payment_status' => $validated['payment_status']
        ]);

        return redirect()->back()->with('success', 'Payment status updated successfully.');
    }
}