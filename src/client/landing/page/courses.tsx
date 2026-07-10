import React, { useEffect, useMemo, useState } from 'react';
import FeatherIcon from 'feather-icons-react';
import parse from 'html-react-parser';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import HostingLayout from '../layouts/HostingLayout';
import { authService, elearningService, userService } from '../../../config';
import { Category, Course, LearningDashboard } from '../../../services/elearningService';

const fmt = (n: any) => {
  if (n === 0 || n === '0' || n === 'Miễn phí') return 'Miễn phí';
  const num = typeof n === 'string' ? parseFloat(n) : n;
  if (isNaN(num)) return 'Liên hệ';
  return `${num.toLocaleString('vi-VN')}đ`;
};

const pad2 = (n: number) => String(n).padStart(2, '0');

const fallbackImage = 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=800&auto=format&fit=crop&q=80';

const decodeHtml = (html: string) => {
  if (!html) return '';
  try {
    const txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
  } catch (e) {
    return html;
  }
};

const getLandingOrigin = () => {
  if (typeof window === 'undefined') {
    return 'https://academy.aetrading.vn';
  }

  const origin = window.location.origin;
  if (origin.includes('api.aetrading.vn')) {
    return origin.replace('api.aetrading.vn', 'academy.aetrading.vn');
  }

  return origin;
};

const getCardDescription = (course: Course) => {
  return (
    course.shortDescription ||
    course.short_description ||
    course.description ||
    'Đây là mô tả chi tiết cho khóa học thực chiến, cung cấp kiến thức từ cơ bản đến nâng cao.'
  );
};

