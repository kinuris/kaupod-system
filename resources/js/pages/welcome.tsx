import ClientNavigation from '@/components/client-navigation';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="Kaupod - Reproductive Health Care" />
            
            <ClientNavigation />

            {/* Hero Section */}
            <section className="bg-gradient-to-br from-red-50 to-amber-50 py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                        Private, Compassionate
                        <span className="text-red-700 block">Health Care</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
                        Access reproductive health services with complete privacy and dignity. 
                        Your health, your choice, your confidentiality.
                    </p>
                    <a href="/register" className="inline-block bg-red-700 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-red-800 transition-colors">
                        Start Your Journey
                    </a>
                </div>
            </section>

            {/* Services Section */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Our Services
                        </h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Comprehensive reproductive health solutions designed with your privacy and comfort in mind.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-12">
                        <div className="bg-red-50 rounded-2xl p-8 border border-red-100">
                            <div className="w-12 h-12 bg-red-700 rounded-lg flex items-center justify-center mb-6">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">HIV Testing Kits</h3>
                            <p className="text-gray-600 mb-6 leading-relaxed">
                                Confidential HIV testing kits delivered discreetly to your exact location. Complete the test privately, 
                                schedule pickup through our platform, and receive secure results directly in your Kaupod account.
                            </p>
                            {auth.user ? (
                                <Link href="/request/kit" className="inline-block bg-red-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-800 transition-colors">
                                    Order HIV Testing Kit
                                </Link>
                            ) : (
                                <a href="/register" className="inline-block bg-red-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-800 transition-colors">
                                    Order HIV Testing Kit
                                </a>
                            )}
                        </div>

                        <div className="bg-amber-50 rounded-2xl p-8 border border-amber-100">
                            <div className="w-12 h-12 bg-amber-700 rounded-lg flex items-center justify-center mb-6">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">Medical Consultations</h3>
                            <p className="text-gray-600 mb-6 leading-relaxed">
                                Connect with qualified healthcare professionals in a judgment-free environment. 
                                Get the guidance and support you need with complete confidentiality.
                            </p>
                            {auth.user ? (
                                <Link href="/request/consultation" className="inline-block bg-amber-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-amber-800 transition-colors">
                                    Book Consultation
                                </Link>
                            ) : (
                                <a href="/register" className="inline-block bg-amber-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-amber-800 transition-colors">
                                    Book Consultation
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* AI Companion Section */}
            <section className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Your Personal Health Companion
                        </h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Get instant, confidential support with our AI-powered health companion.
                        </p>
                    </div>

                    <div className="bg-white rounded-2xl shadow-xl p-8 max-w-4xl mx-auto">
                        <div className="grid md:grid-cols-2 gap-8 items-center">
                            <div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                                    24/7 Confidential Support
                                </h3>
                                <p className="text-gray-600 mb-6 leading-relaxed">
                                    Our AI companion provides immediate, judgment-free guidance on reproductive health topics. 
                                    All conversations are completely private and never stored.
                                </p>
                                {auth.user ? (
                                    <Link href={'/chat'} className="inline-block bg-stone-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-stone-800 transition-colors">
                                        Try AI Companion
                                    </Link>
                                ) : (
                                    <a href="/register" className="inline-block bg-stone-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-stone-800 transition-colors">
                                        Try AI Companion
                                    </a>
                                )}
                            </div>
                            <div className="bg-gradient-to-br from-amber-100 to-red-100 rounded-xl p-6">
                                <div className="bg-white rounded-lg p-4 shadow-sm mb-4">
                                    <p className="text-sm text-gray-600">
                                        "I need guidance about reproductive health options. Can you help?"
                                    </p>
                                </div>
                                <div className="bg-stone-700 text-white rounded-lg p-4">
                                    <p className="text-sm">
                                        I'm here to provide confidential, judgment-free guidance. I can help you understand your options and connect you with appropriate services.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-r from-red-700 to-stone-800">
                <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                        Ready to Take Control of Your Health?
                    </h2>
                    <p className="text-xl text-red-100 mb-8">
                        Join thousands who trust Kaupod for private, compassionate reproductive health care.
                    </p>
                    <a href="/register" className="inline-block bg-white text-red-700 px-8 py-4 rounded-lg text-lg font-bold hover:bg-gray-50 transition-colors">
                        Get Started Today
                    </a>
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
                        <p className="text-gray-400">&copy; 2025 Kaupod. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </>
    );
}
