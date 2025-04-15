"use client";

import { groupAPI } from '@/lib/api';
import { PlusOutlined } from '@ant-design/icons';
import '@ant-design/v5-patch-for-react-19';
import { Button, Modal, message } from 'antd';
import { useEffect, useState } from 'react';
import GroupForm from './components/GroupForm';
import GroupList from './components/GroupList';

interface Group {
  group_id: number;
  group_name: string;
  latitude: number;
  longitude: number;
  created_at?: string;
}

export default function GroupsPage() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<Group | null>(null);

  const fetchGroups = async () => {
    try {
      setLoading(true);
      const data = await groupAPI.getGroups();
      setGroups(data);
    } catch {
      message.error('Không thể tải danh sách vị trí');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGroup = async (values: { group_name: string; latitude: number; longitude: number }) => {
    try {
      await groupAPI.createGroup(values);
      message.success('Tạo vị trí thành công');
      setIsModalOpen(false);
      fetchGroups();
    } catch {
      message.error('Không thể tạo vị trí');
    }
  };

  const handleUpdateGroup = async (values: { group_name: string; latitude: number; longitude: number }) => {
    if (!editingGroup) return;

    try {
      await groupAPI.updateGroup(editingGroup.group_id.toString(), values);
      message.success('Cập nhật vị trí thành công');
      setIsModalOpen(false);
      setEditingGroup(null);
      fetchGroups();
    } catch {
      message.error('Không thể cập nhật vị trí');
    }
  };

  const handleDeleteGroup = async (group: Group) => {
    try {
      await groupAPI.deleteGroup(group.group_id.toString());
      message.success('Xóa vị trí thành công');
      fetchGroups();
    } catch {
      message.error('Không thể xóa vị trí');
    }
  };

  const handleEdit = (group: Group) => {
    setEditingGroup(group);
    setIsModalOpen(true);
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Quản lý vị trí</h1>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setEditingGroup(null);
            setIsModalOpen(true);
          }}
        >
          Tạo vị trí mới
        </Button>
      </div>

      <GroupList
        groups={groups}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDeleteGroup}
      />

      <Modal
        title={editingGroup ? 'Cập nhật vị trí' : 'Tạo vị trí mới'}
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          setEditingGroup(null);
        }}
        footer={null}
        width={800}
      >
        <GroupForm
          initialValues={editingGroup ? {
            group_name: editingGroup.group_name,
            latitude: editingGroup.latitude,
            longitude: editingGroup.longitude
          } : undefined}
          onSubmit={ editingGroup ? handleUpdateGroup : handleCreateGroup }
          onCancel={() => {
            setIsModalOpen(false);
            setEditingGroup(null);
          }}
        />
      </Modal>
    </div>
  );
}