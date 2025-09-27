import React, { useState } from 'react';
import { router, Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { MessageCircle, User, Phone, Calendar, Clock, Search, Filter, X, ChevronDown, ChevronUp, ChevronsUpDown, Mail, MapPin } from 'lucide-react';

interface User {
  id: number;
  name: string;
  email: string;
}

interface ConsultationRequest { 
  id: number; 
  status: string; 
  user_id: number;
  user: User;
  phone: string;
  preferred_date: string;
  preferred_time: string;
  consultation_type: string;
  consultation_mode: string;
  reason: string;
  medical_history?: string;
  consultation_location_address?: string;
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
  requests: Paginated<ConsultationRequest>; 
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
      return <Clock className="h-4 w-4 text-amber-600" />;
    case 'coordinating':
      return <MessageCircle className="h-4 w-4 text-amber-600" />;
    case 'confirmed':
      return <Calendar className="h-4 w-4 text-red-700" />;
    case 'completed':
      return <MessageCircle className="h-4 w-4 text-red-700" />;
    case 'cancelled':
      return <X className="h-4 w-4 text-red-500" />;
    default:
      return <MessageCircle className="h-4 w-4 text-gray-500" />;
  }
};

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'in_review':
      return 'bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-400 border-amber-200 dark:border-amber-700';
    case 'coordinating':
      return 'bg-amber-50 dark:bg-stone-900/20 text-amber-800 dark:text-stone-400 border-amber-200 dark:border-stone-700';
    case 'confirmed':
      return 'bg-red-50 dark:bg-red-50/20 text-red-700 dark:text-red-700 border-red-200 dark:border-red-200';
    case 'completed':
      return 'bg-red-50 dark:bg-red-50/20 text-red-700 dark:text-red-700 border-red-200 dark:border-red-200';
    case 'cancelled':
      return 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-400 border-red-200 dark:border-red-700';
    default:
      return 'bg-neutral-50 dark:bg-neutral-800/40 text-neutral-800 dark:text-neutral-300 border-neutral-200 dark:border-neutral-700';
  }
};

const formatStatusDisplay = (status: string) => {
  return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
};

const formatConsultationType = (type: string) => {
  return type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
};

