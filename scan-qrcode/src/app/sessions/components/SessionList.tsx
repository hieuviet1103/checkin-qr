'use client';

import { sessionAPI } from '@/lib/api';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Table, message } from 'antd';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { useEffect, useState } from 'react';

interface Session {
  session_id: number;
  session_name: string;
  start_time: string | null;
  end_time: string | null;
  created_at: string | null;
}

interface SessionListProps {
  onEdit: (session: Session) => void;
}

export default function SessionList({ onEdit }: SessionListProps) {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      const response = await sessionAPI.getSessions();
      console.log(response);
      setSessions(response);
    } catch {
      message.error('Không thể tải danh sách sessions');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await sessionAPI.deleteSession(id.toString());
      message.success('Xóa session thành công');
      fetchSessions();
    } catch {
      message.error('Không thể xóa session');
    }
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'session_id',
      key: 'session_id',
    },
    {
      title: 'Tên Session',
      dataIndex: 'session_name',
      key: 'session_name',
    },
    {
      title: 'Từ',
      dataIndex: 'start_time',
      key: 'start_time',
      render: (date: string) => date && format(new Date(date), 'dd/MM/yyyy HH:mm', { locale: vi }),
    },
    {
      title: 'Đến',
      dataIndex: 'end_time',
      key: 'end_time',
      render: (date: string) => date && format(new Date(date), 'dd/MM/yyyy HH:mm', { locale: vi }),
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (date: string) => date && format(new Date(date), 'dd/MM/yyyy HH:mm', { locale: vi }),
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_: unknown, record: Session) => (
        <div className="space-x-2">
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => onEdit(record)}
          />
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.session_id)}
          />
        </div>
      ),
    },
  ];

  useEffect(() => {
    fetchSessions();
  }, []);

  return (
    <Table
      columns={columns}
      dataSource={sessions}
      loading={loading}
      rowKey="session_id"
    />
  );
} 