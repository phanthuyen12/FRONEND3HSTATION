import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './support.css';

const faqs = [
  {
    q: "Tôi là Basic, vì sao có khóa bị khóa?",
    a: (
      <>
        Các khóa <strong>PLUS</strong> và <strong>PRO</strong> là nội dung chuyên sâu dành cho thành viên đã tham gia Challenge FIN AI hoặc Mastermind. Là thành viên <strong>Basic</strong>, bạn vẫn được học trọn vẹn các khóa nền tảng và xem thử bài đầu tiên của mọi khóa nâng cao — để cảm nhận trước khi quyết định.
      </>
    )
  },
  {
    q: "Làm sao để kích hoạt tài khoản PLUS?",
    a: (
      <>
        Tài khoản <strong>PLUS</strong> được kích hoạt khi bạn tham gia <strong>Challenge FIN AI</strong>. Bạn chỉ cần để lại thông tin ở mục <em>Yêu cầu tư vấn</em> bên dưới hoặc nhắn Zalo — đội ngũ AE Trading sẽ hướng dẫn và kích hoạt giúp bạn.
      </>
    )
  },
  {
    q: "Tài khoản PRO dành cho ai?",
    a: (
      <>
        Tài khoản <strong>PRO</strong> dành cho thành viên tham gia chương trình <strong>Mastermind (từ $1.000 trở lên)</strong>, mở khóa mentoring thực chiến 1:1 và lộ trình quản trị vốn nâng cao. Đăng ký tư vấn để được tư vấn chi tiết về điều kiện và quyền lợi.
      </>
    )
  },
  {
    q: "Chứng chỉ ở AE Trading có ý nghĩa gì?",
    a: (
      <>
        Chứng chỉ là cách AE Trading <strong>ghi nhận thành tích học tập</strong> và khuyến khích bạn duy trì hành trình học đều đặn. Khi hoàn thành một khóa học, chứng chỉ sẽ hiển thị ngay trong mục <strong>Chứng chỉ đã cấp</strong> trên trang học — đánh dấu một cột mốc bạn đã chinh phục.
      </>
    )
  },
  {
    q: "Sau khi đăng ký tư vấn, bao lâu được phản hồi?",
    a: (
      <>
        Đội ngũ AE Trading phản hồi trong <strong>giờ hành chính (T2–T7)</strong>, thường trong vòng vài giờ làm việc. Nếu cần gấp, bạn có thể nhắn trực tiếp qua <strong>Zalo</strong> để được hỗ trợ nhanh hơn.
      </>
    )
  }
];

