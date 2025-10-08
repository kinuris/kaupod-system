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
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="name"
                                    name="name"
                                    placeholder="Enter your full name"
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
                                        <div className="text-xs text-gray-700 space-y-2 max-h-32 overflow-y-auto">
                                            <p className="font-medium">Welcome to Kaupod!</p>
                                            <p>By accessing or using our website, you agree to comply with and be bound by the following Terms and Conditions.</p>
                                            
                                            <div className="space-y-1">
                                                <p><strong>1. Use of the Website:</strong> Kaupod is an ICT-based platform providing automated risk assessment, HIV-related information, and health services access in partnership with DOH and Capiz Shells Organization, Inc.</p>
                                                
                                                <p><strong>2. Services Provided:</strong> We offer Pro Plan (HIV self-test kits) and Plus Plan (medical consultations) with risk-based delivery schedules.</p>
                                                
                                                <p><strong>3. User Responsibility:</strong> You are responsible for accurate information and acknowledge Kaupod facilitates access to health services.</p>
                                                
                                                <p><strong>4. Confidentiality:</strong> All personal information is handled with strict confidentiality and used only for service delivery.</p>
                                                
                                                <p><strong>5. Subscriptions:</strong> All Pro Plan and Plus Plan subscriptions are strictly non-refundable.</p>
                                                
                                                <p><strong>6. Intellectual Property:</strong> All content and materials are owned by or licensed to Kaupod and are protected under applicable laws.</p>
                                                
                                                <p><strong>7. Changes to Terms:</strong> Kaupod reserves the right to update these Terms and Conditions at any time.</p>
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
