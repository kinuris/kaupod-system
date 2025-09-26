import React, { useState, useEffect, useRef, useCallback } from 'react';
import { router } from '@inertiajs/react';
import { X, MapPin, Calendar, FileText, Crosshair } from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface ReturnKitModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: number;
}

const ReturnKitModal: React.FC<ReturnKitModalProps> = ({ isOpen, onClose, orderId }) => {
  const [formData, setFormData] = useState({
    return_location_address: '',
    return_latitude: '',
    return_longitude: '',
    return_address: '',
    return_date: '',
    return_notes: '',
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isGeocodingAddress, setIsGeocodingAddress] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  const reverseGeocode = useCallback(async (lat: number, lng: number) => {
    setIsGeocodingAddress(true);
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`);
      const data = await response.json();
      if (data.display_name) {
        setFormData(prev => ({
          ...prev,
          return_location_address: data.display_name,
        }));
      } else {
        // Fallback to coordinates if no address found
        setFormData(prev => ({
          ...prev,
          return_location_address: `${lat.toFixed(6)}, ${lng.toFixed(6)}`,
        }));
      }
    } catch (error) {
      console.error('Reverse geocoding failed:', error);
      // Fallback to coordinates if geocoding fails
      setFormData(prev => ({
        ...prev,
        return_location_address: `${lat.toFixed(6)}, ${lng.toFixed(6)}`,
      }));
    } finally {
      setIsGeocodingAddress(false);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    router.patch(`/kit-orders/${orderId}/client-status`, {
      status: 'returning',
      ...formData,
    }, {
      preserveScroll: true,
      onSuccess: () => {
        onClose();
        setFormData({
          return_location_address: '',
          return_latitude: '',
          return_longitude: '',
          return_address: '',
          return_date: '',
          return_notes: '',
        });
      },
      onError: (errors) => {
        setErrors(errors);
      },
      onFinish: () => {
        setIsSubmitting(false);
      }
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const updateMapPin = useCallback((lat: number, lng: number) => {
    if (!mapInstanceRef.current) return;

    // Remove existing marker
    if (markerRef.current) {
      mapInstanceRef.current.removeLayer(markerRef.current);
    }

    // Add new marker
    markerRef.current = L.marker([lat, lng], {
      draggable: true
    }).addTo(mapInstanceRef.current);

    // Update form data
    setFormData(prev => ({
      ...prev,
      return_latitude: lat.toString(),
      return_longitude: lng.toString(),
    }));

    // Handle marker drag
    markerRef.current.on('dragend', (e) => {
      const marker = e.target;
      const position = marker.getLatLng();
      setFormData(prev => ({
        ...prev,
        return_latitude: position.lat.toString(),
        return_longitude: position.lng.toString(),
      }));
      // Update address when marker is dragged
      reverseGeocode(position.lat, position.lng);
    });

    // Reverse geocoding to get address (optional)
    reverseGeocode(lat, lng);
  }, [reverseGeocode]);

  // Initialize map when modal opens
  useEffect(() => {
    if (isOpen && mapRef.current && !mapInstanceRef.current) {
      // Default center - Manila, Philippines (adjust as needed)
      const defaultLat = 14.5995;
      const defaultLng = 120.9842;

      mapInstanceRef.current = L.map(mapRef.current).setView([defaultLat, defaultLng], 13);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(mapInstanceRef.current);

      // Add click handler to drop pin
      mapInstanceRef.current.on('click', (e: L.LeafletMouseEvent) => {
        const { lat, lng } = e.latlng;
        updateMapPin(lat, lng);
      });
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]); // Only depend on isOpen to avoid re-initialization

  // Handle initial pin placement after map is created
  useEffect(() => {
    if (mapInstanceRef.current && isOpen && formData.return_latitude && formData.return_longitude) {
      const lat = parseFloat(formData.return_latitude);
      const lng = parseFloat(formData.return_longitude);
      // Only add initial pin if no marker exists yet
      if (!markerRef.current) {
        updateMapPin(lat, lng);
        // Center map on existing pin only on initial load
        mapInstanceRef.current.setView([lat, lng], 15);
      }
    }
  }, [isOpen, formData.return_latitude, formData.return_longitude, updateMapPin]);

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          
          setFormData(prev => ({
            ...prev,
            return_latitude: lat.toString(),
            return_longitude: lng.toString(),
          }));

          // Update map and pin
          if (mapInstanceRef.current) {
            mapInstanceRef.current.setView([lat, lng], 15);
            updateMapPin(lat, lng);
          }
        },
        (error) => {
          console.error('Error getting location:', error);
          alert('Unable to get your current location. Please drop a pin on the map or enter coordinates manually.');
        }
      );
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  };

  // Format datetime-local input value
  const formatDateForInput = (date: string) => {
    if (!date) return '';
    const d = new Date(date);
    return d.toISOString().slice(0, 16);
  };

  // Set minimum date to current date + 1 hour
  const getMinDateTime = () => {
    const now = new Date();
    now.setHours(now.getHours() + 1);
    return now.toISOString().slice(0, 16);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Set Return Location & Date</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <form id="return-form" onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Map Section */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin className="h-4 w-4 inline mr-1" />
                Drop a Pin on the Map *
              </label>
              <div className="relative">
                <div 
                  ref={mapRef} 
                  className="w-full h-64 border border-gray-300 rounded-md"
                  style={{ minHeight: '256px' }}
                />
                <div className="absolute top-2 right-2 z-[1000]">
                  <button
                    type="button"
                    onClick={getCurrentLocation}
                    className="bg-white shadow-md rounded-md px-3 py-2 text-sm font-medium text-pink-600 hover:text-pink-800 hover:bg-gray-50 border border-gray-200"
                  >
                    <Crosshair className="h-4 w-4 inline mr-1" />
                    Use Current Location
                  </button>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Click on the map to drop a pin at your preferred return location, or drag the pin to adjust
              </p>
            </div>

            {/* Return Location Address */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin className="h-4 w-4 inline mr-1" />
                Return Location Address *
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="return_location_address"
                  value={formData.return_location_address}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 text-gray-900"
                  placeholder="Address will be auto-filled from map or enter manually"
                  required
                />
                {isGeocodingAddress && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-pink-600"></div>
                  </div>
                )}
              </div>
              {errors.return_location_address && (
                <p className="text-red-500 text-xs mt-1">{errors.return_location_address}</p>
              )}
              {(formData.return_latitude && formData.return_longitude) && (
                <p className="text-xs text-gray-500 mt-1">
                  Coordinates: {parseFloat(formData.return_latitude).toFixed(6)}, {parseFloat(formData.return_longitude).toFixed(6)}
                </p>
              )}
            </div>

          {/* Coordinates - Read Only */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Latitude (Auto-filled from map)
              </label>
              <input
                type="text"
                name="return_latitude"
                value={formData.return_latitude}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600 cursor-not-allowed"
                placeholder="Drop a pin on the map"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Longitude (Auto-filled from map)
              </label>
              <input
                type="text"
                name="return_longitude"
                value={formData.return_longitude}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600 cursor-not-allowed"
                placeholder="Drop a pin on the map"
              />
            </div>
          </div>


          {/* Detailed Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Detailed Address (Optional)
            </label>
            <input
              type="text"
              name="return_address"
              value={formData.return_address}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
              placeholder="Unit number, building name, etc."
            />
          </div>

          {/* Return Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="h-4 w-4 inline mr-1" />
              Preferred Return Date & Time *
            </label>
            <input
              type="datetime-local"
              name="return_date"
              value={formatDateForInput(formData.return_date)}
              onChange={handleInputChange}
              min={getMinDateTime()}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
              required
            />
            {errors.return_date && (
              <p className="text-red-500 text-xs mt-1">{errors.return_date}</p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              Select when you'd prefer the kit to be collected
            </p>
          </div>

          {/* Return Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FileText className="h-4 w-4 inline mr-1" />
              Additional Notes (Optional)
            </label>
            <textarea
              name="return_notes"
              value={formData.return_notes}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
              placeholder="Any special instructions for collection..."
            />
            <p className="text-xs text-gray-500 mt-1">
              Maximum 1000 characters
            </p>
          </div>

          </form>
        </div>

        {/* Form Actions - Fixed at bottom */}
        <div className="flex gap-3 p-6 border-t bg-gray-50">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="return-form"
            disabled={isSubmitting}
            className="flex-1 px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 transition-colors disabled:bg-pink-300 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Saving...' : 'Set Return Details'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReturnKitModal;