import React, { useCallback, useEffect, useMemo, useState } from "react";
import { PageBreadcrumb } from "../../../components";
import adminSupportService, {
  SupportRequestItem,
  SupportRequestPagination,
  SupportRequestStats,
} from "../../../services/adminSupportService";

const statusLabelMap: Record<SupportRequestItem["status"], string> = {
  new: "Mới",
  reviewing: "Đang xử lý",
  resolved: "Đã xử lý",
};

const statusBadgeMap: Record<SupportRequestItem["status"], string> = {
  new: "bg-amber-100 text-amber-700",
  reviewing: "bg-sky-100 text-sky-700",
  resolved: "bg-emerald-100 text-emerald-700",
};

const defaultPagination: SupportRequestPagination = {
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 0,
};

const defaultStats: SupportRequestStats = {
  total: 0,
  totalNew: 0,
  totalReviewing: 0,
  totalResolved: 0,
};

const formatDateTime = (value: string) => {
  if (!value) return "—";

  return new Date(value).toLocaleString("vi-VN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const truncate = (value: string, length = 80) => {
  if (!value) return "";
  return value.length > length ? `${value.slice(0, length)}...` : value;
};

const SupportAdminList: React.FC = () => {
  const [items, setItems] = useState<SupportRequestItem[]>([]);
  const [stats, setStats] = useState<SupportRequestStats>(defaultStats);
  const [pagination, setPagination] = useState<SupportRequestPagination>(defaultPagination);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sourceFilter, setSourceFilter] = useState("");
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const loadStats = useCallback(async () => {
    try {
      const data = await adminSupportService.getStats();
      setStats(data);
    } catch (err: any) {
      console.error("Load support stats failed:", err);
    }
  }, []);

  const loadItems = useCallback(async (page = 1) => {
    setLoading(true);
    setError(null);

    try {
      const response = await adminSupportService.getRequests({
        page,
        limit: 10,
        status: statusFilter || undefined,
        sourcePage: sourceFilter || undefined,
        search: search.trim() || undefined,
      });

      setItems(response.data);
      setPagination(response.pagination || defaultPagination);

      setSelectedId((current) => {
        if (!response.data.length) return null;
        if (current && response.data.some((item) => item.id === current)) {
          return current;
        }
        return response.data[0].id;
      });
    } catch (err: any) {
      setError(err?.message || "Không thể tải danh sách yêu cầu hỗ trợ");
      setItems([]);
      setPagination(defaultPagination);
      setSelectedId(null);
    } finally {
      setLoading(false);
    }
  }, [search, sourceFilter, statusFilter]);

  useEffect(() => {
    loadItems(1);
  }, [loadItems]);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  const selectedItem = useMemo(
    () => items.find((item) => item.id === selectedId) || null,
    [items, selectedId]
  );

  const handleApplyFilters = () => {
    setSearch(searchInput.trim());
  };

  const handleResetFilters = () => {
    setSearchInput("");
    setSearch("");
    setStatusFilter("");
    setSourceFilter("");
  };

  const handleUpdateStatus = async (status: SupportRequestItem["status"]) => {
    if (!selectedItem) return;

    try {
      setSaving(true);
      const updated = await adminSupportService.updateStatus(selectedItem.id, status);

      setItems((current) =>
        current.map((item) => (item.id === updated.id ? updated : item))
      );
      setSelectedId(updated.id);
      await loadStats();
    } catch (err: any) {
      setError(err?.message || "Không thể cập nhật trạng thái");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <PageBreadcrumb
        title="Yêu cầu hỗ trợ"
        name="Support Requests"
        breadCrumbItems={["Admin", "Apps", "Hỗ trợ"]}
      />

      {error && (
        <div className="alert alert-danger mb-4">
          <div className="flex items-center gap-2">
            <i className="mgc_warning_line text-lg" />
            <span>{error}</span>
          </div>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4 mb-4">
        <div className="card">
          <div className="card-body">
            <div className="text-slate-500 text-sm">Tổng yêu cầu</div>
            <div className="mt-2 text-3xl font-semibold text-slate-800">{stats.total}</div>
          </div>
        </div>
        <div className="card">
          <div className="card-body">
            <div className="text-slate-500 text-sm">Mới</div>
            <div className="mt-2 text-3xl font-semibold text-amber-600">{stats.totalNew}</div>
          </div>
        </div>
        <div className="card">
          <div className="card-body">
            <div className="text-slate-500 text-sm">Đang xử lý</div>
            <div className="mt-2 text-3xl font-semibold text-sky-600">{stats.totalReviewing}</div>
          </div>
        </div>
        <div className="card">
          <div className="card-body">
            <div className="text-slate-500 text-sm">Đã xử lý</div>
            <div className="mt-2 text-3xl font-semibold text-emerald-600">{stats.totalResolved}</div>
          </div>
        </div>
      </div>

      <div className="card mb-4">
        <div className="card-body">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h4 className="mb-1">Quản lý submissions từ form hỗ trợ</h4>
              <p className="text-slate-500 mb-0">
                Theo dõi người gửi, nội dung liên hệ và cập nhật trạng thái xử lý.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button className="btn btn-light" onClick={() => loadItems(pagination.page || 1)} disabled={loading}>
                Tải lại
              </button>
            </div>
          </div>

          <div className="mt-4 grid gap-3 xl:grid-cols-[1.3fr_0.7fr_0.7fr_auto_auto]">
            <div className="relative">
              <span className="absolute inset-y-0 left-3 flex items-center text-slate-400">
                <i className="mgc_search_3_line" />
              </span>
              <input
                type="text"
                className="form-input pl-10"
                placeholder="Tìm theo tên, email, chủ đề, nội dung..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleApplyFilters();
                  }
                }}
              />
            </div>

            <select
              className="form-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">Tất cả trạng thái</option>
              <option value="new">Mới</option>
              <option value="reviewing">Đang xử lý</option>
              <option value="resolved">Đã xử lý</option>
            </select>

            <input
              type="text"
              className="form-input"
              placeholder="Lọc theo sourcePage"
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
            />

            <button className="btn btn-primary" onClick={handleApplyFilters}>
              Áp dụng
            </button>

            <button className="btn btn-light" onClick={handleResetFilters}>
              Xóa lọc
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.45fr_0.95fr]">
        <div className="card">
          <div className="card-body p-0">
            <div className="overflow-x-auto">
              <table className="table mb-0 min-w-full">
                <thead>
                  <tr>
                    <th>Người gửi</th>
                    <th>Chủ đề</th>
                    <th>Nguồn</th>
                    <th>Trạng thái</th>
                    <th>Thời gian</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="text-center py-5 text-slate-500">
                        Đang tải dữ liệu...
                      </td>
                    </tr>
                  ) : items.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center py-5 text-slate-500">
                        Chưa có yêu cầu hỗ trợ nào.
                      </td>
                    </tr>
                  ) : (
                    items.map((item) => (
                      <tr
                        key={item.id}
                        className={`cursor-pointer ${selectedId === item.id ? "bg-slate-50" : ""}`}
                        onClick={() => setSelectedId(item.id)}
                      >
                        <td>
                          <div className="font-medium text-slate-800">{item.name}</div>
                          <div className="text-xs text-slate-500">{item.email}</div>
                        </td>
                        <td>
                          <div className="font-medium text-slate-700">{item.topic}</div>
                          <div className="text-xs text-slate-500">{truncate(item.message, 60)}</div>
                        </td>
                        <td>
                          <span className="font-mono text-xs text-slate-600">{item.source_page}</span>
                        </td>
                        <td>
                          <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${statusBadgeMap[item.status]}`}>
                            {statusLabelMap[item.status]}
                          </span>
                        </td>
                        <td className="text-sm text-slate-600">{formatDateTime(item.created_at)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="border-t px-4 py-3 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="text-sm text-slate-500">
                {pagination.total > 0
                  ? `Hiển thị ${(pagination.page - 1) * pagination.limit + 1} - ${Math.min(
                      pagination.page * pagination.limit,
                      pagination.total
                    )} / ${pagination.total}`
                  : "Không có dữ liệu"}
              </div>
              <div className="flex gap-2">
                <button
                  className="btn btn-sm btn-light"
                  disabled={loading || pagination.page <= 1}
                  onClick={() => loadItems(1)}
                >
                  «
                </button>
                <button
                  className="btn btn-sm btn-light"
                  disabled={loading || pagination.page <= 1}
                  onClick={() => loadItems(pagination.page - 1)}
                >
                  ‹
                </button>
                <button className="btn btn-sm btn-primary" disabled>
                  {pagination.page || 1}
                </button>
                <button
                  className="btn btn-sm btn-light"
                  disabled={loading || pagination.page >= pagination.totalPages}
                  onClick={() => loadItems(pagination.page + 1)}
                >
                  ›
                </button>
                <button
                  className="btn btn-sm btn-light"
                  disabled={loading || pagination.page >= pagination.totalPages}
                  onClick={() => loadItems(pagination.totalPages)}
                >
                  »
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            {!selectedItem ? (
              <div className="py-10 text-center text-slate-500">
                Chọn một yêu cầu để xem chi tiết.
              </div>
            ) : (
              <>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-xs uppercase tracking-wide text-slate-400">Chi tiết yêu cầu</div>
                    <h4 className="mt-1 mb-1">{selectedItem.topic}</h4>
                    <div className="text-sm text-slate-500">
                      {selectedItem.name} · {selectedItem.email}
                      {selectedItem.phone ? ` · ${selectedItem.phone}` : ""}
                    </div>
                  </div>
                  <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${statusBadgeMap[selectedItem.status]}`}>
                    {statusLabelMap[selectedItem.status]}
                  </span>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-lg border border-slate-200 p-3">
                    <div className="text-xs text-slate-400 mb-1">Nguồn gửi</div>
                    <div className="font-mono text-sm text-slate-700">{selectedItem.source_page}</div>
                  </div>
                  <div className="rounded-lg border border-slate-200 p-3">
                    <div className="text-xs text-slate-400 mb-1">Thời gian gửi</div>
                    <div className="text-sm text-slate-700">{formatDateTime(selectedItem.created_at)}</div>
                  </div>
                  <div className="rounded-lg border border-slate-200 p-3">
                    <div className="text-xs text-slate-400 mb-1">Số điện thoại</div>
                    <div className="text-sm text-slate-700">{selectedItem.phone || "—"}</div>
                  </div>
                  <div className="rounded-lg border border-slate-200 p-3">
                    <div className="text-xs text-slate-400 mb-1">Ref chiến dịch</div>
                    <div className="font-mono text-sm text-slate-700">{selectedItem.ref_code || "—"}</div>
                  </div>
                </div>

                {selectedItem.redirect_url && (
                  <div className="mt-3 rounded-lg border border-slate-200 p-3">
                    <div className="text-xs text-slate-400 mb-1">Link đích</div>
                    <a
                      href={selectedItem.redirect_url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm break-all text-primary"
                    >
                      {selectedItem.redirect_url}
                    </a>
                  </div>
                )}

                <div className="mt-4">
                  <div className="text-xs text-slate-400 mb-2">Nội dung</div>
                  <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 whitespace-pre-wrap text-sm leading-6 text-slate-700">
                    {selectedItem.message}
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <a className="btn btn-light" href={`mailto:${selectedItem.email}?subject=${encodeURIComponent(`[Ho tro] ${selectedItem.topic}`)}`}>
                    Gửi email
                  </a>
                  {selectedItem.phone && (
                    <a className="btn btn-light" href={`tel:${selectedItem.phone}`}>
                      Gọi nhanh
                    </a>
                  )}
                  <button
                    className="btn btn-warning"
                    disabled={saving || selectedItem.status === "reviewing"}
                    onClick={() => handleUpdateStatus("reviewing")}
                  >
                    Đánh dấu đang xử lý
                  </button>
                  <button
                    className="btn btn-success"
                    disabled={saving || selectedItem.status === "resolved"}
                    onClick={() => handleUpdateStatus("resolved")}
                  >
                    Đánh dấu đã xử lý
                  </button>
                  <button
                    className="btn btn-outline-secondary"
                    disabled={saving || selectedItem.status === "new"}
                    onClick={() => handleUpdateStatus("new")}
                  >
                    Chuyển về mới
                  </button>
                </div>

                <div className="mt-4 text-xs text-slate-400">
                  Cập nhật gần nhất: {formatDateTime(selectedItem.updated_at)}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default SupportAdminList;
