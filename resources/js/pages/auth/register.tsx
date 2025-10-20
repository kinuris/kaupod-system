import RegisteredUserController from '@/actions/App/Http/Controllers/Auth/RegisteredUserController';
import { login } from '@/routes';
import { Form, Head } from '@inertiajs/react';
import { LoaderCircle, Info } from 'lucide-react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';

export default function Register() {
    return (
        <AuthLayout
            title="Create an account"
            description="Get started with Kaupod"
        >
            <Head title="Sign Up - Kaupod" />

            <Form
                {...RegisteredUserController.store.form()}
                resetOnSuccess={['password', 'password_confirmation']}
                disableWhileProcessing
                className="space-y-6"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="space-y-4">
                            <div className="grid gap-2">
                                <Label htmlFor="name">Codename</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="name"
                                    name="name"
                                    placeholder="Enter a codename"
                                />
                                <InputError message={errors.name} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    required
                                    tabIndex={2}
                                    autoComplete="email"
                                    name="email"
                                    placeholder="Enter your email address"
                                />
                                <InputError message={errors.email} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    required
                                    tabIndex={3}
                                    autoComplete="new-password"
                                    name="password"
                                    placeholder="Create a secure password"
                                />
                                <InputError message={errors.password} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="password_confirmation">Confirm Password</Label>
                                <Input
                                    id="password_confirmation"
                                    type="password"
                                    required
                                    tabIndex={4}
                                    autoComplete="new-password"
                                    name="password_confirmation"
                                    placeholder="Confirm your password"
                                />
                                <InputError message={errors.password_confirmation} />
                            </div>

                            {/* Terms and Conditions */}
                            <div className="bg-gradient-to-r from-gray-50 to-stone-50 border border-gray-200 rounded-lg p-4">
                                <div className="flex items-start gap-3">
                                    <div className="flex-shrink-0">
                                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-100">
                                            <Info className="h-3 w-3 text-gray-700" />
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-base font-semibold text-gray-900 mb-2">Terms and Conditions</h3>
                                        <div className="text-xs text-gray-700 space-y-2 max-h-40 overflow-y-auto">
                                            <p className="font-medium">Welcome to Kaupod!</p>
                                            <p>By accessing or using our website, you agree to comply with and be bound by the following Terms and Conditions. Please read them carefully before using our services.</p>
                                            
                                            <div className="space-y-2">
                                                <div>
                                                    <p><strong>1. Use of the Website</strong></p>
                                                    <p className="ml-2">The Kaupod website is an ICT-based platform designed to provide automated risk assessment, HIV-related information, and access to health services in partnership with the Department of Health (DOH) and Capiz Shells Organization, Inc. You agree to use the website solely for lawful purposes related to personal healthcare needs and not in any way that may disrupt or compromise the platform. Any misuse, including attempts to interfere with its security or functionality, is strictly prohibited.</p>
                                                </div>
                                                
                                                <div>
                                                    <p><strong>2. Services Provided</strong></p>
                                                    <p className="ml-2">Kaupod offers key features including a risk assessment chatbot, risk categorization, HIV hub locator, pre- and post-test counseling and medication access to Antiretroviral Therapy (ART). Other services available: Pro Plan (Access to HIV, Chlamydia, Gonorrhea, Syphilis self-test kits through either a one-time purchase or subscription), Plus Plan (Facilitated booking and hosting of medical consultations with specialists), and In-app Purchases (sexual health products like condoms, contraceptive pills, pregnancy tests and supplements). Service availability may vary depending on location and partnerships and is subject to change without prior notice.</p>
                                                </div>
                                                
                                                <div>
                                                    <p><strong>3. User Responsibility</strong></p>
                                                    <p className="ml-2">You are responsible for ensuring the accuracy of all information provided when using the website or subscribing to services. You acknowledge that decisions made based on the services are at your own discretion and that Kaupod serves as a facilitator of access to health services, not a replacement for licensed medical professionals.</p>
                                                </div>
                                                
                                                <div>
                                                    <p><strong>4. Confidentiality and Data Use</strong></p>
                                                    <p className="ml-2">All personal information collected through the platform is handled with strict confidentiality and used only for the purpose of facilitating risk assessment, service delivery, and appointment scheduling. Kaupod will never disclose personal data to third parties without the user's consent, except as required by law or to fulfill service coordination with official health partners.</p>
                                                </div>
                                                
                                                <div>
                                                    <p><strong>5. Subscriptions and Payments</strong></p>
                                                    <p className="ml-2">All Pro Plan and Plus Plan subscriptions are strictly non-refundable. Subscribers may opt out and discontinue services at any time; however, no refunds will be issued for prior payments. Payment terms, fees, and available packages are clearly indicated on the website and may be updated periodically.</p>
                                                </div>
                                                
                                                <div>
                                                    <p><strong>6. Intellectual Property</strong></p>
                                                    <p className="ml-2">All content, design, and materials on the Kaupod website, software-driven features, and service frameworks, except educational resources, are owned by or licensed to Kaupod and are protected under applicable copyright and intellectual property laws. Unauthorized reproduction, distribution, or modification of any part of the platform is prohibited without prior written consent.</p>
                                                </div>
                                                
                                                <div>
                                                    <p><strong>7. Changes to Terms</strong></p>
                                                    <p className="ml-2">Kaupod reserves the right to update or revise these Terms and Conditions at any time. Continued use of the website and its services after changes are posted constitutes acceptance of the revised terms.</p>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-start gap-2 mt-3">
                                            <input 
                                                type="checkbox" 
                                                id="terms_accepted" 
                                                name="terms_accepted" 
                                                required
                                                tabIndex={5}
                                                className="h-4 w-4 text-red-700 border-gray-300 rounded focus:ring-red-700 mt-0.5"
                                            />
                                            <label htmlFor="terms_accepted" className="text-xs font-medium text-gray-900">
                                                I acknowledge that I have read, understood, and agree to be bound by these Terms and Conditions
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="w-full bg-gradient-to-r from-red-700 to-amber-700 hover:from-red-700 hover:to-amber-700"
                                tabIndex={6}
                                data-test="register-user-button"
                            >
                                {processing && (
                                    <LoaderCircle className="h-4 w-4 animate-spin mr-2" />
                                )}
                                Create account
                            </Button>
                        </div>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-white px-2 text-muted-foreground">Or</span>
                            </div>
                        </div>

                        <div className="text-center">
                            <TextLink 
                                href={login()} 
                                tabIndex={7}
                                className="text-sm text-red-700 hover:text-red-800 underline"
                            >
                                Already have an account? Sign in
                            </TextLink>
                        </div>
                    </>
                )}
            </Form>
        </AuthLayout>
    );
}
