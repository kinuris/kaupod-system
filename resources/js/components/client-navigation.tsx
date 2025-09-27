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
                            <Link href={home()} className="text-2xl font-bold text-red-700">
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
                                            className="text-red-700 hover:text-red-700 font-medium"
                                        >
                                            Testing Kits
                                        </Link>
                                        <Link 
                                            href="/request/consultation" 
                                            className="text-amber-700 hover:text-amber-700 font-medium"
                                        >
                                            Consultations
                                        </Link>
                                        <Link 
                                            href="/my-orders" 
                                            className="text-stone-700 hover:text-stone-700 font-medium"
                                        >
                                            My Orders
                                        </Link>
                                    </>
                                ) : (
                                    <Link href={dashboard()} className="text-red-700 hover:text-red-700 font-medium">
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
                                    className="bg-red-700 text-white px-4 py-2 rounded-lg hover:bg-red-700"
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