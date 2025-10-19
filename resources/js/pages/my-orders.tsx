import React, { useState } from 'react';
import ClientNavigation from '@/components/client-navigation';
import { Head, router } from '@inertiajs/react';
import { Package, MessageCircle, Clock, CheckCircle, XCircle, Truck, MapPin, Trash2, FileText, Undo2, Calendar, UserCheck, Stethoscope, ClipboardCheck } from 'lucide-react';
import LocationMapModal from '@/components/location-map-modal';
import ReturnKitModal from '@/components/ReturnKitModal';

interface KitOrder {
    id: number;
    status: string;
    phone: string;
    delivery_location_address?: string;
    delivery_address?: string;
    delivery_latitude?: number;
    delivery_longitude?: number;
    return_location_address?: string;
    return_address?: string;
    return_latitude?: number;
    return_longitude?: number;
    return_date?: string;
    return_notes?: string;
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

interface ProductOrderItem {
    product_id: number;
    product_name: string;
    price: number;
    quantity: number;
    subtotal: number;
}

interface ProductOrder {
    id: number;
    customer_name: string;
    customer_email: string;
    customer_phone: string;
    delivery_address: string;
    total_amount: number;
    items: ProductOrderItem[];
    status: string;
    payment_status: string;
    created_at: string;
}

interface StatusPageProps {
    kitOrders: KitOrder[];
    consultationRequests: ConsultationRequest[];
    productOrders: ProductOrder[];
    filters: {
        show_cancelled: boolean;
    };
}

const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
        case 'in_review':
        case 'confirmed':
        case 'pending':
            return <Clock className="h-5 w-5 text-amber-600" />;
        case 'shipping':
        case 'processing':
        case 'shipped':
        case 'in_progress':
            return <Truck className="h-5 w-5 text-amber-700" />;
        case 'out_for_delivery':
            return <Truck className="h-5 w-5 text-amber-700" />;
        case 'accepted':
            return <CheckCircle className="h-5 w-5 text-red-700" />;
        case 'returning':
            return <Package className="h-5 w-5 text-amber-700" />;
        case 'received':
        case 'completed':
        case 'delivered':
            return <CheckCircle className="h-5 w-5 text-red-700" />;
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
            return 'bg-amber-50 text-amber-800 border-amber-200';
        case 'shipping':
        case 'processing':
        case 'shipped':
        case 'in_progress':
            return 'bg-amber-50 text-amber-800 border-amber-200';
        case 'out_for_delivery':
            return 'bg-amber-50 text-amber-800 border-amber-200';
        case 'accepted':
            return 'bg-red-50 text-red-700 border-red-200';
        case 'returning':
            return 'bg-amber-50 text-amber-700 border-amber-200';
        case 'received':
        case 'completed':
        case 'delivered':
            return 'bg-red-50 text-red-700 border-red-200';
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

const getTimelineStatusDetails = (status: string) => {
    const statusLower = status.toLowerCase();
    switch (statusLower) {
        case 'in_review':
            return {
                icon: <FileText className="h-4 w-4" />,
                color: 'text-amber-700',
                bgColor: 'bg-amber-100',
                borderColor: 'border-amber-200',
                description: 'Order submitted for review'
            };
        case 'confirmed':
        case 'accepted':
            return {
                icon: <CheckCircle className="h-4 w-4" />,
                color: 'text-red-700',
                bgColor: 'bg-red-50',
                borderColor: 'border-red-200',
                description: 'Order confirmed and accepted'
            };
        case 'shipping':
        case 'processing':
            return {
                icon: <Package className="h-4 w-4" />,
                color: 'text-amber-700',
                bgColor: 'bg-amber-100',
                borderColor: 'border-amber-200',
                description: 'Kit being prepared for shipment'
            };
        case 'shipped':
        case 'out_for_delivery':
            return {
                icon: <Truck className="h-4 w-4" />,
                color: 'text-amber-700',
                bgColor: 'bg-amber-100',
                borderColor: 'border-amber-200',
                description: 'Kit is on its way to you'
            };
        case 'delivered':
            return {
                icon: <MapPin className="h-4 w-4" />,
                color: 'text-amber-700',
                bgColor: 'bg-amber-100',
                borderColor: 'border-amber-200',
                description: 'Kit delivered successfully'
            };
        case 'returning':
            return {
                icon: <Undo2 className="h-4 w-4" />,
                color: 'text-amber-700',
                bgColor: 'bg-amber-50',
                borderColor: 'border-amber-200',
                description: 'Kit being returned for processing'
            };
        case 'received':
            return {
                icon: <CheckCircle className="h-4 w-4" />,
                color: 'text-red-700',
                bgColor: 'bg-red-50',
                borderColor: 'border-red-200',
                description: 'Kit received and being processed'
            };
        case 'completed':
            return {
                icon: <CheckCircle className="h-4 w-4" />,
                color: 'text-red-700',
                bgColor: 'bg-red-50',
                borderColor: 'border-red-200',
                description: 'Process completed successfully'
            };
        case 'cancelled':
            return {
                icon: <XCircle className="h-4 w-4" />,
                color: 'text-red-600',
                bgColor: 'bg-red-100',
                borderColor: 'border-red-200',
                description: 'Order was cancelled'
            };
        default:
            return {
                icon: <Clock className="h-4 w-4" />,
                color: 'text-gray-600',
                bgColor: 'bg-gray-100',
                borderColor: 'border-gray-200',
                description: formatStatusDisplay(status)
            };
    }
};

const getConsultationTimelineStatusDetails = (status: string) => {
    const statusLower = status.toLowerCase();
    switch (statusLower) {
        case 'pending':
        case 'in_review':
            return {
                icon: <Clock className="h-4 w-4" />,
                color: 'text-amber-700',
                bgColor: 'bg-amber-100',
                borderColor: 'border-amber-200',
                description: 'Consultation request submitted'
            };
        case 'confirmed':
        case 'accepted':
            return {
                icon: <Calendar className="h-4 w-4" />,
                color: 'text-red-700',
                bgColor: 'bg-red-50',
                borderColor: 'border-red-200',
                description: 'Consultation confirmed'
            };
        case 'assigned':
            return {
                icon: <UserCheck className="h-4 w-4" />,
                color: 'text-red-700',
                bgColor: 'bg-red-50',
                borderColor: 'border-red-200',
                description: 'Doctor assigned to consultation'
            };
        case 'in_progress':
            return {
                icon: <Stethoscope className="h-4 w-4" />,
                color: 'text-amber-700',
                bgColor: 'bg-amber-100',
                borderColor: 'border-amber-200',
                description: 'Consultation in progress'
            };
        case 'finished':
        case 'completed':
            return {
                icon: <ClipboardCheck className="h-4 w-4" />,
                color: 'text-red-700',
                bgColor: 'bg-red-50',
                borderColor: 'border-red-200',
                description: 'Consultation completed successfully'
            };
        case 'cancelled':
        case 'rejected':
            return {
                icon: <XCircle className="h-4 w-4" />,
                color: 'text-red-600',
                bgColor: 'bg-red-100',
                borderColor: 'border-red-200',
                description: 'Consultation was cancelled'
            };
        default:
            return {
                icon: <MessageCircle className="h-4 w-4" />,
                color: 'text-gray-600',
                bgColor: 'bg-gray-100',
                borderColor: 'border-gray-200',
                description: formatStatusDisplay(status)
            };
    }
};

export default function MyOrders({ kitOrders = [], consultationRequests = [], productOrders = [], filters }: StatusPageProps) {
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState<{
        latitude: number;
        longitude: number;
        locationAddress: string;
        deliveryAddress?: string;
        orderType: 'kit' | 'consultation';
        orderId: number;
    } | null>(null);
    const [returnModalOpen, setReturnModalOpen] = useState(false);
    const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);

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
            <section className="bg-gradient-to-br from-red-50 to-amber-50 py-20">
                <div className="max-w-screen mx-auto px-8">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                            My Orders & Requests
                        </h1>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Track the status of your Pro Plan orders and consultation requests
                        </p>
                    </div>

