import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, User, Mail, Phone, MapPin, Calendar, Package, MessageCircle, Edit } from 'lucide-react';
import React from 'react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { type BreadcrumbItem } from '@/types';

interface Client {
    id: number;
    name: string;
    email: string;
    email_verified_at: string | null;
    created_at: string;
    personal_info?: {
        phone?: string;
        address?: string;
        date_of_birth?: string;
        emergency_contact?: string;
    };
    kit_orders: Array<{
        id: number;
        status: string;
        created_at: string;
        price: string;
    }>;
    consultation_requests: Array<{
        id: number;
        status: string;
        created_at: string;
        consultation_type: string;
        consultation_mode: string;
    }>;
}

interface PageProps {
    client: Client;
}

export default function ClientShow({ client }: PageProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Admin Dashboard', href: '/dashboard' },
        { title: 'Client Management', href: '/admin/clients' },
        { title: client.name, href: `/admin/clients/${client.id}` },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${client.name} - Client Details`} />
            
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link 
                            href="/admin/clients"
                            className="flex h-9 w-9 items-center justify-center rounded-md border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                        >
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                        <div className="flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/20">
                                <User className="h-6 w-6 text-blue-700 dark:text-blue-400" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{client.name}</h1>
                                <p className="text-sm text-gray-600 dark:text-neutral-400">
                                    Client since {new Date(client.created_at).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    </div>
                    <Button asChild>
                        <Link href={`/admin/clients/${client.id}/edit`}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Client
                        </Link>
                    </Button>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    {/* Client Information */}
                    <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Client Information</h2>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <Mail className="h-5 w-5 text-gray-400" />
                                <div>
                                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Email</p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">{client.email}</p>
                                </div>
                            </div>
                            
                            {client.personal_info?.phone && (
                                <div className="flex items-center gap-3">
                                    <Phone className="h-5 w-5 text-gray-400" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Phone</p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">{client.personal_info.phone}</p>
                                    </div>
                                </div>
                            )}

                            {client.personal_info?.address && (
                                <div className="flex items-center gap-3">
                                    <MapPin className="h-5 w-5 text-gray-400" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Address</p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">{client.personal_info.address}</p>
                                    </div>
                                </div>
                            )}

                            {client.personal_info?.date_of_birth && (
                                <div className="flex items-center gap-3">
                                    <Calendar className="h-5 w-5 text-gray-400" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Date of Birth</p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            {new Date(client.personal_info.date_of_birth).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            )}

                            <div className="flex items-center gap-3">
                                <div className="h-5 w-5 flex items-center justify-center">
                                    <div className={`h-3 w-3 rounded-full ${client.email_verified_at ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Account Status</p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        {client.email_verified_at ? 'Active' : 'Unverified'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Activity Summary */}
                    <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Activity Summary</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="text-center p-4 rounded-lg bg-red-50 dark:bg-red-900/20">
                                <Package className="h-8 w-8 text-red-600 dark:text-red-400 mx-auto mb-2" />
                                <p className="text-2xl font-bold text-red-600 dark:text-red-400">{client.kit_orders.length}</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Kit Orders</p>
                            </div>
                            <div className="text-center p-4 rounded-lg bg-amber-50 dark:bg-amber-900/20">
                                <MessageCircle className="h-8 w-8 text-amber-600 dark:text-amber-400 mx-auto mb-2" />
                                <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">{client.consultation_requests.length}</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Consultations</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Kit Orders History */}
                <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Kit Orders History</h2>
                    {client.kit_orders.length === 0 ? (
                        <p className="text-gray-500 dark:text-gray-400 text-center py-4">No kit orders found</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="border-b border-gray-200 dark:border-gray-700">
                                    <tr>
                                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Order ID</th>
                                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Status</th>
                                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Price</th>
                                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Date</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                    {client.kit_orders.map((order) => (
                                        <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/20">
                                            <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">#{order.id}</td>
                                            <td className="px-4 py-3">
                                                <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">${order.price}</td>
                                            <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                                                {new Date(order.created_at).toLocaleDateString()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Consultation Requests History */}
                <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Consultation Requests History</h2>
                    {client.consultation_requests.length === 0 ? (
                        <p className="text-gray-500 dark:text-gray-400 text-center py-4">No consultation requests found</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="border-b border-gray-200 dark:border-gray-700">
                                    <tr>
                                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Request ID</th>
                                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Type</th>
                                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Mode</th>
                                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Status</th>
                                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Date</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                    {client.consultation_requests.map((consultation) => (
                                        <tr key={consultation.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/20">
                                            <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">#{consultation.id}</td>
                                            <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{consultation.consultation_type}</td>
                                            <td className="px-4 py-3 text-sm text-gray-900 dark:text-white capitalize">{consultation.consultation_mode}</td>
                                            <td className="px-4 py-3">
                                                <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                                                    {consultation.status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                                                {new Date(consultation.created_at).toLocaleDateString()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}