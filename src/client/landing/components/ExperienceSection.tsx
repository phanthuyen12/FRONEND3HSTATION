import React from 'react';
import ScrollReveal from './ScrollReveal';

const ExperienceSection = () => {
  const stats = [
    { label: "Năm kinh nghiệm", value: "10+" },
    { label: "Khách hàng tin tưởng", value: "80K+" },
    { label: "Uptime cam kết", value: "99.9%" }
  ];

  return (
    <section className="py-20 md:py-32 bg-[#050807] relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          
          {/* Left Content */}
          <div className="flex-1 w-full order-2 lg:order-1">
            <ScrollReveal direction="left">
              <div className="space-y-8">
                <div className="space-y-6">
                  <div className="inline-block px-3 py-1 rounded-full bg-[#FDE047]/10 border border-[#FDE047]/20 text-[10px] font-black uppercase tracking-widest text-[#FDE047]">
                    Câu Chuyện & Kinh Nghiệm
                  </div>
                  <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1]">
                    Được xây dựng bởi đội ngũ với <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FDE047] to-blue-500">10+ năm kinh nghiệm</span>
                  </h2>
                  <p className="text-base md:text-lg text-gray-400 leading-relaxed max-w-xl">
                    Bắt đầu từ khát vọng nâng tầm hạ tầng số tại Việt Nam, chúng tôi tập hợp những kỹ sư hệ thống dày dạn kinh nghiệm thực chiến. Chúng tôi thấu hiểu sâu sắc nhu cầu của doanh nghiệp nội địa.
                  </p>
                  <p className="text-sm text-gray-400 leading-relaxed max-w-lg">
                    Chúng tôi không chỉ cung cấp hosting, mà xây dựng một nền tảng hạ tầng được tinh chỉnh từng chi tiết để đảm bảo website của bạn luôn vận hành ở trạng thái tốt nhất.
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-4 md:gap-8 pt-8 border-t border-white/10">
                  {stats.map((stat, idx) => (
                    <div key={idx} className="space-y-2 group">
                      <p className="text-3xl md:text-4xl font-black text-white group-hover:text-[#FDE047] transition-colors duration-500">{stat.value}</p>
                      <p className="text-[9px] md:text-[10px] uppercase font-black tracking-widest text-gray-400">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Right Visual - Image */}
          <div className="flex-1 w-full order-1 lg:order-2 flex justify-center lg:justify-end">
            <ScrollReveal direction="right" delay={0.2}>
              <div className="relative group max-w-[540px]">
                {/* Glow backdrops */}
                <div className="absolute -inset-10 bg-[#FDE047]/5 blur-[80px] -z-10 rounded-full group-hover:bg-blue-500/5 transition-colors duration-1000"></div>
                
                <img 
                  src="https://unifato.com/hostc/assets/img/images/about7-image.png" 
                  alt="10+ Years Experience" 
                  className="w-full h-auto object-contain relative z-10 transition-transform duration-700 group-hover:scale-[1.02] drop-shadow-2xl"
                />
                
              </div>
            </ScrollReveal>
          </div>

        </div>
      </div>
    </section>
  );
};

export default ExperienceSection;

