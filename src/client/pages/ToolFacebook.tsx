import React from "react";
import { PageBreadcrumb } from "../../components";

const ToolFacebook: React.FC = () => {
  return (
    <>
      <PageBreadcrumb
        name="Tool Facebook"
        title="Tool Facebook"
        breadCrumbItems={["Client", "Tool", "Facebook"]}
      />

      <div className="card mb-5">
        <div className="p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-lg md:text-xl font-semibold mb-1">
              Bộ công cụ hỗ trợ Facebook (demo)
            </h2>
            <p className="text-xs md:text-sm text-slate-500 max-w-2xl">
              Khu vực này dành cho các tool liên quan đến Facebook như gợi ý nội
              dung, quản lý camp, check insight… Bạn có thể gắn các workflow
              hoặc API thực tế sau này.
            </p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 grid-cols-1 gap-4">
        <div className="card">
          <div className="p-5 space-y-2 text-sm">
            <p className="text-xs font-semibold text-sky-600 uppercase">
              Gợi ý nội dung
            </p>
            <p className="text-slate-600 text-xs">
              Gợi ý dạng bài cho fanpage, group, profile… (đang là nội dung
              minh hoạ, chưa kết nối AI/API).
            </p>
          </div>
        </div>
        <div className="card">
          <div className="p-5 space-y-2 text-sm">
            <p className="text-xs font-semibold text-emerald-600 uppercase">
              Check insight
            </p>
            <p className="text-slate-600 text-xs">
              Nơi bạn có thể hiển thị các chỉ số chiến dịch, tệp đối tượng
              (demo).
            </p>
          </div>
        </div>
        <div className="card">
          <div className="p-5 space-y-2 text-sm">
            <p className="text-xs font-semibold text-amber-600 uppercase">
              Quản lý camp
            </p>
            <p className="text-slate-600 text-xs">
              Sau này có thể kết nối API để xem, tạm dừng và tối ưu camp ngay
              trong dashboard.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default ToolFacebook;















