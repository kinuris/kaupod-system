import { Head } from '@inertiajs/react';
import ClientNavigation from '@/components/client-navigation';
import { ShoppingCart, Package, Plus, Minus } from 'lucide-react';
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
                                        <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-sm">
                                            Proceed to Checkout
                                        </button>
                                    </div>
                                )}
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
            </div>
        </>
    );
}