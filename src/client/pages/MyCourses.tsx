import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { PageBreadcrumb } from "../../components";
import { elearningService } from "../../config";

interface MyCourse {
  course_id: number;
  status: string;
  created_at: string;
  title: string;
  thumbnail_url: string;
  is_free: boolean;
  price: number;
}

const MyCourses: React.FC = () => {
  const [courses, setCourses] = useState<MyCourse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [statusFilter, setStatusFilter] = useState<string>("tat-ca");

  useEffect(() => {
    const loadCourses = async () => {
      try {
        setLoading(true);
        const data = await elearningService.getMyCourses();
        console.log("My courses loaded:", data);
        // getMyCourses returns Course[] directly, not wrapped in data
        setCourses(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Không thể tải khóa học của tôi", error);
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };

    loadCourses();
  }, []);

  const stats = useMemo(() => {
    const total = courses.length;
    const inProgress = courses.filter((c) => c.status === "active").length;
    const completed = courses.length; // All enrolled courses are considered active
    return { total, inProgress, completed };
  }, [courses]);

  const filtered = useMemo(() => {
    if (statusFilter === "tat-ca") return courses;
    return courses.filter((item) => item.status === statusFilter);
  }, [courses, statusFilter]);

  return (
    <>
      <PageBreadcrumb
        name="Khoá học của tôi"
        title="Khoá học của tôi"
        breadCrumbItems={["Client", "Khoá học của tôi"]}
      />

      <div className="card mb-5">
        <div className="p-4 md:p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-lg md:text-xl font-semibold mb-1">
              Khoá học bạn đang theo học
            </h2>
            <p className="text-xs md:text-sm text-slate-500">
              Theo dõi tiến độ, quay lại các bài đang học dở và hoàn thành lộ
              trình của bạn.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex gap-3 text-[11px]">
              <div className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700">
                <span className="font-semibold mr-1">{stats.completed}</span>
                Hoàn thành
              </div>
              <div className="px-3 py-1.5 rounded-xl bg-amber-50 text-amber-700">
                <span className="font-semibold mr-1">{stats.inProgress}</span>
                Đang học
              </div>
              <div className="px-3 py-1.5 rounded-xl bg-slate-50 text-slate-600">
                <span className="font-semibold mr-1">{stats.total}</span>
                Tổng khoá
              </div>
            </div>
          </div>
        </div>

        {/* Filter trạng thái */}
        <div className="border-t border-slate-100 px-4 pb-4 pt-3 md:px-5 flex flex-wrap gap-2 text-xs">
          {(["tat-ca", "active", "inactive"] as const).map(
            (st) => (
              <button
                key={st}
                className={`px-3 py-1.5 rounded-full border font-medium transition ${
                  statusFilter === st
                    ? "bg-amber-500 border-amber-500 text-white shadow-sm"
                    : "bg-transparent border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
                onClick={() => setStatusFilter(st)}
              >
                {st === "tat-ca" ? "Tất cả" : st === "active" ? "Đang học" : "Đã khóa"}
              </button>
            )
          )}
        </div>
      </div>

      {loading ? (
        <div className="card">
          <div className="p-6 text-center text-slate-600">
            Đang tải khóa học của bạn...
          </div>
        </div>
      ) : (
        <div className="grid lg:grid-cols-2 grid-cols-1 gap-5">
          {filtered.map((item) => (
            <div key={item.course_id} className="card flex flex-col md:flex-row">
              <div className="md:w-40 md:flex-shrink-0">
                <img
                  src={item.thumbnail_url || "/assets/images/default-course.jpg"}
                  alt={item.title}
                  className="w-full h-32 md:h-full object-cover rounded-t-xl md:rounded-l-xl md:rounded-tr-none"
                />
              </div>
              <div className="flex-1 p-5 flex flex-col gap-2">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-sm md:text-base font-semibold line-clamp-2">
                    {item.title}
                  </h3>
                  <span
                    className={`inline-flex px-2.5 py-0.5 rounded-full text-[11px] font-medium ${
                      item.status === "active"
                        ? "bg-amber-100 text-amber-700"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {item.status === "active" ? "Đang học" : "Đã khóa"}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span>Đăng ký: {new Date(item.created_at).toLocaleDateString('vi-VN')}</span>
                </div>
                <div className="mt-auto flex items-center justify-between pt-2">
                  <span className="text-primary font-semibold text-sm">
                    {item.is_free ? "Miễn phí" : `${item.price.toLocaleString('vi-VN')}đ`}
                  </span>
                  <Link
                    to={`/courses/${item.course_id}`}
                    className="btn btn-sm bg-amber-500 text-white text-xs"
                  >
                    Tiếp tục học
                  </Link>
                </div>
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="card">
              <div className="p-6 text-sm text-slate-500">
                Bạn chưa đăng ký khoá học nào hoặc không có khoá học nào phù hợp
                bộ lọc hiện tại.
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default MyCourses;


