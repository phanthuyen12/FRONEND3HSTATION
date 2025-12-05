import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PageBreadcrumb } from "../../../components";
import { workflowsService } from "../../../config";
import { Workflow } from "../../../services/workflowsService";
import Swal from 'sweetalert2';
import 'sweetalert2/src/sweetalert2.scss';

type EditableWorkflow = Workflow;

const WorkflowsAdminList: React.FC = () => {
  const [workflows, setWorkflows] = useState<EditableWorkflow[]>([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
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
  const navigate = useNavigate();

  const loadWorkflows = async () => {
    try {
      setLoading(true);
      const response = await workflowsService.fetchAdminWorkflows({
        page: pagination.page,
        limit: pagination.limit,
        search: search.trim() || undefined,
        category: categoryFilter || undefined,
      });
      setWorkflows(response.data || []);
      setPagination(response.pagination || pagination);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Không thể tải danh sách workflows", error);
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const data = await workflowsService.fetchCategories();
      setCategories(data.map((cat) => ({ id: cat.id, name: cat.name })));
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Không thể tải danh sách danh mục", error);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    loadWorkflows();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.page, search, categoryFilter]);

  const totalWorkflows = useMemo(() => pagination.total, [pagination.total]);

  const filtered = useMemo(() => {
    // Filter đã được xử lý ở server, nhưng có thể filter thêm ở client nếu cần
    return workflows;
  }, [workflows]);

  const handleDelete = (id: string) => {
    const performDelete = async () => {
      const result = await Swal.fire({
        icon: 'warning',
        title: 'Xác nhận xóa',
        text: 'Bạn có chắc chắn muốn xoá workflow này?',
        showCancelButton: true,
        confirmButtonText: 'Xóa',
        cancelButtonText: 'Hủy',
        confirmButtonColor: '#ef4444',
        cancelButtonColor: '#6b7280',
      });

      if (!result.isConfirmed) return;

      try {
        await workflowsService.deleteWorkflow(id);
        // Fetch lại dữ liệu từ server
        await loadWorkflows();
        await Swal.fire({
          icon: 'success',
          title: 'Thành công',
          text: 'Đã xóa workflow thành công.',
          confirmButtonText: 'Đã hiểu',
          confirmButtonColor: '#10b981',
        });
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error("Xoá workflow thất bại", error);
        await Swal.fire({
          icon: 'error',
          title: 'Lỗi',
          text: 'Không thể xoá workflow. Vui lòng thử lại.',
          confirmButtonText: 'Đã hiểu',
          confirmButtonColor: '#ef4444',
        });
      }
    };

    void performDelete();
  };

  const handlePageChange = (newPage: number) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  return (
    <>
      <PageBreadcrumb
        title="Quản lý Workflows"
        name="Quản lý Workflows"
        breadCrumbItems={["Konrix", "Apps", "Workflows"]}
      />

      {/* Header + filter + stats */}
      <div className="card mb-4">
        <div className="p-4 md:p-5 flex flex-col gap-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
              <h3 className="text-lg md:text-xl font-semibold mb-1">
                Danh sách Workflows
              </h3>
              <p className="text-xs md:text-sm text-slate-500">
                Tối ưu funnel, automation và quy trình bằng các workflows dựng
                sẵn.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <span className="absolute inset-y-0 left-3 flex items-center text-slate-400 text-sm">
                  <i className="mgc_search_3_line" />
                </span>
                <input
                  className="form-input pl-9 pr-3 py-2 text-xs w-64"
                  placeholder="Tìm theo tên hoặc danh mục"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      setPagination((prev) => ({ ...prev, page: 1 }));
                    }
                  }}
                />
              </div>
              <select
                className="form-select text-xs"
                value={categoryFilter}
                onChange={(e) => {
                  setCategoryFilter(e.target.value);
                  setPagination((prev) => ({ ...prev, page: 1 }));
                }}
              >
                <option value="">Tất cả danh mục</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              <button
                type="button"
                className="btn bg-emerald-500 text-white text-sm"
                onClick={() => navigate("/admin/workflows/new")}
              >
                <i className="mgc_add_circle_line mr-1" /> Tạo workflow mới
              </button>
            </div>
          </div>

          <div className="grid sm:grid-cols-3 grid-cols-1 gap-3 text-xs md:text-sm">
            <div className="rounded-xl bg-amber-50 px-3 py-2.5 text-amber-700">
              <p className="uppercase tracking-wide text-[10px] font-semibold mb-1">
                Tổng workflows
              </p>
              <p className="text-xl font-semibold">
                {loading ? "..." : totalWorkflows}
              </p>
            </div>
            <div className="rounded-xl bg-slate-50 px-3 py-2.5 text-slate-700">
              <p className="uppercase tracking-wide text-[10px] font-semibold mb-1">
                Đang hiển thị
              </p>
              <p className="text-xl font-semibold">
                {loading ? "..." : filtered.length}
              </p>
            </div>
            <div className="rounded-xl bg-sky-50 px-3 py-2.5 text-sky-700">
              <p className="uppercase tracking-wide text-[10px] font-semibold mb-1">
                Trang hiện tại
              </p>
              <p className="text-xl font-semibold">
                {loading ? "..." : `${pagination.page}/${pagination.totalPages || 1}`}
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
                  Workflow
                </th>
                <th className="px-3 py-2 text-left font-semibold text-slate-600">
                  Danh mục
                </th>
                <th className="px-3 py-2 text-left font-semibold text-slate-600">
                  Tags
                </th>
                <th className="px-3 py-2 text-right font-semibold text-slate-600">
                  Giá
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
                    colSpan={5}
                    className="px-3 py-6 text-center text-slate-500 text-sm"
                  >
                    Đang tải...
                  </td>
                </tr>
              ) : (
                <>
                  {filtered.map((wf) => (
                    <tr
                      key={wf.id}
                      className="border-t border-slate-100 dark:border-slate-700/60"
                    >
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-3">
                          {wf.image && (
                            <img
                              src={wf.image}
                              alt={wf.name}
                              className="w-14 h-10 rounded object-cover"
                            />
                          )}
                          <div>
                            <Link
                              to={`/admin/workflows/${wf.id}`}
                              className="font-semibold text-slate-900 dark:text-slate-100 hover:text-primary text-sm"
                            >
                              {wf.name}
                            </Link>
                            {wf.description && (
                              <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                                {wf.description}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-3 text-xs text-slate-600">
                        {wf.category || wf.categoryId || "-"}
                      </td>
                      <td className="px-3 py-3 text-xs text-slate-600">
                        {wf.tags && (Array.isArray(wf.tags) ? wf.tags.length > 0 : true) ? (
                          <div className="flex flex-wrap gap-1">
                            {(Array.isArray(wf.tags) ? wf.tags : wf.tags ? [wf.tags] : []).map((tag, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px]"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        ) : (
                          "-"
                        )}
                      </td>
                      <td className="px-3 py-3 text-right text-sm font-semibold text-primary">
                        {wf.price || "-"}
                      </td>
                      <td className="px-3 py-3 text-right whitespace-nowrap">
                        <button
                          type="button"
                          className="btn btn-xs bg-slate-100 text-xs mr-2"
                          onClick={() => navigate(`/admin/workflows/${wf.id}`)}
                        >
                          <i className="mgc_edit_line mr-1" />
                          Sửa
                        </button>
                        <button
                          type="button"
                          className="btn btn-xs bg-rose-50 text-rose-600 text-xs"
                          onClick={() => handleDelete(String(wf.id))}
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
                        colSpan={5}
                        className="px-3 py-6 text-center text-slate-500 text-sm"
                      >
                        Không tìm thấy workflow nào phù hợp.
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
              Hiển thị {((pagination.page - 1) * pagination.limit) + 1} - {Math.min(pagination.page * pagination.limit, pagination.total)} của {pagination.total} workflows
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
                let pageNum: number;
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

export default WorkflowsAdminList;
