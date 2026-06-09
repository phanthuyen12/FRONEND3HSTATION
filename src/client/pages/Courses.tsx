import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { PageBreadcrumb } from "../../components";
import { elearningService } from "../../config";
import { Category, Course } from "../../services/elearningService";

const Courses: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [activeCategory, setActiveCategory] = useState<string>("Tất cả");
  const [search, setSearch] = useState<string>("");

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [catsData, coursesData] = await Promise.all([
          elearningService.getClientCategories(),
          elearningService.getClientCourses({
            category: activeCategory !== "Tất cả" ? activeCategory : undefined,
            search: search.trim() || undefined,
          }),
        ]);
        setCategories(catsData);
        setCourses(coursesData.data || []);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error("Không thể tải dữ liệu", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [activeCategory, search]);

  const categoryNames = useMemo(
    () => ["Tất cả", ...categories.map((cat) => cat.name)],
    [categories]
  );

  const displayedCourses = useMemo(
    () => {
      if (activeCategory === "Tất cả") return courses;
      const category = categories.find((cat) => cat.name === activeCategory);
      if (!category) return courses;
      return courses.filter((c) => String(c.category_id || c.categoryId) === String(category.id));
    },
    [activeCategory, courses, categories]
  );

  return (
    <>
      <PageBreadcrumb
        name="Tất cả khóa học"
        title="Tất cả khóa học"
        breadCrumbItems={["Client", "Khóa học"]}
      />

      {/* Thanh filter + info tạo điểm nhấn */}
      <div className="card mb-5">
        <div className="p-4 md:p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-lg md:text-xl font-semibold mb-1">
              Danh sách khoá học
            </h2>
            <p className="text-xs md:text-sm text-slate-500">
              Lọc theo chủ đề bạn quan tâm để bắt đầu lộ trình phù hợp.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <span className="absolute inset-y-0 left-3 flex items-center text-slate-400 text-sm">
                <i className="mgc_search_3_line" />
              </span>
              <input
                className="form-input pl-9 pr-3 py-2 text-xs w-64"
                placeholder="Tìm kiếm khóa học..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>
        <div className="px-4 pb-4">
          <div className="flex flex-wrap gap-2">
            {categoryNames.map((cat) => (
              <button
                key={cat}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition ${activeCategory === cat
                    ? "bg-amber-500 border-amber-500 text-white shadow-sm"
                    : "bg-transparent border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="grid 2xl:grid-cols-3 lg:grid-cols-2 grid-cols-1 gap-6">
          {Array.from({ length: 6 }).map((_, idx) => (
            <div
              key={idx}
              className="card h-full animate-pulse bg-slate-50/60"
            >
              <div className="h-48 bg-slate-200 rounded-t-xl" />
              <div className="p-6 space-y-3">
                <div className="h-4 bg-slate-200 rounded w-1/2" />
                <div className="h-4 bg-slate-200 rounded w-full" />
                <div className="h-4 bg-slate-200 rounded w-3/4" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid 2xl:grid-cols-3 lg:grid-cols-2 grid-cols-1 gap-6">
          {displayedCourses.map((course) => (
            <div
              key={course.id}
              className="card h-full flex flex-col hover:shadow-lg transition-shadow"
            >
              <div className="relative">
                <img
                  src={course.thumbnail || course.thumbnail_url || "/images/placeholder.jpg"}
                  alt={course.title}
                  className="w-full h-48 object-cover rounded-t-xl"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/images/placeholder.jpg";
                  }}
                />
                <span className="absolute top-3 left-3 bg-black/70 text-white text-[11px] px-2 py-1 rounded-full">
                  {categories.find((c) => String(c.id) === String(course.category_id || course.categoryId))?.name || "Khóa học"}
                </span>
              </div>
              <div className="p-6 flex flex-col gap-2 flex-1">
                <h4 className="text-base font-semibold line-clamp-2">
                  {course.title}
                </h4>
                <p className="text-sm text-slate-500 line-clamp-3">
                  {course.short_description || course.description || ""}
                </p>
                <div className="flex items-center justify-between text-xs text-slate-500 mt-1">
                  <span>{course.duration || "N/A"}</span>
                  <span>{course.lessons || 0} bài học</span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>{(course.students || 0).toLocaleString()} học viên</span>
                  {course.rating && (
                    <span className="flex items-center gap-1">
                      <i className="mgc_star_fill text-amber-400" />
                      <span className="font-medium text-slate-700">
                        {typeof course.rating === 'number' ? course.rating.toFixed(1) : course.rating}
                      </span>
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-between pt-2 mt-auto">
                  <span className="text-xs font-semibold text-slate-500">
                    Theo quyền truy cập
                  </span>
                  <Link
                    to={`/courses/${course.id}`}
                    className="btn bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-md text-sm transition-colors"
                  >
                    Xem chi tiết
                  </Link>
                </div>
              </div>
            </div>
          ))}
          {displayedCourses.length === 0 && !loading && (
            <div className="col-span-full card">
              <div className="p-6 text-center text-slate-500">
                Không tìm thấy khóa học nào phù hợp.
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Courses;
