'use client';

import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import '@ant-design/v5-patch-for-react-19';
import { Button, Modal, Table } from 'antd';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

interface Session {
  session_id: number;
  session_name: string;
  start_time?: string;
  end_time?: string;
  created_at?: string;
  base_url: string;
}

interface SessionListProps {
  onEdit: (session: Session) => void;
  onDelete: (session: Session) => void;
  sessions: Session[];
  loading: boolean;
}

export default function SessionList({ onEdit, onDelete, sessions, loading }: SessionListProps) {
  const handleDelete = (session: Session) => {
    Modal.confirm({
      title: 'Xác nhận xóa',
      content: `Bạn có chắc chắn muốn xóa session "${session.session_name}"?`,
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk() {
        onDelete(session);
      },
    });
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
            onClick={() => handleDelete(record)}
          />
        </div>
      ),
    },
  ];

//   useEffect(() => {
//     fetchSessions();
//   }, []);

  return (
    <Table
      columns={columns}
      dataSource={sessions}
      loading={loading}
      rowKey="session_id"
    />
  );
} 