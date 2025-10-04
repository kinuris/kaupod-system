import React, { useState } from 'react';
import InputError from '@/components/input-error';
import ClientNavigation from '@/components/client-navigation';
import DeliveryLocationMap from '@/components/delivery-location-map';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Form, Head } from '@inertiajs/react';
import { LoaderCircle, Package, MapPin } from 'lucide-react';

interface DeliveryLocation {
    lat: number;
    lng: number;
    address?: string;
}

interface OngoingKitOrder {
    id: number;
    status: string;
    created_at: string;
}

interface SubscriptionOption {
    tier: string;
    name: string;
    description: string;
    price: number;
    kits_allowed: number;
    annual: boolean;
}

interface ActiveSubscription {
    id: number;
    tier: string;
    kits_allowed: number;
    kits_used: number;
    expires_at: string | null;
    status: string;
}

interface KitRequestProps {
    hasOngoingKitOrder: boolean;
    ongoingKitOrder?: OngoingKitOrder;
    subscriptionOptions: Record<string, SubscriptionOption>;
    activeSubscription?: ActiveSubscription;
    hasActiveSubscription: boolean;
}

export default function KitRequest({ 
    hasOngoingKitOrder = false, 
    ongoingKitOrder, 
    subscriptionOptions, 
    activeSubscription, 
    hasActiveSubscription = false 
}: KitRequestProps) {
    const [selectedLocation, setSelectedLocation] = useState<DeliveryLocation | null>(null);
    
    // Check if user has active subscription with remaining kits
    const hasRemainingKits = hasActiveSubscription && activeSubscription && (activeSubscription.kits_used < activeSubscription.kits_allowed);
    
    const [purchaseType, setPurchaseType] = useState<'one_time' | 'subscription'>(
        hasRemainingKits ? 'subscription' : 'one_time'
    );
    const [selectedSubscriptionTier, setSelectedSubscriptionTier] = useState<string>('annual_moderate');
    
    const handleLocationSelect = (location: DeliveryLocation) => {
        setSelectedLocation(location);
    };

    return (
        <>
            <Head title="Privacy Kit Request - Kaupod" />
            
            <ClientNavigation />

            {/* Hero Section */}
            <section className="bg-gradient-to-br from-red-50 via-amber-50 to-stone-50 py-20">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <div className="flex justify-center mb-6">
                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-700">
                                <Package className="h-8 w-8 text-white" />
                            </div>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                            Privacy Kit Request
                        </h1>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Confidential HIV testing kits delivered to your exact location with secure result delivery
                        </p>
                    </div>

                    {/* Active Subscription Status */}
                    {hasActiveSubscription && activeSubscription && (
                        <div className={`border rounded-2xl p-6 max-w-2xl mx-auto mb-6 ${
                            hasRemainingKits 
                                ? 'bg-blue-50 border-blue-200' 
                                : 'bg-green-50 border-green-200'
                        }`}>
                            <div className="text-center">
                                <div className="flex items-center justify-center gap-2 mb-3">
                                    <Package className={`h-5 w-5 ${
                                        hasRemainingKits ? 'text-blue-700' : 'text-green-700'
                                    }`} />
                                    <h3 className={`text-lg font-semibold ${
                                        hasRemainingKits ? 'text-blue-900' : 'text-green-900'
                                    }`}>
                                        {hasRemainingKits ? 'You Must Use Your Active Subscription' : 'Active Subscription'}
                                    </h3>
                                </div>
                                <div className={`space-y-2 ${
                                    hasRemainingKits ? 'text-blue-800' : 'text-green-800'
                                }`}>
                                    <div className="text-sm">
                                        <strong>{subscriptionOptions[activeSubscription.tier]?.name || 'Subscription'}</strong>
                                    </div>
                                    <div className="text-xs">
                                        Kits remaining: <strong>{activeSubscription.kits_allowed - activeSubscription.kits_used}</strong> of {activeSubscription.kits_allowed}
                                    </div>
                                    {activeSubscription.expires_at && (
                                        <div className="text-xs">
                                            Expires: <strong>{new Date(activeSubscription.expires_at).toLocaleDateString()}</strong>
                                        </div>
                                    )}
                                    {hasRemainingKits && (
                                        <div className="text-xs font-medium text-blue-900 bg-blue-100 rounded px-2 py-1 mt-2">
                                            You must use all remaining subscription kits before purchasing additional kits
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Pricing Options */}
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 max-w-4xl mx-auto mb-8">
                        <div className="text-center mb-6">
                            <div className="flex items-center justify-center gap-2 mb-4">
                                <Package className="h-6 w-6 text-red-700" />
                                <h3 className="text-2xl font-bold text-gray-900">Choose Your Plan</h3>
                            </div>
                        </div>
                        
                        {/* Subscription Options */}
                        <div className="grid md:grid-cols-3 gap-4 mb-6">
                            {/* One-time Purchase */}
                            <div className={`border rounded-lg p-4 transition-all relative ${
                                hasRemainingKits 
                                    ? 'border-gray-300 bg-gray-100 cursor-not-allowed opacity-60' 
                                    : purchaseType === 'one_time' 
                                        ? 'border-red-500 bg-red-50 cursor-pointer' 
                                        : 'border-gray-200 hover:border-red-300 cursor-pointer'
                            }`} onClick={() => !hasRemainingKits && setPurchaseType('one_time')}>
                                {hasRemainingKits && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 rounded-lg">
                                        <span className="text-white text-sm font-medium">Use Active Subscription</span>
                                    </div>
                                )}
                                <div className="text-center">
                                    <div className="flex items-center justify-center mb-2">
                                        <input 
                                            type="radio" 
                                            name="purchase_type" 
                                            value="one_time" 
                                            checked={purchaseType === 'one_time'}
                                            onChange={() => !hasRemainingKits && setPurchaseType('one_time')}
                                            disabled={hasRemainingKits}
                                            className="mr-2"
                                        />
                                        <h4 className={`font-semibold ${
                                            hasRemainingKits ? 'text-gray-500' : 'text-gray-900'
                                        }`}>{subscriptionOptions.one_time.name}</h4>
                                    </div>
                                    <div className="text-2xl font-bold text-red-700 mb-2">
                                        ₱{subscriptionOptions.one_time.price.toFixed(2)}
                                    </div>
                                    <div className="text-sm text-gray-600 mb-3">
                                        {subscriptionOptions.one_time.description}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        • Single kit purchase<br/>
                                        • Pay per use<br/>
                                        • No commitment
                                    </div>
                                </div>
                            </div>
                            
                            {/* Annual Moderate */}
                            <div className={`border rounded-lg p-4 transition-all relative ${
                                hasRemainingKits 
                                    ? 'border-gray-300 bg-gray-100 cursor-not-allowed opacity-60'
                                    : purchaseType === 'subscription' && selectedSubscriptionTier === 'annual_moderate' 
                                        ? 'border-red-500 bg-red-50 cursor-pointer' 
                                        : 'border-gray-200 hover:border-red-300 cursor-pointer'
                            }`} onClick={() => {
                                if (!hasRemainingKits) {
                                    setPurchaseType('subscription');
                                    setSelectedSubscriptionTier('annual_moderate');
                                }
                            }}>
                                {hasRemainingKits && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 rounded-lg">
                                        <span className="text-white text-sm font-medium">Use Active Subscription</span>
                                    </div>
                                )}
                                <div className="absolute -top-2 -right-2 bg-amber-500 text-white text-xs px-2 py-1 rounded-full">
                                    Save ₱{((subscriptionOptions.one_time.price * 2) - subscriptionOptions.annual_moderate.price).toFixed(0)}
                                </div>
                                <div className="text-center">
                                    <div className="flex items-center justify-center mb-2">
                                        <input 
                                            type="radio" 
                                            name="purchase_type" 
                                            value="subscription" 
                                            checked={purchaseType === 'subscription' && selectedSubscriptionTier === 'annual_moderate'}
                                            onChange={() => {
                                                if (!hasRemainingKits) {
                                                    setPurchaseType('subscription');
                                                    setSelectedSubscriptionTier('annual_moderate');
                                                }
                                            }}
                                            disabled={hasRemainingKits}
                                            className="mr-2"
                                        />
                                        <h4 className="font-semibold text-gray-900">{subscriptionOptions.annual_moderate.name}</h4>
                                    </div>
                                    <div className="text-2xl font-bold text-red-700 mb-1">
                                        ₱{subscriptionOptions.annual_moderate.price.toFixed(2)}
                                    </div>
                                    <div className="text-xs text-gray-500 mb-2">
                                        ₱{(subscriptionOptions.annual_moderate.price / 2).toFixed(2)} per kit
                                    </div>
                                    <div className="text-sm text-gray-600 mb-3">
                                        {subscriptionOptions.annual_moderate.description}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        • 2 kits per year<br/>
                                        • Order anytime<br/>
                                        • 12-month validity
                                    </div>
                                </div>
                            </div>
                            
                            {/* Annual High */}
                            <div className={`border rounded-lg p-4 transition-all relative ${
                                hasRemainingKits 
                                    ? 'border-gray-300 bg-gray-100 cursor-not-allowed opacity-60'
                                    : purchaseType === 'subscription' && selectedSubscriptionTier === 'annual_high' 
                                        ? 'border-red-500 bg-red-50 cursor-pointer' 
                                        : 'border-gray-200 hover:border-red-300 cursor-pointer'
                            }`} onClick={() => {
                                if (!hasRemainingKits) {
                                    setPurchaseType('subscription');
                                    setSelectedSubscriptionTier('annual_high');
                                }
                            }}>
                                {hasRemainingKits && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 rounded-lg">
                                        <span className="text-white text-sm font-medium">Use Active Subscription</span>
                                    </div>
                                )}
                                <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                                    Save ₱{((subscriptionOptions.one_time.price * 4) - subscriptionOptions.annual_high.price).toFixed(0)}
                                </div>
                                <div className="absolute -top-2 -left-2 bg-red-600 text-white text-xs px-2 py-1 rounded-full">
                                    BEST VALUE
                                </div>
                                <div className="text-center">
                                    <div className="flex items-center justify-center mb-2">
                                        <input 
                                            type="radio" 
                                            name="purchase_type" 
                                            value="subscription" 
                                            checked={purchaseType === 'subscription' && selectedSubscriptionTier === 'annual_high'}
                                            onChange={() => {
                                                if (!hasRemainingKits) {
                                                    setPurchaseType('subscription');
                                                    setSelectedSubscriptionTier('annual_high');
                                                }
                                            }}
                                            disabled={hasRemainingKits}
                                            className="mr-2"
                                        />
                                        <h4 className="font-semibold text-gray-900">{subscriptionOptions.annual_high.name}</h4>
                                    </div>
                                    <div className="text-2xl font-bold text-red-700 mb-1">
                                        ₱{subscriptionOptions.annual_high.price.toFixed(2)}
                                    </div>
                                    <div className="text-xs text-gray-500 mb-2">
                                        ₱{(subscriptionOptions.annual_high.price / 4).toFixed(2)} per kit
                                    </div>
                                    <div className="text-sm text-gray-600 mb-3">
                                        {subscriptionOptions.annual_high.description}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        • 4 kits per year<br/>
                                        • Order anytime<br/>
                                        • 12-month validity
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        {/* Current Selection Summary */}
                        <div className={`rounded-lg p-4 text-center ${
                            hasRemainingKits 
                                ? 'bg-blue-50 border border-blue-200' 
                                : 'bg-gray-50'
                        }`}>
                            <div className="text-sm text-gray-600 mb-2">
                                {hasRemainingKits ? 'Using your active subscription:' : 'You\'re ordering:'}
                            </div>
                            <div className="font-semibold text-gray-900">
                                {hasRemainingKits 
                                    ? `${subscriptionOptions[activeSubscription?.tier || 'one_time']?.name || 'Subscription'} (Existing Subscription)`
                                    : purchaseType === 'one_time' 
                                        ? subscriptionOptions.one_time.name
                                        : subscriptionOptions[selectedSubscriptionTier]?.name
                                }
                            </div>
                            <div className={`text-lg font-bold ${
                                hasRemainingKits ? 'text-green-700' : 'text-red-700'
                            }`}>
                                {hasRemainingKits 
                                    ? '₱0.00 (Free with subscription)'
                                    : purchaseType === 'one_time'
                                        ? `₱${subscriptionOptions.one_time.price.toFixed(2)}`
                                        : `₱${subscriptionOptions[selectedSubscriptionTier]?.price.toFixed(2) || '0.00'}`
                                }
                            </div>
                            {hasRemainingKits && (
                                <div className="text-xs text-blue-600 mt-2">
                                    This will use 1 of your {activeSubscription?.kits_allowed - activeSubscription?.kits_used} remaining kits
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Ongoing Kit Order Warning */}
                    {hasOngoingKitOrder && ongoingKitOrder && (
                        <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg max-w-2xl mx-auto">
                            <div className="flex items-start space-x-3">
                                <Package className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                                <div className="flex-1">
                                    <h3 className="text-sm font-medium text-amber-800 mb-1">
                                        You have an ongoing kit order
                                    </h3>
                                    <p className="text-sm text-amber-700 mb-3">
                                        You already have a kit order in progress. Please wait for it to be completed before ordering a new kit.
                                    </p>
                                    <div className="bg-white p-3 rounded border border-amber-200 mb-3">
                                        <div className="text-xs text-amber-600 space-y-1">
                                            <div><span className="font-medium">Status:</span> {ongoingKitOrder.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</div>
                                            <div><span className="font-medium">Ordered:</span> {new Date(ongoingKitOrder.created_at).toLocaleDateString()}</div>
                                        </div>
                                    </div>
                                    <a
                                        href="/my-orders"
                                        className="inline-flex items-center text-sm font-medium text-amber-700 hover:text-amber-800"
                                    >
                                        View your orders →
                                    </a>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className={`bg-white rounded-2xl shadow-xl p-8 max-w-2xl mx-auto ${hasOngoingKitOrder ? 'opacity-50 pointer-events-none' : ''}`}>
                        <Form
                            action="/request/kit"
                            method="post"
                            className="space-y-6"
                        >
                            {({ processing, errors, submit }) => (
                                <>
                                    <div className="grid gap-6">
                                        <div className="grid gap-3">
                                            <Label htmlFor="delivery-map" className="text-base font-semibold text-gray-900 flex items-center gap-2">
                                                <MapPin className="h-4 w-4" />
                                                Pin Your Delivery Location
                                            </Label>
                                            <DeliveryLocationMap
                                                onLocationSelect={handleLocationSelect}
                                                initialLocation={selectedLocation || undefined}
                                            />
                                            {selectedLocation && (
                                                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                                                    <p className="text-sm font-medium text-red-700 mb-1">Selected Location:</p>
                                                    <p className="text-sm text-red-700">{selectedLocation.address}</p>
                                                    <p className="text-xs text-red-700 mt-1">
                                                        Coordinates: {selectedLocation.lat.toFixed(6)}, {selectedLocation.lng.toFixed(6)}
                                                    </p>
                                                </div>
                                            )}
                                            <input 
                                                type="hidden" 
                                                name="delivery_latitude" 
                                                value={selectedLocation?.lat || ''} 
                                            />
                                            <input 
                                                type="hidden" 
                                                name="delivery_longitude" 
                                                value={selectedLocation?.lng || ''} 
                                            />
                                            <input 
                                                type="hidden" 
                                                name="delivery_location_address" 
                                                value={selectedLocation?.address || ''} 
                                            />
                                            <input 
                                                type="hidden" 
                                                name="purchase_type" 
                                                value={purchaseType} 
                                            />
                                            {purchaseType === 'subscription' && (
                                                <input 
                                                    type="hidden" 
                                                    name="subscription_tier" 
                                                    value={selectedSubscriptionTier} 
                                                />
                                            )}
                                        </div>

                                        <div className="grid gap-3">
                                            <Label htmlFor="delivery_address" className="text-base font-semibold text-gray-900">Additional Address Details</Label>
                                            <Textarea
                                                id="delivery_address"
                                                name="delivery_address"
                                                placeholder="Apartment number, building name, specific instructions (e.g., 'Apt 4B, Blue building, Ring doorbell twice')"
                                                rows={3}
                                                className="text-base"
                                            />
                                            <p className="text-xs text-gray-500">
                                                Optional: Add specific details like apartment numbers, building descriptions, or delivery instructions.
                                            </p>
                                            <InputError message={errors.delivery_address} />
                                        </div>

                                        <div className="grid gap-3">
                                            <Label htmlFor="phone" className="text-base font-semibold text-gray-900">Contact Phone</Label>
                                            <Input
                                                id="phone"
                                                type="tel"
                                                name="phone"
                                                required
                                                placeholder="Phone number for delivery updates"
                                                className="text-base"
                                            />
                                            <InputError message={errors.phone} />
                                        </div>

                                        <div className="grid gap-3">
                                            <Label htmlFor="special_instructions" className="text-base font-semibold text-gray-900">Special Instructions</Label>
                                            <Textarea
                                                id="special_instructions"
                                                name="special_instructions"
                                                placeholder="Any special delivery instructions or notes"
                                                rows={3}
                                                className="text-base"
                                            />
                                            <p className="text-xs text-gray-500">
                                                Optional: Add any special instructions for our delivery team.
                                            </p>
                                            <InputError message={errors.special_instructions} />
                                        </div>
                                    </div>

                                    <Button
                                        type="button"
                                        onClick={submit}
                                        className="w-full bg-gradient-to-r from-red-700 to-amber-700 hover:from-red-700 hover:to-amber-700 text-lg py-4 font-semibold"
                                        disabled={processing || hasOngoingKitOrder}
                                    >
                                        {processing && (
                                            <LoaderCircle className="h-5 w-5 animate-spin mr-3" />
                                        )}
                                        Submit Privacy Kit Request
                                    </Button>
                                </>
                            )}
                        </Form>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-12">
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
        </>
    );
}