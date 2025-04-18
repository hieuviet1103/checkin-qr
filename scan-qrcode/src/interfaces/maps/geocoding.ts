
interface GeocodeResult {
    address: string;
    lat: number | null;
    lng: number | null;
    type?: string;
    class?: string;
  }

  export type { GeocodeResult };
