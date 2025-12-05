import React, { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PageBreadcrumb } from "../../../components";
import { expandAdminTopups } from "../../../client/data/adminTopups";

const TopupAdminDetail: React.FC = () => {
  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();

  const record = useMemo(
    () => expandAdminTopups().find((t) => t.code === code),
    [code]
  );

  if (!record) {
    return (
      <>
        <PageBreadcrumb
          title="Chi tiết nạp tiền"
          name="Nạp tiền"
          breadCrumbItems={["Konrix", "Apps", "Nạp tiền"]}
        />
        <div className="card">
          <div className="p-6 text-sm text-slate-600">
            Không tìm thấy giao dịch với mã:{" "}
            <span className="font-mono">{code}</span>.
          </div>
        </div>
      </>
    );
  }

  const statusLabel =
    record.status === "da-duyet"
      ? "Đã duyệt"
      : record.status === "cho-duyet"
      ? "Chờ duyệt"
      : "Đã huỷ";

  return (
    <>
      <PageBreadcrumb
        title="Chi tiết nạp tiền"
        name="Chi tiết nạp tiền"
        breadCrumbItems={["Konrix", "Apps", "Nạp tiền", record.code]}
      />

      <div className="grid lg:grid-cols-3 grid-cols-1 gap-6 mb-6">
        {/* Thông tin user & giao dịch */}
        <div className="lg:col-span-2 card">
          <div className="card-header">
            <h4 className="card-title mb-0">Thông tin giao dịch</h4>
          </div>
          <div className="p-6 space-y-4 text-sm">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-slate-500 mb-1">User</p>
                <p className="font-semibold text-slate-900 dark:text-slate-100">
                  {record.user?.name || record.userId}
                </p>
                <p className="text-[11px] text-slate-500">
                  {record.user?.email}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Mã giao dịch</p>
                <p className="font-mono text-slate-900 dark:text-slate-100">
                  {record.code}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Ngân hàng</p>
                <p className="text-slate-800">{record.bank}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Số tiền</p>
                <p className="text-lg font-semibold text-emerald-600">
                  {record.amount.toLocaleString("vi-VN")}đ
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-slate-500 mb-1">Trạng thái nạp</p>
                <span className="inline-flex px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-100 text-emerald-700">
                  Đã thanh toán (demo)
                </span>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Trạng thái duyệt</p>
                <span className="inline-flex px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-700">
                  {statusLabel}
                </span>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4 text-xs">
              <div>
                <p className="text-slate-500 mb-1">Thời gian tạo</p>
                <p className="text-slate-700">{record.createdAt}</p>
              </div>
              <div>
                <p className="text-slate-500 mb-1">Cập nhật</p>
                <p className="text-slate-700">{record.updatedAt}</p>
              </div>
            </div>

            <button
              type="button"
              className="btn bg-slate-100 text-sm mt-2"
              onClick={() => navigate("/admin/topups")}
            >
              Quay lại danh sách
            </button>
          </div>
        </div>

        {/* Hướng dẫn chuyển khoản (mô phỏng trang client) */}
        <div className="card">
          <div className="card-header">
            <h4 className="card-title mb-0">Thông tin chuyển khoản (demo)</h4>
          </div>
          <div className="p-6 space-y-3 text-xs">
            <p className="text-slate-500">
              Đây là phần mô phỏng giao diện hướng dẫn chuyển khoản giống client
              `/topup/bank`. Bạn có thể thay bằng dữ liệu thực từ hệ thống
              thanh toán.
            </p>
            <div className="space-y-1">
              <p className="text-[11px] text-slate-500">Số tiền</p>
              <p className="text-lg font-semibold text-emerald-600">
                {record.amount.toLocaleString("vi-VN")}đ
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-[11px] text-slate-500">Ngân hàng</p>
              <p className="text-slate-800">Vietcombank (demo)</p>
            </div>
            <div className="space-y-1">
              <p className="text-[11px] text-slate-500">Số tài khoản</p>
              <p className="font-mono text-slate-800">1017898590</p>
            </div>
            <div className="space-y-1">
              <p className="text-[11px] text-slate-500">Nội dung CK</p>
              <p className="font-mono text-slate-800">{record.code}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TopupAdminDetail;