export default function ConsultationRequestsIndex({ requests, statuses, filters }: PageProps) {
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
    router.get(`/admin/consultation-requests?${params.toString()}`, {}, { preserveState: true });
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
    
    router.get(`/admin/consultation-requests?${params.toString()}`, {}, { preserveState: true });
  };

  const clearFilters = () => {
    router.get('/admin/consultation-requests', {}, { preserveState: true });
  };

  const updateStatus = (id: number, status: string) => {
    setUpdatingId(id);
    router.patch(`/admin/consultation-requests/${id}/status`, { status }, { 
      onFinish: () => setUpdatingId(null),
      onSuccess: () => {
        // Success message will be handled by the backend
      },
      onError: (errors) => {
        console.error('Error updating status:', errors);
      }
    });
  };

  const breadcrumbs = [
    { title: 'Admin Dashboard', href: '/dashboard' },
    { title: 'Consultation Requests', href: '/admin/consultation-requests' },
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Consultation Requests - Admin" />
      
      <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
              <MessageCircle className="h-5 w-5 text-red-700 dark:text-red-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Expert Consultation Requests</h1>
              <p className="text-sm text-gray-600 dark:text-neutral-400">Manage and coordinate consultation requests</p>
            </div>
          </div>
          <div className="text-sm text-gray-500 dark:text-neutral-400">
            {requests.total} total requests
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
                    className="w-full text-sm border border-neutral-300 dark:border-neutral-600 rounded-md px-3 py-2 bg-white dark:bg-neutral-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
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
                    className="w-full text-sm border border-neutral-300 dark:border-neutral-600 rounded-md px-3 py-2 bg-white dark:bg-neutral-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                </div>

                {/* Date To */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">To Date</label>
                  <input
                    type="date"
                    value={filters.date_to || ''}
                    onChange={(e) => handleFilter('date_to', e.target.value)}
                    className="w-full text-sm border border-neutral-300 dark:border-neutral-600 rounded-md px-3 py-2 bg-white dark:bg-neutral-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
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
                      className="w-full pl-10 text-sm border border-neutral-300 dark:border-neutral-600 rounded-md px-3 py-2 bg-white dark:bg-neutral-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
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
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400 text-xs">
                    Status: {formatStatusDisplay(filters.status)}
                    <button onClick={() => handleFilter('status', 'all')} className="hover:text-red-700">
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}
                {filters.date_from && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400 text-xs">
                    From: {filters.date_from}
                    <button onClick={() => handleFilter('date_from', '')} className="hover:text-red-700">
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}
                {filters.date_to && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400 text-xs">
                    To: {filters.date_to}
                    <button onClick={() => handleFilter('date_to', '')} className="hover:text-red-700">
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}
                {filters.search && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400 text-xs">
                    Search: {filters.search}
                    <button onClick={() => handleFilter('search', '')} className="hover:text-red-700">
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
                      Request
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Consultation Details</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Contact</th>
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Update Status</th>
                </tr>
              </thead>
              <tbody className="bg-transparent divide-y divide-neutral-200 dark:divide-neutral-700">
                {requests.data.map(request => (
                  <tr key={request.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/40">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">#{request.id}</div>
                        <div className="text-xs text-neutral-500 dark:text-neutral-400 flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(request.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-800">
                          <User className="h-4 w-4 text-neutral-600 dark:text-neutral-400" />
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">{request.user.name}</div>
                          <div className="text-xs text-neutral-500 dark:text-neutral-400 flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {request.user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col space-y-1">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {formatConsultationType(request.consultation_type)}
                        </div>
                        <div className="text-xs text-neutral-600 dark:text-neutral-400 flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(request.preferred_date).toLocaleDateString()} at {request.preferred_time}
                        </div>
                        <div className="text-xs text-red-700 dark:text-red-700 capitalize">
                          {request.consultation_mode} consultation
                        </div>
                        {request.consultation_location_address && (
                          <div className="text-xs text-neutral-500 dark:text-neutral-400 flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            <span className="truncate max-w-32" title={request.consultation_location_address}>
                              {request.consultation_location_address}
                            </span>
                          </div>
                        )}
                        {request.reason && (
                          <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 max-w-64">
                            <span className="font-medium">Reason:</span> {request.reason.length > 50 ? `${request.reason.substring(0, 50)}...` : request.reason}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col space-y-1">
                        <div className="text-xs text-neutral-600 dark:text-neutral-400 flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {request.phone}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-medium ${getStatusColor(request.status)}`}>
                        {getStatusIcon(request.status)}
                        {formatStatusDisplay(request.status)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select 
                        disabled={updatingId === request.id} 
                        value={request.status} 
                        onChange={e => updateStatus(request.id, e.target.value)} 
                        className="text-xs border border-neutral-300 dark:border-neutral-600 rounded-md px-2 py-1 bg-white dark:bg-neutral-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 disabled:bg-neutral-50 dark:disabled:bg-neutral-700 disabled:cursor-not-allowed"
                      >
                        {statuses.map(status => (
                          <option key={status} value={status}>
                            {formatStatusDisplay(status)}
                          </option>
                        ))}
                      </select>
                      {updatingId === request.id && (
                        <div className="ml-2 inline-block">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-700"></div>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {requests.data.length === 0 && (
            <div className="text-center py-12">
              <MessageCircle className="h-12 w-12 text-neutral-300 dark:text-neutral-600 mx-auto mb-4" />
              <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">No consultation requests yet</h3>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">Consultation requests will appear here once customers start requesting consultations.</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {requests.last_page > 1 && (
          <div className="flex items-center justify-between">
            <div className="text-sm text-neutral-700 dark:text-neutral-300">
              Showing {((requests.current_page - 1) * requests.per_page) + 1} to {Math.min(requests.current_page * requests.per_page, requests.total)} of {requests.total} results
            </div>
            <div className="flex items-center space-x-2">
              {requests.links.map((link, index) => (
                <div key={index}>
                  {link.url ? (
                    <Link
                      href={link.url}
                      className={`px-3 py-2 text-sm border rounded-md ${
                        link.active
                          ? 'bg-red-700 text-white border-red-700'
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
