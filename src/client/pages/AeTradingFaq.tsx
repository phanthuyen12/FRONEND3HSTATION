import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

/**
 * Hiển thị trang Trung tâm hỗ trợ AE Trading (HTML tĩnh)
 * bằng iframe để giữ nguyên CSS/JS gốc.
 * Lắng nghe message từ iframe để điều hướng trong app.
 */
const AeTradingFaq: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleIframeMessage = (event: MessageEvent) => {
      if (event.data === "navigate-back") {
        navigate("/landing-courses");
      }
    };
    window.addEventListener("message", handleIframeMessage);
    return () => {
      window.removeEventListener("message", handleIframeMessage);
    };
  }, [navigate]);

  return (
    <div className="w-full min-h-screen bg-[#0a0a0b]">
      <iframe
        title="AE Trading - Trung tâm hỗ trợ"
        src="/ae-trading-support.html?v=account-classification-20260711"
        className="w-full min-h-screen border-0"
        sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
      />
    </div>
  );
};

export default AeTradingFaq;
