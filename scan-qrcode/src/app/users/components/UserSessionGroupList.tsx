'use client';

import { Table, Tag, message } from 'antd';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { useEffect, useState } from 'react';

interface UserSessionGroup {
  session_id: number;
  user_id: number;
  group_id: number;
  session_name: string;
  group_name: string;
  create_at: string;
  is_active: boolean;
}

interface UserSessionGroupListProps {
  userId: number;
}

export default function UserSessionGroupList({ userId }: UserSessionGroupListProps) {
  const [userSessionGroups, setUserSessionGroups] = useState<UserSessionGroup[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchUserSessionGroups = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/users/${userId}/sessions`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch user session groups');
      const data = await response.json();
      setUserSessionGroups(data.user_session_groups);
    } catch {
      message.error('Không thể tải danh sách session và group của user');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: 'Session',
      dataIndex: 'session_name',
      key: 'session_name',
    },
    {
      title: 'Group',
      dataIndex: 'group_name',
      key: 'group_name',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'is_active',
      key: 'is_active',
      render: (isActive: boolean) => (
        <Tag color={isActive ? 'green' : 'red'}>
          {isActive ? 'Đang hoạt động' : 'Không hoạt động'}
        </Tag>
      ),
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'create_at',
      key: 'create_at',
      render: (date: string) => format(new Date(date), 'dd/MM/yyyy HH:mm', { locale: vi }),
    },
  ];

  useEffect(() => {
    fetchUserSessionGroups();
  }, [userId]);

  return (
    <Table
      columns={columns}
      dataSource={userSessionGroups}
      loading={loading}
      rowKey={(record) => `${record.session_id}-${record.group_id}`}
    />
  );
} 