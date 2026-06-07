import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import FeatherIcon from 'feather-icons-react';
import HostingLayout from '../layouts/HostingLayout';
import { useTheme } from '../context/ThemeContext';
import { workflowsService } from '../../../config';
import { Workflow } from '../../../services/workflowsService';
import Swal from 'sweetalert2';

const WorkflowDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isDark } = useTheme();
    const [workflow, setWorkflow] = useState<Workflow | null>(null);
    const [loading, setLoading] = useState(true);
    const [buying, setBuying] = useState(false);

    useEffect(() => {
        if (!id) return;
        const fetchWf = async () => {
            try {
                setLoading(true);
                const data: any = await workflowsService.getClientWorkflow(id);
                if (data) {
                    // Trương hợp data bị bọc bởi data (Laravel Resource)
                    setWorkflow(data.data || data);
                }
            } catch (error) {
                console.error("Không thể tải workflow", error);
            } finally {
                setLoading(false);
            }
        };
        fetchWf();
    }, [id]);

    const fmt = (n: any) => {
        const num = typeof n === 'string' ? parseFloat(n) : n;
        if (isNaN(num) || num === 0) return '0đ';
        return num.toLocaleString('vi-VN') + 'đ';
    };

    const handleBuy = async () => {
        if (!workflow || !workflow.id) return;
        
        const result = await Swal.fire({
            title: 'Xác nhận mua?',
            html: `Bạn sẽ mua giải pháp "<b>${workflow.name}</b>"<br/>Giá: <b class="text-[#FBBF24]">${fmt(workflow.price)}</b>`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Mua ngay',
            cancelButtonText: 'Hủy'
        });

        if (result.isConfirmed) {
            try {
                setBuying(true);
                // The correct method is registerWorkflow in workflowsService
                await workflowsService.registerWorkflow(workflow.id); 
                await Swal.fire({
                    title: 'Thành công!',
                    text: 'Bạn đã mua giải pháp thành công. Chuyển đến trang của bạn.',
                    icon: 'success'
                });
                navigate('/landing-profile?tab=my-workflows');
            } catch (error: any) {
                Swal.fire('Lỗi', error.message || 'Không thể thực hiện giao dịch', 'error');
            } finally {
                setBuying(false);
            }
        }
    };

    if (loading) {
        return (
            <HostingLayout>
                <div className="min-h-screen bg-[#060a09] flex items-center justify-center">
                    <div className="animate-pulse text-gray-400 font-black uppercase tracking-widest text-sm">Đang tải dữ liệu...</div>
                </div>
            </HostingLayout>
        );
    }

    if (!workflow) {
        return (
            <HostingLayout>
                <div className="min-h-screen bg-[#060a09] flex flex-col items-center justify-center gap-4">
                    <div className="text-gray-400 font-black uppercase tracking-widest text-sm">Không tìm thấy Workflow</div>
                    <Link to="/landing-workflows" className="px-6 py-2 bg-[#FBBF24] text-white rounded-lg text-xs font-black uppercase">Quay lại</Link>
                </div>
            </HostingLayout>
        );
    }

    const w = workflow;
    let tags: string[] = [];
    if (w.tags) {
        try {
            tags = typeof w.tags === 'string' ? JSON.parse(w.tags) : w.tags;
        } catch {
            tags = [w.tags as string];
        }
    }

    return (
        <HostingLayout>
            <div className="min-h-screen bg-[#060a09] pt-0 pb-12">

                {/* ── BREADCRUMBS ── */}
                <div className="w-full bg-[#0d1513] border-b border-white/[0.03] mb-0">
                    <div className="max-w-7xl mx-auto px-4 py-3">
                        <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[2px] text-gray-400">
                            <Link to="/" className="hover:text-[#FBBF24] transition-colors flex items-center gap-1.5">
                                <FeatherIcon icon="home" size={12} /> Trang chủ
                            </Link>
                            <FeatherIcon icon="chevron-right" size={10} className="opacity-40" />
                            <Link to="/landing-workflows" className="hover:text-[#FBBF24]">Workflow</Link>
                            <FeatherIcon icon="chevron-right" size={10} className="opacity-40" />
                            <span className="text-white">{w.name}</span>
                        </div>
                    </div>
                </div>

                {/* ── HERO SECTION ── */}
                <div className="bg-gradient-to-r from-[#FBBF24] to-[#032030] dark:from-[#0a1411] dark:to-[#080d0c] py-12 mb-8 border-b border-white/[0.03] text-white">
                    <div className="container mx-auto px-4 md:px-6">
                        <div className="flex flex-col md:flex-row gap-10 items-start md:items-center">
                            <div className="relative group shrink-0">
                                <div className="absolute -inset-1 bg-gradient-to-r from-[#FBBF24] to-blue-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
                                <div className="relative w-full md:w-[280px] h-[190px] bg-gradient-to-br from-gray-100 to-gray-300 dark:from-gray-800 dark:to-gray-900 rounded-xl overflow-hidden shadow-2xl flex flex-col justify-between p-5 border border-white/10">
                                    <div className="flex justify-between items-start">
                                        <div className="w-10 h-10 rounded-lg bg-[#FBBF24]/10 flex items-center justify-center">
                                            <FeatherIcon icon="activity" size={24} className="text-[#FBBF24]" />
                                        </div>
                                        <span className="text-[9px] font-black bg-[#FBBF24] px-2 py-0.5 rounded text-white uppercase shadow-lg tracking-widest">Solution</span>
                                    </div>
                                    <div>
                                        <h3 className="text-white font-black text-lg mb-1 tracking-tight">{w.name}</h3>
                                        <div className="bg-[#0d1412]/10 px-2 py-0.5 rounded text-[10px] font-bold w-fit uppercase tracking-wider text-white">Workflow Engine</div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex-grow space-y-4">
                                <h1 className="text-3xl md:text-4xl font-black mb-1 tracking-tight !text-white">{w.name}</h1>
                                <div className="flex flex-wrap items-center gap-4">
                                    <div className="flex items-center gap-1.5 bg-black/20 px-2.5 py-1.5 rounded-lg border border-white/[0.03]">
                                        <div className="flex text-amber-400">
                                            {[...Array(5)].map((_, i) => (
                                                <FeatherIcon key={i} icon="star" size={14} fill="currentColor" />
                                            ))}
                                        </div>
                                        <span className="text-sm font-bold">5.0 (28 đánh giá)</span>
                                    </div>
                                    <div className="px-3 py-1.5 rounded-lg bg-blue-500/20 text-[11px] font-black text-blue-400 flex items-center gap-1.5 border border-blue-500/20 uppercase tracking-widest">
                                        <FeatherIcon icon="zap" size={12} fill="currentColor" /> Hiệu năng cao
                                    </div>
                                </div>
                                <p className="text-white/60 text-[15px] font-medium max-w-2xl leading-relaxed">{w.description}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── MAIN CONTENT ── */}
                <div className="container mx-auto px-4 md:px-6">
                    <div className="flex flex-col lg:flex-row gap-10 items-start">

                        {/* LEFT COLUMN */}
                        <div className="w-full lg:flex-1 space-y-8">
                            
                            {/* Detailed Description */}
                            <div className="bg-[#050807] rounded-xl border border-white/[0.03] p-8 shadow-sm">
                                <h3 className="text-sm font-black text-white mb-6 uppercase tracking-[2px] flex items-center gap-3">
                                    <div className="w-1 h-6 bg-[#FBBF24] rounded-full"></div> MÔ TẢ CHI TIẾT GIẢI PHÁP
                                </h3>
                                <div className="text-[15px] text-gray-400 leading-[1.8] whitespace-pre-wrap font-medium">
                                    {w.content || w.description}
                                    <br /><br />
                                    <ul className="space-y-3">
                                        <li className="flex items-start gap-3">
                                            <FeatherIcon icon="check-circle" size={16} className="text-[#FBBF24] mt-1 shrink-0" />
                                            <span>Tự động hóa hoàn toàn quy trình xử lý dữ liệu phức tạp.</span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <FeatherIcon icon="check-circle" size={16} className="text-[#FBBF24] mt-1 shrink-0" />
                                            <span>Khả năng mở rộng không giới hạn với cấu trúc modular.</span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <FeatherIcon icon="check-circle" size={16} className="text-[#FBBF24] mt-1 shrink-0" />
                                            <span>Tích hợp sẵn hệ thống cảnh báo và giám sát 24/7.</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            {/* Tags / Requirements */}
                            {tags.length > 0 && (
                                <div className="bg-[#050807] rounded-xl border border-white/[0.03] p-8 shadow-sm">
                                    <h3 className="text-sm font-black text-white mb-6 uppercase tracking-[2px] flex items-center gap-3">
                                        <div className="w-1 h-6 bg-[#FBBF24] rounded-full"></div> PHẠM VI ỨNG DỤNG
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {tags.map((tag, i) => (
                                            <div key={i} className="flex items-center gap-4 group">
                                                <div className="w-8 h-8 rounded-lg bg-[#FBBF24]/10 flex items-center justify-center text-[#FBBF24] group-hover:bg-[#FBBF24] group-hover:text-white transition-all shrink-0">
                                                    <FeatherIcon icon="check" size={12} strokeWidth={4} />
                                                </div>
                                                <span className="text-[13px] font-bold text-gray-300 uppercase tracking-widest">{tag}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* RIGHT COLUMN (SIDEBAR) */}
                        <div className="w-full lg:w-[360px] shrink-0 space-y-6 lg:sticky lg:top-24">
                            <div className="bg-[#0d1412] rounded-xl border border-white/[0.03] p-8 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] space-y-8">
                                <div className="space-y-1">
                                    <div className="text-[10px] font-black text-gray-400 uppercase tracking-[2px]">Mức đầu tư giải pháp</div>
                                    <div className="text-4xl font-black text-[#F59E0B] tracking-tighter leading-none">{fmt(w.price)}</div>
                                    <p className="text-[11px] font-medium text-gray-400 pt-2 flex items-center gap-1.5">
                                        <FeatherIcon icon="info" size={12} /> Bao gồm file blueprint và hướng dẫn.
                                    </p>
                                </div>

                                <div className="space-y-4">
                                    <button
                                        onClick={handleBuy}
                                        disabled={buying}
                                        className="w-full h-[52px] rounded-xl bg-gradient-to-r from-[#FBBF24] to-[#F59E0B] hover:brightness-105 !text-white text-[15px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#FBBF24]/20 active:scale-[0.98] disabled:opacity-50"
                                    >
                                        {buying ? (
                                            <>
                                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/[0.03]0 border-t-white" /> ĐANG XỬ LÝ...
                                            </>
                                        ) : (
                                            <>
                                                <FeatherIcon icon="shopping-cart" size={18} fill="currentColor" /> MUA WORKFLOW NGAY
                                            </>
                                        )}
                                    </button>
                                </div>

                                <div className="space-y-4 pt-8 border-t border-white/[0.03]">
                                    <div className="flex items-center gap-3 text-[13px] font-bold text-gray-400">
                                        <div className="w-6 h-6 rounded-full bg-[#FBBF24]/10 flex items-center justify-center text-[#FBBF24]">
                                            <FeatherIcon icon="check" size={12} strokeWidth={4} />
                                        </div>
                                        Kích hoạt tự động 100%
                                    </div>
                                    <div className="flex items-center gap-3 text-[13px] font-bold text-gray-400">
                                        <div className="w-6 h-6 rounded-full bg-[#FBBF24]/10 flex items-center justify-center text-[#FBBF24]">
                                            <FeatherIcon icon="check" size={12} strokeWidth={4} />
                                        </div>
                                        Hỗ trợ triển khai 1-1
                                    </div>
                                    <div className="flex items-center gap-3 text-[13px] font-bold text-gray-400">
                                        <div className="w-6 h-6 rounded-full bg-[#FBBF24]/10 flex items-center justify-center text-[#FBBF24]">
                                            <FeatherIcon icon="check" size={12} strokeWidth={4} />
                                        </div>
                                        Cập nhật vĩnh viễn
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </HostingLayout>
    );
};

export default WorkflowDetailPage;
