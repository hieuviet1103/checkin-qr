'use client';

import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Table, message } from 'antd';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { useEffect, useState } from 'react';

interface Group {
  group_id: number;
  group_name: string;
  create_at: string;
}

interface GroupListProps {
  onEdit: (group: Group) => void;
}

export default function GroupList({ onEdit }: GroupListProps) {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchGroups = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/groups', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch groups');
      const data = await response.json();
      setGroups(data.groups);
    } catch (error) {
      message.error('Không thể tải danh sách groups');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/groups/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (!response.ok) throw new Error('Failed to delete group');
      message.success('Xóa group thành công');
      fetchGroups();
    } catch (error) {
      message.error('Không thể xóa group');
    }
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'group_id',
      key: 'group_id',
    },
    {
      title: 'Tên Group',
      dataIndex: 'group_name',
      key: 'group_name',
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'create_at',
      key: 'create_at',
      render: (date: string) => format(new Date(date), 'dd/MM/yyyy HH:mm', { locale: vi }),
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_: any, record: Group) => (
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
            onClick={() => handleDelete(record.group_id)}
          />
        </div>
      ),
    },
  ];

  useEffect(() => {
    fetchGroups();
  }, []);

  return (
    <Table
      columns={columns}
      dataSource={groups}
      loading={loading}
      rowKey="group_id"
    />
  );
} 