                    {/* Desktop/Tablet: 3 columns grid, Mobile: Horizontal scroll */}
                    <div className="hidden md:grid md:grid-cols-3 gap-6 xl:gap-8">
                        {/* Desktop 3-column layout */}
                        {/* Pro Plan Orders */}
                        <div className="bg-white rounded-2xl shadow-xl p-8">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
                                    <Package className="h-5 w-5 text-red-700" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900">Pro Plan Orders</h2>
                            </div>

                            <div className="mb-6">
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
                                        className="rounded border-gray-300 text-red-700 focus:ring-red-500"
                                    />
                                    Show cancelled orders
                                </label>
                            </div>

                            {kitOrders.length === 0 ? (
                                <div className="text-center py-8">
                                    <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                                    <p className="text-gray-500 mb-4">No testing kit orders yet</p>
                                    <a 
                                        href="/request/kit"
                                        className="inline-block bg-red-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-800 transition-colors"
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
                                                        Pro Plan Order #{order.id}
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
                                            
                                            {/* Show Return Location for Returning status, otherwise show Delivery Location */}
                                            {order.status === 'returning' || order.status === 'received' ? (
                                                /* Return Location Section */
                                                <>
                                                    {(order.return_location_address || order.return_address) && (
                                                        <div className="text-sm text-gray-600 mb-2">
                                                            <span className="font-medium">Return Address:</span>
                                                            {order.return_latitude && order.return_longitude ? (
                                                                <button
                                                                    onClick={() => openLocationModal(
                                                                        order.return_latitude!,
                                                                        order.return_longitude!,
                                                                        order.return_location_address || order.return_address || '',
                                                                        order.return_address,
                                                                        'kit',
                                                                        order.id
                                                                    )}
                                                                    className="ml-2 text-amber-700 hover:text-amber-800 transition-colors inline-flex items-center gap-1 cursor-pointer font-medium"
                                                                >
                                                                    {order.return_address || order.return_location_address}
                                                                    <MapPin className="h-3 w-3" />
                                                                </button>
                                                            ) : (
                                                                <span className="ml-2 text-amber-700 font-medium">
                                                                    {order.return_address || order.return_location_address}
                                                                </span>
                                                            )}
                                                        </div>
                                                    )}

                                                    {order.return_date && (
                                                        <div className="text-sm text-gray-600 mb-2">
                                                            <span className="font-medium">Return Date & Time:</span>
                                                            <span className="ml-2 text-amber-700 font-medium">
                                                                {new Date(order.return_date).toLocaleDateString()} at {new Date(order.return_date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                                            </span>
                                                        </div>
                                                    )}

                                                    {order.return_notes && (
                                                        <div className="text-sm text-gray-600 mb-2">
                                                            <span className="font-medium">Return Notes:</span>
                                                            <span className="ml-2 text-gray-700">{order.return_notes}</span>
                                                        </div>
                                                    )}
                                                </>
                                            ) : (
                                                /* Delivery Location Section */
                                                order.delivery_location_address && (
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
                                                                className="ml-2 text-red-700 hover:text-red-800 transition-colors inline-flex items-center gap-1 cursor-pointer"
                                                            >
                                                                {order.delivery_location_address}
                                                                <MapPin className="h-3 w-3" />
                                                            </button>
                                                        ) : (
                                                            <span className="ml-2">{order.delivery_location_address}</span>
                                                        )}
                                                    </div>
                                                )
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
                                                            setSelectedOrderId(order.id);
                                                            setReturnModalOpen(true);
                                                        }}
                                                        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-800 bg-amber-100 hover:bg-amber-50 rounded-lg transition-colors"
                                                    >
                                                        <Package className="h-4 w-4" />
                                                        Set Return Location & Date
                                                    </button>
                                                </div>
                                            )}

