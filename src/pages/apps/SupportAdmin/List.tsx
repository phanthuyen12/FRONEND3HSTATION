import React, { useEffect, useMemo, useState } from "react";
import { PageBreadcrumb } from "../../../components";
import { adminContactService } from "../../../config";
import { ContactRequest } from "../../../services/adminContactService";
import Swal from 'sweetalert2';
import 'sweetalert2/src/sweetalert2.scss';

const SupportAdminList: React.FC = () => {
  const [contacts, setContacts] = useState<ContactRequest[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [pagination, setPagination] = useState<{
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  }>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  const loadContacts = async () => {
    try {
      setLoading(true);
      const response = await adminContactService.fetchContacts({
        page: pagination.page,
        limit: pagination.limit,
        status: statusFilter || undefined,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
      });
      setContacts(response.data || []);
      setPagination(response.pagination || pagination);
    } catch (error) {
      console.error("Không thể tải danh sách liên hệ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContacts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.page, pagination.limit, statusFilter, startDate, endDate]);

  const filtered = useMemo(() => {
    return contacts;
  }, [contacts]);

  const handleExportExcel = async () => {
    try {
      setLoading(true);
      const response = await adminContactService.fetchContacts({
        page: 1,
        limit: 10000,
        status: statusFilter || undefined,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
      });
      const exportData = response.data || [];
      if (exportData.length === 0) {
        Swal.fire({ icon: 'info', title: 'Không có dữ liệu', text: 'Không có dữ liệu để xuất.'});
        return;
      }
      
      const csvRows = [];
      const headers = ['ID', 'Họ Tên', 'Số điện thoại', 'Nhu cầu tư vấn', 'Ngày gửi', 'Trạng thái'];
      csvRows.push(headers.join(','));
      
      exportData.forEach(item => {
        const dateStr = new Date(item.created_at).toLocaleString('vi-VN');
        const statusMap: Record<string, string> = { 'pending': 'Chờ xử lý', 'contacted': 'Đã liên hệ', 'resolved': 'Đã giải quyết' };
        const statusStr = statusMap[item.status] || item.status;
        const row = [
          item.id,
          `"${item.name.replace(/"/g, '""')}"`,
          `="${item.phone}"`, // To prevent Excel from stripping leading zeros
          `"${item.interest.replace(/"/g, '""')}"`,
          `"${dateStr}"`,
          `"${statusStr}"`
        ];
        csvRows.push(row.join(','));
      });
      
      const csvString = csvRows.join('\n');
      const blob = new Blob(['\uFEFF' + csvString], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `YeuCauHoTro_${new Date().getTime()}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Lỗi khi xuất excel:', error);
      Swal.fire({ icon: 'error', title: 'Lỗi', text: 'Không thể xuất file excel.'});
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, currentStatus: string) => {
    const { value: newStatus } = await Swal.fire({
      title: 'Cập nhật trạng thái',
      input: 'select',
      inputOptions: {
        'pending': 'Chờ xử lý',
        'contacted': 'Đã liên hệ',
        'resolved': 'Đã giải quyết'
      },
      inputValue: currentStatus,
      showCancelButton: true,
      confirmButtonText: 'Cập nhật',
      cancelButtonText: 'Hủy',
    });

    if (!newStatus || newStatus === currentStatus) return;

    try {
      await adminContactService.updateContactStatus(id, newStatus as any);
      await loadContacts();
      await Swal.fire({
        icon: 'success',
        title: 'Thành công',
        text: `Đã cập nhật trạng thái.`,
        confirmButtonColor: '#10b981',
      });
    } catch (error) {
      console.error("Cập nhật trạng thái thất bại", error);
      await Swal.fire({
        icon: 'error',
        title: 'Lỗi',
        text: 'Không thể cập nhật trạng thái. Vui lòng thử lại.',
        confirmButtonColor: '#ef4444',
      });
    }
  };

  const handlePageChange = (newPage: number) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'pending':
        return <span className="inline-flex px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-amber-100 text-amber-700">Chờ xử lý</span>;
      case 'contacted':
        return <span className="inline-flex px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-blue-100 text-blue-700">Đã liên hệ</span>;
      case 'resolved':
        return <span className="inline-flex px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-100 text-emerald-700">Đã giải quyết</span>;
      default:
        return <span className="inline-flex px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-gray-100 text-gray-700">{status}</span>;
    }
  }

  return (
    <>
      <PageBreadcrumb
        title="Yêu cầu hỗ trợ"
        name="Yêu cầu hỗ trợ"
        breadCrumbItems={["Konrix", "Apps", "Support"]}
      />

      {/* Header + filter */}
      <div className="card mb-4">
        <div className="p-4 md:p-5 flex flex-col gap-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
              <h3 className="text-lg md:text-xl font-semibold mb-1">
                Danh sách yêu cầu tư vấn/hỗ trợ
              </h3>
              <p className="text-xs md:text-sm text-slate-500">
                Theo dõi các yêu cầu đăng ký tư vấn tài khoản PLUS / PRO từ khách hàng.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1">
                <input 
                  type="date" 
                  className="form-input text-xs w-32" 
                  value={startDate} 
                  onChange={(e) => {
                    setStartDate(e.target.value);
                    setPagination((prev) => ({ ...prev, page: 1 }));
                  }} 
                  title="Từ ngày"
                />
                <span className="text-slate-400">-</span>
                <input 
                  type="date" 
                  className="form-input text-xs w-32" 
                  value={endDate} 
                  onChange={(e) => {
                    setEndDate(e.target.value);
                    setPagination((prev) => ({ ...prev, page: 1 }));
                  }} 
                  title="Đến ngày"
                />
              </div>
              <select
                className="form-select text-xs w-48"
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setPagination((prev) => ({ ...prev, page: 1 }));
                }}
              >
                <option value="">Tất cả trạng thái</option>
                <option value="pending">Chờ xử lý</option>
                <option value="contacted">Đã liên hệ</option>
                <option value="resolved">Đã giải quyết</option>
              </select>
              {/* Limit selector */}
              <select
                className="form-select text-xs w-28"
                value={pagination.limit}
                onChange={(e) => {
                  setPagination((prev) => ({ ...prev, limit: Number(e.target.value), page: 1 }));
                }}
              >
                <option value={10}>10 / trang</option>
                <option value={20}>20 / trang</option>
                <option value={50}>50 / trang</option>
              </select>
              <button
                type="button"
                className="btn bg-primary text-white text-xs whitespace-nowrap"
                onClick={handleExportExcel}
                disabled={loading}
              >
                <i className="mgc_download_line mr-1" />
                Xuất Excel
              </button>
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
                  Họ Tên
                </th>
                <th className="px-3 py-2 text-left font-semibold text-slate-600">
                  Số điện thoại
                </th>
                <th className="px-3 py-2 text-left font-semibold text-slate-600">
                  Nhu cầu tư vấn
                </th>
                <th className="px-3 py-2 text-left font-semibold text-slate-600">
                  Ngày gửi
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
                  {filtered.map((contact) => (
                    <tr
                      key={contact.id}
                      className="border-t border-slate-100 dark:border-slate-700/60"
                    >
                      <td className="px-3 py-3 text-sm font-semibold text-slate-900 dark:text-slate-100">
                        {contact.name}
                      </td>
                      <td className="px-3 py-3 text-sm font-medium text-slate-700 dark:text-slate-300">
                        {contact.phone}
                      </td>
                      <td className="px-3 py-3 text-xs text-slate-600">
                        {contact.interest}
                      </td>
                      <td className="px-3 py-3 text-xs text-slate-500">
                        {new Date(contact.created_at).toLocaleString("vi-VN")}
                      </td>
                      <td className="px-3 py-3">
                        {getStatusBadge(contact.status)}
                      </td>
                      <td className="px-3 py-3 text-right whitespace-nowrap">
                        <button
                          type="button"
                          className="btn btn-xs bg-slate-100 text-xs"
                          onClick={() => handleUpdateStatus(contact.id, contact.status)}
                        >
                          <i className="mgc_edit_line mr-1" />
                          Cập nhật trạng thái
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
                        Không có yêu cầu hỗ trợ nào.
                      </td>
                    </tr>
                  )}
                </>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination — always visible */}
        <div className="card-footer flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3">
          <div className="text-xs text-slate-500">
            {loading ? (
              <span>Đang tải...</span>
            ) : (
              <span>
                Hiển thị{' '}
                <strong>{pagination.total === 0 ? 0 : ((pagination.page - 1) * pagination.limit) + 1}</strong>
                {' – '}
                <strong>{Math.min(pagination.page * pagination.limit, pagination.total)}</strong>
                {' '}của{' '}
                <strong>{pagination.total}</strong> yêu cầu
              </span>
            )}
          </div>
          <div className="flex gap-1">
            <button
              type="button"
              className="btn btn-xs border"
              onClick={() => handlePageChange(1)}
              disabled={pagination.page === 1 || loading}
              title="Trang đầu"
            >
              «
            </button>
            <button
              type="button"
              className="btn btn-xs border"
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page === 1 || loading}
            >
              Trước
            </button>
            {Array.from({ length: Math.min(5, pagination.totalPages || 1) }, (_, i) => {
              const total = pagination.totalPages || 1;
              let pageNum: number;
              if (total <= 5) {
                pageNum = i + 1;
              } else if (pagination.page <= 3) {
                pageNum = i + 1;
              } else if (pagination.page >= total - 2) {
                pageNum = total - 4 + i;
              } else {
                pageNum = pagination.page - 2 + i;
              }
              return (
                <button
                  key={pageNum}
                  type="button"
                  className={`btn btn-xs ${pagination.page === pageNum ? 'bg-primary text-white' : 'border'}`}
                  onClick={() => handlePageChange(pageNum)}
                  disabled={loading}
                >
                  {pageNum}
                </button>
              );
            })}
            <button
              type="button"
              className="btn btn-xs border"
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.totalPages || pagination.totalPages === 0 || loading}
            >
              Sau
            </button>
            <button
              type="button"
              className="btn btn-xs border"
              onClick={() => handlePageChange(pagination.totalPages)}
              disabled={pagination.page === pagination.totalPages || pagination.totalPages === 0 || loading}
              title="Trang cuối"
            >
              »
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default SupportAdminList;
