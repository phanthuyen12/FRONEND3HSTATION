import React, { useState, useEffect } from 'react';
import HostingLayout from '../layouts/HostingLayout';
import FeatherIcon from 'feather-icons-react';
import { useTheme } from '../context/ThemeContext';
import { workflowsService } from '../../../config';
import { expandWorkflowRegistrations } from '../../data/workflowRegistrations';
import { mockUser } from '../../data/user';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';

const WorkflowManagementPage = () => {
    const { isDark } = useTheme();
    const [workflows, setWorkflows] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('all'); // all, active, completed
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 3;

    useEffect(() => {
        const fetchMyWorkflows = async () => {
            try {
                setLoading(true);
                const response = await workflowsService.getMyWorkflows();
                let apiData = response.data || [];
                
                // Nếu API thục tế có dữ liệu thì dùng, không thì fallback sang mock data giống trang cũ
                if (apiData.length === 0) {
                    const allRegs = expandWorkflowRegistrations();
                    apiData = allRegs.filter((r: any) => r.userId === mockUser.id);
                }

                const items = apiData.map((item: any) => ({
                    id: item.id,
                    wfId: item.workflow_id || item.workflowId,
                    name: item.workflow?.name || item.workflow_name || `Workflow #${item.id}`,
                    image: item.workflow?.image,
                    price: item.price || item.workflow?.price || 0,
                    status: item.status || 'active',
                    date: item.created_at || item.createdAt ? new Date(item.created_at || item.createdAt).toLocaleDateString('vi-VN') : 'N/A',
                    download_link: item.download_link || item.workflow?.download_link
                }));
                setWorkflows(items);
            } catch (error) {
                console.error('Error fetching workflows:', error);
                // Fallback cho demo nếu API lỗi
                const allRegs = expandWorkflowRegistrations();
                const mockData = allRegs.filter((r: any) => r.userId === mockUser.id).map((item: any) => ({
                    id: item.id,
                    wfId: item.workflowId,
                    name: item.workflow?.name || `Workflow #${item.id}`,
                    image: item.workflow?.image,
                    price: item.workflow?.price || 0,
                    status: item.status === 'da-duyet' ? 'success' : 'pending',
                    date: item.createdAt,
                    download_link: '#'
                }));
                setWorkflows(mockData);
            } finally {
                setLoading(false);
            }
        };
        fetchMyWorkflows();
    }, []);

    const fmt = (n: any) => {
        const num = typeof n === 'string' ? parseFloat(n) : n;
        if (isNaN(num)) return '0đ';
        return num.toLocaleString('vi-VN') + 'đ';
    };

    const tabs = [
        { id: 'all', label: 'Tất cả giải pháp', icon: 'layers' },
        { id: 'active', label: 'Xử lý tự động', icon: 'activity' },
        { id: 'completed', label: 'Đã hoàn tất', icon: 'check-circle' },
    ];

    const filteredWorkflows = workflows.filter(wf => {
        if (activeTab === 'all') return true;
        if (activeTab === 'active') return wf.status === 'active';
        if (activeTab === 'completed') return wf.status === 'completed';
        return true;
    });

    const totalPages = Math.ceil(filteredWorkflows.length / itemsPerPage);
    const paginatedWorkflows = filteredWorkflows.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    useEffect(() => {
        setCurrentPage(1);
    }, [activeTab]);

    const getStatusBadge = (status: string) => {
        switch (status.toLowerCase()) {
            case 'active':
            case 'success': 
                return <span className="px-3 py-1 bg-[#FBBF24]/10 text-[#FBBF24] text-[10px] font-black uppercase rounded-full border border-[#FBBF24]/20">Đã kích hoạt</span>;
            case 'pending':
                return <span className="px-3 py-1 bg-amber-500/10 text-amber-500 text-[10px] font-black uppercase rounded-full border border-amber-500/20">Chờ xử lý</span>;
            default:
                return <span className="px-3 py-1 bg-gray-500/10 text-gray-400 text-[10px] font-black uppercase rounded-full border border-gray-500/10">{status}</span>;
        }
    };

    return (
        <HostingLayout>
            <div className="bg-[#060a09] min-h-screen pb-24 overflow-x-hidden">
                {/* Breadcrumb Navigation */}
                <div className="max-w-7xl mx-auto px-4 py-3">
                    <nav className="flex items-center gap-3 text-[11px] font-black uppercase tracking-[2px] transition-all duration-300">
                        <Link to="/" className="text-gray-400 hover:text-[#FBBF24] flex items-center gap-1.5 transition-colors">
                            <FeatherIcon icon="home" size={12} />
                            Trang chủ
                        </Link>
                        <FeatherIcon icon="chevron-right" size={10} className="text-gray-300" />
                        <Link to="/landing-workflows" className="text-gray-400 hover:text-[#FBBF24] transition-colors">Giải pháp</Link>
                        <FeatherIcon icon="chevron-right" size={10} className="text-gray-300" />
                        <span className="text-white">Kho workflow của tôi</span>
                    </nav>
                </div>

                {/* Hero Banner Section */}
                <div className="relative bg-gradient-to-r from-[#032030] via-[#04333b] to-[#032030] border-b border-white/[0.03] overflow-hidden">
                    <div className="max-w-7xl mx-auto px-4 py-12 relative z-10">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <h1 className="text-4xl md:text-6xl font-black !text-white uppercase tracking-tighter leading-none mb-1">
                                        QUẢN LÝ <span className="text-[#FBBF24]">WORKFLOWS</span>
                                    </h1>
                                    <p className="text-[11px] font-bold !text-white/50 uppercase tracking-[3px]">
                                        Tự động hoá mọi quy trình vận hành của bạn
                                    </p>
                                </div>
                            </div>
                            <Link 
                                to="/landing-workflows" 
                                className="px-8 h-14 rounded-xl font-black uppercase tracking-[2px] transition-all shadow-xl shadow-[#FBBF24]/20 text-[11px] flex items-center gap-3 bg-[#FBBF24] text-white hover:brightness-105"
                            >
                                <FeatherIcon icon="plus" size={16} />
                                KHÁM PHÁ WORKFLOW MỚI
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 py-10">
                    <div className="bg-[#0d1412] rounded-xl border border-white/[0.03] shadow-sm overflow-hidden">
                        {/* Tabs Navigation */}
                        <div className="flex items-center border-b border-white/[0.03] px-6">
                            {tabs.map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-2 py-6 px-6 text-[11px] font-black uppercase tracking-widest transition-all relative ${activeTab === tab.id ? 'text-[#FBBF24]' : 'text-gray-400 hover:text-gray-400 dark:hover:text-white'}`}
                                >
                                    <FeatherIcon icon={tab.icon} size={14} />
                                    {tab.label}
                                    {activeTab === tab.id && (
                                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#FBBF24]" />
                                    )}
                                </button>
                            ))}
                        </div>

                        {/* List Content */}
                        <div className="p-0">
                            {loading ? (
                                <div className="py-24 flex flex-col items-center justify-center gap-4 opacity-50">
                                    <div className="w-12 h-12 border-4 border-[#FBBF24] border-t-transparent rounded-full animate-spin"></div>
                                    <p className="text-xs font-black uppercase tracking-widest">Đang kết nối kho dữ liệu...</p>
                                </div>
                            ) : filteredWorkflows.length === 0 ? (
                                <div className="py-32 flex flex-col items-center justify-center gap-6 opacity-40 text-center">
                                    <div className="w-20 h-20 bg-[#0d1412]/5 rounded-full flex items-center justify-center">
                                        <FeatherIcon icon="folder" size={40} />
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-[13px] font-black uppercase tracking-[2px]">Chưa có giải pháp nào</p>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Các workflow bạn đã mua sẽ hiển thị tại đây</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead>
                                            <tr className="bg-[#0d1412]/5 text-[10px] font-black text-gray-400 uppercase tracking-[2px]">
                                                <th className="p-6">Chi tiết Workflow</th>
                                                <th className="p-6 text-center">Giá trị</th>
                                                <th className="p-6 text-center">Trạng thái</th>
                                                <th className="p-6 text-center">Ngày sở hữu</th>
                                                <th className="p-6 text-right">Hành động</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                                            {paginatedWorkflows.map((wf) => (
                                                <tr key={wf.id} className="hover:bg-white/5/50 dark:hover:bg-[#0d1412]/[0.02] transition-colors group">
                                                    <td className="p-6">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-12 h-12 bg-[#0d1412]/5 rounded-xl overflow-hidden flex items-center justify-center">
                                                                {wf.image ? (
                                                                    <img src={wf.image} alt={wf.name} className="w-full h-full object-cover" />
                                                                ) : (
                                                                    <FeatherIcon icon="cpu" size={20} className="text-gray-400 group-hover:text-[#FBBF24]" />
                                                                )}
                                                            </div>
                                                            <div>
                                                                <span className="text-[14px] font-black dark:text-white uppercase tracking-tight block leading-none mb-1 group-hover:text-[#FBBF24] transition-colors">{wf.name}</span>
                                                                <span className="text-[9px] font-black text-gray-400 uppercase tracking-[1px] bg-[#0d1412]/5 px-1.5 py-0.5 rounded">ID: #{wf.wfId || wf.id}</span>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="p-6 text-center">
                                                        <span className="text-[13px] font-black text-[#FBBF24] tracking-tight">{fmt(wf.price)}</span>
                                                    </td>
                                                    <td className="p-6 text-center">
                                                        {getStatusBadge(wf.status)}
                                                    </td>
                                                    <td className="p-6 text-center">
                                                        <span className="text-[12px] font-black text-gray-400 tracking-tight">{wf.date}</span>
                                                    </td>
                                                    <td className="p-6 text-right">
                                                        <div className="flex items-center justify-end gap-3">
                                                            <Link to={`/landing-workflows/${wf.wfId}`} className="h-10 px-4 flex items-center justify-center rounded-lg border border-white/[0.03] hover:bg-gray-100 dark:hover:bg-[#0d1412]/5 transition-all text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-white">
                                                                Chi tiết
                                                            </Link>
                                                            <button 
                                                                className="h-10 px-6 rounded-lg bg-[#FBBF24] text-white text-[10px] font-black uppercase tracking-widest shadow-lg shadow-[#FBBF24]/20 hover:brightness-110 active:scale-95 transition-all flex items-center gap-2"
                                                            >
                                                                <FeatherIcon icon="download" size={14} /> TẢI BLUEPRINT
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>

                                    {totalPages > 1 && (
                                        <div className="flex flex-col md:flex-row items-center justify-between p-6 border-t border-white/[0.03] bg-white/5/10 gap-4">
                                            <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                                Trang {currentPage} / {totalPages}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <button 
                                                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                                    disabled={currentPage === 1}
                                                    className="w-10 h-10 flex items-center justify-center rounded-lg border border-white/[0.03] bg-transparent disabled:opacity-30 transition-all"
                                                >
                                                    <FeatherIcon icon="chevron-left" size={16} />
                                                </button>
                                                <button 
                                                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                                    disabled={currentPage === totalPages}
                                                    className="w-10 h-10 flex items-center justify-center rounded-lg border border-white/[0.03] bg-transparent disabled:opacity-30 transition-all"
                                                >
                                                    <FeatherIcon icon="chevron-right" size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
                        <div className="bg-[#0d1412] p-6 rounded-xl border border-white/[0.03] flex items-center gap-5">
                            <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
                                <FeatherIcon icon="box" size={24} />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Tổng giải pháp</p>
                                <p className="text-xl font-black dark:text-white leading-none">{workflows.length}</p>
                            </div>
                        </div>
                        <div className="bg-[#0d1412] p-6 rounded-xl border border-white/[0.03] flex items-center gap-5">
                            <div className="w-12 h-12 rounded-xl bg-[#FBBF24]/10 text-[#FBBF24] flex items-center justify-center">
                                <FeatherIcon icon="activity" size={24} />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Đang kích hoạt</p>
                                <p className="text-xl font-black dark:text-white leading-none">{workflows.filter(w => w.status === 'active' || w.status === 'success').length}</p>
                            </div>
                        </div>
                        <div className="bg-[#0d1412] p-6 rounded-xl border border-white/[0.03] flex items-center gap-5">
                            <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
                                <FeatherIcon icon="dollar-sign" size={24} />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Tổng đầu tư</p>
                                <p className="text-xl font-black dark:text-white leading-none">{fmt(workflows.reduce((acc, v) => acc + v.price, 0))}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </HostingLayout>
    );
};

export default WorkflowManagementPage;
