'use client';

import { DeleteOutlined, EditOutlined, EnvironmentOutlined } from '@ant-design/icons';
import '@ant-design/v5-patch-for-react-19';
import { Button, Modal, Table, Tooltip } from 'antd';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

interface Group {
  group_id: number;
  group_name: string;
  latitude: number;
  longitude: number;
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
      title: 'Vị trí',
      key: 'location',
      render: (_: unknown, record: Group) => (
        record.latitude && record.longitude && (
        <Tooltip title={`${record.latitude}, ${record.longitude}`}>
          <Button
            type="text"
            icon={<EnvironmentOutlined />}
            onClick={() => window.open(`https://www.google.com/maps?q=${record.latitude},${record.longitude}`, '_blank')}
          >
            Xem trên Google Maps
          </Button>
        </Tooltip>
        )
      ),
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