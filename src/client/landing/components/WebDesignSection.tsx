import React from 'react';
import FeatherIcon from 'feather-icons-react';
import ScrollReveal from './ScrollReveal';

const WebDesignSection = () => {
  const points = [
    "Giải pháp tin dùng bởi 25.000+ Doanh nghiệp & Shop bán hàng",
    "Kho giao diện 200+ mẫu thiết kế chuẩn SEO, chuẩn Mobile",
    "Tích hợp 30+ ứng dụng chăm sóc và bán hàng hiệu quả",
    "Kết nối 20+ cổng thanh toán & đơn vị vận chuyển phổ biến",
    "Miễn phí SSL, tăng cường bảo mật & tối ưu Google SEO",
    "Đồng bộ Landing Page, Email Marketing, CRM & sàn TMĐT",
    "Chi phí triển khai linh hoạt, đa dạng lựa chọn lưu trữ"
  ];

  return (
    <section className="py-20 md:py-32 relative overflow-hidden bg-[#040706]">
      {/* Visual Accent */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#00ff9d]/5 rounded-full blur-[120px] -z-10"></div>
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-purple-500/5 rounded-full blur-[100px] -z-10"></div>

      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-24">

          {/* Left Visual - Full Image */}
          <div className="flex-1 w-full order-2 lg:order-1 flex justify-center lg:justify-start">
            <ScrollReveal direction="right">
              <div className="relative group max-w-[560px] w-full mx-auto lg:mx-0">
                {/* Glow backdrop */}
                <div className="absolute -inset-10 bg-[#00ff9d]/5 blur-[80px] -z-10 rounded-full group-hover:bg-blue-500/5 transition-colors duration-1000"></div>

                {/* Main image */}
                <img
                  src="https://inet.vn/public/img/banners/zozo-web(458x208).png"
                  alt="Web Design"
                  className="w-full h-auto object-contain relative z-10 drop-shadow-[0_30px_60px_rgba(0,0,0,0.6)] transform transition-transform duration-700 group-hover:scale-[1.03]"
                />

                {/* Floating Element 1 - Top Left */}
                <div className="absolute top-4 -left-4 md:-left-8 p-4 rounded-2xl bg-black/40 backdrop-blur-xl border border-[#00ff9d]/20 shadow-2xl animate-float z-20 hidden sm:block">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-[#00ff9d]/10 flex items-center justify-center border border-[#00ff9d]/20">
                      <FeatherIcon icon="layout" className="text-[#00ff9d]" size={16} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-white uppercase tracking-wider">Thiết Kế UI/UX</p>
                      <p className="text-[8px] text-gray-400 font-bold uppercase">Công Nghệ Hiện Đại</p>
                    </div>
                  </div>
                </div>

                {/* Floating Element 2 - Bottom Right */}
                <div className="absolute bottom-4 -right-4 md:-right-8 p-4 rounded-2xl bg-black/40 backdrop-blur-xl border border-blue-500/20 shadow-2xl animate-float [animation-delay:2s] z-20 hidden sm:block">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                      <FeatherIcon icon="zap" className="text-blue-400" size={16} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-white uppercase tracking-wider">Tải Trang Siêu Tốc</p>
                      <p className="text-[8px] text-gray-400 font-bold uppercase">Tối Ưu Chuẩn SEO</p>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Right Content */}
          <div className="flex-1 w-full order-1 lg:order-2">
            <ScrollReveal direction="left" delay={0.2}>
              <div className="space-y-8">
                <div className="space-y-4">
                  <div className="inline-block px-3 py-1 rounded-full bg-[#00ff9d]/10 border border-[#00ff9d]/20 text-[10px] font-black uppercase tracking-widest text-[#00ff9d]">
                    Phát Triển Website
                  </div>
                  <h2 className="text-3xl md:text-4xl lg:text-[44px] font-extrabold tracking-tight leading-[1.1]">
                    THIẾT KẾ <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00ff9d] to-[#01c67c]">WEBSITE</span> BÁN HÀNG
                  </h2>
                  <p className="text-base md:text-lg text-gray-400 font-medium leading-relaxed max-w-xl">
                    Sở hữu website chuyên nghiệp, tối ưu chuyển đổi chỉ trong vài bước đơn giản. Chúng tôi biến ý tưởng của bạn thành hiện thực với công nghệ hiện đại nhất.
                  </p>
                </div>

                <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4 pt-2">
                  {points.map((point, index) => (
                    <li key={index} className="flex items-start gap-4 group">
                      <div className="mt-1 flex-shrink-0 w-6 h-6 rounded-lg bg-[#00ff9d]/10 flex items-center justify-center border border-[#00ff9d]/20 group-hover:bg-[#00ff9d]/20 group-hover:border-[#00ff9d]/50 transition-all duration-300">
                        <FeatherIcon icon="check-circle" className="text-[#00ff9d]" size={14} />
                      </div>
                      <span className="text-sm md:text-base text-gray-300 group-hover:text-white transition-colors duration-300">{point}</span>
                    </li>
                  ))}
                </ul>

                <div className="pt-4">
                  <button className="px-10 py-4 bg-gradient-to-r from-[#00ff9d] to-[#01c67c] text-[#060a09] font-bold rounded-full hover:shadow-[0_0_40px_rgba(0,255,157,0.5)] transform hover:-translate-y-1 transition-all duration-300 uppercase tracking-wider text-xs flex items-center gap-3 group">
                    Dùng thử ngay
                    <FeatherIcon icon="arrow-right" size={16} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </ScrollReveal>
          </div>

        </div>
      </div>
    </section>
  );
};

export default WebDesignSection;

