'use client';

import { User, updateUserRoles } from '@/api/userApi';
import { useEffect, useState } from 'react';

interface PermissionModalProps {
  show: boolean;
  user: User;
  onHide: () => void;
  onPermissionUpdated: () => void;
}

export default function PermissionModal({ show, user, onHide, onPermissionUpdated }: PermissionModalProps) {
  const [selectedRoles, setSelectedRoles] = useState<string[]>(user.roles || []);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cập nhật lại roles khi user thay đổi
  useEffect(() => {
    setSelectedRoles(user.roles || []);
  }, [user]);

  // Danh sách quyền có sẵn
  const availablePermissions = [
    { value: 'scan', label: 'Quét mã QR' },
    { value: 'dashboard', label: 'Xem dashboard' },
    { value: 'checkin', label: 'Check-in' },
    { value: 'users', label: 'Quản lý người dùng' },
    { value: 'reports', label: 'Báo cáo' },
  ];

  // Xử lý khi check/uncheck quyền
  const handleRoleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    
    if (checked) {
      setSelectedRoles(prev => [...prev, value]);
    } else {
      setSelectedRoles(prev => prev.filter(role => role !== value));
    }
  };

  // Xử lý submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      setIsSubmitting(true);
      await updateUserRoles(user.id, selectedRoles);
      onPermissionUpdated();
      onHide();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra khi cập nhật quyền');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!show) return null;

  return (
    <div className="modal d-block" tabIndex={-1} role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Phân quyền cho {user.username}</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onHide}
              disabled={isSubmitting}
              aria-label="Close"
            />
          </div>
          <div className="modal-body">
            {error && <div className="alert alert-danger">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <h6>Thông tin người dùng</h6>
                <div className="card p-3 mb-3">
                  <div><strong>Email:</strong> {user.email}</div>
                  <div><strong>Vai trò:</strong> {user.role}</div>
                </div>
              </div>

              <div className="mb-3">
                <h6>Danh sách quyền hạn</h6>
                <div className="card p-3">
                  {availablePermissions.map((permission) => (
                    <div className="form-check" key={permission.value}>
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id={`permission-${permission.value}`}
                        value={permission.value}
                        checked={selectedRoles.includes(permission.value)}
                        onChange={handleRoleChange}
                        disabled={isSubmitting}
                      />
                      <label className="form-check-label" htmlFor={`permission-${permission.value}`}>
                        {permission.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={onHide}
                  disabled={isSubmitting}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Đang cập nhật...' : 'Cập nhật quyền'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
} 