import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageBreadcrumb } from "../../../components";
import { userService } from "../../../config";
import { User } from "../../../services/userService";
import Swal from 'sweetalert2';
import 'sweetalert2/src/sweetalert2.scss';

const UsersAdminList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [pagination, setPagination] = useState<{
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  }>({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });
  const [stats, setStats] = useState<{
    totalUsers: number;
    totalActive: number;
    totalLocked: number;
  }>({
    totalUsers: 0,
    totalActive: 0,
    totalLocked: 0,
  });
  const navigate = useNavigate();

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await userService.fetchUsers({
        page: pagination.page,
        limit: pagination.limit,
        search: search.trim() || undefined,
        status: statusFilter || undefined,
      });
      setUsers(response.data || []);
      setPagination(response.pagination || pagination);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Không thể tải danh sách users", error);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const data = await userService.getStats();
      setStats(data);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Không thể tải thống kê", error);
    }
  };

  useEffect(() => {
    loadUsers();
    loadStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.page, search, statusFilter]);

  const filtered = useMemo(() => {
    return users;
  }, [users]);

  const handleToggleLock = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "locked" ? "active" : "locked";
    const result = await Swal.fire({
      icon: 'warning',
      title: 'Xác nhận',
      text: `Bạn có chắc chắn muốn ${newStatus === "locked" ? "khóa" : "mở khóa"} user này?`,
      showCancelButton: true,
      confirmButtonText: newStatus === "locked" ? "Khóa" : "Mở khóa",
      cancelButtonText: 'Hủy',
      confirmButtonColor: newStatus === "locked" ? '#ef4444' : '#10b981',
      cancelButtonColor: '#6b7280',
    });

    if (!result.isConfirmed) return;

    try {
      await userService.toggleLockUser(id, newStatus as 'active' | 'locked');
      // Fetch lại dữ liệu
      await loadUsers();
      await loadStats();
      await Swal.fire({
        icon: 'success',
        title: 'Thành công',
        text: `Đã ${newStatus === "locked" ? "khóa" : "mở khóa"} user thành công.`,
        confirmButtonText: 'Đã hiểu',
        confirmButtonColor: '#10b981',
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Khóa/mở khóa user thất bại", error);
      await Swal.fire({
        icon: 'error',
        title: 'Lỗi',
        text: 'Không thể khóa/mở khóa user. Vui lòng thử lại.',
        confirmButtonText: 'Đã hiểu',
        confirmButtonColor: '#ef4444',
      });
    }
  };

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      icon: 'warning',
      title: 'Xác nhận xóa',
      text: 'Bạn có chắc chắn muốn xoá user này?',
      showCancelButton: true,
      confirmButtonText: 'Xóa',
      cancelButtonText: 'Hủy',
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
    });

    if (!result.isConfirmed) return;

    try {
      await userService.deleteUser(id);
      // Fetch lại dữ liệu
      await loadUsers();
      await loadStats();
      await Swal.fire({
        icon: 'success',
        title: 'Thành công',
        text: 'Đã xóa user thành công.',
        confirmButtonText: 'Đã hiểu',
        confirmButtonColor: '#10b981',
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Xoá user thất bại", error);
      await Swal.fire({
        icon: 'error',
        title: 'Lỗi',
        text: 'Không thể xoá user. Vui lòng thử lại.',
        confirmButtonText: 'Đã hiểu',
        confirmButtonColor: '#ef4444',
      });
    }
  };

  const handlePageChange = (newPage: number) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  return (
    <>
      <PageBreadcrumb
        title="Quản lý người dùng"
        name="Quản lý người dùng"
        breadCrumbItems={["Konrix", "Apps", "Users"]}
      />

      {/* Header + filter + stats */}
      <div className="card mb-4">
        <div className="p-4 md:p-5 flex flex-col gap-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
              <h3 className="text-lg md:text-xl font-semibold mb-1">
                Danh sách người dùng
              </h3>
              <p className="text-xs md:text-sm text-slate-500">
                Theo dõi trạng thái tài khoản, số dư và nhanh chóng mở/khoá user.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <span className="absolute inset-y-0 left-3 flex items-center text-slate-400 text-sm">
                  <i className="mgc_search_3_line" />
                </span>
                <input
                  className="form-input pl-9 pr-3 py-2 text-xs w-64"
                  placeholder="Tìm theo tên, email hoặc số điện thoại"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPagination((prev) => ({ ...prev, page: 1 }));
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      setPagination((prev) => ({ ...prev, page: 1 }));
                    }
                  }}
                />
              </div>
              <select
                className="form-select text-xs"
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setPagination((prev) => ({ ...prev, page: 1 }));
                }}
              >
                <option value="">Tất cả trạng thái</option>
                <option value="active">Hoạt động</option>
                <option value="locked">Đang khóa</option>
              </select>
              <button
                type="button"
                className="btn bg-emerald-500 text-white text-sm"
                onClick={() => navigate("/admin/users/new")}
              >
                <i className="mgc_add_circle_line mr-1" />
                Tạo user mới
              </button>
            </div>
          </div>

          <div className="grid sm:grid-cols-3 grid-cols-1 gap-3 text-xs md:text-sm">
            <div className="rounded-xl bg-amber-50 px-3 py-2.5 text-amber-700">
              <p className="uppercase tracking-wide text-[10px] font-semibold mb-1">
                Tổng user
              </p>
              <p className="text-xl font-semibold">
                {loading ? "..." : stats.totalUsers}
              </p>
            </div>
            <div className="rounded-xl bg-emerald-50 px-3 py-2.5 text-emerald-700">
              <p className="uppercase tracking-wide text-[10px] font-semibold mb-1">
                Hoạt động
              </p>
              <p className="text-xl font-semibold">
                {loading ? "..." : stats.totalActive}
              </p>
            </div>
            <div className="rounded-xl bg-rose-50 px-3 py-2.5 text-rose-700">
              <p className="uppercase tracking-wide text-[10px] font-semibold mb-1">
                Đang khoá
              </p>
              <p className="text-xl font-semibold">
                {loading ? "..." : stats.totalLocked}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="relative overflow-x-auto">
          <table className="w-full divide-y divide-gray-200 dark:divide-gray-700 text-sm">
            <thead className="bg-slate-50 dark:bg-slate-700/60">
              <tr>
                <th className="px-3 py-2 text-left font-semibold text-slate-600">
                  User
                </th>
                <th className="px-3 py-2 text-left font-semibold text-slate-600">
                  Email
                </th>
                <th className="px-3 py-2 text-left font-semibold text-slate-600">
                  Số điện thoại
                </th>
                <th className="px-3 py-2 text-right font-semibold text-slate-600">
                  Số dư
                </th>
                <th className="px-3 py-2 text-left font-semibold text-slate-600">
                  Trạng thái
                </th>
                <th className="px-3 py-2 text-right font-semibold text-slate-600">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-3 py-6 text-center text-slate-500 text-sm"
                  >
                    Đang tải...
                  </td>
                </tr>
              ) : (
                <>
                  {filtered.map((user) => (
                    <tr
                      key={user.id}
                      className="border-t border-slate-100 dark:border-slate-700/60"
                    >
                      <td className="px-3 py-3 text-sm">
                        <div className="flex flex-col">
                          <span className="font-semibold text-slate-900 dark:text-slate-100">
                            {user.name}
                          </span>
                          <span className="text-[11px] text-slate-500">
                            ID: {user.id}
                          </span>
                        </div>
                      </td>
                      <td className="px-3 py-3 text-xs text-slate-600">
                        {user.email}
                      </td>
                      <td className="px-3 py-3 text-xs text-slate-600">
                        {user.phone || "-"}
                      </td>
                      <td className="px-3 py-3 text-right text-sm font-semibold text-primary">
                        {(user.balance || 0).toLocaleString("vi-VN")}đ
                      </td>
                      <td className="px-3 py-3">
                        <span
                          className={`inline-flex px-2.5 py-0.5 rounded-full text-[11px] font-medium ${
                            user.status === "locked"
                              ? "bg-rose-100 text-rose-700"
                              : "bg-emerald-100 text-emerald-700"
                          }`}
                        >
                          {user.status === "locked" ? "Khoá" : "Hoạt động"}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-right whitespace-nowrap">
                        <button
                          type="button"
                          className="btn btn-xs bg-slate-100 text-xs mr-2"
                          onClick={() => navigate(`/admin/users/${user.id}`)}
                        >
                          <i className="mgc_edit_line mr-1" />
                          Chi tiết
                        </button>
                        <button
                          type="button"
                          className="btn btn-xs bg-slate-100 text-xs mr-2"
                          onClick={() => handleToggleLock(user.id, user.status || "active")}
                        >
                          <i className="mgc_lock_line mr-1" />
                          {user.status === "locked" ? "Mở khoá" : "Khoá"}
                        </button>
                        <button
                          type="button"
                          className="btn btn-xs bg-rose-50 text-rose-600 text-xs"
                          onClick={() => handleDelete(user.id)}
                        >
                          <i className="mgc_delete_line mr-1" />
                          Xoá
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-3 py-6 text-center text-slate-500 text-sm"
                      >
                        Không tìm thấy user nào phù hợp.
                      </td>
                    </tr>
                  )}
                </>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="card-footer flex items-center justify-between px-4 py-3">
            <div className="text-xs text-slate-500">
              Hiển thị {((pagination.page - 1) * pagination.limit) + 1} - {Math.min(pagination.page * pagination.limit, pagination.total)} của {pagination.total} users
            </div>
            <div className="flex gap-1">
              <button
                type="button"
                className="btn btn-xs border"
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
              >
                Trước
              </button>
              {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                let pageNum;
                if (pagination.totalPages <= 5) {
                  pageNum = i + 1;
                } else if (pagination.page <= 3) {
                  pageNum = i + 1;
                } else if (pagination.page >= pagination.totalPages - 2) {
                  pageNum = pagination.totalPages - 4 + i;
                } else {
                  pageNum = pagination.page - 2 + i;
                }
                return (
                  <button
                    key={pageNum}
                    type="button"
                    className={`btn btn-xs ${pagination.page === pageNum ? 'bg-primary text-white' : 'border'}`}
                    onClick={() => handlePageChange(pageNum)}
                  >
                    {pageNum}
                  </button>
                );
              })}
              <button
                type="button"
                className="btn btn-xs border"
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.totalPages}
              >
                Sau
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default UsersAdminList;
