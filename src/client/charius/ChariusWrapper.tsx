import React, { ReactNode, useEffect } from "react";
import "./charius-styles.scss";

interface ChariusWrapperProps {
  children: ReactNode;
}

/**
 * ChariusWrapper
 * - Bọc toàn bộ trang charius-react để tách biệt layout với phần admin/client chính
 * - Có thể thêm class/body style riêng nếu cần trong tương lai
 */
const ChariusWrapper: React.FC<ChariusWrapperProps> = ({ children }) => {
  useEffect(() => {
    // Có thể set class cho body để style riêng cho charius
    document.body.classList.add("charius-page");

    return () => {
      document.body.classList.remove("charius-page");
    };
  }, []);

  return <div className="charius-wrapper">{children}</div>;
};

export default ChariusWrapper;
