'use client';

import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import '@ant-design/v5-patch-for-react-19';
import { Button, Modal, Table } from 'antd';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

interface Group {
  group_id: number;
  group_name: string;
  created_at?: string;
}

interface GroupListProps {
  onEdit: (group: Group) => void;
  onDelete: (group: Group) => void;
  groups: Group[];
  loading: boolean;
}

export default function GroupList({ onEdit, onDelete, groups, loading }: GroupListProps) {
  const handleDelete = (group: Group) => {
    Modal.confirm({
      title: 'Xác nhận xóa',
      content: `Bạn có chắc chắn muốn xóa vị trí "${group.group_name}"?`,
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk() {
        onDelete(group);
      },
    });
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'group_id',
      key: 'group_id',
    },
    {
      title: 'Tên vị trí',
      dataIndex: 'group_name',
      key: 'group_name',
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
      render: (_: unknown, record: Group) => (
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

  return (
    <Table
      columns={columns}
      dataSource={groups}
      loading={loading}
      rowKey="group_id"
    />
  );
} 