const Support: React.FC = () => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  // Form state
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [interest, setInterest] = useState('Tư vấn kích hoạt PLUS (Challenge FIN AI)');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const toggleFaq = (index: number) => {
    if (openFaqIndex === index) {
      setOpenFaqIndex(null);
    } else {
      setOpenFaqIndex(index);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      await axios.post('https://api.aetrading.vn/api/client/contacts', {
        name,
        phone,
        interest
      }); // Assuming backend running on 5001, adjust if needed by standard config.
      // Usually would import API URL from config, but placing standard here or relative path
      // if proxy is used. Let's use relative path for proxy config compatibility.
      // await axios.post('/api/client/contacts', { ... });
      setIsSubmitted(true);
    } catch (error) {
      console.error("Lỗi khi gửi yêu cầu:", error);
      alert("Đã xảy ra lỗi khi gửi form. Vui lòng thử lại sau.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="support-page">
      <div className="topbar">
        <div className="wrap topbar-inner">
          <div className="brand">
            <div className="brand-mark">AE</div>
            <div>AE TRADING<small>TOGETHER WE WIN</small></div>
          </div>
          <Link to="/" className="back">
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M19 12H5m7-7l-7 7 7 7" /></svg>
            Về trang học
          </Link>
        </div>
      </div>

      <div className="hero">
        <span className="eyebrow">
          <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 2a10 10 0 100 20 10 10 0 000-20z" /><path d="M9.1 9a3 3 0 015.8 1c0 2-3 3-3 3" /><path d="M12 17h.01" /></svg>
          Trung tâm hỗ trợ
        </span>
        <h1>AE Trading <span className="y">đồng hành</span> cùng bạn</h1>
        <p className="sub">Tìm câu trả lời nhanh, hoặc để đội ngũ tư vấn hỗ trợ bạn nâng cấp tài khoản.</p>
        <div className="search">
          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.3-4.3" /></svg>
          <input type="text" placeholder="Tìm: rank, kích hoạt PLUS, mở khóa học…" aria-label="Tìm kiếm hỗ trợ" />
        </div>
      </div>

      <div className="wrap">
        <section>
          <div className="sec-title">Chọn chủ đề</div>
          <div className="cats">
            <a href="#faq" className="cat">
              <div className="ico"><svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4.5 16.5c-1.5 1.3-2 5-2 5s3.7-.5 5-2c.7-.8.7-2 0-2.8a2 2 0 00-3 0z" /><path d="M12 15l-3-3a22 22 0 014-9 7 7 0 016 6 22 22 0 01-9 4z" /><path d="M9 12H4s.5-3 2-4 5-1 5-1" /><path d="M12 15v5s3-.5 4-2 1-5 1-5" /></svg></div>
              <h3>Bắt đầu học</h3>
              <p>Học từ đâu, cách mở khóa bài học đầu tiên</p>
            </a>
            <a href="#faq" className="cat">
              <div className="ico"><svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 21h6v-6" /><path d="M9 15l6-6" /><path d="M15 9V3h6" /><path d="M3 21L21 3" /></svg></div>
              <h3>Rank thành viên</h3>
              <p>Basic, PLUS và PRO khác nhau thế nào</p>
            </a>
            <a href="#consult" className="cat">
              <div className="ico"><svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M19 8v6M22 11h-6" /></svg></div>
              <h3>Kích hoạt PLUS / PRO</h3>
              <p>Quy trình và điều kiện nâng cấp tài khoản</p>
            </a>
            <a href="#faq" className="cat">
              <div className="ico"><svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="8" r="5" /><path d="M3 21a9 9 0 0118 0" /></svg></div>
              <h3>Tài khoản</h3>
              <p>Đăng nhập, đổi mật khẩu, thông tin cá nhân</p>
            </a>
          </div>
        </section>

        <section id="faq">
          <div className="sec-title">Câu hỏi thường gặp</div>
          <div className="faq-list">
            {faqs.map((faq, index) => (
              <div key={index} className={`faq ${openFaqIndex === index ? 'open' : ''}`}>
                <button aria-expanded={openFaqIndex === index} onClick={() => toggleFaq(index)}>
                  {faq.q}
                  <span className="chev"><svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6" /></svg></span>
                </button>
                <div className="ans" style={{ maxHeight: openFaqIndex === index ? '500px' : '0' }}>
                  <div className="ans-inner">
                    {faq.a}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="consult">
          <div className="consult">
            <div>
              <h2>Cần tư vấn nâng cấp tài khoản?</h2>
              <p className="lead">Để lại thông tin, đội ngũ AE Trading sẽ liên hệ tư vấn và kích hoạt tài khoản PLUS / PRO cho bạn.</p>
              <span className="pledge">
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>
                Phản hồi trong giờ hành chính, T2–T7
              </span>
              <div className="channels">
                <a href="https://zalo.me/SO_ZALO_AE_TRADING" target="_blank" rel="noopener noreferrer" className="ch">
                  <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 11.5a8.4 8.4 0 01-12 7.6L3 21l1.9-5.6A8.4 8.4 0 1121 11.5z" /></svg>
                  Nhắn Zalo
                </a>
                <a href="mailto:support@aetrading.vn" className="ch">
                  <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="M22 6l-10 7L2 6" /></svg>
                  Gửi email
                </a>
              </div>
            </div>
            <div>
              {!isSubmitted ? (
                <form className="cform" onSubmit={handleSubmit}>
                  <label htmlFor="cf-name">Họ tên</label>
                  <input
                    id="cf-name"
                    type="text"
                    placeholder="Nguyễn Văn A"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  <label htmlFor="cf-phone">Số điện thoại / Zalo</label>
                  <input
                    id="cf-phone"
                    type="tel"
                    placeholder="09xx xxx xxx"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                  <label htmlFor="cf-want">Bạn quan tâm tài khoản nào?</label>
                  <select
                    id="cf-want"
                    value={interest}
                    onChange={(e) => setInterest(e.target.value)}
                  >
                    <option>Tư vấn kích hoạt PLUS (Challenge FIN AI)</option>
                    <option>Tư vấn kích hoạt PRO (Mastermind)</option>
                    <option>Chưa rõ, cần tư vấn thêm</option>
                  </select>
                  <button type="submit" className="submit" disabled={isLoading}>
                    {isLoading ? 'Đang gửi...' : 'Yêu cầu tư vấn'}
                  </button>
                  <p className="form-note">Thông tin của bạn được bảo mật theo chính sách AE Trading.</p>
                </form>
              ) : (
                <div className="form-ok show">
                  <svg width="40" height="40" fill="none" stroke="#3ecf8e" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path d="M8 12l3 3 5-6" /></svg>
                  <div className="big">Đã nhận thông tin!</div>
                  <p>Đội ngũ AE Trading sẽ liên hệ với bạn sớm nhất.</p>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>

      <footer className="wrap">
        © 2026 <span className="tag">AE TRADING</span> · Together We Win
      </footer>
    </div>
  );
};

export default Support;
