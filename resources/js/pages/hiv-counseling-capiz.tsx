import { Head } from '@inertiajs/react';
import ClientNavigation from '@/components/client-navigation';
import { MapPin, Phone, Mail, Users, Heart, ExternalLink, Calendar, Clock } from 'lucide-react';
import { useState } from 'react';

interface Hub {
    id: number;
    name: string;
    location: string;
    contacts: string[];
    email: string;
}

const hubs: Hub[] = [
    {
        id: 1,
        name: "RMPH We CARE Clinic and Treatment Facility",
        location: "Roxas Memorial Provincial Hospital\nCapitol Hills, Brgy. Lanot\nRoxas City, Capiz",
        contacts: ["09928790812"],
        email: "rmphcapiztxhub@gmail.com"
    },
    {
        id: 2,
        name: "Sunshine Clinic",
        location: "Sen. Gerardo M. Roxas Memorial District Hospital\nBrgy. Balucuan, Dao, Capiz",
        contacts: ["(036) 658-0037"],
        email: "daohospital.2020@gmail.com"
    },
    {
        id: 3,
        name: "Roxas City Health Office",
        location: "Primary HIV Care Clinic\nRoxas City, Capiz",
        contacts: ["(036) 621-0578", "(036) 621-3244", "(036) 621-5686"],
        email: "cho_roxas@yahoo.com"
    }
];

