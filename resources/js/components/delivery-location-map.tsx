import React, { useState, useEffect, useCallback, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers not showing up
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface DeliveryLocation {
  lat: number;
  lng: number;
  address?: string;
}

interface DeliveryMapProps {
  onLocationSelect: (location: DeliveryLocation) => void;
  initialLocation?: DeliveryLocation;
}

function LocationMarker({ onLocationSelect, initialLocation }: DeliveryMapProps) {
  const [position, setPosition] = useState<[number, number] | null>(
    initialLocation ? [initialLocation.lat, initialLocation.lng] : null
  );

  const map = useMapEvents({
    click: async (e) => {
      const { lat, lng } = e.latlng;
      setPosition([lat, lng]);
      
      // Try to get address from coordinates using reverse geocoding
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
        );
        const data = await response.json();
        const address = data.display_name || `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
        
        onLocationSelect({
          lat,
          lng,
          address
        });
      } catch (error) {
        // Fallback to coordinates if reverse geocoding fails
        onLocationSelect({
          lat,
          lng,
          address: `${lat.toFixed(6)}, ${lng.toFixed(6)}`
        });
      }
    },
  });

  // Set initial position if provided
  useEffect(() => {
    if (initialLocation && !position) {
      setPosition([initialLocation.lat, initialLocation.lng]);
      map.setView([initialLocation.lat, initialLocation.lng], 13);
    }
  }, [initialLocation, map, position]);

  return position === null ? null : <Marker position={position} />;
}

export default function DeliveryLocationMap({ onLocationSelect, initialLocation }: DeliveryMapProps) {
  const [userLocation, setUserLocation] = useState<[number, number]>([51.505, -0.09]); // Default to London
  const [isLoading, setIsLoading] = useState(true);

  // Get user's current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation([latitude, longitude]);
          setIsLoading(false);
          
          // If no initial location is provided, set user's location as default
          if (!initialLocation) {
            onLocationSelect({
              lat: latitude,
              lng: longitude,
              address: `Current Location: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`
            });
          }
        },
        (error) => {
          console.warn('Could not get user location:', error);
          setIsLoading(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000
        }
      );
    } else {
      setIsLoading(false);
    }
  }, [onLocationSelect, initialLocation]);

  const defaultCenter = initialLocation 
    ? [initialLocation.lat, initialLocation.lng] as [number, number]
    : userLocation;

  if (isLoading) {
    return (
      <div className="w-full h-80 bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-700 mx-auto mb-2"></div>
          <p className="text-gray-600">Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-80 rounded-lg overflow-hidden border border-gray-200">
      <MapContainer
        center={defaultCenter}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
        className="z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker onLocationSelect={onLocationSelect} initialLocation={initialLocation} />
      </MapContainer>
    </div>
  );
}