const StatIcon = ({ icon }: { icon: string }) => (
  <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full border border-[#FBBF24]/45 bg-black/25 text-[#FBBF24] shadow-[0_0_34px_rgba(251,191,36,0.16)]">
    <FeatherIcon icon={icon} size={34} />
  </div>
);

const getCourseProgress = (item: any) => {
  const raw =
    item?.progress ??
    item?.completion_percent ??
    item?.completionPercentage ??
    item?.course?.progress ??
    item?.pivot?.progress ??
    0;
  const progress = Number(raw);
  if (Number.isNaN(progress)) return 0;
  return Math.min(100, Math.max(0, Math.round(progress)));
};

const isThisWeek = (value: any) => {
  if (!value) return false;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return false;

  const now = new Date();
  const start = new Date(now);
  start.setDate(now.getDate() - 7);
  return date >= start && date <= now;
};

const hasCertificate = (item: any) => {
  return Boolean(
    item?.certificate ||
    item?.certificate_url ||
    item?.certificate_issued_at ||
    item?.completed_at ||
    getCourseProgress(item) >= 100
  );
};

const HeroMetric = ({ icon, value, label, ring, percent = 0 }: { icon: string; value: string; label: string; ring?: boolean; percent?: number }) => {
  const deg = Math.round((Math.min(100, Math.max(0, percent)) / 100) * 360);

  return (
    <div className="group grid min-h-[108px] grid-cols-[60px_minmax(0,1fr)] items-center gap-4 rounded-[10px] border border-[#FBBF24]/18 bg-white/[0.035] px-4 py-4 shadow-[0_16px_42px_rgba(0,0,0,0.24)] transition-all hover:border-[#FBBF24]/42 hover:bg-white/[0.055] sm:px-5">
      <div className="flex items-center justify-center">
        {ring ? (
          <div
            className="flex h-[60px] w-[60px] shrink-0 items-center justify-center rounded-full p-[4px]"
            style={{ background: `conic-gradient(#FBBF24 0deg ${deg}deg, rgba(255,255,255,0.12) ${deg}deg 360deg)` }}
          >
            <div className="flex h-full w-full items-center justify-center rounded-full bg-[#0b0f0d] text-[13px] font-black text-white">
              {value}
            </div>
          </div>
        ) : (
          <div className="flex h-[60px] w-[60px] shrink-0 items-center justify-center rounded-full border border-[#FBBF24]/45 bg-black/25 text-[#FBBF24]">
            <FeatherIcon icon={icon} size={24} />
          </div>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-[28px] font-black leading-none text-white">{value}</div>
        <div className="mt-2 max-w-[13ch] text-[13px] font-medium leading-[1.35] text-gray-400 sm:max-w-none sm:text-sm">
          {label}
        </div>
      </div>
    </div>
  );
};

const CourseCard = ({ p, categories }: { p: Course; categories: Category[] }) => {
  const categoryName = categories.find(c => String(c.id) === String(p.category_id || p.categoryId))?.name || p.category || 'Khóa học MMO';
  const lessonCount = p.lessons || 11;
  const studentCount = p.students || 250;
  const canViewFull = Boolean(p.can_view_full);
  const isLocked = !canViewFull;
  const cardDescription = getCardDescription(p);

  const handleLockedClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Không block click nữa, cho phép vào trang chi tiết để xem thông tin khóa học
  };

  return (
    <article className={`group relative flex min-h-[430px] flex-col overflow-hidden rounded-[8px] border shadow-[0_18px_52px_rgba(0,0,0,0.32)] transition-all duration-500 before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-[#FBBF24]/60 before:to-transparent hover:-translate-y-1 hover:shadow-[0_24px_74px_rgba(251,191,36,0.11)] ${isLocked ? 'border-white/8 bg-[#07100f]' : 'border-[#FBBF24]/20 bg-[#080d0c] hover:border-[#FBBF24]/45'}`}>
      <Link to={`/landing-courses/${p.id}`} onClick={handleLockedClick} className="relative block h-40 overflow-hidden bg-[#111817]">
        <img
          src={p.thumbnail || p.thumbnail_url || fallbackImage}
          alt={p.title}
          className="h-full w-full object-cover opacity-80 transition-all duration-700 group-hover:scale-105 group-hover:opacity-95"
        />
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.04) 0%, rgba(0,0,0,0.22) 42%, rgba(5,7,6,0.92) 100%)' }}
        />
        <div className="absolute left-3 top-3 max-w-[calc(100%-24px)] truncate rounded-[6px] border border-[#FBBF24]/60 bg-black/55 px-2.5 py-1 text-[9px] font-black uppercase tracking-widest text-[#FBBF24] backdrop-blur-md">
          {categoryName}
        </div>
        {isLocked && (
          <div className="absolute right-3 top-3 rounded-[6px] border border-red-400/40 bg-red-500/20 px-2.5 py-1 text-[9px] font-black uppercase tracking-widest text-red-200 backdrop-blur-md">
            <FeatherIcon icon="lock" size={10} className="mr-1 inline" />
            Khóa theo Rank
          </div>
        )}
      </Link>

      <div className="flex flex-grow flex-col gap-3 p-4">
        <div className="flex-grow">
          <Link to={`/landing-courses/${p.id}`} onClick={handleLockedClick}>
            <h3 className="min-h-[40px] text-[15px] font-black leading-snug text-white transition-colors duration-300 line-clamp-2 group-hover:text-[#FBBF24]">
              {p.title}
            </h3>
          </Link>
          <div className="mt-2 line-clamp-3 text-[11px] leading-5 text-gray-400 [&_p]:m-0 [&_p]:inline [&_strong]:font-semibold [&_em]:italic [&_br]:hidden">
            {parse(decodeHtml(cardDescription))}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 text-[10px] font-medium text-gray-400">
          <div className="flex items-center gap-1">
            <FeatherIcon icon="star" size={12} className="text-amber-400" fill="currentColor" />
            <span>{p.rating || '4.20'}</span>
          </div>
          <div className="flex items-center justify-center gap-1">
            <FeatherIcon icon="book" size={12} />
            <span>{lessonCount} bài học</span>
          </div>
          <div className="flex items-center justify-end gap-1">
            <FeatherIcon icon="users" size={12} />
            <span>{studentCount}+</span>
          </div>
        </div>

        <div className="border-t border-[#FBBF24]/14 pt-3">
          <div className="flex items-center justify-between gap-3">
            <span className="text-[9px] font-black uppercase tracking-[2px] text-gray-500">Quyền truy cập</span>
            <span className={`text-[10px] font-black uppercase tracking-[2px] ${canViewFull ? 'text-emerald-400' : 'text-amber-400'}`}>
              {canViewFull ? 'Được phép xem' : 'Theo Rank'}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-[1fr_1.15fr] gap-2.5">
          <Link
            to={`/landing-courses/${p.id}`}
            onClick={handleLockedClick}
            className="flex h-10 items-center justify-center rounded-[8px] border border-[#FBBF24]/25 bg-black/20 text-[10px] font-black text-white transition-all hover:border-[#FBBF24]/70 hover:text-[#FBBF24]"
          >
            {isLocked ? 'Bị khóa' : 'Xem chi tiết'}
          </Link>
          <Link
            to={`/landing-courses/${p.id}`}
            onClick={handleLockedClick}
            className="flex h-10 items-center justify-center gap-2 rounded-[8px] bg-[#FBBF24] text-[10px] font-black text-black shadow-[0_10px_24px_rgba(251,191,36,0.2)] transition-all hover:bg-[#FDE047]"
          >
            {isLocked ? 'Liên hệ Admin' : <>Học ngay <FeatherIcon icon="arrow-right" size={13} /></>}
          </Link>
        </div>
      </div>
    </article>
  );
};

