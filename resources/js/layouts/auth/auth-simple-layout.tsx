import AppLogoIcon from '@/components/app-logo-icon';
import { home } from '@/routes';
import { Link } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';

interface AuthLayoutProps {
    name?: string;
    title?: string;
    description?: string;
}

export default function AuthSimpleLayout({
    children,
    title,
    description,
}: PropsWithChildren<AuthLayoutProps>) {
    return (
        <div className="flex min-h-svh bg-gradient-to-br from-red-50 via-amber-50 to-stone-50">
            {/* Left side - Inspiring Branding */}
            <div className="hidden lg:flex lg:w-1/2 flex-col justify-center items-center bg-gradient-to-br from-red-700 to-amber-700 text-white p-12">
                <div className="max-w-md text-center">
                    <Link href={home()} className="mb-8 inline-block">
                        <div className="flex items-center justify-center space-x-4">
                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white">
                                <AppLogoIcon className="size-14 object-contain" />
                            </div>
                            <div className="text-left">
                                <div className="text-3xl font-bold">Kaupod</div>
                                <div className="text-red-100">Private Health Care</div>
                            </div>
                        </div>
                    </Link>
                    
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-xl font-semibold mb-2">Private & Secure</h3>
                            <p className="text-red-100">
                                Your reproductive health journey with complete confidentiality.
                            </p>
                        </div>
                    </div>
                </div>
            </div>


            {/* Right side - Form */}
            <div className="flex flex-1 flex-col items-center justify-center p-6 md:p-10 lg:w-1/2">
                <div className="w-full max-w-md">
                    <div className="bg-white rounded-lg shadow border p-8">
                        <div className="flex flex-col items-center gap-6 mb-8">
                            {/* Mobile logo */}
                            <Link
                                href={home()}
                                className="lg:hidden flex flex-col items-center gap-2"
                            >
                                <div className="flex h-12 w-12 items-center justify-center rounded-full">
                                    <AppLogoIcon className="min-w-20 object-contain" />
                                </div>
                                <span className="text-xl font-bold text-red-700">Kaupod</span>
                            </Link>

                            <div className="space-y-2 text-center">
                                <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
                                <p className="text-gray-600">
                                    {description}
                                </p>
                            </div>
                        </div>
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}
