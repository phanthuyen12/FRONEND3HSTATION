import React, { useState, useRef } from 'react';
import FeatherIcon from 'feather-icons-react';
import ScrollReveal from './ScrollReveal';

const SoftwareSection = () => {
  const [activeTab, setActiveTab] = useState('All');
  const [currentSlide, setCurrentSlide] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);

  const categories = ['All', 'Plugins', 'Themes', 'Tools', 'VPS-Soft'];

  const softwares = [
    {
      title: "Plugin Tối ưu hóa SEO Premium",
      category: "Plugins",
      version: "v2.4.1",
      compatibility: "WP 6.x",
      desc: "Tăng tốc độ index và tối ưu hóa nội dung website cho công cụ tìm kiếm.",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500&auto=format&fit=crop&q=60"
    },
    {
      title: "Theme Bán hàng E-commerce Pro",
      category: "Themes",
      version: "v3.1.0",
      compatibility: "Elementor",
      desc: "Giao diện siêu nhanh, chuẩn SEO chuyên dụng cho trang bán hàng hiện đại.",
      image: "https://images.unsplash.com/photo-1541462608141-ad43b3df8281?w=500&auto=format&fit=crop&q=60"
    },
    {
      title: "Công cụ Quản lý VPS 3HSTATION",
      category: "Tools",
      version: "v1.0.5",
      compatibility: "Linux/Win",
      desc: "Phần mềm giúp cài đặt và tối ưu hóa VPS chỉ với một cú nhấp chuột.",
      image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=500&auto=format&fit=crop&q=60"
    },
    {
      title: "Plugin Bảo mật & Chống Spam",
      category: "Plugins",
      version: "v4.2.0",
      compatibility: "WP 6.x",
      desc: "Lá chắn vững chắc bảo vệ website khỏi các cuộc tấn công DDoS và Brute Force.",
      image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=500&auto=format&fit=crop&q=60"
    }
  ];

  const filteredSoftware = activeTab === 'All'
    ? softwares
    : softwares.filter(s => s.category === activeTab);

  // Mobile: 2 cards per slide
  const totalSlides = Math.ceil(filteredSoftware.length / 2);
  const safeSlide = Math.min(currentSlide, totalSlides - 1);

  const handleTabChange = (cat: string) => {
    setActiveTab(cat);
    setCurrentSlide(0);
  };

  const handlePrev = () => setCurrentSlide(s => Math.max(0, s - 1));
  const handleNext = () => setCurrentSlide(s => Math.min(totalSlides - 1, s + 1));

  const SoftCard = ({ soft }: { soft: typeof softwares[0] }) => (
    <div className="group bg-[#080d0c] rounded-[32px] border border-white/[0.06] overflow-hidden hover:border-[#FDE047]/30 transition-all duration-700 shadow-2xl flex flex-col h-full relative">
      {/* Thumbnail */}
      <div className="relative aspect-square overflow-hidden">
        <img
          src={soft.image}
          alt={soft.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 opacity-60 group-hover:opacity-100"
        />
        <div className="absolute top-5 left-5 px-3 py-1 bg-blue-500 text-white text-[8px] font-black uppercase rounded-lg shadow-lg">
          {soft.category}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#080d0c] via-transparent to-transparent opacity-80"></div>
      </div>

      {/* Content */}
      <div className="p-6 md:p-8 flex flex-col flex-grow space-y-4">
        <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-gray-400">
          <div className="flex items-center gap-1.5 hover:text-blue-400 transition-colors">
            <FeatherIcon icon="git-branch" size={12} />
            <span>{soft.version}</span>
          </div>
          <div className="w-1 h-1 bg-[#0d1412]/10 rounded-full"></div>
          <div className="flex items-center gap-1.5 hover:text-blue-400 transition-colors">
            <FeatherIcon icon="layers" size={12} />
            <span>{soft.compatibility}</span>
          </div>
        </div>

        <h3 className="text-base md:text-lg font-bold leading-tight group-hover:text-blue-400 transition-colors duration-300 line-clamp-2 min-h-[2.5rem]">
          {soft.title}
        </h3>

        <p className="text-xs text-gray-400 leading-relaxed line-clamp-3 flex-grow font-medium">
          {soft.desc}
        </p>

        <div className="pt-4 md:pt-6 mt-auto">
          <button className="w-full py-3 md:py-4 rounded-2xl bg-[#0d1412]/5 border border-white/10 text-white text-[10px] font-black uppercase tracking-widest hover:bg-gradient-to-r hover:from-blue-500 hover:to-[#FDE047] hover:text-force-white hover:border-transparent transition-all duration-500 transform group-hover:translate-y-0 group-active:scale-95">
            Tải phần mềm
          </button>
        </div>
      </div>

      {/* Visual Accent */}
      <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
        <div className="w-8 h-8 rounded-full bg-blue-500/10 backdrop-blur-md flex items-center justify-center border border-blue-500/20">
          <FeatherIcon icon="download" size={14} className="text-blue-400" />
        </div>
      </div>
    </div>
  );

  return (
    <section className="py-20 md:py-32 bg-[#040706] relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-[150px] -z-10"></div>

      <div className="container mx-auto px-6 relative z-10">

        {/* Top Header */}
        <ScrollReveal direction="up">
          <div className="text-center space-y-6 mb-16">
            <div className="inline-block px-4 py-1.5 rounded-full bg-[#0d1412]/5 border border-white/10 text-[10px] font-black uppercase tracking-[0.2em] text-[#FDE047]">
              Digital Ecosystem
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
              Digital Tools, <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FDE047] to-blue-500">Elevate Business</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-sm md:text-base">
              Khám phá kho phần mềm và công cụ hỗ trợ kinh doanh trực tuyến, giúp bạn tối ưu hóa quy trình và tăng trưởng doanh thu.
            </p>

            {/* Tabs Container */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-6">
              <div className="bg-[#0a0f0d]/80 backdrop-blur-md p-1.5 rounded-[7px] border border-white/[0.05] flex flex-wrap justify-center items-center gap-1">
                {categories.map((cat) => (
                   <button
                     key={cat}
                     onClick={() => handleTabChange(cat)}
                     className={`px-5 py-2 rounded-[7px] text-[10px] md:text-xs font-black uppercase tracking-widest transition-all duration-500 ${activeTab === cat ? 'bg-gradient-to-r from-blue-500 to-[#FDE047] text-black shadow-[0_10px_20px_rgba(59,130,246,0.2)]' : 'text-gray-400 hover:text-white hover:bg-[#0d1412]/5'}`}
                   >
                     {cat === 'All' ? 'Tất cả' : cat}
                   </button>
                 ))}
               </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Desktop Grid */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredSoftware.map((soft, idx) => (
            <ScrollReveal key={idx} direction="up" delay={idx * 0.1}>
              <SoftCard soft={soft} />
            </ScrollReveal>
          ))}
        </div>

        {/* Mobile Slider - 2 cards per slide */}
        <div className="md:hidden">
          <div className="overflow-hidden">
            <div
              ref={sliderRef}
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${safeSlide * 100}%)` }}
            >
              {Array.from({ length: totalSlides }).map((_, slideIdx) => (
                <div key={slideIdx} className="min-w-full grid grid-cols-2 gap-3">
                  {filteredSoftware.slice(slideIdx * 2, slideIdx * 2 + 2).map((soft, idx) => (
                    <SoftCard key={idx} soft={soft} />
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Slide Dots + Nav */}
          {totalSlides > 1 && (
            <div className="flex items-center justify-center gap-3 mt-6">
              <button
                onClick={handlePrev}
                disabled={safeSlide === 0}
                className="w-9 h-9 rounded-[10px] border border-white/10 flex items-center justify-center text-gray-400 hover:border-blue-400 hover:text-blue-400 hover:bg-blue-400/5 transition-all duration-300 disabled:opacity-30"
              >
                <FeatherIcon icon="chevron-left" size={16} />
              </button>
              <div className="flex gap-1.5">
                {Array.from({ length: totalSlides }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentSlide(i)}
                    className={`transition-all duration-300 rounded-full ${safeSlide === i ? 'w-6 h-2 bg-blue-400' : 'w-2 h-2 bg-[#0d1412]/20 hover:bg-[#0d1412]/40'}`}
                  />
                ))}
              </div>
              <button
                onClick={handleNext}
                disabled={safeSlide === totalSlides - 1}
                className="w-9 h-9 rounded-[10px] border border-white/10 flex items-center justify-center text-gray-400 hover:border-blue-400 hover:text-blue-400 hover:bg-blue-400/5 transition-all duration-300 disabled:opacity-30"
              >
                <FeatherIcon icon="chevron-right" size={16} />
              </button>
            </div>
          )}
        </div>

      </div>
    </section>
  );
};

export default SoftwareSection;
