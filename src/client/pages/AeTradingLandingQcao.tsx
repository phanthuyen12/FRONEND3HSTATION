import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Swal from "sweetalert2";
import { configService, supportService } from "../../config";
import {
  buildAeTradingLandingShareLink,
  parseAeTradingRefLinks,
  resolveAeTradingRefLink,
  type AeTradingRefLinkItem,
} from "../../helpers/aeTradingRefLinks";
import "./ae-trading-landing-qcao.css";

const AeTradingLandingQcao: React.FC = () => {
  const [searchParams] = useSearchParams();
  const refCode = (searchParams.get("ref") || "default").trim();
  const [refLinks, setRefLinks] = useState<AeTradingRefLinkItem[]>([]);
  const [loadingLinks, setLoadingLinks] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    note: "",
  });

  useEffect(() => {
    let mounted = true;

    const loadConfigs = async () => {
      try {
        const configs = await configService.getConfigs();
        if (!mounted) return;
        setRefLinks(parseAeTradingRefLinks(configs.landing_ref_links));
      } catch (error) {
        console.error("Khong the tai landing ref links:", error);
        if (mounted) {
          setRefLinks(parseAeTradingRefLinks(""));
        }
      } finally {
        if (mounted) {
          setLoadingLinks(false);
        }
      }
    };

    loadConfigs();
    return () => {
      mounted = false;
    };
  }, []);

  const activeRefLink = useMemo(
    () => resolveAeTradingRefLink(refLinks, refCode),
    [refCode, refLinks]
  );

  const sourceLabel = activeRefLink.label || refCode || "Cộng đồng AE Trading";
  const targetUrl = activeRefLink.url || "";
  const sampleShareLink = buildAeTradingLandingShareLink(window.location.origin, refCode || "zalo");

  const openRegisterModal = () => {
    if (!targetUrl) {
      Swal.fire("Chưa cấu hình link", "Admin chưa thiết lập link đích cho ref này.", "warning");
      return;
    }
    setIsModalOpen(true);
  };

  const closeRegisterModal = () => {
    if (submitting) return;
    setIsModalOpen(false);
  };

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) return "Vui lòng nhập họ tên";
    if (!formData.email.trim()) return "Vui lòng nhập email";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      return "Email không hợp lệ";
    }
    if (!formData.phone.trim()) return "Vui lòng nhập số điện thoại";

    const phoneDigits = formData.phone.replace(/\D/g, "");
    if (phoneDigits.length < 10 || phoneDigits.length > 11) {
      return "Số điện thoại cần từ 10 đến 11 số";
    }

    return null;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const errorMessage = validateForm();

    if (errorMessage) {
      Swal.fire("Thiếu thông tin", errorMessage, "warning");
      return;
    }

    try {
      setSubmitting(true);

      await supportService.createContactRequest({
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        topic: `Đăng ký tham gia ${sourceLabel}`,
        message: [
          "Đăng ký từ landing quảng cáo AE Trading.",
          `Ref: ${refCode || "default"}`,
          `Kênh: ${sourceLabel}`,
          `Link đích: ${targetUrl}`,
          formData.note.trim() ? `Ghi chú: ${formData.note.trim()}` : "",
        ]
          .filter(Boolean)
          .join("\n"),
        sourcePage: "ae-trading-landing-qcao",
        refCode: refCode || "default",
        redirectUrl: targetUrl,
      });

      await Swal.fire({
        icon: "success",
        title: "Đã ghi nhận đăng ký",
        text: "Hệ thống sẽ đưa bạn đến link tham gia ngay bây giờ.",
        timer: 1400,
        timerProgressBar: true,
        showConfirmButton: false,
      });

      window.location.assign(targetUrl);
    } catch (error: any) {
      console.error("Gui dang ky AE Trading that bai:", error);
      Swal.fire(
        "Gửi đăng ký thất bại",
        error?.message || "Không thể lưu thông tin lúc này. Vui lòng thử lại.",
        "error"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="ae-qcao-page">
      <div className="ae-qcao-haze haze" />

      <header className="ae-qcao-header">
        <div className="ae-qcao-wrap wrap">
          <nav className="ae-qcao-nav nav">
            <div className="ae-qcao-brand brand">
              <span className="ae">AE</span>
              <span className="t">Trading</span>
            </div>
            <span className="ae-qcao-pill pill">
              {loadingLinks ? "Đang tải kênh..." : `◆ FinAI · Phát sóng mỗi ngày`}
            </span>
          </nav>
        </div>
      </header>

      <main className="ae-qcao-main">
        <div className="ae-qcao-wrap wrap">
          <section className="ae-qcao-hero hero">
            <span className="ae-qcao-eyebrow eyebrow">
              <span className="diamond" /> Cộng đồng ứng dụng AI trong Trading
            </span>
            <h1>
              Trader thời đại mới:
              <br />
              <span className="hl">Vàng, AI và Kỷ luật</span>
            </h1>
            <p className="lead">
              AE Trading là cộng đồng <b>ứng dụng AI (FinAI) hỗ trợ lệnh</b> giao dịch, được dẫn dắt bởi <b>đội ngũ admin 8 năm kinh nghiệm thực chiến</b> — Live Trading mỗi ngày, chuyên đề, challenge và nền tảng E-Learning sẵn sàng để bạn giao dịch thông minh hơn.
            </p>
            <div className="cta-row">
              <button type="button" className="ae-qcao-btn ae-qcao-btn-primary" onClick={openRegisterModal}>
                {activeRefLink.buttonText || "Tham gia cộng đồng"} →
              </button>
              <a href="#lich" className="ae-qcao-btn ae-qcao-btn-ghost">
                Xem lịch phát sóng
              </a>
            </div>



            <div className="trust">
              <div className="stat">
                <div className="num">8 năm</div>
                <div className="lbl">Admin thực chiến</div>
              </div>
              <div className="stat">
                <div className="num">FinAI</div>
                <div className="lbl">AI hỗ trợ lệnh</div>
              </div>
              <div className="stat">
                <div className="num">0đ</div>
                <div className="lbl">Phí tham gia</div>
              </div>
            </div>
          </section>
        </div>

        <div className="ae-qcao-wrap wrap">
          <section>
            <div className="sec-head">
              <span className="tag">Vì sao tham gia</span>
              <h2>
                Trading thời đại <em>AI</em>
              </h2>
              <p>
                Làm chủ từng lệnh giao dịch — từ điểm vào chất lượng đến lý do tại sao buy/sell. Kiến tạo dòng tiền thứ 2 từ trading hoàn toàn chủ động.
              </p>
            </div>
            <div className="grid">
              <div className="card">
                <div className="ic gold">📈</div>
                <h3>FinAI Live Trading</h3>
                <p>Vào lệnh trực tiếp 10:00 & 20:30 mỗi ngày cùng admin, với AI hỗ trợ phân tích thị trường.</p>
              </div>
              <div className="card">
                <div className="ic gold">📰</div>
                <h3>Điểm tin 15 phút</h3>
                <p>Bản tin nhanh 08:30 Thứ 2 & Thứ 4 — nắm tin tức ảnh hưởng giá vàng đầu phiên.</p>
              </div>
              <div className="card">
                <div className="ic purple">🎓</div>
                <h3>Chuyên đề hằng tuần</h3>
                <p>Chuyên đề chuyên sâu 13:00 Thứ 3 & Thứ 6 về tâm lý, quản lý vốn và tư duy nghề trading.</p>
              </div>
              <div className="card">
                <div className="ic orange">🤖</div>
                <h3>Challenge FinAI</h3>
                <p>Live FIN 14:00 Thứ 4 & Thứ 5 — thử thách giao dịch cùng AI theo thời gian thực.</p>
              </div>
              <div className="card">
                <div className="ic blue">🤝</div>
                <h3>Mastermind cuối tuần</h3>
                <p>Tổng kết tuần, review lệnh & đúc kết bài học cùng cộng đồng vào Chủ Nhật.</p>
              </div>
              <div className="card">
                <div className="ic red">🎓</div>
                <h3>Nền tảng E-Learning</h3>
                <p>Hệ thống học tập bài bản có sẵn, học mọi lúc theo lộ trình từ cơ bản đến nâng cao.</p>
              </div>
            </div>
          </section>
        </div>

        <div className="ae-qcao-wrap wrap">
          <section id="lich">
            <div className="sec-head">
              <span className="tag">Lịch trong tuần</span>
              <h2>
                Một tuần cùng <em>AE Trading</em>
              </h2>
              <p>Học thực chiến từng khung giờ — mỗi chương trình phù hợp từng trình độ, từ căn bản đến nâng cao.</p>
            </div>
            <div className="sched">
              <div className="sched-row">
                <div className="time">08:30</div>
                <div className="info">
                  <div className="name">Điểm tin 15 phút</div>
                  <div className="desc">Tin tức ảnh hưởng giá vàng đầu phiên</div>
                </div>
                <span className="badge gold">T2 · T4</span>
              </div>
              <div className="sched-row">
                <div className="time">10:00</div>
                <div className="info">
                  <div className="name">FinAI – Live Trading</div>
                  <div className="desc">Vào lệnh trực tiếp cùng AI</div>
                </div>
                <span className="badge gold">T2 → T6</span>
              </div>
              <div className="sched-row">
                <div className="time">13:00</div>
                <div className="info">
                  <div className="name">Chuyên đề hằng tuần</div>
                  <div className="desc">Tâm lý · quản lý vốn · tư duy nghề</div>
                </div>
                <span className="badge purple">T3 · T6</span>
              </div>
              <div className="sched-row">
                <div className="time">14:00</div>
                <div className="info">
                  <div className="name">Challenge FIN AI – Live FIN</div>
                  <div className="desc">Thử thách giao dịch cùng AI</div>
                </div>
                <span className="badge orange">T4 · T5</span>
              </div>
              <div className="sched-row">
                <div className="time">20:00</div>
                <div className="info">
                  <div className="name">Mastermind – Tổng kết tuần</div>
                  <div className="desc">Review lệnh & đúc kết bài học</div>
                </div>
                <span className="badge blue">Chủ Nhật</span>
              </div>
              <div className="sched-row">
                <div className="time">20:30</div>
                <div className="info">
                  <div className="name">FinAI – Live Trading</div>
                  <div className="desc">Phiên giao dịch tối cùng AI</div>
                </div>
                <span className="badge gold">T2 → T6</span>
              </div>
            </div>
            <p className="sched-note">◆ Lịch cập nhật mỗi tuần trong cộng đồng</p>
          </section>
        </div>

        <div className="ae-qcao-wrap wrap">
          <section id="join">
            <div className="final">
              <span className="free">◆ MIỄN PHÍ THAM GIA</span>
              <h2>
                Sẵn sàng giao dịch
                <br />
                cùng <em>AI & đội ngũ admin?</em>
              </h2>
              <p>
                Điền form nhanh để hệ thống lưu lead từ campaign <b>{refCode || "default"}</b>, sau đó tham gia cộng đồng AE Trading để nhận lịch live, học cách dùng FinAI hỗ trợ lệnh và đồng hành cùng đội ngũ 8 năm thực chiến mỗi ngày.
              </p>
              <div className="cta-row">
                <button type="button" className="ae-qcao-btn ae-qcao-btn-primary" onClick={openRegisterModal}>
                  {activeRefLink.buttonText || "Tham gia cộng đồng"} →
                </button>
              </div>
            </div>
          </section>
        </div>
      </main>

      <footer className="ae-qcao-footer footer">
        <div className="ae-qcao-wrap wrap">
          <p className="disc">
            ⚠️ Giao dịch tài chính tiềm ẩn rủi ro. AI chỉ đóng vai trò hỗ trợ phân tích, mọi nội dung mang tính tham khảo, không phải lời khuyên đầu tư. Bạn tự chịu trách nhiệm với quyết định giao dịch của mình.
          </p>
          <p className="sig">Cộng đồng AE Trading · FinAI</p>
        </div>
      </footer>

      {isModalOpen && (
        <div className="ae-qcao-modal-backdrop" onClick={closeRegisterModal}>
          <div className="ae-qcao-modal" onClick={(event) => event.stopPropagation()}>
            <button type="button" className="modal-close" onClick={closeRegisterModal}>
              ×
            </button>
            <div className="modal-head">
              <div className="modal-kicker">Đăng ký trước khi chuyển hướng</div>
              <h3>Tham gia {sourceLabel}</h3>
              <p>
                Điền nhanh thông tin để lưu lead vào hệ thống hỗ trợ, sau đó chúng tôi sẽ
                đưa bạn đến link đích.
              </p>
            </div>

            <form className="modal-form" onSubmit={handleSubmit}>
              <label>
                Họ tên
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  type="text"
                  placeholder="Nguyễn Văn A"
                />
              </label>
              <label>
                Email
                <input
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  type="email"
                  placeholder="ban@example.com"
                />
              </label>
              <label>
                Số điện thoại / Zalo
                <input
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  type="tel"
                  placeholder="0912345678"
                />
              </label>
              <label>
                Ghi chú thêm (tùy chọn)
                <textarea
                  name="note"
                  value={formData.note}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Mục tiêu học, khung giờ có thể tham gia..."
                />
              </label>

              <div className="modal-meta">
                <div>
                  <span>Ref</span>
                  <strong>{refCode || "default"}</strong>
                </div>
                <div>
                  <span>Link đích</span>
                  <strong>{targetUrl || "Chưa cấu hình"}</strong>
                </div>
              </div>

              <button type="submit" className="ae-qcao-btn ae-qcao-btn-primary modal-submit" disabled={submitting}>
                {submitting ? "Đang lưu và chuyển hướng..." : "Lưu thông tin và tham gia ngay"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AeTradingLandingQcao;
