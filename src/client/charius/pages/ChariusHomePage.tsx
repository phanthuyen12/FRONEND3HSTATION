import React, { useEffect } from "react";
import ChariusWrapper from "../ChariusWrapper";

/**
 * Charius HomePage Wrapper
 * 
 * Component này wrap HomePage từ charius-react để tích hợp vào project hiện tại.
 * CSS được scope trong .charius-wrapper để không ảnh hưởng đến project hiện tại.
 * 
 * Để sử dụng:
 * 1. Đảm bảo các dependencies của charius-react đã được cài đặt
 * 2. Import và sử dụng các components từ charius-react
 * 3. Tất cả CSS sẽ được scope trong .charius-wrapper
 */
const ChariusHomePage: React.FC = () => {
  const [mounted, setMounted] = React.useState(false);

  useEffect(() => {
    // Load CSS files của charius-react
    const loadCSS = (href: string) => {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = href;
      link.className = "charius-css"; // Để có thể remove sau này nếu cần
      document.head.appendChild(link);
      return link;
    };

    // Load các CSS files cần thiết
    const cssFiles = [
      "/charius-react/src/css/font-awesome.min.css",
      "/charius-react/src/css/themify-icons.css",
      "/charius-react/src/css/animate.css",
      "/charius-react/src/css/flaticon.css",
    ];

    const loadedLinks = cssFiles.map((file) => {
      // Tạo URL đúng cho Vite dev server
      const href = file.startsWith("/") ? file : `/${file}`;
      return loadCSS(href);
    });

    setMounted(true);

    // Cleanup khi component unmount
    return () => {
      loadedLinks.forEach((link) => {
        if (link.parentNode) {
          link.parentNode.removeChild(link);
        }
      });
    };
  }, []);

  // Tạm thời hiển thị thông báo và hướng dẫn
  // Sau này có thể load component thực sự từ charius-react
  return (
    <ChariusWrapper>
      <div style={{ minHeight: "100vh", padding: "2rem" }}>
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-6">Charius React Integration</h1>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Thông tin tích hợp</h2>
            <p className="mb-4">
              Các components và assets từ charius-react đã được copy vào thư mục{" "}
              <code className="bg-gray-200 px-2 py-1 rounded">src/client/charius/</code>
            </p>
            <ul className="list-disc list-inside space-y-2 mb-4">
              <li>
                <strong>Components:</strong>{" "}
                <code>src/client/charius/components/</code>
              </li>
              <li>
                <strong>Pages:</strong>{" "}
                <code>src/client/charius/pages/</code>
              </li>
              <li>
                <strong>Assets:</strong>{" "}
                <code>src/client/charius/assets/</code>
              </li>
            </ul>
            <p className="mb-4">
              CSS của charius-react được scope trong class{" "}
              <code className="bg-gray-200 px-2 py-1 rounded">.charius-wrapper</code> để không
              ảnh hưởng đến CSS của project hiện tại.
            </p>
            <div className="bg-yellow-50 border border-yellow-200 rounded p-4">
              <p className="font-semibold mb-2">Lưu ý:</p>
              <p>
                Để sử dụng các components từ charius-react, bạn cần:
              </p>
              <ol className="list-decimal list-inside space-y-1 mt-2">
                <li>Convert các components từ JS sang TypeScript (nếu cần)</li>
                <li>Fix import paths để trỏ đúng đến assets</li>
                <li>Đảm bảo các dependencies của charius-react đã được cài đặt</li>
                <li>Wrap các components trong ChariusWrapper để scope CSS</li>
              </ol>
            </div>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Cấu trúc đã tạo</h2>
            <pre className="bg-gray-800 text-green-400 p-4 rounded overflow-x-auto">
{`src/client/charius/
├── components/        # Components từ charius-react
├── pages/           # Pages từ charius-react  
├── assets/          # Images, fonts, CSS, SASS
│   ├── images/
│   ├── fonts/
│   ├── css/
│   └── sass/
├── ChariusWrapper.tsx    # Wrapper để scope CSS
├── charius-styles.scss   # Styles scoped
└── routes.tsx            # Routes cho charius`}
            </pre>
          </div>
        </div>
      </div>
    </ChariusWrapper>
  );
};

export default ChariusHomePage;
