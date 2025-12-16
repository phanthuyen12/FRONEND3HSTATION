import React from "react";

/**
 * Hiển thị nguyên giao diện landing TechXen (đã copy vào public/techxen)
 * bằng iframe để giữ nguyên CSS/JS và tránh xung đột với app chính.
 */
const Landing: React.FC = () => {
  return (
    <div className="w-full h-screen bg-slate-900">
      <iframe
        title="H3Station Landing"
        src="/techxen/index.html"
        className="w-full h-full border-0"
        sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
      />
    </div>
  );
};

export default Landing;
