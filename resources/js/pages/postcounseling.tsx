import { Head } from '@inertiajs/react';
import ClientNavigation from '@/components/client-navigation';
import { Heart, Shield, Users, Phone, FileText, Calendar } from 'lucide-react';

export default function Postcounseling() {
    return (
        <>
            <Head title="Post-Counseling Services - Kaupod" />
            
            <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-amber-50">
                <ClientNavigation />
                
                {/* Hero Section */}
                <div className="relative bg-gradient-to-r from-teal-600 to-teal-700 text-white py-20 mt-14">
                    <div className="absolute inset-0 bg-black/10"></div>
                    <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <div className="flex justify-center mb-6">
                            <Heart className="h-16 w-16 text-teal-200" />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold mb-6">
                            Post-Counseling Services
                        </h1>
                        <p className="text-xl md:text-2xl text-teal-100 max-w-3xl mx-auto leading-relaxed">
                            Comprehensive support and guidance after receiving your HIV test results
                        </p>
                    </div>
                </div>

                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    {/* What is Post-Counseling Section */}
                    <div className="mb-16">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">
                                What is Post-Counseling?
                            </h2>
                            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                                Post-counseling provides essential support after receiving HIV test results, 
                                helping you understand next steps and access appropriate care and resources.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                                <div className="inline-flex items-center justify-center w-16 h-16 bg-teal-100 rounded-full mb-6">
                                    <FileText className="h-8 w-8 text-teal-600" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                                    Result Interpretation
                                </h3>
                                <p className="text-gray-600">
                                    Clear explanation of your test results and what they mean for your health and future.
                                </p>
                            </div>
                            
                            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-6">
                                    <Calendar className="h-8 w-8 text-blue-600" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                                    Next Steps Planning
                                </h3>
                                <p className="text-gray-600">
                                    Develop a personalized plan for your ongoing health care and well-being.
                                </p>
                            </div>
                            
                            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                                <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-6">
                                    <Users className="h-8 w-8 text-purple-600" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                                    Ongoing Support
                                </h3>
                                <p className="text-gray-600">
                                    Access to continued counseling, support groups, and community resources.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* For Different Results Section */}
                    <div className="mb-16">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">
                                Support for All Results
                            </h2>
                            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                                We provide comprehensive post-counseling support regardless of your test results.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Negative Results */}
                            <div className="bg-white rounded-2xl shadow-xl p-8">
                                <div className="flex items-center mb-6">
                                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                                        <Shield className="h-6 w-6 text-green-600" />
                                    </div>
                                    <h3 className="text-2xl font-semibold text-gray-900">
                                        Negative Results
                                    </h3>
                                </div>
                                <ul className="space-y-4 text-gray-600">
                                    <li className="flex items-start">
                                        <span className="w-2 h-2 bg-green-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                                        Understanding window periods and retesting recommendations
                                    </li>
                                    <li className="flex items-start">
                                        <span className="w-2 h-2 bg-green-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                                        Prevention strategies and risk reduction counseling
                                    </li>
                                    <li className="flex items-start">
                                        <span className="w-2 h-2 bg-green-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                                        Pre-exposure prophylaxis (PrEP) information if appropriate
                                    </li>
                                    <li className="flex items-start">
                                        <span className="w-2 h-2 bg-green-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                                        Regular testing schedule recommendations
                                    </li>
                                </ul>
                            </div>

                            {/* Positive Results */}
                            <div className="bg-white rounded-2xl shadow-xl p-8">
                                <div className="flex items-center mb-6">
                                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
                                        <Heart className="h-6 w-6 text-red-600" />
                                    </div>
                                    <h3 className="text-2xl font-semibold text-gray-900">
                                        Positive Results
                                    </h3>
                                </div>
                                <ul className="space-y-4 text-gray-600">
                                    <li className="flex items-start">
                                        <span className="w-2 h-2 bg-red-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                                        Immediate linkage to HIV care and treatment services
                                    </li>
                                    <li className="flex items-start">
                                        <span className="w-2 h-2 bg-red-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                                        Information about antiretroviral therapy (ART)
                                    </li>
                                    <li className="flex items-start">
                                        <span className="w-2 h-2 bg-red-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                                        Partner notification and testing guidance
                                    </li>
                                    <li className="flex items-start">
                                        <span className="w-2 h-2 bg-red-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                                        Emotional support and coping strategies
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Additional Services */}
                    <div className="mb-16">
                        <div className="bg-gray-50 rounded-2xl p-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
                                Additional Post-Counseling Services
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                <div className="text-center">
                                    <Phone className="h-8 w-8 text-teal-600 mx-auto mb-3" />
                                    <h4 className="font-semibold text-gray-900 mb-2">24/7 Hotline</h4>
                                    <p className="text-sm text-gray-600">Access to crisis counseling and support</p>
                                </div>
                                <div className="text-center">
                                    <Users className="h-8 w-8 text-teal-600 mx-auto mb-3" />
                                    <h4 className="font-semibold text-gray-900 mb-2">Support Groups</h4>
                                    <p className="text-sm text-gray-600">Peer support and community connections</p>
                                </div>
                                <div className="text-center">
                                    <FileText className="h-8 w-8 text-teal-600 mx-auto mb-3" />
                                    <h4 className="font-semibold text-gray-900 mb-2">Resource Referrals</h4>
                                    <p className="text-sm text-gray-600">Healthcare, social, and legal services</p>
                                </div>
                                <div className="text-center">
                                    <Calendar className="h-8 w-8 text-teal-600 mx-auto mb-3" />
                                    <h4 className="font-semibold text-gray-900 mb-2">Follow-up Care</h4>
                                    <p className="text-sm text-gray-600">Scheduled check-ins and ongoing support</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Call to Action */}
                    <div className="bg-teal-700 bg-gradient-to-r from-teal-600 to-teal-700 rounded-2xl p-8 md:p-12 text-white text-center">
                        <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-500 text-white">
                            Get the Support You Need
                        </h2>
                        <p className="text-white mb-6 max-w-2xl mx-auto text-lg">
                            Our post-counseling services ensure you never face your journey alone. 
                            Connect with our caring professionals today.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-lg mx-auto">
                            <a 
                                href="/hiv-counseling-capiz"
                                className="bg-white text-teal-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors text-center"
                            >
                                Find Counseling Centers
                            </a>
                            <a 
                                href="/request/consultation"
                                className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-teal-700 transition-colors text-center"
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
                                All post-counseling services are provided by qualified healthcare professionals 
                                and follow established HIV care guidelines and best practices.
                            </p>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}