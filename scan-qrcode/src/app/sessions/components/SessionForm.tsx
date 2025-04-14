'use client';

import { Button, Form, Input, message } from 'antd';
import { useEffect } from 'react';

interface SessionFormProps {
  initialValues?: {
    session_id?: number;
    session_name: string;
  };
  onSubmit: (values: { session_name: string }) => Promise<void>;
  onCancel: () => void;
}

export default function SessionForm({ initialValues, onSubmit, onCancel }: SessionFormProps) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues);
    }
  }, [initialValues, form]);

  const handleSubmit = async (values: { session_name: string }) => {
    try {
      await onSubmit(values);
      message.success(initialValues ? 'Cập nhật session thành công' : 'Tạo session thành công');
      form.resetFields();
    } catch  {
      message.error(initialValues ? 'Không thể cập nhật session' : 'Không thể tạo session');
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      initialValues={initialValues}
    >
      <Form.Item
        name="session_name"
        label="Tên Session"
        rules={[{ required: true, message: 'Vui lòng nhập tên session' }]}
      >
        <Input placeholder="Nhập tên session" />
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