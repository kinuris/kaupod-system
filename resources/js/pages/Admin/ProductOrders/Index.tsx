import { Head, Link, router } from '@inertiajs/react';
import { Search, Package, Eye, Filter, Calendar, User, CreditCard, ChevronUp, ChevronDown } from 'lucide-react';
import React, { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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

interface ProductOrder {
    id: number;
    user?: User;
    customer_name: string;
    customer_email: string;
    customer_phone: string;
    delivery_address: string;
    total_amount: number;
    formatted_total: string;
    items: Array<{
        product_id: number;
        product_name: string;
        price: number;
        quantity: number;
        subtotal: number;
    }>;
    items_count: number;
    total_quantity: number;
    status: string;
    payment_status: string;
    payment_method: string;
    created_at: string;
    updated_at: string;
}

interface PaginatedOrders {
    data: ProductOrder[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
}

interface PageProps {
    orders: PaginatedOrders;
    statuses: Record<string, string>;
    paymentStatuses: Record<string, string>;
    filters: {
        status: string;
        payment_status: string;
        date_from?: string;
        date_to?: string;
        search?: string;
        sort: string;
        direction: string;
    };
}

export default function ProductOrdersIndex({ orders, statuses, paymentStatuses, filters }: PageProps) {
    const [search, setSearch] = useState(filters.search || '');
    const [statusFilter, setStatusFilter] = useState(filters.status);
    const [paymentStatusFilter, setPaymentStatusFilter] = useState(filters.payment_status);
    const [dateFrom, setDateFrom] = useState(filters.date_from || '');
    const [dateTo, setDateTo] = useState(filters.date_to || '');

    const breadcrumbItems: BreadcrumbItem[] = [
        { title: 'Admin Dashboard', href: '/dashboard' },
        { title: 'Product Orders', href: '/admin/product-orders' },
    ];

    const handleSearch = () => {
        const params = new URLSearchParams();
        if (search) params.append('search', search);
        if (statusFilter !== 'all') params.append('status', statusFilter);
        if (paymentStatusFilter !== 'all') params.append('payment_status', paymentStatusFilter);
        if (dateFrom) params.append('date_from', dateFrom);
        if (dateTo) params.append('date_to', dateTo);
        
        router.get(`/admin/product-orders?${params.toString()}`);
    };

    const handleSort = (field: string) => {
        const direction = filters.sort === field && filters.direction === 'asc' ? 'desc' : 'asc';
        const params = new URLSearchParams(window.location.search);
        params.set('sort', field);
        params.set('direction', direction);
        router.get(`/admin/product-orders?${params.toString()}`);
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
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusStyles[status as keyof typeof statusStyles] || statusStyles.pending}`}>
                {statuses[status] || status}
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
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${paymentStatusStyles[paymentStatus as keyof typeof paymentStatusStyles] || paymentStatusStyles.pending}`}>
                {paymentStatuses[paymentStatus] || paymentStatus}
            </span>
        );
    };

    const getSortIcon = (field: string) => {
        if (filters.sort !== field) return null;
        return filters.direction === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />;
    };

    return (
        <AppLayout breadcrumbs={breadcrumbItems}>
            <Head title="Product Orders - Admin" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
                            <Package className="h-5 w-5 text-red-700 dark:text-red-400" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Product Orders</h1>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Manage all health store product orders
                            </p>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <Input
                            type="text"
                            placeholder="Search orders..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                    
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger>
                            <Filter className="h-4 w-4 mr-2" />
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Statuses</SelectItem>
                            {Object.entries(statuses).map(([value, label]) => (
                                <SelectItem key={value} value={value}>{label}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select value={paymentStatusFilter} onValueChange={setPaymentStatusFilter}>
                        <SelectTrigger>
                            <CreditCard className="h-4 w-4 mr-2" />
                            <SelectValue placeholder="Payment" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Payments</SelectItem>
                            {Object.entries(paymentStatuses).map(([value, label]) => (
                                <SelectItem key={value} value={value}>{label}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Input
                        type="date"
                        placeholder="From date"
                        value={dateFrom}
                        onChange={(e) => setDateFrom(e.target.value)}
                    />

                    <Input
                        type="date"
                        placeholder="To date"
                        value={dateTo}
                        onChange={(e) => setDateTo(e.target.value)}
                    />

                    <Button onClick={handleSearch} className="bg-red-600 hover:bg-red-700 text-white">
                        Filter
                    </Button>
                </div>

                {/* Orders Table */}
                <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 dark:ring-gray-700 md:rounded-lg">
                    <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-900/20">
                            <tr>
                                <th 
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
                                    onClick={() => handleSort('id')}
                                >
                                    <div className="flex items-center gap-1">
                                        Order ID
                                        {getSortIcon('id')}
                                    </div>
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                                    Customer
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                                    Items
                                </th>
                                <th 
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
                                    onClick={() => handleSort('total_amount')}
                                >
                                    <div className="flex items-center gap-1">
                                        Total
                                        {getSortIcon('total_amount')}
                                    </div>
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                                    Payment
                                </th>
                                <th 
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
                                    onClick={() => handleSort('created_at')}
                                >
                                    <div className="flex items-center gap-1">
                                        Date
                                        {getSortIcon('created_at')}
                                    </div>
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            {orders.data.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                                        <Package className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500 mb-4" />
                                        <h3 className="text-lg font-medium mb-2">No orders found</h3>
                                        <p>No product orders match your current filters.</p>
                                    </td>
                                </tr>
                            ) : (
                                orders.data.map((order) => (
                                    <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/40">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex flex-col">
                                                <div className="text-sm font-medium text-gray-900 dark:text-white">#{order.id}</div>
                                                <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                                                    <Calendar className="h-3 w-3" />
                                                    {new Date(order.created_at).toLocaleDateString()}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
                                                    <User className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                                                </div>
                                                <div className="ml-3">
                                                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                        {order.user?.name || order.customer_name}
                                                    </div>
                                                    <div className="text-xs text-gray-500 dark:text-gray-400">
                                                        {order.user?.email || order.customer_email}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900 dark:text-white">
                                                {order.items_count} item{order.items_count !== 1 ? 's' : ''}
                                            </div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400">
                                                {order.total_quantity} unit{order.total_quantity !== 1 ? 's' : ''}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                            {order.formatted_total}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {getStatusBadge(order.status)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {getPaymentStatusBadge(order.payment_status)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                            {new Date(order.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                            <Link
                                                href={`/admin/product-orders/${order.id}`}
                                                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/40"
                                            >
                                                <Eye className="h-3 w-3 mr-1" />
                                                View
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {orders.last_page > 1 && (
                    <div className="flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 sm:px-6">
                        <div className="flex-1 flex justify-between sm:hidden">
                            <Link
                                href={orders.current_page > 1 ? `/admin/product-orders?page=${orders.current_page - 1}` : '#'}
                                className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${orders.current_page > 1 ? 'text-gray-700 bg-white hover:bg-gray-50' : 'text-gray-400 bg-gray-100 cursor-not-allowed'}`}
                            >
                                Previous
                            </Link>
                            <Link
                                href={orders.current_page < orders.last_page ? `/admin/product-orders?page=${orders.current_page + 1}` : '#'}
                                className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${orders.current_page < orders.last_page ? 'text-gray-700 bg-white hover:bg-gray-50' : 'text-gray-400 bg-gray-100 cursor-not-allowed'}`}
                            >
                                Next
                            </Link>
                        </div>
                        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                            <div>
                                <p className="text-sm text-gray-700 dark:text-gray-300">
                                    Showing <span className="font-medium">{orders.from}</span> to{' '}
                                    <span className="font-medium">{orders.to}</span> of{' '}
                                    <span className="font-medium">{orders.total}</span> results
                                </p>
                            </div>
                            <div>
                                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                    {Array.from({ length: orders.last_page }, (_, i) => i + 1).map((page) => (
                                        <Link
                                            key={page}
                                            href={`/admin/product-orders?page=${page}`}
                                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                                page === orders.current_page
                                                    ? 'z-10 bg-red-50 border-red-500 text-red-600'
                                                    : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                            }`}
                                        >
                                            {page}
                                        </Link>
                                    ))}
                                </nav>
                            </div>
                        </div>
                    </div>
                )}

                {/* Summary */}
                <div className="text-sm text-gray-700 dark:text-gray-300">
                    Showing {orders.data.length} of {orders.total} orders
                </div>
            </div>
        </AppLayout>
    );
}