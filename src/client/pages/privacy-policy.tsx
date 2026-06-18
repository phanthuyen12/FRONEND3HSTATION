import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { supportService } from '../../config';
import './support.css'; // We can reuse support.css since the layout is identical
import './privacy-policy.css';

const PrivacyPolicy: React.FC = () => {
  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [interest, setInterest] = useState('Liên hệ hỗ trợ');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      await supportService.createContactRequest({
        name,
        email,
        topic: interest,
        message: `So dien thoai/Zalo: ${phone}. Noi dung lien he: ${interest}.`,
        sourcePage: 'client-privacy-policy',
      });
      setIsSubmitted(true);
    } catch (error) {
      console.error("Lỗi khi gửi yêu cầu:", error);
      alert("Đã xảy ra lỗi khi gửi form. Vui lòng thử lại sau.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="support-page privacy-page">
      <div className="topbar">
        <div className="wrap topbar-inner">
          <div className="brand">
            <div className="brand-mark">AE</div>
            <div>AE TRADING<small>TOGETHER WE WIN</small></div>
          </div>
          <Link to="/" className="back">
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M19 12H5m7-7l-7 7 7 7" /></svg>
            Về trang chủ
          </Link>
        </div>
      </div>

      <div className="hero">
        <span className="eyebrow">
          <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
          Trang Bảo Mật Khóa Học
        </span>
        <h1>CHÍNH SÁCH <span className="y">BẢO MẬT</span></h1>
        <p className="sub">Chào mừng bạn đến với website AE Trading Academy. Chúng tôi cam kết bảo vệ thông tin cá nhân và quyền riêng tư của khách hàng.</p>
      </div>

      <div className="wrap">
        <section className="policy-content">
          <div className="sec-title">Thông Tin Liên Hệ</div>
          <div className="contact-info-grid">
            <div className="c-item">
              <strong>Facebook:</strong> <a href="https://www.facebook.com/aetrading9/" target="_blank" rel="noreferrer">AE Trading</a>
            </div>
            <div className="c-item">
              <strong>Youtube:</strong> <a href="https://www.youtube.com/@aetrading.10x" target="_blank" rel="noreferrer">@aetrading.10x</a>
            </div>
            <div className="c-item">
              <strong>Email:</strong> <a href="mailto:traderhoiquan@gmail.com">traderhoiquan@gmail.com</a>
            </div>
            <div className="c-item">
              <strong>Website:</strong> <a href="https://aetrading.vn/" target="_blank" rel="noreferrer">https://aetrading.vn/</a>
            </div>
            <div className="c-item">
              <strong>Hotline:</strong> <a href="tel:0911809909">0911809909 (Mr Ros)</a>
            </div>
          </div>

          <div className="sec-title" style={{ marginTop: '40px' }}>Nội Dung Chính Sách</div>
          <div className="policy-text">
            <h3>1. THÔNG TIN CHÚNG TÔI THU THẬP</h3>
            <p>Khi đăng ký khóa học hoặc sử dụng dịch vụ, AE Trading Academy có thể thu thập các thông tin sau:</p>
            <ul>
              <li>Họ và tên</li>
              <li>Số điện thoại</li>
              <li>Email</li>
            </ul>

            <h3>2. MỤC ĐÍCH SỬ DỤNG THÔNG TIN</h3>
            <p>Thông tin khách hàng được sử dụng nhằm:</p>
            <ul>
              <li>Xác nhận đăng ký khóa học</li>
              <li>Hỗ trợ và chăm sóc học viên</li>
              <li>Gửi thông báo, tài liệu và thông tin liên quan đến khóa học</li>
              <li>Cải thiện chất lượng dịch vụ</li>
            </ul>
            <p>AE Trading Academy cam kết không mua bán hoặc chia sẻ thông tin cá nhân khách hàng cho bên thứ ba vì mục đích thương mại.</p>

            <h3>3. BẢO MẬT THÔNG TIN</h3>
            <p>Chúng tôi áp dụng các biện pháp bảo mật phù hợp để bảo vệ thông tin khách hàng khỏi truy cập trái phép, mất dữ liệu hoặc rò rỉ thông tin.<br />
              Người dùng cũng có trách nhiệm tự bảo mật tài khoản và thông tin cá nhân của mình.</p>

            <h3>4. QUYỀN CỦA NGƯỜI DÙNG</h3>
            <p>Người dùng có quyền:</p>
            <ul>
              <li>Kiểm tra thông tin cá nhân</li>
              <li>Yêu cầu chỉnh sửa hoặc xóa thông tin</li>
              <li>Từ chối nhận thông báo marketing bất kỳ lúc nào</li>
            </ul>

            <h3>5. THAY ĐỔI CHÍNH SÁCH</h3>
            <p>AE Trading Academy có quyền điều chỉnh Chính sách bảo mật để phù hợp với hoạt động vận hành và quy định pháp luật hiện hành.</p>

            <h3>6. THÔNG TIN LIÊN HỆ</h3>
            <p>
              AE Trading Academy<br />
              Email: traderhoiquan@gmail.com<br />
              Hotline: 0911809909<br />
              Website: https://aetrading.vn/<br />
            </p>
            <p style={{ marginTop: '20px', fontStyle: 'italic', color: 'var(--gold)' }}>Xin cảm ơn quý khách đã đồng hành cùng AE Trading Academy.</p>
          </div>
        </section>

        <section id="consult">
          <div className="consult">
            <div>
              <h2>Cần hỗ trợ thêm?</h2>
              <p className="lead">Để lại thông tin, đội ngũ AE Trading sẽ liên hệ tư vấn và giải đáp mọi thắc mắc cho bạn.</p>
              <span className="pledge">
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>
                Phản hồi trong giờ hành chính, T2–T7
              </span>
              <div className="channels">
                <a href="https://zalo.me/0911809909" target="_blank" rel="noopener noreferrer" className="ch">
                  <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 11.5a8.4 8.4 0 01-12 7.6L3 21l1.9-5.6A8.4 8.4 0 1121 11.5z" /></svg>
                  Nhắn Zalo
                </a>
                <a href="mailto:traderhoiquan@gmail.com" className="ch">
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
                  <label htmlFor="cf-email">Email</label>
                  <input
                    id="cf-email"
                    type="email"
                    placeholder="ban@example.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <label htmlFor="cf-want">Vấn đề cần hỗ trợ</label>
                  <select
                    id="cf-want"
                    value={interest}
                    onChange={(e) => setInterest(e.target.value)}
                  >
                    <option>Liên hệ hỗ trợ chung</option>
                    <option>Hỗ trợ về khóa học</option>
                    <option>Thắc mắc về chính sách bảo mật</option>
                  </select>
                  <button type="submit" className="submit" disabled={isLoading}>
                    {isLoading ? 'Đang gửi...' : 'Gửi yêu cầu'}
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

export default PrivacyPolicy;
