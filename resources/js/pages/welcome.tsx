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
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">Pro Plan</h3>
                            <p className="text-gray-600 mb-6 leading-relaxed">
                                Confidential HIV testing kits delivered discreetly to your exact location. Complete the test privately, 
                                schedule pickup through our platform, and receive secure results directly in your Kaupod account.
                            </p>
                            {auth.user ? (
                                <Link href="/request/kit" className="inline-block bg-red-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-800 transition-colors">
                                    Get Pro Plan
                                </Link>
                            ) : (
                                <a href="/register" className="inline-block bg-red-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-800 transition-colors">
                                    Get Pro Plan
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

            {/* Comprehensive Features Section */}
            <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Complete HIV Care Solutions
                        </h2>
                        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                            From risk assessment to comprehensive care plans, we provide end-to-end HIV health services with complete confidentiality and professional support.
                        </p>
                    </div>

                    {/* Feature Grid */}
                    <div className="grid lg:grid-cols-2 gap-8 mb-16">
                        {/* Risk Assessment */}
                        <div className="bg-white rounded-2xl p-8 shadow-lg">
                            <div className="flex items-center mb-6">
                                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mr-4">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900">Assess Your HIV Risk</h3>
                            </div>
                            <p className="text-gray-600 mb-4">
                                Use our confidential chatbot to assess your HIV risk with accuracy and ease. Know your risk level instantly based on your responses.
                            </p>
                            <a href="/chat" className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                                Start Risk Assessment
                            </a>
                        </div>

                        {/* Hub Locations */}
                        <div className="bg-white rounded-2xl p-8 shadow-lg">
                            <div className="flex items-center mb-6">
                                <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mr-4">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900">Locate HIV Services</h3>
                            </div>
                            <p className="text-gray-600 mb-4">
                                Find HIV services with pinned hub locations across Capiz. Access comprehensive location details and contact information.
                            </p>
                            <a href="/hiv-counseling-capiz" className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors">
                                Find HIV Hubs
                            </a>
                        </div>

                        {/* Pre & Post Counseling */}
                        <div className="bg-white rounded-2xl p-8 shadow-lg lg:col-span-2">
                            <div className="flex items-center mb-6">
                                <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mr-4">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900">Professional Counseling Services</h3>
                            </div>
                            <p className="text-gray-600 mb-6">
                                Experience comprehensive pre-and-post counseling services offered by the Department of Health (DOH) before purchasing or subscribing to our services.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <a href="/precounseling" className="inline-block bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors text-center">
                                    Pre-Counseling Info
                                </a>
                                <a href="/postcounseling" className="inline-block bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors text-center">
                                    Post-Counseling Info
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Service Plans */}
                    <div className="bg-white rounded-2xl shadow-xl p-8">
                        <div className="text-center mb-12">
                            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                                Choose Your Care Plan
                            </h3>
                            <p className="text-lg text-gray-600">
                                Select the plan that best fits your needs with flexible payment options.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8">
                            {/* Pro Plan */}
                            <div className="border-2 border-red-200 rounded-2xl p-8 relative">
                                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                                    <span className="bg-red-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
                                        Pro Plan
                                    </span>
                                </div>
                                <div className="text-center mb-6 mt-4">
                                    <h4 className="text-2xl font-bold text-gray-900 mb-2">HIV Testing Kit Service</h4>
                                    <p className="text-gray-600">One-time purchase / Annual subscription</p>
                                </div>
                                <div className="space-y-4 mb-8">
                                    <div className="flex items-start">
                                        <svg className="w-5 h-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                        <span className="text-gray-700">Team Kaupod collects your kit from the hub</span>
                                    </div>
                                    <div className="flex items-start">
                                        <svg className="w-5 h-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                        <span className="text-gray-700">Discreet delivery directly to your location</span>
                                    </div>
                                    <div className="flex items-start">
                                        <svg className="w-5 h-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                        <span className="text-gray-700">Safe return to hub for processing</span>
                                    </div>
                                    <div className="flex items-start">
                                        <svg className="w-5 h-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                        <span className="text-gray-700">Secure result delivery through your account</span>
                                    </div>
                                </div>
                                {auth.user ? (
                                    <Link href="/request/kit" className="block w-full bg-red-600 text-white text-center px-6 py-4 rounded-lg font-semibold hover:bg-red-700 transition-colors">
                                        Get Pro Plan
                                    </Link>
                                ) : (
                                    <a href="/register" className="block w-full bg-red-600 text-white text-center px-6 py-4 rounded-lg font-semibold hover:bg-red-700 transition-colors">
                                        Get Pro Plan
                                    </a>
                                )}
                            </div>

                            {/* Plus Plan */}
                            <div className="border-2 border-amber-200 rounded-2xl p-8 relative">
                                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                                    <span className="bg-amber-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
                                        Plus Plan
                                    </span>
                                </div>
                                <div className="text-center mb-6 mt-4">
                                    <h4 className="text-2xl font-bold text-gray-900 mb-2">Medical Specialist Access</h4>
                                    <p className="text-gray-600">Multiple tier options with flexible subscriptions</p>
                                </div>

                                {/* Plan Tiers */}
                                <div className="space-y-4 mb-6">
                                    <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
                                        <h5 className="font-semibold text-amber-800 mb-2">Available Tiers:</h5>
                                        <div className="space-y-2 text-sm text-gray-700">
                                            <div className="flex justify-between">
                                                <span>• Single Consultation</span>
                                                <span className="font-medium">One-time</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>• Annual Moderate</span>
                                                <span className="font-medium">2 checkups/year</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>• Annual High</span>
                                                <span className="font-medium">4 checkups/year</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4 mb-8">
                                    <div className="flex items-start">
                                        <svg className="w-5 h-5 text-amber-600 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                        <span className="text-gray-700">Team Kaupod arranges specialist appointments</span>
                                    </div>
                                    <div className="flex items-start">
                                        <svg className="w-5 h-5 text-amber-600 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                        <span className="text-gray-700">Connect with medical specialists in Capiz</span>
                                    </div>
                                    <div className="flex items-start">
                                        <svg className="w-5 h-5 text-amber-600 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                        <span className="text-gray-700">Annual subscriptions with significant savings</span>
                                    </div>
                                    <div className="flex items-start">
                                        <svg className="w-5 h-5 text-amber-600 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                        <span className="text-gray-700">Priority scheduling for subscribers</span>
                                    </div>
                                </div>
                                {auth.user ? (
                                    <Link href="/request/consultation" className="block w-full bg-amber-600 text-white text-center px-6 py-4 rounded-lg font-semibold hover:bg-amber-700 transition-colors">
                                        Choose Plus Plan Tier
                                    </Link>
                                ) : (
                                    <a href="/register" className="block w-full bg-amber-600 text-white text-center px-6 py-4 rounded-lg font-semibold hover:bg-amber-700 transition-colors">
                                        Choose Plus Plan Tier
                                    </a>
                                )}
                            </div>
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

            {/* HIV Information Resources Section */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            HIV Information & Resources
                        </h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Access trusted HIV information and educational resources to stay informed and empowered.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* YouTube Video Resource */}
                        <div className="bg-red-50 rounded-2xl p-8 border border-red-100 text-center hover:shadow-lg transition-shadow">
                            <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-4">
                                Educational Video
                            </h3>
                            <p className="text-gray-600 mb-6">
                                Watch informative content about HIV awareness, prevention, and treatment options.
                            </p>
                            <a 
                                href="https://youtu.be/xmk_ZrKDwJs" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="inline-block bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
                            >
                                Watch Video
                            </a>
                        </div>

                        {/* NIH Fact Sheets */}
                        <div className="bg-blue-50 rounded-2xl p-8 border border-blue-100 text-center hover:shadow-lg transition-shadow">
                            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-4">
                                NIH Fact Sheets
                            </h3>
                            <p className="text-gray-600 mb-6">
                                Access comprehensive, medically-reviewed HIV information from the National Institutes of Health.
                            </p>
                            <a 
                                href="https://hivinfo.nih.gov/understanding-hiv/fact-sheets" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                            >
                                Read Fact Sheets
                            </a>
                        </div>

                        {/* Facebook Community */}
                        <div className="bg-indigo-50 rounded-2xl p-8 border border-indigo-100 text-center hover:shadow-lg transition-shadow">
                            <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-4">
                                Community Support
                            </h3>
                            <p className="text-gray-600 mb-6">
                                Connect with our Facebook community for support, updates, and additional resources.
                            </p>
                            <a 
                                href="https://www.facebook.com/profile.php?id=100087863066077" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
                            >
                                Join Community
                            </a>
                        </div>
                    </div>

                    <div className="mt-12 text-center">
                        <div className="bg-gray-50 rounded-xl p-6 max-w-4xl mx-auto">
                            <p className="text-sm text-gray-600 leading-relaxed">
                                <strong>Important:</strong> The information provided through these resources is for educational purposes only and should not replace professional medical advice. 
                                Always consult with qualified healthcare providers for personalized guidance regarding HIV prevention, testing, and treatment.
                            </p>
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
