import React from "react";
import { Link } from "react-router-dom";

const H3StationLanding: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-white to-amber-50 text-slate-900">
      {/* Topbar đơn giản */}
      <header className="w-full border-b border-amber-100/60 bg-white/70 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-amber-500 flex items-center justify-center text-white text-sm font-bold">
              H3
            </div>
            <div>
              <p className="text-sm font-semibold tracking-wide">
                H3STATION
              </p>
              <p className="text-[11px] text-slate-500">
                VPS · Automation · n8n
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <Link
              to="/admin"
              className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50"
            >
              Vào trang admin
            </Link>
            <Link
              to="/topup"
              className="px-3 py-1.5 rounded-lg bg-amber-500 text-white font-medium hover:bg-amber-600"
            >
              Đăng ký ngay
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-10 md:py-14 space-y-12 md:space-y-16">
        {/* 1. Hero Section */}
        <section className="grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <p className="inline-flex items-center px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-[11px] font-semibold uppercase tracking-wide mb-3">
              Hạ tầng số cho thời đại Automation
            </p>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-semibold leading-tight mb-3">
              H3STATION – Nền tảng VPS &amp; Automation tối ưu cho doanh nghiệp
            </h1>
            <p className="text-sm md:text-base text-slate-700 mb-3">
              Tối ưu quy trình • Tăng tốc vận hành • Tiết kiệm chi phí
            </p>
            <p className="text-sm md:text-base text-slate-600 mb-5">
              H3STATION cung cấp VPS hiệu suất cao, dịch vụ triển khai n8n tự
              động hoá, cùng hạ tầng server đạt chuẩn dành cho cá nhân &amp;
              doanh nghiệp: nhanh – mạnh – bảo mật – ổn định 24/7.
            </p>
            <div className="flex flex-wrap gap-3 text-xs">
              <Link
                to="/topup"
                className="px-4 py-2 rounded-xl bg-amber-500 text-white font-medium hover:bg-amber-600"
              >
                Đăng ký ngay
              </Link>
              <Link
                to="/workflows"
                className="px-4 py-2 rounded-xl border border-amber-300 text-amber-700 bg-amber-50/60 hover:bg-amber-100"
              >
                Dùng thử n8n (demo workflows)
              </Link>
              <a
                href="mailto:support@h3station.com"
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50"
              >
                Liên hệ tư vấn
              </a>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs md:text-sm">
            <div className="rounded-2xl bg-white shadow-sm border border-amber-100 p-4">
              <p className="text-[11px] font-semibold text-amber-600 uppercase mb-1">
                VPS cho Automation
              </p>
              <p className="text-slate-700 mb-2">
                SSD NVMe, băng thông lớn, uptime 99.99% – tối ưu chạy n8n, bot,
                tool marketing, AI.
              </p>
            </div>
            <div className="rounded-2xl bg-white shadow-sm border border-amber-100 p-4">
              <p className="text-[11px] font-semibold text-amber-600 uppercase mb-1">
                n8n Managed Service
              </p>
              <p className="text-slate-700 mb-2">
                Triển khai, tối ưu, bảo trì n8n trọn gói – không cần đội ngũ IT
                nội bộ.
              </p>
            </div>
            <div className="rounded-2xl bg-white shadow-sm border border-amber-100 p-4 col-span-2">
              <p className="text-[11px] font-semibold text-amber-600 uppercase mb-1">
                Ứng dụng thực tế
              </p>
              <p className="text-slate-700 mb-1">
                Lưu đơn, đồng bộ CRM, gửi email, báo cáo tự động, chatbot, lấy
                dữ liệu đa kênh…
              </p>
            </div>
          </div>
        </section>

        {/* 2. Tính năng nổi bật */}
        <section className="space-y-5">
          <h2 className="text-lg md:text-xl font-semibold">
            Tính năng nổi bật
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="card">
              <div className="p-5 space-y-2">
                <p className="text-xs font-semibold text-amber-600 uppercase">
                  ⚡ VPS Hiệu Năng Cao
                </p>
                <ul className="text-sm text-slate-700 list-disc list-inside space-y-1">
                  <li>CPU mạnh mẽ, SSD NVMe tốc độ cao</li>
                  <li>Uptime 99.99%</li>
                  <li>Hỗ trợ hệ điều hành Linux/Windows</li>
                  <li>Mạng ổn định, bảo mật đa lớp</li>
                </ul>
              </div>
            </div>
            <div className="card">
              <div className="p-5 space-y-2">
                <p className="text-xs font-semibold text-amber-600 uppercase">
                  🤖 Triển khai n8n – Tự động hóa toàn diện
                </p>
                <ul className="text-sm text-slate-700 list-disc list-inside space-y-1">
                  <li>Cài đặt n8n trên VPS trong 10 phút</li>
                  <li>Tối ưu workflow cho Marketing, Sale, CRM</li>
                  <li>
                    Kết nối Telegram Bot, Zalo, Email, CRM, Zoho, Notion…
                  </li>
                  <li>Bảo trì – giám sát hệ thống 24/7</li>
                </ul>
              </div>
            </div>
            <div className="card">
              <div className="p-5 space-y-2">
                <p className="text-xs font-semibold text-amber-600 uppercase">
                  🔐 An toàn – Bảo mật
                </p>
                <ul className="text-sm text-slate-700 list-disc list-inside space-y-1">
                  <li>Firewall độc lập, phân tầng</li>
                  <li>Chống DDoS nhiều lớp</li>
                  <li>Mã hóa SSL</li>
                  <li>Backup định kỳ</li>
                </ul>
              </div>
            </div>
            <div className="card">
              <div className="p-5 space-y-2">
                <p className="text-xs font-semibold text-amber-600 uppercase">
                  ⚙️ Giải pháp dành cho doanh nghiệp
                </p>
                <ul className="text-sm text-slate-700 list-disc list-inside space-y-1">
                  <li>Triển khai hệ thống tự động hóa end‑to‑end</li>
                  <li>Chạy tool Marketing, chatbot, báo cáo tự động</li>
                  <li>Hệ thống lưu trữ server riêng tư</li>
                  <li>Hạ tầng cho AI, Automation, SaaS</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Gói dịch vụ & bảng giá (mô tả) */}
        <section className="space-y-5">
          <h2 className="text-lg md:text-xl font-semibold">
            Gói dịch vụ &amp; bảng giá (mô tả)
          </h2>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div className="card border border-amber-100">
              <div className="p-5 space-y-2">
                <p className="text-xs font-semibold text-amber-600 uppercase">
                  💻 Gói VPS cá nhân
                </p>
                <ul className="text-slate-700 list-disc list-inside space-y-1">
                  <li>Phù hợp chạy n8n, tool, bot, website</li>
                  <li>Giá linh hoạt, khởi điểm thấp</li>
                  <li>Cấu hình tùy chọn</li>
                </ul>
              </div>
            </div>
            <div className="card border border-amber-100">
              <div className="p-5 space-y-2">
                <p className="text-xs font-semibold text-amber-600 uppercase">
                  🏢 Gói VPS doanh nghiệp
                </p>
                <ul className="text-slate-700 list-disc list-inside space-y-1">
                  <li>Tối ưu cho tải lớn &amp; nhiều dịch vụ</li>
                  <li>Hỗ trợ cloud riêng (Private Cloud)</li>
                  <li>SLA 99.99% – ưu tiên hỗ trợ kỹ thuật</li>
                </ul>
              </div>
            </div>
            <div className="card border border-amber-100">
              <div className="p-5 space-y-3">
                <p className="text-xs font-semibold text-amber-600 uppercase">
                  🤖 Gói triển khai n8n Premium
                </p>
                <ul className="text-slate-700 list-disc list-inside space-y-1">
                  <li>Cài đặt + tối ưu workflow theo bài toán</li>
                  <li>Kết nối API doanh nghiệp</li>
                  <li>Bảo trì &amp; hỗ trợ trọn vòng đời</li>
                </ul>
                <button className="px-4 py-2 rounded-xl bg-amber-500 text-white text-xs font-semibold hover:bg-amber-600">
                  Nhận báo giá chi tiết
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Lợi ích khách hàng */}
        <section className="space-y-4">
          <h2 className="text-lg md:text-xl font-semibold">Lợi ích khách hàng</h2>
          <ul className="grid md:grid-cols-2 gap-2 text-sm text-slate-700">
            <li>✔ Tối ưu nhân sự &amp; chi phí vận hành</li>
            <li>✔ Tự động hóa xử lý công việc 24/7</li>
            <li>✔ Tăng tốc quy trình, giảm lỗi thủ công</li>
            <li>✔ Dễ dùng – dễ mở rộng – không cần IT chuyên sâu</li>
            <li>✔ Hỗ trợ nhanh chóng, tận tâm</li>
          </ul>
        </section>

        {/* 5. Feedback khách hàng */}
        <section className="space-y-4">
          <h2 className="text-lg md:text-xl font-semibold">
            Feedback từ khách hàng
          </h2>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div className="card">
              <div className="p-5 space-y-2">
                <p className="text-xs font-semibold text-amber-600 uppercase">
                  Doanh nghiệp E‑Commerce
                </p>
                <p className="text-slate-700 text-sm">
                  “H3STATION đã giúp chúng tôi tự động hóa toàn bộ quy trình lưu
                  đơn – gửi email – báo cáo doanh số.”
                </p>
              </div>
            </div>
            <div className="card">
              <div className="p-5 space-y-2">
                <p className="text-xs font-semibold text-amber-600 uppercase">
                  Cá nhân Marketing
                </p>
                <p className="text-slate-700 text-sm">
                  “VPS ổn định, chạy tool cả tháng không lỗi.”
                </p>
              </div>
            </div>
            <div className="card">
              <div className="p-5 space-y-2">
                <p className="text-xs font-semibold text-amber-600 uppercase">
                  Startup SaaS
                </p>
                <p className="text-slate-700 text-sm">
                  “Giải pháp n8n giúp tiết kiệm 70% chi phí vận hành."
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 6. Cam kết */}
        <section className="space-y-4">
          <h2 className="text-lg md:text-xl font-semibold">Cam kết từ H3STATION</h2>
          <ul className="grid md:grid-cols-2 gap-2 text-sm text-slate-700">
            <li>🔥 Cam kết uptime 99.99%</li>
            <li>🔥 Hỗ trợ 1‑1 24/7</li>
            <li>🔥 Hoàn tiền nếu không hài lòng</li>
            <li>🔥 Bảo mật tuyệt đối dữ liệu khách hàng</li>
          </ul>
        </section>

        {/* 7. CTA cuối trang */}
        <section className="text-center space-y-4 py-6">
          <h2 className="text-lg md:text-xl font-semibold">
            Sẵn sàng tăng tốc doanh nghiệp của bạn chưa?
          </h2>
          <p className="text-sm md:text-base text-slate-600">
            Bắt đầu với H3STATION – Hạ tầng số thông minh cho thời đại
            Automation.
          </p>
          <div className="flex flex-wrap justify-center gap-3 text-xs md:text-sm">
            <Link
              to="/topup"
              className="px-5 py-2 rounded-xl bg-amber-500 text-white font-semibold hover:bg-amber-600"
            >
              Dùng thử ngay – Hỗ trợ cài n8n miễn phí!
            </Link>
            <a
              href="mailto:support@h3station.com"
              className="px-5 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50"
            >
              Liên hệ đội ngũ tư vấn 24/7
            </a>
          </div>
        </section>
      </main>
    </div>
  );
};

export default H3StationLanding;















