import React, { useState, useRef } from 'react';
import FeatherIcon from 'feather-icons-react';
import ScrollReveal from './ScrollReveal';

const WorkflowSection = () => {
  const [activeTab, setActiveTab] = useState('All');
  const [currentSlide, setCurrentSlide] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);

  const categories = ['All', 'AI-Agent', 'Marketing', 'CRM', 'Social'];

  const workflows = [
    {
      title: "Hệ thống AI Customer Support Tự động",
      category: "AI-Agent",
      nodes: "18 Nodes",
      complexity: "Nâng cao",
      desc: "Tích hợp n8n với OpenAI & Telegram để xử lý yêu cầu khách hàng 24/7.",
      image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=500&auto=format&fit=crop&q=60"
    },
    {
      title: "Tự động hóa Email Marketing & Lead Gen",
      category: "Marketing",
      nodes: "12 Nodes",
      complexity: "Trung bình",
      desc: "Kết nối Google Sheets, Mailchimp và Chatbot để thu thập khách hàng tiềm năng.",
      image: "https://images.unsplash.com/photo-1557200134-90327ee9fafa?w=500&auto=format&fit=crop&q=60"
    },
    {
      title: "Đồng bộ Dữ liệu CRM Đa nền tảng",
      category: "CRM",
      nodes: "24 Nodes",
      complexity: "Chuyên sâu",
      desc: "Luồng công việc tự động đồng bộ khách hàng giữa HubSpot, Salesforce và ERP.",
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&auto=format&fit=crop&q=60"
    },
    {
      title: "Tự động Lên lịch & Đăng bài Social Media",
      category: "Social",
      nodes: "09 Nodes",
      complexity: "Cơ bản",
      desc: "Quản lý luồng nội dung tự động từ Notion lên Facebook, LinkedIn và TikTok.",
      image: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=500&auto=format&fit=crop&q=60"
    }
  ];

  const filteredWorkflows = activeTab === 'All'
    ? workflows
    : workflows.filter(w => w.category === activeTab);

  // Mobile: 2 cards per slide
  const totalSlides = Math.ceil(filteredWorkflows.length / 2);
  const safeSlide = Math.min(currentSlide, totalSlides - 1);

  const handleTabChange = (cat: string) => {
    setActiveTab(cat);
    setCurrentSlide(0);
  };

  const handlePrev = () => setCurrentSlide(s => Math.max(0, s - 1));
  const handleNext = () => setCurrentSlide(s => Math.min(totalSlides - 1, s + 1));

  const WorkflowCard = ({ flow }: { flow: typeof workflows[0] }) => (
    <div className="group bg-[#080d0c] rounded-[32px] border border-white/[0.06] overflow-hidden hover:border-[#ff4d4d]/30 transition-all duration-700 shadow-2xl flex flex-col h-full relative">
      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden">
        <img
          src={flow.image}
          alt={flow.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 opacity-60 group-hover:opacity-100"
        />
        <div className="absolute top-5 left-5 px-3 py-1 bg-[#ff4d4d] text-white text-[8px] font-black uppercase rounded-lg shadow-lg">
          {flow.category}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#080d0c] via-transparent to-transparent opacity-80"></div>
      </div>

      {/* Content */}
      <div className="p-6 md:p-8 flex flex-col flex-grow space-y-4">
        <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-gray-500">
          <div className="flex items-center gap-1.5 hover:text-[#ff4d4d] transition-colors">
            <FeatherIcon icon="share-2" size={12} />
            <span>{flow.nodes}</span>
          </div>
          <div className="w-1 h-1 bg-white/10 rounded-full"></div>
          <div className="flex items-center gap-1.5 hover:text-[#ff4d4d] transition-colors">
            <FeatherIcon icon="activity" size={12} />
            <span>{flow.complexity}</span>
          </div>
        </div>

        <h3 className="text-base md:text-lg font-bold leading-tight group-hover:text-[#ff4d4d] transition-colors duration-300 line-clamp-2 min-h-[2.5rem]">
          {flow.title}
        </h3>

        <p className="text-xs text-gray-400 leading-relaxed line-clamp-3 flex-grow font-medium">
          {flow.desc}
        </p>

        <div className="pt-4 md:pt-6 mt-auto">
          <button className="w-full py-3 md:py-4 rounded-2xl bg-white/5 border border-white/10 text-white text-[10px] font-black uppercase tracking-widest hover:bg-gradient-to-r hover:from-[#ff4d4d] hover:to-[#ff8080] hover:text-white hover:border-transparent transition-all duration-500 transform group-hover:translate-y-0 group-active:scale-95 flex items-center justify-center gap-2">
            Clone Workflow
            <FeatherIcon icon="copy" size={12} />
          </button>
        </div>
      </div>

      {/* Decoration */}
      <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
        <div className="w-8 h-8 rounded-full bg-[#ff4d4d]/10 backdrop-blur-md flex items-center justify-center border border-[#ff4d4d]/20">
          <FeatherIcon icon="zap" size={14} className="text-[#ff4d4d]" />
        </div>
      </div>
    </div>
  );

  return (
    <section className="py-20 md:py-32 bg-[#050807] relative overflow-hidden">
      {/* Background Accent (n8n vibe) */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-600/5 rounded-full blur-[140px] -z-10"></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#ff4d4d]/5 rounded-full blur-[120px] -z-10"></div>

      <div className="container mx-auto px-6 relative z-10">

        {/* Top Header */}
        <ScrollReveal direction="up">
          <div className="text-center space-y-6 mb-16">
            <div className="inline-block px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-[0.2em] text-[#ff4d4d]">
              n8n Automation Engine
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
              Workflow n8n, <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff4d4d] to-[#ff8080]">Automate Future</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-sm md:text-base">
              Tự động hóa mọi tác vụ lặp đi lặp lại với các luồng công việc n8n được thiết kế sẵn. Tiết kiệm thời gian, nhân đôi năng suất.
            </p>

            {/* Tabs Container */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-6">
              <div className="bg-[#0a0f0d]/80 backdrop-blur-md p-1.5 rounded-[10px] border border-white/[0.05] flex flex-wrap justify-center items-center gap-1">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => handleTabChange(cat)}
                    className={`px-5 py-2 rounded-[10px] text-[10px] md:text-xs font-black uppercase tracking-widest transition-all duration-500 ${activeTab === cat ? 'bg-gradient-to-r from-[#ff4d4d] to-[#ff8080] text-white shadow-[0_10px_20px_rgba(255,77,77,0.2)]' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
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
          {filteredWorkflows.map((flow, idx) => (
            <ScrollReveal key={idx} direction="up" delay={idx * 0.1}>
              <WorkflowCard flow={flow} />
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
                  {filteredWorkflows.slice(slideIdx * 2, slideIdx * 2 + 2).map((flow, idx) => (
                    <WorkflowCard key={idx} flow={flow} />
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
                className="w-9 h-9 rounded-[10px] border border-white/10 flex items-center justify-center text-gray-500 hover:border-[#ff4d4d] hover:text-[#ff4d4d] hover:bg-[#ff4d4d]/5 transition-all duration-300 disabled:opacity-30"
              >
                <FeatherIcon icon="chevron-left" size={16} />
              </button>
              <div className="flex gap-1.5">
                {Array.from({ length: totalSlides }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentSlide(i)}
                    className={`transition-all duration-300 rounded-full ${safeSlide === i ? 'w-6 h-2 bg-[#ff4d4d]' : 'w-2 h-2 bg-white/20 hover:bg-white/40'}`}
                  />
                ))}
              </div>
              <button
                onClick={handleNext}
                disabled={safeSlide === totalSlides - 1}
                className="w-9 h-9 rounded-[10px] border border-white/10 flex items-center justify-center text-gray-500 hover:border-[#ff4d4d] hover:text-[#ff4d4d] hover:bg-[#ff4d4d]/5 transition-all duration-300 disabled:opacity-30"
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

export default WorkflowSection;
