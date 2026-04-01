import React, { useState } from 'react';
import FeatherIcon from 'feather-icons-react';
import ScrollReveal from './ScrollReveal';

const FAQSection = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: "Web Hosting là gì và tại sao tôi cần nó?",
      a: "Web Hosting là dịch vụ lưu trữ dữ liệu website trên máy chủ kết nối internet. Bạn cần hosting để website của mình có thể hiển thị trực tuyến 24/7 cho khách hàng truy cập."
    },
    {
      q: "Làm thế nào để đăng ký tên miền?",
      a: "Bạn có thể đăng ký tên miền bằng cách tìm kiếm tên mong muốn trên hệ thống của chúng tôi, chọn đuôi phù hợp (.com, .vn...) và hoàn tất quy trình thanh toán."
    },
    {
      q: "Tôi có thể chuyển tên miền hiện có về dịch vụ của bạn không?",
      a: "Hoàn toàn được. Chúng tôi hỗ trợ chuyển tên miền về 3HSTATION một cách nhanh chóng và an toàn kèm theo ưu đãi gia hạn miễn phí 1 năm."
    },
    {
      q: "Bạn có cung cấp chứng chỉ SSL miễn phí không?",
      a: "Có, tất cả các gói hosting của chúng tôi đều được tích hợp sẵn chứng chỉ SSL Let's Encrypt miễn phí và tự động gia hạn hàng năm."
    },
    {
      q: "Tôi có thể nâng cấp gói hosting sau này không?",
      a: "Chắc chắn rồi. Bạn có thể nâng cấp gói hosting bất cứ lúc nào khi nhu cầu website tăng trưởng mà không làm gián đoạn dịch vụ."
    },
    {
      q: "Bạn có chính sách hoàn tiền không?",
      a: "Chúng tôi cam kết hoàn tiền trong vòng 30 ngày nếu dịch vụ không đạt chất lượng như cam kết hoặc bạn không hài lòng."
    }
  ];

  return (
    <section className="py-20 md:py-32 bg-[#040706] relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute inset-0 pointer-events-none -z-10">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#00ff9d]/5 rounded-full blur-[150px]"></div>
        <div className="absolute bottom-0 right-1/4 w-[300px] h-[300px] bg-blue-500/5 rounded-full blur-[120px]"></div>
      </div>

      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">
          
          {/* Left Side - Support Content */}
          <div className="lg:w-1/3">
            <ScrollReveal direction="left">
              <div className="space-y-8 lg:sticky lg:top-32">
                <div className="space-y-5">
                  <span className="inline-flex px-3 py-1.5 bg-[#00ff9d]/10 border border-[#00ff9d]/20 rounded-full text-[10px] font-black uppercase tracking-widest text-[#00ff9d]">
                    FAQ's
                  </span>
                  <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-[1.1]">
                    Got questions?<br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00ff9d] to-blue-400">We've got answers!</span>
                  </h2>
                  <p className="text-gray-400 text-base leading-relaxed">
                    Không tìm thấy câu trả lời bạn cần? Đội ngũ chuyên gia của chúng tôi luôn sẵn sàng hỗ trợ bạn 24/7.
                  </p>
                </div>
                
                <div className="p-8 rounded-[28px] bg-gradient-to-br from-[#00ff9d]/10 to-blue-500/5 border border-[#00ff9d]/20 space-y-6 backdrop-blur-sm">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-[#00ff9d] to-[#01c67c] rounded-2xl flex items-center justify-center shadow-[0_10px_30px_rgba(0,255,157,0.3)] flex-shrink-0">
                      <FeatherIcon icon="headphones" className="text-[#060a09]" size={24} />
                    </div>
                    <div>
                      <p className="font-black text-white text-base">Hỗ trợ 24/7</p>
                      <p className="text-[10px] text-[#00ff9d]/60 font-black uppercase tracking-widest mt-0.5">Always Online</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    Đội ngũ chuyên gia của chúng tôi luôn sẵn sàng giúp đỡ bạn mọi lúc, mọi nơi để đảm bảo website vận hành mượt mà nhất.
                  </p>
                  <button className="flex items-center gap-3 text-[#00ff9d] text-sm font-black group mt-2 hover:gap-4 transition-all duration-300">
                    Liên hệ ngay
                    <div className="w-7 h-7 rounded-full bg-[#00ff9d]/10 border border-[#00ff9d]/30 flex items-center justify-center group-hover:bg-[#00ff9d] group-hover:text-[#060a09] group-hover:border-[#00ff9d] transition-all duration-500">
                      <FeatherIcon icon="arrow-right" size={14} />
                    </div>
                  </button>
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Right Side - Accordion FAQ */}
          <div className="lg:w-2/3 space-y-3">
            {faqs.map((faq, idx) => (
              <ScrollReveal key={idx} direction="right" delay={idx * 0.1}>
                <div 
                  className={`group transition-all duration-500 border rounded-[24px] overflow-hidden cursor-pointer ${
                    activeIndex === idx 
                      ? 'bg-[#00ff9d]/5 border-[#00ff9d]/30 shadow-[0_20px_40px_rgba(0,255,157,0.08)]' 
                      : 'bg-white/[0.02] border-white/[0.06] hover:border-white/20 hover:bg-white/[0.04]'
                  }`}
                  onClick={() => setActiveIndex(activeIndex === idx ? null : idx)}
                >
                  <div className="w-full px-8 py-6 flex items-start justify-between gap-6">
                    <span className={`text-base md:text-lg font-bold transition-colors duration-300 leading-snug ${activeIndex === idx ? 'text-[#00ff9d]' : 'text-gray-200 group-hover:text-white'}`}>
                      {faq.q}
                    </span>
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500 ${activeIndex === idx ? 'bg-[#00ff9d] text-[#060a09] rotate-180 shadow-[0_0_20px_#00ff9d]' : 'bg-white/5 text-gray-400 border border-white/10 group-hover:border-white/30'}`}>
                      <FeatherIcon icon="chevron-down" size={16} strokeWidth={3} />
                    </div>
                  </div>
                  
                  <div 
                    className={`transition-all duration-500 ease-in-out overflow-hidden ${
                      activeIndex === idx ? 'max-h-[250px] opacity-100' : 'max-h-0 opacity-0'
                    }`}
                  >
                    <p className="px-8 pb-8 text-gray-400 leading-relaxed text-sm md:text-base font-medium border-t border-white/5 pt-4">
                      {faq.a}
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};

export default FAQSection;

