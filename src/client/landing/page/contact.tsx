import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './support.css';
import './privacy-policy.css';

const Contact: React.FC = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [interest, setInterest] = useState('Tư vấn khóa học');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      await axios.post('https://api.aetrading.vn/api/client/contacts', { name, phone, interest: `${interest} - ${message}` });
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
          <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 11.5a8.4 8.4 0 01-12 7.6L3 21l1.9-5.6A8.4 8.4 0 1121 11.5z" /></svg>
          Kết Nối Với Chúng Tôi
        </span>
        <h1>LIÊN HỆ <span className="y">AE TRADING</span></h1>
        <p className="sub">Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn. Hãy để lại thông tin, đội ngũ AE Trading sẽ phản hồi sớm nhất.</p>
      </div>

      <div className="wrap">
        {/* Contact Channels */}
        <section className="policy-content">
          <div className="sec-title">Kênh Liên Hệ Trực Tiếp</div>
          <div className="contact-channels-grid">
            <a href="https://www.facebook.com/aetrading9/" target="_blank" rel="noreferrer" className="contact-channel-card">
              <div className="contact-channel-icon" style={{ background: 'rgba(24,119,242,0.12)', color: '#1877f2' }}>
                <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" /></svg>
              </div>
              <div>
                <div className="contact-channel-label">Facebook</div>
                <div className="contact-channel-value">AE Trading</div>
              </div>
            </a>
            <a href="https://www.youtube.com/@aetrading.10x" target="_blank" rel="noreferrer" className="contact-channel-card">
              <div className="contact-channel-icon" style={{ background: 'rgba(255,0,0,0.1)', color: '#ff0000' }}>
                <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M22.54 6.42a2.78 2.78 0 00-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 001.46 6.42 29 29 0 001 12a29 29 0 00.46 5.58A2.78 2.78 0 003.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 001.95-1.95A29 29 0 0023 12a29 29 0 00-.46-5.58z" /><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="white" /></svg>
              </div>
              <div>
                <div className="contact-channel-label">YouTube</div>
                <div className="contact-channel-value">@aetrading.10x</div>
              </div>
            </a>
            <a href="mailto:traderhoiquan@gmail.com" className="contact-channel-card">
              <div className="contact-channel-icon" style={{ background: 'rgba(245,184,32,0.12)', color: 'var(--gold)' }}>
                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="M22 6l-10 7L2 6" /></svg>
              </div>
              <div>
                <div className="contact-channel-label">Email</div>
                <div className="contact-channel-value">traderhoiquan@gmail.com</div>
              </div>
            </a>
            <a href="tel:0911809909" className="contact-channel-card">
              <div className="contact-channel-icon" style={{ background: 'rgba(62,207,142,0.1)', color: '#3ecf8e' }}>
                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 10.8 19.79 19.79 0 01.01 2.18 2 2 0 012 .01h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" /></svg>
              </div>
              <div>
                <div className="contact-channel-label">Hotline</div>
                <div className="contact-channel-value">0911809909 (Mr Ros)</div>
              </div>
            </a>
            <a href="https://aetrading.vn/" target="_blank" rel="noreferrer" className="contact-channel-card">
              <div className="contact-channel-icon" style={{ background: 'rgba(91,157,255,0.1)', color: '#5b9dff' }}>
                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" /></svg>
              </div>
              <div>
                <div className="contact-channel-label">Website</div>
                <div className="contact-channel-value">aetrading.vn</div>
              </div>
            </a>
            <a href="https://zalo.me/0911809909" target="_blank" rel="noreferrer" className="contact-channel-card">
              <div className="contact-channel-icon" style={{ background: 'rgba(0,120,255,0.1)', color: '#0078ff' }}>
                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 11.5a8.4 8.4 0 01-12 7.6L3 21l1.9-5.6A8.4 8.4 0 1121 11.5z" /></svg>
              </div>
              <div>
                <div className="contact-channel-label">Zalo</div>
                <div className="contact-channel-value">0911809909</div>
              </div>
            </a>
          </div>

          <div className="sec-title" style={{ marginTop: '40px' }}>Giờ Làm Việc</div>
          <div className="work-hours-grid">
            <div className="work-hour-item">
              <span className="work-hour-day">Thứ 2 – Thứ 6</span>
              <span className="work-hour-time">8:00 – 18:00</span>
            </div>
            <div className="work-hour-item">
              <span className="work-hour-day">Thứ 7</span>
              <span className="work-hour-time">8:00 – 12:00</span>
            </div>
            <div className="work-hour-item work-hour-off">
              <span className="work-hour-day">Chủ Nhật</span>
              <span className="work-hour-time">Nghỉ</span>
            </div>
          </div>
        </section>

        {/* Contact Form */}
        <section id="contact-form">
          <div className="consult">
            <div>
              <h2>Gửi yêu cầu cho chúng tôi</h2>
              <p className="lead">Điền thông tin bên cạnh, đội ngũ AE Trading sẽ liên hệ tư vấn và hỗ trợ bạn trong thời gian sớm nhất.</p>
              <span className="pledge">
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>
                Phản hồi trong giờ hành chính, T2–T7
              </span>
              <div className="channels" style={{ marginTop: '24px' }}>
                <a href="https://zalo.me/0911809909" target="_blank" rel="noopener noreferrer" className="ch">
                  <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 11.5a8.4 8.4 0 01-12 7.6L3 21l1.9-5.6A8.4 8.4 0 1121 11.5z" /></svg>
                  Nhắn Zalo ngay
                </a>
                <a href="https://www.facebook.com/aetrading9/" target="_blank" rel="noopener noreferrer" className="ch">
                  <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" /></svg>
                  Nhắn Facebook
                </a>
              </div>
            </div>
            <div>
              {!isSubmitted ? (
                <form className="cform" onSubmit={handleSubmit}>
                  <label htmlFor="ct-name">Họ tên</label>
                  <input id="ct-name" type="text" placeholder="Nguyễn Văn A" required value={name} onChange={(e) => setName(e.target.value)} />
                  <label htmlFor="ct-phone">Số điện thoại / Zalo</label>
                  <input id="ct-phone" type="tel" placeholder="09xx xxx xxx" required value={phone} onChange={(e) => setPhone(e.target.value)} />
                  <label htmlFor="ct-email">Email (tuỳ chọn)</label>
                  <input id="ct-email" type="email" placeholder="email@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                  <label htmlFor="ct-topic">Chủ đề</label>
                  <select id="ct-topic" value={interest} onChange={(e) => setInterest(e.target.value)}>
                    <option>Tư vấn khóa học</option>
                    <option>Kích hoạt tài khoản PLUS/PRO</option>
                    <option>Hỗ trợ kỹ thuật</option>
                    <option>Hợp tác kinh doanh</option>
                    <option>Khác</option>
                  </select>
                  <label htmlFor="ct-msg">Nội dung</label>
                  <textarea
                    id="ct-msg"
                    placeholder="Mô tả ngắn gọn vấn đề bạn cần hỗ trợ..."
                    rows={3}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    style={{
                      background: 'var(--bg)',
                      border: '1px solid var(--line-2)',
                      borderRadius: 'var(--r-sm)',
                      padding: '13px 15px',
                      color: 'var(--txt)',
                      fontSize: '14px',
                      fontFamily: 'inherit',
                      resize: 'vertical',
                      width: '100%',
                      outline: 'none',
                      transition: '0.2s',
                    }}
                  />
                  <button type="submit" className="submit" disabled={isLoading}>
                    {isLoading ? 'Đang gửi...' : 'Gửi liên hệ'}
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

export default Contact;
