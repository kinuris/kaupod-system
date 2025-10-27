import { Head, router } from '@inertiajs/react';
import { ArrowLeft, Package, User, Phone, MapPin, CreditCard, Clock, FileText } from 'lucide-react';
import React, { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { type BreadcrumbItem } from '@/types';

interface User {
    id: number;
    name: string;
    email: string;
}

interface OrderItem {
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
    formatted_total: string;
    items: OrderItem[];
    status: string;
    payment_status: string;
    payment_method: string;
    notes?: string;
    user?: User;
    created_at: string;
    updated_at: string;
}

interface PageProps {
    order: ProductOrder;
}

export default function ProductOrderShow({ order }: PageProps) {
    const [status, setStatus] = useState(order.status);
    const [paymentStatus, setPaymentStatus] = useState(order.payment_status);
    const [isUpdating, setIsUpdating] = useState(false);

    const breadcrumbItems: BreadcrumbItem[] = [
        { title: 'Admin Dashboard', href: '/dashboard' },
        { title: 'Product Orders', href: '/admin/product-orders' },
        { title: `Order #${order.id}`, href: `/admin/product-orders/${order.id}` },
    ];

    const statuses = {
        pending: 'Pending',
        processing: 'Processing',
        shipped: 'Shipped',
        delivered: 'Delivered',
        cancelled: 'Cancelled'
    };

    const paymentStatuses = {
        pending: 'Pending',
        paid: 'Paid',
        failed: 'Failed',
        refunded: 'Refunded'
    };

    const handleStatusUpdate = () => {
        if (status === order.status && paymentStatus === order.payment_status) {
            return;
        }

        setIsUpdating(true);

        const promises = [];

        if (status !== order.status) {
            promises.push(
                router.patch(`/admin/product-orders/${order.id}/status`, {
                    status: status
                }, {
                    preserveState: true,
                    preserveScroll: true,
                })
            );
        }

        if (paymentStatus !== order.payment_status) {
            promises.push(
                router.patch(`/admin/product-orders/${order.id}/payment-status`, {
                    payment_status: paymentStatus
                }, {
                    preserveState: true,
                    preserveScroll: true,
                })
            );
        }

        Promise.all(promises).finally(() => {
            setIsUpdating(false);
        });
    };

    const getStatusBadge = (status: string) => {
        const statusStyles = {
            pending: 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-400',
            processing: 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400',
            shipped: 'bg-purple-100 dark:bg-purple-900/20 text-purple-800 dark:text-purple-400',
            delivered: 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400',
            cancelled: 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400',
        };

        return (
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusStyles[status as keyof typeof statusStyles] || statusStyles.pending}`}>
                {statuses[status as keyof typeof statuses] || status}
            </span>
        );
    };

    const getPaymentStatusBadge = (paymentStatus: string) => {
        const paymentStatusStyles = {
            pending: 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-400',
            paid: 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400',
            failed: 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400',
            refunded: 'bg-gray-100 dark:bg-gray-900/20 text-gray-800 dark:text-gray-400',
        };

        return (
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${paymentStatusStyles[paymentStatus as keyof typeof paymentStatusStyles] || paymentStatusStyles.pending}`}>
                {paymentStatuses[paymentStatus as keyof typeof paymentStatuses] || paymentStatus}
            </span>
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbItems}>
            <Head title={`Order #${order.id}`} />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => window.history.back()}
                        className="flex items-center gap-2"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back
                    </Button>
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
                            <Package className="h-5 w-5 text-red-700 dark:text-red-400" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Order #{order.id}</h1>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Placed on {new Date(order.created_at).toLocaleDateString()}
                            </p>
                        </div>
                    </div>
                    <div className="ml-auto flex items-center gap-2">
                        {getStatusBadge(order.status)}
                        {getPaymentStatusBadge(order.payment_status)}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Order Details */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Customer Information */}
                        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <User className="h-5 w-5 text-gray-400" />
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Customer Information</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
                                    <p className="mt-1 text-sm text-gray-900 dark:text-white">
                                        {order.user?.name || order.customer_name}
                                    </p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                                    <p className="mt-1 text-sm text-gray-900 dark:text-white">
                                        {order.user?.email || order.customer_email}
                                    </p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Phone</label>
                                    <p className="mt-1 text-sm text-gray-900 dark:text-white flex items-center gap-1">
                                        <Phone className="h-4 w-4 text-gray-400" />
                                        {order.customer_phone}
                                    </p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Payment Method</label>
                                    <p className="mt-1 text-sm text-gray-900 dark:text-white flex items-center gap-1">
                                        <CreditCard className="h-4 w-4 text-gray-400" />
                                        {order.payment_method?.toUpperCase() || 'N/A'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Delivery Address */}
                        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <MapPin className="h-5 w-5 text-gray-400" />
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Delivery Address</h3>
                            </div>
                            <p className="text-sm text-gray-900 dark:text-white">{order.delivery_address}</p>
                        </div>

                        {/* Order Items */}
                        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <Package className="h-5 w-5 text-gray-400" />
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Order Items</h3>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                    <thead>
                                        <tr>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                Product
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                Price
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                Quantity
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                Subtotal
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                        {order.items.map((item, index) => (
                                            <tr key={index}>
                                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                                    {item.product_name}
                                                </td>
                                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                                    ₱{Number(item.price).toFixed(2)}
                                                </td>
                                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                                    {item.quantity}
                                                </td>
                                                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                                    ₱{Number(item.subtotal).toFixed(2)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                                <div className="flex justify-between items-center text-lg font-semibold text-gray-900 dark:text-white">
                                    <span>Total:</span>
                                    <span>{order.formatted_total}</span>
                                </div>
                            </div>
                        </div>

                        {/* Notes */}
                        {order.notes && (
                            <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <FileText className="h-5 w-5 text-gray-400" />
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">Notes</h3>
                                </div>
                                <p className="text-sm text-gray-900 dark:text-white">{order.notes}</p>
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Status Management */}
                        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Update Status</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Order Status
                                    </label>
                                    <Select value={status} onValueChange={setStatus}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {Object.entries(statuses).map(([value, label]) => (
                                                <SelectItem key={value} value={value}>{label}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Payment Status
                                    </label>
                                    <Select value={paymentStatus} onValueChange={setPaymentStatus}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {Object.entries(paymentStatuses).map(([value, label]) => (
                                                <SelectItem key={value} value={value}>{label}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <Button 
                                    onClick={handleStatusUpdate}
                                    disabled={isUpdating || (status === order.status && paymentStatus === order.payment_status)}
                                    className="w-full bg-red-600 hover:bg-red-700 text-white"
                                >
                                    {isUpdating ? 'Updating...' : 'Update Status'}
                                </Button>
                            </div>
                        </div>

                        {/* Order Timeline */}
                        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <Clock className="h-5 w-5 text-gray-400" />
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Order Timeline</h3>
                            </div>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">Order Placed</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            {new Date(order.created_at).toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">Last Updated</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            {new Date(order.updated_at).toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}