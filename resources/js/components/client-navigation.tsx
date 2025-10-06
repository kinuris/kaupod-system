import { dashboard, logout, home } from '@/routes';
import { type SharedData } from '@/types';
import { Link, usePage, router } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';

export default function ClientNavigation() {
    const { auth } = usePage<SharedData>().props;
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [isTestingDropdownOpen, setIsTestingDropdownOpen] = useState(false);
    const [isConsultationDropdownOpen, setIsConsultationDropdownOpen] = useState(false);
    const [isSupportDropdownOpen, setIsSupportDropdownOpen] = useState(false);
    const testingDropdownRef = useRef<HTMLDivElement>(null);
    const consultationDropdownRef = useRef<HTMLDivElement>(null);
    const supportDropdownRef = useRef<HTMLDivElement>(null);

    // Close mobile menu when window is resized to desktop size
    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth < 768;
            setIsMobile(mobile);
            if (!mobile) {
                setIsMobileMenuOpen(false);
                setIsTestingDropdownOpen(false);
                setIsConsultationDropdownOpen(false);
                setIsSupportDropdownOpen(false);
            }
        };

        // Set initial state
        handleResize();
        
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (testingDropdownRef.current && !testingDropdownRef.current.contains(event.target as Node)) {
                setIsTestingDropdownOpen(false);
            }
            if (consultationDropdownRef.current && !consultationDropdownRef.current.contains(event.target as Node)) {
                setIsConsultationDropdownOpen(false);
            }
            if (supportDropdownRef.current && !supportDropdownRef.current.contains(event.target as Node)) {
                setIsSupportDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
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
                <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
                    <div className="flex justify-between h-14">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <Link href={home()} className="text-2xl font-bold text-red-700">
                                    Kaupod
                                </Link>
                            </div>
                        </div>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center space-x-2">
                            {auth.user ? (
                                <>
                                    <span className="text-gray-600 text-xs whitespace-nowrap">
                                        Welcome, {auth.user.name}
                                    </span>
                                    {auth.user.role === 'client' ? (
                                        <>
                                            {/* Testing Services Dropdown */}
                                            <div className="relative" ref={testingDropdownRef}>
                                                <button
                                                    onClick={() => {
                                                        setIsTestingDropdownOpen(!isTestingDropdownOpen);
                                                        setIsConsultationDropdownOpen(false);
                                                        setIsSupportDropdownOpen(false);
                                                    }}
                                                    className="flex items-center text-red-700 hover:text-red-800 font-medium transition-colors text-sm"
                                                >
                                                    Testing Services
                                                    <ChevronDown className={`ml-0.5 h-3 w-3 transition-transform ${isTestingDropdownOpen ? 'rotate-180' : ''}`} />
                                                </button>
                                                {isTestingDropdownOpen && (
                                                    <div className="absolute top-full left-0 mt-1 w-40 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-50">
                                                        <Link 
                                                            href="/request/kit" 
                                                            className="block px-3 py-1.5 text-red-700 hover:bg-red-50 hover:text-red-800 transition-colors text-sm"
                                                            onClick={() => setIsTestingDropdownOpen(false)}
                                                        >
                                                            Pro Plan
                                                        </Link>
                                                        <Link 
                                                            href="/subscriptions" 
                                                            className="block px-3 py-1.5 text-orange-700 hover:bg-orange-50 hover:text-orange-800 transition-colors text-sm"
                                                            onClick={() => setIsTestingDropdownOpen(false)}
                                                        >
                                                            Subscriptions
                                                        </Link>
                                                    </div>
                                                )}
                                            </div>
                                            
                                            {/* Consultation Services Dropdown */}
                                            <div className="relative" ref={consultationDropdownRef}>
                                                <button
                                                    onClick={() => {
                                                        setIsConsultationDropdownOpen(!isConsultationDropdownOpen);
                                                        setIsTestingDropdownOpen(false);
                                                        setIsSupportDropdownOpen(false);
                                                    }}
                                                    className="flex items-center text-amber-700 hover:text-amber-800 font-medium transition-colors text-sm"
                                                >
                                                    Consultation Services
                                                    <ChevronDown className={`ml-0.5 h-3 w-3 transition-transform ${isConsultationDropdownOpen ? 'rotate-180' : ''}`} />
                                                </button>
                                                {isConsultationDropdownOpen && (
                                                    <div className="absolute top-full left-0 mt-1 w-44 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-50">
                                                        <Link 
                                                            href="/request/consultation" 
                                                            className="block px-3 py-1.5 text-amber-700 hover:bg-amber-50 hover:text-amber-800 transition-colors text-sm"
                                                            onClick={() => setIsConsultationDropdownOpen(false)}
                                                        >
                                                            Consultations
                                                        </Link>
                                                        <Link 
                                                            href="/plus-tracker" 
                                                            className="block px-3 py-1.5 text-stone-700 hover:bg-stone-50 hover:text-stone-800 transition-colors text-sm"
                                                            onClick={() => setIsConsultationDropdownOpen(false)}
                                                        >
                                                            Consultation Tracker
                                                        </Link>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Support Services Dropdown */}
                                            <div className="relative" ref={supportDropdownRef}>
                                                <button
                                                    onClick={() => {
                                                        setIsSupportDropdownOpen(!isSupportDropdownOpen);
                                                        setIsTestingDropdownOpen(false);
                                                        setIsConsultationDropdownOpen(false);
                                                    }}
                                                    className="flex items-center text-green-700 hover:text-green-800 font-medium transition-colors text-sm"
                                                >
                                                    Support Services
                                                    <ChevronDown className={`ml-0.5 h-3 w-3 transition-transform ${isSupportDropdownOpen ? 'rotate-180' : ''}`} />
                                                </button>
                                                {isSupportDropdownOpen && (
                                                    <div className="absolute top-full left-0 mt-1 w-40 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-50">
                                                        <Link 
                                                            href="/hiv-counseling-capiz" 
                                                            className="block px-3 py-1.5 text-green-700 hover:bg-green-50 hover:text-green-800 transition-colors text-sm"
                                                            onClick={() => setIsSupportDropdownOpen(false)}
                                                        >
                                                            HIV Counseling Hubs
                                                        </Link>
                                                        <Link 
                                                            href="/precounseling" 
                                                            className="block px-3 py-1.5 text-blue-700 hover:bg-blue-50 hover:text-blue-800 transition-colors text-sm"
                                                            onClick={() => setIsSupportDropdownOpen(false)}
                                                        >
                                                            Precounseling
                                                        </Link>
                                                        <Link 
                                                            href="/postcounseling" 
                                                            className="block px-3 py-1.5 text-teal-700 hover:bg-teal-50 hover:text-teal-800 transition-colors text-sm"
                                                            onClick={() => setIsSupportDropdownOpen(false)}
                                                        >
                                                            Postcounseling
                                                        </Link>
                                                    </div>
                                                )}
                                            </div>

                                            <Link 
                                                href="/my-orders" 
                                                className="text-gray-900 hover:text-gray-700 font-medium transition-colors text-sm whitespace-nowrap"
                                            >
                                                My Orders
                                            </Link>
                                            <Link 
                                                href="/chat" 
                                                className="text-purple-700 hover:text-purple-800 font-medium transition-colors text-sm whitespace-nowrap"
                                            >
                                                AI Assistant
                                            </Link>
                                            <Link 
                                                href="/about" 
                                                className="text-blue-700 hover:text-blue-800 font-medium transition-colors text-sm whitespace-nowrap"
                                            >
                                                About Us
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
                                        href="/chat" 
                                        className="text-purple-700 hover:text-purple-800 font-medium transition-colors"
                                    >
                                        AI Assistant
                                    </a>
                                    <a 
                                        href="/about" 
                                        className="text-blue-700 hover:text-blue-800 font-medium transition-colors"
                                    >
                                        About Us
                                    </a>
                                    <a 
                                        href="/login" 
                                        className="text-gray-600 hover:text-gray-700 transition-colors"
                                    >
                                        Login
                                    </a>
                                    <a 
                                        href="/register" 
                                        className="bg-red-700 text-white px-3 py-1.5 rounded-md hover:bg-red-800 transition-colors text-sm font-medium"
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
                <div className={`absolute top-14 left-0 right-0 bg-white border-b shadow-xl transition-all duration-300 transform ${
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
                                        {/* Testing Services Group */}
                                        <div className="py-2">
                                            <div className="text-red-700 font-semibold text-sm uppercase tracking-wide mb-2">
                                                Testing Services
                                            </div>
                                            <Link 
                                                href="/request/kit" 
                                                className="block text-red-700 hover:text-red-800 font-medium py-1 pl-4 transition-colors"
                                                onClick={closeMobileMenu}
                                            >
                                                Pro Plan
                                            </Link>
                                            <Link 
                                                href="/subscriptions" 
                                                className="block text-orange-700 hover:text-orange-800 font-medium py-1 pl-4 transition-colors"
                                                onClick={closeMobileMenu}
                                            >
                                                Subscriptions
                                            </Link>
                                        </div>
                                        
                                        {/* Consultation Services Group */}
                                        <div className="py-2">
                                            <div className="text-amber-700 font-semibold text-sm uppercase tracking-wide mb-2">
                                                Consultation Services
                                            </div>
                                            <Link 
                                                href="/request/consultation" 
                                                className="block text-amber-700 hover:text-amber-800 font-medium py-1 pl-4 transition-colors"
                                                onClick={closeMobileMenu}
                                            >
                                                Consultations
                                            </Link>
                                            <Link 
                                                href="/plus-tracker" 
                                                className="block text-stone-700 hover:text-stone-800 font-medium py-1 pl-4 transition-colors"
                                                onClick={closeMobileMenu}
                                            >
                                                Consultation Tracker
                                            </Link>
                                        </div>

                                        {/* Support Services Group */}
                                        <div className="py-2">
                                            <div className="text-green-700 font-semibold text-sm uppercase tracking-wide mb-2">
                                                Support Services
                                            </div>
                                            <Link 
                                                href="/hiv-counseling-capiz" 
                                                className="block text-green-700 hover:text-green-800 font-medium py-1 pl-4 transition-colors"
                                                onClick={closeMobileMenu}
                                            >
                                                HIV Counseling Hubs
                                            </Link>
                                            <Link 
                                                href="/precounseling" 
                                                className="block text-blue-700 hover:text-blue-800 font-medium py-1 pl-4 transition-colors"
                                                onClick={closeMobileMenu}
                                            >
                                                Precounseling
                                            </Link>
                                            <Link 
                                                href="/postcounseling" 
                                                className="block text-teal-700 hover:text-teal-800 font-medium py-1 pl-4 transition-colors"
                                                onClick={closeMobileMenu}
                                            >
                                                Postcounseling
                                            </Link>
                                        </div>

                                        <Link 
                                            href="/my-orders" 
                                            className="block text-gray-900 hover:text-gray-700 font-medium py-2 transition-colors"
                                            onClick={closeMobileMenu}
                                        >
                                            My Orders
                                        </Link>
                                        <Link 
                                            href="/chat" 
                                            className="block text-purple-700 hover:text-purple-800 font-medium py-2 transition-colors"
                                            onClick={closeMobileMenu}
                                        >
                                            AI Assistant
                                        </Link>
                                        <Link 
                                            href="/about" 
                                            className="block text-blue-700 hover:text-blue-800 font-medium py-2 transition-colors"
                                            onClick={closeMobileMenu}
                                        >
                                            About Us
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
                                    href="/chat" 
                                    className="block text-purple-700 hover:text-purple-800 font-medium py-2 transition-colors"
                                    onClick={closeMobileMenu}
                                >
                                    AI Assistant
                                </a>
                                <a 
                                    href="/about" 
                                    className="block text-blue-700 hover:text-blue-800 font-medium py-2 transition-colors"
                                    onClick={closeMobileMenu}
                                >
                                    About Us
                                </a>
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
