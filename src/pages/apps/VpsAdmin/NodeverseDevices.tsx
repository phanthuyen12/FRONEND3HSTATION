import React, { useEffect, useMemo, useState } from "react";
import { PageBreadcrumb } from "../../../components";
import { vpsService } from "../../../config";
import { NodeverseVpsPlan } from "../../../services/vpsService";
import Swal from "sweetalert2";

const BILLING_TERMS = [
    { code: "1m", label: "1 tháng", months: 1 },
    { code: "3m", label: "3 tháng", months: 3 },
    { code: "6m", label: "6 tháng", months: 6 },
    { code: "12m", label: "1 năm", months: 12 },
    { code: "24m", label: "2 năm", months: 24 },
    { code: "36m", label: "3 năm", months: 36 },
];

// type Tab = "plans";

const NodeverseAdminPage: React.FC = () => {
    const [plans, setPlans] = useState<NodeverseVpsPlan[]>([]);
    const [loading, setLoading] = useState(false);
    const [syncing, setSyncing] = useState(false);
    const [search, setSearch] = useState("");

    const loadPlans = async () => {
        try {
            setLoading(true);
            const data = await vpsService.adminGetNodeversePlans(search || undefined);
            setPlans(data.plans || []);
        } catch (err: any) {
            Swal.fire("Lỗi", err.message, "error");
        } finally {
            setLoading(false);
        }
    };

    // const loadOrders = async () => { ... }
    // const loadHistory = async () => { ... }

    useEffect(() => {
        void loadPlans();
    }, []);

    const handleSync = async () => {
        const result = await Swal.fire({
            title: "Sync từ Nodeverse?",
            text: "Sẽ kéo toàn bộ VPS devices về DB. Giá cũ không bị xóa.",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Sync ngay",
            confirmButtonColor: "#3b82f6",
        });
        if (!result.isConfirmed) return;
        try {
            setSyncing(true);
            const data = await vpsService.syncNodeversePlans();
            await Swal.fire("✅ Sync xong!", `Đã sync ${data.synced} VPS devices từ Nodeverse.`, "success");
            void loadPlans();
        } catch (err: any) {
            Swal.fire("Lỗi", err.message, "error");
        } finally {
            setSyncing(false);
        }
    };

    const toggleVisibility = async (plan: NodeverseVpsPlan) => {
        try {
            await vpsService.adminUpdateNodeversePlan(plan.id, {
                isActive: !plan.isActive,
            });
            await Swal.fire({
                title: "Thành công",
                text: `Đã ${!plan.isActive ? "hiện" : "ẩn"} plan thành công!`,
                icon: "success",
                timer: 1500,
                showConfirmButton: false
            });
            void loadPlans();
        } catch (err: any) {
            Swal.fire("Lỗi", err.message, "error");
        }
    };

    const filtered = useMemo(() => {
        if (!search.trim()) return plans;
        const kw = search.toLowerCase();
        return plans.filter(
            (p) =>
                p.name.toLowerCase().includes(kw) ||
                (p.cpuInfo || "").toLowerCase().includes(kw) ||
                (p.operatingSystem || "").toLowerCase().includes(kw)
        );
    }, [plans, search]);

    const formatDate = (s: string | null) => {
        if (!s) return "—";
        return new Date(s).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });
    };

    // const formatCurrency = (v: string | number | null) => { ... }

    return (
        <>
            <PageBreadcrumb
                title="Nodeverse VPS - Quản lý Danh sách"
                name="Nodeverse Plans"
                breadCrumbItems={["Admin", "VPS", "Nodeverse Plans"]}
            />

            {/* Header + Sync */}
            <div className="card mb-5">
                <div className="p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                        <h4 className="card-title mb-0">Danh sách VPS Nodeverse ({plans.length})</h4>
                    </div>
                    <div className="flex items-center gap-2">
                        <input
                            className="form-input text-xs py-2 w-60"
                            placeholder="Tìm kiếm plan..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <button
                            className="btn bg-blue-600 text-white text-xs hover:bg-blue-700 transition-colors disabled:opacity-60"
                            onClick={handleSync}
                            disabled={syncing}
                        >
                            <i className="mgc_refresh_1_line mr-1.5" />
                            {syncing ? "Đang sync..." : "Sync từ Nodeverse"}
                        </button>
                    </div>
                </div>
            </div>

            {/* Hướng dẫn */}
            {plans.length === 0 && !loading && (
                <div className="card mb-5 border border-blue-200 bg-blue-50 p-5">
                    <div className="flex items-start gap-3">
                        <i className="mgc_information_line text-blue-500 text-2xl mt-0.5" />
                        <div>
                            <p className="font-semibold text-blue-800 mb-1">Chưa có plans nào</p>
                            <p className="text-sm text-blue-700">Nhấn <strong>Sync từ Nodeverse</strong> để kéo danh sách VPS devices về.</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Plans Table */}
            <div className="card">
                <div className="card-header flex items-center justify-between">
                    <h4 className="card-title mb-0">VPS Plans (từ Nodeverse)</h4>
                    <p className="text-xs text-slate-400">Sync thiết bị → Tùy chỉnh ẩn/hiện trên giao diện người dùng</p>
                </div>
                <div className="relative overflow-x-auto">
                    {loading ? (
                        <div className="p-8 text-center text-slate-400 text-sm">
                            <i className="mgc_loading_3_line animate-spin text-2xl block mb-2" />
                            Đang tải...
                        </div>
                    ) : (
                        <table className="w-full divide-y divide-gray-200 dark:divide-gray-700 text-xs">
                            <thead className="bg-slate-50 dark:bg-slate-700/60">
                                <tr>
                                    <th className="px-4 py-3 text-left font-semibold text-slate-600">Device / Config</th>
                                    <th className="px-4 py-3 text-left font-semibold text-slate-600">Trạng thái Nodeverse</th>
                                    <th className="px-4 py-3 text-left font-semibold text-slate-600">Sync lần cuối</th>
                                    <th className="px-4 py-3 text-center font-semibold text-slate-600">Ẩn/Hiện</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
                                {filtered.map((plan) => (
                                    <tr key={plan.id} className="hover:bg-slate-50/80 transition-colors">
                                        <td className="px-4 py-3">
                                            <div className="font-semibold text-slate-900 dark:text-white mb-0.5">{plan.name}</div>
                                            <div className="text-slate-400 space-y-0.5">
                                                <div>{plan.cpuInfo}</div>
                                                <div className="flex items-center gap-2">
                                                    {plan.totalMemory && <span className="bg-violet-100 text-violet-700 px-1.5 py-0.5 rounded text-[10px] font-bold">{plan.totalMemory}GB RAM</span>}
                                                    {plan.diskSpace && <span className="bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded text-[10px] font-bold">{plan.diskSpace}GB Disk</span>}
                                                </div>
                                                <div className="text-[10px] text-slate-300">{plan.operatingSystem}</div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            {plan.nodeverseStatus === "online" ? (
                                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />Online
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 text-[10px] font-bold">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />Offline
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 text-slate-400">{formatDate(plan.nodeverseSyncedAt)}</td>
                                        <td className="px-4 py-3 text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                {plan.isActive ? (
                                                    <button
                                                        className="btn btn-xs bg-emerald-100 text-emerald-700 hover:bg-emerald-200 transition-colors border-none"
                                                        onClick={() => toggleVisibility(plan)}
                                                    >
                                                        <i className="mgc_eye_line mr-1" /> Đang hiện
                                                    </button>
                                                ) : (
                                                    <button
                                                        className="btn btn-xs bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors border-none"
                                                        onClick={() => toggleVisibility(plan)}
                                                    >
                                                        <i className="mgc_eye_close_line mr-1" /> Đang ẩn
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {filtered.length === 0 && (
                                    <tr><td colSpan={4} className="py-8 text-center text-slate-400 text-sm">Không có plans nào.</td></tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </>
    );
};

export default NodeverseAdminPage;
