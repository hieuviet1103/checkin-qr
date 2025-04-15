import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { useEffect, useState } from 'react';
import { GeolocationError, GeolocationResponse } from '../types/geolocation';

const containerStyle: React.CSSProperties = {
  width: '100%',
  height: '400px',
};

const Geolocation: React.FC = () => {
  const [location, setLocation] = useState<GeolocationResponse['location'] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const res = await fetch('/api/geolocation');
        const data: GeolocationResponse | GeolocationError = await res.json();

        if ('location' in data) {
          setLocation(data.location);
        } else {
          setError('Unable to fetch location');
        }
      } catch  {
        setError('Error fetching location');
      }
    };

    fetchLocation();
  }, []);

  if (error) return <div>Error: {error}</div>;
  if (!location) return <div>Loading...</div>;

  return (
    <div>
      <h1>Your Location</h1>
      <p>Latitude: {location.lat}</p>
      <p>Longitude: {location.lng}</p>
      <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string}>
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={{ lat: location.lat, lng: location.lng }}
          zoom={10}
        >
          <Marker position={{ lat: location.lat, lng: location.lng }} />
        </GoogleMap>
      </LoadScript>
    </div>
  );
};

export default Geolocation;