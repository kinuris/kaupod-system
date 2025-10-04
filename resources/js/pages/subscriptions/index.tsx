import React from 'react';
import { Head, Link } from '@inertiajs/react';
import ClientNavigation from '@/components/client-navigation';
import { Button } from '@/components/ui/button';
import { Package, Calendar, CheckCircle, XCircle, Clock } from 'lucide-react';

interface Subscription {
    id: number;
    tier: string;
    price: number;
    kits_allowed: number;
    kits_used: number;
    expires_at: string | null;
    status: string;
    created_at: string;
    kit_orders?: KitOrder[];
}

interface KitOrder {
    id: number;
    status: string;
    created_at: string;
    price: number;
}

interface SubscriptionOption {
    tier: string;
    name: string;
    description: string;
    price: number;
    kits_allowed: number;
    annual: boolean;
}

interface SubscriptionsIndexProps {
    subscriptions: Subscription[];
    activeSubscription: Subscription | null;
    subscriptionOptions: Record<string, SubscriptionOption>;
}

export default function SubscriptionsIndex({ 
    subscriptions, 
    activeSubscription, 
    subscriptionOptions 
}: SubscriptionsIndexProps) {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active':
                return 'text-green-700 bg-green-50 border-green-200';
            case 'expired':
                return 'text-amber-700 bg-amber-50 border-amber-200';
            case 'cancelled':
                return 'text-red-700 bg-red-50 border-red-200';
            default:
                return 'text-gray-700 bg-gray-50 border-gray-200';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'active':
                return <CheckCircle className="h-4 w-4" />;
            case 'expired':
                return <Clock className="h-4 w-4" />;
            case 'cancelled':
                return <XCircle className="h-4 w-4" />;
            default:
                return <Package className="h-4 w-4" />;
        }
    };

    const getTierDisplayName = (tier: string) => {
        return subscriptionOptions[tier]?.name || tier.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
    };

    return (
        <>
            <Head title="My Subscriptions - Kaupod" />
            
            <ClientNavigation />

            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">My Subscriptions</h1>
                                <p className="text-gray-600 mt-2">Manage your kit subscriptions and view usage</p>
                            </div>
                            {!activeSubscription && (
                                <Link href="/subscriptions/create">
                                    <Button className="bg-red-700 hover:bg-red-800">
                                        <Package className="h-4 w-4 mr-2" />
                                        New Subscription
                                    </Button>
                                </Link>
                            )}
                        </div>
                    </div>

                    {/* Active Subscription Card */}
                    {activeSubscription && (
                        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 mb-6">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-semibold text-gray-900">Active Subscription</h2>
                                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(activeSubscription.status)}`}>
                                    {getStatusIcon(activeSubscription.status)}
                                    {activeSubscription.status.charAt(0).toUpperCase() + activeSubscription.status.slice(1)}
                                </div>
                            </div>
                            
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <h3 className="font-medium text-gray-900 mb-2">{getTierDisplayName(activeSubscription.tier)}</h3>
                                    <div className="space-y-2 text-sm text-gray-600">
                                        <div className="flex justify-between">
                                            <span>Price paid:</span>
                                            <span className="font-medium">₱{activeSubscription.price.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Kits included:</span>
                                            <span className="font-medium">{activeSubscription.kits_allowed}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Kits used:</span>
                                            <span className="font-medium">{activeSubscription.kits_used}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Kits remaining:</span>
                                            <span className="font-medium text-green-600">{activeSubscription.kits_allowed - activeSubscription.kits_used}</span>
                                        </div>
                                        {activeSubscription.expires_at && (
                                            <div className="flex justify-between">
                                                <span>Expires:</span>
                                                <span className="font-medium">{new Date(activeSubscription.expires_at).toLocaleDateString()}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                
                                <div className="flex flex-col justify-center">
                                    {(activeSubscription.kits_allowed - activeSubscription.kits_used) > 0 ? (
                                        <div className="text-center">
                                            <Link href="/request/kit">
                                                <Button className="w-full bg-red-700 hover:bg-red-800 mb-3">
                                                    <Package className="h-4 w-4 mr-2" />
                                                    Order Kit (Free)
                                                </Button>
                                            </Link>
                                            <p className="text-xs text-gray-500">Use your subscription to order a kit at no extra cost</p>
                                        </div>
                                    ) : (
                                        <div className="text-center">
                                            <div className="bg-gray-100 text-gray-500 rounded px-4 py-2 mb-3">
                                                All kits used
                                            </div>
                                            <Link href="/subscriptions/create">
                                                <Button variant="outline" className="w-full">
                                                    Renew Subscription
                                                </Button>
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* No Active Subscription */}
                    {!activeSubscription && subscriptions.length === 0 && (
                        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-8 text-center">
                            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No subscriptions yet</h3>
                            <p className="text-gray-600 mb-6">Get started with a subscription to save money on kit orders</p>
                            <Link href="/subscriptions/create">
                                <Button className="bg-red-700 hover:bg-red-800">
                                    <Package className="h-4 w-4 mr-2" />
                                    Create Your First Subscription
                                </Button>
                            </Link>
                        </div>
                    )}

                    {/* Subscription History */}
                    {subscriptions.length > 0 && (
                        <div className="bg-white rounded-lg shadow-md border border-gray-200">
                            <div className="px-6 py-4 border-b border-gray-200">
                                <h2 className="text-xl font-semibold text-gray-900">Subscription History</h2>
                            </div>
                            
                            <div className="divide-y divide-gray-200">
                                {subscriptions.map((subscription) => (
                                    <div key={subscription.id} className="p-6 hover:bg-gray-50">
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center gap-3">
                                                <h3 className="font-medium text-gray-900">{getTierDisplayName(subscription.tier)}</h3>
                                                <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(subscription.status)}`}>
                                                    {getStatusIcon(subscription.status)}
                                                    {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
                                                </div>
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                <Calendar className="h-4 w-4 inline mr-1" />
                                                {new Date(subscription.created_at).toLocaleDateString()}
                                            </div>
                                        </div>
                                        
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                                            <div>
                                                <span className="text-gray-500">Price:</span>
                                                <div className="font-medium text-gray-400">₱{subscription.price.toFixed(2)}</div>
                                            </div>
                                            <div>
                                                <span className="text-gray-500">Usage:</span>
                                                <div className="font-medium text-gray-400">{subscription.kits_used}/{subscription.kits_allowed} kits</div>
                                            </div>
                                            {subscription.expires_at && (
                                                <div>
                                                    <span className="text-gray-500">Expires:</span>
                                                    <div className="font-medium text-gray-400">{new Date(subscription.expires_at).toLocaleDateString()}</div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}