import React, { FormEvent, useEffect, useState } from 'react';
import FeatherIcon from 'feather-icons-react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import HostingLayout from '../layouts/HostingLayout';
import { supportService } from '../../../config';
import { defaultSupportContent } from '../data/supportContent';

const initialForm = {
  name: '',
  email: '',
  topic: 'Hỗ trợ tài khoản',
  message: '',
};

const ContactPage = () => {
  const [form, setForm] = useState(initialForm);
  const [content, setContent] = useState(defaultSupportContent);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let mounted = true;

    supportService
      .getSupportContent()
      .then((payload) => {
        if (!mounted) return;
        setContent(payload);
      })
      .catch(() => undefined);

    return () => {
      mounted = false;
    };
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await handleSend();
  };

  const contactChannels = [
    {
      icon: 'mail',
      title: 'Email hỗ trợ',
      value: content.supportEmail,
      description: 'Phù hợp cho yêu cầu cần mô tả đầy đủ, ảnh lỗi hoặc mã giao dịch.',
      href: `mailto:${content.supportEmail}`,
    },
    {
      icon: 'help-circle',
      title: 'FAQ trung tâm hỗ trợ',
      value: 'Xem câu hỏi thường gặp',
      description: 'Tìm nhanh cách xử lý cho các lỗi tài khoản, học tập, VPS và thanh toán.',
      to: '/landing-faq',
    },
    {
      icon: 'shield',
      title: 'Trang chính sách',
      value: 'Xem quy định dịch vụ',
      description: 'Đọc trước các điều khoản về dữ liệu, thanh toán, quyền truy cập và hỗ trợ.',
      to: '/landing-policy',
    },
  ];

  const handleSend = async () => {
    try {
      setSubmitting(true);
      await supportService.createContactRequest({
        ...form,
        sourcePage: 'landing-contact',
      });
      setForm(initialForm);
      await Swal.fire({
        icon: 'success',
        title: 'Đã gửi yêu cầu',
        text: 'Đội ngũ hỗ trợ đã nhận được nội dung của bạn.',
        confirmButtonText: 'Đã hiểu',
      });
    } catch (error: any) {
      await Swal.fire({
        icon: 'error',
        title: 'Gửi yêu cầu thất bại',
        text: error?.message || 'Vui lòng thử lại sau.',
        confirmButtonText: 'Đóng',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <HostingLayout>
      <section className="px-6 pb-8 pt-6 md:pb-12 md:pt-10">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="rounded-[28px] border border-[#FCD34D]/20 bg-[radial-gradient(circle_at_top_left,rgba(252,211,77,0.18),transparent_36%),rgba(7,12,11,0.92)] p-8 shadow-[0_30px_80px_rgba(0,0,0,0.28)] md:p-10">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#FCD34D]/25 bg-[#FCD34D]/10 px-4 py-2 text-[11px] font-black uppercase tracking-[0.28em] text-[#FCD34D]">
              <FeatherIcon icon="life-buoy" size={14} />
              Liên hệ hỗ trợ
            </div>
            <h1 className="max-w-3xl text-3xl font-black leading-tight text-white md:text-5xl">
              Cần hỗ trợ về tài khoản, khóa học, workflow hay VPS?
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-slate-300 md:text-lg">
              Trang này giúp bạn đi đúng điểm tiếp nhận. Hãy gửi đầy đủ ngữ cảnh để đội ngũ {content.domainName} kiểm tra nhanh và phản hồi sát vấn đề hơn.
            </p>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              <div className="rounded-[22px] border border-white/10 bg-white/[0.04] p-5">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FCD34D]/15 text-[#FCD34D]">
                  <FeatherIcon icon="phone-call" size={20} />
                </div>
                <div className="text-xs font-black uppercase tracking-[0.22em] text-slate-400">Hotline cấu hình</div>
                <div className="mt-2 text-sm font-bold text-white">{content.supportPhone}</div>
              </div>
              <div className="rounded-[22px] border border-white/10 bg-white/[0.04] p-5">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-400">
                  <FeatherIcon icon="clock" size={20} />
                </div>
                <div className="text-xs font-black uppercase tracking-[0.22em] text-slate-400">Tiếp nhận</div>
                <div className="mt-2 text-sm font-bold text-white">Ưu tiên lỗi truy cập, thanh toán và dịch vụ đang hoạt động</div>
              </div>
              <div className="rounded-[22px] border border-white/10 bg-white/[0.04] p-5">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-500/15 text-sky-400">
                  <FeatherIcon icon="file-text" size={20} />
                </div>
                <div className="text-xs font-black uppercase tracking-[0.22em] text-slate-400">Chuẩn bị trước</div>
                <div className="mt-2 text-sm font-bold text-white">Mã tài khoản, ảnh lỗi, mã đơn hoặc tên dịch vụ</div>
              </div>
            </div>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-white/[0.035] p-8 shadow-[0_20px_70px_rgba(0,0,0,0.18)]">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.25em] text-slate-300">
              Quy trình đề xuất
            </div>
            <div className="space-y-5">
              {[
                'Mô tả ngắn vấn đề chính bạn đang gặp.',
                'Đính kèm thông tin nhận diện như email, mã đơn, tên khóa học hoặc VPS.',
                'Chọn kênh liên hệ phù hợp để giảm thời gian qua lại.',
              ].map((item, index) => (
                <div key={item} className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-[#FCD34D]/25 bg-[#FCD34D]/10 text-sm font-black text-[#FCD34D]">
                    0{index + 1}
                  </div>
                  <p className="pt-2 text-sm leading-7 text-slate-300">{item}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 rounded-[22px] border border-[#FCD34D]/20 bg-[#FCD34D]/8 p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#FCD34D] text-black">
                  <FeatherIcon icon="zap" size={18} />
                </div>
                <div>
                  <div className="text-sm font-black text-white">Bạn muốn tự xử lý trước?</div>
                  <div className="text-xs text-slate-300">Xem nhanh các câu hỏi thường gặp hoặc đọc chính sách đầy đủ.</div>
                </div>
              </div>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link
                  to="/landing-faq"
                  className="inline-flex items-center gap-2 rounded-2xl bg-[#FCD34D] px-4 py-3 text-xs font-black uppercase tracking-[0.22em] text-black transition-all hover:brightness-110"
                >
                  FAQ
                  <FeatherIcon icon="arrow-right" size={14} />
                </Link>
                <Link
                  to="/landing-policy"
                  className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 text-xs font-black uppercase tracking-[0.22em] text-white transition-all hover:border-[#FCD34D]/35 hover:text-[#FCD34D]"
                >
                  Chính sách
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-8 md:py-12">
        <div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-3">
          {contactChannels.map((channel) => {
            const content = (
              <div className="group h-full rounded-[26px] border border-white/10 bg-white/[0.035] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[#FCD34D]/28 hover:bg-white/[0.05]">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FCD34D]/12 text-[#FCD34D] transition-transform duration-300 group-hover:scale-105">
                  <FeatherIcon icon={channel.icon} size={22} />
                </div>
                <div className="text-xs font-black uppercase tracking-[0.24em] text-slate-400">{channel.title}</div>
                <div className="mt-2 text-lg font-black text-white">{channel.value}</div>
                <p className="mt-3 text-sm leading-7 text-slate-300">{channel.description}</p>
              </div>
            );

            if ('href' in channel) {
              return (
                <a key={channel.title} href={channel.href} className="block">
                  {content}
                </a>
              );
            }

            return (
              <Link key={channel.title} to={channel.to} className="block">
                {content}
              </Link>
            );
          })}
        </div>
      </section>

      <section className="px-6 py-8 md:py-12">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-[30px] border border-white/10 bg-[#07110f] p-7 shadow-[0_25px_80px_rgba(0,0,0,0.2)] md:p-8">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.24em] text-slate-300">
              Gửi yêu cầu
            </div>
            <h2 className="text-2xl font-black text-white md:text-3xl">Soạn sẵn nội dung hỗ trợ</h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">
              Form này sẽ gửi trực tiếp vào backend để đội ngũ hỗ trợ có thể tiếp nhận và theo dõi tập trung hơn.
            </p>

            <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
              <div className="grid gap-4 md:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-xs font-black uppercase tracking-[0.2em] text-slate-400">Họ tên</span>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
                    placeholder="Tên của bạn"
                    className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3.5 text-sm text-white outline-none transition-all placeholder:text-slate-500 focus:border-[#FCD34D]/40"
                  />
                </label>
                <label className="block">
                  <span className="mb-2 block text-xs font-black uppercase tracking-[0.2em] text-slate-400">Email liên hệ</span>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
                    placeholder="ban@example.com"
                    className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3.5 text-sm text-white outline-none transition-all placeholder:text-slate-500 focus:border-[#FCD34D]/40"
                  />
                </label>
              </div>

              <label className="block">
                <span className="mb-2 block text-xs font-black uppercase tracking-[0.2em] text-slate-400">Chủ đề</span>
                <select
                  value={form.topic}
                  onChange={(event) => setForm((prev) => ({ ...prev, topic: event.target.value }))}
                  className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3.5 text-sm text-white outline-none transition-all focus:border-[#FCD34D]/40"
                >
                  <option className="text-black">Hỗ trợ tài khoản</option>
                  <option className="text-black">Thanh toán và số dư</option>
                  <option className="text-black">Khóa học và quyền truy cập</option>
                  <option className="text-black">Workflow và automation</option>
                  <option className="text-black">VPS và hạ tầng</option>
                </select>
              </label>

              <label className="block">
                <span className="mb-2 block text-xs font-black uppercase tracking-[0.2em] text-slate-400">Nội dung</span>
                <textarea
                  value={form.message}
                  onChange={(event) => setForm((prev) => ({ ...prev, message: event.target.value }))}
                  placeholder="Mô tả lỗi, thời điểm phát sinh, mã giao dịch, mã đơn hoặc tên dịch vụ..."
                  rows={7}
                  className="w-full rounded-[24px] border border-white/10 bg-white/[0.04] px-4 py-4 text-sm leading-7 text-white outline-none transition-all placeholder:text-slate-500 focus:border-[#FCD34D]/40"
                />
              </label>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-2 rounded-2xl bg-[#FCD34D] px-5 py-3.5 text-xs font-black uppercase tracking-[0.22em] text-black transition-all hover:brightness-110"
                >
                  {submitting ? 'Đang gửi...' : 'Gửi yêu cầu hỗ trợ'}
                  <FeatherIcon icon="send" size={14} />
                </button>
                <a
                  href={`mailto:${content.supportEmail}`}
                  className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-3.5 text-xs font-black uppercase tracking-[0.22em] text-white transition-all hover:border-[#FCD34D]/35 hover:text-[#FCD34D]"
                >
                  Gửi trực tiếp
                </a>
              </div>
            </form>
          </div>

          <div className="space-y-4">
            <div className="rounded-[30px] border border-white/10 bg-white/[0.035] p-7 md:p-8">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#FCD34D]/20 bg-[#FCD34D]/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.24em] text-[#FCD34D]">
                Mẹo gửi nhanh
              </div>
              <div className="space-y-4">
                {[
                  'Ảnh chụp đầy đủ màn hình lỗi hoặc giao diện đang gặp sự cố.',
                  'Mã đơn nạp tiền, tên khóa học, tên workflow hoặc ID VPS nếu có.',
                  'Các bước bạn đã thử trước đó để đội ngũ không phải hỏi lại từ đầu.',
                ].map((tip) => (
                  <div key={tip} className="flex gap-3 rounded-2xl border border-white/8 bg-black/10 p-4">
                    <div className="mt-0.5 text-[#FCD34D]">
                      <FeatherIcon icon="check-circle" size={18} />
                    </div>
                    <p className="text-sm leading-7 text-slate-300">{tip}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[30px] border border-white/10 bg-white/[0.035] p-7 md:p-8">
              <div className="mb-5 flex items-center justify-between gap-4">
                <div>
                  <div className="text-xs font-black uppercase tracking-[0.22em] text-slate-400">Câu hỏi phổ biến</div>
                  <h3 className="mt-2 text-xl font-black text-white">Bạn có thể cần xem trước</h3>
                </div>
                <Link to="/landing-faq" className="text-sm font-bold text-[#FCD34D]">
                  Xem tất cả
                </Link>
              </div>

              <div className="space-y-3">
                {content.faqItems.slice(0, 3).map((faq) => (
                  <div key={faq.question} className="rounded-2xl border border-white/8 bg-black/10 p-4">
                    <div className="text-sm font-black text-white">{faq.question}</div>
                    <p className="mt-2 text-sm leading-7 text-slate-300">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </HostingLayout>
  );
};

export default ContactPage;
