import axios from 'axios';

const GEOCODING_API_URL = 'https://maps.googleapis.com/maps/api/geocode/json';

interface GeocodingResponse {
  results: {
    geometry: {
      location: {
        lat: number;
        lng: number;
      };
    };
    formatted_address: string;
  }[];
  status: string;
}

export async function forwardGeocode(address: string): Promise<GeocodingResponse> {
  const response = await axios.get<GeocodingResponse>(GEOCODING_API_URL, {
    params: {
      address,
      key: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    },
  });
  return response.data;
}

export async function reverseGeocode(lat: number, lng: number): Promise<GeocodingResponse> {
  const response = await axios.get<GeocodingResponse>(GEOCODING_API_URL, {
    params: {
      latlng: `${lat},${lng}`,
      key: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    },
  });
  return response.data;
}