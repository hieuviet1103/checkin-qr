"use client";

import { User, getUsers } from "@/api/userApi";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import CreateUserModal from "./components/CreateUserModal";
import PermissionModal from "./components/PermissionModal";
import UpdateUserModal from "./components/UpdateUserModal";
import styles from './page.module.css';

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRoles, setSelectedRoles] = useState<string[]>(['Tất cả']);
  const [roleOptions, setRoleOptions] = useState<string[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [sortConfig, setSortConfig] = useState<{ key: keyof User; direction: 'asc' | 'desc' } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isAuthorized, setIsAuthorized] = useState(false);
  
  const { isAuthenticated, user, loading, initialized } = useAuth();
  const router = useRouter();
  const itemsPerPage = 10;

  // Kiểm tra xác thực và quyền admin
  useEffect(() => {
    if (!loading && initialized) {
      if (!isAuthenticated) {
        router.push('/login');
        return;
      }

      if (!user?.roles?.includes('admin')) {
        router.push('/');
        return;
      }

      setIsAuthorized(true);
    }
  }, [isAuthenticated, user, loading, initialized, router]);

  // Lấy danh sách người dùng
  const loadUsers = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getUsers();
      setUsers(data);
      setFilteredUsers(data);

      // Extract unique roles
      const uniqueRoles = Array.from(new Set(data.map(user => user.role)));
      setRoleOptions(['Tất cả', ...uniqueRoles]);
    } catch (err) {
      setError('Không thể tải danh sách người dùng');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthorized) {
      loadUsers();
    }
  }, [isAuthorized]);

  // Filter users based on search term and selected roles
  useEffect(() => {
    const filtered = users.filter((user) => {
      const matchesSearch = 
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = selectedRoles.includes('Tất cả') || selectedRoles.includes(user.role);
      return matchesSearch && matchesRole;
    });

    // Apply sorting
    if (sortConfig !== null) {
      filtered.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    setFilteredUsers(filtered);
    if (filtered.length !== users.length) {
      setCurrentPage(1);
    }
  }, [searchTerm, selectedRoles, users, sortConfig]);

  // Handle role selection
  const handleRoleChange = (role: string) => {
    if (role === 'Tất cả') {
      setSelectedRoles(['Tất cả']);
    } else {
      setSelectedRoles(prev => {
        const newSelection = prev.includes(role)
          ? prev.filter(r => r !== role)
          : [...prev.filter(r => r !== 'Tất cả'), role];
        return newSelection.length === 0 ? ['Tất cả'] : newSelection;
      });
    }
  };

  // Handle sorting
  const handleSort = (key: keyof User) => {
    setSortConfig(prev => {
      if (prev && prev.key === key) {
        return { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' };
      }
      return { key, direction: 'asc' };
    });
  };

  // Xử lý mở modal chỉnh sửa
  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setShowUpdateModal(true);
  };

  // Xử lý mở modal phân quyền
  const handlePermission = (user: User) => {
    setSelectedUser(user);
    setShowPermissionModal(true);
  };

  // Cập nhật danh sách sau khi thực hiện thao tác
  const handleUserUpdated = () => {
    loadUsers();
  };

  // Pagination calculations
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredUsers.slice(startIndex, endIndex);

  // Handle page change
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Hiển thị loading khi đang kiểm tra xác thực
  if (loading || !initialized) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Đang tải...</span>
        </div>
      </div>
    );
  }

  // Không hiển thị gì khi chưa được xác thực (đang chuyển hướng)
  if (!isAuthorized) {
    return null;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Quản lý người dùng</h1>

      <div className="d-flex gap-3 mb-4">
        {/* Search Input */}
        <input
          type="text"
          placeholder="Tìm kiếm theo tên hoặc email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchInput}
        />

        {/* Role Filter Dropdown */}
        <div className={styles.dropdownContainer}>
          <button
            className={styles.dropdownButton}
            onClick={() => setDropdownOpen(prev => !prev)}
          >
            Lọc theo vai trò
          </button>
          {dropdownOpen && (
            <div className={styles.dropdownMenu}>
              {roleOptions.map((role) => (
                <label key={role} className={styles.dropdownOption}>
                  <input
                    type="checkbox"
                    value={role}
                    checked={selectedRoles.includes(role)}
                    onChange={() => handleRoleChange(role)}
                    className={styles.checkbox}
                  />
                  <span className={styles.checkboxLabel}>{role}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Add User Button */}
        <button 
          className="btn btn-primary ms-auto"
          onClick={() => setShowCreateModal(true)}
        >
          Thêm người dùng
        </button>
      </div>

      {error && <div className="alert alert-danger mb-4">{error}</div>}

      {/* Users Table */}
      <div className="table-responsive">
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.tableHeader} onClick={() => handleSort('username')}>
                Tên đăng nhập {sortConfig?.key === 'username' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}
              </th>
              <th className={styles.tableHeader} onClick={() => handleSort('email')}>
                Email {sortConfig?.key === 'email' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}
              </th>
              <th className={styles.tableHeader} onClick={() => handleSort('role')}>
                Vai trò {sortConfig?.key === 'role' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}
              </th>
              <th className={styles.tableHeader}>Quyền hạn</th>
              <th className={styles.tableHeader} onClick={() => handleSort('created_at')}>
                Ngày tạo {sortConfig?.key === 'created_at' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}
              </th>
              <th className={styles.tableHeader}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={6} className="text-center py-4">
                  <div className="spinner-border" role="status">
                    <span className="visually-hidden">Đang tải...</span>
                  </div>
                </td>
              </tr>
            ) : currentItems.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-4">
                  Không có dữ liệu
                </td>
              </tr>
            ) : (
              currentItems.map((user) => (
                <tr key={user.id} className={styles.tableRow}>
                  <td className={styles.tableCell}>{user.username}</td>
                  <td className={styles.tableCell}>{user.email}</td>
                  <td className={styles.tableCell}>
                    <span className={`${styles.badge} ${styles[`badge${user.role}`]}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className={styles.tableCell}>
                    {user.roles && user.roles.length > 0 ? (
                      <div className="d-flex flex-wrap gap-1">
                        {user.roles.map((role, index) => (
                          <span key={index} className={`${styles.badge} ${styles.badgePermission}`}>
                            {role}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-muted">Chưa có quyền</span>
                    )}
                  </td>
                  <td className={styles.tableCell}>
                    {new Date(user.created_at).toLocaleDateString('vi-VN')}
                  </td>
                  <td className={styles.tableCell}>
                    <div className="btn-group" role="group">
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => handleEdit(user)}
                      >
                        Sửa
                      </button>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-info"
                        onClick={() => handlePermission(user)}
                      >
                        Phân quyền
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {!isLoading && filteredUsers.length > 0 && (
        <div className={styles.pagination}>
          <button
            className={styles.paginationButton}
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Trước
          </button>
          
          {(() => {
            const pageNumbers = [];
            let startPage = 1;
            let endPage = totalPages;
            const showEllipsis = totalPages > 7;
            
            if (showEllipsis) {
              if (currentPage <= 4) {
                startPage = 1;
                endPage = 5;
              } else if (currentPage + 3 >= totalPages) {
                startPage = totalPages - 4;
                endPage = totalPages;
              } else {
                startPage = currentPage - 2;
                endPage = currentPage + 2;
              }
            }
            
            if (showEllipsis && startPage > 1) {
              pageNumbers.push(
                <button
                  key={1}
                  className={`${styles.paginationButton} ${currentPage === 1 ? styles.activePage : ''}`}
                  onClick={() => handlePageChange(1)}
                >
                  1
                </button>
              );
              
              if (startPage > 2) {
                pageNumbers.push(
                  <span key="start-ellipsis" className={styles.paginationEllipsis}>...</span>
                );
              }
            }
            
            for (let i = startPage; i <= endPage; i++) {
              pageNumbers.push(
                <button
                  key={i}
                  className={`${styles.paginationButton} ${currentPage === i ? styles.activePage : ''}`}
                  onClick={() => handlePageChange(i)}
                >
                  {i}
                </button>
              );
            }
            
            if (showEllipsis && endPage < totalPages) {
              if (endPage < totalPages - 1) {
                pageNumbers.push(
                  <span key="end-ellipsis" className={styles.paginationEllipsis}>...</span>
                );
              }
              
              pageNumbers.push(
                <button
                  key={totalPages}
                  className={`${styles.paginationButton} ${currentPage === totalPages ? styles.activePage : ''}`}
                  onClick={() => handlePageChange(totalPages)}
                >
                  {totalPages}
                </button>
              );
            }
            
            return pageNumbers;
          })()}
          
          <button
            className={styles.paginationButton}
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Sau
          </button>
        </div>
      )}

      {/* Modals */}
      {showCreateModal && (
        <CreateUserModal 
          show={showCreateModal}
          onHide={() => setShowCreateModal(false)}
          onUserCreated={handleUserUpdated}
        />
      )}

      {showUpdateModal && selectedUser && (
        <UpdateUserModal 
          show={showUpdateModal}
          user={selectedUser}
          onHide={() => setShowUpdateModal(false)}
          onUserUpdated={handleUserUpdated}
        />
      )}

      {showPermissionModal && selectedUser && (
        <PermissionModal 
          show={showPermissionModal}
          user={selectedUser}
          onHide={() => setShowPermissionModal(false)}
          onPermissionUpdated={handleUserUpdated}
        />
      )}
    </div>
  );
}
