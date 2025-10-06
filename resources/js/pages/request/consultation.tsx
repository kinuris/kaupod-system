import React, { useState } from 'react';
import InputError from '@/components/input-error';
import ClientNavigation from '@/components/client-navigation';
import DeliveryLocationMap from '@/components/delivery-location-map';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Form, Head } from '@inertiajs/react';
import { LoaderCircle, MessageCircle, Calendar, MapPin, Info } from 'lucide-react';

interface DeliveryLocation {
    lat: number;
    lng: number;
    address?: string;
}

interface OngoingConsultation {
    id: number;
    status: string;
    preferred_date: string;
    preferred_time: string;
    consultation_type: string;
}

interface ConsultationOption {
    name: string;
    description: string;
    price: number;
    consultations_allowed: number;
    discount_percent: number;
    savings: number;
}

interface ActiveConsultationSubscription {
    subscription: {
        subscription_tier: string;
        created_at: string;
    };
    completed_consultations: number;
    allowed_consultations: number;
    remaining_consultations: number;
    expires_at: string;
}

interface ConsultationRequestProps {
    hasOngoingConsultation?: boolean;
    ongoingConsultation?: OngoingConsultation;
    activeConsultationSubscription?: ActiveConsultationSubscription;
    errors?: Record<string, string>;
    consultationPrice: number;
    platformFee: number;
    expertFee: number;
    moderateDiscount: number;
    highDiscount: number;
    consultationOptions: {
        one_time: ConsultationOption;
        moderate_annual: ConsultationOption;
        high_annual: ConsultationOption;
    };
}

