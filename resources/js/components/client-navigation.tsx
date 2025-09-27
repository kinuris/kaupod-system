import { dashboard, logout, home } from '@/routes';
import { type SharedData } from '@/types';
import { Link, usePage, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

export default function ClientNavigation() {
    const { auth } = usePage<SharedData>().props;
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    // Close mobile menu when window is resized to desktop size
    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth < 768;
            setIsMobile(mobile);
            if (!mobile) {
                setIsMobileMenuOpen(false);
            }
        };

        // Set initial state
        handleResize();
        
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Prevent body scroll when mobile menu is open
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isMobileMenuOpen]);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
    };

    return (
        <>
            <nav className="bg-white shadow-sm relative z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <Link href={home()} className="text-2xl font-bold text-red-700">
                                    Kaupod
                                </Link>
                            </div>
                        </div>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center space-x-4">
                            {auth.user ? (
                                <>
                                    <span className="text-gray-600 text-sm">
                                        Welcome, {auth.user.name}
                                    </span>
                                    {auth.user.role === 'client' ? (
                                        <>
                                            <Link 
                                                href="/request/kit" 
                                                className="text-red-700 hover:text-red-800 font-medium transition-colors"
                                            >
                                                Testing Kits
                                            </Link>
                                            <Link 
                                                href="/request/consultation" 
                                                className="text-amber-700 hover:text-amber-800 font-medium transition-colors"
                                            >
                                                Consultations
                                            </Link>
                                            <Link 
                                                href="/my-orders" 
                                                className="text-gray-900 hover:text-gray-700 font-medium transition-colors"
                                            >
                                                My Orders
                                            </Link>
                                        </>
                                    ) : (
                                        <Link href={dashboard()} className="text-red-700 hover:text-red-800 font-medium transition-colors">
                                            Dashboard
                                        </Link>
                                    )}
                                    <Link 
                                        href={logout()} 
                                        as="button"
                                        method="post"
                                        className="text-gray-600 hover:text-gray-700 font-medium transition-colors"
                                        onClick={() => router.flushAll()}
                                    >
                                        Logout
                                    </Link>
                                </>
                            ) : (
                                <>
                                    <a 
                                        href="/login" 
                                        className="text-gray-600 hover:text-gray-700 transition-colors"
                                    >
                                        Login
                                    </a>
                                    <a 
                                        href="/register" 
                                        className="bg-red-700 text-white px-4 py-2 rounded-lg hover:bg-red-800 transition-colors"
                                    >
                                        Get Started
                                    </a>
                                </>
                            )}
                        </div>

                        {/* Mobile Menu Button - Only render on mobile */}
                        {isMobile && (
                            <div className="flex items-center">
                                <button
                                    onClick={toggleMobileMenu}
                                    className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-red-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-red-500 transition-all duration-200"
                                    aria-expanded={isMobileMenuOpen}
                                    aria-label={isMobileMenuOpen ? "Close main menu" : "Open main menu"}
                                >
                                    <span className="sr-only">{isMobileMenuOpen ? "Close main menu" : "Open main menu"}</span>
                                    {isMobileMenuOpen ? (
                                        <X className="block h-6 w-6 transition-transform duration-300 rotate-90" />
                                    ) : (
                                        <Menu className="block h-6 w-6 transition-transform duration-300" />
                                    )}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </nav>

            {/* Mobile Menu Overlay - Only render on mobile */}
            {isMobile && (
                <div className={`fixed inset-0 z-40 transition-all duration-300 ${
                    isMobileMenuOpen 
                        ? 'opacity-100 pointer-events-auto' 
                        : 'opacity-0 pointer-events-none'
                }`}>
                {/* Backdrop with blur */}
                <div 
                    className="absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity duration-300"
                    onClick={closeMobileMenu}
                />
                
                {/* Mobile Menu Panel */}
                <div className={`absolute top-16 left-0 right-0 bg-white border-b shadow-xl transition-all duration-300 transform ${
                    isMobileMenuOpen 
                        ? 'translate-y-0 opacity-100' 
                        : '-translate-y-full opacity-0'
                }`}>
                    <div className="px-4 py-6 space-y-4">
                        {auth.user ? (
                            <>
                                <div className="pb-4 border-b border-gray-200">
                                    <span className="text-gray-600 text-sm">
                                        Welcome, {auth.user.name}
                                    </span>
                                </div>
                                {auth.user.role === 'client' ? (
                                    <>
                                        <Link 
                                            href="/request/kit" 
                                            className="block text-red-700 hover:text-red-800 font-medium py-2 transition-colors"
                                            onClick={closeMobileMenu}
                                        >
                                            Testing Kits
                                        </Link>
                                        <Link 
                                            href="/request/consultation" 
                                            className="block text-amber-700 hover:text-amber-800 font-medium py-2 transition-colors"
                                            onClick={closeMobileMenu}
                                        >
                                            Consultations
                                        </Link>
                                        <Link 
                                            href="/my-orders" 
                                            className="block text-gray-900 hover:text-gray-700 font-medium py-2 transition-colors"
                                            onClick={closeMobileMenu}
                                        >
                                            My Orders
                                        </Link>
                                    </>
                                ) : (
                                    <Link 
                                        href={dashboard()} 
                                        className="block text-red-700 hover:text-red-800 font-medium py-2 transition-colors"
                                        onClick={closeMobileMenu}
                                    >
                                        Dashboard
                                    </Link>
                                )}
                                <div className="pt-4 border-t border-gray-200">
                                    <Link 
                                        href={logout()} 
                                        as="button"
                                        method="post"
                                        className="block text-gray-600 hover:text-gray-700 font-medium py-2 transition-colors"
                                        onClick={() => {
                                            closeMobileMenu();
                                            router.flushAll();
                                        }}
                                    >
                                        Logout
                                    </Link>
                                </div>
                            </>
                        ) : (
                            <>
                                <a 
                                    href="/login" 
                                    className="block text-gray-600 hover:text-gray-700 py-2 transition-colors"
                                    onClick={closeMobileMenu}
                                >
                                    Login
                                </a>
                                <a 
                                    href="/register" 
                                    className="block bg-red-700 text-white px-4 py-3 rounded-lg hover:bg-red-800 text-center font-medium transition-colors"
                                    onClick={closeMobileMenu}
                                >
                                    Get Started
                                </a>
                            </>
                        )}
                    </div>
                </div>
            </div>
            )}
        </>
    );
}
