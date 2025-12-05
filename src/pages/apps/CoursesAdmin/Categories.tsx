import React, { useEffect, useMemo, useState } from "react";
import { PageBreadcrumb } from "../../../components";
import Swal from 'sweetalert2';
import 'sweetalert2/src/sweetalert2.scss';

import { API_URL, elearningService } from "../../../config";
import { Category } from "../../../services/elearningService";

const CourseCategoriesAdmin: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formName, setFormName] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const totalCourses = useMemo(
    () => categories.reduce((sum, c) => sum + (c.courseCount ?? 0), 0),
    [categories]
  );
  const totalCategories = useMemo(() => categories.length, [categories]);
  const avgPerCategory = useMemo(
    () => (totalCategories ? Math.round(totalCourses / totalCategories) : 0),
    [totalCourses, totalCategories]
  );

  // ===== API helpers =====

  const fetchCategories = async () => {
    console.log("🟢 fetchCategories called");
    setLoading(true);
    setError(null);
    try {
      console.log("🟢 Calling elearningService.getCategories()");
      // ElearningService.getCategories() đã trả về mảng Category (response.data.data)
      const list = await elearningService.getCategories();
      console.log("🟢 Categories API response:", list);
      console.log("🟢 List type:", Array.isArray(list) ? 'array' : typeof list);
      console.log("🟢 List length:", Array.isArray(list) ? list.length : 'not an array');

      if (Array.isArray(list)) {
        setCategories(
          list.map((c) => ({
            id: String(c.id),
            name: c.name,
            courseCount: c.courseCount ?? 0,
          }))
        );
      } else {
        console.warn("⚠️ Response is not an array:", list);
        setCategories([]);
      }
    } catch (err: any) {
      console.error("❌ Failed to fetch categories:", err);
      setError("Không tải được danh mục. Kiểm tra API /elearning/categories.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("🟢 Component mounted, calling fetchCategories");
    fetchCategories();
  }, []);

  const startEdit = (cat: Category) => {
    setEditingId(String(cat.id));
    setFormName(cat.name);
  };

  const resetForm = () => {
    setEditingId(null);
    setFormName("");
  };

  const handleSave = async () => {
    if (!formName.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Cảnh báo',
        text: 'Vui lòng nhập tên danh mục',
        confirmButtonText: 'Đóng',
        confirmButtonColor: '#3085d6',
      });
      setError("Vui lòng nhập tên danh mục");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      if (editingId) {
        // Cập nhật category qua ElearningService
        const updated = await elearningService.updateCategory(editingId, {
          name: formName.trim(),
        });
        if (!updated) {
          throw new Error("Update category failed");
        }
        console.log("Category updated successfully:", updated);
        
        // Thông báo thành công
        Swal.fire({
          icon: 'success',
          title: 'Thành công!',
          text: 'Danh mục đã được cập nhật thành công',
          confirmButtonText: 'Đóng',
          confirmButtonColor: '#10b981',
          timer: 2000,
          timerProgressBar: true,
        });
      } else {
        console.log("Creating category:", formName);  
        // Tạo mới category qua ElearningService
        const created = await elearningService.createCategory({
          name: formName.trim(),
        });
        console.log("Create Category API response:", created);
        if (!created) {
          throw new Error("Create category failed");
        }
        
        // Thông báo thành công
        Swal.fire({
          icon: 'success',
          title: 'Thành công!',
          text: 'Danh mục đã được tạo thành công',
          confirmButtonText: 'Đóng',
          confirmButtonColor: '#10b981',
          timer: 2000,
          timerProgressBar: true,
        });
      }
      await fetchCategories();
      resetForm();
    } catch (err: any) {
      console.error("Failed to save category:", err);
      const errorMessage = 
        err?.response?.data?.message || 
        err?.response?.data?.error ||
        err?.message ||
        "Không lưu được danh mục. Kiểm tra quyền Admin / API.";
      setError(errorMessage);
      
      // Thông báo lỗi
      Swal.fire({
        icon: 'error',
        title: 'Lỗi!',
        text: errorMessage,
        confirmButtonText: 'Đóng',
        confirmButtonColor: '#ef4444',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    // Hiển thị confirm dialog với SweetAlert
    const result = await Swal.fire({
      icon: 'warning',
      title: 'Xác nhận xóa',
      text: 'Bạn có chắc chắn muốn xóa danh mục này?',
      showCancelButton: true,
      confirmButtonText: 'Xóa',
      cancelButtonText: 'Hủy',
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      reverseButtons: true,
    });

    if (!result.isConfirmed) return;

    setSaving(true);
    setError(null);
    try {
      // Xoá category qua ElearningService
      await elearningService.deleteCategory(id);
      console.log("Category deleted successfully");
      setCategories((prev) => prev.filter((c) => c.id !== id));
      if (editingId === id) resetForm();
      
      // Thông báo thành công
      Swal.fire({
        icon: 'success',
        title: 'Đã xóa!',
        text: 'Danh mục đã được xóa thành công',
        confirmButtonText: 'Đóng',
        confirmButtonColor: '#10b981',
        timer: 2000,
        timerProgressBar: true,
      });
    } catch (err: any) {
      console.error("Failed to delete category:", err);
      const errorMessage = 
        err?.response?.data?.message || 
        err?.response?.data?.error ||
        err?.message ||
        "Không xoá được danh mục. Kiểm tra quyền Admin / API.";
      setError(errorMessage);
      
      // Thông báo lỗi
      Swal.fire({
        icon: 'error',
        title: 'Lỗi!',
        text: errorMessage,
        confirmButtonText: 'Đóng',
        confirmButtonColor: '#ef4444',
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <PageBreadcrumb
        title="Quản lý danh mục khoá học"
        name="Quản lý danh mục khoá học"
        breadCrumbItems={["Konrix", "Apps", "Khoá học", "Danh mục"]}
      />

      {/* Stats header với màu sắc rõ hơn */}
      <div className="grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4 mb-6">
        <div className="card border border-amber-100 bg-amber-50/60">
          <div className="p-5 space-y-1">
            <p className="text-[11px] text-amber-700 uppercase font-semibold">
              Tổng khoá học
            </p>
            <p className="text-2xl font-bold text-amber-900">{totalCourses}</p>
          </div>
        </div>
        <div className="card border border-sky-100 bg-sky-50/70">
          <div className="p-5 space-y-1">
            <p className="text-[11px] text-sky-700 uppercase font-semibold">
              Tổng danh mục
            </p>
            <p className="text-2xl font-bold text-sky-900">{totalCategories}</p>
          </div>
        </div>
        <div className="card border border-emerald-100 bg-emerald-50/70">
          <div className="p-5 space-y-1">
            <p className="text-[11px] text-emerald-700 uppercase font-semibold">
              Trung bình khoá / danh mục
            </p>
            <p className="text-2xl font-bold text-emerald-900">
              {avgPerCategory}
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
            {error && (
              <div className="text-xs text-rose-600 bg-rose-50 border border-rose-100 px-3 py-2 rounded">
                {error}
              </div>
            )}
            <div>
              <label className="text-xs text-slate-500 mb-1 block">
                Tên danh mục
              </label>
              <input
                className="form-input text-sm"
                placeholder="Ví dụ: Lập trình, Thiết kế..."
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
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
                >
                  Hủy
                </button>
              )}
            </div>
            <p className="text-[11px] text-slate-500">
              Dữ liệu đang lấy từ API{" "}
              <code className="text-[10px] bg-slate-100 px-1 rounded">
                {API_URL}/api/elearning/categories
              </code>
              .
            </p>
          </div>
        </div>

        {/* Danh sách danh mục */}
        <div className="lg:col-span-2 card">
          <div className="card-header flex items-center justify-between">
            <h4 className="card-title mb-0">Danh sách danh mục</h4>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto text-sm">
              <thead className="bg-slate-50 dark:bg-slate-700/60">
                <tr>
                  <th className="px-3 py-2 text-left font-semibold text-slate-600">
                    Tên danh mục
                  </th>
                  <th className="px-3 py-2 text-left font-semibold text-slate-600">
                    Số khoá học
                  </th>
                  <th className="px-3 py-2 text-right font-semibold text-slate-600">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading && (
                  <tr>
                    <td
                      colSpan={3}
                      className="px-3 py-6 text-center text-slate-500 text-sm"
                    >
                      Đang tải danh mục...
                    </td>
                  </tr>
                )}
                {!loading &&
                  categories.map((cat) => (
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
                      {cat.courseCount}
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
                        onClick={() => handleDelete(String(cat.id))}
                      >
                        <i className="mgc_delete_line mr-1" />
                        Xoá
                      </button>
                    </td>
                  </tr>
                ))}
                {!loading && categories.length === 0 && (
                  <tr>
                    <td
                      colSpan={3}
                      className="px-3 py-6 text-center text-slate-500 text-sm"
                    >
                      Chưa có danh mục nào.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default CourseCategoriesAdmin;


