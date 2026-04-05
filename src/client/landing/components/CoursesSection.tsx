import React, { useState, useRef } from 'react';
import FeatherIcon from 'feather-icons-react';
import ScrollReveal from './ScrollReveal';

const CoursesSection = () => {
  const [activeTab, setActiveTab] = useState('All');
  const [currentSlide, setCurrentSlide] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);

  const categories = ['All', 'Hosting', 'Website', 'Domain', 'Security'];

  const courses = [
    {
      title: "Làm chủ Website với Hosting chuyên sâu",
      category: "Hosting",
      date: "Mar 15, 2024",
      duration: "12 bài học",
      desc: "Học cách quản trị và tối ưu hosting để website đạt tốc độ nhanh nhất.",
      image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc48?w=500&auto=format&fit=crop&q=60"
    },
    {
      title: "Tăng tốc Hosting cùng Litespeed",
      category: "Hosting",
      date: "Mar 08, 2024",
      duration: "10 bài học",
      desc: "Kỹ thuật nâng cao cấu hình web server để chịu tải hàng triệu người dùng.",
      image: "https://images.unsplash.com/photo-1560732488-6b0df240254a?w=500&auto=format&fit=crop&q=60"
    },
    {
      title: "Xu hướng Thiết kế Web 2024",
      category: "Website",
      date: "Mar 12, 2024",
      duration: "08 bài học",
      desc: "Cập nhật các chuẩn thiết kế hiện đại, tối ưu trải nghiệm người dùng UI/UX.",
      image: "https://images.unsplash.com/photo-1547658719-da2b51169166?w=500&auto=format&fit=crop&q=60"
    },
    {
      title: "Bảo mật Tên miền và Thương hiệu",
      category: "Domain",
      date: "Mar 10, 2024",
      duration: "05 bài học",
      desc: "Kiến thức chuyên sâu về DNSSEC, bảo vệ thương hiệu số của bạn.",
      image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=500&auto=format&fit=crop&q=60"
    },
    {
      title: "Tối ưu hóa thiết kế Mobile-First",
      category: "Website",
      date: "Mar 05, 2024",
      duration: "15 bài học",
      desc: "Xây dựng website tương thích hoàn hảo cho mọi thiết bị di động.",
      image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=500&auto=format&fit=crop&q=60"
    },
    {
      title: "Chiến lược sở hữu đa Tên miền",
      category: "Domain",
      date: "Mar 01, 2024",
      duration: "06 bài học",
      desc: "Cách quản lý hàng trăm tên miền hiệu quả cho doanh nghiệp lớn.",
      image: "https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=500&auto=format&fit=crop&q=60"
    }
  ];

  const filteredCourses = activeTab === 'All'
    ? courses
    : courses.filter(c => c.category === activeTab);

  // Mobile: 2 cards per slide
  const totalSlides = Math.ceil(filteredCourses.length / 2);
  const safeSlide = Math.min(currentSlide, totalSlides - 1);

  const handleTabChange = (cat: string) => {
    setActiveTab(cat);
    setCurrentSlide(0);
  };

  const handlePrev = () => setCurrentSlide(s => Math.max(0, s - 1));
  const handleNext = () => setCurrentSlide(s => Math.min(totalSlides - 1, s + 1));

  const CourseCard = ({ course }: { course: typeof courses[0] }) => (
    <div className="group bg-[#080c0b] rounded-[32px] border border-white/[0.06] overflow-hidden hover:border-[#00ff9d]/30 transition-all duration-700 shadow-2xl flex flex-col h-full relative">
      {/* Thumbnail */}
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          src={course.image}
          alt={course.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 opacity-60 group-hover:opacity-100"
        />
        <div className="absolute top-5 left-5 px-3 py-1 bg-[#00ff9d] text-force-white text-[9px] font-black uppercase rounded-lg shadow-lg">
          {course.category}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#080c0b] via-transparent to-transparent opacity-60"></div>
      </div>

      {/* Content */}
      <div className="p-6 md:p-8 flex flex-col flex-grow space-y-4">
        <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-[#00ff9d]/60">
          <div className="flex items-center gap-1.5">
            <FeatherIcon icon="calendar" size={12} />
            <span>{course.date}</span>
          </div>
          <div className="w-1 h-1 bg-white/10 rounded-full"></div>
          <div className="flex items-center gap-1.5">
            <FeatherIcon icon="book-open" size={12} />
            <span>{course.duration}</span>
          </div>
        </div>

        <h3 className="text-lg md:text-xl font-bold leading-tight group-hover:text-[#00ff9d] transition-colors duration-300 line-clamp-2">
          {course.title}
        </h3>

        <p className="text-sm text-gray-500 leading-relaxed line-clamp-2 flex-grow font-medium">
          {course.desc}
        </p>

        <div className="pt-6 mt-auto border-t border-white/[0.05]">
          <a href="#" className="flex items-center justify-between group/link">
            <span className="text-[#00ff9d] text-[10px] font-black uppercase tracking-[0.2em] group-hover/link:tracking-[0.3em] transition-all duration-500">
              Join Course
            </span>
            <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover/link:bg-[#00ff9d] group-hover/link:text-force-white group-hover/link:border-[#00ff9d] transition-all duration-500">
              <FeatherIcon icon="arrow-right" size={14} />
            </div>
          </a>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-[#00ff9d] to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-700"></div>
    </div>
  );

  return (
    <section className="py-20 md:py-32 bg-[#050807] relative overflow-hidden">
      {/* Background Shapes */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-1/4 -left-20 w-[400px] h-[400px] bg-[#00ff9d]/5 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-1/4 -right-20 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[120px]"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">

        {/* Top Header */}
        <ScrollReveal direction="up">
          <div className="text-center space-y-6 mb-16">
            <div className="inline-block px-4 py-1.5 rounded-full bg-white/5 border border-white/5 text-[10px] font-black uppercase tracking-[0.2em] text-[#00ff9d]">
              Learning Center
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
              Stay Informed, <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00ff9d] to-[#01c67c]">Stay Ahead</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-sm md:text-base">
              Nâng cao kỹ năng quản trị web và marketing với thư viện khóa học chuyên sâu từ các chuyên gia hàng đầu.
            </p>

            {/* Tabs Container */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-6">
              <div className="bg-[#0a0f0d]/80 backdrop-blur-md p-1.5 rounded-[7px] border border-white/[0.05] flex flex-wrap justify-center items-center gap-1">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => handleTabChange(cat)}
                    className={`px-5 py-2 rounded-[7px] text-[10px] md:text-xs font-black uppercase tracking-widest transition-all duration-500 ${activeTab === cat ? 'bg-gradient-to-r from-[#00ff9d] to-[#01c67c] text-[#000000] shadow-[0_10px_20px_rgba(0,255,157,0.2)]' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
                  >
                    {cat === 'All' ? 'Tất cả' : cat}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Desktop Grid */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {filteredCourses.slice(0, 6).map((course, idx) => (
            <ScrollReveal key={idx} direction="up" delay={idx * 0.1}>
              <CourseCard course={course} />
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
                <div key={slideIdx} className="min-w-full grid grid-cols-2 gap-3 px-0">
                  {filteredCourses.slice(slideIdx * 2, slideIdx * 2 + 2).map((course, idx) => (
                    <CourseCard key={idx} course={course} />
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
                className="w-9 h-9 rounded-[10px] border border-white/10 flex items-center justify-center text-gray-500 hover:border-[#00ff9d] hover:text-[#00ff9d] hover:bg-[#00ff9d]/5 transition-all duration-300 disabled:opacity-30"
              >
                <FeatherIcon icon="chevron-left" size={16} />
              </button>
              <div className="flex gap-1.5">
                {Array.from({ length: totalSlides }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentSlide(i)}
                    className={`transition-all duration-300 rounded-full ${safeSlide === i ? 'w-6 h-2 bg-[#00ff9d]' : 'w-2 h-2 bg-white/20 hover:bg-white/40'}`}
                  />
                ))}
              </div>
              <button
                onClick={handleNext}
                disabled={safeSlide === totalSlides - 1}
                className="w-9 h-9 rounded-[10px] border border-white/10 flex items-center justify-center text-gray-500 hover:border-[#00ff9d] hover:text-[#00ff9d] hover:bg-[#00ff9d]/5 transition-all duration-300 disabled:opacity-30"
              >
                <FeatherIcon icon="chevron-right" size={16} />
              </button>
            </div>
          )}
        </div>

        {/* Desktop Footer Pagination */}
        <ScrollReveal direction="up" delay={0.4}>
          <div className="hidden md:flex items-center justify-center gap-4 mt-16">
            <button className="w-12 h-12 rounded-[10px] border border-white/10 flex items-center justify-center text-gray-500 hover:border-[#00ff9d] hover:text-[#00ff9d] hover:bg-[#00ff9d]/5 transition-all duration-300">
              <FeatherIcon icon="chevron-left" size={20} />
            </button>
            <div className="flex gap-2">
              <button className="w-12 h-12 rounded-[10px] bg-gradient-to-br from-[#00ff9d] to-[#01c67c] text-force-white flex items-center justify-center font-black text-sm shadow-[0_10px_20px_rgba(0,255,157,0.3)]">1</button>
              <button className="w-12 h-12 rounded-[10px] border border-white/10 flex items-center justify-center text-gray-500 hover:border-[#00ff9d] hover:text-[#00ff9d] hover:bg-[#00ff9d]/5 transition-all duration-300 font-black text-sm">2</button>
              <button className="w-12 h-12 rounded-[10px] border border-white/10 flex items-center justify-center text-gray-500 hover:border-[#00ff9d] hover:text-[#00ff9d] hover:bg-[#00ff9d]/5 transition-all duration-300 font-black text-sm">3</button>
            </div>
            <button className="w-12 h-12 rounded-[10px] border border-white/10 flex items-center justify-center text-gray-500 hover:border-[#00ff9d] hover:text-[#00ff9d] hover:bg-[#00ff9d]/5 transition-all duration-300">
              <FeatherIcon icon="chevron-right" size={20} />
            </button>
          </div>
        </ScrollReveal>

      </div>
    </section>
  );
};

export default CoursesSection;
