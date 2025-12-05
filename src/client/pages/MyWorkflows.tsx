import React, { useMemo } from "react";
import { PageBreadcrumb } from "../../components";
import { expandWorkflowRegistrations } from "../data/workflowRegistrations";
import { mockUser } from "../data/user";

const MyWorkflows: React.FC = () => {
  const allRegs = useMemo(() => expandWorkflowRegistrations(), []);
  const myRegs = useMemo(
    () => allRegs.filter((r) => r.userId === mockUser.id),
    [allRegs]
  );

  return (
    <>
      <PageBreadcrumb
        name="Workflows của tôi"
        title="Workflows của tôi"
        breadCrumbItems={["Client", "Tool", "Workflows của tôi"]}
      />

      <div className="card mb-5">
        <div className="p-4 md:p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <h2 className="text-lg md:text-xl font-semibold mb-1">
              Các workflows bạn đã đăng ký
            </h2>
            <p className="text-xs md:text-sm text-slate-500 max-w-2xl">
              Theo dõi các workflows đã mua, trạng thái duyệt và nhanh chóng mở
              lại hướng dẫn khi cần.
            </p>
          </div>
          <div className="text-xs text-slate-500">
            Tổng workflows:{" "}
            <span className="font-semibold text-slate-900 dark:text-slate-100">
              {myRegs.length}
            </span>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto text-xs">
            <thead className="bg-slate-50 dark:bg-slate-700/60">
              <tr>
                <th className="px-3 py-2 text-left font-semibold text-slate-600">
                  Workflow
                </th>
                <th className="px-3 py-2 text-left font-semibold text-slate-600">
                  Danh mục
                </th>
                <th className="px-3 py-2 text-left font-semibold text-slate-600">
                  Trạng thái
                </th>
                <th className="px-3 py-2 text-left font-semibold text-slate-600">
                  Thời gian đăng ký
                </th>
              </tr>
            </thead>
            <tbody>
              {myRegs.map((reg) => (
                <tr
                  key={reg.id}
                  className="border-t border-slate-100 dark:border-slate-700/60"
                >
                  <td className="px-3 py-3">
                    <div className="flex flex-col">
                      <span className="font-semibold text-slate-900 dark:text-slate-100">
                        {reg.workflow?.name || reg.workflowId}
                      </span>
                    </div>
                  </td>
                  <td className="px-3 py-3 text-xs text-slate-600">
                    {reg.workflow?.category}
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
                </tr>
              ))}
              {myRegs.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="px-3 py-6 text-center text-slate-500 text-sm"
                  >
                    Bạn chưa đăng ký workflow nào.
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

export default MyWorkflows;















