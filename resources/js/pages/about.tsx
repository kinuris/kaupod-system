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
                                About Kaupod
                            </h1>
                            <p className="text-xl md:text-2xl text-red-100 max-w-3xl mx-auto leading-relaxed">
                                Enhancing Risk Awareness and Reducing Stigma Through Accessible Healthcare
                            </p>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                        
                        {/* About Kaupod */}
                        <div className="mb-16">
                            <div className="prose prose-lg max-w-none">
                                <p className="text-gray-700 leading-relaxed text-lg mb-6">
                                    Kaupod is a Capiz-based HIV platform dedicated to <strong>enhancing risk awareness and reducing stigma</strong> through accessible and structured services. Our core feature is a chatbot that conducts risk assessments and determines each user's risk level. Based on the assessment, the platform provides a detailed map of HIV hubs in Capiz, guiding individuals to appropriate health services.
                                </p>
                                <div className="bg-red-50 border-l-4 border-red-500 p-6 my-8">
                                    <p className="text-red-800 text-xl font-semibold mb-2">
                                        Our Mission
                                    </p>
                                    <p className="text-red-700">
                                        We are designed to encourage timely testing, support informed decisions, and promote equitable access to healthcare within the community.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* What We Do Section */}
                        <div className="mb-16">
                            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Our Services</h2>
                            <p className="text-gray-700 text-lg mb-12 text-center max-w-3xl mx-auto">
                                Kaupod offers two service tiers tailored to different needs, providing comprehensive support from risk assessment to medical consultation.
                            </p>

                            {/* Services Grid */}
                            <div className="grid md:grid-cols-2 gap-8 mb-12">
                                <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
                                    <div className="flex items-center mb-4">
                                        <div className="bg-blue-100 p-3 rounded-lg mr-4">
                                            <Shield className="h-6 w-6 text-blue-600" />
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900">Risk Assessment Chatbot</h3>
                                    </div>
                                    <p className="text-gray-700 leading-relaxed">
                                        Our core feature is an intelligent chatbot that conducts comprehensive risk assessments and determines each user's risk level. The assessment helps guide individuals to the most appropriate health services and care options.
                                    </p>
                                </div>

                                <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
                                    <div className="flex items-center mb-4">
                                        <div className="bg-green-100 p-3 rounded-lg mr-4">
                                            <Heart className="h-6 w-6 text-green-600" />
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900">Pro Plan</h3>
                                    </div>
                                    <p className="text-gray-700 leading-relaxed">
                                        The Pro Plan ensures the discreet delivery and pick-up of HIV self-test kits, providing a seamless and confidential process. We handle all logistics from procurement to collection, ensuring your complete privacy and convenience.
                                    </p>
                                </div>

                                <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
                                    <div className="flex items-center mb-4">
                                        <div className="bg-amber-100 p-3 rounded-lg mr-4">
                                            <Stethoscope className="h-6 w-6 text-amber-600" />
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900">Plus Plan</h3>
                                    </div>
                                    <p className="text-gray-700 leading-relaxed">
                                        The Plus Plan extends our Pro Plan service by arranging medical consultations with licensed doctors. We use information from the Pro Plan to facilitate bookings, making it easier to access professional medical care when needed.
                                    </p>
                                </div>

                                <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
                                    <div className="flex items-center mb-4">
                                        <div className="bg-red-100 p-3 rounded-lg mr-4">
                                            <Users className="h-6 w-6 text-red-600" />
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900">HIV Hub Locator</h3>
                                    </div>
                                    <p className="text-gray-700 leading-relaxed">
                                        Based on your risk assessment, our platform provides a detailed map of HIV hubs in Capiz, guiding individuals to appropriate health services and connecting them with local healthcare resources.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Our Impact Section */}
                        <div className="text-center">
                            <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-2xl p-12 text-white">
                                <h2 className="text-3xl font-bold mb-6">Our Impact</h2>
                                <p className="text-lg text-red-100 leading-relaxed max-w-3xl mx-auto mb-8">
                                    Both our Pro Plan and Plus Plan are designed to encourage timely testing, support informed decisions, and promote equitable access to healthcare within the Capiz community. We are committed to reducing stigma and making quality HIV care accessible to everyone.
                                </p>
                                <div className="text-2xl font-bold text-red-200 mb-2">
                                    Accessible. Confidential. Community-Focused.
                                </div>
                                <div className="text-xl text-red-300">
                                    #KaupodKami - We're here for Capiz.
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
}
