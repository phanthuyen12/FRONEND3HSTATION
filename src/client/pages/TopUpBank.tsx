import React, { useEffect, useState } from "react";
import { PageBreadcrumb } from "../../components";
import TopupHistorySection from "../components/TopupHistorySection";

const TopUpBank: React.FC = () => {
  const [copied, setCopied] = useState<string | null>(null);

  const handleCopy = (value: string, label: string) => {
    navigator.clipboard.writeText(value);
    setCopied(`Đã sao chép ${label}`);
  };

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(null), 2000);
    return () => clearTimeout(timer);
  }, [copied]);

  return (
    <>
      <PageBreadcrumb
        name="Nạp tiền bằng ngân hàng"
        title="Nạp tiền bằng ngân hàng"
        breadCrumbItems={["Client", "Nạp tiền", "Ngân hàng"]}
      />

      {/* Thanh hướng dẫn thanh toán */}
      <div className="card mb-4 border-0 bg-sky-50 dark:bg-sky-900/40">
        <div className="p-4 flex items-start gap-3 text-xs md:text-sm text-sky-900 dark:text-sky-100">
          <span className="mt-0.5 text-sky-500">
            <i className="mgc_information_line text-lg" />
          </span>
          <p>
            <span className="font-semibold">Hướng dẫn thanh toán:</span> Vui
            lòng chuyển khoản đúng số tiền và nội dung để được cộng tiền tự
            động. Nếu có vấn đề, vui lòng liên hệ hỗ trợ.
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 grid-cols-1 gap-6 mb-6">
        {/* Thông tin chuyển khoản */}
        <div className="lg:col-span-2 card">
          <div className="card-header">
            <h4 className="card-title mb-0">Thông tin chuyển khoản</h4>
          </div>
          <div className="p-6 space-y-4 text-sm">
            <div className="text-xs text-slate-500">
              Mã giao dịch: <span className="font-semibold">261348957</span>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-xs text-slate-500">Số tiền</p>
                <p className="text-xl font-semibold text-emerald-600">
                  60.000đ
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-slate-500">Ngân hàng</p>
                <p className="font-medium text-slate-800">Vietcombank</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-slate-500">Số tài khoản</p>
                <div className="flex items-center gap-2">
                  <p className="font-mono text-slate-800">1017898590</p>
                  <button
                    type="button"
                    className="inline-flex items-center justify-center h-7 px-2 rounded-md border border-slate-200 text-[11px] text-slate-600 hover:bg-slate-50"
                    onClick={() => handleCopy("1017898590", "số tài khoản")}
                  >
                    <i className="mgc_copy_2_line mr-1" />
                    Sao chép
                  </button>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-slate-500">Chủ tài khoản</p>
                <p className="font-medium text-slate-800">
                  NGUYEN TAN THANH
                </p>
              </div>
              <div className="md:col-span-2 space-y-1">
                <p className="text-xs text-slate-500">Nội dung CK</p>
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-mono text-slate-800">261348957</p>
                  <button
                    type="button"
                    className="inline-flex items-center justify-center h-7 px-2 rounded-md border border-slate-200 text-[11px] text-slate-600 hover:bg-slate-50"
                    onClick={() => handleCopy("261348957", "nội dung chuyển khoản")}
                  >
                    <i className="mgc_copy_2_line mr-1" />
                    Sao chép
                  </button>
                  <span className="text-[11px] text-slate-500">
                    Vui lòng ghi đúng nội dung để hệ thống tự động cộng tiền.
                  </span>
                </div>
              </div>
            </div>

            <p className="mt-2 text-xs text-slate-500">
              Nội dung chuyển khoản chỉ áp dụng cho 1 lần chuyển khoản, nếu bạn
              cần nạp thêm vui lòng tạo hóa đơn mới bằng cách nhấn vào nút bên
              dưới.
            </p>

            <button
              type="button"
              className="mt-3 w-full md:w-auto btn bg-rose-50 text-rose-600 border border-rose-100"
            >
              <span className="mr-1">+</span> Tạo hóa đơn mới
            </button>
          </div>
        </div>

        {/* QR thanh toán */}
        <div className="card">
          <div className="card-header">
            <h4 className="card-title mb-0">Quét mã QR để thanh toán</h4>
          </div>
          <div className="p-6 flex flex-col items-center gap-4">
            <div className="w-48 h-48 rounded-xl border border-dashed border-slate-300 flex items-center justify-center bg-slate-50 dark:bg-slate-900/40">
              <span className="text-slate-400 text-xs text-center">
                QR DEMO
                <br />
                (chèn mã VietQR thật sau)
              </span>
            </div>
            <button className="btn btn-sm bg-slate-900 text-white">
              Tải QR về máy
            </button>

            <div className="text-center text-xs text-slate-500 space-y-2">
              <p>Thời gian còn lại để thanh toán</p>
              <div className="flex items-center justify-center gap-6">
                <div>
                  <div className="text-2xl font-semibold text-amber-500">
                    60
                  </div>
                  <div className="text-[11px] uppercase tracking-wide text-slate-500">
                    Phút
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-semibold text-amber-500">
                    03
                  </div>
                  <div className="text-[11px] uppercase tracking-wide text-slate-500">
                    Giây
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lịch sử nạp tiền bên dưới */}
      <TopupHistorySection />

      {/* Toast thông báo sao chép */}
      {copied && (
        <div className="fixed bottom-6 right-6 z-40">
          <div className="px-4 py-2 rounded-lg bg-slate-900 text-white text-xs shadow-lg flex items-center gap-2">
            <i className="mgc_check_circle_line text-emerald-400" />
            <span>{copied}</span>
          </div>
        </div>
      )}
    </>
  );
};

export default TopUpBank;


