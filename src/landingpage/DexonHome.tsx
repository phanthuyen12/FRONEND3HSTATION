import React from "react";

/**
 * Trang root cho landing Dexon.
 * 
 * Sau khi copy source của project `dexon-react` vào thư mục `src/landingpage/`,
 * bạn có thể:
 *  - Hoặc import router riêng của Dexon vào đây và render
 *  - Hoặc thay toàn bộ component này bằng `App` của dexon-react
 */
const DexonHome: React.FC = () => {
  return (
    <div style={{ minHeight: "100vh" }}>
      <h1 style={{ textAlign: "center", marginTop: "40px" }}>
        Dexon Landing Placeholder
      </h1>
      <p style={{ textAlign: "center", marginTop: "8px" }}>
        Thay thế component này bằng giao diện chính của project <strong>dexon-react</strong>.
      </p>
    </div>
  );
};

export default DexonHome;











