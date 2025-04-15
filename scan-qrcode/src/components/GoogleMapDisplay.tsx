'use client';

import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

// Kiểu dữ liệu cho props
interface GoogleMapDisplayProps {
  center: { lat: number; lng: number };
  markerPosition?: { lat: number; lng: number } | null;
}

// Kích thước bản đồ
const mapContainerStyle = {
  width: '100%',
  height: '400px',
};

const GoogleMapDisplay: React.FC<GoogleMapDisplayProps> = ({ center, markerPosition = { lat: 10.7789241, lng: 106.6880843 } }) => {
  return (
    <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={15} // Mức zoom
      >
        {markerPosition && <Marker position={markerPosition} />}
      </GoogleMap>
    </LoadScript>
  );
};

export default GoogleMapDisplay;