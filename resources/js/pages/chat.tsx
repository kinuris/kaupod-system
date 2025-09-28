import { Head } from '@inertiajs/react';
import ClientNavigation from '@/components/client-navigation';
import Chatbot from '@/components/chatbot';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bot, Shield, Clock, Users } from 'lucide-react';

export default function ChatbotPage() {
    return (
        <>
            <Head title="AI Health Assistant - Kaupod" />
            
            <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-amber-50 light">
                <ClientNavigation />
                
                <main className="pt-20">
                    {/* Hero Section */}
                    <div className="relative bg-gradient-to-r from-red-600 to-red-700 text-white py-16">
                        <div className="absolute inset-0 bg-black/10"></div>
                        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                            <div className="flex justify-center mb-6">
                                <Bot className="h-16 w-16 text-red-200" />
                            </div>
                            <h1 className="text-4xl font-bold mb-4">
                                AI Health Assistant
                            </h1>
                            <p className="text-xl text-red-100 max-w-2xl mx-auto">
                                Get personalized health guidance and support through our intelligent AI assistant.
                                Ask questions, discuss concerns, and receive helpful information in a safe, private environment.
                            </p>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-gray-900">
                        <div className="grid gap-8 lg:grid-cols-3">
                            {/* Chatbot Interface */}
                            <div className="lg:col-span-2">
                                <Chatbot />
                            </div>
                    
                    {/* Information Sidebar */}
                    <div className="space-y-6">
                        <Card className="bg-white border-gray-200 shadow-sm">
                            <CardHeader className="bg-white">
                                <CardTitle className="flex items-center gap-2 text-gray-900">
                                    <Bot className="h-5 w-5 text-red-600" />
                                    About Our AI Assistant
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 bg-white">
                                <p className="text-sm text-gray-700 dark:text-gray-700">
                                    Our AI health assistant is designed to provide general health information 
                                    and guidance. It can help you understand symptoms, provide wellness tips, 
                                    and guide you toward appropriate care when needed.
                                </p>
                                
                                <div className="space-y-3">
                                    <div className="flex items-start gap-3">
                                        <Shield className="h-4 w-4 text-green-600 mt-0.5" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-900 dark:text-gray-900">Private & Secure</p>
                                            <p className="text-xs text-gray-600 dark:text-gray-600">
                                                Your conversations are encrypted and never stored permanently.
                                            </p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-start gap-3">
                                        <Clock className="h-4 w-4 text-red-600 mt-0.5" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-900 dark:text-gray-900">24/7 Available</p>
                                            <p className="text-xs text-gray-600 dark:text-gray-600">
                                                Get support anytime, anywhere you need it.
                                            </p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-start gap-3">
                                        <Users className="h-4 w-4 text-red-600 mt-0.5" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-900 dark:text-gray-900">Expert Backed</p>
                                            <p className="text-xs text-gray-600 dark:text-gray-600">
                                                Powered by medical knowledge and expert guidance.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        
                        <Card className="bg-white border-gray-200 shadow-sm">
                            <CardHeader className="bg-white">
                                <CardTitle className="text-lg text-gray-900 dark:text-gray-900">Important Disclaimer</CardTitle>
                            </CardHeader>
                            <CardContent className="bg-white">
                                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                                    <p className="text-sm text-amber-800">
                                        <strong>Medical Disclaimer:</strong> This AI assistant provides general 
                                        health information only and is not a substitute for professional medical 
                                        advice, diagnosis, or treatment. Always consult qualified healthcare 
                                        professionals for medical concerns.
                                    </p>
                                </div>
                                
                                <div className="mt-4 space-y-2">
                                    <p className="text-xs text-gray-700 dark:text-gray-700">
                                        <strong>Emergency:</strong> If you're experiencing a medical emergency, 
                                        call emergency services immediately.
                                    </p>
                                    <p className="text-xs text-gray-700 dark:text-gray-700">
                                        <strong>Urgent Care:</strong> For urgent health concerns, contact your 
                                        healthcare provider or visit urgent care.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                        
                        <Card className="bg-white border-gray-200 shadow-sm">
                            <CardHeader className="bg-white">
                                <CardTitle className="text-lg text-gray-900 dark:text-gray-900">How to Use</CardTitle>
                            </CardHeader>
                            <CardContent className="bg-white">
                                <div className="space-y-3 text-sm text-gray-700 dark:text-gray-700">
                                    <div className="flex items-start gap-2">
                                        <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded">1</span>
                                        <p>Start by describing your health question or concern</p>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded">2</span>
                                        <p>Provide specific details when asked for clarification</p>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded">3</span>
                                        <p>Follow the guidance and recommendations provided</p>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded">4</span>
                                        <p>Consult healthcare professionals when recommended</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </main>
    </div>
        </>
    );
}