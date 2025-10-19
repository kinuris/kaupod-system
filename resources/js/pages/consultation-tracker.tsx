import React, { useState } from 'react';
import ClientNavigation from '@/components/client-navigation';
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
import { 
    Clock, 
    Calendar, 
    MapPin, 
    User, 
    Phone, 
    MessageCircle, 
    CheckCircle, 
    AlertCircle,
    RefreshCw,
    LoaderCircle,
    X,
    Video,
    ExternalLink,
    Maximize2
} from 'lucide-react';

interface ConsultationRequest {
    id: number;
    status: string;
    phone: string;
    preferred_date: string;
    preferred_time: string;
    consultation_type: string;
    consultation_mode: string;
    consultation_latitude: number | null;
    consultation_longitude: number | null;
    consultation_location_address: string | null;
    meeting_link: string | null;
    reason: string;
    medical_history: string | null;
    scheduled_datetime: string | null;
    schedule_preferences: {
        consultation_mode?: string;
        [key: string]: unknown;
    };
    assigned_partner_doctor: {
        id: number;
        name: string;
        specialty: string;
    } | null;
    rescheduling_reason: string | null;
    last_rescheduled_at: string | null;
    timeline: Record<string, string>;
    created_at: string;
    subscription_tier: string;
    tier_price: number;
}

interface Props {
    consultationRequests: ConsultationRequest[];
}

