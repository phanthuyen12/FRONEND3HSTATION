import React from "react";
import { PageBreadcrumb } from "../../components";

const ToolInstagram: React.FC = () => {
  return (
    <>
      <PageBreadcrumb
        name="Tool Instagram"
        title="Tool Instagram"
        breadCrumbItems={["Client", "Tool", "Instagram"]}
      />

      <div className="card mb-5">
        <div className="p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-lg md:text-xl font-semibold mb-1">
              Tool hỗ trợ nội dung Instagram (demo)
            </h2>
            <p className="text-xs md:text-sm text-slate-500 max-w-2xl">
              Tập trung cho nội dung feed, reels, story: gợi ý concept, bố cục
              và lịch đăng. Hiện chỉ là giao diện demo, chưa nối API.
            </p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 grid-cols-1 gap-4">
        <div className="card">
          <div className="p-5 space-y-2 text-sm">
            <p className="text-xs font-semibold text-pink-500 uppercase">
              Concept reels
            </p>
            <p className="text-slate-600 text-xs">
              Khu vực hiển thị các idea reels, trending sound, outline script.
            </p>
          </div>
        </div>
        <div className="card">
          <div className="p-5 space-y-2 text-sm">
            <p className="text-xs font-semibold text-amber-600 uppercase">
              Gợi ý caption
            </p>
            <p className="text-slate-600 text-xs">
              Sau này có thể kết nối AI để gợi ý caption, hashtag phù hợp insight
              khách hàng.
            </p>
          </div>
        </div>
        <div className="card">
          <div className="p-5 space-y-2 text-sm">
            <p className="text-xs font-semibold text-sky-600 uppercase">
              Lịch đăng & plan
            </p>
            <p className="text-slate-600 text-xs">
              Dùng để lên plan nội dung theo tuần/tháng cho Instagram (demo).
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default ToolInstagram;















