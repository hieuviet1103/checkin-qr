/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import "leaflet/dist/leaflet.css";
// import { MapContainer } from 'react-leaflet/MapContainer'
// import { TileLayer } from 'react-leaflet/TileLayer'
// import { useMap } from 'react-leaflet/hooks'
import { MapContainer, Marker, TileLayer } from "react-leaflet";

interface MapProps {
  onMapClick: (lat: number, lng: number) => void;
  initialLat?: number;
  initialLng?: number;
}

export default function Map({
  onMapClick,
  initialLat = 10.762622,
  initialLng = 106.660172,
}: MapProps) {
  return (
    <MapContainer center={[51.505, -0.09]} zoom={13} scrollWheelZoom={false}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[51.505, -0.09]}>
        {/* <Popup >
      A pretty CSS3 popup. <br /> Easily customizable.
    </Popup> */}
      </Marker>
    </MapContainer>
  );
}
