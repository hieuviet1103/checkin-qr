'use client'
// pages/index.tsx

import type { LatLngTuple } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import dynamic from 'next/dynamic';
import { useRef, useState } from 'react';

// Define type for marker data
interface MarkerData {
  position: LatLngTuple;
  address: string;
}
// Define type for Nominatim search result
interface NominatimResult {
  lat: string;
  lon: string;
  display_name: string;
}


// Import react-leaflet components dynamically to avoid SSR issues
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(
  () => import('react-leaflet').then((mod) => mod.Popup),
  { ssr: false }
);

const Map: React.FC = () => {
  const [marker, setMarker] = useState<MarkerData | null>(null);
  const initialPosition: LatLngTuple = [21.0285, 105.8542]; // Hanoi
  const [searchQuery, setSearchQuery] = useState<string>('');
  const mapRef = useRef<L.Map | null>(null);

  // Function to handle map click and reverse geocoding
  const handleMapClick = async (e: L.LeafletMouseEvent) => {
    const { lat, lng } = e.latlng;

    // Fetch address using Nominatim
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
        { headers: { 'User-Agent': 'MyNextApp/1.0' } }
      );
      const data: { display_name?: string } = await response.json();
      setMarker({
        position: [lat, lng],
        address: data.display_name || 'Unknown address',
      });
    } catch (error) {
      console.error('Error fetching address:', error);
      setMarker({
        position: [lat, lng],
        address: 'Unable to fetch address',
      });
    }
  };

  // Function to handle search
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchQuery)}&format=json&limit=1`,
        { headers: { 'User-Agent': 'MyNextApp/1.0' } }
      );
      const data: NominatimResult[] = await response.json();
      if (data.length > 0) {
        const { lat, lon, display_name } = data[0];
        const position: LatLngTuple = [parseFloat(lat), parseFloat(lon)];
        setMarker({
          position,
          address: display_name,
        });
        // Move map to the searched location
        if (mapRef.current) {
          mapRef.current.setView(position, 13);
        }
      } else {
        alert('No results found');
      }
    } catch (error) {
      console.error('Error searching:', error);
      alert('Error searching for location');
    }
  };

  // Custom component to handle map events
  const MapEvents = () => {
    const map = dynamic(() => import('react-leaflet').then((mod) => mod.useMapEvents))({
      click: handleMapClick,
    });
    return null;
  };



  return (
    <div style={{ height: '100vh', width: '100%', position: 'relative' }}>
      {/* Search box */}
      <div
        style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          zIndex: 1000,
          background: 'white',
          padding: '10px',
          borderRadius: '5px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
        }}
      >
        <form onSubmit={handleSearch}>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for a location..."
            style={{
              padding: '5px',
              width: '200px',
              marginRight: '5px',
            }}
          />
          <button
            type="submit"
            style={{
              padding: '5px 10px',
              background: '#0078A8',
              color: 'white',
              border: 'none',
              borderRadius: '3px',
              cursor: 'pointer',
            }}
          >
            Search
          </button>
        </form>
      </div>

      {/* Map */}
      <MapContainer
        center={initialPosition}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {marker && (
          <Marker position={marker.position}>
            <Popup>
              <div>
                <p><strong>Address:</strong> {marker.address}</p>
                <p>
                  <strong>Coordinates:</strong> {marker.position[0].toFixed(4)},{' '}
                  {marker.position[1].toFixed(4)}
                </p>
              </div>
            </Popup>
          </Marker>
        )}
        <MapEvents />
      </MapContainer>
    </div>
  );
};

export default Map;