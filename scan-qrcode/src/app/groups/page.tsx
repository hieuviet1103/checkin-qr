"use client";

import { sessionAPI } from '@/lib/api';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Modal, message } from 'antd';
import { useState } from 'react';
import GroupForm from './components/GroupForm';
import GroupList from './components/GroupList';

interface Group {
  group_id: number;
  group_name: string;
}

interface Session {
  session_id: number;
  session_name: string;
}

export default function GroupsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<Group | null>(null);
  const [editingSession, setEditingSession] = useState<Session | null>(null);

  const handleCreateGroup = async (values: { group_name: string }) => {
    try {
      const response = await fetch('/api/groups', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(values)
      });
      if (!response.ok) throw new Error('Failed to create group');
      setIsModalOpen(false);
    } catch (error) {
      throw error;
    }
  };

  const handleUpdateGroup = async (values: { group_name: string }) => {
    if (!editingGroup?.group_id) return;
    try {
      const response = await fetch(`/api/groups/${editingGroup.group_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(values)
      });
      if (!response.ok) throw new Error('Failed to update group');
      setIsModalOpen(false);
      setEditingGroup(null);
    } catch (error) {
      throw error;
    }
  };

  const handleCreateSession = async (values: { session_name: string }) => {
    try {
      await sessionAPI.createSession(values);
      message.success('Tạo session thành công');
      setIsModalOpen(false);
    } catch {
      message.error('Không thể tạo session');
    }
  };

  const showModal = (group?: Group) => {
    if (group) {
      setEditingGroup(group);
    }
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setEditingGroup(null);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Quản lý Groups</h1>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => showModal()}
        >
          Tạo Group mới
        </Button>
      </div>

      <GroupList onEdit={showModal} />

      <Modal
        title={editingGroup ? 'Cập nhật Group' : 'Tạo Group mới'}
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
      >
        <GroupForm
          initialValues={editingGroup || undefined}
          onSubmit={editingGroup ? handleUpdateGroup : handleCreateGroup}
          onCancel={handleCancel}
        />
      </Modal>
    </div>
  );
}