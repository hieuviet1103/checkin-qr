"use client";

import { sessionAPI } from '@/lib/api';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Modal, message } from 'antd';
import { useEffect, useState } from 'react';
import SessionForm from './components/SessionForm';
import SessionList from './components/SessionList';

interface Session {
  session_id: number;
  session_name: string;
  start_time?: string;
  end_time?: string;
  base_url: string;
}

export default function SessionsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSession, setEditingSession] = useState<Session | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(false);

  
  useEffect(() => {
    fetchSessions();
  }, []);
  
  const handleCreateSession = async (values: { session_name: string, start_time: string, end_time: string, base_url: string }) => {
    try {
      await sessionAPI.createSession(values);
      message.success('Tạo session thành công');
      setIsModalOpen(false);
      fetchSessions();
    } catch {
      message.error('Không thể tạo session');
    }
  };

  const handleUpdateSession = async (values: { session_name: string, start_time: string, end_time: string, base_url: string }) => {
    if (!editingSession?.session_id) return;
    try {
      await sessionAPI.updateSession(editingSession.session_id.toString(), values);
      message.success('Cập nhật session thành công');
      setIsModalOpen(false);
      setEditingSession(null);
      fetchSessions();
    } catch {
      message.error('Không thể cập nhật session');
    }
  };
  const handleDelete = async (session: Session) => {
    try {
      await sessionAPI.deleteSession(session.session_id.toString());
      message.success('Xóa session thành công');
      fetchSessions();
    } catch {
      message.error('Không thể xóa session');
    }
  };

  const fetchSessions = async () => {
    try {
      setLoading(true);
      const response = await sessionAPI.getSessions();
      setSessions(response);
    } catch {
      message.error('Không thể tải danh sách sessions');
    } finally {
      setLoading(false);
    }
  };
  const showModal = (session?: Session) => {
    if (session) {
      console.log(session);
      setEditingSession(session);
    }
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setEditingSession(null);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Quản lý Sessions</h1>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => showModal()}
        >
          Tạo Session mới
        </Button>
      </div>

      <SessionList onEdit={showModal} onDelete={handleDelete} sessions={sessions} loading={loading} />

      <Modal
        title={editingSession ? 'Cập nhật Session' : 'Tạo Session mới'}
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
      >
        <SessionForm
          initialValues={editingSession || undefined}
          onSubmit={editingSession ? handleUpdateSession : handleCreateSession}
          onCancel={handleCancel}          
        />
      </Modal>
    </div>
  );
}