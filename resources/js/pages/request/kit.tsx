import React, { useState } from 'react';
import InputError from '@/components/input-error';
import ClientNavigation from '@/components/client-navigation';
import DeliveryLocationMap from '@/components/delivery-location-map';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Form, Head } from '@inertiajs/react';
import { LoaderCircle, Package, MapPin, Info } from 'lucide-react';

interface DeliveryLocation {
    lat: number;
    lng: number;
    address?: string;
}

export default function KitRequest() {
    const [selectedLocation, setSelectedLocation] = useState<DeliveryLocation | null>(null);
    
    const handleLocationSelect = (location: DeliveryLocation) => {
        setSelectedLocation(location);
    };

    return (
        <>
            <Head title="Privacy Kit Request - Kaupod" />
            
            <ClientNavigation />

            {/* Hero Section */}
            <section className="bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 py-20">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <div className="flex justify-center mb-6">
                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-pink-600">
                                <Package className="h-8 w-8 text-white" />
                            </div>
                        </div>
                        <div className="flex items-center justify-center gap-3 mb-4">
                            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
                                Privacy Kit Request
                            </h1>
                            <div className="group relative">
                                <Info className="h-6 w-6 text-pink-600 cursor-help" />
                                <div className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 w-80 p-4 bg-gray-900 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10 shadow-lg">
                                    <div className="space-y-3">
                                        <div className="font-semibold text-pink-300">What's in the Privacy Kit?</div>
                                        <div>HIV testing kits delivered discreetly to your specified location with complete confidentiality.</div>
                                        <div className="space-y-2">
                                            <div className="font-medium text-teal-300">How it works:</div>
                                            <div className="space-y-1 text-xs">
                                                <div>• 1. Receive your kit at the pinpointed location</div>
                                                <div>• 2. Complete the testing procedure privately</div>
                                                <div>• 3. Schedule a pickup using our platform</div>
                                                <div>• 4. Get your results securely in Kaupod</div>
                                            </div>
                                        </div>
                                        <div className="text-xs text-gray-300 italic">Complete privacy guaranteed throughout the entire process.</div>
                                    </div>
                                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                                </div>
                            </div>
                        </div>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Confidential HIV testing kits delivered to your exact location with secure result delivery
                        </p>
                    </div>

                    {/* Information Card */}
                    <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-2xl border border-pink-200 p-6 max-w-2xl mx-auto mb-8">
                        <div className="flex items-start gap-4">
                            <div className="flex-shrink-0">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-pink-100">
                                    <Info className="h-5 w-5 text-pink-600" />
                                </div>
                            </div>
                            <div className="flex-1">
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">HIV Testing Kit Information</h3>
                                <div className="space-y-3 text-gray-700">
                                    <p className="text-sm">
                                        Our privacy kits contain professional-grade HIV testing materials delivered discreetly to your chosen location.
                                    </p>
                                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                                        <div className="space-y-2">
                                            <div className="font-medium text-pink-700">✓ Delivery Process</div>
                                            <div className="text-xs space-y-1">
                                                <div>• Unmarked, discrete packaging</div>
                                                <div>• GPS-precise delivery location</div>
                                                <div>• No signature required options</div>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="font-medium text-teal-700">✓ Testing & Results</div>
                                            <div className="text-xs space-y-1">
                                                <div>• Complete testing in privacy</div>
                                                <div>• Schedule pickup via platform</div>
                                                <div>• Secure results in your account</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl mx-auto">
                        <Form
                            action="/request/kit"
                            method="post"
                            className="space-y-6"
                        >
                            {({ processing, errors }) => (
                                <>
                                    <div className="space-y-6">
                                        <div className="grid gap-3">
                                            <Label className="text-base font-semibold text-gray-900 flex items-center gap-2">
                                                <MapPin className="h-5 w-5 text-pink-600" />
                                                Delivery Location
                                            </Label>
                                            <p className="text-sm text-gray-600 mb-3">
                                                Click on the map to pinpoint your exact delivery location for maximum privacy and accuracy.
                                            </p>
                                            <DeliveryLocationMap 
                                                onLocationSelect={handleLocationSelect}
                                                initialLocation={selectedLocation || undefined}
                                            />
                                            {selectedLocation && (
                                                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                                                    <p className="text-sm font-medium text-green-800 mb-1">Selected Location:</p>
                                                    <p className="text-sm text-green-700">{selectedLocation.address}</p>
                                                    <p className="text-xs text-green-600 mt-1">
                                                        Coordinates: {selectedLocation.lat.toFixed(6)}, {selectedLocation.lng.toFixed(6)}
                                                    </p>
                                                </div>
                                            )}
                                            <input 
                                                type="hidden" 
                                                name="delivery_latitude" 
                                                value={selectedLocation?.lat || ''} 
                                            />
                                            <input 
                                                type="hidden" 
                                                name="delivery_longitude" 
                                                value={selectedLocation?.lng || ''} 
                                            />
                                            <input 
                                                type="hidden" 
                                                name="delivery_location_address" 
                                                value={selectedLocation?.address || ''} 
                                            />
                                        </div>

                                        <div className="grid gap-3">
                                            <Label htmlFor="delivery_address" className="text-base font-semibold text-gray-900">Additional Address Details</Label>
                                            <Textarea
                                                id="delivery_address"
                                                name="delivery_address"
                                                placeholder="Apartment number, building name, specific instructions (e.g., 'Apt 4B, Blue building, Ring doorbell twice')"
                                                rows={3}
                                                className="text-base"
                                            />
                                            <p className="text-xs text-gray-500">
                                                Optional: Add specific details like apartment numbers, building descriptions, or delivery instructions.
                                            </p>
                                            <InputError message={errors.delivery_address} />
                                        </div>

                                        <div className="grid gap-3">
                                            <Label htmlFor="phone" className="text-base font-semibold text-gray-900">Contact Phone</Label>
                                            <Input
                                                id="phone"
                                                type="tel"
                                                name="phone"
                                                required
                                                placeholder="Phone number for delivery updates"
                                                className="text-base"
                                            />
                                            <InputError message={errors.phone} />
                                        </div>

                                        <div className="grid gap-3">
                                            <Label htmlFor="special_instructions" className="text-base font-semibold text-gray-900">Special Instructions (Optional)</Label>
                                            <Textarea
                                                id="special_instructions"
                                                name="special_instructions"
                                                placeholder="Any special delivery instructions or privacy requirements"
                                                rows={3}
                                                className="text-base"
                                            />
                                            <InputError message={errors.special_instructions} />
                                        </div>
                                    </div>

                                    <div className="bg-pink-50 border border-pink-200 rounded-lg p-6">
                                        <h3 className="font-semibold text-pink-800 mb-3">Complete Privacy & Process</h3>
                                        <div className="space-y-4">
                                            <div>
                                                <div className="font-medium text-pink-800 mb-2">Delivery Guarantee:</div>
                                                <ul className="text-pink-700 space-y-1 text-sm">
                                                    <li className="flex items-start gap-2">
                                                        <span className="text-pink-600 font-bold">•</span>
                                                        All packages are unmarked and discreet
                                                    </li>
                                                    <li className="flex items-start gap-2">
                                                        <span className="text-pink-600 font-bold">•</span>
                                                        No identifying information on exterior packaging
                                                    </li>
                                                    <li className="flex items-start gap-2">
                                                        <span className="text-pink-600 font-bold">•</span>
                                                        GPS-precise delivery to your chosen location
                                                    </li>
                                                </ul>
                                            </div>
                                            <div>
                                                <div className="font-medium text-teal-800 mb-2">After Testing:</div>\n                                                <ul className="text-teal-700 space-y-1 text-sm">
                                                    <li className="flex items-start gap-2">
                                                        <span className="text-teal-600 font-bold">•</span>
                                                        Complete the HIV test in complete privacy
                                                    </li>
                                                    <li className="flex items-start gap-2">
                                                        <span className="text-teal-600 font-bold">•</span>
                                                        Use the platform to specify a pickup location
                                                    </li>
                                                    <li className="flex items-start gap-2">
                                                        <span className="text-teal-600 font-bold">•</span>
                                                        Receive secure results directly in Kaupod
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>

                                    <Button
                                        type="submit"
                                        className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-lg py-4 font-semibold"
                                        disabled={processing}
                                    >
                                        {processing && (
                                            <LoaderCircle className="h-5 w-5 animate-spin mr-3" />
                                        )}
                                        Submit Privacy Kit Request
                                    </Button>
                                </>
                            )}
                        </Form>
                    </div>
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
                        <p className="text-gray-400">&copy; 2024 Kaupod. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </>
    );
}