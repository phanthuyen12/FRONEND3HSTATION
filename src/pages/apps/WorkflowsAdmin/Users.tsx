import React, { useMemo, useState } from "react";
import { PageBreadcrumb } from "../../../components";
import { expandWorkflowRegistrations } from "../../../client/data/workflowRegistrations";
import { WorkflowRegistrationExpanded } from "../../../client/data/workflowRegistrations";
import { workflows } from "../../../client/data/workflows";

const WorkflowsUsersAdmin: React.FC = () => {
  const [registrations, setRegistrations] = useState<
    WorkflowRegistrationExpanded[]
  >(() => expandWorkflowRegistrations());
  const [workflowFilter, setWorkflowFilter] = useState<string>("tat-ca");
  const [statusFilter, setStatusFilter] = useState<string>("tat-ca");
  const [search, setSearch] = useState("");

  const workflowOptions = useMemo(
    () => [{ id: "tat-ca", name: "Tất cả workflows" }, ...workflows],
    []
  );

  const filtered = useMemo(() => {
    let items = registrations;

    if (workflowFilter !== "tat-ca") {
      items = items.filter((r) => r.workflowId === workflowFilter);
    }

    if (statusFilter !== "tat-ca") {
      items = items.filter((r) => r.status === statusFilter);
    }

    if (search.trim()) {
      const keyword = search.toLowerCase();
      items = items.filter(
        (r) =>
          r.user?.name.toLowerCase().includes(keyword) ||
          r.user?.email.toLowerCase().includes(keyword) ||
          r.id.toLowerCase().includes(keyword)
      );
    }

    return items;
  }, [registrations, workflowFilter, statusFilter, search]);

  const totalRegistrations = registrations.length;
  const totalWaiting = registrations.filter((r) => r.status === "cho-duyet")
    .length;
  const totalApproved = registrations.filter((r) => r.status === "da-duyet")
    .length;

  const handleApprove = (id: string) => {
    setRegistrations((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              status: "da-duyet",
            }
          : r
      )
    );
  };

  const handleReject = (id: string) => {
    setRegistrations((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              status: "da-huy",
            }
          : r
      )
    );
  };

  const handleRemove = (id: string) => {
    if (!window.confirm("Xoá user khỏi workflow này?")) return;
    setRegistrations((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <>
      <PageBreadcrumb
        title="User đăng ký Workflows"
        name="User đăng ký Workflows"
        breadCrumbItems={["Konrix", "Apps", "Workflows", "User đăng ký"]}
      />

      {/* Header + filter + stats */}
      <div className="card mb-4">
        <div className="p-4 md:p-5 flex flex-col gap-4 text-xs">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
              <h3 className="text-lg md:text-xl font-semibold mb-1">
                User đăng ký Workflows
              </h3>
              <p className="text-xs md:text-sm text-slate-500">
                Quản lý, duyệt hoặc huỷ các yêu cầu tham gia workflows của
                người dùng.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-3 items-center">
              <select
                className="form-select text-xs w-56"
                value={workflowFilter}
                onChange={(e) => setWorkflowFilter(e.target.value)}
              >
                {workflowOptions.map((wf) => (
                  <option key={wf.id} value={wf.id}>
                    {wf.name}
                  </option>
                ))}
              </select>

              <select
                className="form-select text-xs w-44"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="tat-ca">-- Trạng thái --</option>
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
                  placeholder="Tìm theo tên, email hoặc mã đăng ký"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="grid sm:grid-cols-3 grid-cols-1 gap-3 text-xs">
            <div className="rounded-xl bg-amber-50 px-3 py-2.5 text-amber-700">
              <p className="uppercase tracking-wide text-[10px] font-semibold mb-1">
                Tổng lượt đăng ký
              </p>
              <p className="text-lg font-semibold">{totalRegistrations}</p>
            </div>
            <div className="rounded-xl bg-sky-50 px-3 py-2.5 text-sky-700">
              <p className="uppercase tracking-wide text-[10px] font-semibold mb-1">
                Đang chờ duyệt
              </p>
              <p className="text-lg font-semibold">{totalWaiting}</p>
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
                  Workflow
                </th>
                <th className="px-3 py-2 text-left font-semibold text-slate-600">
                  Trạng thái
                </th>
                <th className="px-3 py-2 text-left font-semibold text-slate-600">
                  Thời gian đăng ký
                </th>
                <th className="px-3 py-2 text-right font-semibold text-slate-600">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((reg) => (
                <tr
                  key={reg.id}
                  className="border-t border-slate-100 dark:border-slate-700/60"
                >
                  <td className="px-3 py-3">
                    <div className="flex flex-col">
                      <span className="font-semibold text-slate-900 dark:text-slate-100">
                        {reg.user?.name || reg.userId}
                      </span>
                      <span className="text-[11px] text-slate-500">
                        {reg.user?.email}
                      </span>
                    </div>
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
                        {reg.workflow?.name || reg.workflowId}
                      </span>
                      <span className="text-[11px] text-slate-500">
                        Danh mục: {reg.workflow?.category}
                      </span>
                    </div>
                  </td>
                  <td className="px-3 py-3">
                    <span
                      className={`inline-flex px-2.5 py-0.5 rounded-full text-[11px] font-medium ${
                        reg.status === "da-duyet"
                          ? "bg-emerald-100 text-emerald-700"
                          : reg.status === "cho-duyet"
                          ? "bg-amber-100 text-amber-700"
                          : "bg-rose-100 text-rose-700"
                      }`}
                    >
                      {reg.status === "da-duyet"
                        ? "Đã duyệt"
                        : reg.status === "cho-duyet"
                        ? "Chờ duyệt"
                        : "Đã huỷ"}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-xs text-slate-600">
                    {reg.createdAt}
                  </td>
                  <td className="px-3 py-3 text-right whitespace-nowrap">
                    {reg.status === "cho-duyet" && (
                      <button
                        type="button"
                        className="btn btn-xs bg-emerald-50 text-emerald-600 text-[11px] mr-2"
                        onClick={() => handleApprove(reg.id)}
                      >
                        Duyệt
                      </button>
                    )}
                    {reg.status !== "da-huy" && (
                      <button
                        type="button"
                        className="btn btn-xs bg-amber-50 text-amber-700 text-[11px] mr-2"
                        onClick={() => handleReject(reg.id)}
                      >
                        Huỷ đăng ký
                      </button>
                    )}
                    <button
                      type="button"
                      className="btn btn-xs bg-rose-50 text-rose-600 text-[11px]"
                      onClick={() => handleRemove(reg.id)}
                    >
                      Xoá khỏi workflow
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-3 py-6 text-center text-slate-500 text-sm"
                  >
                    Không có user nào đăng ký workflows theo bộ lọc hiện tại.
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

export default WorkflowsUsersAdmin;


