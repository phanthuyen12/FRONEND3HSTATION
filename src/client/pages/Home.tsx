import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { elearningService, userService, authService, workflowsService, vpsService } from "../../config";
import { Category, Course } from "../../services/elearningService";
import { User } from "../../services/userService";
import { Workflow } from "../../services/workflowsService";
import { VpsPlan } from "../../services/vpsService";

const Home: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [vpsPlans, setVpsPlans] = useState<VpsPlan[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingWorkflows, setLoadingWorkflows] = useState<boolean>(false);
  const [loadingVps, setLoadingVps] = useState<boolean>(false);
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

        // Load workflows cho slide
        try {
          setLoadingWorkflows(true);
          const workflowsData = await workflowsService.fetchClientWorkflows({ limit: 10 });
          setWorkflows(workflowsData.data || []);
        } catch (error) {
          console.error("Không thể tải workflows", error);
        } finally {
          setLoadingWorkflows(false);
        }

        // Load VPS plans cho slide
        try {
          setLoadingVps(true);
          const vpsData = await vpsService.fetchClientPlans();
          setVpsPlans(vpsData.slice(0, 8) || []);
        } catch (error) {
          console.error("Không thể tải VPS plans", error);
        } finally {
          setLoadingVps(false);
        }
        
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
    <div className="w-full max-w-full overflow-x-hidden">
      <div className="flex flex-col gap-8 mb-8">
        {/* Hero section tạo điểm nhấn */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-500 via-orange-500 to-rose-500 text-white shadow-2xl w-full">
          <div className="absolute inset-0 opacity-10 pointer-events-none overflow-hidden">
            <div className="absolute -right-32 -top-32 w-96 h-96 rounded-full bg-white blur-3xl" />
            <div className="absolute -left-40 bottom-0 w-[500px] h-[500px] rounded-full bg-amber-200 blur-3xl" />
          </div>
          <div className="relative px-6 py-8 md:px-12 md:py-12 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 lg:gap-8 w-full">
            <div className="flex-1 min-w-0 max-w-2xl z-10">
              <p className="inline-flex items-center px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-sm text-xs font-semibold uppercase tracking-wider mb-4 border border-white/30">
                <span className="mr-2 text-base">🔥</span> Học nhanh – Thực chiến – Dễ áp dụng
              </p>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
                Nền tảng học tập cho người làm sản phẩm số
              </h1>
              <p className="text-base md:text-lg text-white/95 mb-6 leading-relaxed">
                Khóa học, tài liệu và workflows tự động hoá được thiết kế dành riêng
                cho người đi làm, tối ưu thời gian nhưng vẫn đảm bảo chất lượng.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/courses"
                  className="btn bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold px-6 py-3 rounded-xl shadow-lg shadow-slate-900/40 transition-all hover:scale-105 whitespace-nowrap"
                >
                  Bắt đầu học ngay
                </Link>
                <Link
                  to="/workflows"
                  className="btn bg-white/20 hover:bg-white/30 text-sm font-semibold text-white border-2 border-white/40 rounded-xl px-6 py-3 backdrop-blur-sm transition-all hover:scale-105 whitespace-nowrap"
                >
                  Khám phá Workflows
                </Link>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 w-full lg:w-auto lg:min-w-[280px] lg:max-w-[320px] flex-shrink-0 z-10">
              <div className="rounded-2xl bg-white/20 backdrop-blur-md p-4 border border-white/30 shadow-lg">
                <p className="text-white/90 mb-2 text-xs font-medium">Khoá học đã đăng ký</p>
                <p className="text-3xl font-bold mb-2">{enrolledCourses}</p>
                <p className="text-[11px] text-white/80 leading-relaxed">
                  Tiếp tục lộ trình học mỗi ngày.
                </p>
              </div>
              <div className="rounded-2xl bg-white/20 backdrop-blur-md p-4 border border-white/30 shadow-lg">
                <p className="text-white/90 mb-2 text-xs font-medium">Khoá học đã hoàn thành</p>
                <p className="text-3xl font-bold mb-2">{completedCourses}</p>
                <p className="text-[11px] text-white/80 leading-relaxed">
                  Chúc mừng những thành tựu gần đây.
                </p>
              </div>
              <div className="rounded-2xl bg-white/20 backdrop-blur-md p-4 border border-white/30 shadow-lg col-span-2">
                <p className="text-white/90 mb-2 text-xs font-medium">Thư viện khoá học</p>
                <p className="text-2xl font-bold mb-2">{totalCourses}+</p>
                <p className="text-[11px] text-white/80 leading-relaxed">
                  Từ Lập trình, Thiết kế, Kinh doanh, Data, Marketing và nhiều hơn nữa.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards - Cải thiện design */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 grid-cols-2 gap-4 lg:gap-5 w-full">
          <div className="card bg-gradient-to-br from-amber-50 to-amber-100/50 dark:from-amber-900/20 dark:to-amber-800/10 border-2 border-amber-200 dark:border-amber-800/30 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="p-6 h-full flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center shadow-lg shadow-amber-500/30">
                  <i className="mgc_book_2_line text-2xl text-white"></i>
                </div>
              </div>
              <p className="text-[11px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider mb-3">
                Khoá học đã đăng ký
              </p>
              <h3 className="text-4xl font-extrabold mb-3 text-slate-900 dark:text-slate-100">{enrolledCourses}</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-auto leading-relaxed">
                Bạn đang theo học {enrolledCourses} khoá trong hệ thống.
              </p>
            </div>
          </div>
          
          <div className="card bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-800/10 border-2 border-blue-200 dark:border-blue-800/30 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="p-6 h-full flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-400 to-blue-500 flex items-center justify-center shadow-lg shadow-blue-500/30">
                  <i className="mgc_check_circle_line text-2xl text-white"></i>
                </div>
              </div>
              <p className="text-[11px] font-bold text-blue-700 dark:text-blue-400 uppercase tracking-wider mb-3">
                Khoá học đã hoàn thành
              </p>
              <h3 className="text-4xl font-extrabold mb-3 text-slate-900 dark:text-slate-100">{completedCourses}</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-auto leading-relaxed">
                Tiếp tục duy trì thói quen học mỗi ngày.
              </p>
            </div>
          </div>
          
          <div className="card bg-gradient-to-br from-sky-50 to-sky-100/50 dark:from-sky-900/20 dark:to-sky-800/10 border-2 border-sky-200 dark:border-sky-800/30 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="p-6 h-full flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-sky-400 to-sky-500 flex items-center justify-center shadow-lg shadow-sky-500/30">
                  <i className="mgc_book_open_line text-2xl text-white"></i>
                </div>
              </div>
              <p className="text-[11px] font-bold text-sky-700 dark:text-sky-400 uppercase tracking-wider mb-3">
                Tổng khoá học
              </p>
              <h3 className="text-4xl font-extrabold mb-3 text-slate-900 dark:text-slate-100">{totalCourses}</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-auto leading-relaxed">
                Nhiều chủ đề từ Lập trình, Thiết kế, Kinh doanh, Data, Marketing.
              </p>
            </div>
          </div>
          
          <div className="card bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-emerald-900/20 dark:to-emerald-800/10 border-2 border-emerald-200 dark:border-emerald-800/30 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="p-6 h-full flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                  <i className="mgc_wallet_line text-2xl text-white"></i>
                </div>
              </div>
              <p className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider mb-3">
                Số dư tài khoản
              </p>
              <h3 className="text-4xl font-extrabold mb-3 text-emerald-600 dark:text-emerald-400">
                {balance.toLocaleString('vi-VN')}₫
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-auto leading-relaxed">
                Số tiền hiện có trong tài khoản của bạn.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Phần Khóa học - Slide ngang với chiều cao cố định */}
      <div className="mb-10 w-full">
        <div className="mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-100 mb-4">
            Khóa học
          </h2>
          <div className="flex flex-wrap gap-3">
            {categoryNames.map((cat) => (
              <button
                key={cat}
                className={`px-4 py-2 rounded-xl text-sm font-semibold border-2 transition-all ${
                  activeCategory === cat
                    ? "bg-gradient-to-r from-amber-500 to-orange-500 border-amber-500 text-white shadow-lg shadow-amber-500/30 scale-105"
                    : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-slate-300"
                }`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="overflow-x-auto scrollbar-hide -mx-2 px-2">
            <div className="flex gap-4 pb-4 min-h-[380px]">
              {Array.from({ length: 3 }).map((_, idx) => (
                <div
                  key={idx}
                  className="flex-shrink-0 w-72 card h-[380px] animate-pulse bg-slate-50/60"
                >
                  <div className="h-40 bg-slate-200 rounded-t-xl" />
                  <div className="p-4 space-y-3">
                    <div className="h-4 bg-slate-200 rounded w-1/2" />
                    <div className="h-4 bg-slate-200 rounded w-full" />
                    <div className="h-4 bg-slate-200 rounded w-3/4" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="relative">
            <div className="overflow-x-auto scrollbar-hide -mx-2 px-2">
              <div className="flex gap-4 pb-4 min-h-[380px]" style={{ scrollSnapType: 'x mandatory' }}>
                {displayedCourses.map((course) => (
                  <div
                    key={course.id}
                    className="flex-shrink-0 w-72 card h-[380px] flex flex-col hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-slate-200 dark:border-slate-700 overflow-hidden group"
                    style={{ scrollSnapAlign: 'start' }}
                  >
                    <div className="relative overflow-hidden flex-shrink-0">
                      <img
                        src={course.thumbnail || course.thumbnail_url || "/images/placeholder.jpg"}
                        alt={course.title}
                        className="w-full h-40 object-cover transition-transform duration-300 group-hover:scale-110"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "/images/placeholder.jpg";
                        }}
                      />
                      <div className="absolute top-3 left-3">
                        <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm text-xs font-bold text-amber-600 uppercase shadow-sm">
                          {categories.find((c) => String(c.id) === String(course.category_id || course.categoryId))?.name || "Khóa học"}
                        </span>
                      </div>
                    </div>
                    <div className="flex-1 p-4 flex flex-col min-h-0">
                      <h4 className="text-sm font-bold mb-2 line-clamp-2 text-slate-900 dark:text-slate-100 leading-snug">
                        {course.title}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mb-3 line-clamp-2 leading-relaxed flex-shrink-0">
                        {course.short_description || course.description || ""}
                      </p>

                      <div className="flex items-center justify-between mb-2 text-[11px] text-slate-500 dark:text-slate-400 flex-shrink-0">
                        <span className="flex items-center gap-1">
                          <i className="mgc_time_line"></i>
                          {course.duration || "N/A"}
                        </span>
                        <span className="flex items-center gap-1">
                          <i className="mgc_book_2_line"></i>
                          {course.lessons || 0} bài học
                        </span>
                      </div>
                      <div className="flex items-center justify-between mb-3 text-[11px] text-slate-500 dark:text-slate-400 flex-shrink-0">
                        <span className="flex items-center gap-1">
                          <i className="mgc_user_line"></i>
                          {(course.students || 0).toLocaleString()} học viên
                        </span>
                        {course.rating && (
                          <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-amber-50 dark:bg-amber-900/20">
                            <i className="mgc_star_fill text-amber-400"></i>
                            <span className="font-semibold text-amber-600 dark:text-amber-400">
                              {typeof course.rating === 'number' ? course.rating.toFixed(1) : course.rating}
                            </span>
                          </span>
                        )}
                      </div>

                      <div className="mt-auto flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-700 flex-shrink-0">
                        <span className="text-primary font-bold text-sm">
                          {course.is_free || course.price === 0 || course.price === "0" || course.price === "Miễn phí" 
                            ? "Miễn phí" 
                            : (typeof course.price === 'number' 
                              ? `${course.price.toLocaleString('vi-VN')} VNĐ` 
                              : (typeof course.price === 'string' && !isNaN(parseFloat(course.price))
                                ? `${parseFloat(course.price).toLocaleString('vi-VN')} VNĐ`
                                : course.price || "Liên hệ"))}
                        </span>
                        <Link
                          to={`/courses/${course.id}`}
                          className="btn bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-4 py-1.5 rounded-xl text-xs font-semibold shadow-lg shadow-amber-500/30 transition-all hover:scale-105 whitespace-nowrap"
                        >
                          Đăng ký
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
                {displayedCourses.length === 0 && !loading && (
                  <div className="flex-shrink-0 w-72 card h-[380px] flex items-center justify-center">
                    <div className="p-6 text-center text-slate-500">
                      Không có khóa học nào.
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Slide Workflows */}
      {workflows.length > 0 && (
        <div className="mb-10 w-full">
          <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                Workflows nổi bật
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Tự động hóa quy trình làm việc của bạn
              </p>
            </div>
            <Link
              to="/workflows"
              className="text-sm text-primary hover:text-primary/80 font-semibold flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-primary/5 transition-colors"
            >
              Xem tất cả
              <i className="mgc_arrow_right_line"></i>
            </Link>
          </div>
          <div className="relative">
            <div className="overflow-x-auto scrollbar-hide -mx-2 px-2">
              <div className="flex gap-4 pb-4 min-h-[280px]" style={{ scrollSnapType: 'x mandatory' }}>
                {workflows.map((workflow) => (
                  <div
                    key={workflow.id}
                    className="flex-shrink-0 w-72 card h-[280px] flex flex-col hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-slate-200 dark:border-slate-700 overflow-hidden"
                    style={{ scrollSnapAlign: 'start' }}
                  >
                    <Link to={`/workflows/${workflow.id}`} className="block h-full flex flex-col">
                      <div className="relative h-32 bg-gradient-to-br from-purple-100 via-purple-50 to-blue-100 dark:from-purple-900/30 dark:via-purple-800/20 dark:to-blue-900/30 overflow-hidden flex-shrink-0">
                        {workflow.image ? (
                          <img
                            src={workflow.image}
                            alt={workflow.name}
                            className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-400 to-blue-400 flex items-center justify-center shadow-lg">
                              <i className="mgc_workflow_line text-4xl text-white" />
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="p-4 flex flex-col flex-1 min-h-0">
                        <h4 className="text-sm font-bold mb-2 line-clamp-2 text-slate-900 dark:text-slate-100 leading-snug">
                          {workflow.name}
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-3 line-clamp-2 leading-relaxed flex-shrink-0">
                          {workflow.description || ""}
                        </p>
                        <div className="mt-auto flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-700 flex-shrink-0">
                          <span className="text-primary font-bold text-sm">
                            {!workflow.price || workflow.price === "0" || workflow.price === "Miễn phí" || parseFloat(workflow.price) === 0
                              ? "Miễn phí"
                              : (typeof workflow.price === 'string' && !isNaN(parseFloat(workflow.price))
                                ? `${parseFloat(workflow.price).toLocaleString('vi-VN')} VNĐ`
                                : workflow.price)}
                          </span>
                          <span className="text-[11px] text-primary font-semibold flex items-center gap-1 whitespace-nowrap">
                            Xem chi tiết
                            <i className="mgc_arrow_right_line"></i>
                          </span>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Slide VPS */}
      {vpsPlans.length > 0 && (
        <div className="mb-10 w-full">
          <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                Gói VPS nổi bật
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Hạ tầng mạnh mẽ cho dự án của bạn
              </p>
            </div>
            <Link
              to="/vps"
              className="text-sm text-primary hover:text-primary/80 font-semibold flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-primary/5 transition-colors"
            >
              Xem tất cả
              <i className="mgc_arrow_right_line"></i>
            </Link>
          </div>
          <div className="relative">
            <div className="overflow-x-auto scrollbar-hide -mx-2 px-2">
              <div className="flex gap-4 pb-4 min-h-[320px]" style={{ scrollSnapType: 'x mandatory' }}>
                {vpsPlans.map((plan) => {
                  const getPlanPriceDisplay = () => {
                    const priceValue = typeof plan.price === 'number' 
                      ? plan.price 
                      : typeof plan.price === 'string' 
                      ? parseFloat(plan.price) || 0 
                      : 0;
                    
                    if (isNaN(priceValue) || priceValue <= 0) {
                      return "Liên hệ";
                    }
                    
                    return `${priceValue.toLocaleString('vi-VN')} VNĐ`;
                  };

                  return (
                    <div
                      key={plan.id}
                      className={`flex-shrink-0 w-72 card h-[320px] flex flex-col hover:shadow-lg transition-shadow overflow-hidden ${
                        plan.popular ? "border-primary/30 ring-1 ring-primary/10" : "border border-slate-200 dark:border-slate-700"
                      }`}
                      style={{ scrollSnapAlign: 'start' }}
                    >
                      <Link to={`/vps`} className="block h-full flex flex-col">
                        <div className="p-5 flex flex-col flex-1 min-h-0">
                          <div className="flex items-start justify-between gap-3 mb-3 flex-shrink-0">
                            <h4 className="text-base font-bold text-slate-900 dark:text-slate-100 flex-1 line-clamp-2">
                              {plan.name}
                            </h4>
                            {plan.popular && (
                              <span className="text-[10px] px-2 py-1 rounded-full bg-amber-100 text-amber-700 font-semibold uppercase whitespace-nowrap flex-shrink-0">
                                Phổ biến
                              </span>
                            )}
                          </div>
                          <div className="mb-4 flex-shrink-0">
                            <div className="flex items-baseline gap-2 mb-2">
                              <span className="font-bold text-2xl text-slate-900 dark:text-slate-100">
                                {getPlanPriceDisplay()}
                              </span>
                              <span className="text-xs text-slate-500 dark:text-slate-400">
                                / {plan.unit || "tháng"}
                              </span>
                            </div>
                          </div>
                          <div className="space-y-2 mb-4 text-xs flex-1 min-h-0">
                            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                              <span className="w-12 px-2 py-1 rounded bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-[10px] font-semibold uppercase flex-shrink-0">CPU</span>
                              <span className="font-medium truncate">{plan.cpu}</span>
                            </div>
                            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                              <span className="w-12 px-2 py-1 rounded bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-[10px] font-semibold uppercase flex-shrink-0">RAM</span>
                              <span className="font-medium truncate">{plan.ram}</span>
                            </div>
                            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                              <span className="w-12 px-2 py-1 rounded bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-[10px] font-semibold uppercase flex-shrink-0">SSD</span>
                              <span className="font-medium truncate">{plan.ssd}</span>
                            </div>
                            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                              <span className="w-16 px-2 py-1 rounded bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 text-[10px] font-semibold uppercase flex-shrink-0">Băng thông</span>
                              <span className="font-medium truncate">{plan.bandwidth}</span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-700 flex-shrink-0">
                            <span className="text-xs text-slate-400">
                              Xem chi tiết →
                            </span>
                            <span className="text-xs px-3 py-1 rounded-full bg-primary/10 text-primary font-medium whitespace-nowrap">
                              Chọn gói
                            </span>
                          </div>
                        </div>
                      </Link>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Home;
