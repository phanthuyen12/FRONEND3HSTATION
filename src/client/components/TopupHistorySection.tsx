import React, { useEffect, useMemo, useState } from "react";
import { topupService } from "../../config";

type Topup = {
  code: string;
  bank?: string;
  amount?: number | string;
  topupStatus: TopupStatus;
  createdAt?: string;
  updatedAt?: string;
};

type TopupStatus = 'chua-thanh-toan' | 'het-han' | 'da-thanh-cong';

const TopupHistorySection: React.FC = () => {
  const [topups, setTopups] = useState<Topup[]>([]);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState<TopupStatus | "tat-ca">(
    "tat-ca"
  );
  const [search, setSearch] = useState("");
  const [pageSize, setPageSize] = useState<number>(10);
  const [page, setPage] = useState<number>(1);
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

  useEffect(() => {
    loadHistory();
  }, [page, pageSize, statusFilter]);

  const loadHistory = async () => {
    try {
      setLoading(true);
      const data = await topupService.getHistory({
        page,
        limit: pageSize,
        status: statusFilter !== "tat-ca" ? statusFilter : undefined
      });
      setTopups(data.data || []);
      if (data.pagination) {
        setPagination(prev => ({ ...prev, ...data.pagination }));
      }
    } catch (error: any) {
      console.error("Failed to load topup history", error);
      setTopups([]);
    } finally {
      setLoading(false);
    }
  };

  const summary = useMemo(() => {
    const paid = topups
      .filter((t) => t.topupStatus === 'da-thanh-cong')
      .reduce((sum, t) => sum + parseFloat(String(t.amount || 0)), 0);
    const unpaid = topups
      .filter((t) => t.topupStatus === 'chua-thanh-toan')
      .reduce((sum, t) => sum + parseFloat(String(t.amount || 0)), 0);
    return { paid, unpaid };
  }, [topups]);

  const filteredRecords = useMemo(() => {
    let result = topups;

    if (search.trim()) {
      const keyword = search.toLowerCase();
      result = result.filter(
        (r) =>
          r.code.toLowerCase().includes(keyword) ||
          (r.bank && r.bank.toLowerCase().includes(keyword))
      );
    }

    return result;
  }, [topups, search]);

  const getStatusLabel = (status: TopupStatus) => {
    const labels: Record<TopupStatus, string> = {
      'chua-thanh-toan': 'Chưa thanh toán',
      'het-han': 'Hết hạn',
      'da-thanh-cong': 'Đã thanh toán'
    };
    return labels[status] || status;
  };

  const getStatusColor = (status: TopupStatus) => {
    const colors: Record<TopupStatus, string> = {
      'chua-thanh-toan': 'bg-amber-100 text-amber-700',
      'het-han': 'bg-rose-100 text-rose-700',
      'da-thanh-cong': 'bg-emerald-100 text-emerald-700'
    };
    return colors[status] || 'bg-slate-100 text-slate-700';
  };

  const handlePageChange = (next: number) => {
    if (next < 1 || next > pagination.totalPages) return;
    setPage(next);
  };

  return (
    <div className="card">
      <div className="card-header flex flex-wrap items-center justify-between gap-3">
        <h4 className="card-title mb-0">Lịch sử nạp tiền</h4>
        <div className="flex items-center gap-2 text-xs">
          <span>Hiển thị:</span>
          <select
            className="form-select form-select-sm w-20"
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setPage(1);
            }}
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>

      {/* Bộ lọc */}
      <div className="px-4 pt-4 pb-2 flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-700/60">
        <div className="flex flex-wrap gap-3 flex-1">
          <div className="relative">
            <span className="absolute inset-y-0 left-3 flex items-center text-slate-400 text-sm">
              <i className="mgc_search_3_line" />
            </span>
            <input
              type="text"
              className="form-input pl-9 pr-3 py-2 text-xs w-56"
              placeholder="Mã giao dịch / Ngân hàng"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>
          <select
            className="form-select text-xs w-40"
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value as TopupStatus | "tat-ca")
            }
          >
            <option value="tat-ca">-- Trạng thái --</option>
            <option value="chua-thanh-toan">Chưa thanh toán</option>
            <option value="het-han">Hết hạn</option>
            <option value="da-thanh-cong">Đã thanh toán</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn btn-sm bg-primary text-white text-xs">
            Tìm kiếm
          </button>
          <button
            className="btn btn-sm border text-xs"
            onClick={() => {
              setSearch("");
              setStatusFilter("tat-ca");
              setPage(1);
              loadHistory();
            }}
          >
            Bỏ lọc
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full table-auto text-xs">
          <thead className="bg-slate-50 dark:bg-slate-700/50">
            <tr>
              <th className="px-3 py-2 text-left font-semibold text-slate-600">
                Mã giao dịch
              </th>
              <th className="px-3 py-2 text-left font-semibold text-slate-600">
                Trạng thái
              </th>
              <th className="px-3 py-2 text-left font-semibold text-slate-600">
                Ngân hàng
              </th>
              <th className="px-3 py-2 text-right font-semibold text-slate-600">
                Số tiền cần thanh toán
              </th>
              <th className="px-3 py-2 text-right font-semibold text-slate-600">
                Số tiền nhận được
              </th>
              <th className="px-3 py-2 text-left font-semibold text-slate-600">
                Thời gian tạo hoá đơn
              </th>
              <th className="px-3 py-2 text-left font-semibold text-slate-600">
                Cập nhật
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-3 py-6 text-center text-slate-500 text-sm"
                >
                  Đang tải...
                </td>
              </tr>
            ) : filteredRecords.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-3 py-6 text-center text-slate-500 text-sm"
                >
                  Không có lịch sử nạp tiền phù hợp điều kiện lọc.
                </td>
              </tr>
            ) : (
              filteredRecords.map((item) => (
                <tr
                  key={item.code}
                  className="border-t border-slate-100 dark:border-slate-700/60"
                >
                  <td className="px-3 py-2 text-primary whitespace-nowrap">
                    {item.code}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2.5 py-0.5 rounded-full text-[11px] font-medium ${getStatusColor(item.topupStatus)}`}
                    >
                      {getStatusLabel(item.topupStatus)}
                    </span>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-slate-700">
                    {item.bank || '-'}
                  </td>
                  <td className="px-3 py-2 text-right whitespace-nowrap">
                    {parseFloat(String(item.amount || 0)).toLocaleString("vi-VN")}đ
                  </td>
                  <td className="px-3 py-2 text-right whitespace-nowrap">
                    {item.topupStatus === 'da-thanh-cong' 
                      ? parseFloat(String(item.amount || 0)).toLocaleString("vi-VN") + 'đ'
                      : '0đ'}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-slate-600">
                    {item.createdAt ? new Date(item.createdAt).toLocaleString('vi-VN') : '-'}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-slate-600">
                    {item.updatedAt ? new Date(item.updatedAt).toLocaleString('vi-VN') : '-'}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer tổng kết & phân trang */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 dark:border-slate-700/60 px-4 py-3 text-xs">
        <div className="flex flex-col gap-1 text-slate-600">
          <span>
            Đã thanh toán:{" "}
            <span className="font-semibold text-emerald-500">
              {summary.paid.toLocaleString("vi-VN")}đ
            </span>
          </span>
          <span>
            Chưa thanh toán:{" "}
            <span className="font-semibold text-rose-500">
              {summary.unpaid.toLocaleString("vi-VN")}đ
            </span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            className="px-2 py-1 rounded border text-xs disabled:opacity-50"
            onClick={() => handlePageChange(pagination.page - 1)}
            disabled={pagination.page <= 1}
          >
            Trước
          </button>
          <span>
            Trang{" "}
            <span className="font-semibold">
              {pagination.page}/{pagination.totalPages || 1}
            </span>
          </span>
          <button
            className="px-2 py-1 rounded border text-xs disabled:opacity-50"
            onClick={() => handlePageChange(page + 1)}
            disabled={page >= pagination.totalPages}
          >
            Sau
          </button>
        </div>
      </div>
    </div>
  );
};

export default TopupHistorySection;















