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

  const headingColor = isDark ? '#ffffff' : '#0B0B0B';
  const textColor = isDark ? '#9CA3AF' : '#4B5563';
  const mutedColor = isDark ? '#6B7280' : '#6B7280';
  const linkHover = '#FCD34D';
  const dividerColor = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)';

  const bottomLinks = [
    { label: 'Chính Sách Bảo Mật', to: '/landing-policy#bao-mat' },
    { label: 'Điều Khoản', to: '/landing-policy#su-dung' },
    { label: 'Thanh Toán', to: '/landing-policy#thanh-toan' },
    { label: 'Miễn Trừ Trách Nhiệm', to: '/landing-disclaimer' },
  ];

  return (
    <footer
      className="relative overflow-hidden transition-colors duration-500"
      style={{
        background: isDark ? '#050807' : '#F2F9F5',
        borderTop: `1px solid ${dividerColor}`,
      }}
    >
      {/* CTA */}
      <div className="max-w-[1200px] mx-auto px-6 lg:px-8 pt-10">
        <div
          className="relative overflow-hidden rounded-3xl px-6 md:px-10 py-8 md:py-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6"
          style={{
            background: 'linear-gradient(135deg, #FCD34D 0%, #F59E0B 100%)',
          }}
        >
          <div className="relative z-10 max-w-2xl">
            <p className="text-white/80 text-xs font-bold uppercase tracking-[0.2em] mb-3">
              AETRADING Academy
            </p>

            <h2 className="text-2xl md:text-3xl font-black text-white leading-tight mb-3">
              Nâng Tầm Tư Duy Giao Dịch
            </h2>

            <p className="text-white/85 text-sm md:text-base leading-relaxed">
              Xây dựng nền tảng kiến thức vững chắc, rèn luyện kỷ luật và phát triển tư duy giao dịch bền vững.
            </p>
          </div>

          <Link
            to="/landing-courses"
            className="relative z-10 flex-shrink-0 inline-flex items-center justify-center gap-2 text-sm font-bold px-6 py-3.5 rounded-xl transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl"
            style={{ background: '#ffffff', color: '#D97706' }}
          >
            Bắt đầu ngay
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path
                d="M2 12L12 2M12 2H5M12 2V9"
                stroke="#D97706"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>

          <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-white/10" />
          <div className="absolute right-24 -bottom-16 w-44 h-44 rounded-full bg-black/5" />
        </div>
      </div>

      {/* Main */}
      <div className="max-w-[1200px] mx-auto px-6 lg:px-8 pt-14 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr_1fr] gap-10 lg:gap-14 mb-12">
          {/* Brand */}
          <div>
            <Link to="/landing-courses" className="inline-flex items-center mb-5">
              <img
                src="/logo.png"
                alt="AETRADING"
                className="h-14 md:h-16 w-auto object-contain"
              />
            </Link>

            <p className="text-sm leading-7 max-w-md" style={{ color: textColor }}>
              AETRADING xây dựng hệ sinh thái học tập và thực chiến dành cho nhà giao dịch muốn phát triển bền vững.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4
              className="text-sm font-black mb-5 uppercase tracking-wider"
              style={{ color: headingColor }}
            >
              Truy Cập Nhanh
            </h4>

            <ul className="grid grid-cols-1 gap-3">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="inline-flex text-sm transition-colors duration-200"
                    style={{ color: textColor }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = linkHover;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = textColor;
                    }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4
              className="text-sm font-black mb-5 uppercase tracking-wider"
              style={{ color: headingColor }}
            >
              Kết Nối
            </h4>

            <div className="space-y-3 text-sm" style={{ color: textColor }}>
              <p>Học tập, thực chiến và phát triển tư duy giao dịch cùng cộng đồng AETRADING.</p>

              <Link
                to="/landing-contact"
                className="inline-flex items-center gap-2 font-bold transition-colors duration-200"
                style={{ color: headingColor }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = linkHover;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = headingColor;
                }}
              >
                Liên hệ hỗ trợ
                <span>→</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div
          className="pt-7 flex flex-col md:flex-row items-center justify-between gap-5 text-xs"
          style={{ borderTop: `1px solid ${dividerColor}`, color: mutedColor }}
        >
          <p className="text-center md:text-left">
            © {new Date().getFullYear()} AETRADING. Tất cả quyền được bảo lưu.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
            {bottomLinks.map((item) => (
              <Link
                key={item.label}
                to={item.to}
                className="transition-colors duration-200"
                style={{ color: mutedColor }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = linkHover;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = mutedColor;
                }}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;