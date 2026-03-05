import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { elearningService, userService, authService, vpsService, workflowsService } from "../../config";
import { Category, Course } from "../../services/elearningService";
import { User } from "../../services/userService";

const Home: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [vpsPlans, setVpsPlans] = useState<any[]>([]);
  const [workflows, setWorkflows] = useState<any[]>([]);
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

        const [catsData, coursesData, vpsData, workflowsData] = await Promise.all([
          elearningService.getClientCategories(),
          elearningService.getClientCourses({ limit: 8 }),
          vpsService.fetchClientPlans().catch(() => []),
          workflowsService.fetchClientWorkflows({ limit: 8 }).catch(() => ({ data: [] })),
        ]);
        setCategories(catsData);
        setCourses(coursesData.data || []);
        setVpsPlans(vpsData || []);
        setWorkflows(workflowsData.data || []);

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
        <div className="grid xl:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-4">
          <div className="card h-full bg-amber-50 border border-amber-200 hover:shadow-md transition-shadow">
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

          <div className="card h-full bg-blue-50 border border-blue-200 hover:shadow-md transition-shadow">
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

          <div className="card h-full bg-sky-50 border border-sky-200 hover:shadow-md transition-shadow">
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

          <div className="card h-full bg-emerald-50 border border-emerald-200 hover:shadow-md transition-shadow">
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
      {/* Courses Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 mb-2">
              Khóa học nổi bật
            </h2>
            <p className="text-base text-slate-600">Học tập kỹ năng mới, nâng cao chuyên môn</p>
          </div>
          <Link
            to="/courses"
            className="text-sm font-semibold flex items-center gap-1 group"
            style={{ color: '#FFC700' }}
          >
            Xem tất cả
            <i className="mgc_arrow_right_line group-hover:translate-x-1 transition-transform"></i>
          </Link>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="flex flex-wrap gap-2">
            {categoryNames.map((cat) => (
              <button
                key={cat}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border ${activeCategory === cat
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
                      {course.is_free ? "Miễn phí" : (() => {
                        const priceValue = typeof course.price === 'number'
                          ? course.price
                          : parseFloat(course.price?.toString().replace(/[^\d.]/g, '') || '0');
                        return priceValue > 0 ? Math.round(priceValue).toLocaleString('vi-VN') + 'đ' : 'Liên hệ';
                      })()}
                    </span>
                    <Link
                      to={`/courses/${course.id}`}
                      className="btn bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-md text-sm transition-colors"
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
      </div>

      {/* Workflows Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 mb-2">
              Workflows tự động hóa
            </h2>
            <p className="text-base text-slate-600">Tự động hóa quy trình, tiết kiệm thời gian làm việc</p>
          </div>
          <Link
            to="/workflows"
            className="text-sm font-semibold flex items-center gap-1 group"
            style={{ color: '#FFC700' }}
          >
            Xem tất cả
            <i className="mgc_arrow_right_line group-hover:translate-x-1 transition-transform"></i>
          </Link>
        </div>

        {workflows.length === 0 ? (
          <div className="card bg-white border border-slate-200">
            <div className="p-12 text-center">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ backgroundColor: '#FFF9E6' }}>
                <i className="mgc_settings_3_line text-4xl" style={{ color: '#FFC700' }}></i>
              </div>
              <p className="text-slate-600 mb-4 text-lg">Chưa có workflow nào</p>
            </div>
          </div>
        ) : (
          <div className="grid 2xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-6">
            {workflows.slice(0, 8).map((workflow: any) => (
              <div
                key={workflow.id}
                className="card hover:shadow-lg transition-shadow"
              >
                {workflow.image && (
                  <img
                    src={workflow.image}
                    alt={workflow.name}
                    className="w-full h-48 object-cover rounded-t-xl"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                )}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#FEF3C7' }}>
                      <i className="mgc_settings_3_fill text-2xl" style={{ color: '#FFC700' }}></i>
                    </div>
                    {workflow.status && (
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${workflow.status === 'active'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-slate-100 text-slate-700'
                        }`}>
                        {workflow.status === 'active' ? 'Hoạt động' : 'Mới'}
                      </span>
                    )}
                  </div>

                  <h4 className="font-semibold text-slate-900 mb-2 line-clamp-2">
                    {workflow.name || workflow.workflowName}
                  </h4>

                  <p className="text-sm text-slate-600 mb-4 line-clamp-3">
                    {workflow.description || 'Workflow tự động hóa giúp tiết kiệm thời gian'}
                  </p>

                  <div className="flex items-center justify-between mb-4">
                    <span className="text-lg font-bold" style={{ color: '#FFC700' }}>
                      {(() => {
                        if (!workflow.price || workflow.price === 'Miễn phí') return 'Miễn phí';
                        const priceValue = typeof workflow.price === 'number'
                          ? workflow.price
                          : parseFloat(workflow.price?.toString().replace(/[^\d.]/g, '') || '0');
                        return priceValue > 0 ? Math.round(priceValue).toLocaleString('vi-VN') + 'đ' : 'Miễn phí';
                      })()}
                    </span>
                    {workflow.category && (
                      <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded">
                        {workflow.category}
                      </span>
                    )}
                  </div>

                  <Link
                    to={`/workflows/${workflow.id}`}
                    className="btn text-white w-full py-2 rounded-lg text-sm"
                    style={{ background: 'linear-gradient(to right, #FFC700, #EAB308)' }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'linear-gradient(to right, #EAB308, #B45309)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'linear-gradient(to right, #FFC700, #EAB308)'}
                  >
                    Xem chi tiết
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {/* VPS Section removed by user request */}


    </>
  );
};

export default Home;