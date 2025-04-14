'use client';

import { Button, DatePicker, Form, Input, message } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { useEffect } from 'react';

interface SessionFormProps {
  initialValues?: {
    session_id?: number;
    session_name: string;
    start_time?: string;
    end_time?: string;
    base_url?: string;
  };
  onSubmit: (values: {
    session_name: string;
    start_time: string;
    end_time: string;
    base_url: string;
  }) => Promise<void>;
  onCancel: () => void;
}

interface SessionFormValues {
  session_name: string;
  start_time: Dayjs | null;
  end_time: Dayjs | null;
  base_url: string;
}

export default function SessionForm({ initialValues, onSubmit, onCancel }: SessionFormProps) {
  const [form] = Form.useForm<SessionFormValues>();

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue({
        ...initialValues,
        start_time: initialValues.start_time ? dayjs(initialValues.start_time) : null,
        end_time: initialValues.end_time ? dayjs(initialValues.end_time) : null,
      });
    }
  }, [initialValues, form]);

  const handleSubmit = async (values: SessionFormValues) => {
    try {
      if (!values.start_time || !values.end_time) {
        message.error('Vui lòng chọn thời gian bắt đầu và kết thúc');
        return;
      }

      const formattedValues = {
        session_name: values.session_name,
        start_time: values.start_time.format('YYYY-MM-DD HH:mm:ss'),
        end_time: values.end_time.format('YYYY-MM-DD HH:mm:ss'),
        base_url: values.base_url,
      };
      await onSubmit(formattedValues);
      //form.resetFields();
    } catch {
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

      <Form.Item
        name="start_time"
        initialValue={initialValues?.start_time ? dayjs(initialValues.start_time) : null}
        label="Thời gian bắt đầu"
        rules={[{ required: true, message: 'Vui lòng chọn thời gian bắt đầu' }]}
      >
        <DatePicker
          showTime
          format="DD/MM/YYYY HH:mm:ss"
          placeholder="Chọn thời gian bắt đầu"
          className="w-full"
        />
      </Form.Item>

      <Form.Item
        name="end_time"
        initialValue={initialValues?.end_time ? dayjs(initialValues.end_time) : null}
        label="Thời gian kết thúc"
        rules={[{ required: true, message: 'Vui lòng chọn thời gian kết thúc' }]}
      >
        <DatePicker
          showTime
          format="DD/MM/YYYY HH:mm:ss"
          placeholder="Chọn thời gian kết thúc"
          className="w-full"
        />
      </Form.Item>

      <Form.Item
        name="base_url"
        label="Base URL"
        rules={[{ required: true, message: 'Vui lòng nhập base URL' }]}
      >
        <Input placeholder="Nhập base URL" />
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