'use client';

import 'leaflet/dist/leaflet.css';
// import { MapContainer } from 'react-leaflet/MapContainer'
// import { TileLayer } from 'react-leaflet/TileLayer'
// import { useMap } from 'react-leaflet/hooks'
import { MapContainer, Marker, TileLayer } from 'react-leaflet';

interface MapProps {
  onMapClick: (lat: number, lng: number) => void;
  initialLat?: number;
  initialLng?: number;
}

export default function Map({ onMapClick, initialLat = 10.762622, initialLng = 106.660172 }: MapProps) {
//   const mapRef = useRef<L.Map | null>(null);
//   const markerRef = useRef<L.Marker | null>(null);

//   useEffect(() => {
//     console.log(initialLat, initialLng);
//     console.log(mapRef.current);
//     if (typeof window === 'undefined') return;

//     // Khởi tạo bản đồ
//     if (!mapRef.current) {
//       mapRef.current = L.map('map').setView([initialLat, initialLng], 13);
//       L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//         attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//       }).addTo(mapRef.current);

//       // Thêm marker
//       markerRef.current = L.marker([initialLat, initialLng]).addTo(mapRef.current);
//     }

//     // Xử lý sự kiện click
//     mapRef.current.on('click', (e: L.LeafletMouseEvent) => {
//       const { lat, lng } = e.latlng;
      
//       // Cập nhật vị trí marker
//       if (markerRef.current) {
//         markerRef.current.setLatLng([lat, lng]);
//       } else {
//         markerRef.current = L.marker([lat, lng]).addTo(mapRef.current!);
//       }

//       // Gọi callback
//       onMapClick(lat, lng);
//     });

//     // Cleanup
//     return () => {
//       if (mapRef.current) {
//         mapRef.current.remove();
//         mapRef.current = null;
//       }
//     };
//   }, [initialLat, initialLng, onMapClick]);

  //return <div id="map"  className="h-full w-full" />;

  return (
    // <MapContainer center={[51.505, -0.09]} zoom={13} scrollWheelZoom={false}>
    //   <TileLayer
    //     attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    //     url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    //   />
    // </MapContainer>
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