import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import ClientNavigation from '@/components/client-navigation';
import { Button } from '@/components/ui/button';
import { Package, Check, Star } from 'lucide-react';

interface SubscriptionOption {
    tier: string;
    name: string;
    description: string;
    price: number;
    kits_allowed: number;
    annual: boolean;
}

interface SubscriptionCreateProps {
    subscriptionOptions: Record<string, SubscriptionOption>;
}

export default function SubscriptionCreate({ subscriptionOptions }: SubscriptionCreateProps) {
    const [selectedTier, setSelectedTier] = useState<string>('annual_moderate');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        router.post('/subscriptions', { tier: selectedTier }, {
            onFinish: () => setIsSubmitting(false),
            onError: () => setIsSubmitting(false)
        });
    };

    const getFeatures = (tier: string) => {
        const option = subscriptionOptions[tier];
        if (!option) return [];

        const baseFeatures = [
            'FDA-approved HIV test kits',
            'Discreet packaging & delivery',
            'Secure result processing',
            'GPS-precise delivery',
            'Complete privacy guaranteed',
            'Professional support'
        ];

        const tierFeatures: Record<string, string[]> = {
            one_time: [
                'Single kit purchase',
                'Pay per use',
                'No commitment'
            ],
            annual_moderate: [
                '2 kits per year',
                'Order anytime within 12 months',
                `Save ₱${((subscriptionOptions.one_time.price * 2) - option.price).toFixed(0)} compared to individual purchases`,
                '12-month validity'
            ],
            annual_high: [
                '4 kits per year',
                'Order anytime within 12 months',
                `Save ₱${((subscriptionOptions.one_time.price * 4) - option.price).toFixed(0)} compared to individual purchases`,
                '12-month validity',
                'Best value for regular testing'
            ]
        };

        return [...baseFeatures, ...tierFeatures[tier]];
    };

    const isRecommended = (tier: string) => {
        return tier === 'annual_high';
    };

    return (
        <>
            <Head title="Create Subscription - Kaupod" />
            
            <ClientNavigation />

            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-bold text-gray-900 mb-4">Choose Your Testing Plan</h1>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Select the subscription that best fits your testing needs and save money with our annual plans
                        </p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        {/* Subscription Options */}
                        <div className="grid md:grid-cols-3 gap-8 mb-12">
                            {Object.entries(subscriptionOptions).map(([key, option]) => (
                                <div 
                                    key={key}
                                    className={`relative bg-white rounded-xl shadow-lg border-2 transition-all cursor-pointer ${
                                        selectedTier === key 
                                            ? 'border-red-500 shadow-xl transform scale-105' 
                                            : 'border-gray-200 hover:border-red-300 hover:shadow-xl'
                                    } ${isRecommended(key) ? 'ring-4 ring-red-100' : ''}`}
                                    onClick={() => setSelectedTier(key)}
                                >
                                    {/* Recommended Badge */}
                                    {isRecommended(key) && (
                                        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                                            <div className="bg-red-600 text-white px-4 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                                                <Star className="h-3 w-3" />
                                                RECOMMENDED
                                            </div>
                                        </div>
                                    )}

                                    {/* Savings Badge */}
                                    {option.annual && (
                                        <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-3 py-1 rounded-full font-semibold">
                                            Save ₱{((subscriptionOptions.one_time.price * option.kits_allowed) - option.price).toFixed(0)}
                                        </div>
                                    )}

                                    <div className="p-8">
                                        {/* Plan Header */}
                                        <div className="text-center mb-8">
                                            <div className="flex items-center justify-center mb-4">
                                                <input 
                                                    type="radio" 
                                                    name="tier" 
                                                    value={key} 
                                                    checked={selectedTier === key}
                                                    onChange={() => setSelectedTier(key)}
                                                    className="sr-only"
                                                />
                                                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                                                    selectedTier === key 
                                                        ? 'border-red-500 bg-red-500' 
                                                        : 'border-gray-300'
                                                }`}>
                                                    {selectedTier === key && (
                                                        <Check className="h-4 w-4 text-white" />
                                                    )}
                                                </div>
                                            </div>
                                            
                                            <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                                {option.name}
                                            </h3>
                                            
                                            <div className="mb-4">
                                                <div className="text-4xl font-bold text-red-700">
                                                    ₱{option.price.toFixed(2)}
                                                </div>
                                                {option.annual && (
                                                    <div className="text-sm text-gray-500 mt-1">
                                                        ₱{(option.price / option.kits_allowed).toFixed(2)} per kit
                                                    </div>
                                                )}
                                            </div>
                                            
                                            <p className="text-gray-600">
                                                {option.description}
                                            </p>
                                        </div>

                                        {/* Features List */}
                                        <div className="space-y-4">
                                            <h4 className="font-semibold text-gray-900 text-center">What's included:</h4>
                                            <ul className="space-y-3">
                                                {getFeatures(key).map((feature, index) => (
                                                    <li key={index} className="flex items-start gap-3">
                                                        <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                                                        <span className="text-sm text-gray-700">{feature}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Selected Plan Summary */}
                        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 mb-8">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
                            <div className="flex justify-between items-center">
                                <div>
                                    <div className="font-medium text-gray-900">
                                        {subscriptionOptions[selectedTier]?.name}
                                    </div>
                                    <div className="text-sm text-gray-600">
                                        {subscriptionOptions[selectedTier]?.description}
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-2xl font-bold text-red-700">
                                        ₱{subscriptionOptions[selectedTier]?.price.toFixed(2)}
                                    </div>
                                    {subscriptionOptions[selectedTier]?.annual && (
                                        <div className="text-sm text-gray-500">
                                            ₱{((subscriptionOptions[selectedTier]?.price || 0) / (subscriptionOptions[selectedTier]?.kits_allowed || 1)).toFixed(2)} per kit
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="text-center">
                            <Button 
                                type="submit" 
                                disabled={isSubmitting}
                                className="bg-red-700 hover:bg-red-800 text-white px-12 py-4 text-lg font-semibold"
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                                        Creating Subscription...
                                    </>
                                ) : (
                                    <>
                                        <Package className="h-5 w-5 mr-3" />
                                        Create Subscription
                                    </>
                                )}
                            </Button>
                            
                            <p className="text-sm text-gray-500 mt-4">
                                You'll be able to start ordering kits immediately after subscription creation
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}