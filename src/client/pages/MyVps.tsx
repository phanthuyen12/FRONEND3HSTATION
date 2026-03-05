import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { vpsService } from "../../config";
import { PageBreadcrumb } from "../../components";

const MyVps: React.FC = () => {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [showBanner, setShowBanner] = useState(true);
    const [pageSize, setPageSize] = useState<number>(10);
    const navigate = useNavigate();

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const data = await vpsService.getMyNodeverseVpsOrders();
            setOrders(data || []);
        } catch (error: any) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = (text: string) => {
        if (!text) return;
        navigator.clipboard.writeText(text);
    };

    const filteredOrders = orders.filter(o =>
        (o.deviceIp || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (o.planName || "").toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <>
            <PageBreadcrumb
                name="Quản lý VPS"
                title="Quản lý VPS"
                breadCrumbItems={["Client", "VPS"]}
            />

            {/* 5. Banner thông báo thu gọn & có nút tắt */}
            {showBanner && (
                <div className="relative bg-amber-50/80 dark:bg-amber-900/20 border border-amber-200/60 dark:border-amber-800/50 p-3 rounded-xl mb-4 shadow-sm transition-all flex items-center gap-4">
                    <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-amber-100 to-amber-200 dark:from-amber-800 dark:to-amber-900 text-amber-600 dark:text-amber-400">
                        <i className="mgc_notification_line text-base animate-pulse" />
                    </div>
                    <div className="flex flex-col gap-0.5 pr-8">
                        <div className="text-amber-800 dark:text-amber-400 font-bold text-xs uppercase tracking-tight">THÔNG BÁO LỊCH NGHỈ TẾT NGUYÊN ĐÁN BÍNH NGÕ 2026</div>
                        <div className="text-[11px] text-amber-600 dark:text-amber-500 font-medium">Thông báo điều chỉnh giảm tỷ giá ngày 23/12/2025</div>
                    </div>
                    <button
                        onClick={() => setShowBanner(false)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-amber-500 hover:text-amber-700 dark:hover:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-800/50 rounded-lg transition-colors"
                        title="Đóng thông báo"
                    >
                        <i className="mgc_close_line text-lg" />
                    </button>
                </div>
            )}

            {/* 1. Tách phần Bộ lọc (Filters) ra 1 Card riêng biệt giống Orders.tsx */}
            <div className="card mb-4">
                <div className="p-4 flex flex-wrap gap-3 items-center justify-between">
                    <div className="flex flex-wrap gap-3 flex-1 items-center">
                        <div className="flex bg-slate-100 dark:bg-slate-800/50 p-1 rounded-md">
                            <button className="px-4 py-1.5 text-xs font-bold bg-white dark:bg-slate-700 text-primary rounded shadow-sm transition-all">
                                TẤT CẢ ({orders.length})
                            </button>
                            <button className="px-4 py-1.5 text-xs font-bold text-slate-500 hover:text-slate-700 dark:text-slate-400 transition-colors">
                                TEAM (0)
                            </button>
                        </div>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-3 flex items-center text-slate-400 text-sm">
                                <i className="mgc_search_3_line" />
                            </span>
                            <input
                                type="text"
                                className="form-input pl-9 pr-3 py-2 text-xs w-56 sm:w-64"
                                placeholder="Tìm kiếm IP, tên gói..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <button className="btn btn-sm bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs shadow-sm">
                            <i className="mgc_settings_3_line mr-1 text-slate-400" /> Thao tác
                        </button>
                        <button className="btn btn-sm bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs shadow-sm">
                            <i className="mgc_file_export_line mr-1 text-slate-400" /> Xuất tệp
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Data Card */}
            <div className="card ">
                <div className="card-header flex items-center justify-between">
                    <h4 className="card-title text-sm">Danh sách máy chủ</h4>
                    <div className="flex items-center gap-2 text-xs">
                        <span>Hiển thị:</span>
                        <select
                            className="form-select form-select-sm w-18"
                            value={pageSize}
                            onChange={(e) => setPageSize(Number(e.target.value))}
                        >
                            <option value={10}>10</option>
                            <option value={25}>25</option>
                            <option value={50}>50</option>
                        </select>
                    </div>
                </div>

                {/* Table Container - Chỉ overflow-x-auto ở div này */}
                <div className="overflow-x-auto">
                    <table className="min-w-full table-auto text-xs whitespace-nowrap">
                        <thead className="bg-slate-50 dark:bg-slate-700/50">
                            <tr>
                                <th className="px-3 py-2 text-center w-10">
                                    <input type="checkbox" className="form-checkbox h-3.5 w-3.5 rounded border-slate-300 text-primary focus:ring-primary" />
                                </th>
                                <th className="px-3 py-2 text-left font-semibold text-slate-600">
                                    <i className="mgc_server_line text-slate-400 align-middle mr-1" /> IP ADDRESS
                                </th>
                                <th className="px-3 py-2 text-left font-semibold text-slate-600">
                                    <i className="mgc_package_line text-slate-400 align-middle mr-1" /> GÓI DỊCH VỤ
                                </th>
                                <th className="px-3 py-2 text-left font-semibold text-slate-600">
                                    <i className="mgc_currency_dollar_line text-slate-400 align-middle mr-1" /> GIÁ GIA HẠN
                                </th>
                                <th className="px-3 py-2 text-left font-semibold text-slate-600">
                                    <i className="mgc_calendar_line text-slate-400 align-middle mr-1" /> NGÀY HẾT HẠN
                                </th>
                                <th className="px-3 py-2 text-left font-semibold text-slate-600">
                                    <i className="mgc_edit_line text-slate-400 align-middle mr-1" /> GHI CHÚ
                                </th>
                                <th className="px-3 py-2 text-center font-semibold text-slate-600">
                                    TRẠNG THÁI
                                </th>
                                <th className="px-3 py-2 text-center font-semibold text-slate-600">
                                    ACTION
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={8} className="px-3 py-8 text-center text-slate-500">
                                        <div className="flex items-center justify-center gap-2 text-sm">
                                            <i className="mgc_loading_line animate-spin text-lg text-primary" />
                                            Đang tải dữ liệu...
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredOrders.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="px-3 py-16 text-center text-slate-500">
                                        <div className="flex flex-col items-center gap-2">
                                            <i className="mgc_box_3_line text-4xl opacity-30 text-slate-400" />
                                            <span className="text-sm font-medium mt-1">Bạn chưa có hệ thống VPS nào hoặc không tìm thấy kết quả.</span>
                                            <button onClick={() => navigate('/vps')} className="mt-2 btn btn-sm bg-primary text-white font-bold p-2 px-6 rounded-lg shadow-sm">
                                                Đăng ký ngay
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredOrders.map((item) => {
                                    const isRunning = item.status === "active";
                                    const isPending = item.status === "pending";

                                    return (
                                        <tr key={item.id} className="border-t border-slate-100 dark:border-slate-700/60 hover:bg-slate-50/70 dark:hover:bg-slate-800/30 transition-colors group">
                                            <td className="px-3 py-2 text-center">
                                                <input type="checkbox" className="form-checkbox h-3.5 w-3.5 rounded border-slate-300 text-primary pointer-events-none opacity-50 transition-all group-hover:opacity-100" />
                                            </td>

                                            {/* 3. Giới hạn cột IP (tránh làm phình bảng) & add ellipsis */}
                                            <td className="px-3 py-2">
                                                <div className="flex items-center gap-1.5 max-w-[200px]">
                                                    <span className="font-semibold text-slate-800 dark:text-slate-100 truncate transition-colors group-hover:text-primary" title={item.deviceIp || "Đang khởi tạo..."}>
                                                        {item.deviceIp || "Đang khởi tạo..."}
                                                    </span>
                                                    {item.deviceIp && (
                                                        <button onClick={() => copyToClipboard(item.deviceIp)} className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-primary transition p-0.5 rounded flex-shrink-0" title="Copy IP">
                                                            <i className="mgc_copy_line text-sm" />
                                                        </button>
                                                    )}
                                                </div>
                                            </td>

                                            <td className="px-3 py-2">
                                                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                                                    {item.planName || "Gói Tùy Chọn"}
                                                </span>
                                            </td>

                                            <td className="px-3 py-2">
                                                <div className="font-semibold text-slate-800 dark:text-slate-100">
                                                    {new Intl.NumberFormat('vi-VN').format(item.billingAmount || 0)}đ
                                                    <span className="text-[10px] text-slate-400 ml-1 font-normal">/ kỳ</span>
                                                </div>
                                            </td>

                                            <td className="px-3 py-2 text-slate-600 dark:text-slate-400 font-medium whitespace-nowrap">
                                                {item.expiresAt ? new Date(item.expiresAt).toLocaleDateString('vi-VN') : "-"}
                                            </td>

                                            {/* Giới hạn độ dài cột Notes */}
                                            <td className="px-3 py-2">
                                                <div className="flex items-center gap-1.5 text-slate-500">
                                                    <span className="truncate max-w-[150px] md:max-w-[180px] block" title={item.notes || ""}>
                                                        {item.notes ? item.notes : "-"}
                                                    </span>
                                                    <button className="opacity-0 group-hover:opacity-100 text-primary transition-all p-0.5 hover:bg-slate-100 rounded"><i className="mgc_edit_line text-sm" /></button>
                                                </div>
                                            </td>

                                            {/* 2. Trạng thái bật mạnh lên để rõ UI Hierarchy */}
                                            <td className="px-3 py-2 text-center whitespace-nowrap">
                                                <span className={`inline-flex items-center justify-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${isRunning ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400" :
                                                        isPending ? "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400" :
                                                            "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                                                    }`}>
                                                    {isRunning && (
                                                        <span className="relative flex h-1.5 w-1.5">
                                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                                            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                                                        </span>
                                                    )}
                                                    {isPending && <i className="mgc_loading_line animate-spin text-xs" />}
                                                    {isRunning ? "Đang Chạy" : isPending ? "Đang Xử Lý" : item.status.toUpperCase()}
                                                </span>
                                            </td>

                                            {/* 2. Cột ACTION: Thay vì nút Vàng thô thì dùng nút icon hiện đại tinh tế giống Orders.tsx */}
                                            <td className="px-3 py-2 text-center">
                                                <button
                                                    className="inline-flex items-center justify-center h-7 w-7 rounded border border-transparent hover:border-slate-200 dark:hover:border-slate-700 bg-transparent text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-primary transition-all"
                                                    onClick={() => navigate(`/my-vps/${item.id}`)}
                                                    title="Quản lý"
                                                >
                                                    <i className="mgc_settings_4_line text-sm" />
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {/* 4. Footer Pagination/Info - Tinh chỉnh spacing chuẩn & cân đối 2 bên */}
                <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-700/60 px-4 py-3 text-xs bg-white dark:bg-transparent">
                    <div className="text-slate-500">
                        Hiển thị <strong className="text-slate-800 dark:text-slate-200">{filteredOrders.length}</strong> / <strong className="text-slate-800 dark:text-slate-200">{orders.length}</strong> mục
                    </div>
                    {filteredOrders.length > 0 && (
                        <div className="flex items-center gap-1.5">
                            <button className="px-2 py-1 rounded border text-xs disabled:opacity-50 hover:bg-slate-50 transition-colors" disabled>
                                Trước
                            </button>
                            <span>
                                Trang <strong className="font-semibold text-slate-800 dark:text-slate-200">1/1</strong>
                            </span>
                            <button className="px-2 py-1 rounded border text-xs disabled:opacity-50 hover:bg-slate-50 transition-colors" disabled>
                                Sau
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default MyVps;
