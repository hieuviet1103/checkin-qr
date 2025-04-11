'use client';

import { User, deleteUser } from '@/api/userApi';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { useState } from 'react';

interface UserListProps {
  users: User[];
  onEdit: (user: User) => void;
  onPermission: (user: User) => void;
  onUserUpdated: () => void;
}

export default function UserList({ users, onEdit, onPermission, onUserUpdated }: UserListProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // Format ngày tháng
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, 'dd/MM/yyyy HH:mm', { locale: vi });
    } catch {
      return dateString;
    }
  };

  // Xử lý xóa người dùng
  const handleDelete = async (id: number) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa người dùng này?')) {
      return;
    }

    try {
      setIsDeleting(true);
      setDeleteError(null);
      await deleteUser(id);
      onUserUpdated();
    } catch (error) {
      setDeleteError('Không thể xóa người dùng');
      console.error(error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div>
      {deleteError && <div className="alert alert-danger mb-3">{deleteError}</div>}
      
      <div className="table-responsive">
        <table className="table table-striped table-hover">
          <thead>
            <tr>
              <th>ID</th>
              <th>Tên đăng nhập</th>
              <th>Email</th>
              <th>Vai trò</th>
              <th>Quyền hạn</th>
              <th>Ngày tạo</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center">Không có người dùng nào</td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>
                    {user.roles && user.roles.length > 0 ? (
                      <div className="d-flex flex-wrap gap-1">
                        {user.roles.map((role, index) => (
                          <span key={index} className="badge bg-info text-dark">
                            {role}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-muted">Chưa có quyền</span>
                    )}
                  </td>
                  <td>{formatDate(user.created_at)}</td>
                  <td>
                    <div className="btn-group" role="group">
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => onEdit(user)}
                      >
                        Sửa
                      </button>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-info"
                        onClick={() => onPermission(user)}
                      >
                        Phân quyền
                      </button>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDelete(user.id)}
                        disabled={isDeleting}
                      >
                        Xóa
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
} 