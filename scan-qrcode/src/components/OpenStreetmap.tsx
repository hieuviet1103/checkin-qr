/* eslint-disable @typescript-eslint/no-unused-vars */
// pages/index.js
import { LatLngExpression, LatLngTuple } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import dynamic from 'next/dynamic';
import { useState } from 'react';

// Import react-leaflet dynamically to avoid SSR issues
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
// Custom component to handle map events
const MapEvents = (handleMapClick: (e: L.LeafletMouseEvent) =>  void) => {
  // const map = dynamic(() => import('react-leaflet').then((mod) => mod.useMapEvents))({
  //   click: handleMapClick,
  // });
  return null;
};
// Kiểu dữ liệu cho props
interface OpenStreetmapDisplayProps {
  center: { lat: number; lng: number };
  markerPosition?: { lat: number; lng: number } | null;
  address?: string;
}

// Kích thước bản đồ
const mapContainerStyle = {
  width: '100%',
  height: '400px',
};

// Define type for marker data
interface MarkerData {
  position: LatLngTuple;
  address: string;
}

 const OpenStreetmap: React.FC<OpenStreetmapDisplayProps> = ({ center, markerPosition = { lat: 10.7789241, lng: 106.6880843 }, address}) => {  
  const [marker, setMarker] = useState<MarkerData | null>(null);
  const initialPosition: LatLngTuple = [21.0285, 105.8542]; // Hanoi
// Function to handle map click and reverse geocoding
const handleMapClick = async (e: L.LeafletMouseEvent) => {
  const { lat, lng } = e.latlng;
  console.log('lat', {lat});
  console.log('lng', {lng});
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

  return (
      <div style={{ height: '400px', width: '100%' }}>
        <MapContainer
          center={markerPosition as LatLngExpression}
          zoom={13}
          style={mapContainerStyle}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
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
        {/* <MapEvents handleMapClick={handleMapClick} /> */}
        </MapContainer>

        {/* <MapContainer
          center={markerPosition as LatLngExpression}
          zoom={13}
          style={mapContainerStyle}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={markerPosition as LatLngExpression} icon={icon({
            iconUrl: '/icons/geo-alt-fill.svg',
            iconSize: [32, 32],
            iconAnchor: [16, 16],
            popupAnchor: [0, -35]
          })}>
            <Popup>
              {address}
            </Popup>
          </Marker>
          <MapEvents />
        </MapContainer> */}
      </div>
    );
  }

  export default OpenStreetmap