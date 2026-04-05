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
    { key: 'hosting', icon: 'globe', label: 'Hosting n8n', to: '/landing-vps', grad: 'from-[#00BA4A] to-[#00963C]', mColor: '#00BA4A' },
    { key: 'mmo', icon: 'book-open', label: 'Khóa học', to: '/landing-courses', grad: 'from-[#00BA4A] to-[#00963C]', mColor: '#00BA4A' },
    { key: 'ai', icon: 'zap', label: 'Workflows N8N', to: '/landing-workflows', grad: 'from-[#00BA4A] to-[#00963C]', mColor: '#00BA4A' },
    { key: 'tools', icon: 'command', label: 'Tool Marketing', to: '/landing-tools', grad: 'from-[#00BA4A] to-[#00963C]', mColor: '#00BA4A' },
  ];

  return (
    <div className="fixed bottom-0 md:bottom-8 left-0 right-0 z-[100] transition-all duration-500">
      <div className="max-w-7xl mx-auto px-0 md:px-4 w-full">
        {/* Mobile View: Shopee Style (Icons Above Text) */}
        <div
          className="md:hidden flex items-center justify-around h-[70px] bg-white border-t border-gray-100 shadow-[0_-10px_40px_rgba(0,0,0,0.08)]"
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
        <div
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
        </div>
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

  const fmt = (n: any) => {
    const num = typeof n === 'string' ? parseFloat(n) : n;
    if (isNaN(num)) return '0đ';
    return num.toLocaleString('vi-VN') + 'đ';
  };

  const isLoggedIn = !!user;

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50">
        {/* ── Top Header ── */}
        <div className="bg-gradient-to-r from-[#032030] to-[#00BA4A] dark:from-[#080d0c] dark:to-[#0a1411] border-b border-white/5 py-1.5 md:py-2">
          <div className="max-w-7xl mx-auto px-4 md:px-6 flex items-center justify-between text-[10px] md:text-[11px] font-bold text-white/80">
            <div className="flex items-center gap-2 md:gap-4">
              <a href="#" className="hover:text-white transition-colors">Chính sách</a>
              <span className="opacity-20">|</span>
              <a href="#" className="hover:text-white transition-colors">FAQ</a>
              <span className="opacity-20">|</span>
              <a href="#" className="hover:text-white transition-colors">Liên Hệ</a>
            </div>
            <div className="flex items-center gap-3 md:gap-5">
              <div className="flex items-center gap-1.5 cursor-pointer hover:text-white transition-colors">
                <div className="w-3.5 h-3.5 rounded-full overflow-hidden border border-white/20">
                  <img src="https://flagcdn.com/w20/vn.png" alt="VN" className="w-full h-full object-cover" />
                </div>
                <span>Vietnamese</span>
                <FeatherIcon icon="chevron-down" size={10} className="opacity-50" />
              </div>
              <div className="flex items-center gap-1.5 cursor-pointer hover:text-white transition-colors">
                <FeatherIcon icon="database" size={12} className="text-amber-400" />
                <span>VND</span>
                <FeatherIcon icon="chevron-down" size={10} className="opacity-50" />
              </div>
              <div className="w-5 h-5 md:w-6 md:h-6 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all cursor-pointer">
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
            <Link to="/" className="flex items-center gap-2 md:gap-2.5 shrink-0">
              <div className="w-8 h-8 md:w-9 md:h-9 rounded-full flex items-center justify-center shrink-0" style={{ background: '#00BA4A' }}>
                <FeatherIcon icon="zap" size={16} style={{ color: '#fff' }} fill="white" />
              </div>
              <span className="text-[17px] md:text-xl font-black tracking-tight whitespace-nowrap" style={{ color: isDark ? '#fff' : '#0B0B0B' }}>
                3H<span style={{ color: '#00BA4A' }}>STATION</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1 xl:gap-2 h-full">
              <Link to="/" className={`px-4 py-2 text-[12px] font-black uppercase tracking-widest transition-all duration-300 rounded-xl ${pathname === '/' ? 'text-[#00BA4A] bg-[#00BA4A]/5' : 'text-gray-500 hover:text-[#00BA4A] hover:bg-gray-50 dark:hover:bg-white/5'}`}>
                Trang Chủ
              </Link>

              {/* Products Dropdown */}
              <div
                className="relative py-2 flex items-center"
                onMouseEnter={() => setActiveMenu('categories')}
                onMouseLeave={() => setActiveMenu(null)}
              >
                <button className={`flex items-center gap-1 xl:gap-1.5 px-4 h-10 text-[12px] font-black uppercase tracking-widest transition-all rounded-xl ${activeMenu === 'categories' ? 'text-[#00BA4A] bg-[#00BA4A]/5' : 'text-gray-500'}`}>
                  Danh Mục <FeatherIcon icon="chevron-down" size={14} className={`opacity-50 transition-transform duration-300 ${activeMenu === 'categories' ? 'rotate-180 text-[#00BA4A]' : ''}`} />
                </button>

                {/* Menu Con: Sử dụng top-full và pt-2 để nối liền vùng hover */}
                <div
                  className={`absolute top-[90%] left-1/2 -translate-x-1/2 pt-3 transition-all duration-300 z-[100] ${activeMenu === 'categories' ? 'opacity-100 visible translate-y-0 pointer-events-auto' : 'opacity-0 invisible translate-y-2 pointer-events-none'
                    }`}
                >
                  <div className="w-[300px] bg-white dark:bg-[#0d1412] rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-gray-100 dark:border-white/10 p-3 space-y-1">
                    <Link to="/landing-vps" className="flex items-center gap-4 p-3 rounded-xl hover:bg-[#00BA4A]/5 group/item transition-all">
                      <div className="w-11 h-11 rounded-xl bg-green-500/10 flex items-center justify-center text-green-500 transition-all group-hover/item:scale-110"><FeatherIcon icon="server" size={20} /></div>
                      <div>
                        <div className="text-[12px] font-black uppercase tracking-tight text-gray-900 dark:text-white group-hover/item:text-[#00BA4A]">Cloud VPS</div>
                        <div className="text-[10px] font-medium text-gray-400">Server tốc độ cao, uptime 99.9%</div>
                      </div>
                    </Link>

                    <Link to="/landing-courses" className="flex items-center gap-4 p-3 rounded-xl hover:bg-sky-500/5 group/item transition-all">
                      <div className="w-11 h-11 rounded-xl bg-sky-500/10 flex items-center justify-center text-sky-500 transition-all group-hover/item:scale-110"><FeatherIcon icon="book-open" size={20} /></div>
                      <div>
                        <div className="text-[12px] font-black uppercase tracking-tight text-gray-900 dark:text-white group-hover/item:text-sky-500">Khóa học MMO</div>
                        <div className="text-[10px] font-medium text-gray-400">Đào tạo kinh doanh online</div>
                      </div>
                    </Link>
                    <Link to="/landing-workflows" className="flex items-center gap-4 p-3 rounded-xl hover:bg-purple-500/5 group/item transition-all">
                      <div className="w-11 h-11 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-500 transition-all group-hover/item:scale-110"><FeatherIcon icon="zap" size={20} /></div>
                      <div>
                        <div className="text-[12px] font-black uppercase tracking-tight text-gray-900 dark:text-white group-hover/item:text-purple-500">Automation AI</div>
                        <div className="text-[10px] font-medium text-gray-400">Quy trình tự động hóa</div>
                      </div>
                    </Link>
                    <Link to="/landing-tools" className="flex items-center gap-4 p-3 rounded-xl hover:bg-amber-500/5 group/item transition-all">
                      <div className="w-11 h-11 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500 transition-all group-hover/item:scale-110"><FeatherIcon icon="command" size={20} /></div>
                      <div>
                        <div className="text-[12px] font-black uppercase tracking-tight text-gray-900 dark:text-white group-hover/item:text-amber-500">MMO Tools</div>
                        <div className="text-[10px] font-medium text-gray-400">Phần mềm hỗ trợ MMO</div>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>

              {isLoggedIn && (
                <>
                  {/* Orders Dropdown - Reimagined as "My Services" */}
                  <div
                    className="relative py-2 flex items-center"
                    onMouseEnter={() => setActiveMenu('orders')}
                    onMouseLeave={() => setActiveMenu(null)}
                  >
                    <button className={`flex items-center gap-1 xl:gap-1.5 px-4 h-10 text-[12px] font-black uppercase tracking-widest transition-all rounded-xl ${activeMenu === 'orders' ? 'text-[#00BA4A] bg-[#00BA4A]/5' : 'text-gray-500 hover:text-[#00BA4A]'}`}>
                      Đơn Hàng <FeatherIcon icon="chevron-down" size={14} className={`opacity-50 transition-transform duration-300 ${activeMenu === 'orders' ? 'rotate-180 text-[#00BA4A]' : ''}`} />
                    </button>

                    <div
                      className={`absolute top-[90%] left-1/2 -translate-x-1/2 pt-3 transition-all duration-300 z-[100] ${activeMenu === 'orders' ? 'opacity-100 visible translate-y-0 pointer-events-auto' : 'opacity-0 invisible translate-y-2 pointer-events-none'
                        }`}
                    >
                      <div className="w-[320px] bg-white dark:bg-[#0d1412] rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-gray-100 dark:border-white/10 p-3 space-y-1">
                        <Link to="/landing-my-courses" className="flex items-center gap-4 p-3 rounded-xl hover:bg-[#00BA4A]/5 group/item transition-all">
                          <div className="w-11 h-11 rounded-xl bg-green-500/10 flex items-center justify-center text-green-500 transition-all group-hover/item:scale-110"><FeatherIcon icon="book-open" size={20} /></div>
                          <div className="flex-1">
                            <div className="text-[12px] font-black uppercase tracking-tight text-gray-900 dark:text-white group-hover/item:text-[#00BA4A]">Khóa học online</div>
                            <div className="text-[10px] font-medium text-gray-400">Xem bài giảng & tài liệu</div>
                          </div>
                        </Link>
                        <Link to="/landing-software-management" className="flex items-center gap-4 p-3 rounded-xl hover:bg-sky-500/5 group/item transition-all">
                          <div className="w-11 h-11 rounded-xl bg-sky-500/10 flex items-center justify-center text-sky-500 transition-all group-hover/item:scale-110"><FeatherIcon icon="key" size={20} /></div>
                          <div className="flex-1">
                            <div className="text-[12px] font-black uppercase tracking-tight text-gray-900 dark:text-white group-hover/item:text-sky-500">Quản lý Software</div>
                            <div className="text-[10px] font-medium text-gray-400">Quản lý key & bản quyền</div>
                          </div>
                        </Link>
                        <Link to="/landing-vps-management" className="flex items-center gap-4 p-3 rounded-xl hover:bg-amber-500/5 group/item transition-all">
                          <div className="w-11 h-11 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500 transition-all group-hover/item:scale-110"><FeatherIcon icon="server" size={20} /></div>
                          <div className="flex-1">
                            <div className="text-[12px] font-black uppercase tracking-tight text-gray-900 dark:text-white group-hover/item:text-amber-500">Cloud VPS</div>
                            <div className="text-[10px] font-medium text-gray-400">Điều khiển & gia hạn Server</div>
                          </div>
                        </Link>
                        <Link to="/landing-my-workflows" className="flex items-center gap-4 p-3 rounded-xl hover:bg-purple-500/5 group/item transition-all">
                          <div className="w-11 h-11 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-500 transition-all group-hover/item:scale-110"><FeatherIcon icon="zap" size={20} /></div>
                          <div className="flex-1">
                            <div className="text-[12px] font-black uppercase tracking-tight text-gray-900 dark:text-white group-hover/item:text-purple-500">Quy trình n8n</div>
                            <div className="text-[10px] font-medium text-gray-400">Automation AI và MMO</div>
                          </div>
                        </Link>

                        <div className="h-[1px] bg-gray-100 dark:bg-white/5 mx-2 my-2" />

                        <Link to="/landing-profile?tab=orders" className="flex items-center justify-between px-4 py-3 rounded-xl hover:bg-gray-100 dark:hover:bg-white/5 transition-colors group/link">
                          <div className="flex items-center gap-3">
                            <FeatherIcon icon="list" size={16} className="text-gray-400 group-hover/link:text-[#00BA4A]" />
                            <span className="text-[11px] font-black uppercase tracking-widest text-gray-400 group-hover/link:text-gray-900 dark:group-hover/link:text-white">Toàn bộ đơn hàng</span>
                          </div>
                          <FeatherIcon icon="arrow-right" size={12} className="text-gray-300 opacity-0 group-hover/link:opacity-100 -translate-x-2 group-hover/link:translate-x-0 transition-all" />
                        </Link>
                      </div>
                    </div>
                  </div>

                  {/* Deposit Dropdown */}
                  <div
                    className="relative py-2 flex items-center"
                    onMouseEnter={() => setActiveMenu('recharge')}
                    onMouseLeave={() => setActiveMenu(null)}
                  >
                    <button className={`flex items-center gap-1 xl:gap-1.5 px-4 h-10 text-[12px] font-black uppercase tracking-widest transition-all rounded-xl ${activeMenu === 'recharge' ? 'text-[#00BA4A] bg-[#00BA4A]/5' : 'text-gray-500'}`}>
                      Nạp Tiền <FeatherIcon icon="chevron-down" size={14} className={`opacity-50 transition-transform duration-300 ${activeMenu === 'recharge' ? 'rotate-180 text-[#00BA4A]' : ''}`} />
                    </button>

                    <div
                      className={`absolute top-[90%] left-1/2 -translate-x-1/2 pt-3 transition-all duration-300 z-[100] ${activeMenu === 'recharge' ? 'opacity-100 visible translate-y-0 pointer-events-auto' : 'opacity-0 invisible translate-y-2 pointer-events-none'
                        }`}
                    >
                      <div className="w-[280px] bg-white dark:bg-[#0d1412] rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-gray-100 dark:border-white/10 p-2 space-y-0.5">
                        <Link to="/landing-recharge?pay=recharge-bank" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 text-[11px] font-black uppercase tracking-widest text-gray-400 hover:text-[#00BA4A] transition-colors">
                          <FeatherIcon icon="credit-card" size={16} /> Nạp ngân hàng
                        </Link>
                        <div className="h-[1px] bg-gray-100 dark:bg-white/5 mx-2 my-1" />
                        <Link to="/landing-recharge?pay=recharge-crypto" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 text-[11px] font-black uppercase tracking-widest text-gray-400 hover:text-[#00BA4A] transition-colors">
                          <FeatherIcon icon="cpu" size={16} /> Nạp Crypto
                        </Link>
                      </div>
                    </div>
                  </div>
                </>
              )}

              <Link to="/support" className="px-4 py-2 text-[12px] font-black uppercase tracking-widest text-gray-500 hover:text-[#00BA4A] hover:bg-gray-50 dark:hover:bg-white/5 rounded-xl transition-all">
                Hỗ Trợ
              </Link>
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-2 md:gap-4 shrink-0">
              {isLoggedIn ? (
                <div className="flex items-center gap-3 lg:gap-4">
                  <div
                    className="flex items-center gap-3 pl-4 border-l border-gray-200 dark:border-white/10 cursor-pointer relative py-2"
                    onMouseEnter={() => setActiveMenu('profile')}
                    onMouseLeave={() => setActiveMenu(null)}
                  >
                    <div className={`w-9 h-9 rounded-full overflow-hidden border-2 p-0.5 transition-all ${activeMenu === 'profile' ? 'border-[#00BA4A]' : 'border-[#00BA4A]/20'}`}>
                      <img src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=00BA4A&color=fff`} className="w-full h-full object-cover rounded-full" alt="Avatar" />
                    </div>
                    <div className="hidden md:flex flex-col">
                      <span className={`text-[12px] font-black uppercase tracking-tight transition-colors ${activeMenu === 'profile' ? 'text-[#00BA4A]' : 'text-gray-900 dark:text-white'}`}>{user.name}</span>
                      <span className="text-[12px] font-black text-[#00BA4A] tracking-tighter">{fmt(user.balance || 0)}</span>
                    </div>

                    <div
                      className={`absolute top-[90%] right-0 pt-3 transition-all duration-300 z-[100] ${activeMenu === 'profile' ? 'opacity-100 visible translate-y-0 pointer-events-auto' : 'opacity-0 invisible translate-y-2 pointer-events-none'
                        }`}
                    >
                      <div className="w-56 bg-white dark:bg-[#0d1412] rounded-[10px] shadow-2xl border border-gray-100 dark:border-white/10 py-3">
                        <div className="px-5 py-3 mb-2 border-b dark:border-white/5">
                          <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Mã khách hàng</div>
                          <div className="text-xs font-black dark:text-white">USER_{user.id || 'N/A'}</div>
                        </div>
                        <Link to="/landing-profile?tab=info" className="flex items-center gap-3 px-5 py-2.5 text-[11px] font-black text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-[#00BA4A] uppercase tracking-tight transition-colors">
                          <FeatherIcon icon="user" size={14} /> Hồ sơ cá nhân
                        </Link>
                        {user?.role === 'admin' && (
                          <Link to="/admin" target="_blank" className="flex items-center gap-3 px-5 py-2.5 text-[11px] font-black text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-500/10 uppercase tracking-tight transition-colors">
                            <FeatherIcon icon="shield" size={14} /> Quản trị Admin
                          </Link>
                        )}
                        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-5 py-2.5 text-[11px] font-black text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 uppercase tracking-tight transition-colors">
                          <FeatherIcon icon="log-out" size={14} /> Đăng xuất
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link to="/landing-login" className="hidden sm:block text-xs font-black uppercase tracking-widest px-4 py-2 hover:text-[#00BA4A] transition-all" style={{ color: isDark ? '#D1D5DB' : '#374151' }}>
                    Đăng nhập
                  </Link>
                  <Link to="/landing-register" className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-widest px-5 py-2.5 rounded-xl transition-all duration-200 hover:-translate-y-px bg-[#00BA4A] text-force-white shadow-lg shadow-[#00BA4A]/20">
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