export default function HIVCounselingCapiz() {
    const [activeTab, setActiveTab] = useState<'pre' | 'post' | 'art'>('art');

    const formatPhoneNumber = (phone: string) => {
        // Remove any formatting and keep only digits and dashes/parentheses
        return phone.replace(/[^\d\-()\s]/g, '');
    };

    const formatPhoneForTel = (phone: string) => {
        // Convert to tel: format by removing non-digits except for leading +
        return phone.replace(/[^\d]/g, '');
    };

    const HubCard = ({ hub }: { hub: Hub }) => (
        <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 leading-tight">
                {hub.name}
            </h3>
            <div className="space-y-4 text-sm">
                <div className="flex items-start gap-3">
                    <MapPin className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                    <div>
                        <span className="font-medium text-gray-700">Location:</span>
                        <p className="text-gray-600 mt-1 whitespace-pre-line">
                            {hub.location}
                        </p>
                    </div>
                </div>
                <div className="flex items-start gap-3">
                    <Phone className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                    <div>
                        <span className="font-medium text-gray-700">Contact:</span>
                        <div className="text-gray-600 mt-1 space-y-1">
                            {hub.contacts.map((contact, index) => (
                                <p key={index}>
                                    <a 
                                        href={`tel:${formatPhoneForTel(contact)}`} 
                                        className="text-red-600 hover:text-red-800 transition-colors"
                                    >
                                        {formatPhoneNumber(contact)}
                                    </a>
                                </p>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="flex items-start gap-3">
                    <Mail className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                    <div>
                        <span className="font-medium text-gray-700">Email:</span>
                        <p className="text-gray-600 mt-1">
                            <a 
                                href={`mailto:${hub.email}`} 
                                className="text-red-600 hover:text-red-800 transition-colors break-all"
                            >
                                {hub.email}
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <>
            <Head title="HIV Counseling Hubs in Capiz - Kaupod" />
            
            <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-amber-50">
                <ClientNavigation />
                
                {/* Header Section */}
                <header className="bg-white shadow-sm border-b border-gray-200 mt-14">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        <div className="text-center">
                            <div className="flex justify-center mb-4">
                                <Heart className="h-12 w-12 text-red-600" />
                            </div>
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                                HIV Counseling & Support in Capiz
                            </h1>
                            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
                                Comprehensive HIV counseling services available at certified facilities throughout Capiz Province.
                            </p>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Tab Navigation */}
                    <div className="mb-8">
                        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg max-w-2xl mx-auto">
                            <button 
                                onClick={() => setActiveTab('pre')}
                                className={`flex-1 py-2.5 px-4 text-sm font-medium rounded-md transition-all duration-200 ${
                                    activeTab === 'pre'
                                        ? 'bg-white text-red-700 shadow-sm'
                                        : 'text-gray-600 hover:text-gray-900'
                                }`}
                            >
                                Pre-Counseling
                            </button>
                            <button 
                                onClick={() => setActiveTab('post')}
                                className={`flex-1 py-2.5 px-4 text-sm font-medium rounded-md transition-all duration-200 ${
                                    activeTab === 'post'
                                        ? 'bg-white text-red-700 shadow-sm'
                                        : 'text-gray-600 hover:text-gray-900'
                                }`}
                            >
                                Post-Counseling
                            </button>
                            <button 
                                onClick={() => setActiveTab('art')}
                                className={`flex-1 py-2.5 px-4 text-sm font-medium rounded-md transition-all duration-200 ${
                                    activeTab === 'art'
                                        ? 'bg-white text-purple-700 shadow-sm'
                                        : 'text-gray-600 hover:text-gray-900'
                                }`}
                            >
                                ART Resources
                            </button>
                        </div>
                    </div>

                    {/* Pre-Counseling Content */}
                    {activeTab === 'pre' && (
                        <div className="space-y-8">
                            <div className="text-center">
                                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                    Pre-Counseling Services
                                </h2>
                                <p className="text-gray-600 max-w-2xl mx-auto">
                                    Get comprehensive pre-test counseling and support at these certified HIV testing hubs in Capiz Province.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {hubs.map((hub) => (
                                    <HubCard key={hub.id} hub={hub} />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Post-Counseling Content */}
                    {activeTab === 'post' && (
                        <div className="space-y-8">
                            <div className="text-center">
                                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                    Post-Counseling Services
                                </h2>
                                <p className="text-gray-600 max-w-2xl mx-auto">
                                    Receive comprehensive post-test counseling and ongoing support services at these certified HIV care facilities in Capiz Province.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {hubs.map((hub) => (
                                    <HubCard key={hub.id} hub={hub} />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* ART Resources Content */}
                    {activeTab === 'art' && (
                        <div className="space-y-8">
                            <div className="text-center">
                                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                    Antiretroviral Therapy (ART) Resources
                                </h2>
                                <p className="text-gray-600 max-w-3xl mx-auto">
                                    Comprehensive HIV treatment information, support resources, and access to 
                                    antiretroviral therapy services in Capiz Province.
                                </p>
                            </div>

                            {/* Facebook Support Group */}
                            <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-6">
                                <div className="text-center">
                                    <div className="flex justify-center mb-4">
                                        <ExternalLink className="h-8 w-8 text-purple-600" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-purple-800 mb-4">
                                        Join Our Support Community
                                    </h3>
                                    <p className="text-purple-700 mb-6 max-w-2xl mx-auto">
                                        Connect with others, share experiences, and get support from our 
                                        Facebook community for people living with HIV and their families.
                                    </p>
                                    <a 
                                        href="https://www.facebook.com/share/178891aovt/" 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-md hover:bg-purple-700 transition-colors font-medium"
                                    >
                                        <ExternalLink className="h-5 w-5" />
                                        Join Facebook Support Group
                                    </a>
                                </div>
                            </div>

                            {/* ART Information Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-white rounded-lg shadow-md p-6 border border-purple-200">
                                    <div className="flex items-center gap-3 mb-4">
                                        <Heart className="h-6 w-6 text-purple-600" />
                                        <h3 className="text-lg font-semibold text-gray-900">What is ART?</h3>
                                    </div>
                                    <p className="text-gray-600 text-sm mb-4">
                                        Antiretroviral therapy (ART) is a treatment that uses HIV medicines to treat HIV infection. 
                                        ART is recommended for everyone who has HIV.
                                    </p>
                                    <ul className="text-sm text-gray-600 space-y-2">
                                        <li>• Reduces viral load in your blood</li>
                                        <li>• Helps immune system recover</li>
                                        <li>• Reduces risk of transmission</li>
                                        <li>• Improves quality of life</li>
                                    </ul>
                                </div>

                                <div className="bg-white rounded-lg shadow-md p-6 border border-purple-200">
                                    <div className="flex items-center gap-3 mb-4">
                                        <Clock className="h-6 w-6 text-purple-600" />
                                        <h3 className="text-lg font-semibold text-gray-900">When to Start ART</h3>
                                    </div>
                                    <ul className="text-sm text-gray-600 space-y-2">
                                        <li>• As soon as possible after HIV diagnosis</li>
                                        <li>• Regardless of CD4 count or viral load</li>
                                        <li>• During pregnancy to prevent transmission</li>
                                        <li>• Consult with healthcare provider</li>
                                        <li>• Regular monitoring is essential</li>
                                    </ul>
                                </div>
                            </div>

                            {/* Treatment Centers */}
                            <div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-4 text-center">
                                    ART Treatment Centers in Capiz
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {hubs.map((hub) => (
                                        <div key={hub.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6 border border-purple-200">
                                            <h4 className="text-lg font-semibold text-gray-900 mb-4 leading-tight">
                                                {hub.name}
                                            </h4>
                                            <div className="space-y-4 text-sm">
                                                <div className="flex items-start gap-3">
                                                    <MapPin className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                                                    <div>
                                                        <span className="font-medium text-gray-700">Location:</span>
                                                        <p className="text-gray-600 mt-1 whitespace-pre-line">
                                                            {hub.location}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-start gap-3">
                                                    <Phone className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                                                    <div>
                                                        <span className="font-medium text-gray-700">Contact:</span>
                                                        <div className="text-gray-600 mt-1 space-y-1">
                                                            {hub.contacts.map((contact, index) => (
                                                                <p key={index}>
                                                                    <a 
                                                                        href={`tel:${formatPhoneForTel(contact)}`} 
                                                                        className="text-purple-600 hover:text-purple-800 transition-colors"
                                                                    >
                                                                        {formatPhoneNumber(contact)}
                                                                    </a>
                                                                </p>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-start gap-3">
                                                    <Mail className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                                                    <div>
                                                        <span className="font-medium text-gray-700">Email:</span>
                                                        <p className="text-gray-600 mt-1">
                                                            <a 
                                                                href={`mailto:${hub.email}`} 
                                                                className="text-purple-600 hover:text-purple-800 transition-colors break-all"
                                                            >
                                                                {hub.email}
                                                            </a>
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Additional Resources */}
                            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional ART Resources</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                    <div>
                                        <h4 className="font-medium text-purple-700 mb-2">Educational Materials</h4>
                                        <ul className="text-gray-600 space-y-1">
                                            <li>• HIV Treatment Guidelines</li>
                                            <li>• Medication Adherence Tips</li>
                                            <li>• Side Effect Management</li>
                                            <li>• Nutrition and Exercise Guide</li>
                                        </ul>
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-purple-700 mb-2">Support Services</h4>
                                        <ul className="text-gray-600 space-y-1">
                                            <li>• Peer Support Groups</li>
                                            <li>• Counseling Services</li>
                                            <li>• Financial Assistance</li>
                                            <li>• Transportation Support</li>
                                        </ul>
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-purple-700 mb-2">Emergency Contacts</h4>
                                        <ul className="text-gray-600 space-y-1">
                                            <li>• 24/7 HIV Hotline</li>
                                            <li>• Crisis Intervention</li>
                                            <li>• Medical Emergency</li>
                                            <li>• Mental Health Support</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            {/* Important ART Information */}
                            <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                                <div className="flex items-start gap-3 mb-4">
                                    <Heart className="h-6 w-6 text-purple-600 mt-0.5 flex-shrink-0" />
                                    <h3 className="text-lg font-semibold text-purple-800">
                                        Important ART Information
                                    </h3>
                                </div>
                                <ul className="text-sm text-purple-700 space-y-2 ml-9">
                                    <li>• ART is available free of charge at government-certified facilities</li>
                                    <li>• All HIV treatment services are strictly confidential</li>
                                    <li>• Early initiation of ART leads to better outcomes</li>
                                    <li>• Regular adherence to medication is crucial for success</li>
                                    <li>• Support services help you manage your treatment journey</li>
                                    <li>• Contact treatment facilities for consultation and enrollment</li>
                                </ul>
                            </div>
                        </div>
                    )}

                    {/* Additional Information Section */}
                    <div className="mt-8 bg-red-50 border border-red-200 rounded-lg p-6">
                        <div className="flex items-start gap-3 mb-4">
                            <Users className="h-6 w-6 text-red-600 mt-0.5 flex-shrink-0" />
                            <h3 className="text-lg font-semibold text-red-800">
                                Important Information
                            </h3>
                        </div>
                        <ul className="text-sm text-red-700 space-y-2 ml-9">
                            <li>• All services are confidential and provided by trained healthcare professionals</li>
                            <li>• Pre-counseling sessions help prepare you for HIV testing and discuss risk factors</li>
                            <li>• Post-counseling provides result interpretation, support, and next steps guidance</li>
                            <li>• Services are available to all individuals regardless of age, gender, or background</li>
                            <li>• Contact facilities directly to schedule appointments or inquire about operating hours</li>
                        </ul>
                    </div>
                </main>

                {/* Footer */}
                <footer className="bg-white border-t border-gray-200 mt-16">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        <div className="text-center">
                            <h4 className="text-lg font-semibold text-gray-900 mb-4">
                                Disclaimer
                            </h4>
                            <p className="text-sm text-gray-600 max-w-4xl mx-auto leading-relaxed">
                                The information provided on this page is for educational and informational purposes only. 
                                It should not be considered as medical advice or a substitute for professional healthcare consultation. 
                                Always consult with qualified healthcare providers for medical advice, diagnosis, and treatment. 
                                The contact information and services listed may be subject to change. 
                                Please verify current details directly with the respective facilities before visiting.
                            </p>
                            <div className="mt-6 pt-6 border-t border-gray-200">
                                <p className="text-xs text-gray-500">
                                    &copy; 2024 Kaupod System. All rights reserved. | HIV Counseling & Support Services
                                </p>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}