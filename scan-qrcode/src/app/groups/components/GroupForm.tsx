'use client';

import Geocoding from '@/components/Geocoding';
import { Button, Form, Input } from 'antd';
import dynamic from 'next/dynamic';
import { useEffect } from 'react';
const MapComponent = dynamic(() => import('@/components/Map'), { ssr: false });

interface GroupFormValues {
  group_name: string;
  latitude?: number;
  longitude?: number;
}

interface GroupFormProps {
  initialValues?: {
    group_name: string;
    latitude?: number;
    longitude?: number;
  };
  onSubmit: (values: GroupFormValues) => void;
  onCancel: () => void;
}

export default function GroupForm({ initialValues, onSubmit, onCancel }: GroupFormProps) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues);
    }
  }, [form, initialValues]);

  const handleSubmit = async (values: GroupFormValues) => {
    try {
      await onSubmit(values);
      //message.success(initialValues ? 'Cập nhật group thành công' : 'Tạo group thành công');
      form.resetFields();
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const handleMapClick = (lat: number, lng: number) => {
    form.setFieldsValue({ latitude: lat, longitude: lng });
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      initialValues={{ latitude: 10.762622, longitude: 106.660172 }}
    >
      <Form.Item
        name="group_name"
        label="Tên vị trí"
        rules={[{ required: true, message: 'Vui lòng nhập tên vị trí' }]}
      >
        <Input />
      </Form.Item>
      <Geocoding />
      <Form.Item label="Vị trí trên bản đồ">
        <div className="h-[400px] w-full rounded-lg overflow-hidden">
          <MapComponent
            onMapClick={handleMapClick}
            initialLat={form.getFieldValue('latitude')}
            initialLng={form.getFieldValue('longitude')}
          />
        </div>
      </Form.Item>

      <Form.Item name="latitude" hidden>
        <Input type="number" />
      </Form.Item>

      <Form.Item name="longitude" hidden>
        <Input type="number" />
      </Form.Item>

      <Form.Item>
        <div className="flex justify-end space-x-2">
          <Button onClick={onCancel}>Hủy</Button>
          <Button type="primary" htmlType="submit">
            {initialValues ? 'Cập nhật' : 'Tạo mới'}
          </Button>
        </div>
      </Form.Item>
    </Form>
  );
} 