const LandingCoursesPage = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('Tất cả');
  const [search, setSearch] = useState('');
  const [userName, setUserName] = useState('Học viên');
  const [userRank, setUserRank] = useState('Chưa gán rank');
  const [myCourses, setMyCourses] = useState<any[]>([]);
  const [learningDashboard, setLearningDashboard] = useState<LearningDashboard | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [referralData, setReferralData] = useState<{
    refCode?: string | null;
    refCount?: number;
    refCommission?: number;
  }>({
    refCode: null,
    refCount: 0,
    refCommission: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [catsData, coursesData] = await Promise.all([
          elearningService.getClientCategories(),
          elearningService.getClientCourses({
            category: selectedCategory !== 'Tất cả' ? selectedCategory : undefined,
            search: search.trim() || undefined,
          }),
        ]);
        setCategories(catsData);
        setCourses(coursesData.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [selectedCategory, search]);

  useEffect(() => {
    const fetchUserData = async () => {
      const authenticated = authService.isAuthenticated();
      setIsLoggedIn(authenticated);

      if (!authenticated) {
        setMyCourses([]);
        setReferralData({
          refCode: null,
          refCount: 0,
          refCommission: 0,
        });
        return;
      }

      const [profile, dashboard, enrolledCourses, referrals] = await Promise.all([
        authService.getProfile().catch(() => null),
        elearningService.getLearningDashboard().catch(() => null),
        elearningService.getMyCourses().catch(() => []),
        userService.getMyReferrals({ limit: 5 }).catch(() => null),
      ]);

      const name = (profile as any)?.name || (profile as any)?.full_name || (profile as any)?.username || (profile as any)?.email;
      if (name) setUserName(String(name).split(' ')[0]);
      const rankName =
        dashboard?.account?.rank?.name ||
        dashboard?.account?.rank?.code ||
        (profile as any)?.rank?.name ||
        (profile as any)?.rank?.code ||
        (profile as any)?.rankName ||
        (profile as any)?.rank_name;
      if (rankName) setUserRank(String(rankName));
      setLearningDashboard(dashboard);
      const dashboardCourses: any[] = Array.isArray(dashboard?.enrolledCourses) ? (dashboard?.enrolledCourses || []) : [];
      setMyCourses(
        dashboardCourses.length
          ? dashboardCourses
          : Array.isArray(enrolledCourses)
            ? enrolledCourses
            : []
      );
      setReferralData({
        refCode: referrals?.refCode || null,
        refCount: Number(referrals?.refCount || 0),
        refCommission: Number(referrals?.refCommission || 0),
      });
    };

    fetchUserData();
  }, []);

  const referralLink = referralData.refCode
    ? `${getLandingOrigin()}/landing-register?ref=${encodeURIComponent(referralData.refCode)}`
    : '';

  const handleCopyReferralLink = async () => {
    if (!referralLink) {
      Swal.fire('Chưa có link ref', 'Bạn vui lòng đăng nhập để hệ thống tạo link giới thiệu.', 'info');
      return;
    }

    try {
      await navigator.clipboard.writeText(referralLink);
      Swal.fire({
        toast: true,
        position: 'bottom-end',
        icon: 'success',
        title: 'Đã sao chép link ref',
        showConfirmButton: false,
        timer: 1800,
      });
    } catch (error) {
      Swal.fire('Lỗi', 'Không thể sao chép link lúc này.', 'error');
    }
  };

  const userStats = useMemo(() => {
    if (learningDashboard?.stats) {
      return {
        learningCount: Number(learningDashboard.stats.inProgressCourses || 0),
        enrolledCount: Number(learningDashboard.stats.allowedCourses || learningDashboard.stats.registeredCourses || 0),
        avgProgress: Number(learningDashboard.stats.averageProgress || 0),
        certificateCount: Number(learningDashboard.stats.completedCourses || 0),
        newThisWeek: myCourses.filter(item => (
          isThisWeek(item?.created_at) ||
          isThisWeek(item?.createdAt) ||
          isThisWeek(item?.enrolled_at) ||
          isThisWeek(item?.enrolledAt) ||
          isThisWeek(item?.updated_at) ||
          isThisWeek(item?.updatedAt)
        )).length,
      };
    }

    const learningCourses = myCourses.filter(item => {
      const progress = getCourseProgress(item);
      return progress > 0 && progress < 100;
    });
    const completedCourses = myCourses.filter(hasCertificate);
    const progressValues = myCourses.map(getCourseProgress);
    const avgProgress = progressValues.length
      ? Math.round(progressValues.reduce((sum, value) => sum + value, 0) / progressValues.length)
      : 0;
    const newThisWeek = myCourses.filter(item => (
      isThisWeek(item?.created_at) ||
      isThisWeek(item?.createdAt) ||
      isThisWeek(item?.enrolled_at) ||
      isThisWeek(item?.enrolledAt) ||
      isThisWeek(item?.updated_at) ||
      isThisWeek(item?.updatedAt)
    )).length;

    return {
      learningCount: learningCourses.length,
      enrolledCount: myCourses.length,
      avgProgress,
      certificateCount: completedCourses.length,
      newThisWeek,
    };
  }, [myCourses]);

  const dashboardCards = [
    {
      label: 'Đang học',
      value: userStats.learningCount,
      note: userStats.newThisWeek > 0 ? `+${userStats.newThisWeek} khóa mới tuần này` : `${userStats.enrolledCount} khóa được cấp`,
      icon: 'book-open',
      dot: userStats.newThisWeek > 0 ? 'bg-emerald-500' : 'bg-gray-500',
    },
    {
      label: 'Khóa được cấp',
      value: userStats.enrolledCount,
      note: userStats.avgProgress > 0 ? `${userStats.avgProgress}% tiến độ trung bình` : 'Bắt đầu khóa đầu tiên',
      icon: 'layers',
      dot: userStats.enrolledCount > 0 ? 'bg-[#FBBF24]' : 'bg-gray-500',
    },
    {
      label: 'Chứng chỉ đã cấp',
      value: userStats.certificateCount,
      note: userStats.certificateCount > 0 ? 'Chúc mừng thành tích của bạn' : 'Hoàn thành khóa để nhận',
      icon: 'file-text',
      dot: userStats.certificateCount > 0 ? 'bg-emerald-500' : 'bg-gray-500',
    },
  ];

  return (
    <HostingLayout>
      <div className="min-h-screen bg-[#050706] text-white">
        <section className="bg-[#050706]">
          <div className="mx-auto w-full max-w-7xl px-4 pt-10 pb-6 md:px-6 md:pt-16 lg:px-8 lg:pt-20 lg:pb-8">
            <div className="relative overflow-hidden rounded-[8px] border border-[#FBBF24]/35 bg-[#080b09] p-6 shadow-[0_28px_100px_rgba(0,0,0,0.42),inset_0_1px_0_rgba(255,255,255,0.06)] md:p-10 lg:p-12">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_54%,rgba(251,191,36,0.28),transparent_34%),linear-gradient(110deg,rgba(255,255,255,0.035),transparent_38%)]" />
              <div className="absolute -bottom-24 left-[42%] h-72 w-[560px] rotate-[-12deg] rounded-full border-t border-[#FBBF24]/35 blur-[1px]" />
              <div className="absolute -bottom-16 left-[48%] h-52 w-[420px] rotate-[-12deg] rounded-full border-t border-[#FBBF24]/45 blur-[1px]" />

              <div className="relative z-10 grid gap-8 xl:grid-cols-[minmax(0,1fr)_420px] xl:items-center">
                <div className="max-w-3xl">
                  <div className="mb-8 inline-flex items-center gap-3 rounded-full border border-[#FBBF24]/55 bg-[#FBBF24]/10 px-4 py-2 text-[10px] font-black uppercase tracking-[2px] text-[#FBBF24]">
                    <FeatherIcon icon="grid" size={14} />
                    Dashboard
                  </div>
                  <h1 className="text-4xl font-black leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
                    Xin chào, <span className="text-[#FBBF24]">{userName}</span>
                  </h1>
                  <p className="mt-5 max-w-2xl text-sm font-medium leading-7 text-gray-400 sm:text-base">
                    Quản lý khóa học, theo dõi tiến độ học tập và nhận chứng chỉ trong một dashboard duy nhất.
                  </p>
                  <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-[#FBBF24]/35 bg-[#FBBF24]/10 px-4 py-2 text-[11px] font-black uppercase tracking-[2px] text-[#FBBF24]">
                    <FeatherIcon icon="award" size={14} />
                    Rank hiện tại: {userRank}
                  </div>

                  <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                    <a
                      href="#course-library"
                      className="inline-flex h-14 items-center justify-center gap-3 rounded-[8px] bg-[#FBBF24] px-8 text-sm font-black text-black shadow-[0_18px_44px_rgba(251,191,36,0.25)] transition-all hover:bg-[#FDE047]"
                    >
                      <FeatherIcon icon="play" size={18} /> Tiếp tục học
                    </a>
                    <a
                      href="#course-library"
                      className="inline-flex h-14 items-center justify-center gap-3 rounded-[8px] border border-[#FBBF24]/35 bg-black/25 px-8 text-sm font-black text-white transition-all hover:border-[#FBBF24]/70 hover:text-[#FBBF24]"
                    >
                      <FeatherIcon icon="compass" size={18} /> Khám phá khóa học
                    </a>
                  </div>
                </div>

                <div className="grid min-w-0 gap-3 sm:grid-cols-2 xl:grid-cols-1">
                  <HeroMetric icon="book-open" value={String(userStats.learningCount)} label="khóa đang học" />
                  <HeroMetric icon="activity" value={`${userStats.avgProgress}%`} label="tiến độ trung bình" ring percent={userStats.avgProgress} />
                  <HeroMetric icon="layers" value={String(userStats.enrolledCount)} label="khóa được cấp" />
                </div>
              </div>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-3 lg:gap-6">
              {dashboardCards.map((item) => (
                <div
                  key={item.label}
                  className="group relative overflow-hidden rounded-[8px] border border-[#FBBF24]/22 bg-[#08100f] p-6 shadow-[0_18px_58px_rgba(0,0,0,0.28)] transition-all hover:border-[#FBBF24]/45 hover:bg-[#0a1210]"
                >
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#FBBF24]/45 to-transparent" />
                  <FeatherIcon icon="chevron-right" size={18} className="absolute right-5 top-7 text-[#FBBF24]/65" />
                  <div className="flex items-center gap-6">
                    <StatIcon icon={item.icon} />
                    <div className="min-w-0">
                      <p className="text-[11px] font-black uppercase tracking-[1.4px] text-gray-400">{item.label}</p>
                      <div className="mt-2 text-5xl font-black leading-none text-white">{pad2(item.value)}</div>
                      <p className="mt-3 flex items-center gap-2 text-[12px] font-medium text-gray-400">
                        <span className={`h-2.5 w-2.5 rounded-full ${item.dot}`} />
                        {item.note}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
{/* 
            {isLoggedIn && (
            <div className="mt-5 rounded-[8px] border border-[#FBBF24]/22 bg-[#08100f] p-5 shadow-[0_18px_58px_rgba(0,0,0,0.28)] lg:p-6">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                <div className="min-w-0">
                  <div className="inline-flex items-center gap-2 rounded-full border border-[#FBBF24]/35 bg-[#FBBF24]/10 px-3 py-1 text-[10px] font-black uppercase tracking-[2px] text-[#FBBF24]">
                    <FeatherIcon icon="share-2" size={12} />
                    Khu vực referral
                  </div>
                  <h3 className="mt-3 text-2xl font-black tracking-tight text-white">Link ref và số ref của bạn</h3>
                  <p className="mt-2 text-sm font-medium text-gray-400">
                    Mời bạn bè đăng ký qua link riêng để theo dõi số lượng ref ngay trong tài khoản.
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-[160px_1fr] lg:min-w-[520px]">
                  <div className="rounded-[8px] border border-[#FBBF24]/18 bg-black/25 p-4">
                    <p className="text-[10px] font-black uppercase tracking-[2px] text-gray-500">Số ref</p>
                    <div className="mt-3 text-4xl font-black leading-none text-[#FBBF24]">{pad2(Number(referralData.refCount || 0))}</div>
                    <p className="mt-2 text-[11px] font-medium text-gray-400">
                      {referralData.refCode ? `Mã: ${referralData.refCode}` : 'Đang tạo mã ref cho tài khoản mới'}
                    </p>
                  </div>

                  <div className="rounded-[8px] border border-[#FBBF24]/18 bg-black/25 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-[10px] font-black uppercase tracking-[2px] text-gray-500">Link đăng ký ref</p>
                      <button
                        onClick={handleCopyReferralLink}
                        disabled={!referralLink}
                        className="inline-flex h-9 items-center justify-center gap-2 rounded-[8px] bg-[#FBBF24] px-4 text-[10px] font-black uppercase tracking-[2px] text-black transition-all hover:bg-[#FDE047] disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <FeatherIcon icon="copy" size={12} />
                        Copy
                      </button>
                    </div>
                    <div className="mt-3 rounded-[8px] border border-white/10 bg-[#050706] px-4 py-3 font-mono text-[11px] leading-6 text-gray-300">
                      {referralLink || `${getLandingOrigin()}/landing-register?ref=...`}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            )} */}
          </div>
        </section>

        <section id="course-library" className="mx-auto w-full max-w-7xl px-4 py-8 md:px-6 lg:px-8 lg:py-10">
          <div className="relative overflow-hidden rounded-[8px] border border-[#FBBF24]/22 bg-[#08100f] p-6 shadow-[0_20px_70px_rgba(0,0,0,0.3)] before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-[#FBBF24]/50 before:to-transparent lg:p-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              <div className="min-w-0">
                <h2 className="text-3xl font-black tracking-tight text-white">Khám phá khóa học</h2>
                <p className="mt-2 text-sm font-medium text-gray-400">
                  <span className="font-black text-white">{courses.length}</span> khóa học phù hợp với bạn
                </p>
              </div>

              <div className="grid w-full gap-3 sm:grid-cols-2 lg:w-[330px] lg:grid-cols-1">
                <div className="relative">
                  <FeatherIcon icon="search" size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Tìm khóa học..."
                    className="h-14 w-full rounded-[8px] border border-[#FBBF24]/18 bg-black/25 pl-12 pr-4 text-sm text-white transition-all placeholder:text-gray-500 focus:border-[#FBBF24]/55 focus:outline-none focus:ring-0"
                  />
                </div>
                <button className="flex h-14 items-center justify-between rounded-[8px] border border-[#FBBF24]/18 bg-black/25 px-4 text-sm font-bold text-gray-300 transition-all hover:border-[#FBBF24]/45 hover:text-[#FBBF24]">
                  <span className="flex items-center gap-3">
                    <FeatherIcon icon="trending-up" size={18} className="text-[#FBBF24]" />
                    Phổ biến nhất
                  </span>
                  <FeatherIcon icon="chevron-down" size={18} />
                </button>
              </div>
            </div>

            <div className="mt-6 flex max-w-4xl flex-wrap gap-3">
              <button
                onClick={() => setSelectedCategory('Tất cả')}
                className={`h-10 shrink-0 rounded-[8px] px-5 text-[12px] font-bold transition-all ${selectedCategory === 'Tất cả'
                  ? 'bg-[#FBBF24] text-black shadow-[0_10px_28px_rgba(251,191,36,0.22)]'
                  : 'border border-[#FBBF24]/18 bg-black/20 text-gray-400 hover:border-[#FBBF24]/45 hover:text-[#FBBF24]'
                  }`}
              >
                Tất cả
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(String(cat.id))}
                  className={`h-10 shrink-0 rounded-[8px] px-5 text-[12px] font-bold transition-all ${selectedCategory === String(cat.id)
                    ? 'bg-[#FBBF24] text-black shadow-[0_10px_28px_rgba(251,191,36,0.22)]'
                    : 'border border-[#FBBF24]/18 bg-black/20 text-gray-400 hover:border-[#FBBF24]/45 hover:text-[#FBBF24]'
                    }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-8">
            {loading ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="h-[500px] animate-pulse rounded-[8px] border border-[#FBBF24]/12 bg-[#08100f]" />
                ))}
              </div>
            ) : courses.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {courses.map((p) => <CourseCard key={p.id} p={p} categories={categories} />)}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center gap-5 rounded-[8px] border border-dashed border-[#FBBF24]/20 bg-[#08100f] py-24 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full border border-[#FBBF24]/35 bg-black/25 text-[#FBBF24]">
                  <FeatherIcon icon="layers" size={26} />
                </div>
                <p className="px-4 text-base font-black text-gray-300">Bạn vui lòng đăng nhập tài khoản để xem khoá học</p>
                <button
                  onClick={() => {
                    setSelectedCategory('Tất cả');
                    setSearch('');
                  }}
                  className="rounded-[8px] bg-[#FBBF24] px-5 py-3 text-[11px] font-black uppercase tracking-widest text-black transition-all hover:bg-[#FDE047]"
                >
                  Xóa bộ lọc
                </button>
              </div>
            )}
          </div>
        </section>
      </div>
    </HostingLayout>
  );
};

export default LandingCoursesPage;
