import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PageBreadcrumb } from '../../../components';
import { landingPageService } from '../../../config';
import { LandingPageDomain } from '../../../services/landingPageService';
import Swal from 'sweetalert2';
import 'sweetalert2/src/sweetalert2.scss';

const DomainsAdmin: React.FC = () => {
  const [domains, setDomains] = useState<LandingPageDomain[]>([]);
  const [newDomain, setNewDomain] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const fetchDomains = async () => {
    setLoading(true);
    try {
      const data = await landingPageService.getDomains();
      setDomains(data || []);
    } catch (err: any) {
      console.error('Failed to load domains:', err);
      Swal.fire({
        icon: 'error',
        title: 'Lỗi!',
        text: 'Không thể tải danh sách tên miền',
        confirmButtonText: 'Đóng'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDomains();
  }, []);

  const handleAddDomain = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDomain.trim()) return;

    setSubmitting(true);
    try {
      await landingPageService.createDomain(newDomain.trim());
      setNewDomain('');
      await fetchDomains();
      Swal.fire({
        icon: 'success',
        title: 'Thành công!',
        text: 'Tên miền đã được thêm vào hệ thống',
        confirmButtonText: 'Đóng',
        timer: 1500
      });
    } catch (err: any) {
      console.error('Failed to add domain:', err);
      Swal.fire({
        icon: 'error',
        title: 'Thất bại',
        text: err.message || 'Không thể thêm tên miền. Có thể tên miền đã tồn tại.',
        confirmButtonText: 'Đóng'
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteDomain = async (domain: LandingPageDomain) => {
    const result = await Swal.fire({
      icon: 'warning',
      title: 'Xác nhận xóa',
      text: `Bạn có chắc chắn muốn xóa tên miền "${domain.domain}"? Các Landing Page đang sử dụng tên miền này có thể không hoạt động chính xác.`,
      showCancelButton: true,
      confirmButtonText: 'Xóa',
      cancelButtonText: 'Hủy',
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      reverseButtons: true
    });

    if (!result.isConfirmed) return;

    try {
      await landingPageService.deleteDomain(domain.id);
      setDomains(prev => prev.filter(d => d.id !== domain.id));
      Swal.fire({
        icon: 'success',
        title: 'Đã xóa!',
        text: 'Tên miền đã được xóa thành công.',
        confirmButtonText: 'Đóng',
        timer: 1500
      });
    } catch (err: any) {
      console.error('Failed to delete domain:', err);
      Swal.fire({
        icon: 'error',
        title: 'Lỗi!',
        text: err.message || 'Không thể xóa tên miền',
        confirmButtonText: 'Đóng'
      });
    }
  };

  return (
    <>
      <PageBreadcrumb
        name="Cấu hình tên miền"
        title="Landing Pages"
        breadCrumbItems={['3HSTATION', 'Landing Pages', 'Tên miền']}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Add Domain Form */}
        <div className="card h-fit">
          <div className="card-header">
            <h4 className="card-title">Thêm tên miền mới</h4>
          </div>
          <div className="card-body">
            <form onSubmit={handleAddDomain}>
              <div className="mb-4">
                <label className="text-slate-600 dark:text-slate-400 text-sm font-semibold mb-2 block">
                  Tên miền / Subdomain
                </label>
                <input
                  type="text"
                  placeholder="Ví dụ: landing.domain.com"
                  className="form-input"
                  value={newDomain}
                  onChange={e => setNewDomain(e.target.value)}
                  disabled={submitting}
                  required
                />
                <span className="text-xs text-slate-400 mt-1 block">
                  Nhập tên miền hoặc subdomain trỏ về IP của máy chủ web hiện tại.
                </span>
              </div>
              <button
                type="submit"
                className="btn bg-primary text-white w-full"
                disabled={submitting}
              >
                {submitting ? 'Đang lưu...' : 'Thêm tên miền'}
              </button>
            </form>
          </div>
        </div>

        {/* Domains List */}
        <div className="md:col-span-2 card">
          <div className="card-header">
            <h4 className="card-title">Danh sách tên miền khả dụng</h4>
          </div>
          <div className="card-body">
            {loading ? (
              <div className="text-center py-6 text-slate-500">Đang tải tên miền...</div>
            ) : domains.length === 0 ? (
              <div className="text-center py-6 text-slate-500">Chưa cấu hình tên miền nào.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full table-auto">
                  <thead className="bg-slate-50 dark:bg-slate-700/50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-300">
                        Tên miền
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-300">
                        Ngày thêm
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600 dark:text-slate-300">
                        Thao tác
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                    {domains.map(dom => (
                      <tr key={dom.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                        <td className="px-4 py-3 font-medium">
                          <Link
                            to={`/admin/landing-pages?search=${encodeURIComponent(dom.domain)}`}
                            className="text-primary hover:underline font-mono"
                          >
                            {dom.domain}
                          </Link>
                        </td>
                        <td className="px-4 py-3 text-slate-500 dark:text-slate-400 text-sm">
                          {new Date(dom.created_at).toLocaleDateString('vi-VN')}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button
                            onClick={() => handleDeleteDomain(dom)}
                            className="text-red-500 hover:text-red-700 font-semibold text-sm transition"
                            title="Xóa tên miền"
                          >
                            <i className="mgc_delete_2_line text-lg" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default DomainsAdmin;
