import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './support.css';
import './privacy-policy.css';

const Terms: React.FC = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [interest, setInterest] = useState('Thắc mắc về điều khoản');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      await axios.post('https://api.aetrading.vn/api/client/contacts', { name, phone, interest });
      setIsSubmitted(true);
    } catch (error) {
      console.error('Lỗi khi gửi yêu cầu:', error);
      alert('Đã xảy ra lỗi khi gửi form. Vui lòng thử lại sau.');
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
          <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>
          Pháp Lý &amp; Điều Khoản
        </span>
        <h1>ĐIỀU KHOẢN <span className="y">SỬ DỤNG</span></h1>
        <p className="sub">Vui lòng đọc kỹ các điều khoản và điều kiện sử dụng dịch vụ của AE Trading Academy trước khi đăng ký.</p>
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

          <div className="sec-title" style={{ marginTop: '40px' }}>Nội Dung Điều Khoản</div>
          <div className="policy-text">
            <h3>1. CHẤP NHẬN ĐIỀU KHOẢN</h3>
            <p>Bằng việc truy cập và sử dụng website AE Trading Academy, bạn đồng ý tuân thủ các điều khoản và điều kiện được nêu trong tài liệu này. Nếu bạn không đồng ý với bất kỳ điều khoản nào, vui lòng không sử dụng dịch vụ.</p>

            <h3>2. DỊCH VỤ CUNG CẤP</h3>
            <p>AE Trading Academy cung cấp các dịch vụ bao gồm:</p>
            <ul>
              <li>Khóa học trực tuyến về giao dịch tài chính</li>
              <li>Tài liệu học tập và phân tích thị trường</li>
              <li>Chương trình mentoring 1:1 (dành cho thành viên PRO)</li>
              <li>Cộng đồng học viên và trao đổi kinh nghiệm</li>
            </ul>

            <h3>3. QUYỀN VÀ NGHĨA VỤ CỦA HỌC VIÊN</h3>
            <p>Học viên có quyền:</p>
            <ul>
              <li>Truy cập nội dung khóa học tương ứng với gói dịch vụ đã đăng ký</li>
              <li>Nhận hỗ trợ từ đội ngũ AE Trading trong giờ hành chính</li>
              <li>Nhận chứng chỉ hoàn thành khi kết thúc khóa học</li>
            </ul>
            <p>Học viên có nghĩa vụ:</p>
            <ul>
              <li>Không chia sẻ tài khoản hoặc nội dung khóa học cho người khác</li>
              <li>Không sao chép, phân phối hoặc thương mại hóa tài liệu của AE Trading</li>
              <li>Sử dụng kiến thức được học một cách có trách nhiệm và tuân thủ pháp luật</li>
            </ul>

            <h3>4. THANH TOÁN VÀ HOÀN TIỀN</h3>
            <p>Tất cả các giao dịch thanh toán đều được thực hiện qua các kênh chính thức của AE Trading Academy. Chính sách hoàn tiền sẽ được xem xét theo từng trường hợp cụ thể — vui lòng liên hệ đội ngũ hỗ trợ để được tư vấn.</p>

            <h3>5. GIỚI HẠN TRÁCH NHIỆM</h3>
            <p>AE Trading Academy cung cấp kiến thức và kỹ năng giao dịch mang tính giáo dục. Mọi quyết định đầu tư đều thuộc trách nhiệm cá nhân của học viên. AE Trading không chịu trách nhiệm về bất kỳ tổn thất tài chính nào phát sinh từ việc áp dụng kiến thức.</p>

            <h3>6. SỞ HỮU TRÍ TUỆ</h3>
            <p>Toàn bộ nội dung trên website và các khóa học của AE Trading Academy — bao gồm văn bản, hình ảnh, video và tài liệu — đều thuộc quyền sở hữu của AE Trading Academy và được bảo vệ theo quy định của pháp luật về sở hữu trí tuệ.</p>

            <h3>7. THAY ĐỔI ĐIỀU KHOẢN</h3>
            <p>AE Trading Academy có quyền cập nhật các điều khoản này bất kỳ lúc nào. Mọi thay đổi sẽ được thông báo đến học viên qua email hoặc thông báo trực tiếp trên website.</p>

            <h3>8. THÔNG TIN LIÊN HỆ</h3>
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
              <h2>Có thắc mắc về điều khoản?</h2>
              <p className="lead">Để lại thông tin, đội ngũ AE Trading sẽ giải đáp mọi thắc mắc về điều khoản và dịch vụ cho bạn.</p>
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
                  <label htmlFor="tc-name">Họ tên</label>
                  <input id="tc-name" type="text" placeholder="Nguyễn Văn A" required value={name} onChange={(e) => setName(e.target.value)} />
                  <label htmlFor="tc-phone">Số điện thoại / Zalo</label>
                  <input id="tc-phone" type="tel" placeholder="09xx xxx xxx" required value={phone} onChange={(e) => setPhone(e.target.value)} />
                  <label htmlFor="tc-want">Nội dung cần hỗ trợ</label>
                  <select id="tc-want" value={interest} onChange={(e) => setInterest(e.target.value)}>
                    <option>Thắc mắc về điều khoản</option>
                    <option>Hỏi về chính sách hoàn tiền</option>
                    <option>Vấn đề về tài khoản học viên</option>
                    <option>Khác</option>
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

export default Terms;
