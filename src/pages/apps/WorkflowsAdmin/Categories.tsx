import React, { useEffect, useMemo, useState } from "react";
import { PageBreadcrumb } from "../../../components";
import { workflowsService } from "../../../config";
import { WorkflowCategory } from "../../../services/workflowsService";
import Swal from 'sweetalert2';
import 'sweetalert2/src/sweetalert2.scss';

const WorkflowCategoriesAdmin: React.FC = () => {
  const [categories, setCategories] = useState<WorkflowCategory[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formName, setFormName] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [stats, setStats] = useState<{
    totalWorkflows: number;
    totalCategories: number;
    avgPerCategory: number;
  }>({
    totalWorkflows: 0,
    totalCategories: 0,
    avgPerCategory: 0,
  });

  const loadCategories = async () => {
    try {
      setLoading(true);
      const data = await workflowsService.fetchCategories();
      setCategories(data);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Không thể tải danh sách danh mục", error);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const data = await workflowsService.getCategoryStats();
      setStats(data);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Không thể tải thống kê", error);
    }
  };

  useEffect(() => {
    loadCategories();
    loadStats();
  }, []);

  const startEdit = (cat: WorkflowCategory) => {
    setEditingId(cat.id);
    setFormName(cat.name);
  };

  const resetForm = () => {
    setEditingId(null);
    setFormName("");
  };

  const handleSave = () => {
    const save = async () => {
      if (!formName.trim()) {
        await Swal.fire({
          icon: 'warning',
          title: 'Thiếu thông tin',
          text: 'Vui lòng nhập tên danh mục.',
          confirmButtonText: 'Đã hiểu',
          confirmButtonColor: '#3b82f6',
        });
        return;
      }

      try {
        setSaving(true);
        if (editingId) {
          await workflowsService.updateCategory(editingId, { name: formName });
        } else {
          await workflowsService.createCategory({ name: formName });
        }

        // Fetch lại dữ liệu từ server
        await loadCategories();
        await loadStats();

        resetForm();
        await Swal.fire({
          icon: 'success',
          title: 'Thành công',
          text: editingId ? 'Đã cập nhật danh mục thành công.' : 'Đã thêm danh mục thành công.',
          confirmButtonText: 'Đã hiểu',
          confirmButtonColor: '#10b981',
        });
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error("Lưu danh mục thất bại", error);
        await Swal.fire({
          icon: 'error',
          title: 'Lỗi',
          text: 'Có lỗi khi lưu danh mục. Vui lòng thử lại.',
          confirmButtonText: 'Đã hiểu',
          confirmButtonColor: '#ef4444',
        });
      } finally {
        setSaving(false);
      }
    };

    void save();
  };

  const handleDelete = (id: string) => {
    const performDelete = async () => {
      const result = await Swal.fire({
        icon: 'warning',
        title: 'Xác nhận xóa',
        text: 'Bạn có chắc chắn muốn xoá danh mục này?',
        showCancelButton: true,
        confirmButtonText: 'Xóa',
        cancelButtonText: 'Hủy',
        confirmButtonColor: '#ef4444',
        cancelButtonColor: '#6b7280',
      });

      if (!result.isConfirmed) return;

      try {
        await workflowsService.deleteCategory(id);
        // Fetch lại dữ liệu từ server
        await loadCategories();
        await loadStats();
        if (editingId === id) {
          resetForm();
        }
        await Swal.fire({
          icon: 'success',
          title: 'Thành công',
          text: 'Đã xóa danh mục thành công.',
          confirmButtonText: 'Đã hiểu',
          confirmButtonColor: '#10b981',
        });
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error("Xoá danh mục thất bại", error);
        await Swal.fire({
          icon: 'error',
          title: 'Lỗi',
          text: 'Không thể xoá danh mục. Vui lòng thử lại.',
          confirmButtonText: 'Đã hiểu',
          confirmButtonColor: '#ef4444',
        });
      }
    };

    void performDelete();
  };

  return (
    <>
      <PageBreadcrumb
        title="Quản lý danh mục Workflows"
        name="Quản lý danh mục Workflows"
        breadCrumbItems={["Konrix", "Apps", "Workflows", "Danh mục"]}
      />

      {/* Stats header với màu sắc rõ ràng */}
      <div className="grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4 mb-6">
        <div className="card border border-amber-100 bg-amber-50/60">
          <div className="p-5 space-y-1">
            <p className="text-[11px] text-amber-700 uppercase font-semibold">
              Tổng Workflows
            </p>
            <p className="text-2xl font-bold text-amber-900">
              {loading ? "..." : stats.totalWorkflows}
            </p>
          </div>
        </div>
        <div className="card border border-sky-100 bg-sky-50/70">
          <div className="p-5 space-y-1">
            <p className="text-[11px] text-sky-700 uppercase font-semibold">
              Tổng danh mục
            </p>
            <p className="text-2xl font-bold text-sky-900">
              {loading ? "..." : stats.totalCategories}
            </p>
          </div>
        </div>
        <div className="card border border-emerald-100 bg-emerald-50/70">
          <div className="p-5 space-y-1">
            <p className="text-[11px] text-emerald-700 uppercase font-semibold">
              Trung bình workflow / danh mục
            </p>
            <p className="text-2xl font-bold text-emerald-900">
              {loading ? "..." : stats.avgPerCategory}
            </p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 grid-cols-1 gap-6">
        {/* Form thêm / sửa */}
        <div className="card">
          <div className="card-header">
            <h4 className="card-title mb-0">
              {editingId ? "Cập nhật danh mục" : "Thêm danh mục mới"}
            </h4>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="text-xs text-slate-500 mb-1 block">
                Tên danh mục
              </label>
              <input
                className="form-input text-sm"
                placeholder="Ví dụ: Automation, Marketing..."
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                disabled={saving}
              />
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                className="btn bg-primary text-white text-sm disabled:opacity-60"
                onClick={handleSave}
                disabled={saving}
              >
                {saving
                  ? "Đang lưu..."
                  : editingId
                  ? "Cập nhật"
                  : "Thêm mới"}
              </button>
              {editingId && (
                <button
                  type="button"
                  className="btn border text-sm"
                  onClick={resetForm}
                  disabled={saving}
                >
                  Hủy
                </button>
              )}
            </div>
            <p className="text-[11px] text-slate-500">
              Dữ liệu đang lấy trực tiếp từ API Workflows (`/workflows/categories`). Form này sẽ
              gửi yêu cầu tạo/cập nhật/xoá danh mục lên backend.
            </p>
          </div>
        </div>

        {/* Danh sách danh mục */}
        <div className="lg:col-span-2 card">
          <div className="card-header flex items-center justify-between">
            <h4 className="card-title mb-0">Danh sách danh mục Workflows</h4>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto text-sm">
              <thead className="bg-slate-50 dark:bg-slate-700/60">
                <tr>
                  <th className="px-3 py-2 text-left font-semibold text-slate-600">
                    Tên danh mục
                  </th>
                  <th className="px-3 py-2 text-left font-semibold text-slate-600">
                    Số Workflows
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
                      colSpan={3}
                      className="px-3 py-6 text-center text-slate-500 text-sm"
                    >
                      Đang tải...
                    </td>
                  </tr>
                ) : (
                  <>
                    {categories.map((cat) => (
                      <tr
                        key={cat.id}
                        className="border-t border-slate-100 dark:border-slate-700/50"
                      >
                        <td className="px-3 py-2">
                          <span className="font-medium text-slate-800 dark:text-slate-100">
                            {cat.name}
                          </span>
                        </td>
                        <td className="px-3 py-2 text-slate-600">
                          {cat.workflowCount || 0}
                        </td>
                        <td className="px-3 py-2 text-right">
                          <button
                            type="button"
                            className="btn btn-xs bg-slate-100 text-xs mr-2"
                            onClick={() => startEdit(cat)}
                          >
                            <i className="mgc_edit_line mr-1" />
                            Sửa
                          </button>
                          <button
                            type="button"
                            className="btn btn-xs bg-rose-50 text-rose-600 text-xs"
                            onClick={() => handleDelete(cat.id)}
                          >
                            <i className="mgc_delete_line mr-1" />
                            Xoá
                          </button>
                        </td>
                      </tr>
                    ))}
                    {categories.length === 0 && (
                      <tr>
                        <td
                          colSpan={3}
                          className="px-3 py-6 text-center text-slate-500 text-sm"
                        >
                          Chưa có danh mục nào.
                        </td>
                      </tr>
                    )}
                  </>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default WorkflowCategoriesAdmin;
