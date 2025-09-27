import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { X, MapPin } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default markers in Leaflet with Webpack
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import markerRetina from 'leaflet/dist/images/marker-icon-2x.png';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerRetina,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
});

interface LocationMapModalProps {
    isOpen: boolean;
    onClose: () => void;
    latitude: number;
    longitude: number;
    locationAddress: string;
    deliveryAddress?: string;
    orderType: 'kit' | 'consultation';
    orderId: number;
}

export default function LocationMapModal({
    isOpen,
    onClose,
    latitude,
    longitude,
    locationAddress,
    deliveryAddress,
    orderType,
    orderId
}: LocationMapModalProps) {
    if (!isOpen) return null;

    const center: [number, number] = [latitude, longitude];

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
            onClick={handleBackdropClick}
        >
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                        <div className={`flex h-10 w-10 items-center justify-center rounded-full ${
                            orderType === 'kit' ? 'bg-red-50' : 'bg-amber-50'
                        }`}>
                            <MapPin className={`h-5 w-5 ${
                                orderType === 'kit' ? 'text-red-700' : 'text-amber-700'
                            }`} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">
                                Delivery Location
                            </h2>
                            <p className="text-sm text-gray-600">
                                {orderType === 'kit' ? 'HIV Testing Kit' : 'Consultation'} #{orderId}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        aria-label="Close modal"
                    >
                        <X className="h-5 w-5 text-gray-500" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    {/* Address Information */}
                    <div className="mb-4 space-y-2">
                        <div>
                            <span className="font-medium text-gray-700">Location Address:</span>
                            <span className="ml-2 text-gray-600">{locationAddress}</span>
                        </div>
                        {deliveryAddress && (
                            <div>
                                <span className="font-medium text-gray-700">Delivery Details:</span>
                                <span className="ml-2 text-gray-600">{deliveryAddress}</span>
                            </div>
                        )}
                        <div className="text-sm text-gray-500">
                            Coordinates: {latitude.toFixed(6)}, {longitude.toFixed(6)}
                        </div>
                    </div>

                    {/* Map */}
                    <div className="h-96 rounded-lg overflow-hidden border border-gray-200">
                        <MapContainer
                            center={center}
                            zoom={15}
                            style={{ height: '100%', width: '100%' }}
                            zoomControl={true}
                            scrollWheelZoom={true}
                        >
                            <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            <Marker position={center}>
                                <Popup>
                                    <div className="text-center">
                                        <div className="font-semibold mb-1">
                                            {orderType === 'kit' ? 'HIV Testing Kit' : 'Consultation'} Delivery
                                        </div>
                                        <div className="text-sm text-gray-600">
                                            {locationAddress}
                                        </div>
                                        {deliveryAddress && (
                                            <div className="text-sm text-gray-600 mt-1">
                                                {deliveryAddress}
                                            </div>
                                        )}
                                    </div>
                                </Popup>
                            </Marker>
                        </MapContainer>
                    </div>

                    {/* Footer */}
                    <div className="mt-4 flex justify-end">
                        <button
                            onClick={onClose}
                            className={`px-6 py-2 rounded-lg font-medium text-white transition-colors ${
                                orderType === 'kit' 
                                    ? 'bg-red-50 hover:bg-red-50' 
                                    : 'bg-amber-50 hover:bg-amber-50'
                            }`}
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}