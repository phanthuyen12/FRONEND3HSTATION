import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { PageBreadcrumb } from "../../../components";
import {
  AdminTopupExpanded,
  expandAdminTopups,
} from "../../../client/data/adminTopups";

const TopupAdminList: React.FC = () => {
  const [records, setRecords] = useState<AdminTopupExpanded[]>(() =>
    expandAdminTopups()
  );
  const [statusFilter, setStatusFilter] = useState<string>("tat-ca");
  const [search, setSearch] = useState("");

  const totalTopups = useMemo(() => records.length, [records]);
  const totalPending = useMemo(
    () => records.filter((r) => r.status === "cho-duyet").length,
    [records]
  );
  const totalApproved = useMemo(
    () => records.filter((r) => r.status === "da-duyet").length,
    [records]
  );

  const filtered = useMemo(() => {
    let items = records;

    if (statusFilter !== "tat-ca") {
      items = items.filter((r) => r.status === statusFilter);
    }

    if (search.trim()) {
      const keyword = search.toLowerCase();
      items = items.filter(
        (r) =>
          r.code.toLowerCase().includes(keyword) ||
          r.user?.name.toLowerCase().includes(keyword) ||
          r.user?.email.toLowerCase().includes(keyword)
      );
    }

    return items;
  }, [records, statusFilter, search]);

  const handleApprove = (code: string) => {
    setRecords((prev) =>
      prev.map((r) =>
        r.code === code
          ? {
              ...r,
              status: "da-duyet",
              updatedAt: new Date().toLocaleString("vi-VN"),
            }
          : r
      )
    );
  };

  const handleReject = (code: string) => {
    setRecords((prev) =>
      prev.map((r) =>
        r.code === code
          ? {
              ...r,
              status: "da-huy",
              updatedAt: new Date().toLocaleString("vi-VN"),
            }
          : r
      )
    );
  };

  return (
    <>
      <PageBreadcrumb
        title="Quản lý nạp tiền"
        name="Quản lý nạp tiền"
        breadCrumbItems={["Konrix", "Apps", "Nạp tiền"]}
      />

      {/* Header + filter + stats */}
      <div className="card mb-4">
        <div className="p-4 md:p-5 flex flex-col gap-4 text-xs">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
              <h3 className="text-lg md:text-xl font-semibold mb-1">
                Danh sách giao dịch nạp tiền
              </h3>
              <p className="text-xs md:text-sm text-slate-500">
                Kiểm duyệt các yêu cầu nạp tiền và theo dõi trạng thái xử lý.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-3 items-center">
              <select
                className="form-select text-xs w-44"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="tat-ca">-- Trạng thái duyệt --</option>
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
                  placeholder="Tìm theo mã giao dịch, tên hoặc email"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="grid sm:grid-cols-3 grid-cols-1 gap-3 text-xs">
            <div className="rounded-xl bg-amber-50 px-3 py-2.5 text-amber-700">
              <p className="uppercase tracking-wide text-[10px] font-semibold mb-1">
                Tổng giao dịch
              </p>
              <p className="text-lg font-semibold">{totalTopups}</p>
            </div>
            <div className="rounded-xl bg-sky-50 px-3 py-2.5 text-sky-700">
              <p className="uppercase tracking-wide text-[10px] font-semibold mb-1">
                Chờ duyệt
              </p>
              <p className="text-lg font-semibold">{totalPending}</p>
            </div>
            <div className="rounded-xl bg-emerald-50 px-3 py-2.5 text-emerald-700">
              <p className="uppercase tracking-wide text-[10px] font-semibold mb-1">
                Đã duyệt
              </p>
              <p className="text-lg font-semibold">{totalApproved}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="relative overflow-x-auto">
          <table className="w-full divide-y divide-gray-200 dark:divide-gray-700 text-xs">
            <thead className="bg-slate-50 dark:bg-slate-700/60">
              <tr>
                <th className="px-3 py-2 text-left font-semibold text-slate-600">
                  User
                </th>
                <th className="px-3 py-2 text-left font-semibold text-slate-600">
                  Mã giao dịch
                </th>
                <th className="px-3 py-2 text-left font-semibold text-slate-600">
                  Ngân hàng
                </th>
                <th className="px-3 py-2 text-right font-semibold text-slate-600">
                  Số tiền
                </th>
                <th className="px-3 py-2 text-left font-semibold text-slate-600">
                  Trạng thái nạp
                </th>
                <th className="px-3 py-2 text-left font-semibold text-slate-600">
                  Trạng thái duyệt
                </th>
                <th className="px-3 py-2 text-left font-semibold text-slate-600">
                  Cập nhật
                </th>
                <th className="px-3 py-2 text-right font-semibold text-slate-600">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => (
                <tr
                  key={item.code}
                  className="border-t border-slate-100 dark:border-slate-700/60"
                >
                  <td className="px-3 py-3">
                    <div className="flex flex-col">
                      <span className="font-semibold text-slate-900 dark:text-slate-100">
                        {item.user?.name || item.userId}
                      </span>
                      <span className="text-[11px] text-slate-500">
                        {item.user?.email}
                      </span>
                    </div>
                  </td>
                  <td className="px-3 py-3">
                    <Link
                      to={`/admin/topups/${item.code}`}
                      className="text-primary font-medium"
                    >
                      {item.code}
                    </Link>
                  </td>
                  <td className="px-3 py-3 text-xs text-slate-600">
                    {item.bank}
                  </td>
                  <td className="px-3 py-3 text-right text-xs text-slate-700">
                    {item.amount.toLocaleString("vi-VN")}đ
                  </td>
                  <td className="px-3 py-3">
                    <span
                      className={`inline-flex px-2.5 py-0.5 rounded-full text-[11px] font-medium ${
                        item.topupStatus === "da-thanh-cong"
                          ? "bg-emerald-100 text-emerald-700"
                          : item.topupStatus === "chua-thanh-toan"
                          ? "bg-amber-100 text-amber-700"
                          : "bg-rose-100 text-rose-700"
                      }`}
                    >
                      {item.topupStatus === "da-thanh-cong"
                        ? "Đã thanh toán"
                        : item.topupStatus === "chua-thanh-toan"
                        ? "Chưa thanh toán"
                        : "Hết hạn"}
                    </span>
                  </td>
                  <td className="px-3 py-3">
                    <span
                      className={`inline-flex px-2.5 py-0.5 rounded-full text-[11px] font-medium ${
                        item.status === "da-duyet"
                          ? "bg-emerald-100 text-emerald-700"
                          : item.status === "cho-duyet"
                          ? "bg-amber-100 text-amber-700"
                          : "bg-rose-100 text-rose-700"
                      }`}
                    >
                      {item.status === "da-duyet"
                        ? "Đã duyệt"
                        : item.status === "cho-duyet"
                        ? "Chờ duyệt"
                        : "Đã huỷ"}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-xs text-slate-600">
                    {item.updatedAt}
                  </td>
                  <td className="px-3 py-3 text-right whitespace-nowrap">
                    {item.status === "cho-duyet" && (
                      <>
                        <button
                          type="button"
                          className="btn btn-xs bg-emerald-50 text-emerald-600 text-[11px] mr-2"
                          onClick={() => handleApprove(item.code)}
                        >
                          Duyệt & cộng tiền
                        </button>
                        <button
                          type="button"
                          className="btn btn-xs bg-amber-50 text-amber-700 text-[11px]"
                          onClick={() => handleReject(item.code)}
                        >
                          Từ chối
                        </button>
                      </>
                    )}
                    {item.status !== "cho-duyet" && (
                      <span className="text-[11px] text-slate-400">
                        Đã xử lý
                      </span>
                    )}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={8}
                    className="px-3 py-6 text-center text-slate-500 text-sm"
                  >
                    Không có giao dịch nạp tiền nào phù hợp bộ lọc.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default TopupAdminList;


