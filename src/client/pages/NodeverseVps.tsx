import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageBreadcrumb } from "../../components";
import { vpsService } from "../../config";
import { NodeverseVpsPlan, VpsPlan, VpsBillingTerm } from "../../services/vpsService";
import Swal from "sweetalert2";

const NodeverseVps: React.FC = () => {
    const navigate = useNavigate();

    // Data States
    const [nvPlans, setNvPlans] = useState<NodeverseVpsPlan[]>([]); // To extract OS versions from Nodeverse
    const [stdPlans, setStdPlans] = useState<VpsPlan[]>([]); // Standard plans from /vps
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Pricing Cache for Standard Plans
    const [pricingMap, setPricingMap] = useState<Record<string, VpsBillingTerm[]>>({});

    // Selection States
    const [selectedOsVersion, setSelectedOsVersion] = useState<string | null>(null);
    const [selectedOsDeviceId, setSelectedOsDeviceId] = useState<string | null>(null);
    const [selectedOsAgencyId, setSelectedOsAgencyId] = useState<string | null>(null);
    const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
    const [billingTerm, setBillingTerm] = useState("12m");
    const [quantity, setQuantity] = useState(1);
    const [autoRenew, setAutoRenew] = useState(false);
    const [acceptedTerms, setAcceptedTerms] = useState(false);
    const [ordering, setOrdering] = useState(false);

    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true);
                setError(null);

                // 1. Fetch Nodeverse plans to get the OS list (from http://localhost:5173/admin/vps/nodeverse)
                const nvData = await vpsService.getNodeverseVpsPlans();
                let nvList: NodeverseVpsPlan[] = [];
                if (Array.isArray(nvData)) nvList = nvData;
                else if (nvData?.plans) nvList = nvData.plans;

                setNvPlans(nvList.filter(p => p.isActive));

                // 2. Fetch Standard plans (from http://localhost:5173/vps)
                const stdData = await vpsService.fetchClientPlans();
                setStdPlans(stdData || []);

            } catch (err: any) {
                console.error("Load data error:", err);
                setError(err.message || "Không thể tải dữ liệu.");
            } finally {
                setLoading(false);
            }
        };
        void load();
    }, []);

    // STEP 1 DATA: Unique OS Versions from Nodeverse
    const uniqueVersions = useMemo(() => {
        const versions = new Set<string>();
        nvPlans.forEach(p => {
            if (p.operatingSystem) versions.add(p.operatingSystem.trim());
        });
        return Array.from(versions).sort();
    }, [nvPlans]);

    // STEP 2 DATA: All Standard Plans
    const selectedStdPlan = useMemo(() => {
        return stdPlans.find(p => p.id === selectedPlanId) || null;
    }, [stdPlans, selectedPlanId]);

    // Load pricing for the selected standard plan
    useEffect(() => {
        if (selectedPlanId && !pricingMap[selectedPlanId]) {
            const loadPricing = async () => {
                try {
                    const pricing = await vpsService.fetchPlanPricing(selectedPlanId);
                    setPricingMap(prev => ({ ...prev, [selectedPlanId]: pricing.terms || [] }));
                } catch (err) {
                    console.error("Load std pricing error", err);
                }
            };
            void loadPricing();
        }
    }, [selectedPlanId, pricingMap]);

    // Realtime Calculations
    const billingDetails = useMemo(() => {
        if (!selectedStdPlan) return null;

        const terms = pricingMap[selectedStdPlan.id] || [];
        const termNode = terms.find(t => t.code === billingTerm) || terms[0];

        // Windows surcharge logic from Nodeverse
        const isWindows = selectedOsVersion?.toLowerCase().includes("windows");
        const osSurcharge = isWindows ? 120000 : 0;

        if (!termNode) {
            const base = parseFloat(selectedStdPlan.price || "0");
            return {
                planPrice: base,
                osSurcharge,
                subtotal: base * quantity,
                discountPercent: 0,
                discountAmount: 0,
                total: (base + osSurcharge) * quantity,
                termLabel: "Tháng",
                availableTerms: []
            };
        }

        const totalSurcharge = osSurcharge * termNode.months * quantity;
        const subtotal = termNode.subtotal * quantity + totalSurcharge;
        const discountAmount = (termNode.subtotal * termNode.discountPercent / 100) * quantity;
        const total = subtotal - discountAmount;

        return {
            planPrice: termNode.baseMonthlyPrice,
            osSurcharge,
            subtotal,
            discountPercent: termNode.discountPercent,
            discountAmount,
            total,
            termLabel: termNode.label,
            availableTerms: terms
        };
    }, [selectedStdPlan, selectedOsVersion, billingTerm, quantity, pricingMap]);

    // Handlers
    const handleOsVersionChange = (ver: string) => {
        setSelectedOsVersion(ver);
        // Find the nodeverse_device_id and agency_id and link them
        const device = nvPlans.find(p => p.operatingSystem === ver);
        setSelectedOsDeviceId(device?.nodeverseDeviceId || null);
        setSelectedOsAgencyId(device?.nodeverseAgencyId || null);
    };

    const handleOrder = async () => {
        if (!selectedPlanId || !billingDetails) return;

        const result = await Swal.fire({
            title: "Xác nhận đặt hàng?",
            text: `Bạn đang chọn cấu hình ${selectedOsVersion} với gói ${selectedStdPlan?.name}.`,
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "✅ Xác nhận",
            confirmButtonColor: "#3b82f6",
        });

        if (!result.isConfirmed) return;

        try {
            setOrdering(true);
            // Submit the order with extra Nodeverse params
            await vpsService.createNodeverseHybridVpsOrder(
                selectedPlanId,
                "balance",
                billingTerm,
                autoRenew,
                {
                    osVersion: selectedOsVersion,
                    nodeverseDeviceId: selectedOsDeviceId,
                    nodeverseAgencyId: selectedOsAgencyId
                }
            );

            await Swal.fire({
                title: "🎉 Thành công!",
                text: "Đơn hàng VPS của bạn đã được tiếp nhận. Admin sẽ cấu hình sớm nhất.",
                icon: "success",
                confirmButtonText: "Xem đơn hàng",
            }).then(() => navigate("/orders"));
        } catch (err: any) {
            Swal.fire("Lỗi", err.message, "error");
        } finally {
            setOrdering(false);
        }
    };

    return (
        <div className="pb-10">
            <PageBreadcrumb
                name="Cloud VPS Multi-Source"
                title="Đăng ký VPS Cloud"
                breadCrumbItems={["Client", "VPS", "Nodeverse Hybrid"]}
            />

            <div className="flex flex-col xl:flex-row gap-6 mt-2">
                <div className="w-full xl:w-2/3 space-y-6">

                    {/* STEP 1: OS FROM NODEVERSE ADMIN */}
                    <div className="card p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">1</div>
                            <h4 className="text-lg font-bold">Chọn Hệ điều hành (từ Nodeverse)</h4>
                        </div>

                        {loading ? (
                            <div className="py-4 animate-pulse space-y-2">
                                <div className="h-10 bg-slate-100 rounded w-full" />
                            </div>
                        ) : uniqueVersions.length === 0 ? (
                            <p className="text-sm text-slate-400">Không có HĐH nào được bật ở trang Admin Nodeverse.</p>
                        ) : (
                            <div className="space-y-4">
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">🔽 Các phiên bản HĐH đang hiện hành</p>
                                <div className="flex flex-wrap gap-3">
                                    {uniqueVersions.map((ver) => (
                                        <button
                                            key={ver}
                                            onClick={() => handleOsVersionChange(ver)}
                                            className={`px-4 py-2.5 rounded-xl border-2 text-sm font-semibold transition-all flex items-center gap-2 ${selectedOsVersion === ver
                                                ? "border-primary bg-primary text-white shadow-md"
                                                : "border-slate-100 bg-white text-slate-600 hover:border-slate-200"
                                                }`}
                                        >
                                            <i className={ver.toLowerCase().includes("win") ? "mgc_windows_line" : "mgc_linux_line"} />
                                            {ver}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* STEP 2: PLANS FROM STANDARD VPS API */}
                    <div className={`card p-6 transition-opacity duration-300 ${!selectedOsVersion ? "opacity-50 pointer-events-none" : "opacity-100"}`}>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">2</div>
                            <h4 className="text-lg font-bold">Chọn gói dịch vụ (từ Standard VPS)</h4>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="text-slate-400 border-b dark:border-slate-700">
                                    <tr>
                                        <th className="text-left py-3 font-medium">GÓI</th>
                                        <th className="text-center py-3 font-medium">CPU</th>
                                        <th className="text-center py-3 font-medium">RAM</th>
                                        <th className="text-center py-3 font-medium">DISK</th>
                                        <th className="text-right py-3 font-medium">GIÁ / THÁNG</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y dark:divide-slate-700">
                                    {stdPlans.map((plan) => (
                                        <tr
                                            key={plan.id}
                                            onClick={() => setSelectedPlanId(plan.id)}
                                            className={`group cursor-pointer transition-colors ${selectedPlanId === plan.id ? "bg-primary/5" : "hover:bg-slate-50"
                                                }`}
                                        >
                                            <td className="py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${selectedPlanId === plan.id ? "border-primary" : "border-slate-200"
                                                        }`}>
                                                        {selectedPlanId === plan.id && <div className="w-2 h-2 rounded-full bg-primary" />}
                                                    </div>
                                                    <span className="font-bold text-slate-900 group-hover:text-primary transition-colors">{plan.name}</span>
                                                </div>
                                            </td>
                                            <td className="text-center font-medium text-slate-600">{plan.cpu}</td>
                                            <td className="text-center font-bold text-violet-600 bg-violet-50/50">{plan.ram}</td>
                                            <td className="text-center font-bold text-amber-600 bg-amber-50/50">{plan.ssd}</td>
                                            <td className="py-4 text-right">
                                                <span className="text-lg font-bold text-primary">
                                                    {parseFloat(plan.price).toLocaleString()}
                                                </span>
                                                <span className="text-[10px] text-slate-400 ml-1">VND</span>
                                            </td>
                                        </tr>
                                    ))}
                                    {!loading && stdPlans.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="py-10 text-center text-slate-400">Không tìm thấy gói VPS nào.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* SIDEBAR CALCULATION */}
                <div className="w-full xl:w-1/3">
                    <div className="sticky top-24 space-y-4">
                        <div className="card p-6 border-2 border-primary/20 shadow-xl overflow-hidden relative">
                            <h4 className="text-base font-bold mb-6 flex items-center gap-2">
                                <i className="mgc_shopping_cart_2_line text-primary" /> Chi tiết đơn hàng
                            </h4>

                            {!billingDetails ? (
                                <div className="py-10 text-center space-y-3">
                                    <i className="mgc_clipboard_line text-4xl text-slate-200 block" />
                                    <p className="text-sm text-slate-400">Vui lòng chọn HĐH và Gói Plan.</p>
                                </div>
                            ) : (
                                <div className="space-y-6 animate-in fade-in zoom-in-95">
                                    <div className="space-y-3">
                                        <p className="font-bold text-slate-900 underline decoration-primary/30 decoration-2">{selectedStdPlan?.name}</p>
                                        <p className="text-xs text-slate-500 mt-0.5">OS: {selectedOsVersion}</p>
                                        <div className="grid grid-cols-3 gap-1 py-3 border-y border-dashed border-slate-200 text-center uppercase text-[10px] font-bold">
                                            <div><p className="text-slate-400 font-bold">CPU</p><p>{selectedStdPlan?.cpu}</p></div>
                                            <div><p className="text-slate-400 font-bold">RAM</p><p>{selectedStdPlan?.ram}</p></div>
                                            <div><p className="text-slate-400 font-bold">Disk</p><p>{selectedStdPlan?.ssd}</p></div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">Chu kỳ</label>
                                            <select
                                                className="form-select text-xs py-1.5 font-semibold"
                                                value={billingTerm}
                                                onChange={(e) => setBillingTerm(e.target.value)}
                                            >
                                                {billingDetails.availableTerms.length > 0 ? (
                                                    billingDetails.availableTerms.map(t => <option key={t.code} value={t.code}>{t.label}</option>)
                                                ) : (
                                                    <option value="12m">1 năm</option>
                                                )}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">Số lượng</label>
                                            <input type="number" min={1} max={10} className="form-input text-xs py-1.5 font-bold" value={quantity} onChange={(e) => setQuantity(parseInt(e.target.value) || 1)} />
                                        </div>
                                    </div>

                                    <div className="bg-slate-50 rounded-xl p-4 space-y-2.5 text-xs">
                                        <div className="flex justify-between">
                                            <span>Giá gói ({billingDetails.termLabel})</span>
                                            <span className="font-semibold">{Math.round(billingDetails.planPrice * quantity * (billingDetails.availableTerms.find(t => t.code === billingTerm)?.months || 1)).toLocaleString()} VND</span>
                                        </div>
                                        {billingDetails.osSurcharge > 0 && (
                                            <div className="flex justify-between text-sky-600 font-medium">
                                                <span>Bản quyền Windows (Nodeverse)</span>
                                                <span>+{Math.round(billingDetails.osSurcharge * quantity * (billingDetails.availableTerms.find(t => t.code === billingTerm)?.months || 1)).toLocaleString()} VND</span>
                                            </div>
                                        )}
                                        {billingDetails.discountPercent > 0 && (
                                            <div className="flex justify-between text-emerald-600 font-medium">
                                                <span>Giảm giá ({billingDetails.discountPercent}%)</span>
                                                <span>-{billingDetails.discountAmount.toLocaleString()} VND</span>
                                            </div>
                                        )}
                                        <div className="pt-2.5 border-t border-slate-200 flex justify-between items-center text-sm font-bold">
                                            <span>Tổng cộng</span>
                                            <span className="text-2xl text-primary">{Math.round(billingDetails.total).toLocaleString()}</span>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <label className="flex items-start gap-2 cursor-pointer group">
                                            <input type="checkbox" className="form-checkbox mt-1 text-primary rounded" checked={acceptedTerms} onChange={(e) => setAcceptedTerms(e.target.checked)} />
                                            <span className="text-[11px] text-slate-500">Tôi đồng ý với điều khoản sử dụng.</span>
                                        </label>
                                        <button onClick={handleOrder} disabled={ordering || !acceptedTerms} className={`btn w-full py-3 rounded-2xl font-bold text-sm shadow-xl transition-all ${acceptedTerms ? "bg-primary text-white" : "bg-slate-100 text-slate-300 pointer-events-none"}`}>
                                            {ordering ? "ĐANG XỬ LÝ..." : "ĐẶT HÀNG NGAY"}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NodeverseVps;
