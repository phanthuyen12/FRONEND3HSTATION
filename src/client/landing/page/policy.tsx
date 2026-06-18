import React from 'react';
import FeatherIcon from 'feather-icons-react';
import { Link } from 'react-router-dom';
import HostingLayout from '../layouts/HostingLayout';
import { supportService } from '../../../config';
import { defaultSupportContent } from '../data/supportContent';

const PolicyPage = () => {
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
        <div className="mx-auto max-w-7xl rounded-[30px] border border-[#FCD34D]/20 bg-[radial-gradient(circle_at_top_left,rgba(252,211,77,0.16),transparent_34%),rgba(7,12,11,0.96)] p-8 shadow-[0_28px_90px_rgba(0,0,0,0.26)] md:p-10">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#FCD34D]/25 bg-[#FCD34D]/10 px-4 py-2 text-[11px] font-black uppercase tracking-[0.28em] text-[#FCD34D]">
            <FeatherIcon icon="file-text" size={14} />
            Chính sách & điều khoản
          </div>

          <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
            <div>
              <h1 className="max-w-3xl text-3xl font-black leading-tight text-white md:text-5xl">
                Các nguyên tắc sử dụng, dữ liệu và hỗ trợ trong hệ sinh thái 3HSTATION
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-8 text-slate-300 md:text-lg">
                Đây là trang tổng hợp ngắn gọn để người dùng nắm rõ cách nền tảng xử lý thông tin, quyền truy cập dịch vụ, thanh toán và hỗ trợ khi có sự cố.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { icon: 'lock', label: 'Dữ liệu', value: 'Thông tin được dùng đúng mục đích vận hành' },
                { icon: 'book-open', label: 'Nội dung số', value: 'Khóa học và tài nguyên không được phát tán trái phép' },
                { icon: 'credit-card', label: 'Thanh toán', value: 'Đối soát theo giao dịch và trạng thái sử dụng' },
                { icon: 'life-buoy', label: 'Hỗ trợ', value: 'Ưu tiên lỗi ảnh hưởng trực tiếp tới dịch vụ' },
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
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.72fr_1.28fr]">
          <aside className="space-y-4">
            <div className="rounded-[28px] border border-white/10 bg-white/[0.035] p-7 md:sticky md:top-32">
              <div className="text-xs font-black uppercase tracking-[0.24em] text-slate-400">Đi nhanh tới mục</div>
              <div className="mt-5 space-y-2">
                {content.policySections.map((section) => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    className="flex items-center justify-between rounded-2xl border border-white/8 bg-black/10 px-4 py-3 text-sm font-bold text-white transition-all hover:border-[#FCD34D]/28 hover:text-[#FCD34D]"
                  >
                    <span>{section.title}</span>
                    <FeatherIcon icon="arrow-right" size={14} />
                  </a>
                ))}
              </div>
            </div>

            <div className="rounded-[28px] border border-[#FCD34D]/18 bg-[#FCD34D]/8 p-7">
              <div className="text-xs font-black uppercase tracking-[0.24em] text-[#FCD34D]">Lưu ý quan trọng</div>
              <div className="mt-4 space-y-3">
                {content.supportHighlights.map((item) => (
                  <div key={item} className="flex gap-3">
                    <div className="mt-1 text-[#FCD34D]">
                      <FeatherIcon icon="check-circle" size={17} />
                    </div>
                    <p className="text-sm leading-7 text-slate-300">{item}</p>
                  </div>
                ))}
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  to="/landing-contact"
                  className="inline-flex items-center gap-2 rounded-2xl bg-[#FCD34D] px-4 py-3 text-xs font-black uppercase tracking-[0.22em] text-black transition-all hover:brightness-110"
                >
                  Liên hệ hỗ trợ
                </Link>
                <Link
                  to="/landing-faq"
                  className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 text-xs font-black uppercase tracking-[0.22em] text-white transition-all hover:border-[#FCD34D]/35 hover:text-[#FCD34D]"
                >
                  Xem FAQ
                </Link>
              </div>
            </div>
          </aside>

          <div className="space-y-5">
            {content.policySections.map((section) => (
              <section
                key={section.id}
                id={section.id}
                className="scroll-mt-32 rounded-[28px] border border-white/10 bg-white/[0.035] p-7 shadow-[0_20px_60px_rgba(0,0,0,0.14)] md:p-8"
              >
                <div className="text-xs font-black uppercase tracking-[0.22em] text-[#FCD34D]">{section.title}</div>
                <h2 className="mt-3 text-2xl font-black text-white">{section.summary}</h2>
                <div className="mt-5 space-y-4">
                  {section.points.map((point) => (
                    <div key={point} className="flex gap-3 rounded-2xl border border-white/8 bg-black/10 p-4">
                      <div className="mt-0.5 text-[#FCD34D]">
                        <FeatherIcon icon="check" size={18} />
                      </div>
                      <p className="text-sm leading-7 text-slate-300">{point}</p>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </section>
    </HostingLayout>
  );
};

export default PolicyPage;
