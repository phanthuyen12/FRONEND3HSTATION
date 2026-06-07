import React from 'react';
import FeatherIcon from 'feather-icons-react';
import { useTheme } from '../context/ThemeContext';

const Footer = () => {
  const { isDark } = useTheme();

  const quickLinks = ['About Us', 'Support Center', 'Domain Search', 'My Account', 'Contact Us'];
  const usefulLinks = ['Cloud Hosting', 'VPS Hosting', 'Shared Hosting', 'WordPress Hosting', 'Web Hosting'];
  const socialIcons = [
    { icon: 'facebook', href: '#' },
    { icon: 'instagram', href: '#' },
    { icon: 'linkedin', href: '#' },
    { icon: 'twitter', href: '#' },
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
              Nâng Tầm Hiện Diện Trực Tuyến
            </h2>
            <p className="text-white/80 text-sm max-w-md">
              Đừng để hosting cũ cản bước bạn. Hàng nghìn doanh nghiệp đã tin tưởng 3HSTATION.
            </p>
          </div>
          <a
            href="#"
            className="flex-shrink-0 flex items-center gap-2 text-sm font-bold px-7 py-3.5 rounded-[10px] transition-all duration-200 hover:-translate-y-px hover:shadow-lg"
            style={{ background: '#ffffff', color: '#FCD34D' }}
          >
            Bắt đầu ngay
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 12L12 2M12 2H5M12 2V9" stroke="#FCD34D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
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
            <a href="#" className="flex items-center">
              <img src="/logo.png" alt="3H STATION" className="h-10 md:h-12 object-contain" />
            </a>

            <p className="text-sm leading-relaxed" style={{ color: textColor }}>
              Làm chủ hiện diện trực tuyến với các giải pháp hosting cao cấp. Dù bạn mới bắt đầu hay doanh nghiệp lớn.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3">
              {socialIcons.map(({ icon, href }) => (
                <a
                  key={icon}
                  href={href}
                  className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200"
                  style={{
                    background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)',
                    color: textColor,
                    border: `1px solid ${dividerColor}`,
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.background = '#FCD34D';
                    (e.currentTarget as HTMLAnchorElement).style.color = '#000';
                    (e.currentTarget as HTMLAnchorElement).style.border = '1px solid #FCD34D';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.background = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)';
                    (e.currentTarget as HTMLAnchorElement).style.color = textColor;
                    (e.currentTarget as HTMLAnchorElement).style.border = `1px solid ${dividerColor}`;
                  }}
                >
                  <FeatherIcon icon={icon} size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold mb-5 uppercase tracking-wider" style={{ color: headingColor }}>
              Quick Links
            </h4>
            <ul className="space-y-3.5">
              {quickLinks.map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-sm transition-colors duration-200"
                    style={{ color: textColor }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = linkHover)}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = textColor)}
                  >
                    {link}
                  </a>
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
                <li key={link}>
                  <a
                    href="#"
                    className="text-sm transition-colors duration-200"
                    style={{ color: textColor }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = linkHover)}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = textColor)}
                  >
                    {link}
                  </a>
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
              Đăng ký để nhận ưu đãi hosting &amp; tin tức mới nhất.
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
          <p>© {new Date().getFullYear()} 3HSTATION. Tất cả quyền được bảo lưu.</p>
          <div className="flex items-center gap-6">
            {['Chính Sách Bảo Mật', 'Điều Khoản', 'Cookie'].map((t) => (
              <a
                key={t}
                href="#"
                className="transition-colors duration-200"
                style={{ color: textColor }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = linkHover)}
                onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = textColor)}
              >
                {t}
              </a>
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
