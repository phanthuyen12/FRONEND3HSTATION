import React from "react";
import { PageBreadcrumb } from "../../components";

const ToolTiktok: React.FC = () => {
  return (
    <>
      <PageBreadcrumb
        name="Tool Tiktok"
        title="Tool Tiktok"
        breadCrumbItems={["Client", "Tool", "Tiktok"]}
      />

      <div className="card mb-5">
        <div className="p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-lg md:text-xl font-semibold mb-1">
              Idea & phân tích nội dung Tiktok (demo)
            </h2>
            <p className="text-xs md:text-sm text-slate-500 max-w-2xl">
              Khu vực cho các tool hỗ trợ nội dung Tiktok: ý tưởng video, lịch
              đăng, phân tích view… Hiện chưa kết nối dữ liệu thật.
            </p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 grid-cols-1 gap-4">
        <div className="card">
          <div className="p-5 space-y-2 text-sm">
            <p className="text-xs font-semibold text-violet-600 uppercase">
              Gợi ý idea video
            </p>
            <p className="text-slate-600 text-xs">
              Gợi ý khung nội dung, hook mở đầu, CTA cuối video cho từng ngách.
            </p>
          </div>
        </div>
        <div className="card">
          <div className="p-5 space-y-2 text-sm">
            <p className="text-xs font-semibold text-emerald-600 uppercase">
              Lịch đăng nội dung
            </p>
            <p className="text-slate-600 text-xs">
              Sau này có thể hiển thị lịch post, trạng thái video, ghi chú.
            </p>
          </div>
        </div>
        <div className="card">
          <div className="p-5 space-y-2 text-sm">
            <p className="text-xs font-semibold text-sky-600 uppercase">
              Phân tích hiệu quả
            </p>
            <p className="text-slate-600 text-xs">
              Khu vực để bạn show số liệu view, like, comment, tỉ lệ xem hết
              (demo).
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default ToolTiktok;















