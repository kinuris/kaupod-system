import { Head, router } from '@inertiajs/react';
import ClientNavigation from '@/components/client-navigation';
import { ShoppingCart, Package, Plus, Minus, X } from 'lucide-react';
import { useState } from 'react';

interface Product {
    id: number;
    name: string;
    category: string;
    price: number;
    stock: number;
    description: string;
    image?: string;
}

interface Props {
    products: Product[];
}

const categories = [
    { id: "all", name: "All Products", icon: "🏥" },
    { id: "condom", name: "Condoms", icon: "🛡️" },
    { id: "pregnancy_test", name: "Pregnancy Tests", icon: "🧪" },
    { id: "pills", name: "Pills", icon: "💊" },
    { id: "vitamins", name: "Vitamins", icon: "🌿" },
    { id: "other_kits", name: "Other Kits", icon: "🩹" },
];

export default function OrderItem({ products }: Props) {
    const [selectedCategory, setSelectedCategory] = useState<string>("all");
    const [cart, setCart] = useState<{[key: number]: number}>({});
    const [showCart, setShowCart] = useState(false);
    const [showCheckout, setShowCheckout] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [checkoutForm, setCheckoutForm] = useState({
        customer_name: '',
        customer_email: '',
        customer_phone: '',
        delivery_address: '',
        notes: ''
    });

    const filteredProducts = selectedCategory === "all" 
        ? products 
        : products.filter(product => product.category === selectedCategory);

    const addToCart = (productId: number) => {
        const product = products.find(p => p.id === productId);
        if (product && (cart[productId] || 0) < product.stock) {
            setCart(prev => ({
                ...prev,
                [productId]: (prev[productId] || 0) + 1
            }));
        }
    };

    const removeFromCart = (productId: number) => {
        setCart(prev => {
            const newCart = { ...prev };
            if (newCart[productId] > 1) {
                newCart[productId]--;
            } else {
                delete newCart[productId];
            }
            return newCart;
        });
    };

    const getCartItemCount = () => {
        return Object.values(cart).reduce((sum, count) => sum + count, 0);
    };

    const getCartTotal = () => {
        return Object.entries(cart).reduce((total, [productId, count]) => {
            const product = products.find(p => p.id === parseInt(productId));
            return total + (product ? product.price * count : 0);
        }, 0);
    };

    const handleCheckout = async () => {
        if (Object.entries(cart).length === 0) {
            alert('Your cart is empty!');
            return;
        }

        // Simple validation
        if (!checkoutForm.customer_name || !checkoutForm.customer_email || 
            !checkoutForm.customer_phone || !checkoutForm.delivery_address) {
            alert('Please fill in all required fields');
            return;
        }

        setIsProcessing(true);

        try {
            const orderItems = Object.entries(cart).map(([productId, quantity]) => ({
                product_id: parseInt(productId),
                quantity: quantity
            }));

            const response = await fetch('/checkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify({
                    items: orderItems,
                    ...checkoutForm
                })
            });

            const data = await response.json();

            if (data.success) {
                // Open GCash in new tab
                window.open('https://gcash.com', '_blank');
                
                // Clear cart and redirect to success page
                setCart({});
                setShowCart(false);
                setShowCheckout(false);
                
                // Redirect to success page after a short delay
                setTimeout(() => {
                    window.location.href = `/order-success/${data.order_id}`;
                }, 1000);
            } else {
                alert('Order failed: ' + data.message);
            }
        } catch (error) {
            console.error('Checkout error:', error);
            alert('An error occurred during checkout. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    const proceedToCheckout = () => {
        setShowCheckout(true);
    };

    const ProductCard = ({ product }: { product: Product }) => (
        <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-4 border border-gray-200">
            <div className="aspect-square bg-gray-100 rounded-md mb-4 flex items-center justify-center">
                <Package className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2 text-sm leading-tight">
                {product.name}
            </h3>
            <p className="text-gray-600 text-xs mb-3 line-clamp-2">
                {product.description}
            </p>
            <div className="flex items-center justify-between mb-3">
                <span className="text-lg font-bold text-blue-600">₱{product.price}</span>
                <span className="text-xs text-gray-500">Stock: {product.stock}</span>
            </div>
            <div className="flex items-center gap-2">
                {cart[product.id] ? (
                    <div className="flex items-center gap-2 flex-1">
                        <button
                            onClick={() => removeFromCart(product.id)}
                            className="p-1 bg-red-100 text-red-600 rounded hover:bg-red-200 transition-colors"
                        >
                            <Minus className="h-3 w-3" />
                        </button>
                        <span className="text-sm text-gray-500 font-medium min-w-[20px] text-center">
                            {cart[product.id]}
                        </span>
                        <button
                            onClick={() => addToCart(product.id)}
                            disabled={cart[product.id] >= product.stock}
                            className="p-1 bg-green-100 text-green-600 rounded hover:bg-green-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Plus className="h-3 w-3" />
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={() => addToCart(product.id)}
                        disabled={product.stock === 0}
                        className="flex-1 bg-blue-600 text-white py-2 px-3 rounded text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
                    </button>
                )}
            </div>
        </div>
    );

    return (
        <>
            <Head title="Order Items - Kaupod" />
            
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
                <ClientNavigation />
                
                {/* Header Section */}
                <header className="bg-white shadow-sm border-b border-gray-200 mt-14">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                        <div className="flex justify-between items-center">
                            <div>
                                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                                    Health Products Store
                                </h1>
                                <p className="text-gray-600 mt-2">
                                    Order healthcare products with discrete delivery
                                </p>
                            </div>
                            <button
                                onClick={() => setShowCart(!showCart)}
                                className="relative bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
                            >
                                <ShoppingCart className="h-5 w-5" />
                                <span>Cart</span>
                                {getCartItemCount() > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                        {getCartItemCount()}
                                    </span>
                                )}
                            </button>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Category Filter */}
                    <div className="mb-8">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Categories</h2>
                        <div className="flex flex-wrap gap-2">
                            {categories.map((category) => (
                                <button
                                    key={category.id}
                                    onClick={() => setSelectedCategory(category.id)}
                                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                                        selectedCategory === category.id
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                >
                                    {category.icon} {category.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Products Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
                        {filteredProducts.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>

                    {filteredProducts.length === 0 && (
                        <div className="text-center py-12">
                            <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-600">No products found in this category</p>
                        </div>
                    )}
                </main>

                {/* Cart Sidebar */}
                {showCart && (
                    <div className="fixed inset-0 z-50 overflow-hidden">
                        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowCart(false)} />
                        <div className="absolute right-0 top-0 h-full w-96 bg-white shadow-2xl border-l border-gray-200">
                            <div className="flex flex-col h-full">
                                <div className="flex justify-between items-center p-6 border-b border-gray-200">
                                    <h2 className="text-xl font-semibold text-gray-900">Shopping Cart</h2>
                                    <button
                                        onClick={() => setShowCart(false)}
                                        className="p-2 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100 transition-colors"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                                
                                <div className="flex-1 overflow-y-auto p-6">
                                    {Object.entries(cart).length === 0 ? (
                                        <div className="text-center py-12">
                                            <ShoppingCart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                                            <p className="text-gray-500">Your cart is empty</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {Object.entries(cart).map(([productId, count]) => {
                                                const product = products.find(p => p.id === parseInt(productId));
                                                if (!product) return null;
                                                
                                                return (
                                                    <div key={productId} className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                                                        <div className="w-12 h-12 bg-white rounded-md flex items-center justify-center border">
                                                            <Package className="h-6 w-6 text-gray-400" />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <h4 className="text-sm font-semibold text-gray-900 truncate">
                                                                {product.name}
                                                            </h4>
                                                            <p className="text-sm text-gray-600">₱{product.price} each</p>
                                                            <p className="text-xs text-gray-500">Subtotal: ₱{(product.price * count).toFixed(2)}</p>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <button
                                                                onClick={() => removeFromCart(product.id)}
                                                                className="p-1.5 bg-red-100 text-red-600 rounded-md hover:bg-red-200 transition-colors"
                                                            >
                                                                <Minus className="h-3 w-3" />
                                                            </button>
                                                            <span className="text-sm font-semibold text-gray-900 min-w-[24px] text-center">
                                                                {count}
                                                            </span>
                                                            <button
                                                                onClick={() => addToCart(product.id)}
                                                                disabled={count >= product.stock}
                                                                className="p-1.5 bg-green-100 text-green-600 rounded-md hover:bg-green-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                                            >
                                                                <Plus className="h-3 w-3" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                                
                                {Object.entries(cart).length > 0 && (
                                    <div className="border-t border-gray-200 p-6 bg-gray-50">
                                        <div className="flex justify-between items-center mb-4">
                                            <span className="text-lg font-semibold text-gray-900">Total:</span>
                                            <span className="text-xl font-bold text-blue-600">₱{getCartTotal().toFixed(2)}</span>
                                        </div>
                                        <button 
                                            onClick={proceedToCheckout}
                                            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-sm"
                                        >
                                            Proceed to Checkout
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Checkout Modal */}
                {showCheckout && (
                    <div className="fixed inset-0 z-50 overflow-hidden">
                        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowCheckout(false)} />
                        <div className="absolute inset-x-4 top-1/2 transform -translate-y-1/2 max-w-lg mx-auto bg-white rounded-lg shadow-2xl border border-gray-200">
                            <div className="flex justify-between items-center p-6 border-b border-gray-200">
                                <h2 className="text-xl font-semibold text-gray-900">Checkout Information</h2>
                                <button
                                    onClick={() => setShowCheckout(false)}
                                    className="p-2 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100 transition-colors"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            
                            <div className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                                    <input
                                        type="text"
                                        value={checkoutForm.customer_name}
                                        onChange={(e) => setCheckoutForm({...checkoutForm, customer_name: e.target.value})}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Enter your full name"
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                                    <input
                                        type="email"
                                        value={checkoutForm.customer_email}
                                        onChange={(e) => setCheckoutForm({...checkoutForm, customer_email: e.target.value})}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Enter your email"
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                                    <input
                                        type="tel"
                                        value={checkoutForm.customer_phone}
                                        onChange={(e) => setCheckoutForm({...checkoutForm, customer_phone: e.target.value})}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Enter your phone number"
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Address *</label>
                                    <textarea
                                        value={checkoutForm.delivery_address}
                                        onChange={(e) => setCheckoutForm({...checkoutForm, delivery_address: e.target.value})}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        rows={3}
                                        placeholder="Enter your complete delivery address"
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Special Instructions (Optional)</label>
                                    <textarea
                                        value={checkoutForm.notes}
                                        onChange={(e) => setCheckoutForm({...checkoutForm, notes: e.target.value})}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        rows={2}
                                        placeholder="Any special delivery instructions..."
                                    />
                                </div>
                                
                                <div className="bg-gray-50 p-4 rounded-md">
                                    <div className="flex justify-between items-center text-lg font-semibold">
                                        <span>Total Amount:</span>
                                        <span className="text-blue-600">₱{getCartTotal().toFixed(2)}</span>
                                    </div>
                                </div>
                                
                                <button
                                    onClick={handleCheckout}
                                    disabled={isProcessing}
                                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isProcessing ? 'Processing...' : 'Complete Order & Pay with GCash'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Important Notice */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                        <h3 className="text-sm font-semibold text-amber-800 mb-2">Important Notice</h3>
                        <ul className="text-xs text-amber-700 space-y-1">
                            <li>• All orders are processed discretely with confidential packaging</li>
                            <li>• Prescription medications require valid prescription before checkout</li>
                            <li>• Delivery is available within Capiz Province</li>
                            <li>• For questions about products, consult with our healthcare professionals</li>
                        </ul>
                    </div>
                </div>

                {/* Terms and Conditions - In-App Purchases */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
                    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Terms and Conditions – In-App Purchases</h3>
                        <div className="text-sm text-gray-700 space-y-4 max-h-96 overflow-y-auto">
                            <p>
                                These Terms and Conditions govern the use of Team Kaupod's in-app purchase services, which allow users to buy verified sexual health products through the Kaupod platform in partnership with Watsons Philippines. By making an in-app purchase, users acknowledge and agree to comply with the following terms and conditions:
                            </p>
                            
                            <div className="space-y-3">
                                <div>
                                    <h4 className="font-semibold text-gray-900">Service Scope</h4>
                                    <p className="ml-4">
                                        The in-app purchase feature provides users with access to a range of sexual health products, including but not limited to contraceptives, lubricants, vitamins, and hygiene items. All products are supplied and distributed by Watsons Philippines, ensuring quality and authenticity. Team Kaupod acts solely as a facilitator of transactions between the user and Watsons through the platform. Product availability, pricing, and specifications are subject to change based on Watsons' inventory and current policies.
                                    </p>
                                </div>
                                
                                <div>
                                    <h4 className="font-semibold text-gray-900">Eligibility</h4>
                                    <p className="ml-4">
                                        The in-app purchase service is available exclusively to users aged 18 and above residing within Capiz. Users must ensure that all personal, contact, and delivery details provided during purchase are accurate and complete to prevent delays or order issues.
                                    </p>
                                </div>
                                
                                <div>
                                    <h4 className="font-semibold text-gray-900">Ordering and Delivery</h4>
                                    <p className="ml-4">
                                        Orders are processed upon confirmation of payment through Kaupod's in-app system. Delivery times may vary depending on product availability, location, and Watsons' delivery schedules. Users will receive updates on their order status through the platform or registered contact information. Any delays caused by unforeseen circumstances, such as weather, logistics issues, or supply limitations, are beyond Team Kaupod's control.
                                    </p>
                                </div>
                                
                                <div>
                                    <h4 className="font-semibold text-gray-900">Payment and Refund Policy</h4>
                                    <p className="ml-4">
                                        All payments for in-app purchases are processed securely within the Kaupod platform. Once confirmed, purchases are strictly non-refundable unless products are damaged, defective, or incorrect upon delivery, subject to Watsons' return and exchange policy. Refund or replacement requests must be filed within seven (7) days of receiving the product, accompanied by proof of purchase and supporting documentation.
                                    </p>
                                </div>
                                
                                <div>
                                    <h4 className="font-semibold text-gray-900">Confidentiality and Data Protection</h4>
                                    <p className="ml-4">
                                        All personal and transactional information provided by users will be treated with strict confidentiality in accordance with applicable privacy laws. Data will only be shared with Watsons or authorized delivery partners for the purpose of processing and fulfilling orders. No sensitive health information will be disclosed without explicit consent from the user.
                                    </p>
                                </div>
                                
                                <div>
                                    <h4 className="font-semibold text-gray-900">Limitations of Liability</h4>
                                    <p className="ml-4">
                                        Team Kaupod is not the manufacturer, distributor, or seller of any product offered through in-app purchases. Product quality, safety, and efficacy are the responsibility of Watsons Philippines and the respective manufacturers. Team Kaupod shall not be held liable for any adverse reactions, product misuse, or damages resulting from the use of purchased products.
                                    </p>
                                </div>
                                
                                <div>
                                    <h4 className="font-semibold text-gray-900">Service Modifications and Termination</h4>
                                    <p className="ml-4">
                                        Team Kaupod reserves the right to modify, suspend, or terminate the in-app purchase feature at any time, with reasonable notice provided to active users. Changes in product availability or pricing shall be governed by Watsons' policies and may occur without prior notice.
                                    </p>
                                </div>
                                
                                <div>
                                    <h4 className="font-semibold text-gray-900">Acceptance of Terms</h4>
                                    <p className="ml-4">
                                        By completing an in-app purchase, the user acknowledges that they have read, understood, and agreed to these Terms and Conditions, as well as Watsons' applicable sales and return policies.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}