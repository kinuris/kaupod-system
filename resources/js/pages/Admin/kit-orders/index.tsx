import React, { useState } from 'react';
import { router, Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Package, User, Phone, MapPin, Calendar, Clock, Search, Filter, X, ChevronDown, ChevronUp, ChevronsUpDown, Mail, CheckCircle, AlertCircle } from 'lucide-react';

interface User {
  id: number;
  name: string;
  email: string;
}

interface Order { 
  id: number; 
  status: string; 
  price: string; 
  user_id: number;
  user: User;
  phone: string;
  delivery_address?: string;
  delivery_location_address?: string;
  return_location_address?: string;
  return_address?: string;
  return_date?: string;
  return_notes?: string;
  result_email_sent: boolean;
  result_email_sent_at?: string;
  result_email_notes?: string;
  created_at: string;
  timeline?: Record<string, string>;
}

interface Paginated<T> { 
  data: T[]; 
  links: Array<{
    url: string | null;
    label: string;
    active: boolean;
  }>;
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

interface PageProps { 
  orders: Paginated<Order>; 
  statuses: string[]; 
  filters: {
    status: string;
    date_from?: string;
    date_to?: string;
    search?: string;
    sort: string;
    direction: string;
  };
}

const getStatusIcon = (status: string) => {
  switch (status.toLowerCase()) {
    case 'in_review':
      return <Clock className="h-4 w-4 text-yellow-500" />;
    case 'shipping':
      return <Package className="h-4 w-4 text-blue-500" />;
    case 'out_for_delivery':
      return <Package className="h-4 w-4 text-purple-500" />;
    case 'accepted':
      return <Package className="h-4 w-4 text-green-400" />;
    case 'returning':
      return <Package className="h-4 w-4 text-orange-500" />;
    case 'received':
      return <Package className="h-4 w-4 text-green-500" />;
    case 'cancelled':
      return <Package className="h-4 w-4 text-red-500" />;
    default:
      return <Package className="h-4 w-4 text-gray-500" />;
  }
};

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'in_review':
      return 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-400 border-yellow-200 dark:border-yellow-700';
    case 'shipping':
      return 'bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400 border-blue-200 dark:border-blue-700';
    case 'out_for_delivery':
      return 'bg-purple-50 dark:bg-purple-900/20 text-purple-800 dark:text-purple-400 border-purple-200 dark:border-purple-700';
    case 'accepted':
      return 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-400 border-green-200 dark:border-green-700';
    case 'returning':
      return 'bg-orange-50 dark:bg-orange-900/20 text-orange-800 dark:text-orange-400 border-orange-200 dark:border-orange-700';
    case 'received':
      return 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-400 border-green-200 dark:border-green-700';
    case 'cancelled':
      return 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-400 border-red-200 dark:border-red-700';
    default:
      return 'bg-neutral-50 dark:bg-neutral-800/40 text-neutral-800 dark:text-neutral-300 border-neutral-200 dark:border-neutral-700';
  }
};

const formatStatusDisplay = (status: string) => {
  return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
};

const getValidNextStatuses = (currentStatus: string): string[] => {
  // Admin-specific status transitions
  switch (currentStatus.toLowerCase()) {
    case 'in_review':
      return ['shipping', 'cancelled'];
    case 'shipping':
      return ['out_for_delivery'];
    case 'out_for_delivery':
      return ['accepted'];
    case 'accepted':
      return []; // Admin cannot move from Accepted - client must initiate return
    case 'returning':
      return ['received'];
    case 'received':
      return [];
    case 'cancelled':
      return [];
    default:
      return [];
  }
};

