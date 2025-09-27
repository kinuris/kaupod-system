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

export default function ConsultationRequest() {
    const [consultationMode, setConsultationMode] = useState<'online' | 'in-person' | ''>('');
    const [selectedLocation, setSelectedLocation] = useState<DeliveryLocation | null>(null);
    const [showAgeConfirmModal, setShowAgeConfirmModal] = useState(false);
    const [ageConfirmed, setAgeConfirmed] = useState(false);
    const [submitCallback, setSubmitCallback] = useState<(() => void) | null>(null);

    const handleLocationSelect = (location: DeliveryLocation) => {
        setSelectedLocation(location);
    };

    const handleFormSubmit = (submit: () => void) => {
        if (!ageConfirmed) {
            setSubmitCallback(() => submit);
            setShowAgeConfirmModal(true);
        } else {
            submit();
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
            <Head title="Expert Consultation Request - Kaupod" />
            
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
                                Expert Consultation
                            </h1>
                            <div className="group relative">
                                <Info className="h-6 w-6 text-red-700 cursor-help" />
                                <div className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 w-80 p-4 bg-gray-900 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10 shadow-lg">
                                    <div className="space-y-3">
                                        <div className="font-semibold text-red-300">What's Expert Consultation?</div>
                                        <div>Professional healthcare consultations with qualified doctors from our partner network in complete confidentiality.</div>
                                        <div className="space-y-2">
                                            <div className="font-medium text-amber-300">How it works:</div>
                                            <div className="space-y-1 text-xs">
                                                <div>• 1. Submit your consultation request</div>
                                                <div>• 2. We coordinate with partner experts</div>
                                                <div>• 3. Receive confirmation via Plus Tracker</div>
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

                    {/* Information Card */}
                    <div className="bg-gradient-to-r from-red-50 to-amber-50 rounded-2xl border border-red-200 p-6 max-w-2xl mx-auto mb-8">
                        <div className="flex items-start gap-4">
                            <div className="flex-shrink-0">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
                                    <Info className="h-5 w-5 text-red-700" />
                                </div>
                            </div>
                            <div className="flex-1">
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">Expert Consultation Information</h3>
                                <div className="space-y-3 text-gray-700">
                                    <p className="text-sm">
                                        Our expert consultations connect you with qualified healthcare professionals from our trusted partner network.
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
                                                <div>• Plus Tracker for updates</div>
                                                <div>• Rescheduling if needed</div>
                                                <div>• Complete confidentiality</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl mx-auto">
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
                                            defaultValue="09"
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
                                            defaultValue="28"
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
                                            defaultValue="2025"
                                            className="border-input flex h-10 w-full min-w-0 rounded-md border bg-white text-gray-900 px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                                        >
                                            <option value="2025">2025</option>
                                            <option value="2026">2026</option>
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
                                        disabled={processing}
                                    >
                                        {processing && (
                                            <LoaderCircle className="h-5 w-5 animate-spin mr-3" />
                                        )}
                                        Request Expert Consultation
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
                            Expert consultations are only available to individuals who are 18 years of age or older. 
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