import { Head } from '@inertiajs/react';
import ClientNavigation from '@/components/client-navigation';
import { Heart, Shield, Users, Clock, CheckCircle } from 'lucide-react';

export default function Precounseling() {
    return (
        <>
            <Head title="Pre-Counseling Services - Kaupod" />
            
            <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-amber-50">
                <ClientNavigation />
                
                {/* Hero Section */}
                <div className="relative bg-gradient-to-r from-green-600 to-green-700 text-white py-20 mt-14">
                    <div className="absolute inset-0 bg-black/10"></div>
                    <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <div className="flex justify-center mb-6">
                            <Shield className="h-16 w-16 text-green-200" />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold mb-6">
                            Pre-Counseling Services
                        </h1>
                        <p className="text-xl md:text-2xl text-green-100 max-w-3xl mx-auto leading-relaxed">
                            Comprehensive support and guidance before your HIV testing journey
                        </p>
                    </div>
                </div>

                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    {/* What is Pre-Counseling Section */}
                    <div className="mb-16">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">
                                What is Pre-Counseling?
                            </h2>
                            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                                Pre-counseling is an essential step that prepares you for HIV testing by providing information, 
                                addressing concerns, and ensuring you make informed decisions about your health.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6">
                                    <Users className="h-8 w-8 text-green-600" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                                    Professional Guidance
                                </h3>
                                <p className="text-gray-600">
                                    Receive expert counseling from trained healthcare professionals who understand your needs and concerns.
                                </p>
                            </div>
                            
                            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-6">
                                    <Clock className="h-8 w-8 text-blue-600" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                                    Take Your Time
                                </h3>
                                <p className="text-gray-600">
                                    No rush or pressure. We ensure you have adequate time to process information and ask questions.
                                </p>
                            </div>
                            
                            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                                <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-6">
                                    <Shield className="h-8 w-8 text-purple-600" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                                    Confidential & Safe
                                </h3>
                                <p className="text-gray-600">
                                    All conversations are strictly confidential and conducted in a safe, non-judgmental environment.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* What We Cover Section */}
                    <div className="mb-16">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">
                                What We Cover in Pre-Counseling
                            </h2>
                        </div>

                        <div className="bg-white rounded-2xl shadow-xl p-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                                        <CheckCircle className="h-6 w-6 text-green-600 mr-3" />
                                        Information & Education
                                    </h3>
                                    <ul className="space-y-3 text-gray-600">
                                        <li className="flex items-start">
                                            <span className="w-2 h-2 bg-green-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                                            HIV transmission and prevention methods
                                        </li>
                                        <li className="flex items-start">
                                            <span className="w-2 h-2 bg-green-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                                            Understanding HIV testing procedures
                                        </li>
                                        <li className="flex items-start">
                                            <span className="w-2 h-2 bg-green-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                                            Window period and test accuracy
                                        </li>
                                        <li className="flex items-start">
                                            <span className="w-2 h-2 bg-green-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                                            Available treatment options
                                        </li>
                                    </ul>
                                </div>
                                
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                                        <Heart className="h-6 w-6 text-red-600 mr-3" />
                                        Emotional Support
                                    </h3>
                                    <ul className="space-y-3 text-gray-600">
                                        <li className="flex items-start">
                                            <span className="w-2 h-2 bg-red-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                                            Address anxiety and fears about testing
                                        </li>
                                        <li className="flex items-start">
                                            <span className="w-2 h-2 bg-red-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                                            Discuss personal risk factors
                                        </li>
                                        <li className="flex items-start">
                                            <span className="w-2 h-2 bg-red-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                                            Plan for different test outcomes
                                        </li>
                                        <li className="flex items-start">
                                            <span className="w-2 h-2 bg-red-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                                            Identify support systems
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Call to Action */}
                    <div className="bg-green-700 bg-gradient-to-r from-green-600 to-green-700 rounded-2xl p-8 md:p-12 text-white text-center">
                        <h2 className="text-2xl md:text-3xl font-bold mb-4 text-white">
                            Ready to Take the First Step?
                        </h2>
                        <p className="text-green-100 mb-6 max-w-2xl mx-auto text-lg">
                            Our trained counselors are here to support you every step of the way. 
                            Schedule your pre-counseling session today.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-lg mx-auto">
                            <a 
                                href="/hiv-counseling-capiz"
                                className="bg-white text-green-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors text-center"
                            >
                                Find Counseling Centers
                            </a>
                            <a 
                                href="/request/consultation"
                                className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-green-700 transition-colors text-center"
                            >
                                Request Consultation
                            </a>
                        </div>
                    </div>
                </main>

                {/* Footer */}
                <footer className="bg-gray-100 border-t border-gray-300 mt-16">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        <div className="text-center">
                            <p className="text-sm text-gray-900 font-medium leading-relaxed">
                                All pre-counseling services are provided by qualified healthcare professionals 
                                in accordance with national HIV counseling guidelines.
                            </p>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}