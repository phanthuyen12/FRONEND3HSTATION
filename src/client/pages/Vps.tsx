import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageBreadcrumb } from "../../components";
import { vpsService } from "../../config";
import { VpsBillingTerm, VpsPlan } from "../../services/vpsService";

const BILLING_TERM_TABS: { code: string; label: string; discount: number }[] = [
  { code: "1m", label: "1 tháng", discount: 0 },
  { code: "3m", label: "3 tháng", discount: 0 },
  { code: "6m", label: "6 tháng", discount: 0 },
  { code: "12m", label: "1 năm", discount: 0 },
  { code: "24m", label: "2 năm", discount: 15 },
  { code: "36m", label: "3 năm", discount: 20 },
  { code: "60m", label: "5 năm", discount: 25 },
  { code: "120m", label: "10 năm", discount: 30 },
];

const Vps: React.FC = () => {
  const navigate = useNavigate();
  const [plans, setPlans] = useState<VpsPlan[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showOrderModal, setShowOrderModal] = useState<boolean>(false);
  const [selectedPlan, setSelectedPlan] = useState<VpsPlan | null>(null);
  const [ordering, setOrdering] = useState<boolean>(false);
  const [billingTerms, setBillingTerms] = useState<VpsBillingTerm[]>([]);
  const [pricingMap, setPricingMap] = useState<Record<string, VpsBillingTerm[]>>({});
  const [selectedTermCode, setSelectedTermCode] = useState<string>("12m");
  const [autoRenew, setAutoRenew] = useState<boolean>(false);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await vpsService.fetchClientPlans();
        setPlans(data);

        // Tải bảng giá cho tất cả gói để khi đổi chu kỳ hiển thị tức thì
        const entries = await Promise.all(
          data.map(async (plan) => {
            try {
              const pricing = await vpsService.fetchPlanPricing(plan.id);
              return [plan.id, pricing.terms || []] as [string, VpsBillingTerm[]];
            } catch (err) {
              // eslint-disable-next-line no-console
              console.error("Không thể tải pricing cho plan", plan.id, err);
              return [plan.id, []] as [string, VpsBillingTerm[]];
            }
          })
        );
        setPricingMap(Object.fromEntries(entries));
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

  const handleSelectPlan = async (plan: VpsPlan) => {
    setSelectedPlan(plan);
    setShowOrderModal(true);
    setOrdering(false);
    setAutoRenew(false);
    setSelectedTermCode("12m");

    try {
      const existing = pricingMap[plan.id];
      if (existing && existing.length) {
        setBillingTerms(existing);
        return;
      }

      const pricing = await vpsService.fetchPlanPricing(plan.id);
      setBillingTerms(pricing.terms || []);
      setPricingMap((prev) => ({ ...prev, [plan.id]: pricing.terms || [] }));
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("Không thể tải bảng giá theo chu kỳ", err);
      setBillingTerms([]);
    }
  };

  const handleConfirmOrder = async () => {
    if (!selectedPlan) return;

    setOrdering(true);
    try {
      await vpsService.createVpsOrder(selectedPlan.id, "balance", selectedTermCode, autoRenew);
      setShowOrderModal(false);
      alert("Đơn hàng VPS đã được tạo thành công! Vui lòng đợi admin cấu hình VPS.");
      navigate("/orders");
      // Optionally reload plans or redirect
    } catch (err: any) {
      alert(err.message || "Tạo đơn hàng VPS thất bại. Vui lòng thử lại.");
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

    return `${priceValue.toLocaleString('vi-VN')} VNĐ`;
  };

  const selectedTerm = useMemo(
    () => billingTerms.find((t) => t.code === selectedTermCode) || billingTerms[0],
    [billingTerms, selectedTermCode]
  );

  const getTermPriceDisplay = (term?: VpsBillingTerm): string => {
    if (!term) return "-";
    return `${Math.round(term.finalAmount).toLocaleString("vi-VN")} VNĐ`;
  };

  // Lấy giá hiển thị theo chu kỳ đang chọn cho từng card
  const getDisplayedPriceForPlan = (plan: VpsPlan): string => {
    const terms = pricingMap[plan.id];
    const term = terms?.find((t) => t.code === selectedTermCode) || terms?.[0];

    if (term) {
      return getTermPriceDisplay(term);
    }

    // Fallback tính tại client nếu chưa có pricing (dùng discount default)
    const base = (() => {
      const v =
        typeof plan.price === "number"
          ? plan.price
          : typeof plan.price === "string"
            ? parseFloat(plan.price) || 0
            : 0;
      return Math.max(v, 0);
    })();
    const months =
      BILLING_TERM_TABS.find((t) => t.code === selectedTermCode)?.code === selectedTermCode
        ? BILLING_TERM_TABS.find((t) => t.code === selectedTermCode)?.code === selectedTermCode
        : "1m";
    const termMeta = BILLING_TERM_TABS.find((t) => t.code === selectedTermCode) || BILLING_TERM_TABS[0];
    const subtotal = base * (termMeta.code === "1m" ? 1 : Number(termMeta.code.replace("m", "")));
    const finalAmount = subtotal - (subtotal * termMeta.discount) / 100;
    return `${Math.round(finalAmount).toLocaleString("vi-VN")}đ`;
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
            className={`card h-full flex flex-col hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden ${plan.popular
              ? "border-2 border-primary/30 ring-2 ring-primary/10 shadow-lg"
              : "border border-slate-200 dark:border-slate-700 hover:border-primary/20"
              }`}
          >
            {/* Header với badges */}
            <div className="relative p-6 pb-4 bg-gradient-to-br from-slate-50 to-white dark:from-slate-800 dark:to-slate-900 border-b border-slate-100 dark:border-slate-700">
              <div className="flex items-start justify-between gap-3 mb-3">
                <h4 className="text-lg md:text-xl font-bold text-slate-900 dark:text-slate-100 flex-1 leading-tight">
                  {plan.name}
                </h4>
                {plan.discountLabel && (
                  <span className="text-[10px] px-3 py-1.5 rounded-full bg-gradient-to-r from-violet-600 to-violet-700 text-white font-bold whitespace-nowrap shadow-md">
                    {plan.discountLabel}
                  </span>
                )}
              </div>
              {plan.popular && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-100 via-amber-50 to-amber-100 dark:from-amber-900/40 dark:via-amber-800/30 dark:to-amber-900/40 text-amber-700 dark:text-amber-300 text-[11px] font-bold uppercase tracking-wider border border-amber-300/50 dark:border-amber-700/50 shadow-sm">
                  <i className="mgc_star_fill text-xs" />
                  Phổ biến nhất
                </span>
              )}
            </div>

            {/* Pricing Section */}
            <div className="px-6 pt-6 pb-5 flex flex-col gap-4 flex-1 bg-white dark:bg-slate-800">
              <div className="flex flex-col gap-2">
                <div className="flex items-baseline gap-2 flex-wrap">
                  <span className="font-extrabold text-4xl md:text-5xl text-slate-900 dark:text-slate-100 tracking-tight leading-none">
                    {getPlanPriceDisplay(plan).split(' VNĐ')[0]}
                  </span>
                  <span className="text-lg md:text-xl text-slate-600 dark:text-slate-400 font-semibold">
                    VNĐ
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                    / tháng
                  </span>
                  {plan.popular && (
                    <span className="px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-[10px] font-bold uppercase">
                      Phổ biến
                    </span>
                  )}
                </div>
              </div>

              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Giá tham khảo, có thể thay đổi theo chu kỳ thanh toán. Phù hợp
                cho nhiều nhu cầu khác nhau: website, API, dịch vụ nền tảng.
              </p>
            </div>

            {/* Features Section */}
            <div className="px-6 pb-6 mt-auto bg-white dark:bg-slate-800">
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30">
                  <div className="flex-shrink-0 w-14 px-3 py-1.5 rounded-md bg-blue-500 dark:bg-blue-600 flex items-center justify-center shadow-sm">
                    <span className="text-white text-[10px] font-bold uppercase tracking-wide">CPU</span>
                  </div>
                  <span className="flex-1 text-sm font-semibold text-slate-900 dark:text-slate-100">{plan.cpu || "N/A"}</span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-purple-50/50 dark:bg-purple-900/10 border border-purple-100 dark:border-purple-900/30">
                  <div className="flex-shrink-0 w-14 px-3 py-1.5 rounded-md bg-purple-500 dark:bg-purple-600 flex items-center justify-center shadow-sm">
                    <span className="text-white text-[10px] font-bold uppercase tracking-wide">RAM</span>
                  </div>
                  <span className="flex-1 text-sm font-semibold text-slate-900 dark:text-slate-100">{plan.ram || "N/A"}</span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-emerald-50/50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-900/30">
                  <div className="flex-shrink-0 w-14 px-3 py-1.5 rounded-md bg-emerald-500 dark:bg-emerald-600 flex items-center justify-center shadow-sm">
                    <span className="text-white text-[10px] font-bold uppercase tracking-wide">SSD</span>
                  </div>
                  <span className="flex-1 text-sm font-semibold text-slate-900 dark:text-slate-100">{plan.ssd || "N/A"}</span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-amber-50/50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/30">
                  <div className="flex-shrink-0 w-20 px-3 py-1.5 rounded-md bg-amber-500 dark:bg-amber-600 flex items-center justify-center shadow-sm">
                    <span className="text-white text-[10px] font-bold uppercase tracking-wide">Băng thông</span>
                  </div>
                  <span className="flex-1 text-sm font-semibold text-slate-900 dark:text-slate-100">{plan.bandwidth || "N/A"}</span>
                </div>
              </div>
              <button
                className={`btn w-full text-white text-sm font-bold py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 ${plan.popular
                  ? "bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700"
                  : "bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-600 hover:to-slate-700"
                  }`}
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-40">
          <div className="bg-white rounded-xl p-6 max-w-2xl w-full mx-4 relative z-50">
            <h3 className="text-lg font-semibold mb-4">Chọn chu kỳ & xác nhận mua VPS</h3>
            <div className="space-y-4 mb-6">
              <p className="text-sm text-slate-600">
                <span className="font-medium">Gói VPS:</span> {selectedPlan.name}
              </p>

              {/* Thanh chọn chu kỳ giống hình minh họa */}
              <div className="overflow-x-auto -mx-2 px-2">
                <div className="inline-flex gap-2">
                  {BILLING_TERM_TABS.map((tab) => {
                    const term = billingTerms.find((t) => t.code === tab.code);
                    const isActive = selectedTermCode === tab.code;
                    // Ưu tiên discount từ backend, nếu không có thì dùng từ BILLING_TERM_TABS
                    const discount = term?.discountPercent ?? tab.discount;
                    return (
                      <button
                        key={tab.code}
                        type="button"
                        className={`px-4 py-2 rounded-md border text-xs md:text-sm whitespace-nowrap flex flex-col items-center justify-center ${isActive
                          ? "bg-yellow-500 text-white border-yellow-500"
                          : "bg-white text-slate-700 border-slate-200"
                          }`}
                        onClick={() => setSelectedTermCode(tab.code)}
                      >
                        <span className="font-semibold">{tab.label}</span>
                        {discount > 0 && (
                          <span
                            className={`mt-1 inline-flex px-2 py-0.5 rounded-full text-[11px] ${isActive ? "bg-white/20" : "bg-slate-100 text-slate-600"
                              }`}
                          >
                            -{discount}%
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Thông tin cấu hình */}
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div className="space-y-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">CPU</span>
                    <span className="font-semibold text-slate-900 dark:text-slate-100">{selectedPlan.cpu}</span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">RAM</span>
                    <span className="font-semibold text-slate-900 dark:text-slate-100">{selectedPlan.ram}</span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">SSD</span>
                    <span className="font-semibold text-slate-900 dark:text-slate-100">{selectedPlan.ssd}</span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Băng thông</span>
                    <span className="font-semibold text-slate-900 dark:text-slate-100">{selectedPlan.bandwidth}</span>
                  </div>
                </div>

                {/* Tóm tắt giá */}
                <div className="space-y-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-600 dark:text-slate-400">Đơn giá / tháng</span>
                    <span className="font-bold text-slate-900 dark:text-slate-100">{getPlanPriceDisplay(selectedPlan).split(' VNĐ')[0]} VNĐ</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-600 dark:text-slate-400">
                      Số tháng ({selectedTerm?.months || "-"})
                    </span>
                    <span className="font-bold text-slate-900 dark:text-slate-100">
                      {selectedTerm
                        ? `${Math.round(selectedTerm.subtotal).toLocaleString("vi-VN")} VNĐ`
                        : "-"}
                    </span>
                  </div>
                  {selectedTerm && selectedTerm.discountPercent > 0 && (
                    <div className="flex justify-between items-center text-sm text-yellow-600 dark:text-yellow-400">
                      <span>Giảm giá (-{selectedTerm.discountPercent}%)</span>
                      <span className="font-bold">
                        - {Math.round(selectedTerm.discountAmount).toLocaleString("vi-VN")} VNĐ
                      </span>
                    </div>
                  )}
                  <div className="border-t border-dashed border-slate-200 dark:border-slate-700 my-2" />
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span className="text-slate-900 dark:text-slate-100">Thành tiền</span>
                    <span className="text-yellow-600 dark:text-yellow-500 text-xl font-bold">
                      {getTermPriceDisplay(selectedTerm).split(' VNĐ')[0]} VNĐ
                    </span>
                  </div>
                  <label className="mt-2 flex items-center gap-2 text-xs">
                    <input
                      type="checkbox"
                      className="form-checkbox rounded border-slate-300"
                      checked={autoRenew}
                      onChange={(e) => setAutoRenew(e.target.checked)}
                    />
                    <span>Tự động gia hạn khi hết hạn (có đủ số dư trong tài khoản)</span>
                  </label>
                </div>
              </div>

              <p className="text-xs text-yellow-600">
                Số tiền sẽ được trừ từ tài khoản của bạn. Sau khi thanh toán, vui lòng đợi admin
                cấu hình VPS.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                className="btn border-slate-200 text-slate-700 flex-1 bg-white"
                onClick={() => {
                  setShowOrderModal(false);
                  setSelectedPlan(null);
                  setBillingTerms([]);
                }}
                disabled={ordering}
              >
                Hủy
              </button>
              <button
                className="btn bg-yellow-500 hover:bg-yellow-600 text-white flex-1 font-bold"
                onClick={handleConfirmOrder}
                disabled={ordering || !selectedTerm}
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


