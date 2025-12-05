import React from "react";
import { Link } from "react-router-dom";

const H3StationLanding: React.FC = () => {
  return (
    <div className="landing-h3station">
      {/* Topbar */}
      <div className="landing-topbar">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            <div className="text-2xl font-bold text-yellow-600">H3STATION</div>
            <div className="flex items-center gap-4">
              <Link
                to="/admin/auth/login"
                className="text-gray-700 hover:text-yellow-600 transition-colors"
              >
                Vào trang admin
              </Link>
              <Link
                to="/topup"
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
              >
                Đăng ký ngay
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="landing-hero">
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              H3STATION – Nền tảng VPS & Automation tối ưu cho doanh nghiệp
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Tối ưu quy trình • Tăng tốc vận hành • Tiết kiệm chi phí
            </p>
            <p className="text-lg text-gray-700 mb-10 leading-relaxed">
              H3STATION cung cấp VPS hiệu suất cao, dịch vụ triển khai n8n tự động hoá, cùng hạ tầng server đạt chuẩn dành cho cá nhân & doanh nghiệp: nhanh – mạnh – bảo mật – ổn định 24/7.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/topup"
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all transform hover:scale-105"
              >
                Đăng ký ngay
              </Link>
              <Link
                to="/workflows"
                className="bg-white hover:bg-gray-50 text-yellow-600 border-2 border-yellow-500 px-8 py-4 rounded-lg text-lg font-semibold transition-all transform hover:scale-105"
              >
                Dùng thử n8n miễn phí
              </Link>
              <a
                href="mailto:support@h3station.com"
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-8 py-4 rounded-lg text-lg font-semibold transition-all transform hover:scale-105"
              >
                Liên hệ tư vấn
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Tính năng nổi bật */}
      <section className="landing-features py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
            Tính năng nổi bật
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* VPS Hiệu Năng Cao */}
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                VPS Hiệu Năng Cao
              </h3>
              <ul className="text-gray-600 space-y-2 text-sm">
                <li>• CPU mạnh mẽ, SSD NVMe tốc độ cao</li>
                <li>• Uptime 99.99%</li>
                <li>• Hỗ trợ hệ điều hành Linux/Windows</li>
                <li>• Mạng ổn định, bảo mật đa lớp</li>
              </ul>
            </div>

            {/* Triển khai n8n */}
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-4xl mb-4">🤖</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Triển khai n8n – Tự động hóa toàn diện
              </h3>
              <ul className="text-gray-600 space-y-2 text-sm">
                <li>• Cài đặt n8n trên VPS trong 10 phút</li>
                <li>• Tối ưu workflow cho Marketing, Sale, CRM</li>
                <li>• Kết nối Telegram Bot, Zalo, Email, CRM...</li>
                <li>• Bảo trì – giám sát hệ thống 24/7</li>
              </ul>
            </div>

            {/* An toàn – Bảo mật */}
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-4xl mb-4">🔐</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                An toàn – Bảo mật
              </h3>
              <ul className="text-gray-600 space-y-2 text-sm">
                <li>• Firewall độc lập</li>
                <li>• Chống DDoS</li>
                <li>• Mã hóa SSL</li>
                <li>• Backup định kỳ</li>
              </ul>
            </div>

            {/* Giải pháp doanh nghiệp */}
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-4xl mb-4">⚙️</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Giải pháp dành cho doanh nghiệp
              </h3>
              <ul className="text-gray-600 space-y-2 text-sm">
                <li>• Triển khai hệ thống tự động hóa</li>
                <li>• Chạy tool Marketing, chatbot</li>
                <li>• Hệ thống lưu trữ server riêng tư</li>
                <li>• Hạ tầng cho AI, Automation, SaaS</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Gói dịch vụ & bảng giá */}
      <section className="landing-pricing py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
            Gói dịch vụ & bảng giá
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Gói VPS cá nhân */}
            <div className="bg-white p-8 rounded-xl shadow-lg border-2 border-gray-200 hover:border-yellow-500 transition-all">
              <div className="text-4xl mb-4">💻</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Gói VPS cá nhân
              </h3>
              <p className="text-gray-600 mb-6">
                Phù hợp chạy n8n, tool, bot, website. Giá linh hoạt, khởi điểm thấp. Cấu hình tùy chọn.
              </p>
              <Link
                to="/vps"
                className="block text-center bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Xem chi tiết
              </Link>
            </div>

            {/* Gói VPS doanh nghiệp */}
            <div className="bg-gradient-to-br from-yellow-50 to-white p-8 rounded-xl shadow-lg border-2 border-yellow-500 hover:shadow-xl transition-all">
              <div className="text-4xl mb-4">🏢</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Gói VPS doanh nghiệp
              </h3>
              <p className="text-gray-600 mb-6">
                Tối ưu load lớn. Hỗ trợ cloud riêng (Private Cloud). SLA 99.99% – ưu tiên hỗ trợ kỹ thuật.
              </p>
              <Link
                to="/vps"
                className="block text-center bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Xem chi tiết
              </Link>
            </div>

            {/* Gói triển khai n8n Premium */}
            <div className="bg-white p-8 rounded-xl shadow-lg border-2 border-gray-200 hover:border-yellow-500 transition-all">
              <div className="text-4xl mb-4">🤖</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Gói triển khai n8n Premium
              </h3>
              <p className="text-gray-600 mb-6">
                Cài đặt + tối ưu workflow. Kết nối API doanh nghiệp. Bảo trì & hỗ trợ trọn vòng đời.
              </p>
              <a
                href="mailto:support@h3station.com"
                className="block text-center bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Nhận báo giá chi tiết
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Lợi ích khách hàng */}
      <section className="landing-benefits py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
            Lợi ích khách hàng
          </h2>
          <div className="max-w-3xl mx-auto">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-md flex items-start gap-4">
                <span className="text-2xl text-yellow-500">✔</span>
                <p className="text-gray-700 font-medium">
                  Tối ưu nhân sự & chi phí vận hành
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md flex items-start gap-4">
                <span className="text-2xl text-yellow-500">✔</span>
                <p className="text-gray-700 font-medium">
                  Tự động hóa xử lý công việc 24/7
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md flex items-start gap-4">
                <span className="text-2xl text-yellow-500">✔</span>
                <p className="text-gray-700 font-medium">
                  Tăng tốc quy trình, giảm lỗi thủ công
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md flex items-start gap-4">
                <span className="text-2xl text-yellow-500">✔</span>
                <p className="text-gray-700 font-medium">
                  Dễ dùng – dễ mở rộng – không cần IT chuyên sâu
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md flex items-start gap-4 md:col-span-2">
                <span className="text-2xl text-yellow-500">✔</span>
                <p className="text-gray-700 font-medium">
                  Hỗ trợ nhanh chóng, tận tâm
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feedback khách hàng */}
      <section className="landing-testimonials py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
            Feedback khách hàng
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="text-yellow-500 text-4xl mb-4">"</div>
              <p className="text-gray-700 mb-4 italic">
                H3STATION đã giúp chúng tôi tự động hóa toàn bộ quy trình lưu đơn – gửi email – báo cáo doanh số.
              </p>
              <p className="text-gray-900 font-semibold">Doanh nghiệp E-Commerce</p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="text-yellow-500 text-4xl mb-4">"</div>
              <p className="text-gray-700 mb-4 italic">
                VPS ổn định, chạy tool cả tháng không lỗi.
              </p>
              <p className="text-gray-900 font-semibold">Cá nhân Marketing</p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="text-yellow-500 text-4xl mb-4">"</div>
              <p className="text-gray-700 mb-4 italic">
                Giải pháp n8n giúp tiết kiệm 70% chi phí vận hành.
              </p>
              <p className="text-gray-900 font-semibold">Startup SaaS</p>
            </div>
          </div>
        </div>
      </section>

      {/* Cam kết từ H3STATION */}
      <section className="landing-commitments py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
            Cam kết từ H3STATION
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            <div className="bg-white p-6 rounded-xl shadow-md text-center">
              <div className="text-3xl mb-3">🔥</div>
              <p className="text-gray-700 font-semibold">Cam kết uptime 99.99%</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md text-center">
              <div className="text-3xl mb-3">🔥</div>
              <p className="text-gray-700 font-semibold">Hỗ trợ 1-1 24/7</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md text-center">
              <div className="text-3xl mb-3">🔥</div>
              <p className="text-gray-700 font-semibold">Hoàn tiền nếu không hài lòng</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md text-center">
              <div className="text-3xl mb-3">🔥</div>
              <p className="text-gray-700 font-semibold">Bảo mật tuyệt đối dữ liệu khách hàng</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call-to-Action cuối trang */}
      <section className="landing-cta py-20 bg-gradient-to-r from-yellow-500 to-yellow-600">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Sẵn sàng tăng tốc doanh nghiệp của bạn chưa?
            </h2>
            <p className="text-xl text-yellow-50 mb-10">
              Bắt đầu với H3STATION – Hạ tầng số thông minh cho thời đại Automation.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/topup"
                className="bg-white hover:bg-gray-100 text-yellow-600 px-8 py-4 rounded-lg text-lg font-semibold transition-all transform hover:scale-105"
              >
                Dùng thử ngay – Hỗ trợ cài n8n miễn phí!
              </Link>
              <a
                href="mailto:support@h3station.com"
                className="bg-transparent hover:bg-yellow-700 text-white border-2 border-white px-8 py-4 rounded-lg text-lg font-semibold transition-all transform hover:scale-105"
              >
                Liên hệ đội ngũ tư vấn 24/7
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400">
            © 2024 H3STATION. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default H3StationLanding;

