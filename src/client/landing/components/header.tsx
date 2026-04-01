import React, { useState, useEffect } from 'react';
import FeatherIcon from 'feather-icons-react';
import { useTheme } from '../context/ThemeContext';

// ── Mobile Bottom Nav ────────────────────────────────────────────────────────
const MobileBottomNav = () => {
  const [active, setActive] = useState('home');
  const { isDark, toggleTheme } = useTheme();

  const navItems = [
    { key: 'home',    icon: 'home',          label: 'Trang Chủ' },
    { key: 'content', icon: 'layers',         label: 'Nội Dung'  },
    { key: 'buy',     icon: 'shopping-bag',   label: 'Mua Ngay'  },
    { key: 'commit',  icon: 'check-circle',   label: 'Cam Kết'   },
    { key: 'faq',     icon: 'message-circle', label: 'Hỏi Đáp'  },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50">
      <div
        className="px-1 py-2 flex items-center justify-around transition-colors duration-500"
        style={{
          background: isDark ? 'rgba(8,13,12,0.97)' : 'rgba(255,255,255,0.98)',
          borderTop: isDark ? '1px solid rgba(255,255,255,0.07)' : '1px solid rgba(0,80,40,0.08)',
          backdropFilter: 'blur(24px)',
          boxShadow: isDark
            ? '0 -8px 40px rgba(0,0,0,0.7)'
            : '0 -4px 24px rgba(0,80,40,0.06)',
        }}
      >
        {navItems.map((item) => {
          const isActive = active === item.key;
          return (
            <button
              key={item.key}
              onClick={() => setActive(item.key)}
              className="relative flex flex-col items-center gap-1 flex-1 py-2 group transition-all duration-300"
            >
              {isActive && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-[2px] rounded-full bg-[#00BA4A]" />
              )}
              <div
                className={`flex items-center justify-center w-9 h-9 rounded-xl transition-all duration-300 ${
                  isActive ? 'scale-110' : ''
                }`}
                style={{ background: isActive ? 'rgba(0,186,74,0.1)' : 'transparent' }}
              >
                <FeatherIcon
                  icon={item.icon}
                  size={20}
                  strokeWidth={isActive ? 2.5 : 1.8}
                  style={{ color: isActive ? '#00BA4A' : isDark ? '#6b7280' : '#6B7280' }}
                />
              </div>
              <span
                className="text-[8px] font-bold uppercase tracking-[0.08em] leading-none transition-colors duration-300"
                style={{ color: isActive ? '#00BA4A' : isDark ? '#6b7280' : '#9CA3AF' }}
              >
                {item.label}
              </span>
            </button>
          );
        })}

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="relative flex flex-col items-center gap-1 flex-1 py-2 group"
        >
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110"
            style={{
              background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,186,74,0.08)',
              border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,186,74,0.15)',
            }}
          >
            <FeatherIcon
              icon={isDark ? 'sun' : 'moon'}
              size={18}
              style={{ color: isDark ? '#facc15' : '#374151' }}
            />
          </div>
          <span
            className="text-[8px] font-bold uppercase tracking-[0.08em] leading-none"
            style={{ color: isDark ? '#6b7280' : '#9CA3AF' }}
          >
            {isDark ? 'Sáng' : 'Tối'}
          </span>
        </button>
      </div>
    </div>
  );
};

// ── Nav Link ─────────────────────────────────────────────────────────────────
const NavLink = ({ label, active, isDark }: { label: string; active?: boolean; isDark: boolean }) => (
  <a
    href="#"
    className="flex items-center gap-1 text-sm font-semibold transition-all duration-200 hover:text-[#00BA4A] group"
    style={{ color: active ? '#00BA4A' : isDark ? '#D1D5DB' : '#111827' }}
  >
    {label}
  </a>
);

