import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import React from 'react';

type Order = { id:number; status:string; user_id?:number; created_at?:string };
type Consultation = { id:number; status:string; user_id?:number; created_at?:string };
interface PageProps { kitOrders?: Order[]; consultationRequests?: Consultation[]; }

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

export default function Dashboard(props: PageProps) {
    const { kitOrders = [], consultationRequests = [] } = props;
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                    </div>
                    <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                    </div>
                    <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                    </div>
                </div>
                <div className="relative flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border p-6 space-y-6">
                    <h2 className="text-xl font-semibold">Service Tracker</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <h3 className="font-medium">Privacy Kit Orders</h3>
                                <Link href="/admin/kit-orders" className="text-xs text-red-700 hover:underline">Manage All</Link>
                            </div>
                            {kitOrders.length === 0 && <p className="text-xs text-neutral-500">No kit orders yet.</p>}
                            <ul className="space-y-2">
                                {kitOrders.map(o => (
                                    <li key={o.id} className="text-xs flex justify-between items-center bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200 dark:border-neutral-700 rounded px-2 py-1">
                                        <div className="flex flex-col">
                                            <span>Order #{o.id}</span>
                                            {o.user_id && <span className="text-neutral-400">User #{o.user_id}</span>}
                                        </div>
                                        <div className="flex flex-col items-end">
                                            <span className="font-mono bg-neutral-200/60 dark:bg-neutral-700/60 px-2 py-0.5 rounded">{o.status}</span>
                                            {o.created_at && <span className="text-neutral-400 mt-1">{new Date(o.created_at).toLocaleDateString()}</span>}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <h3 className="font-medium">Consultation Requests</h3>
                                <Link href="/admin/consultation-requests" className="text-xs text-amber-700 hover:underline">Manage All</Link>
                            </div>
                            {consultationRequests.length === 0 && <p className="text-xs text-neutral-500">No consultation requests yet.</p>}
                            <ul className="space-y-2">
                                {consultationRequests.map(c => (
                                    <li key={c.id} className="text-xs flex justify-between items-center bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200 dark:border-neutral-700 rounded px-2 py-1">
                                        <div className="flex flex-col">
                                            <span>Request #{c.id}</span>
                                            {c.user_id && <span className="text-neutral-400">User #{c.user_id}</span>}
                                        </div>
                                        <div className="flex flex-col items-end">
                                            <span className="font-mono bg-neutral-200/60 dark:bg-neutral-700/60 px-2 py-0.5 rounded">{c.status}</span>
                                            {c.created_at && <span className="text-neutral-400 mt-1">{new Date(c.created_at).toLocaleDateString()}</span>}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
