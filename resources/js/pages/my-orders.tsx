import React, { useState } from 'react';
import ClientNavigation from '@/components/client-navigation';
import { Head, router } from '@inertiajs/react';
import { Package, MessageCircle, Clock, CheckCircle, XCircle, Truck, MapPin, Trash2 } from 'lucide-react';
import LocationMapModal from '@/components/location-map-modal';

interface KitOrder {
    id: number;
    status: string;
    phone: string;
    delivery_location_address?: string;
    delivery_address?: string;
    delivery_latitude?: number;
    delivery_longitude?: number;
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
    filters: {
        show_cancelled: boolean;
    };
}

const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
        case 'in_review':
        case 'confirmed':
        case 'pending':
            return <Clock className="h-5 w-5 text-yellow-500" />;
        case 'shipping':
        case 'processing':
        case 'shipped':
        case 'in_progress':
            return <Truck className="h-5 w-5 text-blue-500" />;
        case 'out_for_delivery':
            return <Truck className="h-5 w-5 text-purple-500" />;
        case 'accepted':
            return <CheckCircle className="h-5 w-5 text-green-400" />;
        case 'returning':
            return <Package className="h-5 w-5 text-orange-500" />;
        case 'received':
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
        case 'in_review':
        case 'confirmed':
        case 'pending':
            return 'bg-yellow-50 text-yellow-800 border-yellow-200';
        case 'shipping':
        case 'processing':
        case 'shipped':
        case 'in_progress':
            return 'bg-blue-50 text-blue-800 border-blue-200';
        case 'out_for_delivery':
            return 'bg-purple-50 text-purple-800 border-purple-200';
        case 'accepted':
            return 'bg-green-50 text-green-800 border-green-200';
        case 'returning':
            return 'bg-orange-50 text-orange-800 border-orange-200';
        case 'received':
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

const formatStatusDisplay = (status: string) => {
    return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
};

export default function MyOrders({ kitOrders = [], consultationRequests = [], filters }: StatusPageProps) {
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState<{
        latitude: number;
        longitude: number;
        locationAddress: string;
        deliveryAddress?: string;
        orderType: 'kit' | 'consultation';
        orderId: number;
    } | null>(null);

    const openLocationModal = (
        latitude: number,
        longitude: number,
        locationAddress: string,
        deliveryAddress: string | undefined,
        orderType: 'kit' | 'consultation',
        orderId: number
    ) => {
        setSelectedLocation({
            latitude,
            longitude,
            locationAddress,
            deliveryAddress,
            orderType,
            orderId
        });
        setModalOpen(true);
    };

    const closeLocationModal = () => {
        setModalOpen(false);
        setSelectedLocation(null);
    };

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
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-pink-100">
                                        <Package className="h-5 w-5 text-pink-600" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-900">HIV Testing Kits</h2>
                                </div>
                                
                                <div className="flex items-center gap-2">
                                    <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={filters.show_cancelled}
                                            onChange={(e) => {
                                                const url = new URL(window.location.href);
                                                if (e.target.checked) {
                                                    url.searchParams.set('show_cancelled', '1');
                                                } else {
                                                    url.searchParams.delete('show_cancelled');
                                                }
                                                router.get(url.pathname + url.search, {}, {
                                                    preserveState: true,
                                                    preserveScroll: true,
                                                });
                                            }}
                                            className="rounded border-gray-300 text-pink-600 focus:ring-pink-500"
                                        />
                                        Show cancelled orders
                                    </label>
                                </div>
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
                                                    {formatStatusDisplay(order.status)}
                                                </div>
                                            </div>
                                            
                                            {order.delivery_location_address && (
                                                <div className="text-sm text-gray-600 mb-2">
                                                    <span className="font-medium">Delivery Location:</span>
                                                    {order.delivery_latitude && order.delivery_longitude ? (
                                                        <button
                                                            onClick={() => openLocationModal(
                                                                order.delivery_latitude!,
                                                                order.delivery_longitude!,
                                                                order.delivery_location_address!,
                                                                order.delivery_address,
                                                                'kit',
                                                                order.id
                                                            )}
                                                            className="ml-2 text-pink-600 hover:text-pink-800 transition-colors inline-flex items-center gap-1 cursor-pointer"
                                                        >
                                                            {order.delivery_location_address}
                                                            <MapPin className="h-3 w-3" />
                                                        </button>
                                                    ) : (
                                                        <span className="ml-2">{order.delivery_location_address}</span>
                                                    )}
                                                </div>
                                            )}
                                            
                                            <div className="text-sm text-gray-600">
                                                <span className="font-medium">Contact:</span> {order.phone}
                                            </div>

                                            {order.status === 'in_review' && (
                                                <div className="mt-3 pt-3 border-t border-gray-100">
                                                    <button
                                                        onClick={() => {
                                                            if (confirm('Are you sure you want to cancel this kit order? This action cannot be undone.')) {
                                                                router.delete(`/kit-orders/${order.id}/cancel`, {
                                                                    preserveScroll: true,
                                                                    onSuccess: () => {
                                                                        // The success message will be shown via the redirect
                                                                    },
                                                                    onError: (errors) => {
                                                                        console.error('Error cancelling order:', errors);
                                                                        alert('Error cancelling order. Please try again.');
                                                                    }
                                                                });
                                                            }
                                                        }}
                                                        className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                        Cancel Order
                                                    </button>
                                                </div>
                                            )}

                                            {order.status === 'accepted' && (
                                                <div className="mt-3 pt-3 border-t border-gray-100">
                                                    <button
                                                        onClick={() => {
                                                            if (confirm('Are you ready to return this testing kit? Please ensure you have completed your test.')) {
                                                                router.patch(`/kit-orders/${order.id}/client-status`, {
                                                                    status: 'returning'
                                                                }, {
                                                                    preserveScroll: true,
                                                                    onSuccess: () => {
                                                                        // The success message will be shown via flash
                                                                    },
                                                                    onError: (errors) => {
                                                                        console.error('Error updating order status:', errors);
                                                                        alert('Error updating order status. Please try again.');
                                                                    }
                                                                });
                                                            }
                                                        }}
                                                        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 rounded-lg transition-colors"
                                                    >
                                                        <Package className="h-4 w-4" />
                                                        Mark as Returning
                                                    </button>
                                                </div>
                                            )}

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
                                                    {formatStatusDisplay(request.status)}
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

            {/* Location Map Modal */}
            {selectedLocation && (
                <LocationMapModal
                    isOpen={modalOpen}
                    onClose={closeLocationModal}
                    latitude={selectedLocation.latitude}
                    longitude={selectedLocation.longitude}
                    locationAddress={selectedLocation.locationAddress}
                    deliveryAddress={selectedLocation.deliveryAddress}
                    orderType={selectedLocation.orderType}
                    orderId={selectedLocation.orderId}
                />
            )}
        </>
    );
}