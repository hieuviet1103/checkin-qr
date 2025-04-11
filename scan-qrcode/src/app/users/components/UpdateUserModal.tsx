'use client';

import { UpdateUserPayload, User, updateUser } from '@/api/userApi';
import { useEffect, useState } from 'react';

interface UpdateUserModalProps {
  show: boolean;
  user: User;
  onHide: () => void;
  onUserUpdated: () => void;
}

export default function UpdateUserModal({ show, user, onHide, onUserUpdated }: UpdateUserModalProps) {
  const [formData, setFormData] = useState<UpdateUserPayload>({
    username: user.username,
    email: user.email,
    role: user.role,
  });
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cập nhật form data khi user thay đổi
  useEffect(() => {
    setFormData({
      username: user.username,
      email: user.email,
      role: user.role,
    });
    setPassword('');
  }, [user]);

  // Danh sách vai trò có sẵn
  const availableRoles = ['Admin', 'User', 'Manager'];

  // Xử lý thay đổi input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Xử lý thay đổi mật khẩu riêng
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  // Xử lý submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.username || !formData.email) {
      setError('Vui lòng điền đầy đủ thông tin');
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Thêm mật khẩu vào dữ liệu cập nhật nếu có
      const updateData = { ...formData };
      if (password) {
        updateData.password = password;
      }
      
      await updateUser(user.id, updateData);
      onUserUpdated();
      onHide();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra khi cập nhật người dùng');
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
            <h5 className="modal-title">Cập nhật người dùng</h5>
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
                <label htmlFor="username" className="form-label">Tên đăng nhập</label>
                <input
                  type="text"
                  className="form-control"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="email" className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="password" className="form-label">
                  Mật khẩu mới <small className="text-muted">(để trống nếu không thay đổi)</small>
                </label>
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  name="password"
                  value={password}
                  onChange={handlePasswordChange}
                  disabled={isSubmitting}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="role" className="form-label">Vai trò</label>
                <select
                  className="form-select"
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  disabled={isSubmitting}
                >
                  {availableRoles.map(role => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
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
                  {isSubmitting ? 'Đang cập nhật...' : 'Cập nhật'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
} 