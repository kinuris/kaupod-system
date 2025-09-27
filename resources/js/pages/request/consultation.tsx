import InputError from '@/components/input-error';
import ClientNavigation from '@/components/client-navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Form, Head } from '@inertiajs/react';
import { LoaderCircle, MessageCircle } from 'lucide-react';

export default function ConsultationRequest() {
    return (
        <>
            <Head title="Medical Consultation Request - Kaupod" />
            
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
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                            Medical Consultation
                        </h1>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Connect with qualified healthcare professionals in a judgment-free environment
                        </p>
                    </div>

                    <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl mx-auto">
                        <Form
                            action="/request/consultation"
                            method="post"
                            className="space-y-6"
                        >
                            {({ processing, errors }) => (
                                <>
                                    <div className="space-y-6">
                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div className="grid gap-3">
                                                <Label htmlFor="preferred_date" className="text-base font-semibold text-gray-900">Preferred Date</Label>
                                                <Input
                                                    id="preferred_date"
                                                    type="date"
                                                    name="preferred_date"
                                                    required
                                                    className="text-base"
                                                />
                                                <InputError message={errors.preferred_date} />
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

                                    <div className="bg-red-700 border border-red-200 rounded-lg p-6">
                                        <h3 className="font-semibold text-red-700 mb-3">Confidentiality Assurance</h3>
                                        <ul className="text-red-700 space-y-2">
                                            <li className="flex items-start gap-2">
                                                <span className="text-red-700 font-bold">•</span>
                                                All consultations are completely confidential
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <span className="text-red-700 font-bold">•</span>
                                                Professional, judgment-free environment
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <span className="text-red-700 font-bold">•</span>
                                                Qualified healthcare professionals
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <span className="text-red-700 font-bold">•</span>
                                                Secure communication channels
                                            </li>
                                        </ul>
                                    </div>

                                    <Button
                                        type="submit"
                                        className="w-full bg-gradient-to-r from-red-700 to-amber-700 hover:from-red-700 hover:to-amber-700 text-lg py-4 font-semibold"
                                        disabled={processing}
                                    >
                                        {processing && (
                                            <LoaderCircle className="h-5 w-5 animate-spin mr-3" />
                                        )}
                                        Request Consultation
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
                        <p className="text-gray-400">&copy; 2024 Kaupod. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </>
    );
}