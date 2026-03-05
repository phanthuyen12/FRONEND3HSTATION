import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { vpsService } from "../../config";
import { PageBreadcrumb } from "../../components";

const MyVpsDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    useEffect(() => {
        if (id) {
            loadData(id);
        }
    }, [id]);

    const loadData = async (instanceId: string) => {
        try {
            const current = await vpsService.getMyNodeverseVpsOrder(instanceId);
            if (current) {
                setData(current);
            }
        } catch (error: any) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <>
                <PageBreadcrumb
                    name="Đang tải..."
                    title="Quản lý VPS"
                    breadCrumbItems={["Client", "VPS", "Detail"]}
                />
                <div className="card">
                    <div className="p-10 text-center text-slate-500">
                        Đang tải thông tin VPS...
                    </div>
                </div>
            </>
        );
    }

    if (!data) {
        return (
            <>
                <PageBreadcrumb
                    name="Không tìm thấy"
                    title="Quản lý VPS"
                    breadCrumbItems={["Client", "VPS", "Error"]}
                />
                <div className="card">
                    <div className="p-10 text-center">
                        <div className="text-red-500 mb-4 font-mediumText">Không tìm thấy thông tin VPS tương ứng.</div>
                        <Link to="/my-vps" className="btn bg-slate-100 text-slate-700">
                            <i className="mgc_arrow_left_line mr-1"></i> Quay lại danh sách
                        </Link>
                    </div>
                </div>
            </>
        );
    }

    const handleAction = async (action: 'start' | 'stop' | 'restart') => {
        if (!data || !data.id) return;
        if (!confirm(`Bạn có chắc chắn muốn ${action} VPS này?`)) return;

        setActionLoading(action);
        try {
            const res = await vpsService.changeNodeverseVpsContainerState(data.id, action);
            alert(res.message);
            // Cập nhật lại state ảo để user thấy thay đổi liền
            setData({ ...data, status: res.status, containerStatus: res.containerStatus });
        } catch (error: any) {
            console.error(error);
            alert(error.message || `Lỗi khi thực hiện ${action}`);
        } finally {
            setActionLoading(null);
        }
    };

    const parseNotes = (notes: string) => {
        if (!notes) return {};
        const extract = (key: string) => {
            const regex = new RegExp(`${key}:\\s*(.*)`);
            const match = notes.match(regex);
            return match ? match[1] : null;
        };
        return {
            os: extract('OS'),
            cpu: extract('CPU'),
            ram: extract('RAM')?.replace('GB', ''),
            disk: extract('Disk')?.replace('GB', ''),
        };
    };

    const specs = parseNotes(data.notes);

    return (
        <>
            <PageBreadcrumb
                name={data.deviceIp || "Quản lý VPS"}
                title="Chi tiết hệ thống VPS"
                breadCrumbItems={["Client", "VPS", data.deviceIp || "Detail"]}
            />

            <div className="grid lg:grid-cols-3 grid-cols-1 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <div className="card">
                        <div className="card-header flex items-center justify-between">
                            <h4 className="card-title mb-0">
                                <i className="mgc_settings_1_line mr-1 text-amber-500"></i> Thông tin cấu hình
                            </h4>
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${data.status === "active" ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"
                                }`}>
                                {data.status === "active" ? "Đang hoạt động" : data.status}
                            </span>
                        </div>
                        <div className="p-0">
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                                        <tr>
                                            <td className="px-6 py-4 font-medium text-slate-500 w-1/3">IPv4 & Hostname</td>
                                            <td className="px-6 py-4">
                                                <span className="font-bold text-primary mr-2">{data.deviceIp || "Chưa có"}</span>
                                                <span className="text-slate-400 text-xs">({data.deviceHostname || "No Hostname"})</span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="px-6 py-4 font-medium text-slate-500">Hệ điều hành</td>
                                            <td className="px-6 py-4">
                                                <i className="mgc_cloud_line mr-1 text-primary"></i>
                                                {specs.os || data.operatingSystem || "Chưa cập nhật"}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="px-6 py-4 font-medium text-slate-500">Cấu hình chi tiết</td>
                                            <td className="px-6 py-4 flex flex-wrap gap-3">
                                                <span className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-xs">
                                                    <b>CPU:</b> {specs.cpu || data.cpu || data.cpuInfo || "?"}
                                                </span>
                                                <span className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-xs">
                                                    <b>RAM:</b> {specs.ram || data.ram || data.totalMemory || 0}GB
                                                </span>
                                                <span className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-xs">
                                                    <b>DISK:</b> {specs.disk || data.storage || data.diskSpace || 0}GB
                                                </span>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    <div className="card">
                        <div className="card-header">
                            <h4 className="card-title mb-0 text-orange-600 flex items-center gap-1">
                                <i className="mgc_settings_3_line text-lg"></i> Điều khiển
                            </h4>
                        </div>
                        <div className="p-6">
                            <div className="flex flex-wrap gap-4">
                                <button
                                    onClick={() => handleAction('start')}
                                    disabled={actionLoading === 'start' || data.status === 'active' || data.containerStatus === 'running'}
                                    className="flex-1 min-w-[120px] btn bg-green-500 hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl py-6 flex flex-col items-center gap-3 transition-all shadow-sm relative overflow-hidden"
                                >
                                    {actionLoading === 'start' ? (
                                        <i className="mgc_loading_line text-2xl animate-spin"></i>
                                    ) : (
                                        <i className="mgc_play_line text-2xl"></i>
                                    )}
                                    <span className="text-xs font-bold uppercase tracking-wider">BẬT</span>
                                </button>
                                <button
                                    onClick={() => handleAction('stop')}
                                    disabled={actionLoading === 'stop' || data.status === 'suspended' || data.containerStatus === 'exited'}
                                    className="flex-1 min-w-[120px] btn bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl py-6 flex flex-col items-center gap-3 transition-all shadow-sm relative overflow-hidden"
                                >
                                    {actionLoading === 'stop' ? (
                                        <i className="mgc_loading_line text-2xl animate-spin"></i>
                                    ) : (
                                        <i className="mgc_power_line text-2xl"></i>
                                    )}
                                    <span className="text-xs font-bold uppercase tracking-wider">TẮT</span>
                                </button>
                                <button
                                    onClick={() => handleAction('stop')}
                                    disabled={actionLoading === 'stop' || data.status === 'suspended'}
                                    className="flex-1 min-w-[120px] btn bg-red-500 hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl py-6 flex flex-col items-center gap-3 transition-all shadow-sm"
                                >
                                    <i className="mgc_stop_circle_line text-2xl"></i>
                                    <span className="text-xs font-bold uppercase tracking-wider">DỪNG VPS</span>
                                </button>
                                <button
                                    onClick={() => handleAction('restart')}
                                    disabled={actionLoading === 'restart'}
                                    className="flex-1 min-w-[120px] btn bg-orange-500 hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl py-6 flex flex-col items-center gap-3 transition-all shadow-sm"
                                >
                                    {actionLoading === 'restart' ? (
                                        <i className="mgc_loading_line text-2xl animate-spin"></i>
                                    ) : (
                                        <i className="mgc_refresh_3_line text-2xl"></i>
                                    )}
                                    <span className="text-xs font-bold uppercase tracking-wider">KHỞI ĐỘNG LẠI</span>
                                </button>
                                <button
                                    onClick={() => handleAction('restart')}
                                    disabled={actionLoading === 'restart'}
                                    className="flex-1 min-w-[120px] btn bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl py-6 flex flex-col items-center gap-3 transition-all shadow-sm"
                                >
                                    <i className="mgc_cpu_line text-2xl"></i>
                                    <span className="text-xs font-bold uppercase tracking-wider">TỐI ƯU HOÁ CPU</span>
                                </button>
                            </div>
                            <p className="mt-6 text-[11px] text-slate-400 italic text-center px-4">
                                * Một số tính năng điều khiển trực tiếp đang được đồng bộ hóa với hệ thống Nodeverse.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="card">
                        <div className="card-header">
                            <h4 className="card-title mb-0">
                                <i className="mgc_currency_dollar_line mr-1 text-amber-500"></i> Thanh toán & Gói
                            </h4>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-slate-500">Gói dịch vụ:</span>
                                <span className="font-semibold text-slate-700 dark:text-slate-200 text-right">{data.planName}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-slate-500">Ngày bắt đầu:</span>
                                <span className="font-medium">{new Date(data.createdAt).toLocaleDateString('vi-VN')}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-slate-500">Ngày hết hạn:</span>
                                <span className="font-medium text-orange-500">{data.expiresAt ? new Date(data.expiresAt).toLocaleDateString('vi-VN') : "-"}</span>
                            </div>
                            <div className="pt-3 border-t border-slate-100 dark:border-slate-700 flex justify-between items-center">
                                <span className="text-slate-800 dark:text-slate-400 font-bold">Tổng thanh toán:</span>
                                <span className="text-lg font-bold text-primary">
                                    {new Intl.NumberFormat('vi-VN').format(data.billingAmount || 0)}đ
                                    <span className="text-xs text-slate-400 font-normal ml-1">({data.billingMonths} thg)</span>
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="card">
                        <div className="card-header">
                            <h4 className="card-title mb-0">
                                <i className="mgc_wifi_line mr-1 text-amber-500"></i> Thông tin mạng
                            </h4>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-slate-500">IP Public:</span>
                                <span className="font-bold text-green-600">{data.deviceIp || "N/A"}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-slate-500">Nodeverse ID:</span>
                                <span className="text-[10px] bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-slate-500 select-all">{data.nodeverseDeviceId || "N/A"}</span>
                            </div>
                        </div>
                    </div>

                    <div className="card">
                        <div className="p-6">
                            <Link to="/my-vps" className="btn border-slate-200 text-slate-700 w-full bg-white flex items-center justify-center gap-2">
                                <i className="mgc_arrow_left_line"></i> Quay lại danh sách
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};


export default MyVpsDetail;