export default function ConsultationTracker({ consultationRequests }: Props) {
    const [showRescheduleModal, setShowRescheduleModal] = useState(false);
    const [selectedConsultation, setSelectedConsultation] = useState<ConsultationRequest | null>(null);
    const [showMeetingModal, setShowMeetingModal] = useState(false);
    const [meetingUrl, setMeetingUrl] = useState<string | null>(null);

    // Format consultation type for display
    const formatConsultationType = (type: string): string => {
        switch (type?.toLowerCase()) {
            case 'hiv':
                return 'HIV';
            case 'gonorrhea':
                return 'Gonorrhea';
            case 'syphilis':
                return 'Syphilis';
            case 'chlamydia':
                return 'Chlamydia';
            default:
                return type?.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Unknown';
        }
    };

    // Get consultation mode from direct field or schedule preferences
    const getConsultationMode = (consultation: ConsultationRequest): string => {
        return consultation.consultation_mode || consultation.schedule_preferences?.consultation_mode || 'Not specified';
    };

    // Format consultation mode for display
    const formatConsultationMode = (mode: string): string => {
        if (!mode || mode === 'Not specified') return 'Not specified';
        return mode.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'in_review':
                return <Clock className="h-5 w-5 text-amber-600" />;
            case 'coordinating':
                return <RefreshCw className="h-5 w-5 text-blue-600" />;
            case 'confirmed':
                return <CheckCircle className="h-5 w-5 text-green-600" />;
            case 'reminder_sent':
                return <AlertCircle className="h-5 w-5 text-purple-600" />;
            case 'finished':
                return <CheckCircle className="h-5 w-5 text-green-800" />;
            case 'canceled':
                return <X className="h-5 w-5 text-red-600" />;
            default:
                return <Clock className="h-5 w-5 text-gray-600" />;
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'in_review':
                return 'Request In Review';
            case 'coordinating':
                return 'Coordinating Appointment';
            case 'confirmed':
                return 'Appointment Confirmed';
            case 'reminder_sent':
                return 'Reminder Sent';
            case 'finished':
                return 'Consultation Completed';
            case 'canceled':
                return 'Consultation Canceled';
            default:
                return 'Unknown Status';
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'in_review':
                return 'bg-amber-50 border-amber-200 text-amber-800';
            case 'coordinating':
                return 'bg-blue-50 border-blue-200 text-blue-800';
            case 'confirmed':
                return 'bg-green-50 border-green-200 text-green-800';
            case 'reminder_sent':
                return 'bg-purple-50 border-purple-200 text-purple-800';
            case 'finished':
                return 'bg-green-100 border-green-300 text-green-900';
            case 'canceled':
                return 'bg-red-50 border-red-200 text-red-800';
            default:
                return 'bg-gray-50 border-gray-200 text-gray-800';
        }
    };

    const canReschedule = (consultation: ConsultationRequest) => {
        return ['in_review', 'coordinating', 'confirmed'].includes(consultation.status);
    };

    const handleReschedule = (consultation: ConsultationRequest) => {
        setSelectedConsultation(consultation);
        setShowRescheduleModal(true);
    };

    const getSubscriptionTypeDisplay = (consultation: ConsultationRequest) => {
        if (!consultation.subscription_tier) {
            return {
                type: 'One Time Purchase',
                description: 'Single consultation payment',
                color: 'bg-gray-50 border-gray-200 text-gray-800',
                icon: '💰'
            };
        }

        switch (consultation.subscription_tier) {
            case 'one_time':
                return {
                    type: 'One Time Purchase',
                    description: 'Single consultation payment',
                    color: 'bg-gray-50 border-gray-200 text-gray-800',
                    icon: '💰'
                };
            case 'moderate_annual':
                return {
                    type: 'Annual Subscription Purchase',
                    description: 'Moderate Annual Plan (2 consultations)',
                    color: 'bg-blue-50 border-blue-200 text-blue-800',
                    icon: '📅'
                };
            case 'high_annual':
                return {
                    type: 'Annual Subscription Purchase',
                    description: 'High Annual Plan (4 consultations)',
                    color: 'bg-purple-50 border-purple-200 text-purple-800',
                    icon: '👑'
                };
            default:
                return {
                    type: 'Unknown',
                    description: 'Unknown subscription type',
                    color: 'bg-gray-50 border-gray-200 text-gray-800',
                    icon: '❓'
                };
        }
    };

    const isSubscriptionUsage = (consultation: ConsultationRequest, allConsultations: ConsultationRequest[]) => {
        // If it's a one-time purchase, it's not subscription usage
        if (!consultation.subscription_tier || consultation.subscription_tier === 'one_time') {
            return false;
        }

        // Find all consultations with the same subscription tier, sorted by date
        const sameTimeConsultations = allConsultations
            .filter(c => c.subscription_tier === consultation.subscription_tier)
            .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());

        // If this is the first consultation with this tier, it's the subscription purchase
        // Otherwise, it's using the existing subscription
        const consultationIndex = sameTimeConsultations.findIndex(c => c.id === consultation.id);
        return consultationIndex > 0;
    };

    return (
        <>
            <Head title="Consultation Tracker - Plus Plan - Kaupod" />
            
            <ClientNavigation />

            {/* Hero Section */}
            <section className="bg-gradient-to-br from-red-50 via-amber-50 to-stone-50 py-20">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <div className="flex justify-center mb-6">
                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-700">
                                <MessageCircle className="h-8 w-8 text-white" />
                            </div>
                        </div>
                                                    <h1 className="text-4xl text-red-800 font-bold mb-4">
                            Consultation Tracker
                        </h1>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Track your Plus Plan appointments and receive updates from our partner doctors
                        </p>
                    </div>

                    {/* Subscription Summary */}
                    {consultationRequests.length > 0 && (() => {
                        const annualConsultations = consultationRequests.filter(c => 
                            c.subscription_tier && ['moderate_annual', 'high_annual'].includes(c.subscription_tier)
                        );
                        
                        if (annualConsultations.length === 0) return null;

                        const moderateCount = annualConsultations.filter(c => c.subscription_tier === 'moderate_annual').length;
                        const highCount = annualConsultations.filter(c => c.subscription_tier === 'high_annual').length;
                        const usageCount = annualConsultations.filter(c => isSubscriptionUsage(c, consultationRequests)).length;
                        const purchaseCount = annualConsultations.length - usageCount;

                        return (
                            <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                    <span>📊</span> Subscription Summary
                                </h3>
                                <div className="grid md:grid-cols-3 gap-4 text-sm">
                                    <div className="bg-blue-50 rounded-lg p-4">
                                        <div className="font-medium text-blue-800">Moderate Annual Consultations</div>
                                        <div className="text-2xl font-bold text-blue-600">{moderateCount}</div>
                                        <div className="text-xs text-blue-600">2 consultations per subscription</div>
                                    </div>
                                    <div className="bg-purple-50 rounded-lg p-4">
                                        <div className="font-medium text-purple-800">High Annual Consultations</div>
                                        <div className="text-2xl font-bold text-purple-600">{highCount}</div>
                                        <div className="text-xs text-purple-600">4 consultations per subscription</div>
                                    </div>
                                    <div className="bg-green-50 rounded-lg p-4">
                                        <div className="font-medium text-green-800">Subscription Efficiency</div>
                                        <div className="text-2xl font-bold text-green-600">{purchaseCount} purchases</div>
                                        <div className="text-xs text-green-600">{usageCount} from existing subscriptions</div>
                                    </div>
                                </div>
                            </div>
                        );
                    })()}

                    {consultationRequests.length === 0 ? (
                        <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
                            <MessageCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Consultations Yet</h3>
                            <p className="text-gray-600 mb-6">You haven't requested any Plus Plan consultations yet.</p>
                            <Button
                                onClick={() => window.location.href = '/request/consultation'}
                                className="bg-gradient-to-r from-red-700 to-amber-700 hover:from-red-800 hover:to-amber-800"
                            >
                                Request Plus Plan
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {consultationRequests.map((consultation) => (
                                <div key={consultation.id} className="bg-white rounded-2xl shadow-xl p-6">
                                    <div className="flex items-start justify-between mb-6">
                                        <div className="flex items-center gap-4">
                                            {getStatusIcon(consultation.status)}
                                            <div>
                                                <h3 className="text-xl font-semibold text-gray-900">
                                                    {formatConsultationType(consultation.consultation_type)}
                                                </h3>
                                                <div className="flex items-center gap-2 mb-2">
                                                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(consultation.status)}`}>
                                                        {getStatusText(consultation.status)}
                                                    </div>
                                                    {(() => {
                                                        const subscriptionInfo = getSubscriptionTypeDisplay(consultation);
                                                        const isUsage = isSubscriptionUsage(consultation, consultationRequests);
                                                        
                                                        return (
                                                            <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${subscriptionInfo.color}`}>
                                                                <span className="mr-1">{subscriptionInfo.icon}</span>
                                                                {isUsage ? 'Request from Active Subscription' : subscriptionInfo.type}
                                                            </div>
                                                        );
                                                    })()}
                                                </div>
                                                {(() => {
                                                    const subscriptionInfo = getSubscriptionTypeDisplay(consultation);
                                                    const isUsage = isSubscriptionUsage(consultation, consultationRequests);
                                                    
                                                    return (
                                                        <p className="text-xs text-gray-600">
                                                            {isUsage ? 'Using existing subscription benefits' : subscriptionInfo.description}
                                                            {consultation.tier_price && ` • ₱${consultation.tier_price.toLocaleString()}`}
                                                        </p>
                                                    );
                                                })()}
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm text-gray-700 font-medium">Request ID</p>
                                            <p className="font-mono text-lg font-bold text-gray-900">#{consultation.id.toString().padStart(6, '0')}</p>
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-3">
                                                <Calendar className="h-5 w-5 text-red-700" />
                                                <div>
                                                    <p className="text-sm text-gray-700 font-medium">Preferred Date & Time</p>
                                                    <p className="font-semibold text-gray-900">
                                                        {new Date(consultation.preferred_date).toLocaleDateString()} at {consultation.preferred_time}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-3">
                                                <MessageCircle className="h-5 w-5 text-red-700" />
                                                <div>
                                                    <p className="text-sm text-gray-700 font-medium">Consultation Mode</p>
                                                    <p className="font-semibold text-gray-900 capitalize">
                                                        {formatConsultationMode(getConsultationMode(consultation))}
                                                    </p>
                                                </div>
                                            </div>

                                            {consultation.consultation_location_address && (
                                                <div className="flex items-start gap-3">
                                                    <MapPin className="h-5 w-5 text-red-700 mt-0.5" />
                                                    <div>
                                                        <p className="text-sm text-gray-700 font-medium">Location</p>
                                                        <p className="font-semibold text-gray-900">{consultation.consultation_location_address}</p>
                                                    </div>
                                                </div>
                                            )}

                                            <div className="flex items-center gap-3">
                                                <Phone className="h-5 w-5 text-red-700" />
                                                <div>
                                                    <p className="text-sm text-gray-700 font-medium">Contact Phone</p>
                                                    <p className="font-semibold text-gray-900">{consultation.phone}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            {consultation.assigned_partner_doctor && (
                                                <div className="flex items-center gap-3">
                                                    <User className="h-5 w-5 text-green-700" />
                                                    <div>
                                                        <p className="text-sm text-gray-700 font-medium">Assigned Expert</p>
                                                        <p className="font-semibold text-gray-900">{consultation.assigned_partner_doctor.name}</p>
                                                        <p className="text-sm text-green-700 font-medium">{consultation.assigned_partner_doctor.specialty}</p>
                                                    </div>
                                                </div>
                                            )}

                                            {consultation.meeting_link && 
                                             getConsultationMode(consultation) === 'online' &&
                                             ['confirmed', 'reminder_sent', 'finished'].includes(consultation.status) && (
                                                <div className="flex items-center gap-3">
                                                    <Video className="h-5 w-5 text-blue-700" />
                                                    <div className="flex-1">
                                                        <p className="text-sm text-gray-700 font-medium">Online Meeting Link</p>
                                                        <div className="flex items-center gap-2 flex-wrap">
                                                            <a
                                                                href={consultation.meeting_link}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="font-semibold text-blue-700 hover:text-blue-800 underline text-sm break-all"
                                                            >
                                                                {consultation.meeting_link}
                                                            </a>
                                                            <div className="flex gap-2">
                                                                <Button
                                                                    type="button"
                                                                    onClick={() => {
                                                                        setMeetingUrl(consultation.meeting_link);
                                                                        setShowMeetingModal(true);
                                                                    }}
                                                                    className="bg-blue-700 hover:bg-blue-800 text-white px-3 py-1 text-xs"
                                                                >
                                                                    <Video className="w-3 h-3 mr-1" />
                                                                    Join in App
                                                                </Button>
                                                                <Button
                                                                    type="button"
                                                                    onClick={() => window.open(consultation.meeting_link!, '_blank')}
                                                                    variant="outline"
                                                                    className="border-blue-700 text-blue-700 hover:bg-blue-50 px-3 py-1 text-xs"
                                                                >
                                                                    <ExternalLink className="w-3 h-3 mr-1" />
                                                                    Open External
                                                                </Button>
                                                            </div>
                                                        </div>
                                                        <p className="text-xs text-gray-600 mt-1">
                                                            Join your consultation session directly in the app or in a new tab
                                                        </p>
                                                    </div>
                                                </div>
                                            )}

                                            {consultation.scheduled_datetime && (
                                                <div className="flex items-center gap-3">
                                                    <CheckCircle className="h-5 w-5 text-green-700" />
                                                    <div>
                                                        <p className="text-sm text-gray-700 font-medium">Confirmed Appointment</p>
                                                        <p className="font-semibold text-gray-900">
                                                            {new Date(consultation.scheduled_datetime).toLocaleString()}
                                                        </p>
                                                    </div>
                                                </div>
                                            )}

                                            {consultation.last_rescheduled_at && (
                                                <div className="flex items-center gap-3">
                                                    <RefreshCw className="h-5 w-5 text-blue-700" />
                                                    <div>
                                                        <p className="text-sm text-gray-700 font-medium">Last Rescheduled</p>
                                                        <p className="font-semibold text-gray-900">
                                                            {new Date(consultation.last_rescheduled_at).toLocaleString()}
                                                        </p>
                                                        {consultation.rescheduling_reason && (
                                                            <p className="text-sm text-blue-700 font-medium">Reason: {consultation.rescheduling_reason}</p>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="border-t pt-4">
                                        <h4 className="font-semibold text-gray-900 mb-2">Consultation Reason</h4>
                                        <p className="text-gray-800 text-sm font-medium">{consultation.reason}</p>
                                    </div>

                                    {canReschedule(consultation) && (
                                        <div className="border-t pt-4 mt-4">
                                            <Button
                                                variant="outline"
                                                onClick={() => handleReschedule(consultation)}
                                                className="border-red-300 text-red-700 hover:bg-red-50"
                                            >
                                                <RefreshCw className="h-4 w-4 mr-2" />
                                                Reschedule Appointment
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Rescheduling Modal */}
            <Dialog open={showRescheduleModal} onOpenChange={setShowRescheduleModal}>
                <DialogContent className="sm:max-w-md bg-gradient-to-br from-red-50 via-amber-50 to-stone-50 border border-red-200">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-red-700">
                            <RefreshCw className="h-5 w-5" />
                            Reschedule Consultation
                        </DialogTitle>
                        <DialogDescription className="text-gray-600 pt-2">
                            Please provide at least 4 hours advance notice for rescheduling your consultation.
                        </DialogDescription>
                    </DialogHeader>
                    
                    {selectedConsultation && (
                        <Form
                            action={`/consultations/${selectedConsultation.id}/reschedule`}
                            method="post"
                            className="space-y-4"
                        >
                            {({ processing, errors }) => (
                                <>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="new_preferred_date" className="text-sm font-medium text-gray-900">New Date</Label>
                                            <Input
                                                id="new_preferred_date"
                                                type="date"
                                                name="new_preferred_date"
                                                required
                                                min={new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString().split('T')[0]}
                                            />
                                            {errors.new_preferred_date && <p className="text-sm text-red-600">{errors.new_preferred_date}</p>}
                                        </div>

                                        <div className="grid gap-2">
                                            <Label htmlFor="new_preferred_time" className="text-sm font-medium text-gray-900">New Time</Label>
                                            <select
                                                id="new_preferred_time"
                                                name="new_preferred_time"
                                                required
                                                className="border-input flex h-10 w-full min-w-0 rounded-md border bg-white text-gray-900 px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                                            >
                                                <option value="">Select time</option>
                                                <option value="09:00">9:00 AM</option>
                                                <option value="10:00">10:00 AM</option>
                                                <option value="11:00">11:00 AM</option>
                                                <option value="14:00">2:00 PM</option>
                                                <option value="15:00">3:00 PM</option>
                                                <option value="16:00">4:00 PM</option>
                                                <option value="17:00">5:00 PM</option>
                                            </select>
                                            {errors.new_preferred_time && <p className="text-sm text-red-600">{errors.new_preferred_time}</p>}
                                        </div>
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="rescheduling_reason" className="text-sm font-medium text-gray-900">Reason for Rescheduling</Label>
                                        <Textarea
                                            id="rescheduling_reason"
                                            name="rescheduling_reason"
                                            required
                                            placeholder="Please explain why you need to reschedule"
                                            rows={3}
                                        />
                                        {errors.rescheduling_reason && <p className="text-sm text-red-600">{errors.rescheduling_reason}</p>}
                                    </div>

                                    <DialogFooter className="mt-6">
                                        <Button
                                            variant="outline"
                                            onClick={() => setShowRescheduleModal(false)}
                                            className="flex-1 border-stone-300 text-stone-700 hover:bg-stone-50"
                                            disabled={processing}
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            type="submit"
                                            className="flex-1 bg-gradient-to-r from-red-700 to-amber-700 hover:from-red-800 hover:to-amber-800 text-white font-semibold"
                                            disabled={processing}
                                        >
                                            {processing && <LoaderCircle className="h-4 w-4 animate-spin mr-2" />}
                                            Reschedule
                                        </Button>
                                    </DialogFooter>
                                </>
                            )}
                        </Form>
                    )}
                </DialogContent>
            </Dialog>

            {/* Meeting Modal */}
            {showMeetingModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    {/* Blurred backdrop overlay */}
                    <div 
                        className="absolute inset-0 bg-black/70 backdrop-blur-md"
                        aria-hidden="true"
                    />
                    
                    {/* Modal Content */}
                    <div className="relative w-[95vw] h-[95vh] bg-white border-0 shadow-2xl rounded-lg overflow-hidden flex flex-col">
                        {/* Custom Header with Close Button */}
                        <div className="relative flex items-center justify-between p-4 border-b bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                            <div className="flex items-center gap-2">
                                <Video className="h-5 w-5" />
                                <h2 className="text-lg font-semibold">Online Consultation Meeting</h2>
                            </div>
                            <button
                                onClick={() => {
                                    if (window.confirm('Are you sure you want to exit the meeting? This will close your consultation session.')) {
                                        setShowMeetingModal(false);
                                    }
                                }}
                                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-red-600 hover:bg-red-700 transition-colors flex items-center justify-center text-white shadow-lg"
                                title="Exit Meeting"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                        
                        {/* Meeting Content */}
                        <div className="flex-1 bg-gray-900">
                            {meetingUrl && (
                                <iframe
                                    src={meetingUrl}
                                    className="w-full h-full border-0"
                                    allow="camera; microphone; fullscreen; speaker; display-capture"
                                    title="Kaupod Meeting"
                                />
                            )}
                        </div>
                        
                        {/* Bottom Controls */}
                        <div className="flex justify-center p-3 bg-gradient-to-r from-gray-800 to-gray-900 border-t">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => window.open(meetingUrl!, '_blank')}
                                className="border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white bg-transparent"
                            >
                                <ExternalLink className="w-4 h-4 mr-2" />
                                Open in New Tab
                            </Button>
                        </div>
                    </div>
                </div>
            )}

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