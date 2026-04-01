import React from 'react';
import FeatherIcon from 'feather-icons-react';
import ScrollReveal from './ScrollReveal';

const DomainSection = () => {
  const features = [
    "Đăng ký và quản lý tên miền trực tuyến mọi lúc, mọi nơi",
    "Bảo mật DNSSEC và Registry Lock tối ưu",
    "Miễn phí bảo mật ẩn thông tin Whois",
    "Tặng kèm Email Forwarding và Website thông báo",
    "Hỗ trợ đa dạng đuôi tên miền mới và mở rộng",
    "Đội ngũ hỗ trợ 24/7/365 kinh nghiệm tận tâm"
  ];

  return (
    <section className="py-20 md:py-32 relative overflow-hidden bg-[#060a09]">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[300px] h-[300px] bg-[#00ff9d]/5 rounded-full blur-[120px] -z-10"></div>
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[150px] -z-10"></div>

      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">

          {/* Left Content */}
          <div className="flex-1 w-full order-2 lg:order-1">
            <ScrollReveal direction="left">
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="inline-block px-3 py-1 rounded-full bg-[#00ff9d]/10 border border-[#00ff9d]/20 text-[10px] font-black uppercase tracking-widest text-[#00ff9d]">
                    Đăng Ký Tên Miền
                  </div>
                  <h2 className="text-3xl md:text-4xl lg:text-[44px] font-extrabold tracking-tight leading-[1.1]">
                    ĐĂNG KÝ <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00ff9d] to-[#01c67c]">TÊN MIỀN</span>
                  </h2>
                  <p className="text-base md:text-lg text-gray-400 font-medium max-w-lg mt-2">
                    3HSTATION: Đối tác đăng ký tên miền tin cậy & bảo mật cao, mang lại sự an tâm tuyệt đối cho thương hiệu của bạn.
                  </p>
                </div>

                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                  {features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3 group">
                      <div className="mt-1 flex-shrink-0 w-5 h-5 rounded-full bg-[#00ff9d]/10 flex items-center justify-center border border-[#00ff9d]/30 group-hover:bg-[#00ff9d]/20 transition-all duration-300">
                        <FeatherIcon icon="check" className="text-[#00ff9d]" size={12} strokeWidth={4} />
                      </div>
                      <span className="text-sm text-gray-300 group-hover:text-white transition-colors duration-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="pt-6">
                  <button className="relative px-10 py-4 bg-gradient-to-r from-[#00ff9d] to-[#01c67c] text-[#060a09] font-bold rounded-full hover:shadow-[0_0_40px_rgba(0,255,157,0.5)] transform hover:-translate-y-1 active:scale-95 transition-all duration-500 uppercase tracking-wider text-xs overflow-hidden group">
                    <span className="relative z-10">Đăng ký ngay</span>
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                  </button>
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Right Visual (Image) */}
          <div className="flex-1 relative w-full max-w-[560px] order-1 lg:order-2 flex justify-center lg:justify-end">
            <ScrollReveal direction="right" delay={0.2}>
              <div className="relative group w-full">
                {/* Glow backdrop */}
                <div className="absolute -inset-10 bg-[#00ff9d]/5 blur-[80px] -z-10 rounded-full group-hover:bg-blue-500/5 transition-colors duration-1000"></div>

                <img
                  src="https://templates.hibootstrap.com/blim/default/assets/images/support-1.png"
                  alt="Domain Registration"
                  className="w-full h-auto object-contain relative z-10 drop-shadow-[0_30px_60px_rgba(0,0,0,0.5)] transform transition-transform duration-700 group-hover:scale-[1.03]"
                />
              </div>
            </ScrollReveal>
          </div>

        </div>
      </div>
    </section>
  );
};

export default DomainSection;

