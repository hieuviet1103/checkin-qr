'use client';

import { GeocodeResult } from '@/interfaces/maps/geocoding';
import { EnvironmentOutlined, SearchOutlined } from '@ant-design/icons';
import { Alert, Button, Card, Divider, Input, Space, Typography } from 'antd';
import { useState } from 'react';
import { forwardGeocode, reverseGeocode } from '../lib/geocoding';
import OpenStreetmap from './OpenStreetmap';

const { Title, Text } = Typography;

interface GeocodeProps {
  onResult?: (result: GeocodeResult) => void;
}

const Geocoding: React.FC<GeocodeProps> = ({ onResult }) => {
  const [address, setAddress] = useState('');
  const [latLng, setLatLng] = useState({ lat: '', lng: '' });
  const [result, setResult] = useState<GeocodeResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleForwardGeocode = async () => {
    if (!address.trim()) {
      setError('Vui lòng nhập địa chỉ');
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const response = await forwardGeocode(address);
      if (response.location && response.location.length > 0) {
        const location = response.location[0];
        setResult({
          address: location.display_name,
          lat: parseFloat(location.lat),
          lng: parseFloat(location.lon),
          type: location.type,
          class: location.class
        });
        onResult({
          address: location.display_name,
          lat: parseFloat(location.lat),
          lng: parseFloat(location.lon),
          type: location.type,
          class: location.class
        });
      } else {
        setError('Không tìm thấy tọa độ cho địa chỉ này');
      }
    } catch {
      setError('Đã xảy ra lỗi khi tìm kiếm tọa độ');
    } finally {
      setLoading(false);
    }
  };

  const handleReverseGeocode = async () => {
    const lat = parseFloat(latLng.lat);
    const lng = parseFloat(latLng.lng);
    if (isNaN(lat) || isNaN(lng)) {
      setError('Vui lòng nhập tọa độ hợp lệ');
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const response = await reverseGeocode(lat, lng);
      if (response.location && response.location.length > 0) {
        const location = response.location[0];
        setResult({
          address: location.display_name,
          lat: parseFloat(location.lat),
          lng: parseFloat(location.lon),
          type: location.type,
          class: location.class
        });
      } else {
        setError('Không tìm thấy địa chỉ cho tọa độ này');
      }
    } catch {
      setError('Đã xảy ra lỗi khi tìm kiếm địa chỉ');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <Space direction="vertical" size="large" className="w-full">
        <div>
          <Title level={4}>Tìm tọa độ từ địa chỉ</Title>
          <Space.Compact className="w-full">
            <Input
              placeholder="Nhập địa chỉ (ví dụ: 190 Pasteur, Võ Thị Sáu, Quận 3)"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              onPressEnter={handleForwardGeocode}
            />
            <Button 
              type="primary" 
              icon={<SearchOutlined />}
              onClick={handleForwardGeocode}
              loading={loading}
            >
              Tìm
            </Button>
          </Space.Compact>
        </div>

        <Divider>hoặc</Divider>

        <div>
          <Title level={4}>Tìm địa chỉ từ tọa độ</Title>
          <Space.Compact className="w-full">
            <Input
              placeholder="Vĩ độ"
              value={latLng.lat}
              onChange={(e) => setLatLng({ ...latLng, lat: e.target.value })}
              style={{ width: '45%' }}
            />
            <Input
              placeholder="Kinh độ"
              value={latLng.lng}
              onChange={(e) => setLatLng({ ...latLng, lng: e.target.value })}
              style={{ width: '45%' }}
            />
            <Button 
              type="primary" 
              icon={<SearchOutlined />}
              onClick={handleReverseGeocode}
              loading={loading}
            >
              Tìm
            </Button>
          </Space.Compact>
        </div>

        {error && (
          <Alert
            message="Lỗi"
            description={error}
            type="error"
            showIcon
          />
        )}

        {result && (
          <>
          <Card size="small" className="bg-gray-50">
            <Space direction="vertical">
              <Text strong>Địa chỉ:</Text>
              <Text>{result.address}</Text>
              {result.lat && result.lng && (
                <>
                  <Text strong>Tọa độ:</Text>
                  <Space>
                    <EnvironmentOutlined />
                    <Text copyable>{result.lat}, {result.lng}</Text>
                  </Space>
                </>
              )}
              {result.type && (
                <>
                  <Text strong>Loại:</Text>
                  <Text>{result.type}</Text>
                </>
              )}
              {result.class && (
                <>
                  <Text strong>Phân loại:</Text>
                  <Text>{result.class}</Text>
                </>
              )}
            </Space>
          </Card>

          </>
        )}

<OpenStreetmap 
          center={result?.lat && result?.lng ? { lat: result.lat, lng: result.lng } : { lat: 10.7789241, lng: 106.6880843 }} 
          markerPosition={result?.lat && result?.lng ? { lat: result.lat, lng: result.lng } : { lat: 10.7789241, lng: 106.6880843 }}
          address={result?.address}
        />
        {/* <GoogleMapDisplay 
          center={result?.lat && result?.lng ? { lat: result.lat, lng: result.lng } : { lat: 10.7789241, lng: 106.6880843 }} 
        /> */}
        
      </Space>
    </Card>
  );
};

export default Geocoding;