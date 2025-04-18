import axios from 'axios';

const GEOCODING_API_URL = 'https://n8n.vietravel.com/webhook/get-geocoding';

interface Location {
  lat: string;
  lon: string;
  display_name: string;
  class: string;
  type: string;
}

interface GeocodingResponse {
  location: Location[];
}

export async function forwardGeocode(address: string): Promise<GeocodingResponse> {
  const response = await axios.get<GeocodingResponse>(GEOCODING_API_URL, {
    params: {
      q: address,
    },
  });
  return response.data;
}

export async function reverseGeocode(lat: number, lng: number): Promise<GeocodingResponse> {
  const response = await axios.get<GeocodingResponse>(GEOCODING_API_URL, {
    params: {
      q: `${lat},${lng}`,
    },
  });
  return response.data;
}