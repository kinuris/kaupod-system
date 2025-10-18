import { Head } from '@inertiajs/react';
import ClientNavigation from '@/components/client-navigation';
import { ShoppingCart, Package, Truck, CreditCard } from 'lucide-react';

export default function OrderItem() {
    return (
        <>
            <Head title="Order Item - Kaupod" />
            
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
                <ClientNavigation />
                
                {/* Header Section */}
                <header className="bg-white shadow-sm border-b border-gray-200 mt-14">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        <div className="text-center">
                            <div className="flex justify-center mb-4">
                                <ShoppingCart className="h-12 w-12 text-blue-600" />
                            </div>
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                                Order Items
                            </h1>
                            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
                                Browse and order medical supplies, health kits, and other healthcare products 
                                available through the Kaupod system.
                            </p>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Coming Soon Section */}
                    <div className="text-center mb-12">
                        <div className="bg-white rounded-lg shadow-md p-8 border border-blue-200">
                            <div className="flex justify-center mb-6">
                                <Package className="h-16 w-16 text-blue-600" />
                            </div>
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                Order System Coming Soon
                            </h2>
                            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                                We're working on bringing you a comprehensive ordering system for medical supplies 
                                and healthcare products. This feature will be available soon.
                            </p>
                            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-md text-sm font-medium">
                                <Package className="h-4 w-4" />
                                Feature in Development
                            </div>
                        </div>
                    </div>

                    {/* Feature Preview */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                            <div className="flex items-center gap-3 mb-4">
                                <Package className="h-6 w-6 text-blue-600" />
                                <h3 className="text-lg font-semibold text-gray-900">Medical Supplies</h3>
                            </div>
                            <p className="text-gray-600 text-sm">
                                Order essential medical supplies and equipment for personal or professional use.
                            </p>
                        </div>

                        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                            <div className="flex items-center gap-3 mb-4">
                                <Truck className="h-6 w-6 text-blue-600" />
                                <h3 className="text-lg font-semibold text-gray-900">Fast Delivery</h3>
                            </div>
                            <p className="text-gray-600 text-sm">
                                Quick and reliable delivery of your ordered items directly to your location.
                            </p>
                        </div>

                        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                            <div className="flex items-center gap-3 mb-4">
                                <CreditCard className="h-6 w-6 text-blue-600" />
                                <h3 className="text-lg font-semibold text-gray-900">Secure Payment</h3>
                            </div>
                            <p className="text-gray-600 text-sm">
                                Safe and secure payment processing for all your healthcare product orders.
                            </p>
                        </div>
                    </div>

                    {/* Temporary Contact Section */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-blue-800 mb-4">
                            Need to Order Items Now?
                        </h3>
                        <p className="text-blue-700 text-sm mb-4">
                            While our online ordering system is being developed, you can still place orders 
                            by contacting our support team directly.
                        </p>
                        <div className="space-y-2 text-sm text-blue-700">
                            <p>• Contact our support team for assistance with orders</p>
                            <p>• Check available products and pricing</p>
                            <p>• Schedule delivery arrangements</p>
                            <p>• Get help with bulk orders for medical facilities</p>
                        </div>
                    </div>
                </main>

                {/* Footer */}
                <footer className="bg-white border-t border-gray-200 mt-16">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        <div className="text-center">
                            <h4 className="text-lg font-semibold text-gray-900 mb-4">
                                Stay Updated
                            </h4>
                            <p className="text-sm text-gray-600 max-w-2xl mx-auto leading-relaxed">
                                We'll notify you as soon as our ordering system is available. 
                                Thank you for your patience as we work to improve your healthcare experience.
                            </p>
                            <div className="mt-6 pt-6 border-t border-gray-200">
                                <p className="text-xs text-gray-500">
                                    &copy; 2024 Kaupod System. All rights reserved. | Order Management System
                                </p>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}