import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { elearningService, userService, authService } from "../../config";
import { Category, Course } from "../../services/elearningService";
import { User } from "../../services/userService";

const Home: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [activeCategory, setActiveCategory] = useState<string>("Tất cả");
  const [userInfo, setUserInfo] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<any>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Lấy thông tin user từ localStorage trước
        const localUser = authService.getUser();
        setUserProfile(localUser);
        
        const [catsData, coursesData] = await Promise.all([
          elearningService.getClientCategories(),
          elearningService.getClientCourses({ limit: 12 }),
        ]);
        setCategories(catsData);
        setCourses(coursesData.data || []);
        
        // Lấy thông tin chi tiết từ API nếu có token
        if (authService.isAuthenticated()) {
          try {
            const profile = await authService.getProfile();
            setUserProfile(profile);
            setUserInfo(profile as User);
          } catch (error) {
            // Fallback: thử getUserInfo từ userService
            try {
              const user = await userService.getUserInfo();
              setUserInfo(user);
            } catch (err) {
              console.error("Không thể tải thông tin user", err);
            }
          }
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error("Không thể tải dữ liệu", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const categoryNames = useMemo(
    () => ["Tất cả", ...categories.map((cat) => cat.name)],
    [categories]
  );

  const totalCourses = courses.length;
  const enrolledCourses = 0; // TODO: Load from user's enrolled courses
  const completedCourses = 0; // TODO: Load from user's completed courses
  
  // Lấy thông tin user
  const currentUser = userProfile || authService.getUser();
  const balance = userInfo?.balance || currentUser?.balance || 0;
  const totalDeposit = 0; // TODO: Load from user's deposit history
  const userRank = "Thành viên"; // TODO: Calculate from deposit amount
  const nextRank = "Cộng tác viên";
  const depositNeeded = 500000; // TODO: Calculate from current rank

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
      <div className="flex flex-col gap-6 mb-6">
        {/* Hero section tạo điểm nhấn */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-white">
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            <div className="absolute -right-24 -top-24 w-64 h-64 rounded-full bg-white" />
            <div className="absolute -left-32 bottom-0 w-72 h-72 rounded-full bg-amber-200" />
          </div>
          <div className="relative px-6 py-7 md:px-10 md:py-9 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="max-w-xl">
              <p className="inline-flex items-center px-3 py-1 rounded-full bg-white/15 text-[11px] font-medium uppercase tracking-wide mb-3">
                <span className="mr-1">🔥</span> Học nhanh – Thực chiến – Dễ áp dụng
              </p>
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-semibold mb-3 leading-tight">
                Nền tảng học tập cho người làm{" "}
                <span className="underline decoration-2 decoration-white/70">
                  sản phẩm số
                </span>
              </h1>
              <p className="text-sm md:text-base text-amber-50/90 mb-4">
                Khóa học, tài liệu và workflows tự động hoá được thiết kế dành riêng
                cho người đi làm, tối ưu thời gian nhưng vẫn đảm bảo chất lượng.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  to="/courses"
                  className="btn bg-slate-900 text-white text-sm px-5 py-2 rounded-xl shadow-md shadow-slate-900/30"
                >
                  Bắt đầu học ngay
                </Link>
                <Link
                  to="/workflows"
                  className="btn bg-white/10 hover:bg-white/20 text-sm text-white border border-white/30 rounded-xl px-5 py-2"
                >
                  Khám phá Workflows
                </Link>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 min-w-[220px] text-xs">
              <div className="rounded-2xl bg-white/15 p-3 backdrop-blur">
                <p className="text-amber-100/80 mb-1">Khoá học đã đăng ký</p>
                <p className="text-xl font-semibold">{enrolledCourses}</p>
                <p className="mt-1 text-[11px] text-amber-50/80">
                  Tiếp tục lộ trình học mỗi ngày.
                </p>
              </div>
              <div className="rounded-2xl bg-white/15 p-3 backdrop-blur">
                <p className="text-amber-100/80 mb-1">Khoá học đã hoàn thành</p>
                <p className="text-xl font-semibold">{completedCourses}</p>
                <p className="mt-1 text-[11px] text-amber-50/80">
                  Chúc mừng những thành tựu gần đây.
                </p>
              </div>
              <div className="rounded-2xl bg-white/15 p-3 backdrop-blur col-span-2">
                <p className="text-amber-100/80 mb-1">Thư viện khoá học</p>
                <p className="text-lg font-semibold">{totalCourses}+</p>
                <p className="mt-1 text-[11px] text-amber-50/80">
                  Từ Lập trình, Thiết kế, Kinh doanh, Data, Marketing và nhiều hơn
                  nữa.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Thông tin tài khoản */}

        {/* Stats Cards - Box vuông đều nhau */}
        <div className="grid md:grid-cols-4 grid-cols-2 gap-4">
          <div className="card bg-amber-50 border border-amber-200 hover:shadow-md transition-shadow">
            <div className="p-5 h-full flex flex-col">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                  <i className="mgc_book_2_line text-xl text-amber-600"></i>
                </div>
              </div>
              <p className="text-[10px] font-semibold text-amber-600 uppercase tracking-wide mb-2">
                Khoá học đã đăng ký
              </p>
              <h3 className="text-3xl font-bold mb-2 text-slate-900">{enrolledCourses}</h3>
              <p className="text-xs text-slate-600 mt-auto">
                Bạn đang theo học {enrolledCourses} khoá trong hệ thống.
              </p>
            </div>
          </div>
          
          <div className="card bg-blue-50 border border-blue-200 hover:shadow-md transition-shadow">
            <div className="p-5 h-full flex flex-col">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                  <i className="mgc_check_circle_line text-xl text-blue-600"></i>
                </div>
              </div>
              <p className="text-[10px] font-semibold text-blue-600 uppercase tracking-wide mb-2">
                Khoá học đã hoàn thành
              </p>
              <h3 className="text-3xl font-bold mb-2 text-slate-900">{completedCourses}</h3>
              <p className="text-xs text-slate-600 mt-auto">
                Tiếp tục duy trì thói quen học mỗi ngày.
              </p>
            </div>
          </div>
          
          <div className="card bg-sky-50 border border-sky-200 hover:shadow-md transition-shadow">
            <div className="p-5 h-full flex flex-col">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-sky-100 flex items-center justify-center">
                  <i className="mgc_library_line text-xl text-sky-600"></i>
                </div>
              </div>
              <p className="text-[10px] font-semibold text-sky-600 uppercase tracking-wide mb-2">
                Tổng khoá học
              </p>
              <h3 className="text-3xl font-bold mb-2 text-slate-900">{totalCourses}</h3>
              <p className="text-xs text-slate-600 mt-auto">
                Nhiều chủ đề từ Lập trình, Thiết kế, Kinh doanh, Data, Marketing.
              </p>
            </div>
          </div>
          
          <div className="card bg-emerald-50 border border-emerald-200 hover:shadow-md transition-shadow">
            <div className="p-5 h-full flex flex-col">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                  <i className="mgc_wallet_line text-xl text-emerald-600"></i>
                </div>
              </div>
              <p className="text-[10px] font-semibold text-emerald-600 uppercase tracking-wide mb-2">
                Số dư tài khoản
              </p>
              <h3 className="text-3xl font-bold mb-2 text-emerald-600">
                {balance.toLocaleString('vi-VN')}₫
              </h3>
              <p className="text-xs text-slate-600 mt-auto">
                Số tiền hiện có trong tài khoản của bạn.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex flex-wrap gap-2">
          {categoryNames.map((cat) => (
            <button
              key={cat}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border ${
                activeCategory === cat
                  ? "bg-amber-500 border-amber-500 text-white"
                  : "bg-transparent border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="grid 2xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-6">
          {Array.from({ length: 8 }).map((_, idx) => (
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
        <div className="grid 2xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-6">
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
              </div>
              <div className="flex-1 p-6 flex flex-col">
                <span className="text-xs font-medium text-amber-500 uppercase mb-2">
                  {categories.find((c) => String(c.id) === String(course.category_id || course.categoryId))?.name || "Khóa học"}
                </span>
                <h4 className="text-base font-semibold mb-2 line-clamp-2">
                  {course.title}
                </h4>
                <p className="text-sm text-slate-500 mb-4 line-clamp-3">
                  {course.short_description || course.description || ""}
                </p>

                <div className="flex items-center justify-between mb-3 text-xs text-slate-500">
                  <span>{course.duration || "N/A"}</span>
                  <span>{course.lessons || 0} bài học</span>
                </div>
                <div className="flex items-center justify-between mb-4 text-xs text-slate-500">
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

                <div className="mt-auto flex items-center justify-between pt-1">
                  <span className="text-primary font-semibold">
                    {course.is_free ? "Miễn phí" : (typeof course.price === 'number' ? course.price.toLocaleString('vi-VN') + 'đ' : course.price || "Liên hệ")}
                  </span>
                  <Link
                    to={`/courses/${course.id}`}
                    className="btn bg-amber-500 text-white px-4 py-2 rounded-md text-sm"
                  >
                    Đăng ký ngay
                  </Link>
                </div>
              </div>
            </div>
          ))}
          {displayedCourses.length === 0 && !loading && (
            <div className="col-span-full card">
              <div className="p-6 text-center text-slate-500">
                Không có khóa học nào.
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Home;
