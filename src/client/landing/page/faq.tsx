import React, { useState } from 'react';
import FeatherIcon from 'feather-icons-react';
import { Link } from 'react-router-dom';
import HostingLayout from '../layouts/HostingLayout';
import { supportService } from '../../../config';
import { defaultSupportContent } from '../data/supportContent';

const FAQPage = () => {
  const [openIndex, setOpenIndex] = useState(0);
  const [content, setContent] = React.useState(defaultSupportContent);

  React.useEffect(() => {
    supportService
      .getSupportContent()
      .then((payload) => setContent(payload))
      .catch(() => undefined);
  }, []);

  return (
    <HostingLayout>
      <section className="px-6 pb-8 pt-6 md:pb-10 md:pt-10">
        <div className="mx-auto max-w-7xl rounded-[30px] border border-[#FCD34D]/20 bg-[radial-gradient(circle_at_top_right,rgba(252,211,77,0.16),transparent_34%),rgba(7,12,11,0.96)] p-8 shadow-[0_28px_90px_rgba(0,0,0,0.26)] md:p-10">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#FCD34D]/25 bg-[#FCD34D]/10 px-4 py-2 text-[11px] font-black uppercase tracking-[0.28em] text-[#FCD34D]">
            <FeatherIcon icon="help-circle" size={14} />
            FAQ / Trung tâm hỗ trợ
          </div>
          <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr] lg:items-end">
            <div>
              <h1 className="max-w-3xl text-3xl font-black leading-tight text-white md:text-5xl">
                Các câu hỏi thường gặp trước khi cần mở ticket hỗ trợ
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-8 text-slate-300 md:text-lg">
                Trang này gom các tình huống phổ biến nhất về tài khoản, thanh toán, quyền truy cập, workflow và VPS để bạn tìm ra hướng xử lý nhanh hơn.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { icon: 'shield', label: 'Tài khoản', value: 'Đăng nhập, quyền truy cập' },
                { icon: 'credit-card', label: 'Thanh toán', value: 'Số dư, đối soát giao dịch' },
                { icon: 'server', label: 'Hạ tầng', value: 'VPS, workflow, automation' },
              ].map((item) => (
                <div key={item.label} className="rounded-[24px] border border-white/10 bg-white/[0.04] p-5">
                  <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-[#FCD34D]/12 text-[#FCD34D]">
                    <FeatherIcon icon={item.icon} size={18} />
                  </div>
                  <div className="text-xs font-black uppercase tracking-[0.22em] text-slate-400">{item.label}</div>
                  <div className="mt-2 text-sm font-bold leading-6 text-white">{item.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-8 md:py-12">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-4">
            <div className="rounded-[28px] border border-white/10 bg-white/[0.035] p-7 md:p-8">
              <div className="text-xs font-black uppercase tracking-[0.24em] text-slate-400">Bạn nên chuẩn bị gì?</div>
              <div className="mt-5 space-y-4">
                {[
                  'Email hoặc tên tài khoản đang dùng.',
                  'Mã giao dịch, mã đơn hoặc ảnh chụp lỗi.',
                  'Thời điểm bắt đầu phát sinh lỗi và thao tác đã thử.',
                ].map((item) => (
                  <div key={item} className="flex gap-3 rounded-2xl border border-white/8 bg-black/10 p-4">
                    <div className="mt-0.5 text-[#FCD34D]">
                      <FeatherIcon icon="check-circle" size={18} />
                    </div>
                    <p className="text-sm leading-7 text-slate-300">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[28px] border border-[#FCD34D]/18 bg-[#FCD34D]/8 p-7 md:p-8">
              <div className="text-xs font-black uppercase tracking-[0.24em] text-[#FCD34D]">Không thấy câu trả lời?</div>
              <h2 className="mt-3 text-2xl font-black text-white">Chuyển sang trang liên hệ</h2>
              <p className="mt-3 text-sm leading-7 text-slate-300">
                Nếu trường hợp của bạn cần kiểm tra theo tài khoản hoặc theo giao dịch cụ thể, hãy gửi yêu cầu với đầy đủ bối cảnh để đội ngũ hỗ trợ tiếp nhận chính xác hơn.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  to="/landing-contact"
                  className="inline-flex items-center gap-2 rounded-2xl bg-[#FCD34D] px-4 py-3 text-xs font-black uppercase tracking-[0.22em] text-black transition-all hover:brightness-110"
                >
                  Đi tới liên hệ
                  <FeatherIcon icon="arrow-right" size={14} />
                </Link>
                <Link
                  to="/landing-policy"
                  className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 text-xs font-black uppercase tracking-[0.22em] text-white transition-all hover:border-[#FCD34D]/35 hover:text-[#FCD34D]"
                >
                  Xem chính sách
                </Link>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {content.faqItems.map((faq, index) => {
              const isOpen = openIndex === index;
              return (
                <div
                  key={faq.question}
                  className={`rounded-[26px] border transition-all duration-300 ${
                    isOpen
                      ? 'border-[#FCD34D]/28 bg-[#FCD34D]/6 shadow-[0_20px_50px_rgba(252,211,77,0.08)]'
                      : 'border-white/10 bg-white/[0.035] hover:border-white/20'
                  }`}
                >
                  <button
                    type="button"
                    className="flex w-full items-start justify-between gap-4 px-6 py-6 text-left md:px-7"
                    onClick={() => setOpenIndex(isOpen ? -1 : index)}
                  >
                    <span className={`pr-4 text-base font-black leading-7 md:text-lg ${isOpen ? 'text-[#FCD34D]' : 'text-white'}`}>
                      {faq.question}
                    </span>
                    <span
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border transition-all ${
                        isOpen ? 'border-[#FCD34D] bg-[#FCD34D] text-black' : 'border-white/10 bg-white/[0.05] text-slate-300'
                      }`}
                    >
                      <FeatherIcon icon={isOpen ? 'minus' : 'plus'} size={18} />
                    </span>
                  </button>
                  {isOpen && (
                    <div className="border-t border-white/8 px-6 pb-6 pt-4 md:px-7">
                      <p className="text-sm leading-8 text-slate-300 md:text-base">{faq.answer}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </HostingLayout>
  );
};

export default FAQPage;
