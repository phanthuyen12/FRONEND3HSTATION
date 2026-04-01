import React from 'react';
import FeatherIcon from 'feather-icons-react';
import ScrollReveal from './ScrollReveal';

const HostingSection = () => {
  const points = [
    "Cấu hình mạnh mẽ: CPU Intel Xeon Platinum / Gold / V4",
    "Ổ cứng NVMe U.2: Tốc độ vượt trội gấp 10 lần SSD",
    "Công nghệ Web: Litespeed, Memcached & Redis Socket",
    "Quản trị & Bảo mật: cPanel, CloudLinux, Antivirus, SSL",
    "Sao lưu JetBackup: Khôi phục dữ liệu nhanh chóng",
    "Dịch vụ: Miễn phí tư vấn & chuyển dữ liệu chuyên nghiệp"
  ];

  const categories = [
    { name: "AMD Hosting", recommended: true },
    { name: "Turbo Hosting" },
    { name: "Web Hosting" },
    { name: "WordPress Hosting" },
    { name: "Turbo Business" },
    { name: "SEO Hosting" }
  ];

  return (
    <section className="py-20 md:py-32 relative overflow-hidden bg-[#060a09]">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#00ff9d]/5 rounded-full blur-[150px] -z-10"></div>
      <div className="absolute bottom-0 left-1/4 w-[300px] h-[300px] bg-blue-500/5 rounded-full blur-[120px] -z-10"></div>
      
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          
          {/* Left Content */}
          <div className="flex-1 w-full order-2 lg:order-1">
            <ScrollReveal direction="left">
              <div className="space-y-8">
                <div className="space-y-4">
                  <div className="inline-block px-3 py-1 rounded-full bg-[#00ff9d]/10 border border-[#00ff9d]/20 text-[10px] font-black uppercase tracking-widest text-[#00ff9d]">
                    Hosting Hiệu Năng Cao
                  </div>
                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight leading-[1.1]">
                    DỊCH VỤ <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00ff9d] to-[#01c67c]">HOSTING</span>
                  </h2>
                  <p className="text-base md:text-lg text-gray-400 font-medium max-w-xl mt-2">
                    Sức mạnh tối ưu cho sự tăng trưởng website của bạn. Trải nghiệm tốc độ tải trang nhanh kỷ lục với hạ tầng phần cứng thế hệ mới nhất.
                  </p>
                </div>

                <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                  {points.map((point, index) => (
                    <li key={index} className="flex items-start gap-3 group">
                      <div className="mt-1 flex-shrink-0 w-5 h-5 rounded-full bg-[#00ff9d]/10 flex items-center justify-center border border-[#00ff9d]/30 group-hover:bg-[#00ff9d]/20 transition-all duration-300">
                        <FeatherIcon icon="zap" className="text-[#00ff9d]" size={12} strokeWidth={3} />
                      </div>
                      <span className="text-sm text-gray-300 group-hover:text-white transition-colors duration-300">{point}</span>
                    </li>
                  ))}
                </ul>

                <div className="pt-4">
                  <h4 className="text-xs font-black uppercase tracking-[0.2em] text-gray-500 mb-6">Gói Dịch Vụ Của Bạn</h4>
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                    {categories.map((cat, idx) => (
                      <div key={idx} className="relative group">
                        {cat.recommended && (
                          <span className="absolute -top-2 left-4 px-2 py-0.5 bg-[#00ff9d] text-[#060a09] text-[8px] font-black uppercase rounded-full z-10 shadow-[0_0_15px_#00ff9d]">
                            Nổi Bật
                          </span>
                        )}
                        <button className={`w-full py-4 px-4 rounded-2xl text-[10px] md:text-xs font-black transition-all duration-500 border uppercase tracking-widest ${cat.recommended ? 'bg-gradient-to-r from-[#00ff9d] to-[#01c67c] text-[#060a09] border-[#00ff9d] shadow-[0_10px_30px_rgba(0,255,157,0.2)] hover:shadow-[0_15px_40px_rgba(0,255,157,0.35)]' : 'bg-white/5 text-white border-white/10 hover:border-[#00ff9d]/50 hover:bg-white/10 hover:shadow-2xl'}`}>
                          {cat.name}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Right Visual */}
          <div className="flex-1 w-full order-1 lg:order-2 flex justify-center">
            <ScrollReveal direction="right" delay={0.2}>
              <div className="relative group max-w-[540px]">
                <div className="absolute inset-0 bg-[#00ff9d]/10 rounded-[3rem] blur-3xl opacity-20 group-hover:opacity-40 transition-opacity duration-1000"></div>
                <div className="relative z-10 p-4">
                  <img 
                    src="https://unifato.com/hostc/assets/img/images/hero3-image.png" 
                    alt="Hosting Services" 
                    className="w-full h-auto object-contain brightness-110 contrast-110 drop-shadow-[0_0_50px_rgba(0,0,0,0.6)] transform transition-transform duration-700 group-hover:scale-105" 
                  />
                  
                  {/* Floating Performance Indicator */}
                  <div className="absolute top-1/4 -right-4 md:-right-8 p-4 rounded-2xl bg-[#060a09]/80 backdrop-blur-xl border border-[#00ff9d]/30 shadow-2xl animate-float">
                    <div className="flex flex-col items-center gap-1">
                      <p className="text-[10px] font-black text-[#00ff9d] uppercase tracking-widest leading-none">Tốc Độ</p>
                      <p className="text-3xl font-black text-white leading-none">10X</p>
                      <p className="text-[8px] font-bold text-gray-500 uppercase tracking-tighter">Nhanh Hơn Với NVMe</p>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>

        </div>
      </div>
    </section>
  );
};

export default HostingSection;

