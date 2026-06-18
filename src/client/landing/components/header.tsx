import React, { useState, useEffect } from 'react';
import FeatherIcon from 'feather-icons-react';
import { useTheme } from '../context/ThemeContext';
import { authService } from '../../../config';
import { Link, useNavigate, useLocation } from 'react-router-dom';

// ── Mobile Bottom Nav ────────────────────────────────────────────────────────
const BottomNav = () => {
  const { isDark } = useTheme();
  const { pathname } = useLocation();

  const navItems = [
    { key: 'courses', icon: 'book-open', label: 'Khóa học', to: '/landing-courses', grad: 'from-[#FCD34D] to-[#F59E0B]', mColor: '#FCD34D' },
    { key: 'learning', icon: 'play-circle', label: 'Đang học', to: '/landing-my-courses', grad: 'from-[#FCD34D] to-[#F59E0B]', mColor: '#FCD34D' },
    { key: 'profile', icon: 'award', label: 'Thành tích', to: '/landing-profile', grad: 'from-[#FCD34D] to-[#F59E0B]', mColor: '#FCD34D' },
  ];

  return (
    <div className="fixed bottom-0 md:bottom-8 left-0 right-0 z-[100] transition-all duration-500">
      <div className="max-w-7xl mx-auto px-0 md:px-4 w-full">
        {/* Mobile View: Shopee Style (Icons Above Text) */}
        <div
          className="md:hidden flex items-center justify-around h-[70px] bg-[#0d1412] border-t border-white/[0.03] shadow-[0_-10px_40px_rgba(0,0,0,0.08)]"
        >
          {navItems.map((item) => {
            const isActive = pathname === item.to;
            return (
              <Link
                key={item.key}
                to={item.to}
                className="flex flex-col items-center justify-center gap-1 flex-1 py-1"
              >
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-2xl transition-all duration-300 ${isActive ? 'scale-110 -translate-y-1' : 'opacity-60'}`}
                  style={{ background: isActive ? `${item.mColor}15` : 'transparent' }}
                >
                  <FeatherIcon
                    icon={item.icon}
                    size={isActive ? 22 : 20}
                    style={{ color: isActive ? item.mColor : '#64748b' }}
                  />
                </div>
                <span
                  className={`text-[10px] font-black uppercase tracking-wider transition-all duration-300 ${isActive ? 'opacity-100' : 'opacity-50'}`}
                  style={{ color: isActive ? item.mColor : '#64748b' }}
                >
                  {item.key}
                </span>
              </Link>
            );
          })}
        </div>

        {/* Desktop View: Wide Feature Cards */}
        {/* <div
          className="hidden md:flex items-center justify-center gap-3 w-full"
        >
          {navItems.map((item) => {
            const isActive = pathname === item.to;
            return (
              <Link
                key={item.key}
                to={item.to}
                className={`relative flex items-center justify-center gap-3 px-6 h-12 flex-1 rounded-[10px] transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl group overflow-hidden ${isActive ? 'ring-2 ring-white/60 scale-[1.03] shadow-2xl z-10' : 'hover:scale-[1.01]'}`}
              >
                <div className={`absolute inset-0 bg-gradient-to-r ${item.grad} opacity-100`} />
                <div className="relative z-10 flex items-center gap-3">
                  <FeatherIcon
                    icon={item.icon}
                    size={17}
                    strokeWidth={2.5}
                    color="white"
                    className="text-force-white drop-shadow-md"
                  />
                  <span
                    className="text-[12px] font-black uppercase tracking-widest text-force-white drop-shadow-sm whitespace-nowrap"
                  >
                    {item.label}
                  </span>
                </div>
                <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-30">
                  <FeatherIcon
                    icon="star"
                    size={14}
                    fill="white"
                    color="white"
                    className="text-force-white"
                  />
                </div>
              </Link>
            );
          })}
        </div> */}
      </div>
    </div>
  );
};

// ── Header Component ─────────────────────────────────────────────────────────
const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [user, setUser] = useState<any>(null);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handleScroll, { passive: true });

    if (authService.isAuthenticated()) {
      authService.getProfile().then(setUser).catch(console.error);
    }
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    await authService.logout();
    setUser(null);
    navigate('/landing-login');
  };

  const isLoggedIn = !!user;
  const userRankLabel = user?.rank?.name || user?.rank?.code || user?.rankName || user?.rank_name || 'Chưa gán rank';

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50">
        {/* ── Top Header ── */}
        <div className="bg-gradient-to-r from-[#032030] to-[#FCD34D] dark:from-[#080d0c] dark:to-[#0a1411] border-b border-white/[0.03] py-1.5 md:py-2">
          <div className="max-w-7xl mx-auto px-4 md:px-6 flex items-center justify-between text-[10px] md:text-[11px] font-bold text-white/80">
            <div className="flex items-center gap-2 md:gap-4">
              <Link to="/landing-policy" className="hover:text-white transition-colors">Chính sách</Link>
              <span className="opacity-20">|</span>
              <Link to="/landing-faq" className="hover:text-white transition-colors">FAQ</Link>
              <span className="opacity-20">|</span>
              <Link to="/landing-contact" className="hover:text-white transition-colors">Liên Hệ</Link>
            </div>
            <div className="flex items-center gap-3 md:gap-5">
              <div className="flex items-center gap-1.5 cursor-pointer hover:text-white transition-colors">
                <div className="w-3.5 h-3.5 rounded-full overflow-hidden border border-white/20">
                  <img src="https://flagcdn.com/w20/vn.png" alt="VN" className="w-full h-full object-cover" />
                </div>
                <span>Vietnamese</span>
                <FeatherIcon icon="chevron-down" size={10} className="opacity-50" />
              </div>
              <div className="hidden sm:flex items-center gap-1.5 cursor-pointer hover:text-white transition-colors">
                <FeatherIcon icon="book-open" size={12} className="text-amber-400" />
                <span>Learning</span>
              </div>
              <div className="w-5 h-5 md:w-6 md:h-6 rounded-lg bg-[#0d1412]/10 flex items-center justify-center hover:bg-[#0d1412]/20 transition-all cursor-pointer">
                <FeatherIcon icon="settings" size={12} className="text-amber-400" />
              </div>
            </div>
          </div>
        </div>

        {/* ── Main Navbar ── */}
        <div
          className="transition-all duration-300 relative"
          style={{
            background: scrolled
              ? isDark ? 'rgba(6,10,9,0.95)' : 'rgba(255,255,255,0.97)'
              : isDark ? 'rgba(6,10,9,0.4)' : 'rgba(255,255,255,0.4)',
            boxShadow: scrolled
              ? isDark ? '0 1px 0 rgba(255,255,255,0.06), 0 8px 32px rgba(0,0,0,0.25)' : '0 1px 0 rgba(0,0,0,0.06), 0 4px 24px rgba(0,0,0,0.05)'
              : 'none',
            backdropFilter: 'blur(20px)',
          }}
        >
          <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-2 md:py-2.5 flex items-center justify-between gap-2">
            {/* Logo */}
            <Link to="/landing-courses" className="flex items-center shrink-0">
              <img src="/logo.png" alt="3H STATION" className="h-14 md:h-16 lg:h-[92px] w-auto object-contain" />
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1 xl:gap-2 h-full">
              <Link to="/landing-courses" className={`px-4 py-2 text-[12px] font-black uppercase tracking-widest transition-all duration-300 rounded-xl ${pathname === '/landing-courses' || pathname === '/' ? 'text-[#FCD34D] bg-[#FCD34D]/5' : 'text-gray-400 hover:text-[#FCD34D] hover:bg-white/5 dark:hover:bg-[#0d1412]/5'}`}>
                Trang học
              </Link>

              {/* Products Dropdown */}
              <div
                className="relative py-2 flex items-center"
                onMouseEnter={() => setActiveMenu('categories')}
                onMouseLeave={() => setActiveMenu(null)}
              >
                <button className={`flex items-center gap-1 xl:gap-1.5 px-4 h-10 text-[12px] font-black uppercase tracking-widest transition-all rounded-xl ${activeMenu === 'categories' ? 'text-[#FCD34D] bg-[#FCD34D]/5' : 'text-gray-400'}`}>
                  Khóa học <FeatherIcon icon="chevron-down" size={14} className={`opacity-50 transition-transform duration-300 ${activeMenu === 'categories' ? 'rotate-180 text-[#FCD34D]' : ''}`} />
                </button>

                {/* Menu Con: Sử dụng top-full và pt-2 để nối liền vùng hover */}
                <div
                  className={`absolute top-[90%] left-1/2 -translate-x-1/2 pt-3 transition-all duration-300 z-[100] ${activeMenu === 'categories' ? 'opacity-100 visible translate-y-0 pointer-events-auto' : 'opacity-0 invisible translate-y-2 pointer-events-none'
                    }`}
                >
                  <div className="w-[300px] bg-[#0d1412] rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-white/10 p-3 space-y-1">
                    <Link to="/landing-courses" className="flex items-center gap-4 p-3 rounded-xl hover:bg-sky-500/5 group/item transition-all">
                      <div className="w-11 h-11 rounded-xl bg-sky-500/10 flex items-center justify-center text-sky-500 transition-all group-hover/item:scale-110"><FeatherIcon icon="book-open" size={20} /></div>
                      <div>
                        <div className="text-[12px] font-black uppercase tracking-tight text-white group-hover/item:text-sky-500">Thư viện khóa học</div>
                        <div className="text-[10px] font-medium text-gray-400">Khám phá lộ trình học phù hợp</div>
                      </div>
                    </Link>
                    <Link to="/landing-my-courses" className="flex items-center gap-4 p-3 rounded-xl hover:bg-[#FCD34D]/5 group/item transition-all">
                      <div className="w-11 h-11 rounded-xl bg-[#FCD34D]/10 flex items-center justify-center text-[#FCD34D] transition-all group-hover/item:scale-110"><FeatherIcon icon="play-circle" size={20} /></div>
                      <div>
                        <div className="text-[12px] font-black uppercase tracking-tight text-white group-hover/item:text-[#FCD34D]">Khóa học của tôi</div>
                        <div className="text-[10px] font-medium text-gray-400">Tiếp tục bài học và tiến độ</div>
                      </div>
                    </Link>
                    <Link to="/landing-profile" className="flex items-center gap-4 p-3 rounded-xl hover:bg-emerald-500/5 group/item transition-all">
                      <div className="w-11 h-11 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 transition-all group-hover/item:scale-110"><FeatherIcon icon="award" size={20} /></div>
                      <div>
                        <div className="text-[12px] font-black uppercase tracking-tight text-white group-hover/item:text-emerald-500">Thành tích học tập</div>
                        <div className="text-[10px] font-medium text-gray-400">Hồ sơ, chứng chỉ và mục tiêu</div>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>

              {isLoggedIn && (
                <>
                  {/* Learning Dropdown */}
                  <div
                    className="relative py-2 flex items-center"
                    onMouseEnter={() => setActiveMenu('orders')}
                    onMouseLeave={() => setActiveMenu(null)}
                  >
                    <button className={`flex items-center gap-1 xl:gap-1.5 px-4 h-10 text-[12px] font-black uppercase tracking-widest transition-all rounded-xl ${activeMenu === 'orders' ? 'text-[#FCD34D] bg-[#FCD34D]/5' : 'text-gray-400 hover:text-[#FCD34D]'}`}>
                      Học Tập <FeatherIcon icon="chevron-down" size={14} className={`opacity-50 transition-transform duration-300 ${activeMenu === 'orders' ? 'rotate-180 text-[#FCD34D]' : ''}`} />
                    </button>

                    <div
                      className={`absolute top-[90%] left-1/2 -translate-x-1/2 pt-3 transition-all duration-300 z-[100] ${activeMenu === 'orders' ? 'opacity-100 visible translate-y-0 pointer-events-auto' : 'opacity-0 invisible translate-y-2 pointer-events-none'
                        }`}
                    >
                      <div className="w-[320px] bg-[#0d1412] rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-white/10 p-3 space-y-1">
                        <Link to="/landing-my-courses" className="flex items-center gap-4 p-3 rounded-xl hover:bg-[#FCD34D]/5 group/item transition-all">
                          <div className="w-11 h-11 rounded-xl bg-green-500/10 flex items-center justify-center text-green-500 transition-all group-hover/item:scale-110"><FeatherIcon icon="book-open" size={20} /></div>
                          <div className="flex-1">
                            <div className="text-[12px] font-black uppercase tracking-tight text-white group-hover/item:text-[#FCD34D]">Khóa học online</div>
                            <div className="text-[10px] font-medium text-gray-400">Xem bài giảng & tài liệu</div>
                          </div>
                        </Link>
                        <Link to="/landing-courses" className="flex items-center gap-4 p-3 rounded-xl hover:bg-sky-500/5 group/item transition-all">
                          <div className="w-11 h-11 rounded-xl bg-sky-500/10 flex items-center justify-center text-sky-500 transition-all group-hover/item:scale-110"><FeatherIcon icon="search" size={20} /></div>
                          <div className="flex-1">
                            <div className="text-[12px] font-black uppercase tracking-tight text-white group-hover/item:text-sky-500">Khám phá khóa học</div>
                            <div className="text-[10px] font-medium text-gray-400">Tìm khóa học mới để bắt đầu</div>
                          </div>
                        </Link>

                        <div className="h-[1px] bg-[#0d1412]/5 mx-2 my-2" />

                        <Link to="/landing-profile" className="flex items-center justify-between px-4 py-3 rounded-xl hover:bg-gray-100 dark:hover:bg-[#0d1412]/5 transition-colors group/link">
                          <div className="flex items-center gap-3">
                            <FeatherIcon icon="award" size={16} className="text-gray-400 group-hover/link:text-[#FCD34D]" />
                            <span className="text-[11px] font-black uppercase tracking-widest text-gray-400 group-hover/link:text-white dark:group-hover/link:text-white">Hồ sơ học tập</span>
                          </div>
                          <FeatherIcon icon="arrow-right" size={12} className="text-gray-300 opacity-0 group-hover/link:opacity-100 -translate-x-2 group-hover/link:translate-x-0 transition-all" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </>
              )}

              <Link to="/landing-faq" className="px-4 py-2 text-[12px] font-black uppercase tracking-widest text-gray-400 hover:text-[#FCD34D] hover:bg-white/5 dark:hover:bg-[#0d1412]/5 rounded-xl transition-all">
                Hỗ Trợ
              </Link>
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-2 shrink-0">
              {isLoggedIn ? (
                <div className="flex items-center gap-2">
                  <div
                    className="relative flex cursor-pointer items-center gap-2 border-l border-white/[0.06] py-1.5 pl-3"
                    onMouseEnter={() => setActiveMenu('profile')}
                    onMouseLeave={() => setActiveMenu(null)}
                  >
                    <div className={`h-8 w-8 shrink-0 overflow-hidden rounded-full border p-0.5 transition-all ${activeMenu === 'profile' ? 'border-[#FCD34D]/80' : 'border-[#FCD34D]/25'}`}>
                      <img src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=FCD34D&color=000`} className="w-full h-full object-cover rounded-full" alt="Avatar" />
                    </div>
                    <div className="hidden max-w-[118px] flex-col md:flex">
                      <span className={`truncate text-[11px] font-black uppercase leading-4 tracking-tight transition-colors ${activeMenu === 'profile' ? 'text-[#FCD34D]' : 'text-white'}`}>{user.name}</span>
                      <span className="text-[10px] font-black leading-3 text-[#FCD34D]">Rank: {userRankLabel}</span>
                    </div>

                    <div
                      className={`absolute right-0 top-full z-[100] pt-2 transition-all duration-300 ${activeMenu === 'profile' ? 'opacity-100 visible translate-y-0 pointer-events-auto' : 'opacity-0 invisible translate-y-2 pointer-events-none'
                        }`}
                    >
                      <div className="w-[210px] overflow-hidden rounded-[8px] border border-white/[0.06] bg-[#0b100f] py-2 shadow-[0_18px_48px_rgba(0,0,0,0.35)]">
                        <div className="mx-3 mb-1 border-b border-white/[0.05] px-2 py-2.5">
                          <div className="mb-1 text-[9px] font-black uppercase tracking-[1.5px] text-gray-400">Mã khách hàng</div>
                          <div className="truncate text-[11px] font-black text-white">USER_{user.id || 'N/A'}</div>
                          <div className="mt-2 text-[9px] font-black uppercase tracking-[1.5px] text-[#FCD34D]">Rank: {userRankLabel}</div>
                        </div>
                        <Link to="/landing-profile?tab=info" className="flex items-center gap-2.5 px-4 py-2 text-[10px] font-black uppercase tracking-tight text-gray-400 transition-colors hover:bg-white/[0.035] hover:text-[#FCD34D]">
                          <FeatherIcon icon="user" size={13} /> Hồ sơ cá nhân
                        </Link>
                        {user?.role === 'admin' && (
                          <Link to="/admin" target="_blank" className="flex items-center gap-2.5 px-4 py-2 text-[10px] font-black uppercase tracking-tight text-amber-500 transition-colors hover:bg-amber-500/10">
                            <FeatherIcon icon="shield" size={13} /> Quản trị Admin
                          </Link>
                        )}
                        <button onClick={handleLogout} className="flex w-full items-center gap-2.5 px-4 py-2 text-[10px] font-black uppercase tracking-tight text-red-500 transition-colors hover:bg-red-500/10">
                          <FeatherIcon icon="log-out" size={13} /> Đăng xuất
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link to="/landing-login" className="hidden sm:block text-xs font-black uppercase tracking-widest px-4 py-2 hover:text-[#FCD34D] transition-all" style={{ color: isDark ? '#D1D5DB' : '#374151' }}>
                    Đăng nhập
                  </Link>
                  <Link to="/landing-register" className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-widest px-5 py-2.5 rounded-xl transition-all duration-200 hover:-translate-y-px bg-[#FCD34D] text-black shadow-lg shadow-[#FCD34D]/20">
                    Tham gia ngay <FeatherIcon icon="arrow-right" size={14} color="white" />
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Bottom Nav (Mobile & Desktop) */}
      <BottomNav />
    </>
  );
};

export default Header;
