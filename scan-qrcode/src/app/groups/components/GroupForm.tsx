'use client';

import { Button, Form, Input, message } from 'antd';
import { useEffect } from 'react';

interface GroupFormProps {
  initialValues?: {
    group_id?: number;
    group_name: string;
  };
  onSubmit: (values: { group_name: string }) => Promise<void>;
  onCancel: () => void;
}

export default function GroupForm({ initialValues, onSubmit, onCancel }: GroupFormProps) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues);
    }
  }, [initialValues, form]);

  const handleSubmit = async (values: { group_name: string }) => {
    try {
      await onSubmit(values);
      //message.success(initialValues ? 'Cập nhật group thành công' : 'Tạo group thành công');
      form.resetFields();
    } catch  {
      message.error(initialValues ? 'Không thể cập nhật vị trí' : 'Không thể tạo vị trí');
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
        name="group_name"
        label="Tên vị trí"
        rules={[{ required: true, message: 'Vui lòng nhập tên vị trí' }]}
      >
        <Input placeholder="Nhập tên vị trí" />
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