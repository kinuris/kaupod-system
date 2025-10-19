<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\ProductOrder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ProductOrderController extends Controller
{
    public function checkout(Request $request)
    {
        $validated = $request->validate([
            'items' => 'required|array',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'customer_name' => 'required|string|max:255',
            'customer_email' => 'required|email|max:255',
            'customer_phone' => 'required|string|max:20',
            'delivery_address' => 'required|string|max:1000',
            'notes' => 'nullable|string|max:1000'
        ]);

        return DB::transaction(function () use ($validated, $request) {
            $totalAmount = 0;
            $orderItems = [];

            // Process each item in the cart
            foreach ($validated['items'] as $item) {
                $product = Product::findOrFail($item['product_id']);
                
                // Check stock availability
                if ($product->stock < $item['quantity']) {
                    throw new \Exception("Insufficient stock for {$product->name}. Available: {$product->stock}, Requested: {$item['quantity']}");
                }

                // Calculate item total
                $itemTotal = $product->price * $item['quantity'];
                $totalAmount += $itemTotal;

                // Reduce product stock
                $product->decrement('stock', $item['quantity']);

                // Store order item details
                $orderItems[] = [
                    'product_id' => $product->id,
                    'product_name' => $product->name,
                    'price' => $product->price,
                    'quantity' => $item['quantity'],
                    'subtotal' => $itemTotal
                ];
            }

            // Create the order
            $order = ProductOrder::create([
                'user_id' => $request->user()?->id,
                'customer_name' => $validated['customer_name'],
                'customer_email' => $validated['customer_email'],
                'customer_phone' => $validated['customer_phone'],
                'delivery_address' => $validated['delivery_address'],
                'total_amount' => $totalAmount,
                'items' => $orderItems,
                'status' => 'processing',
                'payment_status' => 'paid', // Since we're simulating successful payment
                'payment_method' => 'gcash',
                'notes' => $validated['notes'] ?? null
            ]);

            return response()->json([
                'success' => true,
                'order_id' => $order->id,
                'message' => 'Order placed successfully!',
                'redirect_url' => 'https://gcash.com'
            ]);
        });
    }

    public function success(Request $request, $orderId)
    {
        $order = ProductOrder::findOrFail($orderId);
        
        // Cast numeric values for frontend
        $orderData = $order->toArray();
        $orderData['total_amount'] = (float) $order->total_amount;
        
        // Cast numeric values in items array
        if (isset($orderData['items']) && is_array($orderData['items'])) {
            foreach ($orderData['items'] as &$item) {
                $item['price'] = (float) $item['price'];
                $item['quantity'] = (int) $item['quantity'];
                $item['subtotal'] = (float) $item['subtotal'];
            }
        }
        
        return Inertia::render('OrderSuccess', [
            'order' => $orderData
        ]);
    }
}
