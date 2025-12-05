import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PageBreadcrumb } from "../../../components";
import { elearningService } from "../../../config";
import { Course } from "../../../services/elearningService";
import Swal from 'sweetalert2';
import 'sweetalert2/src/sweetalert2.scss';

const CoursesAdminList: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Load courses from API
  useEffect(() => {
    const loadCourses = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await elearningService.getCourses();
        setCourses(data);
      } catch (err: any) {
        console.error("Failed to load courses:", err);
        const errorMessage =
          err?.response?.data?.message ||
          err?.response?.data?.error ||
          err?.message ||
          "Không tải được danh sách khóa học";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    loadCourses();
  }, []);

  const totalCourses = useMemo(() => courses.length, [courses]);
  const totalStudents = useMemo(
    () => courses.reduce((sum, c) => sum + (c.students || 0), 0),
    [courses]
  );

  const filtered = useMemo(() => {
    if (!search.trim()) return courses;
    const keyword = search.toLowerCase();
    return courses.filter(
      (c) =>
        c.title.toLowerCase().includes(keyword) ||
        (c.category && c.category.toLowerCase().includes(keyword)) ||
        (c.categoryId && String(c.categoryId).toLowerCase().includes(keyword))
    );
  }, [courses, search]);

  const handleDelete = async (id: string | number) => {
    const result = await Swal.fire({
      icon: 'warning',
      title: 'Xác nhận xóa',
      text: 'Bạn có chắc chắn muốn xóa khóa học này?',
      showCancelButton: true,
      confirmButtonText: 'Xóa',
      cancelButtonText: 'Hủy',
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      reverseButtons: true,
    });

    if (!result.isConfirmed) return;

    try {
      await elearningService.deleteCourse(id);
      setCourses((prev) => prev.filter((c) => String(c.id) !== String(id)));
      
      Swal.fire({
        icon: 'success',
        title: 'Đã xóa!',
        text: 'Khóa học đã được xóa thành công',
        confirmButtonText: 'Đóng',
        timer: 2000,
      });
    } catch (err: any) {
      console.error("Failed to delete course:", err);
      const errorMessage =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Không xóa được khóa học";
      
      Swal.fire({
        icon: 'error',
        title: 'Lỗi!',
        text: errorMessage,
        confirmButtonText: 'Đóng',
      });
    }
  };

  // Format price
  const formatPrice = (price: string | number | undefined): string => {
    if (!price) return "0";
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    if (isNaN(numPrice)) return String(price);
    return new Intl.NumberFormat('vi-VN').format(numPrice) + " đ";
  };

  // Format rating
  const formatRating = (rating: string | number | undefined): string => {
    if (!rating) return "0.0";
    const numRating = typeof rating === 'string' ? parseFloat(rating) : rating;
    if (isNaN(numRating)) return "0.0";
    return numRating.toFixed(1);
  };

  // Get level display text
  const getLevelText = (level: string | undefined): string => {
    const levelMap: Record<string, string> = {
      beginner: "Cơ bản",
      intermediate: "Trung cấp",
      advanced: "Nâng cao",
    };
    return levelMap[level || ""] || level || "N/A";
  };

  return (
    <>
      <PageBreadcrumb
        title="Quản lý khoá học"
        name="Quản lý khoá học"
        breadCrumbItems={["Konrix", "Apps", "Khoá học"]}
      />

      {error && (
        <div className="card mb-4">
          <div className="p-4 bg-rose-50 border border-rose-200 rounded text-rose-700 text-sm">
            {error}
          </div>
        </div>
      )}

      {/* Header + stats + filter */}
      <div className="card mb-4">
        <div className="p-4 md:p-5 flex flex-col gap-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
              <h3 className="text-lg md:text-xl font-semibold mb-1">
                Danh sách khoá học
              </h3>
              <p className="text-xs md:text-sm text-slate-500">
                Dữ liệu được lấy từ API
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <span className="absolute inset-y-0 left-3 flex items-center text-slate-400 text-sm">
                  <i className="mgc_search_3_line" />
                </span>
                <input
                  className="form-input pl-9 pr-3 py-2 text-xs w-56"
                  placeholder="Tìm theo tên hoặc danh mục"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <button
                type="button"
                className="btn bg-emerald-500 text-white text-sm"
                onClick={() => navigate("/admin/elearning/courses/new")}
              >
                <i className="mgc_add_circle_line mr-1" /> Thêm khoá học
              </button>
            </div>
          </div>

          <div className="grid sm:grid-cols-3 grid-cols-1 gap-3 text-xs md:text-sm">
            <div className="rounded-xl bg-amber-50 px-3 py-2.5 text-amber-700">
              <p className="uppercase tracking-wide text-[10px] font-semibold mb-1">
                Tổng khoá học
              </p>
              <p className="text-xl font-semibold">{totalCourses}</p>
            </div>
            <div className="rounded-xl bg-sky-50 px-3 py-2.5 text-sky-700">
              <p className="uppercase tracking-wide text-[10px] font-semibold mb-1">
                Tổng học viên
              </p>
              <p className="text-xl font-semibold">
                {totalStudents.toLocaleString("vi-VN")}
              </p>
            </div>
            <div className="rounded-xl bg-emerald-50 px-3 py-2.5 text-emerald-700">
              <p className="uppercase tracking-wide text-[10px] font-semibold mb-1">
                Đang hiển thị
              </p>
              <p className="text-xl font-semibold">{filtered.length}</p>
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
                  Khoá học
                </th>
                <th className="px-3 py-2 text-left font-semibold text-slate-600">
                  Danh mục
                </th>
                <th className="px-3 py-2 text-left font-semibold text-slate-600">
                  Mức độ
                </th>
                <th className="px-3 py-2 text-right font-semibold text-slate-600">
                  Học viên
                </th>
                <th className="px-3 py-2 text-right font-semibold text-slate-600">
                  Giá
                </th>
                <th className="px-3 py-2 text-center font-semibold text-slate-600">
                  Đánh giá
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
                    colSpan={7}
                    className="px-3 py-6 text-center text-slate-500 text-sm"
                  >
                    Đang tải danh sách khóa học...
                  </td>
                </tr>
              )}
              {!loading && filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-3 py-6 text-center text-slate-500 text-sm"
                  >
                    {search.trim() 
                      ? "Không tìm thấy khoá học nào phù hợp."
                      : "Chưa có khóa học nào. Nhấn 'Thêm khóa học' để tạo mới."}
                  </td>
                </tr>
              )}
              {!loading &&
                filtered.map((course) => (
                  <tr
                    key={course.id}
                    className="border-t border-slate-100 dark:border-slate-700/60"
                  >
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-3">
                        {course.thumbnail && (
                          <img
                            src={course.thumbnail}
                            alt={course.title}
                            className="w-14 h-10 rounded object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                            }}
                          />
                        )}
                        <div>
                          <Link
                            to={`/admin/elearning/courses/${course.id}`}
                            className="font-semibold text-slate-900 dark:text-slate-100 hover:text-primary text-sm"
                          >
                            {course.title}
                          </Link>
                          <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                            {course.short_description || ""}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-sm text-slate-700">
                      {course.category || course.categoryId || "N/A"}
                    </td>
                    <td className="px-3 py-3 text-xs text-slate-600">
                      {getLevelText(course.level)}
                    </td>
                    <td className="px-3 py-3 text-right text-xs text-slate-600">
                      {(course.students || 0).toLocaleString("vi-VN")}
                    </td>
                    <td className="px-3 py-3 text-right text-sm font-semibold text-primary">
                      {formatPrice(course.price)}
                    </td>
                    <td className="px-3 py-3 text-center text-xs text-slate-600">
                      <span className="inline-flex items-center gap-1">
                        <i className="mgc_star_fill text-amber-400" />
                        {formatRating(course.rating)}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-right whitespace-nowrap">
                      <button
                        type="button"
                        className="btn btn-xs bg-slate-100 text-xs mr-2"
                        onClick={() =>
                          navigate(`/admin/elearning/courses/${course.id}`)
                        }
                      >
                        <i className="mgc_edit_line mr-1" />
                        Sửa
                      </button>
                      <button
                        type="button"
                        className="btn btn-xs bg-rose-50 text-rose-600 text-xs"
                        onClick={() => handleDelete(course.id!)}
                      >
                        <i className="mgc_delete_line mr-1" />
                        Xoá
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default CoursesAdminList;
