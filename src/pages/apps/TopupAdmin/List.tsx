import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { PageBreadcrumb } from "../../../components";
import { API_URL } from "../../../config";
import Swal from "sweetalert2";
import "sweetalert2/src/sweetalert2.scss";

/* ─── Types ─── */
interface TopupItem {
  code: string;
  userId: string;
  amount: number;
  bank: string;
  accountNumber?: string;
  accountName?: string;
  topupStatus: string;
  status: string;
  paymentProof?: string;
  note?: string;
  reason?: string;
  expiresAt?: string;
  userName: string;
  userEmail: string;
  createdAt: string;
  updatedAt: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface Stats {
  totalTopups: number;
  totalPending: number;
  totalApproved: number;
  totalRejected: number;
  totalAmount: number;
}

const fmt = (n: number) => n.toLocaleString("vi-VN");

const statusBadge = (status: string) => {
  switch (status) {
    case "da-duyet":
      return <span className="inline-flex px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-100 text-emerald-700">Đã duyệt</span>;
    case "cho-duyet":
      return <span className="inline-flex px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-amber-100 text-amber-700">Chờ duyệt</span>;
    case "da-huy":
      return <span className="inline-flex px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-rose-100 text-rose-700">Đã huỷ</span>;
    default:
      return <span className="inline-flex px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-600">{status}</span>;
  }
};

const topupStatusBadge = (status: string) => {
  switch (status) {
    case "da-thanh-cong":
      return <span className="inline-flex px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-100 text-emerald-700">Đã thanh toán</span>;
    case "chua-thanh-toan":
      return <span className="inline-flex px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-amber-100 text-amber-700">Chưa thanh toán</span>;
    case "het-han":
      return <span className="inline-flex px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-rose-100 text-rose-700">Hết hạn</span>;
    default:
      return <span className="inline-flex px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-600">{status}</span>;
  }
};

/* ─── Pagination component ─── */
const MiniPagination: React.FC<{
  pagination: Pagination;
  loading?: boolean;
  onPageChange: (page: number) => void;
}> = ({ pagination, loading, onPageChange }) => (
  <div className="flex flex-col sm:flex-row items-center justify-between gap-2 px-4 py-3 border-t border-slate-100">
    <span className="text-[11px] text-slate-500">
      {pagination.total === 0 ? "Không có dữ liệu" : (
        <>Hiển thị <strong>{((pagination.page - 1) * pagination.limit) + 1}</strong> – <strong>{Math.min(pagination.page * pagination.limit, pagination.total)}</strong> của <strong>{pagination.total}</strong></>
      )}
    </span>
    <div className="flex gap-1">
      <button className="btn btn-xs border" disabled={pagination.page <= 1 || loading} onClick={() => onPageChange(1)}>«</button>
      <button className="btn btn-xs border" disabled={pagination.page <= 1 || loading} onClick={() => onPageChange(pagination.page - 1)}>‹</button>
      {Array.from({ length: Math.min(5, pagination.totalPages || 1) }, (_, i) => {
        const t = pagination.totalPages || 1;
        let p: number;
        if (t <= 5) p = i + 1;
        else if (pagination.page <= 3) p = i + 1;
        else if (pagination.page >= t - 2) p = t - 4 + i;
        else p = pagination.page - 2 + i;
        return (
          <button key={p} className={`btn btn-xs ${pagination.page === p ? "bg-primary text-white" : "border"}`}
            disabled={loading} onClick={() => onPageChange(p)}>{p}</button>
        );
      })}
      <button className="btn btn-xs border" disabled={pagination.page >= (pagination.totalPages || 1) || loading} onClick={() => onPageChange(pagination.page + 1)}>›</button>
      <button className="btn btn-xs border" disabled={pagination.page >= (pagination.totalPages || 1) || loading} onClick={() => onPageChange(pagination.totalPages || 1)}>»</button>
    </div>
  </div>
);

/* ═══════════════════ MAIN ═══════════════════ */
const TopupAdminList: React.FC = () => {
  const [topups, setTopups] = useState<TopupItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 10, total: 0, totalPages: 0 });
  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch] = useState("");
  const [stats, setStats] = useState<Stats>({ totalTopups: 0, totalPending: 0, totalApproved: 0, totalRejected: 0, totalAmount: 0 });

  const loadTopups = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append("page", String(page));
      params.append("limit", "10");
      if (statusFilter) params.append("status", statusFilter);
      if (search.trim()) params.append("search", search.trim());
      const res = await fetch(`${API_URL}/api/topups?${params.toString()}`);
      const body = await res.json();
      if (body.success) {
        setTopups(body.data?.data || []);
        setPagination(body.data?.pagination || { page: 1, limit: 10, total: 0, totalPages: 0 });
      }
    } catch (e) {
      console.error("Load topups failed:", e);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, search]);

  const loadStats = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/api/topups/stats`);
      const body = await res.json();
      if (body.success && body.data?.data) {
        setStats(body.data.data);
      }
    } catch { /* silent */ }
  }, []);

  useEffect(() => { loadTopups(1); }, [loadTopups]);
  useEffect(() => { loadStats(); }, [loadStats]);

  const handleApprove = async (code: string, amount: number, userName: string) => {
    const r = await Swal.fire({
      icon: "question",
      title: "Duyệt hoá đơn?",
      html: `Duyệt hoá đơn <strong>${code}</strong> và cộng <strong>${fmt(amount)}đ</strong> vào tài khoản <strong>${userName}</strong>?`,
      showCancelButton: true,
      confirmButtonText: "Duyệt & cộng tiền",
      cancelButtonText: "Hủy",
      confirmButtonColor: "#10b981",
    });
    if (!r.isConfirmed) return;
    try {
      const res = await fetch(`${API_URL}/api/topups/${code}/approve`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body?.message || "Lỗi");
      await Swal.fire({ icon: "success", title: "Đã duyệt!", text: `Đã cộng ${fmt(amount)}đ cho ${userName}.`, confirmButtonColor: "#10b981" });
      loadTopups(pagination.page);
      loadStats();
    } catch (e: any) {
      await Swal.fire({ icon: "error", title: "Lỗi", text: e?.message || "Không thể duyệt.", confirmButtonColor: "#ef4444" });
    }
  };

  const handleReject = async (code: string) => {
    const r = await Swal.fire({
      icon: "warning",
      title: "Từ chối hoá đơn?",
      input: "text",
      inputLabel: "Lý do từ chối",
      inputPlaceholder: "Nhập lý do...",
      inputValidator: (v) => (!v ? "Vui lòng nhập lý do" : null),
      showCancelButton: true,
      confirmButtonText: "Từ chối",
      cancelButtonText: "Hủy",
      confirmButtonColor: "#ef4444",
    });
    if (!r.isConfirmed) return;
    try {
      const res = await fetch(`${API_URL}/api/topups/${code}/reject`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: r.value }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body?.message || "Lỗi");
      await Swal.fire({ icon: "success", title: "Đã từ chối", confirmButtonColor: "#10b981" });
      loadTopups(pagination.page);
      loadStats();
    } catch (e: any) {
      await Swal.fire({ icon: "error", title: "Lỗi", text: e?.message || "Không thể từ chối.", confirmButtonColor: "#ef4444" });
    }
  };

  return (
    <>
      <PageBreadcrumb
        title="Quản lý nạp tiền"
        name="Quản lý nạp tiền"
        breadCrumbItems={["Admin", "Apps", "Nạp tiền"]}
      />

      {/* Header + filter + stats */}
      <div className="card mb-4">
        <div className="p-4 md:p-5 flex flex-col gap-4 text-xs">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
              <h3 className="text-lg md:text-xl font-semibold mb-1">Danh sách giao dịch nạp tiền</h3>
              <p className="text-xs md:text-sm text-slate-500">Kiểm duyệt các yêu cầu nạp tiền và theo dõi trạng thái xử lý.</p>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-3 items-center">
              <select
                className="form-select text-xs w-44"
                value={statusFilter}
                onChange={(e) => { setStatusFilter(e.target.value); }}
              >
                <option value="">-- Trạng thái duyệt --</option>
                <option value="cho-duyet">Chờ duyệt</option>
                <option value="da-duyet">Đã duyệt</option>
                <option value="da-huy">Đã huỷ</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <span className="absolute inset-y-0 left-3 flex items-center text-slate-400 text-sm">
                  <i className="mgc_search_3_line" />
                </span>
                <input
                  className="form-input pl-9 pr-3 py-2 text-xs w-64"
                  placeholder="Tìm theo mã, tên hoặc email"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") loadTopups(1); }}
                />
              </div>
              <button className="btn btn-xs bg-primary text-white" onClick={() => loadTopups(1)}>Tìm</button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid sm:grid-cols-4 grid-cols-2 gap-3 text-xs">
            <div className="rounded-xl bg-amber-50 px-3 py-2.5 text-amber-700">
              <p className="uppercase tracking-wide text-[10px] font-semibold mb-1">Tổng giao dịch</p>
              <p className="text-lg font-semibold">{stats.totalTopups}</p>
            </div>
            <div className="rounded-xl bg-sky-50 px-3 py-2.5 text-sky-700">
              <p className="uppercase tracking-wide text-[10px] font-semibold mb-1">Chờ duyệt</p>
              <p className="text-lg font-semibold">{stats.totalPending}</p>
            </div>
            <div className="rounded-xl bg-emerald-50 px-3 py-2.5 text-emerald-700">
              <p className="uppercase tracking-wide text-[10px] font-semibold mb-1">Đã duyệt</p>
              <p className="text-lg font-semibold">{stats.totalApproved}</p>
            </div>
            <div className="rounded-xl bg-rose-50 px-3 py-2.5 text-rose-700">
              <p className="uppercase tracking-wide text-[10px] font-semibold mb-1">Tổng nạp (đã duyệt)</p>
              <p className="text-lg font-semibold">{fmt(stats.totalAmount)}đ</p>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card">
        <div className="relative overflow-x-auto">
          <table className="w-full divide-y divide-gray-200 dark:divide-gray-700 text-xs">
            <thead className="bg-slate-50 dark:bg-slate-700/60">
              <tr>
                <th className="px-3 py-2 text-left font-semibold text-slate-600">User</th>
                <th className="px-3 py-2 text-left font-semibold text-slate-600">Mã giao dịch</th>
                <th className="px-3 py-2 text-left font-semibold text-slate-600">Ngân hàng</th>
                <th className="px-3 py-2 text-right font-semibold text-slate-600">Số tiền</th>
                <th className="px-3 py-2 text-left font-semibold text-slate-600">TT nạp</th>
                <th className="px-3 py-2 text-left font-semibold text-slate-600">TT duyệt</th>
                <th className="px-3 py-2 text-left font-semibold text-slate-600">Ngày tạo</th>
                <th className="px-3 py-2 text-right font-semibold text-slate-600">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={8} className="px-3 py-6 text-center text-slate-400 text-sm">Đang tải...</td></tr>
              ) : topups.length === 0 ? (
                <tr><td colSpan={8} className="px-3 py-6 text-center text-slate-400 text-sm">Không có giao dịch nạp tiền nào.</td></tr>
              ) : (
                topups.map((item) => (
                  <tr key={item.code} className="border-t border-slate-100 dark:border-slate-700/60">
                    <td className="px-3 py-3">
                      <div className="flex flex-col">
                        <span className="font-semibold text-slate-900 dark:text-slate-100">{item.userName}</span>
                        <span className="text-[11px] text-slate-500">{item.userEmail}</span>
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <Link to={`/admin/topups/${item.code}`} className="text-primary font-medium font-mono">{item.code}</Link>
                    </td>
                    <td className="px-3 py-3 text-xs text-slate-600">{item.bank || "–"}</td>
                    <td className="px-3 py-3 text-right text-sm font-semibold text-primary">{fmt(item.amount)}đ</td>
                    <td className="px-3 py-3">{topupStatusBadge(item.topupStatus)}</td>
                    <td className="px-3 py-3">{statusBadge(item.status)}</td>
                    <td className="px-3 py-3 text-xs text-slate-500">{item.createdAt ? new Date(item.createdAt).toLocaleString("vi-VN") : "–"}</td>
                    <td className="px-3 py-3 text-right whitespace-nowrap">
                      {item.status === "cho-duyet" ? (
                        <>
                          <button
                            type="button"
                            className="btn btn-xs bg-emerald-50 text-emerald-600 text-[11px] mr-2"
                            onClick={() => handleApprove(item.code, item.amount, item.userName)}
                          >
                            ✓ Duyệt & cộng tiền
                          </button>
                          <button
                            type="button"
                            className="btn btn-xs bg-rose-50 text-rose-600 text-[11px]"
                            onClick={() => handleReject(item.code)}
                          >
                            ✕ Từ chối
                          </button>
                        </>
                      ) : (
                        <span className="text-[11px] text-slate-400">
                          {item.status === "da-duyet" ? "✓ Đã duyệt" : "✕ Đã huỷ"}
                          {item.reason && <span className="block text-[10px] text-rose-400 mt-0.5">Lý do: {item.reason}</span>}
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <MiniPagination pagination={pagination} loading={loading} onPageChange={(p) => loadTopups(p)} />
      </div>
    </>
  );
};

export default TopupAdminList;
