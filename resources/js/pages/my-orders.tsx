import React from 'react';
import ClientNavigation from '@/components/client-navigation';
import { Head } from '@inertiajs/react';
import { Package, MessageCircle, Clock, CheckCircle, XCircle, Truck } from 'lucide-react';

interface KitOrder {
    id: number;
    status: string;
    phone: string;
    delivery_location_address?: string;
    delivery_address?: string;
    created_at: string;
    timeline?: Record<string, string>;
}

interface ConsultationRequest {
    id: number;
    status: string;
    phone: string;
    preferred_date: string;
    preferred_time: string;
    consultation_type: string;
    created_at: string;
    timeline?: Record<string, string>;
}

interface StatusPageProps {
    kitOrders: KitOrder[];
    consultationRequests: ConsultationRequest[];
}

const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
        case 'confirmed':
        case 'pending':
            return <Clock className="h-5 w-5 text-yellow-500" />;
        case 'processing':
        case 'shipped':
        case 'in_progress':
            return <Truck className="h-5 w-5 text-blue-500" />;
        case 'completed':
        case 'delivered':
            return <CheckCircle className="h-5 w-5 text-green-500" />;
        case 'cancelled':
        case 'rejected':
            return <XCircle className="h-5 w-5 text-red-500" />;
        default:
            return <Clock className="h-5 w-5 text-gray-500" />;
    }
};

const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
        case 'confirmed':
        case 'pending':
            return 'bg-yellow-50 text-yellow-800 border-yellow-200';
        case 'processing':
        case 'shipped':
        case 'in_progress':
            return 'bg-blue-50 text-blue-800 border-blue-200';
        case 'completed':
        case 'delivered':
            return 'bg-green-50 text-green-800 border-green-200';
        case 'cancelled':
        case 'rejected':
            return 'bg-red-50 text-red-800 border-red-200';
        default:
            return 'bg-gray-50 text-gray-800 border-gray-200';
    }
};

export default function MyOrders({ kitOrders = [], consultationRequests = [] }: StatusPageProps) {
    return (
        <>
            <Head title="My Orders & Requests - Kaupod" />
            
            <ClientNavigation />

            {/* Hero Section */}
            <section className="bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 py-20">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                            My Orders & Requests
                        </h1>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Track the status of your HIV testing kits and consultation requests
                        </p>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-8">
                        {/* HIV Testing Kits */}
                        <div className="bg-white rounded-2xl shadow-xl p-8">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-pink-100">
                                    <Package className="h-5 w-5 text-pink-600" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900">HIV Testing Kits</h2>
                            </div>

                            {kitOrders.length === 0 ? (
                                <div className="text-center py-8">
                                    <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                                    <p className="text-gray-500 mb-4">No testing kit orders yet</p>
                                    <a 
                                        href="/request/kit"
                                        className="inline-block bg-pink-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-pink-700 transition-colors"
                                    >
                                        Order Your First Kit
                                    </a>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {kitOrders.map((order) => (
                                        <div key={order.id} className="border border-gray-200 rounded-lg p-4">
                                            <div className="flex items-start justify-between mb-3">
                                                <div>
                                                    <div className="font-semibold text-gray-900">
                                                        HIV Testing Kit #{order.id}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        Ordered: {new Date(order.created_at).toLocaleDateString()}
                                                    </div>
                                                </div>
                                                <div className={`flex items-center gap-2 px-3 py-1 rounded-full border text-sm font-medium ${getStatusColor(order.status)}`}>
                                                    {getStatusIcon(order.status)}
                                                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                                </div>
                                            </div>
                                            
                                            {order.delivery_location_address && (
                                                <div className="text-sm text-gray-600 mb-2">
                                                    <span className="font-medium">Delivery Location:</span> {order.delivery_location_address}
                                                </div>
                                            )}
                                            
                                            <div className="text-sm text-gray-600">
                                                <span className="font-medium">Contact:</span> {order.phone}
                                            </div>

                                            {order.timeline && Object.keys(order.timeline).length > 0 && (
                                                <div className="mt-3 pt-3 border-t border-gray-100">
                                                    <div className="text-xs font-medium text-gray-700 mb-2">Timeline:</div>
                                                    <div className="space-y-1">
                                                        {Object.entries(order.timeline).map(([timestamp, status]) => (
                                                            <div key={timestamp} className="flex justify-between text-xs text-gray-500">
                                                                <span>{status}</span>
                                                                <span>{new Date(timestamp).toLocaleString()}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Medical Consultations */}
                        <div className="bg-white rounded-2xl shadow-xl p-8">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-100">
                                    <MessageCircle className="h-5 w-5 text-teal-600" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900">Medical Consultations</h2>
                            </div>

                            {consultationRequests.length === 0 ? (
                                <div className="text-center py-8">
                                    <MessageCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                                    <p className="text-gray-500 mb-4">No consultation requests yet</p>
                                    <a 
                                        href="/request/consultation"
                                        className="inline-block bg-teal-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-teal-700 transition-colors"
                                    >
                                        Book Your First Consultation
                                    </a>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {consultationRequests.map((request) => (
                                        <div key={request.id} className="border border-gray-200 rounded-lg p-4">
                                            <div className="flex items-start justify-between mb-3">
                                                <div>
                                                    <div className="font-semibold text-gray-900">
                                                        Consultation #{request.id}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        Requested: {new Date(request.created_at).toLocaleDateString()}
                                                    </div>
                                                </div>
                                                <div className={`flex items-center gap-2 px-3 py-1 rounded-full border text-sm font-medium ${getStatusColor(request.status)}`}>
                                                    {getStatusIcon(request.status)}
                                                    {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                                                </div>
                                            </div>
                                            
                                            <div className="space-y-1 text-sm text-gray-600 mb-2">
                                                <div>
                                                    <span className="font-medium">Type:</span> {request.consultation_type?.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                                </div>
                                                <div>
                                                    <span className="font-medium">Preferred Date:</span> {new Date(request.preferred_date).toLocaleDateString()}
                                                </div>
                                                <div>
                                                    <span className="font-medium">Preferred Time:</span> {request.preferred_time}
                                                </div>
                                                <div>
                                                    <span className="font-medium">Contact:</span> {request.phone}
                                                </div>
                                            </div>

                                            {request.timeline && Object.keys(request.timeline).length > 0 && (
                                                <div className="mt-3 pt-3 border-t border-gray-100">
                                                    <div className="text-xs font-medium text-gray-700 mb-2">Timeline:</div>
                                                    <div className="space-y-1">
                                                        {Object.entries(request.timeline).map(([timestamp, status]) => (
                                                            <div key={timestamp} className="flex justify-between text-xs text-gray-500">
                                                                <span>{status}</span>
                                                                <span>{new Date(timestamp).toLocaleString()}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="mt-12 text-center">
                        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl mx-auto">
                            <h3 className="text-xl font-bold text-gray-900 mb-4">Need Something Else?</h3>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <a 
                                    href="/request/kit"
                                    className="inline-block bg-pink-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-pink-700 transition-colors"
                                >
                                    Order New HIV Testing Kit
                                </a>
                                <a 
                                    href="/request/consultation"
                                    className="inline-block bg-teal-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-teal-700 transition-colors"
                                >
                                    Book New Consultation
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h3 className="text-xl font-bold mb-4">Kaupod</h3>
                        <p className="text-gray-400 mb-4">
                            Private, compassionate reproductive health care for everyone.
                        </p>
                        <p className="text-gray-400">&copy; 2024 Kaupod. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </>
    );
}