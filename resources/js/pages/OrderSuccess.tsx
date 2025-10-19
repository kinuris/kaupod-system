import { Head, Link } from '@inertiajs/react';
import { CheckCircle, Package, ArrowRight } from 'lucide-react';

interface OrderItem {
    product_id: number;
    product_name: string;
    price: number;
    quantity: number;
    subtotal: number;
}

interface Order {
    id: number;
    customer_name: string;
    customer_email: string;
    customer_phone: string;
    delivery_address: string;
    total_amount: number;
    items: OrderItem[];
    status: string;
    payment_status: string;
    created_at: string;
}

interface Props {
    order: Order;
}

export default function OrderSuccess({ order }: Props) {
    return (
        <>
            <Head title="Order Successful - Kaupod" />
            
            <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center p-4">
                <div className="max-w-2xl w-full">
                    {/* Success Header */}
                    <div className="text-center mb-8">
                        <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
                            <CheckCircle className="h-12 w-12 text-green-600" />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Successful!</h1>
                        <p className="text-gray-600">
                            Thank you for your order. We'll process it shortly and send you updates.
                        </p>
                    </div>

                    {/* Order Details Card */}
                    <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6 mb-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Details</h2>
                        
                        <div className="grid md:grid-cols-2 gap-4 mb-6">
                            <div>
                                <h3 className="font-medium text-gray-900 mb-2">Order Information</h3>
                                <div className="space-y-1 text-sm text-gray-600">
                                    <p><span className="font-medium">Order ID:</span> #{order.id}</p>
                                    <p><span className="font-medium">Status:</span> 
                                        <span className="ml-1 inline-flex px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                                            {order.status}
                                        </span>
                                    </p>
                                    <p><span className="font-medium">Payment:</span> 
                                        <span className="ml-1 inline-flex px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                                            {order.payment_status}
                                        </span>
                                    </p>
                                </div>
                            </div>
                            
                            <div>
                                <h3 className="font-medium text-gray-900 mb-2">Customer Information</h3>
                                <div className="space-y-1 text-sm text-gray-600">
                                    <p><span className="font-medium">Name:</span> {order.customer_name}</p>
                                    <p><span className="font-medium">Email:</span> {order.customer_email}</p>
                                    <p><span className="font-medium">Phone:</span> {order.customer_phone}</p>
                                </div>
                            </div>
                        </div>

                        <div className="mb-6">
                            <h3 className="font-medium text-gray-900 mb-2">Delivery Address</h3>
                            <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
                                {order.delivery_address}
                            </p>
                        </div>

                        <div>
                            <h3 className="font-medium text-gray-900 mb-3">Order Items</h3>
                            <div className="space-y-3">
                                {order.items.map((item, index) => (
                                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-white rounded-md flex items-center justify-center border">
                                                <Package className="h-5 w-5 text-gray-400" />
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-medium text-gray-900">{item.product_name}</h4>
                                                <p className="text-xs text-gray-500">
                                                    ₱{item.price} × {item.quantity}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-sm font-semibold text-gray-900">
                                            ₱{item.subtotal.toFixed(2)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            
                            <div className="border-t border-gray-200 pt-4 mt-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-lg font-semibold text-gray-900">Total Amount:</span>
                                    <span className="text-xl font-bold text-green-600">₱{order.total_amount.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Next Steps */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                        <h3 className="font-medium text-blue-900 mb-2">What happens next?</h3>
                        <ul className="text-sm text-blue-800 space-y-1">
                            <li>• We'll process your order within 24 hours</li>
                            <li>• You'll receive email updates about your order status</li>
                            <li>• Your items will be packaged discretely for privacy</li>
                            <li>• Delivery within Capiz Province typically takes 2-3 days</li>
                        </ul>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4">
                        <Link
                            href="/order-item"
                            className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                        >
                            <ArrowRight className="h-4 w-4" />
                            Continue Shopping
                        </Link>
                        <Link
                            href="/"
                            className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors text-center"
                        >
                            Back to Home
                        </Link>
                    </div>

                    {/* Support Contact */}
                    <div className="text-center mt-8 text-sm text-gray-500">
                        <p>Need help with your order? Contact us at support@kaupod.com</p>
                    </div>
                </div>
            </div>
        </>
    );
}