export default function ConsultationRequest({ 
    hasOngoingConsultation = false, 
    ongoingConsultation, 
    activeConsultationSubscription,
    errors, 
    consultationPrice, 
    platformFee, 
    expertFee, 
    moderateDiscount = 15, 
    highDiscount = 25, 
    consultationOptions 
}: ConsultationRequestProps) {
    // Calculate tomorrow's date for default values (current day + 1)
    // This ensures consultations default to next day, handling month/year transitions automatically
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const defaultMonth = String(tomorrow.getMonth() + 1).padStart(2, '0'); // getMonth() returns 0-11, so add 1
    const defaultDay = String(tomorrow.getDate()).padStart(2, '0');
    const defaultYear = String(tomorrow.getFullYear());

    const [consultationMode, setConsultationMode] = useState<'online' | 'in-person' | ''>('');
    const [selectedLocation, setSelectedLocation] = useState<DeliveryLocation | null>(null);
    const [selectedTier, setSelectedTier] = useState<string>('');
    const [showAgeConfirmModal, setShowAgeConfirmModal] = useState(false);
    const [ageConfirmed, setAgeConfirmed] = useState(false);
    const [submitCallback, setSubmitCallback] = useState<(() => void) | null>(null);

    // Fallback consultation options if not provided
    const safeConsultationOptions = consultationOptions || {
        one_time: {
            name: 'Single Consultation',
            description: 'One professional consultation',
            price: consultationPrice || 700,
            consultations_allowed: 1,
            discount_percent: 0,
            savings: 0,
        },
        moderate_annual: {
            name: 'Annual Moderate (2 consultations)',
            description: '2 consultations per year with discount',
            price: (consultationPrice || 700) * 2 * (1 - moderateDiscount / 100),
            consultations_allowed: 2,
            discount_percent: moderateDiscount,
            savings: (consultationPrice || 700) * 2 * (moderateDiscount / 100),
        },
        high_annual: {
            name: 'Annual High (4 consultations)',
            description: '4 consultations per year with discount',
            price: (consultationPrice || 700) * 4 * (1 - highDiscount / 100),
            consultations_allowed: 4,
            discount_percent: highDiscount,
            savings: (consultationPrice || 700) * 4 * (highDiscount / 100),
        },
    };

    const handleLocationSelect = (location: DeliveryLocation) => {
        setSelectedLocation(location);
    };

    const handleFormSubmit = (submit: () => void) => {
        // Prevent submission if there's an ongoing consultation
        if (hasOngoingConsultation) {
            return;
        }

        // Validate subscription tier selection
        if (activeConsultationSubscription) {
            // User has active subscription - no tier selection needed, it's automatically set
            // Just proceed with the submission
        } else {
            // User doesn't have active subscription - must select a tier
            if (!selectedTier) {
                alert('Please select a Plus Plan tier before submitting your consultation request.');
                return;
            }
        }

        if (!ageConfirmed) {
            setSubmitCallback(() => () => {
                submit();
                // Open GCash in new tab after successful submission
                window.open('https://gcash.com', '_blank');
            });
            setShowAgeConfirmModal(true);
        } else {
            submit();
            // Open GCash in new tab after successful submission
            window.open('https://gcash.com', '_blank');
        }
    };

    const confirmAge = () => {
        setAgeConfirmed(true);
        setShowAgeConfirmModal(false);
        
        if (submitCallback) {
            submitCallback();
            setSubmitCallback(null);
        }
    };

    const cancelAgeConfirmation = () => {
        setShowAgeConfirmModal(false);
        setSubmitCallback(null);
    };

    return (
        <>
            <Head title="Plus Plan Request - Kaupod" />
            
            <ClientNavigation />

            {/* Hero Section */}
            <section className="bg-gradient-to-br from-red-50 via-amber-50 to-stone-50 py-20">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <div className="flex justify-center mb-6">
                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-700">
                                <MessageCircle className="h-8 w-8 text-white" />
                            </div>
                        </div>
                        <div className="flex items-center justify-center gap-3 mb-4">
                            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
                                Plus Plan
                            </h1>
                            <div className="group relative">
                                <Info className="h-6 w-6 text-red-700 cursor-help" />
                                <div className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 w-80 p-4 bg-gray-900 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10 shadow-lg">
                                    <div className="space-y-3">
                                        <div className="font-semibold text-red-300">What's Plus Plan?</div>
                                        <div>Professional healthcare consultations with qualified doctors from our partner network in complete confidentiality.</div>
                                        <div className="space-y-2">
                                            <div className="font-medium text-amber-300">How it works:</div>
                                            <div className="space-y-1 text-xs">
                                                <div>• 1. Submit your consultation request</div>
                                                <div>• 2. We coordinate with partner experts</div>
                                                <div>• 3. Receive confirmation via Consultation Tracker</div>
                                                <div>• 4. Attend your scheduled consultation</div>
                                            </div>
                                        </div>
                                        <div className="text-xs text-gray-300 italic">Professional care in a judgment-free environment.</div>
                                    </div>
                                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                                </div>
                            </div>
                        </div>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Connect with qualified doctors and experts from our partner network in a judgment-free environment
                        </p>
                    </div>

                    {/* Plus Plan Tiers */}
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 max-w-5xl mx-auto mb-8">
                        <div className="text-center mb-8">
                            <div className="flex items-center justify-center gap-2 mb-4">
                                <MessageCircle className="h-6 w-6 text-amber-700" />
                                <h3 className="text-2xl font-bold text-gray-900">Choose Your Plus Plan</h3>
                            </div>
                            <p className="text-gray-600">Select the consultation plan that best fits your healthcare needs</p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-6">
                            {/* One-time Purchase */}
                            <div className={`border-2 rounded-2xl p-6 relative ${
                                activeConsultationSubscription 
                                    ? 'border-gray-200 opacity-50 cursor-not-allowed pointer-events-none' 
                                    : 'border-amber-200'
                            }`}>
                                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                                    <span className={`text-white px-4 py-1 rounded-full text-sm font-semibold ${
                                        activeConsultationSubscription 
                                            ? 'bg-gray-400' 
                                            : 'bg-amber-600'
                                    }`}>
                                        One-time
                                    </span>
                                </div>
                                <div className="text-center mt-3">
                                    <h4 className="text-xl font-bold text-gray-900 mb-2">{safeConsultationOptions.one_time.name}</h4>
                                    <div className="text-3xl font-bold text-amber-700 mb-2">
                                        ₱{safeConsultationOptions.one_time.price.toFixed(2)}
                                    </div>
                                    <div className="text-sm text-gray-600 mb-4">
                                        {safeConsultationOptions.one_time.description}
                                    </div>
                                    <div className="space-y-2 text-sm text-left text-gray-600">
                                        <div className="flex items-center">
                                            <svg className="w-4 h-4 text-amber-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                            <span>1 Plus Plan consultation</span>
                                        </div>
                                        <div className="flex items-center">
                                            <svg className="w-4 h-4 text-amber-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                            <span>Online or in-person</span>
                                        </div>
                                        <div className="flex items-center">
                                            <svg className="w-4 h-4 text-amber-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                            <span>Consultation tracker</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Annual Subscription - Moderate */}
                            <div className={`border-2 rounded-2xl p-6 relative ${
                                activeConsultationSubscription?.subscription.subscription_tier === 'moderate_annual'
                                    ? 'border-blue-500 bg-blue-100 ring-2 ring-blue-200' 
                                    : activeConsultationSubscription 
                                        ? 'border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed pointer-events-none' 
                                        : 'border-blue-300 bg-blue-50'
                            }`}>
                                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                                    <span className={`text-white px-4 py-1 rounded-full text-sm font-semibold ${
                                        activeConsultationSubscription?.subscription.subscription_tier === 'moderate_annual'
                                            ? 'bg-blue-700' 
                                            : activeConsultationSubscription 
                                                ? 'bg-gray-400' 
                                                : 'bg-blue-600'
                                    }`}>
                                        {activeConsultationSubscription?.subscription.subscription_tier === 'moderate_annual' ? 'Active' : 'Moderate'}
                                    </span>
                                </div>
                                <div className="text-center mt-3">
                                    <h4 className="text-xl font-bold text-gray-900 mb-2">Annual Subscription</h4>
                                    <div className="text-3xl font-bold text-blue-700 mb-1">
                                        ₱{safeConsultationOptions.moderate_annual.price.toFixed(2)}
                                    </div>
                                    <div className="text-xs text-blue-600 mb-2">
                                        Save {safeConsultationOptions.moderate_annual.discount_percent}% • ₱{safeConsultationOptions.moderate_annual.savings.toFixed(2)} saved
                                    </div>
                                    <div className="text-sm text-gray-600 mb-4">
                                        {safeConsultationOptions.moderate_annual.consultations_allowed} consultations per year
                                    </div>
                                    <div className="space-y-2 text-sm text-left text-gray-600">
                                        <div className="flex items-center">
                                            <svg className="w-4 h-4 text-blue-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                            <span>{safeConsultationOptions.moderate_annual.consultations_allowed} Plus Plan consultations/year</span>
                                        </div>
                                        <div className="flex items-center">
                                            <svg className="w-4 h-4 text-blue-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                            <span>Priority scheduling</span>
                                        </div>
                                        <div className="flex items-center">
                                            <svg className="w-4 h-4 text-blue-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                            <span>{safeConsultationOptions.moderate_annual.discount_percent}% annual savings</span>
                                        </div>
                                        <div className="flex items-center">
                                            <svg className="w-4 h-4 text-blue-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                            <span>Follow-up support</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Annual Subscription - High */}
                            <div className={`border-2 rounded-2xl p-6 relative ${
                                activeConsultationSubscription?.subscription.subscription_tier === 'high_annual'
                                    ? 'border-purple-500 bg-purple-100 ring-2 ring-purple-200' 
                                    : activeConsultationSubscription 
                                        ? 'border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed pointer-events-none' 
                                        : 'border-purple-300 bg-purple-50'
                            }`}>
                                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                                    <span className={`text-white px-4 py-1 rounded-full text-sm font-semibold ${
                                        activeConsultationSubscription?.subscription.subscription_tier === 'high_annual'
                                            ? 'bg-purple-700' 
                                            : activeConsultationSubscription 
                                                ? 'bg-gray-400' 
                                                : 'bg-purple-600'
                                    }`}>
                                        {activeConsultationSubscription?.subscription.subscription_tier === 'high_annual' ? 'Active' : 'High'}
                                    </span>
                                </div>
                                <div className="text-center mt-3">
                                    <h4 className="text-xl font-bold text-gray-900 mb-2">Annual Subscription</h4>
                                    <div className="text-3xl font-bold text-purple-700 mb-1">
                                        ₱{safeConsultationOptions.high_annual.price.toFixed(2)}
                                    </div>
                                    <div className="text-xs text-purple-600 mb-2">
                                        Save {safeConsultationOptions.high_annual.discount_percent}% • ₱{safeConsultationOptions.high_annual.savings.toFixed(2)} saved
                                    </div>
                                    <div className="text-sm text-gray-600 mb-4">
                                        {safeConsultationOptions.high_annual.consultations_allowed} consultations per year
                                    </div>
                                    <div className="space-y-2 text-sm text-left text-gray-600">
                                        <div className="flex items-center">
                                            <svg className="w-4 h-4 text-purple-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                            <span>{safeConsultationOptions.high_annual.consultations_allowed} Plus Plan consultations/year</span>
                                        </div>
                                        <div className="flex items-center">
                                            <svg className="w-4 h-4 text-purple-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                            <span>VIP priority scheduling</span>
                                        </div>
                                        <div className="flex items-center">
                                            <svg className="w-4 h-4 text-purple-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                            <span>{safeConsultationOptions.high_annual.discount_percent}% annual savings</span>
                                        </div>
                                        <div className="flex items-center">
                                            <svg className="w-4 h-4 text-purple-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                            <span>Extended follow-up care</span>
                                        </div>
                                        <div className="flex items-center">
                                            <svg className="w-4 h-4 text-purple-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                            <span>Quarterly health check-ins</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 text-center">
                            <div className={`rounded-xl p-4 max-w-3xl mx-auto ${
                                activeConsultationSubscription 
                                    ? 'bg-blue-50 border border-blue-200' 
                                    : 'bg-gray-50'
                            }`}>
                                <p className="text-sm text-gray-600">
                                    {activeConsultationSubscription ? (
                                        <>
                                            <strong className="text-blue-700">Active Subscription:</strong> You currently have an active {' '}
                                            {activeConsultationSubscription.subscription.subscription_tier === 'moderate_annual' ? 'Moderate Annual' : 'High Annual'} subscription. 
                                            This consultation will use one of your remaining {activeConsultationSubscription.remaining_consultations} consultation(s).
                                        </>
                                    ) : (
                                        <>
                                            <strong>Note:</strong> Select your preferred plan during the consultation request process below. 
                                            All plans include access to qualified healthcare professionals from our partner network.
                                        </>
                                    )}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Information Card */}
                    <div className="bg-gradient-to-r from-red-50 to-amber-50 rounded-2xl border border-red-200 p-6 max-w-2xl mx-auto mb-8">
                        <div className="flex items-start gap-4">
                            <div className="flex-shrink-0">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
                                    <Info className="h-5 w-5 text-red-700" />
                                </div>
                            </div>
                            <div className="flex-1">
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">Plus Plan Information</h3>
                                <div className="space-y-3 text-gray-700">
                                    <p className="text-sm">
                                        Our Plus Plan consultations connect you with qualified healthcare professionals from our trusted partner network.
                                    </p>
                                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                                        <div className="space-y-2">
                                            <div className="font-medium text-red-700">✓ Consultation Process</div>
                                            <div className="text-xs space-y-1">
                                                <div>• Online or in-person options</div>
                                                <div>• Professional partner network</div>
                                                <div>• Flexible scheduling options</div>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="font-medium text-amber-700">✓ Support & Follow-up</div>
                                            <div className="text-xs space-y-1">
                                                <div>• Consultation Tracker for updates</div>
                                                <div>• Rescheduling if needed</div>
                                                <div>• Complete confidentiality</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Ongoing Consultation Warning */}
                    {hasOngoingConsultation && (
                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 mb-8 max-w-2xl mx-auto">
                            <div className="flex items-start gap-3">
                                <Info className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                                <div className="flex-1">
                                    <h3 className="text-lg font-semibold text-amber-800 mb-2">
                                        You have an ongoing consultation
                                    </h3>
                                    <p className="text-amber-700 mb-3">
                                        You currently have a consultation request in progress. You cannot submit a new consultation request until your current one is completed.
                                    </p>
                                    {ongoingConsultation && (
                                        <div className="bg-amber-100 rounded-md p-3 text-sm">
                                            <div className="font-medium text-amber-800 mb-1">Current Consultation:</div>
                                            <div className="text-amber-700 space-y-1">
                                                <div>Status: <span className="font-medium capitalize">{ongoingConsultation.status.replace('_', ' ')}</span></div>
                                                <div>Type: <span className="font-medium capitalize">{ongoingConsultation.consultation_type.replace('_', ' ')}</span></div>
                                                <div>Scheduled: <span className="font-medium">{new Date(ongoingConsultation.preferred_date).toLocaleDateString()} at {ongoingConsultation.preferred_time}</span></div>
                                            </div>
                                        </div>
                                    )}
                                    <div className="mt-4">
                                        <a 
                                            href="/plus-tracker" 
                                            className="inline-flex items-center text-amber-700 hover:text-amber-800 font-medium text-sm underline"
                                        >
                                            View your consultation status →
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Active Subscription Warning */}
                    {!hasOngoingConsultation && activeConsultationSubscription && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8 max-w-2xl mx-auto">
                            <div className="flex items-start gap-3">
                                <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                                <div className="flex-1">
                                    <h3 className="text-lg font-semibold text-blue-800 mb-2">
                                        You have an active consultation subscription
                                    </h3>
                                    <p className="text-blue-700 mb-3">
                                        You have {activeConsultationSubscription.remaining_consultations} consultation(s) remaining in your{' '}
                                        <span className="font-medium">
                                            {activeConsultationSubscription.subscription.subscription_tier === 'moderate_annual' ? 'Moderate Annual' : 'High Annual'}
                                        </span> subscription. Please use your existing consultations before ordering a new subscription.
                                    </p>
                                    <div className="bg-blue-100 rounded-md p-3 text-sm">
                                        <div className="font-medium text-blue-800 mb-1">Subscription Details:</div>
                                        <div className="text-blue-700 space-y-1">
                                            <div>Plan: <span className="font-medium">
                                                {activeConsultationSubscription.subscription.subscription_tier === 'moderate_annual' ? 'Moderate Annual (2 consultations)' : 'High Annual (4 consultations)'}
                                            </span></div>
                                            <div>Used: <span className="font-medium">{activeConsultationSubscription.completed_consultations} of {activeConsultationSubscription.allowed_consultations}</span></div>
                                            <div>Remaining: <span className="font-medium text-green-600">{activeConsultationSubscription.remaining_consultations}</span></div>
                                            <div>Expires: <span className="font-medium">{new Date(activeConsultationSubscription.expires_at).toLocaleDateString()}</span></div>
                                        </div>
                                    </div>
                                    <div className="mt-4">
                                        <a 
                                            href="/plus-tracker" 
                                            className="inline-flex items-center text-blue-700 hover:text-blue-800 font-medium text-sm underline"
                                        >
                                            Use your existing consultation →
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* General Error Messages */}
                    {errors?.consultation && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 max-w-2xl mx-auto">
                            <div className="flex items-center gap-2">
                                <Info className="w-4 h-4 text-red-600" />
                                <p className="text-red-800 text-sm font-medium">{errors.consultation}</p>
                            </div>
                        </div>
                    )}

                    <div className={`bg-white rounded-2xl shadow-xl p-8 max-w-2xl mx-auto ${hasOngoingConsultation ? 'opacity-60 pointer-events-none' : ''}`}>
                        <Form
                            action="/request/consultation"
                            method="post"
                            className="space-y-6"
                        >
                            {({ processing, errors, submit }) => (
                                <>
                                    <div className="space-y-6">
                        <div className="space-y-6">
                            {/* Preferred Date - Split into Month, Day, Year */}
                            <div className="grid gap-3">
                                <Label className="text-base font-semibold text-gray-900">Preferred Date</Label>
                                <div className="grid grid-cols-3 gap-3">
                                    <div className="grid gap-2">
                                        <Label htmlFor="preferred_month" className="text-sm text-gray-600">Month</Label>
                                        <select
                                            id="preferred_month"
                                            name="preferred_month"
                                            required
                                            defaultValue={defaultMonth}
                                            className="border-input flex h-10 w-full min-w-0 rounded-md border bg-white text-gray-900 px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                                        >
                                            <option value="01">January</option>
                                            <option value="02">February</option>
                                            <option value="03">March</option>
                                            <option value="04">April</option>
                                            <option value="05">May</option>
                                            <option value="06">June</option>
                                            <option value="07">July</option>
                                            <option value="08">August</option>
                                            <option value="09">September</option>
                                            <option value="10">October</option>
                                            <option value="11">November</option>
                                            <option value="12">December</option>
                                        </select>
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="preferred_day" className="text-sm text-gray-600">Day</Label>
                                        <select
                                            id="preferred_day"
                                            name="preferred_day"
                                            required
                                            defaultValue={defaultDay}
                                            className="border-input flex h-10 w-full min-w-0 rounded-md border bg-white text-gray-900 px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                                        >
                                            <option value="">Day</option>
                                            {[...Array(31)].map((_, i) => (
                                                <option key={i + 1} value={String(i + 1).padStart(2, '0')}>
                                                    {i + 1}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="preferred_year" className="text-sm text-gray-600">Year</Label>
                                        <select
                                            id="preferred_year"
                                            name="preferred_year"
                                            required
                                            defaultValue={defaultYear}
                                            className="border-input flex h-10 w-full min-w-0 rounded-md border bg-white text-gray-900 px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                                        >
                                            <option value={new Date().getFullYear()}>{new Date().getFullYear()}</option>
                                            <option value={new Date().getFullYear() + 1}>{new Date().getFullYear() + 1}</option>
                                        </select>
                                    </div>
                                </div>
                                <InputError message={errors.preferred_month || errors.preferred_day || errors.preferred_year} />
                            </div>

                            <div className="grid gap-3">
                                <Label htmlFor="preferred_time" className="text-base font-semibold text-gray-900">Preferred Time</Label>
                                <select
                                    id="preferred_time"
                                    name="preferred_time"
                                    required
                                    className="border-input flex h-10 w-full min-w-0 rounded-md border bg-white text-gray-900 px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                                >
                                    <option value="">Select a time</option>
                                    <option value="09:00">9:00 AM</option>
                                    <option value="10:00">10:00 AM</option>
                                    <option value="11:00">11:00 AM</option>
                                    <option value="14:00">2:00 PM</option>
                                    <option value="15:00">3:00 PM</option>
                                    <option value="16:00">4:00 PM</option>
                                    <option value="17:00">5:00 PM</option>
                                </select>
                                <InputError message={errors.preferred_time} />
                            </div>
                        </div>                                        <div className="grid gap-3">
                                            <Label htmlFor="subscription_tier" className="text-base font-semibold text-gray-900">
                                                Plus Plan Tier <span className="text-red-500">*</span>
                                                {activeConsultationSubscription && (
                                                    <span className="text-sm font-normal text-blue-600 ml-2">
                                                        (Using your active subscription - Cannot be changed)
                                                    </span>
                                                )}
                                            </Label>
                                            
                                            {activeConsultationSubscription ? (
                                                // Read-only display for active subscription
                                                <div className="relative">
                                                    <div className="flex h-10 w-full min-w-0 rounded-md border border-blue-200 bg-blue-50 text-blue-800 px-3 py-2 text-base shadow-xs cursor-not-allowed">
                                                        <span className="flex-1">
                                                            {activeConsultationSubscription.subscription.subscription_tier === 'moderate_annual' 
                                                                ? `${safeConsultationOptions.moderate_annual.name} - ₱${safeConsultationOptions.moderate_annual.price.toFixed(2)}` 
                                                                : `${safeConsultationOptions.high_annual.name} - ₱${safeConsultationOptions.high_annual.price.toFixed(2)}`
                                                            } (Active Subscription)
                                                        </span>
                                                        <div className="flex items-center text-blue-600">
                                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                                <path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                                                <circle cx="10" cy="6" r="1" />
                                                            </svg>
                                                        </div>
                                                    </div>
                                                    {/* Hidden input for form submission */}
                                                    <input 
                                                        type="hidden" 
                                                        name="subscription_tier" 
                                                        value={activeConsultationSubscription.subscription.subscription_tier} 
                                                    />
                                                </div>
                                            ) : (
                                                // Regular dropdown for users without active subscription
                                                <select
                                                    id="subscription_tier"
                                                    name="subscription_tier"
                                                    value={selectedTier}
                                                    onChange={(e) => setSelectedTier(e.target.value)}
                                                    required
                                                    className="border-input flex h-10 w-full min-w-0 rounded-md border bg-white text-gray-900 px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                                                >
                                                    <option value="">Select your plan</option>
                                                    <option value="one_time">{safeConsultationOptions.one_time.name} - ₱{safeConsultationOptions.one_time.price.toFixed(2)}</option>
                                                    <option value="moderate_annual">{safeConsultationOptions.moderate_annual.name} - ₱{safeConsultationOptions.moderate_annual.price.toFixed(2)}</option>
                                                    <option value="high_annual">{safeConsultationOptions.high_annual.name} - ₱{safeConsultationOptions.high_annual.price.toFixed(2)}</option>
                                                </select>
                                            )}
                                            <InputError message={errors.subscription_tier} />
                                            
                                            {/* Selected Tier Confirmation */}
                                            {(selectedTier || activeConsultationSubscription) && (
                                                <div className={`border rounded-lg p-4 mt-3 ${
                                                    activeConsultationSubscription 
                                                        ? 'bg-blue-50 border-blue-200' 
                                                        : 'bg-amber-50 border-amber-200'
                                                }`}>
                                                    <div className="flex items-start gap-3">
                                                        <div className="flex-shrink-0">
                                                            <svg className={`w-5 h-5 mt-0.5 ${
                                                                activeConsultationSubscription ? 'text-blue-700' : 'text-amber-700'
                                                            }`} fill="currentColor" viewBox="0 0 20 20">
                                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                            </svg>
                                                        </div>
                                                        <div className="flex-1">
                                                            {activeConsultationSubscription ? (
                                                                <>
                                                                    <h4 className="text-sm font-medium text-blue-800 mb-1">
                                                                        Using Active Subscription: {activeConsultationSubscription.subscription.subscription_tier === 'moderate_annual' ? 'Moderate Annual' : 'High Annual'}
                                                                    </h4>
                                                                    <p className="text-sm text-blue-700">
                                                                        Remaining consultations: {activeConsultationSubscription.remaining_consultations}
                                                                        <span className="ml-2 text-blue-600">
                                                                            (No additional payment required)
                                                                        </span>
                                                                    </p>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <h4 className="text-sm font-medium text-amber-800 mb-1">
                                                                        Selected: {safeConsultationOptions[selectedTier as keyof typeof safeConsultationOptions]?.name}
                                                                    </h4>
                                                                    <p className="text-sm text-amber-700">
                                                                        Price: ₱{safeConsultationOptions[selectedTier as keyof typeof safeConsultationOptions]?.price.toFixed(2)}
                                                                        {selectedTier !== 'one_time' && (
                                                                            <span className="ml-2 text-amber-600">
                                                                                (Save {safeConsultationOptions[selectedTier as keyof typeof safeConsultationOptions]?.discount_percent}%)
                                                                            </span>
                                                                        )}
                                                                    </p>
                                                                </>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        <div className="grid gap-3">
                                            <Label htmlFor="consultation_type" className="text-base font-semibold text-gray-900">Type of Consultation</Label>
                                            <select
                                                id="consultation_type"
                                                name="consultation_type"
                                                required
                                                className="border-input flex h-10 w-full min-w-0 rounded-md border bg-white text-gray-900 px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                                            >
                                                <option value="">Select consultation type</option>
                                                <option value="general">General Consultation</option>
                                                <option value="reproductive_health">Reproductive Health</option>
                                                <option value="contraception">Contraception Guidance</option>
                                                <option value="emergency">Emergency Consultation</option>
                                                <option value="follow_up">Follow-up Consultation</option>
                                            </select>
                                            <InputError message={errors.consultation_type} />
                                        </div>

                                        <div className="grid gap-3">
                                            <Label htmlFor="consultation_mode" className="text-base font-semibold text-gray-900">Consultation Mode</Label>
                                            <select
                                                id="consultation_mode"
                                                name="consultation_mode"
                                                required
                                                value={consultationMode}
                                                onChange={(e) => setConsultationMode(e.target.value as 'online' | 'in-person' | '')}
                                                className="border-input flex h-10 w-full min-w-0 rounded-md border bg-white text-gray-900 px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                                            >
                                                <option value="">Select consultation mode</option>
                                                <option value="online">Online Consultation</option>
                                                <option value="in-person">In-Person Consultation</option>
                                            </select>
                                            <InputError message={errors.consultation_mode} />
                                        </div>

                                        {consultationMode === 'in-person' && (
                                            <div className="grid gap-3">
                                                <Label className="text-base font-semibold text-gray-900 flex items-center gap-2">
                                                    <MapPin className="h-5 w-5 text-red-700" />
                                                    Consultation Location
                                                </Label>
                                                <p className="text-sm text-gray-600 mb-3">
                                                    Click on the map to select your preferred consultation location.
                                                </p>
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
                                                    name="consultation_latitude" 
                                                    value={selectedLocation?.lat || ''} 
                                                />
                                                <input 
                                                    type="hidden" 
                                                    name="consultation_longitude" 
                                                    value={selectedLocation?.lng || ''} 
                                                />
                                                <input 
                                                    type="hidden" 
                                                    name="consultation_location_address" 
                                                    value={selectedLocation?.address || ''} 
                                                />
                                            </div>
                                        )}

                                        <div className="grid gap-3">
                                            <Label htmlFor="phone" className="text-base font-semibold text-gray-900">Contact Phone</Label>
                                            <Input
                                                id="phone"
                                                type="tel"
                                                name="phone"
                                                required
                                                placeholder="Phone number for consultation"
                                                className="text-base"
                                            />
                                            <InputError message={errors.phone} />
                                        </div>

                                        <div className="grid gap-3">
                                            <Label htmlFor="reason" className="text-base font-semibold text-gray-900">Reason for Consultation</Label>
                                            <Textarea
                                                id="reason"
                                                name="reason"
                                                required
                                                placeholder="Please describe your concerns or what you'd like to discuss"
                                                rows={4}
                                                className="text-base"
                                            />
                                            <InputError message={errors.reason} />
                                        </div>

                                        <div className="grid gap-3">
                                            <Label htmlFor="medical_history" className="text-base font-semibold text-gray-900">Relevant Medical History (Optional)</Label>
                                            <Textarea
                                                id="medical_history"
                                                name="medical_history"
                                                placeholder="Any relevant medical history or current medications"
                                                rows={3}
                                                className="text-base"
                                            />
                                            <InputError message={errors.medical_history} />
                                        </div>
                                    </div>

                                    <div className="bg-gradient-to-r from-red-50 to-amber-50 border border-red-200 rounded-lg p-6">
                                        <div className="flex items-start gap-4">
                                            <div className="flex-shrink-0">
                                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
                                                    <MessageCircle className="h-5 w-5 text-red-700" />
                                                </div>
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="text-lg font-semibold text-gray-900 mb-3">Confidentiality Assurance</h3>
                                                <div className="space-y-3 text-gray-700">
                                                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                                                        <div className="space-y-2">
                                                            <div className="font-medium text-red-700">✓ Privacy Protection</div>
                                                            <ul className="text-xs space-y-1">
                                                                <li>• All consultations completely confidential</li>
                                                                <li>• Professional, judgment-free environment</li>
                                                                <li>• Secure communication channels</li>
                                                            </ul>
                                                        </div>
                                                        <div className="space-y-2">
                                                            <div className="font-medium text-amber-700">✓ Expert Care</div>
                                                            <ul className="text-xs space-y-1">
                                                                <li>• Qualified healthcare professionals</li>
                                                                <li>• Partner network specialists</li>
                                                                <li>• Compassionate support</li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <Button
                                        type="button"
                                        onClick={() => handleFormSubmit(submit)}
                                        className="w-full bg-gradient-to-r from-red-700 to-amber-700 hover:from-red-700 hover:to-amber-700 text-lg py-4 font-semibold"
                                        disabled={processing || hasOngoingConsultation}
                                    >
                                        {processing && (
                                            <LoaderCircle className="h-5 w-5 animate-spin mr-3" />
                                        )}
                                        Request Plus Plan
                                    </Button>
                                </>
                            )}
                        </Form>
                    </div>
                </div>
            </section>

            {/* Age Confirmation Modal */}
            <Dialog open={showAgeConfirmModal} onOpenChange={setShowAgeConfirmModal}>
                <DialogContent className="sm:max-w-md bg-gradient-to-br from-red-50 via-amber-50 to-stone-50 border border-red-200">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-red-700">
                            <Calendar className="h-5 w-5" />
                            Age Verification Required
                        </DialogTitle>
                        <DialogDescription className="text-gray-600 pt-2">
                            Plus Plan consultations are only available to individuals who are 18 years of age or older. 
                            Please confirm that you meet this age requirement to proceed with your consultation request.
                        </DialogDescription>
                    </DialogHeader>
                    
                    <div className="bg-gradient-to-r from-red-50 to-amber-50 border border-red-200 rounded-lg p-4 mt-4">
                        <div className="flex items-start gap-3">
                            <Info className="h-5 w-5 text-red-700 flex-shrink-0 mt-0.5" />
                            <div className="text-sm text-gray-700">
                                <p className="font-medium mb-1 text-red-700">Why do we ask for age verification?</p>
                                <p>Age verification ensures compliance with healthcare regulations and helps us provide appropriate professional care and guidance.</p>
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="mt-6">
                        <Button
                            variant="outline"
                            onClick={cancelAgeConfirmation}
                            className="flex-1 border-stone-300 text-stone-700 hover:bg-stone-50"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={confirmAge}
                            className="flex-1 bg-gradient-to-r from-red-700 to-amber-700 hover:from-red-800 hover:to-amber-800 text-white font-semibold"
                        >
                            I confirm I am 18+
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

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