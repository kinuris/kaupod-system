import { dashboard, logout, home } from '@/routes';
import { type SharedData } from '@/types';
import { Link, usePage, router } from '@inertiajs/react';

export default function ClientNavigation() {
    const { auth } = usePage<SharedData>().props;

    return (
        <nav className="bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <Link href={home()} className="text-2xl font-bold text-pink-600">
                                Kaupod
                            </Link>
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        {auth.user ? (
                            <>
                                <span className="text-gray-600 text-sm">
                                    Welcome, {auth.user.name}
                                </span>
                                {auth.user.role === 'client' ? (
                                    <>
                                        <Link 
                                            href="/request/kit" 
                                            className="text-pink-600 hover:text-pink-700 font-medium"
                                        >
                                            Privacy Kits
                                        </Link>
                                        <Link 
                                            href="/request/consultation" 
                                            className="text-teal-600 hover:text-teal-700 font-medium"
                                        >
                                            Consultations
                                        </Link>
                                    </>
                                ) : (
                                    <Link href={dashboard()} className="text-pink-600 hover:text-pink-700 font-medium">
                                        Dashboard
                                    </Link>
                                )}
                                <Link 
                                    href={logout()} 
                                    as="button"
                                    method="post"
                                    className="text-gray-600 hover:text-gray-700 font-medium"
                                    onClick={() => router.flushAll()}
                                >
                                    Logout
                                </Link>
                            </>
                        ) : (
                            <>
                                <a 
                                    href="/login" 
                                    className="text-gray-600 hover:text-gray-700"
                                >
                                    Login
                                </a>
                                <a 
                                    href="/register" 
                                    className="bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700"
                                >
                                    Get Started
                                </a>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}