                                            {order.status === 'received' && (
                                                <div className="mt-3 pt-3 border-t border-gray-100">
                                                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <CheckCircle className="h-5 w-5 text-red-700" />
                                                            <span className="font-medium text-red-700">Kit Successfully Received</span>
                                                        </div>
                                                        <p className="text-sm text-red-700">
                                                            Your testing kit has been received and is being processed. We will send your test results via email within the next few business days.
                                                        </p>
                                                    </div>
                                                </div>
                                            )}

                                            {order.timeline && Object.keys(order.timeline).length > 0 && (
                                                <div className="mt-3 pt-3 border-t border-gray-100">
                                                    <div className="text-sm font-medium text-gray-800 mb-4 flex items-center gap-2">
                                                        <Clock className="h-4 w-4 text-gray-600" />
                                                        Order Timeline
                                                    </div>
                                                    <div className="relative">
                                                        {Object.entries(order.timeline)
                                                            .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
                                                            .map(([timestamp, status], index, array) => {
                                                                const statusDetails = getTimelineStatusDetails(status);
                                                                const isLast = index === array.length - 1;
                                                                
                                                                return (
                                                                    <div key={timestamp} className="relative flex items-start gap-3 pb-4">
                                                                        {/* Timeline line */}
                                                                        {!isLast && (
                                                                            <div className="absolute left-5 top-10 bottom-0 w-0.5 bg-gray-200"></div>
                                                                        )}
                                                                        
                                                                        {/* Status icon */}
                                                                        <div className={`relative flex items-center justify-center w-10 h-10 rounded-full border-2 ${statusDetails.borderColor} ${statusDetails.bgColor} ${statusDetails.color}`}>
                                                                            {statusDetails.icon}
                                                                        </div>
                                                                        
                                                                        {/* Status content */}
                                                                        <div className="flex-1 min-w-0">
                                                                            <div className="flex items-center justify-between">
                                                                                <div>
                                                                                    <p className="text-sm font-medium text-gray-900">
                                                                                        {formatStatusDisplay(status)}
                                                                                    </p>
                                                                                    <p className="text-xs text-gray-500 mt-1">
                                                                                        {statusDetails.description}
                                                                                    </p>
                                                                                </div>
                                                                                <div className="text-xs text-gray-400 ml-4 text-right">
                                                                                    <div>{new Date(timestamp).toLocaleDateString()}</div>
                                                                                    <div>{new Date(timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                );
                                                            })
                                                        }
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
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100">
                                    <MessageCircle className="h-5 w-5 text-amber-700" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900">Medical Consultations</h2>
                            </div>

                            {consultationRequests.length === 0 ? (
                                <div className="text-center py-8">
                                    <MessageCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                                    <p className="text-gray-500 mb-4">No consultation requests yet</p>
                                    <a 
                                        href="/request/consultation"
                                        className="inline-block bg-amber-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-amber-800 transition-colors"
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
                                                    <div className="text-xs font-medium text-gray-700 mb-3">
                                                        Consultation Timeline
                                                    </div>
                                                    <div className="space-y-2">
                                                        {Object.entries(request.timeline)
                                                            .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
                                                            .map(([timestamp, status], index, array) => {
                                                                const statusDetails = getConsultationTimelineStatusDetails(status);
                                                                const isLast = index === array.length - 1;
                                                                return (
                                                                    <div key={timestamp} className="flex items-start gap-3 relative">
                                                                        {/* Timeline line */}
                                                                        {!isLast && (
                                                                            <div className="absolute left-2 top-6 w-0.5 h-6 bg-gray-200"></div>
                                                                        )}
                                                                        
                                                                        {/* Status icon */}
                                                                        <div className={`flex-shrink-0 w-4 h-4 rounded-full border-2 flex items-center justify-center ${statusDetails.bgColor} ${statusDetails.borderColor} ${statusDetails.color}`}>
                                                                            {statusDetails.icon}
                                                                        </div>
                                                                        
                                                                        {/* Status content */}
                                                                        <div className="flex-1 min-w-0">
                                                                            <div className="flex items-center justify-between">
                                                                                <p className={`text-xs font-medium ${statusDetails.color}`}>
                                                                                    {formatStatusDisplay(status)}
                                                                                </p>
                                                                                <span className="text-xs text-gray-400">
                                                                                    {new Date(timestamp).toLocaleDateString()}
                                                                                </span>
                                                                            </div>
                                                                            <p className="text-xs text-gray-500 mt-0.5">
                                                                                {statusDetails.description}
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                );
                                                            })}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Healthcare Products */}
                        <div className="bg-white rounded-2xl shadow-xl p-8">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                                    <Package className="h-5 w-5 text-blue-700" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900">Healthcare Products</h2>
                            </div>

                            {productOrders.length === 0 ? (
                                <div className="text-center py-8">
                                    <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                                    <p className="text-gray-500 mb-4">No healthcare product orders yet</p>
                                    <a 
                                        href="/order-item"
                                        className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                                    >
                                        Browse Healthcare Products
                                    </a>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {productOrders.map((order) => (
                                        <div key={order.id} className="border border-gray-200 rounded-lg p-4">
                                            <div className="flex items-start justify-between mb-3">
                                                <div>
                                                    <div className="font-semibold text-gray-900">
                                                        Order #{order.id}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        Ordered: {new Date(order.created_at).toLocaleDateString()}
                                                    </div>
                                                </div>
                                                <div className="flex flex-col gap-1">
                                                    <div className={`flex items-center gap-2 px-3 py-1 rounded-full border text-sm font-medium ${getStatusColor(order.status)}`}>
                                                        {getStatusIcon(order.status)}
                                                        {formatStatusDisplay(order.status)}
                                                    </div>
                                                    <div className={`flex items-center gap-2 px-3 py-1 rounded-full border text-sm font-medium ${
                                                        order.payment_status === 'paid' 
                                                            ? 'bg-green-50 text-green-800 border-green-200'
                                                            : 'bg-yellow-50 text-yellow-800 border-yellow-200'
                                                    }`}>
                                                        {order.payment_status === 'paid' ? (
                                                            <CheckCircle className="h-4 w-4" />
                                                        ) : (
                                                            <Clock className="h-4 w-4" />
                                                        )}
                                                        Payment: {order.payment_status}
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <div className="mb-3">
                                                <div className="text-sm text-gray-600 mb-2">
                                                    <span className="font-medium">Customer:</span> {order.customer_name}
                                                </div>
                                                <div className="text-sm text-gray-600 mb-2">
                                                    <span className="font-medium">Email:</span> {order.customer_email}
                                                </div>
                                                <div className="text-sm text-gray-600 mb-2">
                                                    <span className="font-medium">Phone:</span> {order.customer_phone}
                                                </div>
                                                <div className="text-sm text-gray-600 mb-2">
                                                    <span className="font-medium">Delivery Address:</span>
                                                    <div className="ml-2 text-gray-700 bg-gray-50 p-2 rounded mt-1">
                                                        {order.delivery_address}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Order Items */}
                                            <div className="mb-3">
                                                <div className="font-medium text-gray-900 mb-2">Order Items:</div>
                                                <div className="space-y-2">
                                                    {order.items.map((item, index) => (
                                                        <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                                            <div className="flex-1">
                                                                <div className="text-sm font-medium text-gray-900">{item.product_name}</div>
                                                                <div className="text-xs text-gray-500">
                                                                    ₱{item.price.toFixed(2)} × {item.quantity}
                                                                </div>
                                                            </div>
                                                            <div className="text-sm font-semibold text-gray-900">
                                                                ₱{item.subtotal.toFixed(2)}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                                <div className="border-t border-gray-200 pt-2 mt-2">
                                                    <div className="flex justify-between items-center">
                                                        <span className="font-semibold text-gray-900">Total Amount:</span>
                                                        <span className="text-lg font-bold text-blue-600">₱{order.total_amount.toFixed(2)}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Mobile: Horizontal scroll */}
                    <div className="md:hidden">
                        <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                            {/* Pro Plan Orders - Mobile */}
                            <div className="flex-shrink-0 w-80 bg-white rounded-2xl shadow-xl p-6 snap-start">
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100">
                                        <Package className="h-4 w-4 text-red-700" />
                                    </div>
                                    <h2 className="text-lg font-bold text-gray-900">Pro Plan Orders</h2>
                                </div>

                                <div className="mb-4">
                                    <label className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer">
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
                                            className="rounded border-gray-300 text-red-700 focus:ring-red-500"
                                        />
                                        Show cancelled orders
                                    </label>
                                </div>

                                {kitOrders.length === 0 ? (
                                    <div className="text-center py-6">
                                        <Package className="h-8 w-8 text-gray-300 mx-auto mb-3" />
                                        <p className="text-sm text-gray-500 mb-3">No testing kit orders yet</p>
                                        <a 
                                            href="/request/kit"
                                            className="inline-block bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-800 transition-colors"
                                        >
                                            Order Your First Kit
                                        </a>
                                    </div>
                                ) : (
                                    <div className="space-y-3 max-h-96 overflow-y-auto">
                                        {kitOrders.map((order) => (
                                            <div key={order.id} className="border border-gray-200 rounded-lg p-3">
                                                <div className="flex items-start justify-between mb-2">
                                                    <div>
                                                        <div className="text-sm font-semibold text-gray-900">
                                                            Pro Plan Order #{order.id}
                                                        </div>
                                                        <div className="text-xs text-gray-500">
                                                            {new Date(order.created_at).toLocaleDateString()}
                                                        </div>
                                                    </div>
                                                    <div className={`flex items-center gap-1 px-2 py-1 rounded-full border text-xs font-medium ${getStatusColor(order.status)}`}>
                                                        {getStatusIcon(order.status)}
                                                        <span className="hidden sm:inline">{formatStatusDisplay(order.status)}</span>
                                                    </div>
                                                </div>
                                                <div className="text-xs text-gray-600">
                                                    <span className="font-medium">Contact:</span> {order.phone}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Medical Consultations - Mobile */}
                            <div className="flex-shrink-0 w-80 bg-white rounded-2xl shadow-xl p-6 snap-start">
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100">
                                        <MessageCircle className="h-4 w-4 text-amber-700" />
                                    </div>
                                    <h2 className="text-lg font-bold text-gray-900">Medical Consultations</h2>
                                </div>

                                {consultationRequests.length === 0 ? (
                                    <div className="text-center py-6">
                                        <MessageCircle className="h-8 w-8 text-gray-300 mx-auto mb-3" />
                                        <p className="text-sm text-gray-500 mb-3">No consultation requests yet</p>
                                        <a 
                                            href="/request/consultation"
                                            className="inline-block bg-amber-700 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-amber-800 transition-colors"
                                        >
                                            Book Your First Consultation
                                        </a>
                                    </div>
                                ) : (
                                    <div className="space-y-3 max-h-96 overflow-y-auto">
                                        {consultationRequests.map((request) => (
                                            <div key={request.id} className="border border-gray-200 rounded-lg p-3">
                                                <div className="flex items-start justify-between mb-2">
                                                    <div>
                                                        <div className="text-sm font-semibold text-gray-900">
                                                            Consultation #{request.id}
                                                        </div>
                                                        <div className="text-xs text-gray-500">
                                                            {new Date(request.created_at).toLocaleDateString()}
                                                        </div>
                                                    </div>
                                                    <div className={`flex items-center gap-1 px-2 py-1 rounded-full border text-xs font-medium ${getStatusColor(request.status)}`}>
                                                        {getStatusIcon(request.status)}
                                                        <span className="hidden sm:inline">{formatStatusDisplay(request.status)}</span>
                                                    </div>
                                                </div>
                                                
                                                <div className="space-y-1 text-xs text-gray-600">
                                                    <div><span className="font-medium">Type:</span> {request.consultation_type?.replace('_', ' ')}</div>
                                                    <div><span className="font-medium">Date:</span> {new Date(request.preferred_date).toLocaleDateString()}</div>
                                                    <div><span className="font-medium">Time:</span> {request.preferred_time}</div>
                                                    <div><span className="font-medium">Contact:</span> {request.phone}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Healthcare Products - Mobile */}
                            <div className="flex-shrink-0 w-80 bg-white rounded-2xl shadow-xl p-6 snap-start">
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                                        <Package className="h-4 w-4 text-blue-700" />
                                    </div>
                                    <h2 className="text-lg font-bold text-gray-900">Healthcare Products</h2>
                                </div>

                                {productOrders.length === 0 ? (
                                    <div className="text-center py-6">
                                        <Package className="h-8 w-8 text-gray-300 mx-auto mb-3" />
                                        <p className="text-sm text-gray-500 mb-3">No healthcare product orders yet</p>
                                        <a 
                                            href="/order-item"
                                            className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors"
                                        >
                                            Browse Products
                                        </a>
                                    </div>
                                ) : (
                                    <div className="space-y-3 max-h-96 overflow-y-auto">
                                        {productOrders.map((order) => (
                                            <div key={order.id} className="border border-gray-200 rounded-lg p-3">
                                                <div className="flex items-start justify-between mb-2">
                                                    <div>
                                                        <div className="text-sm font-semibold text-gray-900">
                                                            Order #{order.id}
                                                        </div>
                                                        <div className="text-xs text-gray-500">
                                                            {new Date(order.created_at).toLocaleDateString()}
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-col gap-1">
                                                        <div className={`flex items-center gap-1 px-2 py-1 rounded-full border text-xs font-medium ${getStatusColor(order.status)}`}>
                                                            {getStatusIcon(order.status)}
                                                        </div>
                                                        <div className={`flex items-center gap-1 px-2 py-1 rounded-full border text-xs font-medium ${
                                                            order.payment_status === 'paid' 
                                                                ? 'bg-green-50 text-green-800 border-green-200'
                                                                : 'bg-yellow-50 text-yellow-800 border-yellow-200'
                                                        }`}>
                                                            {order.payment_status === 'paid' ? (
                                                                <CheckCircle className="h-3 w-3" />
                                                            ) : (
                                                                <Clock className="h-3 w-3" />
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                                <div className="space-y-1 text-xs text-gray-600 mb-2">
                                                    <div><span className="font-medium">Customer:</span> {order.customer_name}</div>
                                                    <div><span className="font-medium">Total:</span> ₱{order.total_amount.toFixed(2)}</div>
                                                    <div><span className="font-medium">Items:</span> {order.items.length} item(s)</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                        
                        {/* Mobile scroll indicator */}
                        <div className="flex justify-center mt-2">
                            <div className="flex space-x-2">
                                <div className="w-2 h-2 rounded-full bg-red-500"></div>
                                <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="mt-12 text-center">
                        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl mx-auto">
                            <h3 className="text-xl font-bold text-gray-900 mb-4">Need Something Else?</h3>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <a 
                                    href="/request/kit"
                                    className="inline-block bg-red-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-800 transition-colors"
                                >
                                    Order New Pro Plan
                                </a>
                                <a 
                                    href="/request/consultation"
                                    className="inline-block bg-amber-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-amber-800 transition-colors"
                                >
                                    Book New Consultation
                                </a>
                                <a 
                                    href="/order-item"
                                    className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                                >
                                    Browse Healthcare Products
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-stone-800 text-white py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h3 className="text-xl font-bold mb-4">Kaupod</h3>
                        <p className="text-gray-400 mb-4">
                            Private, compassionate reproductive health care for everyone.
                        </p>
                        <p className="text-gray-400">&copy; 2025 Kaupod. All rights reserved.</p>
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

            {selectedOrderId && (
                <ReturnKitModal
                    isOpen={returnModalOpen}
                    onClose={() => {
                        setReturnModalOpen(false);
                        setSelectedOrderId(null);
                    }}
                    orderId={selectedOrderId}
                />
            )}
        </>
    );
}