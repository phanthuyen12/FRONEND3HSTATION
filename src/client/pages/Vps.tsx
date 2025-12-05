import React, { useEffect, useState } from "react";
import { PageBreadcrumb } from "../../components";
import { vpsService } from "../../config";
import { VpsPlan } from "../../services/vpsService";

const Vps: React.FC = () => {
  const [plans, setPlans] = useState<VpsPlan[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showOrderModal, setShowOrderModal] = useState<boolean>(false);
  const [selectedPlan, setSelectedPlan] = useState<VpsPlan | null>(null);
  const [ordering, setOrdering] = useState<boolean>(false);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await vpsService.fetchClientPlans();
        setPlans(data);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error("Không thể tải danh sách VPS client", err);
        setError("Không thể tải danh sách gói VPS. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, []);

  const handleSelectPlan = (plan: VpsPlan) => {
    setSelectedPlan(plan);
    setShowOrderModal(true);
  };

  const handleConfirmOrder = async () => {
    if (!selectedPlan) return;
    
    setOrdering(true);
    try {
      await vpsService.createVpsOrder(selectedPlan.id, 'balance');
      setShowOrderModal(false);
      alert('Đơn hàng VPS đã được tạo thành công! Vui lòng đợi admin cấu hình VPS.');
      // Optionally reload plans or redirect
    } catch (err: any) {
      alert(err.message || 'Tạo đơn hàng VPS thất bại. Vui lòng thử lại.');
    } finally {
      setOrdering(false);
    }
  };

  const getPlanPriceDisplay = (plan: VpsPlan): string => {
    const priceValue = typeof plan.price === 'number' 
      ? plan.price 
      : typeof plan.price === 'string' 
      ? parseFloat(plan.price) || 0 
      : 0;
    
    if (isNaN(priceValue) || priceValue <= 0) {
      return "Liên hệ";
    }
    
    return `${priceValue.toLocaleString('vi-VN')}đ`;
  };

  return (
    <>
      <PageBreadcrumb
        name="Gói VPS"
        title="Chọn gói VPS phù hợp"
        breadCrumbItems={["Client", "VPS"]}
      />

      {/* Hero nhỏ tạo điểm nhấn cho trang VPS */}
      <div className="card mb-6">
        <div className="p-5 md:p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-5">
          <div>
            <h2 className="text-2xl md:text-3xl font-semibold mb-2">
              Chọn gói VPS cho dự án của bạn
            </h2>
            <p className="text-slate-500 text-sm md:text-base max-w-2xl">
              Hạ tầng SSD NVMe, băng thông lớn, uptime cao – phù hợp chạy website,
              landing page, API và các dịch vụ nền tảng với chi phí tối ưu.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-3 text-xs md:text-sm">
            <div className="rounded-2xl bg-emerald-50 px-3 py-2 text-emerald-700">
              <p className="font-semibold mb-0.5">99.9% Uptime</p>
              <p className="text-[11px]">
                Hạn chế downtime, phù hợp chạy các ứng dụng quan trọng.
              </p>
            </div>
            <div className="rounded-2xl bg-sky-50 px-3 py-2 text-sky-700">
              <p className="font-semibold mb-0.5">SSD NVMe</p>
              <p className="text-[11px]">
                Tăng tốc độ đọc ghi, tối ưu trải nghiệm người dùng.
              </p>
            </div>
            <div className="rounded-2xl bg-amber-50 px-3 py-2 text-amber-700">
              <p className="font-semibold mb-0.5">Hỗ trợ triển khai</p>
              <p className="text-[11px]">
                Có thể mở rộng, nâng cấp theo nhu cầu sử dụng thực tế.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Thông báo lỗi */}
      {error && (
        <div className="card mb-4 border border-rose-100 bg-rose-50 text-rose-700 text-sm p-4">
          {error}
        </div>
      )}

      {/* Grid hiển thị gói VPS */}
      <div className="grid xl:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-6">
        {loading &&
          !plans.length &&
          Array.from({ length: 3 }).map((_, idx) => (
            <div
              key={`skeleton-${idx}`}
              className="card h-full animate-pulse bg-slate-50/60 dark:bg-slate-800/40"
            >
              <div className="p-5 space-y-3">
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2" />
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/3" />
                <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-full" />
              </div>
              <div className="px-5 pb-5 space-y-2">
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/4" />
                <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-3/4" />
              </div>
            </div>
          ))}

        {!loading && !plans.length && !error && (
          <div className="col-span-full card">
            <div className="p-6 text-sm text-slate-500">
              Hiện tại chưa có gói VPS nào được kích hoạt.
            </div>
          </div>
        )}

        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`card h-full flex flex-col hover:shadow-lg transition-shadow ${
              plan.popular ? "border-primary/50 ring-1 ring-primary/10" : ""
            }`}
          >
            <div className="p-5 pb-4 flex flex-col gap-2">
              <div className="flex items-center justify-between gap-3">
                <h4 className="text-sm md:text-base font-semibold text-slate-900 dark:text-slate-100">
                  {plan.name}
                </h4>
                {plan.discountLabel && (
                  <span className="text-[11px] px-2 py-1 rounded-full bg-violet-600 text-white font-medium whitespace-nowrap">
                    {plan.discountLabel}
                  </span>
                )}
              </div>
              {plan.popular && (
                <span className="inline-flex mt-1 px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-[11px] font-semibold uppercase tracking-wide self-start">
                  Phổ biến nhất
                </span>
              )}
            </div>

            <div className="px-5 pb-4 flex flex-col gap-3 flex-1">
              <div className="flex items-baseline gap-2">
                <span className="font-bold text-2xl md:text-3xl text-slate-900 dark:text-slate-100">
                  {plan.price}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {plan.unit}
                </span>
              </div>

              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Giá tham khảo, có thể thay đổi theo chu kỳ thanh toán. Phù hợp
                cho nhiều nhu cầu khác nhau: website, API, dịch vụ nền tảng.
              </p>
            </div>

            <div className="px-5 pb-5 mt-auto">
              <ul className="space-y-2 text-xs md:text-sm mb-4">
                <li className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                  <i className="mgc_cpu_line text-slate-400" />
                  <span>{plan.cpu}</span>
                </li>
                <li className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                  <i className="mgc_ram_2_line text-slate-400" />
                  <span>{plan.ram}</span>
                </li>
                <li className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                  <i className="mgc_hard_drive_line text-slate-400" />
                  <span>{plan.ssd}</span>
                </li>
                <li className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                  <i className="mgc_inbox_2_line text-slate-400" />
                  <span>{plan.bandwidth}</span>
                </li>
              </ul>
              <button 
                className="btn btn-sm w-full bg-primary/90 hover:bg-primary text-white text-sm font-semibold"
                onClick={() => handleSelectPlan(plan)}
              >
                Chọn gói
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Order Confirmation Modal */}
      {showOrderModal && selectedPlan && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Xác nhận mua gói VPS</h3>
            <div className="space-y-3 mb-6">
              <p className="text-sm text-slate-600">
                <span className="font-medium">Gói VPS:</span> {selectedPlan.name}
              </p>
              <div className="space-y-2 text-sm text-slate-600">
                <div className="flex justify-between">
                  <span>CPU:</span>
                  <span className="font-medium">{selectedPlan.cpu}</span>
                </div>
                <div className="flex justify-between">
                  <span>RAM:</span>
                  <span className="font-medium">{selectedPlan.ram}</span>
                </div>
                <div className="flex justify-between">
                  <span>SSD:</span>
                  <span className="font-medium">{selectedPlan.ssd}</span>
                </div>
                <div className="flex justify-between">
                  <span>Bandwidth:</span>
                  <span className="font-medium">{selectedPlan.bandwidth}</span>
                </div>
              </div>
              <p className="text-sm text-slate-600">
                <span className="font-medium">Giá:</span> {getPlanPriceDisplay(selectedPlan)} / {selectedPlan.unit}
              </p>
              <p className="text-xs text-amber-600">
                Số tiền sẽ được trừ từ tài khoản của bạn. Sau khi thanh toán, vui lòng đợi admin cấu hình VPS.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                className="btn border-slate-200 text-slate-700 flex-1 bg-white"
                onClick={() => {
                  setShowOrderModal(false);
                  setSelectedPlan(null);
                }}
                disabled={ordering}
              >
                Hủy
              </button>
              <button
                className="btn bg-primary text-white flex-1"
                onClick={handleConfirmOrder}
                disabled={ordering}
              >
                {ordering ? "Đang xử lý..." : "Xác nhận mua"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Vps;