// ── Header ───────────────────────────────────────────────────────────────────
const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const { isDark, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          background: scrolled
            ? isDark
              ? 'rgba(6,10,9,0.95)'
              : 'rgba(255,255,255,0.97)'
            : 'transparent',
          boxShadow: scrolled
            ? isDark
              ? '0 1px 0 rgba(255,255,255,0.06), 0 8px 32px rgba(0,0,0,0.25)'
              : '0 1px 0 rgba(0,0,0,0.06), 0 4px 24px rgba(0,0,0,0.05)'
            : 'none',
          backdropFilter: scrolled ? 'blur(20px)' : 'none',
        }}
      >
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8 py-4 flex items-center justify-between">
          {/* ── Logo ── */}
          <a href="#" className="flex items-center gap-2.5">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center"
              style={{ background: '#00BA4A' }}
            >
              <FeatherIcon icon="zap" size={18} style={{ color: '#fff' }} fill="white" />
            </div>
            <span
              className="text-xl font-black tracking-tight"
              style={{ color: isDark ? '#fff' : '#0B0B0B' }}
            >
              3H<span style={{ color: '#00BA4A' }}>STATION</span>
            </span>
          </a>

          {/* ── Desktop Nav ── */}
          <nav className="hidden lg:flex items-center gap-8">
            <NavLink label="Trang Chủ" active isDark={isDark} />
            <NavLink label="Dịch Vụ" isDark={isDark} />
            <NavLink label="Khóa Học" isDark={isDark} />
            <NavLink label="Sản Phẩm MMO" isDark={isDark} />
            <NavLink label="Liên Hệ" isDark={isDark} />
          </nav>

          {/* ── Right Actions ── */}
          <div className="flex items-center gap-3">
            {/* Theme toggle pill */}
            <button
              onClick={toggleTheme}
              className="hidden sm:flex relative w-14 h-7 rounded-full border items-center px-0.5 cursor-pointer transition-all duration-400"
              style={{
                background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,186,74,0.08)',
                borderColor: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,186,74,0.2)',
              }}
              aria-label="Chuyển giao diện"
            >
              <FeatherIcon icon="moon" size={10} className="absolute left-1.5 opacity-50" style={{ color: '#60A5FA' }} />
              <FeatherIcon icon="sun"  size={10} className="absolute right-1.5 opacity-50" style={{ color: '#F59E0B' }} />
              <span
                className="relative z-10 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-400 shadow-sm"
                style={{
                  transform: isDark ? 'translateX(0px)' : 'translateX(28px)',
                  background: isDark ? '#1e3a5f' : '#ffffff',
                  boxShadow: isDark ? '0 2px 8px rgba(0,0,0,0.5)' : '0 1px 6px rgba(0,80,40,0.18)',
                }}
              >
                <FeatherIcon icon={isDark ? 'moon' : 'sun'} size={12} style={{ color: isDark ? '#93C5FD' : '#F59E0B' }} />
              </span>
            </button>

            {/* Login */}
            <button
              className="hidden sm:block text-sm font-semibold px-4 py-2 rounded-lg transition-all duration-200"
              style={{ color: isDark ? '#D1D5DB' : '#374151' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#00BA4A')}
              onMouseLeave={(e) => (e.currentTarget.style.color = isDark ? '#D1D5DB' : '#374151')}
            >
              Đăng nhập
            </button>

            {/* CTA — inspired by unifato green rounded button with arrow */}
            <button
              className="flex items-center gap-1.5 text-sm font-bold px-5 py-2.5 rounded-[10px] transition-all duration-200 hover:-translate-y-px"
              style={{
                background: '#00BA4A',
                color: '#fff',
                boxShadow: '0 4px 14px rgba(0,186,74,0.3)',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 6px 20px rgba(0,186,74,0.45)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 4px 14px rgba(0,186,74,0.3)';
              }}
            >
              Sở hữu ngay
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 12L12 2M12 2H5M12 2V9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Nav */}
      <MobileBottomNav />
    </>
  );
};

export default Header;
