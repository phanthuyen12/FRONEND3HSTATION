import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

const Footer = () => {
  const { isDark } = useTheme();

  const quickLinks = [
    { label: 'Khóa học', to: '/landing-courses' },
    { label: 'Trung tâm hỗ trợ', to: '/landing-faq' },
    { label: 'Chính sách', to: '/landing-policy' },
    { label: 'Hồ sơ cá nhân', to: '/landing-profile' },
    { label: 'Liên hệ', to: '/landing-contact' },
  ];
  const usefulLinks = [
    { label: 'Workflow automation', to: '/landing-workflows' },
    { label: 'Cloud VPS', to: '/landing-vps' },
    { label: 'Hosting', to: '/landing-hosting' },
    { label: 'Kho tool', to: '/landing-tools' },
    { label: 'Nạp tiền', to: '/landing-recharge' },
  ];
  const headingColor = isDark ? '#ffffff' : '#0B0B0B';
  const textColor    = isDark ? '#9CA3AF' : '#4B5563';
  const linkHover    = '#FCD34D';
  const dividerColor = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.08)';

  return (
    <footer
      className="relative overflow-hidden transition-colors duration-500"
      style={{
        background: isDark ? '#050807' : '#F2F9F5',
        borderTop: `1px solid ${dividerColor}`,
      }}
    >
      {/* Top accent line */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(252,211,77,0.3), transparent)' }}
      />

      {/* CTA Banner */}
      <div
        className="relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #FCD34D 0%, #F59E0B 100%)' }}
      >
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8 py-14 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div>
            <h2 className="text-2xl lg:text-3xl font-black text-white leading-snug mb-2">
              Nâng Tầm Tư Duy Giao Dịch
            </h2>
            <p className="text-white/80 text-sm max-w-md">
              Đồng hành cùng AETRADING để xây dựng nền tảng kiến thức vững chắc và giao dịch kỷ luật hơn mỗi ngày.
            </p>
          </div>
          <Link
            to="/landing-courses"
            className="flex-shrink-0 flex items-center gap-2 text-sm font-bold px-7 py-3.5 rounded-[10px] transition-all duration-200 hover:-translate-y-px hover:shadow-lg"
            style={{ background: '#ffffff', color: '#FCD34D' }}
          >
            Bắt đầu ngay
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 12L12 2M12 2H5M12 2V9" stroke="#FCD34D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        </div>
        {/* Decorative circles */}
        <div className="absolute right-8 top-1/2 -translate-y-1/2 w-40 h-40 rounded-full bg-[#0d1412]/5 hidden lg:block" />
        <div className="absolute right-24 bottom-0 w-24 h-24 rounded-full bg-[#0d1412]/5 hidden lg:block" />
      </div>

      {/* Main Footer Body */}
      <div className="max-w-[1200px] mx-auto px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">

          {/* Brand Column */}
          <div className="space-y-5">
            {/* Logo */}
            <Link to="/landing-courses" className="flex items-center">
              <img src="/logo.png" alt="AETRADING" className="h-14 md:h-16 w-auto object-contain" />
            </Link>

            <p className="text-sm leading-relaxed" style={{ color: textColor }}>
              AETRADING xây dựng hệ sinh thái học tập và thực chiến dành cho nhà giao dịch muốn phát triển bền vững.
            </p>

          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold mb-5 uppercase tracking-wider" style={{ color: headingColor }}>
              Quick Links
            </h4>
            <ul className="space-y-3.5">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-sm transition-colors duration-200"
                    style={{ color: textColor }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = linkHover)}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = textColor)}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Useful Links */}
          <div>
            <h4 className="text-sm font-bold mb-5 uppercase tracking-wider" style={{ color: headingColor }}>
              Dịch Vụ
            </h4>
            <ul className="space-y-3.5">
              {usefulLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-sm transition-colors duration-200"
                    style={{ color: textColor }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = linkHover)}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = textColor)}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-sm font-bold mb-2 uppercase tracking-wider" style={{ color: headingColor }}>
              Newsletter
            </h4>
            <p className="text-sm mb-5" style={{ color: textColor }}>
              Đăng ký để nhận cập nhật khóa học, chiến lược giao dịch và thông báo mới nhất từ AETRADING.
            </p>
            <div
              className="flex overflow-hidden rounded-[10px] border transition-all duration-200 focus-within:ring-2 focus-within:ring-[#FCD34D]/30"
              style={{ borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }}
            >
              <input
                type="email"
                placeholder="Email của bạn"
                className="flex-1 text-sm px-4 py-3 outline-none transition-colors"
                style={{
                  background: isDark ? 'rgba(255,255,255,0.05)' : '#ffffff',
                  color: isDark ? '#f9fafb' : '#111827',
                }}
              />
              <button
                className="flex items-center gap-1 text-xs font-bold px-4 py-3 flex-shrink-0 transition-all duration-200 hover:brightness-110"
                style={{ background: '#FCD34D', color: '#000' }}
              >
                Đăng ký
                <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                  <path d="M2 12L12 2M12 2H5M12 2V9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs"
          style={{ borderTop: `1px solid ${dividerColor}`, color: textColor }}
        >
          <p>© {new Date().getFullYear()} AETRADING. Tất cả quyền được bảo lưu.</p>
          <div className="flex items-center gap-6">
            {[
              { label: 'Chính Sách Bảo Mật', to: '/landing-policy#bao-mat' },
              { label: 'Điều Khoản', to: '/landing-policy#su-dung' },
              { label: 'Thanh Toán', to: '/landing-policy#thanh-toan' },
            ].map((item) => (
              <Link
                key={item.label}
                to={item.to}
                className="transition-colors duration-200"
                style={{ color: textColor }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = linkHover)}
                onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = textColor)}
              >
                {item.label}
              </Link>
            ))}
          </div>
          {/* Payment icons */}
          <div className="flex items-center gap-3 opacity-60">
            <span className="text-xs font-semibold" style={{ color: textColor }}>Google Pay</span>
            <span className="text-xs font-semibold" style={{ color: textColor }}>Visa</span>
            <span className="text-xs font-semibold" style={{ color: textColor }}>Mastercard</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