export default function KitOrdersIndex({ orders, statuses, filters }: PageProps) {
  const [updatingId, setUpdatingId] = useState<number|null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const handleFilter = (key: string, value: string) => {
    const params = new URLSearchParams(window.location.search);
    if (value && value !== 'all') {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete('page'); // Reset to first page when filtering
    router.get(`/admin/kit-orders?${params.toString()}`, {}, { preserveState: true });
  };

  const handleSort = (field: string) => {
    const params = new URLSearchParams(window.location.search);
    const currentSort = params.get('sort');
    const currentDirection = params.get('direction');
    
    if (currentSort === field) {
      // Toggle direction
      params.set('direction', currentDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // New field, default to desc
      params.set('sort', field);
      params.set('direction', 'desc');
    }
    
    router.get(`/admin/kit-orders?${params.toString()}`, {}, { preserveState: true });
  };

  const clearFilters = () => {
    router.get('/admin/kit-orders', {}, { preserveState: true });
  };

  const updateStatus = (id: number, status: string) => {
    setUpdatingId(id);
    router.patch(`/admin/kit-orders/${id}/status`, { status }, { 
      onFinish: () => setUpdatingId(null),
      onSuccess: () => {
        // Success message will be handled by the backend
      },
      onError: (errors) => {
        console.error('Error updating status:', errors);
      }
    });
  };

  const markEmailSent = (id: number, notes?: string) => {
    setUpdatingId(id);
    router.patch(`/admin/kit-orders/${id}/mark-email-sent`, { 
      result_email_notes: notes 
    }, { 
      onFinish: () => setUpdatingId(null),
      onSuccess: () => {
        // Success message will be handled by the backend
      },
      onError: (errors) => {
        console.error('Error marking email as sent:', errors);
      }
    });
  };

  const unmarkEmailSent = (id: number) => {
    setUpdatingId(id);
    router.patch(`/admin/kit-orders/${id}/unmark-email-sent`, {}, { 
      onFinish: () => setUpdatingId(null),
      onSuccess: () => {
        // Success message will be handled by the backend
      },
      onError: (errors) => {
        console.error('Error unmarking email:', errors);
      }
    });
  };

  const breadcrumbs = [
    { title: 'Admin Dashboard', href: '/dashboard' },
    { title: 'Kit Orders', href: '/admin/kit-orders' },
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Kit Orders - Admin" />
      
      <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-pink-100 dark:bg-pink-900/20">
              <Package className="h-5 w-5 text-pink-600 dark:text-pink-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Testing Kit Orders</h1>
              <p className="text-sm text-gray-600 dark:text-neutral-400">Manage and track all kit order requests</p>
            </div>
          </div>
          <div className="text-sm text-gray-500 dark:text-neutral-400">
            {orders.total} total orders
          </div>
        </div>

        {/* Filters */}
        <div className="rounded-xl border border-sidebar-border/70 dark:border-sidebar-border bg-white dark:bg-neutral-900/50 p-4">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Filters</h3>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-3 py-1.5 text-sm rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700"
              >
                <Filter className="h-4 w-4" />
                {showFilters ? 'Hide' : 'Show'} Filters
              </button>
            </div>
            
            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Status Filter */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Status</label>
                  <select
                    value={filters.status}
                    onChange={(e) => handleFilter('status', e.target.value)}
                    className="w-full text-sm border border-neutral-300 dark:border-neutral-600 rounded-md px-3 py-2 bg-white dark:bg-neutral-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                  >
                    <option value="all">All Statuses</option>
                    {statuses.map(status => (
                      <option key={status} value={status}>
                        {formatStatusDisplay(status)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Date From */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">From Date</label>
                  <input
                    type="date"
                    value={filters.date_from || ''}
                    onChange={(e) => handleFilter('date_from', e.target.value)}
                    className="w-full text-sm border border-neutral-300 dark:border-neutral-600 rounded-md px-3 py-2 bg-white dark:bg-neutral-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                  />
                </div>

                {/* Date To */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">To Date</label>
                  <input
                    type="date"
                    value={filters.date_to || ''}
                    onChange={(e) => handleFilter('date_to', e.target.value)}
                    className="w-full text-sm border border-neutral-300 dark:border-neutral-600 rounded-md px-3 py-2 bg-white dark:bg-neutral-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                  />
                </div>

                {/* Search */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Search</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
                    <input
                      type="text"
                      placeholder="Customer name, email, or phone"
                      value={filters.search || ''}
                      onChange={(e) => handleFilter('search', e.target.value)}
                      className="w-full pl-10 text-sm border border-neutral-300 dark:border-neutral-600 rounded-md px-3 py-2 bg-white dark:bg-neutral-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Active Filters & Clear */}
            {(filters.status !== 'all' || filters.date_from || filters.date_to || filters.search) && (
              <div className="flex items-center gap-2 pt-2 border-t border-neutral-200 dark:border-neutral-700">
                <span className="text-sm text-neutral-600 dark:text-neutral-400">Active filters:</span>
                {filters.status !== 'all' && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-pink-100 dark:bg-pink-900/20 text-pink-800 dark:text-pink-400 text-xs">
                    Status: {formatStatusDisplay(filters.status)}
                    <button onClick={() => handleFilter('status', 'all')} className="hover:text-pink-600">
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}
                {filters.date_from && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-pink-100 dark:bg-pink-900/20 text-pink-800 dark:text-pink-400 text-xs">
                    From: {filters.date_from}
                    <button onClick={() => handleFilter('date_from', '')} className="hover:text-pink-600">
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}
                {filters.date_to && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-pink-100 dark:bg-pink-900/20 text-pink-800 dark:text-pink-400 text-xs">
                    To: {filters.date_to}
                    <button onClick={() => handleFilter('date_to', '')} className="hover:text-pink-600">
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}
                {filters.search && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-pink-100 dark:bg-pink-900/20 text-pink-800 dark:text-pink-400 text-xs">
                    Search: {filters.search}
                    <button onClick={() => handleFilter('search', '')} className="hover:text-pink-600">
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}
                <button
                  onClick={clearFilters}
                  className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 underline"
                >
                  Clear all
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="relative flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border bg-white dark:bg-neutral-900/50 p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-neutral-50 dark:bg-neutral-800/40 border-b border-neutral-200 dark:border-neutral-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                    <button 
                      onClick={() => handleSort('id')}
                      className="flex items-center gap-1 hover:text-neutral-700 dark:hover:text-neutral-200"
                    >
                      Order
                      {filters.sort === 'id' ? (
                        filters.direction === 'desc' ? <ChevronDown className="h-3 w-3" /> : <ChevronUp className="h-3 w-3" />
                      ) : (
                        <ChevronsUpDown className="h-3 w-3 opacity-50" />
                      )}
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                    <button 
                      onClick={() => handleSort('name')}
                      className="flex items-center gap-1 hover:text-neutral-700 dark:hover:text-neutral-200"
                    >
                      Customer
                      {filters.sort === 'name' ? (
                        filters.direction === 'desc' ? <ChevronDown className="h-3 w-3" /> : <ChevronUp className="h-3 w-3" />
                      ) : (
                        <ChevronsUpDown className="h-3 w-3 opacity-50" />
                      )}
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                    <button 
                      onClick={() => handleSort('price')}
                      className="flex items-center gap-1 hover:text-neutral-700 dark:hover:text-neutral-200"
                    >
                      Price
                      {filters.sort === 'price' ? (
                        filters.direction === 'desc' ? <ChevronDown className="h-3 w-3" /> : <ChevronUp className="h-3 w-3" />
                      ) : (
                        <ChevronsUpDown className="h-3 w-3 opacity-50" />
                      )}
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                    <button 
                      onClick={() => handleSort('status')}
                      className="flex items-center gap-1 hover:text-neutral-700 dark:hover:text-neutral-200"
                    >
                      Status
                      {filters.sort === 'status' ? (
                        filters.direction === 'desc' ? <ChevronDown className="h-3 w-3" /> : <ChevronUp className="h-3 w-3" />
                      ) : (
                        <ChevronsUpDown className="h-3 w-3 opacity-50" />
                      )}
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Email Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Update Status</th>
                </tr>
              </thead>
              <tbody className="bg-transparent divide-y divide-neutral-200 dark:divide-neutral-700">
                {orders.data.map(order => (
                  <tr key={order.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/40">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">#{order.id}</div>
                        <div className="text-xs text-neutral-500 dark:text-neutral-400 flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(order.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-800">
                          <User className="h-4 w-4 text-neutral-600 dark:text-neutral-400" />
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">{order.user.name}</div>
                          <div className="text-xs text-neutral-500 dark:text-neutral-400">{order.user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col space-y-1">
                        <div className="text-xs text-neutral-600 dark:text-neutral-400 flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {order.phone}
                        </div>
                        {order.delivery_location_address && (
                          <div className="text-xs text-neutral-500 dark:text-neutral-400 flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            <span className="truncate max-w-32" title={order.delivery_location_address}>
                              {order.delivery_location_address}
                            </span>
                          </div>
                        )}
                        {(order.status === 'returning' || order.status === 'received') && order.return_location_address && (
                          <div className="text-xs text-orange-600 dark:text-orange-400 flex items-center gap-1 pt-1 border-t">
                            <MapPin className="h-3 w-3" />
                            <span className="truncate max-w-32" title={`Return: ${order.return_location_address}`}>
                              Return: {order.return_location_address}
                            </span>
                          </div>
                        )}
                        {(order.status === 'returning' || order.status === 'received') && order.return_date && (
                          <div className="text-xs text-orange-600 dark:text-orange-400 flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(order.return_date).toLocaleDateString()} {new Date(order.return_date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">₱{order.price}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-medium ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        {formatStatusDisplay(order.status)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {order.status === 'received' ? (
                        <div className="flex flex-col gap-2">
                          {order.result_email_sent ? (
                            <div className="flex items-center gap-2">
                              <div className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                                <CheckCircle className="h-4 w-4" />
                                Email Sent
                              </div>
                              {order.result_email_sent_at && (
                                <div className="text-xs text-neutral-500 dark:text-neutral-400">
                                  {new Date(order.result_email_sent_at).toLocaleDateString()}
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="flex items-center gap-1 text-xs text-red-600 dark:text-red-400">
                              <AlertCircle className="h-4 w-4" />
                              Email Pending
                            </div>
                          )}
                          {updatingId !== order.id && (
                            <div className="flex gap-1">
                              {!order.result_email_sent ? (
                                <button
                                  onClick={() => markEmailSent(order.id)}
                                  className="text-xs px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                                >
                                  Mark Sent
                                </button>
                              ) : (
                                <button
                                  onClick={() => unmarkEmailSent(order.id)}
                                  className="text-xs px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                                >
                                  Reset
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="text-xs text-neutral-400 dark:text-neutral-500">
                          N/A
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {order.status === 'accepted' ? (
                        <div className="flex items-center gap-2 text-xs text-orange-600 dark:text-orange-400 font-medium">
                          <Clock className="h-4 w-4" />
                          Waiting for Kit Return from Client
                        </div>
                      ) : (
                        <>
                          <select 
                            disabled={updatingId === order.id} 
                            value={order.status} 
                            onChange={e => updateStatus(order.id, e.target.value)} 
                            className="text-xs border border-neutral-300 dark:border-neutral-600 rounded-md px-2 py-1 bg-white dark:bg-neutral-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 disabled:bg-neutral-50 dark:disabled:bg-neutral-700 disabled:cursor-not-allowed"
                          >
                            {/* Current status (always shown) */}
                            <option key={order.status} value={order.status}>
                              {formatStatusDisplay(order.status)} (Current)
                            </option>
                            {/* Valid next statuses */}
                            {getValidNextStatuses(order.status).map(status => (
                              <option key={status} value={status}>
                                {formatStatusDisplay(status)}
                              </option>
                            ))}
                          </select>
                          {updatingId === order.id && (
                            <div className="ml-2 inline-block">
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-pink-600"></div>
                            </div>
                          )}
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {orders.data.length === 0 && (
            <div className="text-center py-12">
              <Package className="h-12 w-12 text-neutral-300 dark:text-neutral-600 mx-auto mb-4" />
              <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">No kit orders yet</h3>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">Kit orders will appear here once customers start placing requests.</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {orders.last_page > 1 && (
          <div className="flex items-center justify-between">
            <div className="text-sm text-neutral-700 dark:text-neutral-300">
              Showing {((orders.current_page - 1) * orders.per_page) + 1} to {Math.min(orders.current_page * orders.per_page, orders.total)} of {orders.total} results
            </div>
            <div className="flex items-center space-x-2">
              {orders.links.map((link, index) => (
                <div key={index}>
                  {link.url ? (
                    <Link
                      href={link.url}
                      className={`px-3 py-2 text-sm border rounded-md ${
                        link.active
                          ? 'bg-pink-600 text-white border-pink-600'
                          : 'bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border-neutral-300 dark:border-neutral-600 hover:bg-neutral-50 dark:hover:bg-neutral-700'
                      }`}
                      dangerouslySetInnerHTML={{ __html: link.label }}
                    />
                  ) : (
                    <span
                      className="px-3 py-2 text-sm text-neutral-400 dark:text-neutral-500 border border-neutral-300 dark:border-neutral-600 rounded-md cursor-not-allowed"
                      dangerouslySetInnerHTML={{ __html: link.label }}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
