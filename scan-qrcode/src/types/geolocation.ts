export interface GeolocationResponse {
    location: {
      lat: number;
      lng: number;
    };
    accuracy: number;
  }
  
  export interface GeolocationError {
    error: string;
  }