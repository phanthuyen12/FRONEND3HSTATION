import React from "react";

// Render full static landing từ gốc weepn (đã copy vào public/weepn)
// Dùng iframe để giữ nguyên CSS/JS và bố cục gốc, tránh xung đột với app styles.
const WeepnLanding: React.FC = () => {
  return (
    <div className="w-full h-screen bg-slate-900">
      <iframe
        title="Weepn Landing"
        src="/weepn/index.html"
        className="w-full h-full border-0"
        sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
      />
    </div>
  );
};

export default WeepnLanding;





