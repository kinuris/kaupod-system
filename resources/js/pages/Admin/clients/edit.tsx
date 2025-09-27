import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save } from 'lucide-react';
import React from 'react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { type BreadcrumbItem } from '@/types';
import InputError from '@/components/input-error';

interface Client {
    id: number;
    name: string;
    email: string;
    personal_info?: {
        phone?: string;
        address?: string;
        date_of_birth?: string;
        emergency_contact?: string;
    };
}

interface PageProps {
    client: Client;
}

export default function ClientEdit({ client }: PageProps) {
    const { data, setData, patch, processing, errors } = useForm({
        name: client.name || '',
        email: client.email || '',
        personal_info: {
            phone: client.personal_info?.phone || '',
            address: client.personal_info?.address || '',
            date_of_birth: client.personal_info?.date_of_birth || '',
            emergency_contact: client.personal_info?.emergency_contact || '',
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        patch(`/admin/clients/${client.id}`);
    };

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Admin Dashboard', href: '/dashboard' },
        { title: 'Client Management', href: '/admin/clients' },
        { title: client.name, href: `/admin/clients/${client.id}` },
        { title: 'Edit', href: `/admin/clients/${client.id}/edit` },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit ${client.name} - Client Management`} />
            
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-4">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Link 
                        href={`/admin/clients/${client.id}`}
                        className="flex h-9 w-9 items-center justify-center rounded-md border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Edit Client</h1>
                        <p className="text-sm text-gray-600 dark:text-neutral-400">
                            Update client information and personal details
                        </p>
                    </div>
                </div>

                {/* Edit Form */}
                <div className="max-w-2xl">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Basic Information</h2>
                            
                            <div className="grid gap-4 md:grid-cols-2">
                                <div>
                                    <Label htmlFor="name">Full Name</Label>
                                    <Input
                                        id="name"
                                        type="text"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.name} />
                                </div>

                                <div>
                                    <Label htmlFor="email">Email Address</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.email} />
                                </div>
                            </div>
                        </div>

                        <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Personal Information</h2>
                            
                            <div className="grid gap-4 md:grid-cols-2">
                                <div>
                                    <Label htmlFor="phone">Phone Number</Label>
                                    <Input
                                        id="phone"
                                        type="tel"
                                        value={data.personal_info.phone}
                                        onChange={(e) => setData('personal_info', {
                                            ...data.personal_info,
                                            phone: e.target.value
                                        })}
                                    />
                                    <InputError message={errors['personal_info.phone']} />
                                </div>

                                <div>
                                    <Label htmlFor="date_of_birth">Date of Birth</Label>
                                    <Input
                                        id="date_of_birth"
                                        type="date"
                                        value={data.personal_info.date_of_birth}
                                        onChange={(e) => setData('personal_info', {
                                            ...data.personal_info,
                                            date_of_birth: e.target.value
                                        })}
                                    />
                                    <InputError message={errors['personal_info.date_of_birth']} />
                                </div>

                                <div className="md:col-span-2">
                                    <Label htmlFor="address">Address</Label>
                                    <Input
                                        id="address"
                                        type="text"
                                        value={data.personal_info.address}
                                        onChange={(e) => setData('personal_info', {
                                            ...data.personal_info,
                                            address: e.target.value
                                        })}
                                    />
                                    <InputError message={errors['personal_info.address']} />
                                </div>

                                <div className="md:col-span-2">
                                    <Label htmlFor="emergency_contact">Emergency Contact</Label>
                                    <Input
                                        id="emergency_contact"
                                        type="text"
                                        value={data.personal_info.emergency_contact}
                                        onChange={(e) => setData('personal_info', {
                                            ...data.personal_info,
                                            emergency_contact: e.target.value
                                        })}
                                        placeholder="Name and phone number"
                                    />
                                    <InputError message={errors['personal_info.emergency_contact']} />
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-3">
                            <Button type="submit" disabled={processing}>
                                <Save className="h-4 w-4 mr-2" />
                                {processing ? 'Saving...' : 'Save Changes'}
                            </Button>
                            <Button type="button" variant="outline" asChild>
                                <Link href={`/admin/clients/${client.id}`}>
                                    Cancel
                                </Link>
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}