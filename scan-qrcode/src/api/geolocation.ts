import { GeolocationError, GeolocationResponse } from '@/types/geolocation';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<GeolocationResponse | GeolocationError>
) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const url = `https://www.googleapis.com/geolocation/v1/geolocate?key=${apiKey}`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        considerIp: true, // Sử dụng IP để xác định vị trí
      }),
    });

    const data: GeolocationResponse = await response.json();
    res.status(200).json(data);
  } catch  {
    res.status(500).json({ error: 'Failed to fetch geolocation' });
  }
}