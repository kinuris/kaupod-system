import { Head, Link, router } from '@inertiajs/react';
import { Search, Users, Eye, Edit, Trash2, UserCheck, UserX, Filter, LoaderCircle } from 'lucide-react';
import React, { useState, useEffect } from 'react';
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
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { type BreadcrumbItem } from '@/types';

interface Client {
    id: number;
    name: string;
    email: string;
    email_verified_at: string | null;
    created_at: string;
    total_kit_orders: number;
    total_consultations: number;
    last_activity: string | null;
    personal_info?: {
        phone?: string;
        address?: string;
        date_of_birth?: string;
        emergency_contact?: string;
    };
}

interface PageProps {
    clients: {
        data: Client[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        links: Array<{
            url: string | null;
            label: string;
            active: boolean;
        }>;
    };
    filters: {
        search?: string;
        status?: string;
    };
}

export default function ClientsIndex({ clients, filters }: PageProps) {
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || 'all');
    const [isSearching, setIsSearching] = useState(false);

    // Auto-search with debouncing
    useEffect(() => {
        // Don't search on initial load if filters match current state
        const initialSearch = filters.search || '';
        const initialStatus = filters.status || 'all';
        
        if (search === initialSearch && status === initialStatus) {
            return;
        }

        setIsSearching(true);
        const timeoutId = setTimeout(() => {
            const filterStatus = status === 'all' ? '' : status;
            router.get('/admin/clients', { search, status: filterStatus }, { 
                preserveState: true,
                replace: true, // Use replace to avoid cluttering browser history
                onFinish: () => setIsSearching(false)
            });
        }, 300); // 300ms delay for debouncing

        return () => {
            clearTimeout(timeoutId);
            setIsSearching(false);
        };
    }, [search, status, filters.search, filters.status]); // Trigger when search or status changes

    const handleFilterChange = (newStatus: string) => {
        setStatus(newStatus);
        // The useEffect will automatically trigger the search
    };

    const clearFilters = () => {
        setSearch('');
        setStatus('all');
        router.get('/admin/clients', {}, { preserveState: true });
    };

    const toggleClientStatus = (clientId: number) => {
        router.post(`/admin/clients/${clientId}/toggle-status`, {}, {
            preserveState: true,
            onSuccess: () => {
                // Success message will be handled by the backend
            },
        });
    };

    const deleteClient = (clientId: number) => {
        if (confirm('Are you sure you want to delete this client? This action cannot be undone.')) {
            router.delete(`/admin/clients/${clientId}`, {
                preserveState: true,
                onSuccess: () => {
                    // Success message will be handled by the backend
                },
            });
        }
    };

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Admin Dashboard', href: '/dashboard' },
        { title: 'Client Management', href: '/admin/clients' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Client Management - Admin" />
            
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/20">
                            <Users className="h-5 w-5 text-blue-700 dark:text-blue-400" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Client Management</h1>
                            <p className="text-sm text-gray-600 dark:text-neutral-400">
                                Manage and monitor all client accounts
                            </p>
                        </div>
                    </div>
                </div>

                {/* Search and Filters */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="relative">
                        {isSearching ? (
                            <LoaderCircle className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 animate-spin" />
                        ) : (
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        )}
                        <Input
                            type="text"
                            placeholder="Type to search clients..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-10 w-64"
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <Select value={status} onValueChange={handleFilterChange}>
                            <SelectTrigger className="w-40">
                                <Filter className="h-4 w-4 mr-2" />
                                <SelectValue placeholder="All Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="unverified">Unverified</SelectItem>
                            </SelectContent>
                        </Select>
                        
                        {(search || status) && (
                            <Button variant="outline" size="sm" onClick={clearFilters}>
                                Clear Filters
                            </Button>
                        )}
                    </div>
                </div>

                {/* Clients Table */}
                <div className="rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="border-b border-gray-200 dark:border-gray-700">
                                <tr className="bg-gray-50 dark:bg-gray-900/20">
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Client</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Email</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Activity</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Orders/Consultations</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Joined</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                {clients.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="text-center py-8">
                                            <div className="flex flex-col items-center gap-2">
                                                <Users className="h-8 w-8 text-gray-400" />
                                                <p className="text-gray-500 dark:text-gray-400">No clients found</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    clients.data.map((client) => (
                                        <tr key={client.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/20">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex flex-col">
                                                    <div className="font-medium text-gray-900 dark:text-white">
                                                        {client.name}
                                                    </div>
                                                    {client.personal_info?.phone && (
                                                        <div className="text-sm text-gray-500 dark:text-gray-400">
                                                            {client.personal_info.phone}
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900 dark:text-white">
                                                    {client.email}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span
                                                    className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                                                        client.email_verified_at
                                                            ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                                                            : "bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400"
                                                    }`}
                                                >
                                                    {client.email_verified_at ? 'Active' : 'Unverified'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                                    {client.last_activity
                                                        ? new Date(client.last_activity).toLocaleDateString()
                                                        : 'No activity'
                                                    }
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex gap-2 text-sm">
                                                    <span className="text-red-600 dark:text-red-400">
                                                        {client.total_kit_orders} kits
                                                    </span>
                                                    <span className="text-gray-400">•</span>
                                                    <span className="text-amber-600 dark:text-amber-400">
                                                        {client.total_consultations} consults
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                                    {new Date(client.created_at).toLocaleDateString()}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="sm">
                                                            ⋮
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem asChild>
                                                            <Link href={`/admin/clients/${client.id}`}>
                                                                <Eye className="h-4 w-4 mr-2" />
                                                                View Details
                                                            </Link>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem asChild>
                                                            <Link href={`/admin/clients/${client.id}/edit`}>
                                                                <Edit className="h-4 w-4 mr-2" />
                                                                Edit Client
                                                            </Link>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            onClick={() => toggleClientStatus(client.id)}
                                                        >
                                                            {client.email_verified_at ? (
                                                                <>
                                                                    <UserX className="h-4 w-4 mr-2" />
                                                                    Disable Account
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <UserCheck className="h-4 w-4 mr-2" />
                                                                    Enable Account
                                                                </>
                                                            )}
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            onClick={() => deleteClient(client.id)}
                                                            className="text-red-600 dark:text-red-400"
                                                        >
                                                            <Trash2 className="h-4 w-4 mr-2" />
                                                            Delete Client
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Pagination */}
                {clients.last_page > 1 && (
                    <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                            Showing {((clients.current_page - 1) * clients.per_page) + 1} to{' '}
                            {Math.min(clients.current_page * clients.per_page, clients.total)} of{' '}
                            {clients.total} clients
                        </div>
                        <div className="flex gap-2">
                            {clients.links.map((link, index) => (
                                <Button
                                    key={index}
                                    variant={link.active ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => link.url && router.get(link.url)}
                                    disabled={!link.url}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}