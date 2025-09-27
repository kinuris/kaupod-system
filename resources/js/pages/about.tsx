import { Head } from '@inertiajs/react';
import ClientNavigation from '@/components/client-navigation';
import { Heart, Shield, Users, Stethoscope } from 'lucide-react';

export default function About() {
    return (
        <>
            <Head title="About Us - Kaupod" />
            
            <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-amber-50">
                <ClientNavigation />
                
                <main className="pt-20">
                    {/* Hero Section */}
                    <div className="relative bg-gradient-to-r from-red-600 to-red-700 text-white py-20">
                        <div className="absolute inset-0 bg-black/10"></div>
                        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                            <div className="flex justify-center mb-6">
                                <Heart className="h-16 w-16 text-red-200" />
                            </div>
                            <h1 className="text-4xl md:text-5xl font-bold mb-6">
                                About Kaupod: Together We Heal
                            </h1>
                            <p className="text-xl md:text-2xl text-red-100 max-w-3xl mx-auto leading-relaxed">
                                Our Mission: Compassionate and Confidential HIV Care for Capiz
                            </p>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                        
                        {/* Mission Statement */}
                        <div className="mb-16">
                            <div className="prose prose-lg max-w-none">
                                <p className="text-gray-700 leading-relaxed text-lg mb-6">
                                    In the heart of Capiz, a community thrives on connection and care. Yet, when it comes to HIV, fear and stigma can create silence, forcing individuals to face their worries alone. Kaupod was born from a simple, powerful idea: <strong>that no one should have to choose between their privacy and their health.</strong> We are here to dismantle those barriers, one confidential conversation at a time.
                                </p>
                                <div className="bg-red-50 border-l-4 border-red-500 p-6 my-8">
                                    <p className="text-red-800 text-xl font-semibold mb-2">
                                        "Kaupod Mo Kami"—we are with you.
                                    </p>
                                    <p className="text-red-700">
                                        This is more than our name; it is our promise. We have created a safe, digital space where your journey to peace of mind is handled with the utmost dignity, compassion, and confidentiality.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* What We Do Section */}
                        <div className="mb-16">
                            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">What We Do</h2>
                            <p className="text-gray-700 text-lg mb-12 text-center max-w-3xl mx-auto">
                                Kaupod is a modern, all-in-one HIV intervention platform designed to serve the needs of our community here in Capiz. We bridge the gap between uncertainty and care by providing accessible, structured services that put you in control.
                            </p>

                            {/* Services Grid */}
                            <div className="grid md:grid-cols-2 gap-8 mb-12">
                                <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
                                    <div className="flex items-center mb-4">
                                        <div className="bg-blue-100 p-3 rounded-lg mr-4">
                                            <Shield className="h-6 w-6 text-blue-600" />
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900">Confidential Risk Assessment</h3>
                                    </div>
                                    <p className="text-gray-700 leading-relaxed">
                                        Our friendly and intelligent AI-powered chatbot is here to listen. It offers a safe space to discuss your concerns through a natural conversation, helping you understand your risk level without judgment. Your conversation is always private and is never stored.
                                    </p>
                                </div>

                                <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
                                    <div className="flex items-center mb-4">
                                        <div className="bg-green-100 p-3 rounded-lg mr-4">
                                            <Heart className="h-6 w-6 text-green-600" />
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900">Privacy Kit Delivery Service</h3>
                                    </div>
                                    <p className="text-gray-700 leading-relaxed">
                                        We provide a discreet, end-to-end service to bring an FDA-approved HIV self-test kit directly to you. From procurement at a partner hub to delivery in unmarked packaging and scheduled collection, we handle all the logistics so you can focus on your well-being in the comfort of your own home.
                                    </p>
                                </div>

                                <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
                                    <div className="flex items-center mb-4">
                                        <div className="bg-amber-100 p-3 rounded-lg mr-4">
                                            <Stethoscope className="h-6 w-6 text-amber-600" />
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900">Expert Consultation Service</h3>
                                    </div>
                                    <p className="text-gray-700 leading-relaxed">
                                        Taking the next step can be daunting. We make it easier by arranging appointments with trusted, licensed medical specialists within the province. We coordinate the schedule based on your preference, ensuring you get access to expert care without the stress and hassle.
                                    </p>
                                </div>

                                <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
                                    <div className="flex items-center mb-4">
                                        <div className="bg-red-100 p-3 rounded-lg mr-4">
                                            <Users className="h-6 w-6 text-red-600" />
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900">Community Partnership</h3>
                                    </div>
                                    <p className="text-gray-700 leading-relaxed">
                                        We are proud to work hand-in-hand with local partners like the Department of Health (DOH) and Capiz Shells. Through these collaborations, we connect you to vital pre- and post-counseling services, ensuring you are supported by the full strength of our community's healthcare network.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Commitment Section */}
                        <div className="text-center">
                            <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-2xl p-12 text-white">
                                <h2 className="text-3xl font-bold mb-6">Our Commitment to You</h2>
                                <p className="text-lg text-red-100 leading-relaxed max-w-3xl mx-auto mb-8">
                                    Your trust is our highest priority. Every service we offer is built on a foundation of strict confidentiality and respect for your privacy. We are committed to providing a stigma-free experience that empowers you to make informed decisions about your health with confidence and dignity.
                                </p>
                                <div className="text-2xl font-bold text-red-200 mb-2">
                                    Because together, we heal.
                                </div>
                                <div className="text-xl text-red-300">
                                    And in every step, #KaupodKami.
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
}
