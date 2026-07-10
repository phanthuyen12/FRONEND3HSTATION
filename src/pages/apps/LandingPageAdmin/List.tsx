import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { PageBreadcrumb } from '../../../components';
import { landingPageService, API_URL, authService } from '../../../config';
import { LandingPage } from '../../../services/landingPageService';
import Swal from 'sweetalert2';
import 'sweetalert2/src/sweetalert2.scss';

const LandingPagesList: React.FC = () => {
  const [pages, setPages] = useState<LandingPage[]>([]);
  const [searchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';
  const [search, setSearch] = useState(initialSearch);
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [limit] = useState(10);
  const [offset, setOffset] = useState(0);
  const navigate = useNavigate();

  const isReadOnly = authService.getUser()?.role === 'viewer';

  useEffect(() => {
    const paramSearch = searchParams.get('search') || '';
    setSearch(paramSearch);
  }, [searchParams]);

  const loadPages = async () => {
    setLoading(true);
    try {
      const result = await landingPageService.getLandingPages({
        search: search || undefined,
        status: statusFilter !== 'all' ? statusFilter : undefined,
        limit,
        offset
      });
      setPages(result.data || []);
      setTotal(result.total || 0);
    } catch (err: any) {
      console.error('Failed to load landing pages:', err);
      Swal.fire({
        icon: 'error',
        title: 'Lỗi!',
        text: 'Không thể tải danh sách Landing Pages',
        confirmButtonText: 'Đóng'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPages();
  }, [search, statusFilter, offset]);

  const handleSoftDelete = async (id: number) => {
    const result = await Swal.fire({
      icon: 'warning',
      title: 'Đưa vào thùng rác?',
      text: 'Trang này sẽ tạm ngừng truy cập công khai nhưng dữ liệu vẫn được lưu trữ.',
      showCancelButton: true,
      confirmButtonText: 'Đồng ý',
      cancelButtonText: 'Hủy',
      confirmButtonColor: '#eab308',
      cancelButtonColor: '#6b7280',
      reverseButtons: true
    });

    if (!result.isConfirmed) return;

    try {
      await landingPageService.deleteLandingPage(id);
      Swal.fire({
        icon: 'success',
        title: 'Thành công',
        text: 'Đã đưa trang vào thùng rác',
        timer: 1500,
        confirmButtonText: 'Đóng'
      });
      loadPages();
    } catch (err: any) {
      Swal.fire({
        icon: 'error',
        title: 'Thất bại',
        text: err.message || 'Không thể đưa trang vào thùng rác',
        confirmButtonText: 'Đóng'
      });
    }
  };

  const handlePermanentDelete = async (page: LandingPage) => {
    const result = await Swal.fire({
      icon: 'warning',
      title: 'Xóa vĩnh viễn?',
      text: `Xác nhận xóa hoàn toàn Landing Page "${page.title}" cùng với toàn bộ tệp tin tải lên, lịch sử phiên bản và biểu mẫu đăng ký. Thao tác này không thể khôi phục!`,
      showCancelButton: true,
      confirmButtonText: 'Xóa vĩnh viễn',
      cancelButtonText: 'Hủy',
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      reverseButtons: true
    });

    if (!result.isConfirmed) return;

    try {
      await landingPageService.destroyLandingPagePermanently(page.id);
      Swal.fire({
        icon: 'success',
        title: 'Đã xóa!',
        text: 'Trang đã bị xóa vĩnh viễn.',
        timer: 1500,
        confirmButtonText: 'Đóng'
      });
      loadPages();
    } catch (err: any) {
      Swal.fire({
        icon: 'error',
        title: 'Thất bại',
        text: err.message || 'Không thể xóa vĩnh viễn trang',
        confirmButtonText: 'Đóng'
      });
    }
  };

  const handleRestore = async (page: LandingPage) => {
    try {
      await landingPageService.updateLandingPage(page.id, { status: 'draft' });
      Swal.fire({
        icon: 'success',
        title: 'Đã khôi phục!',
        text: `Landing Page "${page.title}" đã được chuyển về trạng thái Bản nháp.`,
        timer: 2000,
        confirmButtonText: 'Đóng'
      });
      loadPages();
    } catch (err: any) {
      Swal.fire({
        icon: 'error',
        title: 'Thất bại',
        text: err.message || 'Không thể khôi phục trang',
        confirmButtonText: 'Đóng'
      });
    }
  };

  const handleClone = async (page: LandingPage) => {
    try {
      await landingPageService.cloneLandingPage(page.id);
      Swal.fire({
        icon: 'success',
        title: 'Nhân bản thành công!',
        text: `Đã tạo một bản sao cho trang "${page.title}".`,
        timer: 2000,
        confirmButtonText: 'Đóng'
      });
      loadPages();
    } catch (err: any) {
      Swal.fire({
        icon: 'error',
        title: 'Lỗi',
        text: err.message || 'Nhân bản trang thất bại',
        confirmButtonText: 'Đóng'
      });
    }
  };

  const getStatusBadge = (status: LandingPage['status']) => {
    switch (status) {
      case 'draft':
        return <span className="px-2 py-1 text-xs font-semibold rounded bg-slate-100 text-slate-700">Nháp</span>;
      case 'published':
        return <span className="px-2 py-1 text-xs font-semibold rounded bg-green-100 text-green-700">Đã xuất bản</span>;
      case 'scheduled':
        return <span className="px-2 py-1 text-xs font-semibold rounded bg-blue-100 text-blue-700">Đã lên lịch</span>;
      case 'hidden':
        return <span className="px-2 py-1 text-xs font-semibold rounded bg-yellow-100 text-yellow-700">Tạm ẩn</span>;
      case 'expired':
        return <span className="px-2 py-1 text-xs font-semibold rounded bg-red-100 text-red-700">Hết hạn</span>;
      case 'trash':
        return <span className="px-2 py-1 text-xs font-semibold rounded bg-purple-100 text-purple-700">Thùng rác</span>;
      default:
        return <span className="px-2 py-1 text-xs font-semibold rounded bg-slate-100 text-slate-700">{status}</span>;
    }
  };

  // Build the public link URL to view
  const getPublicUrl = (page: LandingPage) => {
    if (page.domain === 'localhost' || page.domain === '127.0.0.1') {
      return `https://api.aetrading.vn${page.path}`;
    }
    return `http://${page.domain}${page.path}`;
  };

  return (
    <>
      <PageBreadcrumb
        name="Danh sách Landing Pages"
        title="Landing Pages"
        breadCrumbItems={['3HSTATION', 'Landing Pages', 'Danh sách']}
      />

      <div className="card">
        <div className="card-header flex flex-wrap items-center justify-between gap-3">
          <div>
            <h4 className="card-title mb-0">Quản lý Landing Page</h4>
          </div>
          {!isReadOnly && (
            <div className="flex items-center gap-2">
              <button
                className="btn bg-primary text-white"
                onClick={() => navigate('/admin/landing-pages/new')}
              >
                <i className="mgc_add_circle_line mr-1" /> Tạo Landing Page mới
              </button>
            </div>
          )}
        </div>

        <div className="card-body">
          {/* Search and Filters */}
          <div className="flex flex-wrap gap-3 mb-4">
            <div className="flex-1 min-w-[250px]">
              <input
                type="text"
                className="form-input"
                placeholder="Tìm kiếm theo tên, tên miền hoặc đường dẫn..."
                value={search}
                onChange={e => {
                  setSearch(e.target.value);
                  setOffset(0);
                }}
              />
            </div>
            <select
              className="form-select w-44"
              value={statusFilter}
              onChange={e => {
                setStatusFilter(e.target.value);
                setOffset(0);
              }}
            >
              <option value="all">Tất cả trạng thái (trừ Thùng rác)</option>
              <option value="draft">Bản nháp</option>
              <option value="published">Đã xuất bản</option>
              <option value="scheduled">Đã lên lịch</option>
              <option value="hidden">Tạm ẩn</option>
              <option value="expired">Hết hạn</option>
              <option value="trash">Thùng rác</option>
            </select>
          </div>

          {/* Table list */}
          {loading ? (
            <div className="text-center py-10 text-slate-500">Đang tải danh sách Landing Page...</div>
          ) : pages.length === 0 ? (
            <div className="text-center py-10 text-slate-500">Không tìm thấy Landing Page nào.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto">
                <thead className="bg-slate-50 dark:bg-slate-700/50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-300">
                      Tên Landing Page
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-300">
                      Đường dẫn URL
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-300">
                      Tên miền
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-300">
                      Trạng thái
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-slate-600 dark:text-slate-300">
                      Lượt xem
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-slate-600 dark:text-slate-300">
                      Đăng ký (Leads)
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-300">
                      Cập nhật cuối
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600 dark:text-slate-300">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                  {pages.map(page => (
                    <tr key={page.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                      {/* Name */}
                      <td className="px-4 py-3">
                        <div className="font-semibold text-slate-800 dark:text-slate-200">
                          <Link to={`/admin/landing-pages/${page.id}`} className="hover:text-primary">
                            {page.title}
                          </Link>
                        </div>
                        <span className="text-xs text-slate-400">
                          Tạo bởi: {page.creator_name || 'Hệ thống'}
                        </span>
                      </td>

                      {/* URL Path */}
                      <td className="px-4 py-3 text-sm text-slate-500 dark:text-slate-400">
                        {page.status === 'published' || page.status === 'scheduled' ? (
                          <a
                            href={getPublicUrl(page)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline font-mono"
                          >
                            {page.path}
                          </a>
                        ) : (
                          <span className="font-mono text-slate-400">{page.path}</span>
                        )}
                      </td>

                      {/* Domain */}
                      <td className="px-4 py-3 text-sm font-mono">
                        <Link
                          to={`/admin/landing-pages?search=${encodeURIComponent(page.domain)}`}
                          className="text-primary hover:underline"
                        >
                          {page.domain}
                        </Link>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3">{getStatusBadge(page.status)}</td>

                      {/* View count */}
                      <td className="px-4 py-3 text-center text-sm font-semibold text-slate-700 dark:text-slate-300">
                        {page.views_count}
                      </td>

                      {/* Submissions count */}
                      <td className="px-4 py-3 text-center text-sm font-semibold text-slate-700 dark:text-slate-300">
                        {page.submissions_count > 0 ? (
                          <Link
                            to={`/admin/landing-pages/${page.id}?tab=leads`}
                            className="badge bg-success/10 text-success text-xs font-semibold px-2 py-0.5 hover:bg-success/20"
                          >
                            {page.submissions_count} Leads
                          </Link>
                        ) : (
                          '0'
                        )}
                      </td>

                      {/* Last Update */}
                      <td className="px-4 py-3 text-sm text-slate-500 dark:text-slate-400">
                        {new Date(page.updated_at).toLocaleString('vi-VN')}
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3 text-right">
                        <div className="flex justify-end gap-1.5">
                          {/* Private Preview Button */}
                          <a
                            href={`${API_URL}/preview/lp/${page.preview_token}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-sm bg-slate-100 hover:bg-slate-200 text-slate-600 dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-slate-300"
                            title="Xem trước riêng tư"
                          >
                            <i className="mgc_eye_line text-base" />
                          </a>

                          {/* Clone Button */}
                          {!isReadOnly && (
                            <button
                              onClick={() => handleClone(page)}
                              className="btn btn-sm bg-slate-100 hover:bg-slate-200 text-slate-600 dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-slate-300"
                              title="Nhân bản"
                            >
                              <i className="mgc_copy_line text-base" />
                            </button>
                          )}

                          {/* Standard operations */}
                          {page.status === 'trash' ? (
                            <>
                              {/* Restore */}
                              {!isReadOnly && (
                                <button
                                  onClick={() => handleRestore(page)}
                                  className="btn btn-sm bg-green-500/10 text-green-600 hover:bg-green-500/20"
                                  title="Khôi phục về Nháp"
                                >
                                  <i className="mgc_refresh_line text-base" />
                                </button>
                              )}
                              {/* Permanent Delete */}
                              {!isReadOnly && (
                                <button
                                  onClick={() => handlePermanentDelete(page)}
                                  className="btn btn-sm bg-red-500/10 text-red-600 hover:bg-red-500/20"
                                  title="Xóa vĩnh viễn"
                                >
                                  <i className="mgc_delete_2_line text-base" />
                                </button>
                              )}
                            </>
                          ) : (
                            <>
                              {/* Edit / View */}
                              <button
                                onClick={() => navigate(`/admin/landing-pages/${page.id}`)}
                                className="btn btn-sm bg-primary/10 text-primary hover:bg-primary/20"
                                title={isReadOnly ? "Xem chi tiết" : "Chỉnh sửa"}
                              >
                                <i className={isReadOnly ? "mgc_eye_line text-base" : "mgc_edit_line text-base"} />
                              </button>
                              {/* View Leads */}
                              <button
                                onClick={() => navigate(`/admin/landing-pages/${page.id}?tab=leads`)}
                                className="btn btn-sm bg-success/10 text-success hover:bg-success/20"
                                title="Xem dữ liệu đăng ký (Leads)"
                              >
                                <i className="mgc_user_3_line text-base" />
                              </button>
                              {/* Soft Delete */}
                              {!isReadOnly && (
                                <button
                                  onClick={() => handleSoftDelete(page.id)}
                                  className="btn btn-sm bg-red-500/10 text-red-650 hover:bg-red-500/20"
                                  title="Xóa vào Thùng rác"
                                >
                                  <i className="mgc_delete_2_line text-base" />
                                </button>
                              )}
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {total > limit && (
            <div className="flex items-center justify-between mt-4">
              <span className="text-sm text-slate-500 dark:text-slate-400">
                Hiển thị {offset + 1} - {Math.min(offset + limit, total)} trên tổng số {total} trang
              </span>
              <div className="flex gap-2">
                <button
                  className="btn bg-slate-100 hover:bg-slate-200 dark:bg-slate-700"
                  disabled={offset === 0}
                  onClick={() => setOffset(prev => Math.max(0, prev - limit))}
                >
                  Trước
                </button>
                <button
                  className="btn bg-slate-100 hover:bg-slate-200 dark:bg-slate-700"
                  disabled={offset + limit >= total}
                  onClick={() => setOffset(prev => prev + limit)}
                >
                  Sau
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default LandingPagesList;
