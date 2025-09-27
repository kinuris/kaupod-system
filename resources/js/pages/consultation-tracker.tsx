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
    LoaderCircle
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
    reason: string;
    medical_history: string | null;
    scheduled_datetime: string | null;
    assigned_partner_doctor: {
        id: number;
        name: string;
        specialty: string;
    } | null;
    rescheduling_reason: string | null;
    last_rescheduled_at: string | null;
    timeline: Record<string, string>;
    created_at: string;
}

interface Props {
    consultationRequests: ConsultationRequest[];
}

export default function ConsultationTracker({ consultationRequests }: Props) {
    const [showRescheduleModal, setShowRescheduleModal] = useState(false);
    const [selectedConsultation, setSelectedConsultation] = useState<ConsultationRequest | null>(null);

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'received':
                return <Clock className="h-5 w-5 text-amber-600" />;
            case 'coordinating':
                return <RefreshCw className="h-5 w-5 text-blue-600" />;
            case 'confirmed':
                return <CheckCircle className="h-5 w-5 text-green-600" />;
            case 'reminder_sent':
                return <AlertCircle className="h-5 w-5 text-purple-600" />;
            default:
                return <Clock className="h-5 w-5 text-gray-600" />;
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'received':
                return 'Request Received';
            case 'coordinating':
                return 'Coordinating Appointment';
            case 'confirmed':
                return 'Appointment Confirmed';
            case 'reminder_sent':
                return 'Reminder Sent';
            default:
                return 'Unknown Status';
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'received':
                return 'bg-amber-50 border-amber-200 text-amber-800';
            case 'coordinating':
                return 'bg-blue-50 border-blue-200 text-blue-800';
            case 'confirmed':
                return 'bg-green-50 border-green-200 text-green-800';
            case 'reminder_sent':
                return 'bg-purple-50 border-purple-200 text-purple-800';
            default:
                return 'bg-gray-50 border-gray-200 text-gray-800';
        }
    };

    const canReschedule = (consultation: ConsultationRequest) => {
        return ['received', 'coordinating', 'confirmed'].includes(consultation.status);
    };

    const handleReschedule = (consultation: ConsultationRequest) => {
        setSelectedConsultation(consultation);
        setShowRescheduleModal(true);
    };

    return (
        <>
            <Head title="Plus Tracker - Expert Consultations - Kaupod" />
            
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
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                            Plus Tracker
                        </h1>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Track your expert consultation appointments and receive updates from our partner doctors
                        </p>
                    </div>

                    {consultationRequests.length === 0 ? (
                        <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
                            <MessageCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Consultations Yet</h3>
                            <p className="text-gray-600 mb-6">You haven't requested any expert consultations yet.</p>
                            <Button
                                onClick={() => window.location.href = '/request/consultation'}
                                className="bg-gradient-to-r from-red-700 to-amber-700 hover:from-red-800 hover:to-amber-800"
                            >
                                Request Expert Consultation
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
                                                    {consultation.consultation_type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                                </h3>
                                                <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(consultation.status)}`}>
                                                    {getStatusText(consultation.status)}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm text-gray-500">Request ID</p>
                                            <p className="font-mono text-lg font-semibold">#{consultation.id.toString().padStart(6, '0')}</p>
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-3">
                                                <Calendar className="h-5 w-5 text-red-700" />
                                                <div>
                                                    <p className="text-sm text-gray-500">Preferred Date & Time</p>
                                                    <p className="font-medium">
                                                        {new Date(consultation.preferred_date).toLocaleDateString()} at {consultation.preferred_time}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-3">
                                                <MessageCircle className="h-5 w-5 text-red-700" />
                                                <div>
                                                    <p className="text-sm text-gray-500">Consultation Mode</p>
                                                    <p className="font-medium capitalize">
                                                        {consultation.consultation_mode.replace('-', ' ')}
                                                    </p>
                                                </div>
                                            </div>

                                            {consultation.consultation_mode === 'in-person' && consultation.consultation_location_address && (
                                                <div className="flex items-start gap-3">
                                                    <MapPin className="h-5 w-5 text-red-700 mt-0.5" />
                                                    <div>
                                                        <p className="text-sm text-gray-500">Location</p>
                                                        <p className="font-medium">{consultation.consultation_location_address}</p>
                                                    </div>
                                                </div>
                                            )}

                                            <div className="flex items-center gap-3">
                                                <Phone className="h-5 w-5 text-red-700" />
                                                <div>
                                                    <p className="text-sm text-gray-500">Contact Phone</p>
                                                    <p className="font-medium">{consultation.phone}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            {consultation.assigned_partner_doctor && (
                                                <div className="flex items-center gap-3">
                                                    <User className="h-5 w-5 text-green-700" />
                                                    <div>
                                                        <p className="text-sm text-gray-500">Assigned Expert</p>
                                                        <p className="font-medium">{consultation.assigned_partner_doctor.name}</p>
                                                        <p className="text-sm text-green-700">{consultation.assigned_partner_doctor.specialty}</p>
                                                    </div>
                                                </div>
                                            )}

                                            {consultation.scheduled_datetime && (
                                                <div className="flex items-center gap-3">
                                                    <CheckCircle className="h-5 w-5 text-green-700" />
                                                    <div>
                                                        <p className="text-sm text-gray-500">Confirmed Appointment</p>
                                                        <p className="font-medium">
                                                            {new Date(consultation.scheduled_datetime).toLocaleString()}
                                                        </p>
                                                    </div>
                                                </div>
                                            )}

                                            {consultation.last_rescheduled_at && (
                                                <div className="flex items-center gap-3">
                                                    <RefreshCw className="h-5 w-5 text-blue-700" />
                                                    <div>
                                                        <p className="text-sm text-gray-500">Last Rescheduled</p>
                                                        <p className="font-medium">
                                                            {new Date(consultation.last_rescheduled_at).toLocaleString()}
                                                        </p>
                                                        {consultation.rescheduling_reason && (
                                                            <p className="text-sm text-blue-700">Reason: {consultation.rescheduling_reason}</p>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="border-t pt-4">
                                        <h4 className="font-medium text-gray-900 mb-2">Consultation Reason</h4>
                                        <p className="text-gray-700 text-sm">{consultation.reason}</p>
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