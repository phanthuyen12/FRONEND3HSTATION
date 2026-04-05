import React, { useState, useEffect } from 'react';
import HostingLayout from '../layouts/HostingLayout';
import FeatherIcon from 'feather-icons-react';
import { useTheme } from '../context/ThemeContext';
import { vpsService, authService } from '../../../config';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';

const VpsManagementPage = () => {
    const { isDark } = useTheme();
    const [vpsList, setVpsList] = useState<any[]>([]);
    const [activeTab, setActiveTab] = useState('all'); // all, expiring, renewal
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    useEffect(() => {
        const fetchVps = async () => {
            try {
                const data = await vpsService.getMyNodeverseVpsOrders();
                // Map the API data to our UI structure if needed
                const items = (data || []).map((item: any) => ({
                    id: item.id,
                    name: item.planName || `VPS #${item.id}`,
                    ip: item.deviceIp || 'Đang cấp phát...',
                    os: item.operatingSystem || 'Linux',
                    config: `${item.cpu || 0} vCPU | ${item.ram || 0}GB | ${item.storage || 0}GB`,
                    status: item.containerStatus === 'running' ? 'running' : 'stopped',
                    expiry: item.expiresAt ? new Date(item.expiresAt).toISOString().split('T')[0] : 'N/A',
                    isExpiring: item.expiresAt ? (new Date(item.expiresAt).getTime() - new Date().getTime() < 7 * 24 * 60 * 60 * 1000) : false,
                    price: item.billingAmount || 0
                }));
                setVpsList(items);
            } catch (error) {
                console.error('Error fetching VPS:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchVps();
    }, []);

    const fmt = (n: number) => n.toLocaleString('vi-VN') + 'đ';

    const tabs = [
        { id: 'all', label: 'Tất cả dịch vụ', icon: 'layers' },
        { id: 'expiring', label: 'Sắp hết hạn', icon: 'clock' },
        { id: 'renewal', label: 'Cần gia hạn', icon: 'refresh-cw' },
    ];

    const filteredVps = vpsList.filter(vps => {
        if (activeTab === 'all') return true;
        if (activeTab === 'expiring') return vps.isExpiring;
        if (activeTab === 'renewal') return vps.isExpiring; // For now same logic
        return true;
    });

    const totalPages = Math.ceil(filteredVps.length / itemsPerPage);
    const paginatedVps = filteredVps.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    useEffect(() => {
        setCurrentPage(1);
    }, [activeTab]);

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'running': return <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 text-[10px] font-black uppercase rounded-full">Đang chạy</span>;
            case 'stopped': return <span className="px-3 py-1 bg-red-500/10 text-red-500 text-[10px] font-black uppercase rounded-full">Đã dừng</span>;
            default: return <span className="px-3 py-1 bg-gray-500/10 text-gray-500 text-[10px] font-black uppercase rounded-full">{status}</span>;
        }
    };

    return (
        <HostingLayout>
            <div className="bg-gray-50 dark:bg-[#060a09] min-h-screen pb-24 overflow-x-hidden">
                {/* Breadcrumb Navigation */}
                <div className="max-w-7xl mx-auto px-4 py-3">
                    <nav className="flex items-center gap-3 text-[10px] md:text-[11px] font-black uppercase tracking-[2px] transition-all duration-300">
                        <Link to="/" className="text-gray-400 hover:text-[#00BA4A] flex items-center gap-1.5 transition-colors group">
                            <FeatherIcon icon="home" size={12} />
                            Trang chủ
                        </Link>
                        <FeatherIcon icon="chevron-right" size={10} className="text-gray-300" />
                        <Link to="/landing-vps" className="text-gray-400 hover:text-[#00BA4A] transition-colors">Dịch vụ</Link>
                        <FeatherIcon icon="chevron-right" size={10} className="text-gray-300" />
                        <span className="text-gray-900 dark:text-white">Quản lý VPS</span>
                    </nav>
                </div>

                {/* Hero Banner Section */}
                <div className="relative bg-gradient-to-r from-[#032030] via-[#04333b] to-[#032030] border-b border-white/5 overflow-hidden">
                    <div className="max-w-7xl mx-auto px-4 py-10 relative z-10">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <h1 className="text-4xl md:text-6xl font-black !text-white uppercase tracking-tighter leading-none">
                                        QUẢN LÝ <span className="text-[#00BA4A]">ĐƠN HÀNG VPS</span>
                                    </h1>
                                    <p className="text-[11px] font-bold !text-white/50 uppercase tracking-[2px]">
                                        Theo dõi, quản lý và gia hạn máy chủ đám mây của bạn
                                    </p>
                                </div>
                            </div>
                            <Link 
                                to="/landing-vps" 
                                className="px-8 py-4 rounded-[10px] font-black uppercase tracking-[2px] hover:scale-105 active:scale-95 transition-all shadow-xl shadow-[#00BA4A]/20 text-[11px] flex items-center gap-3 mb-2"
                                style={{ backgroundColor: '#00BA4A', color: '#FFFFFF' }}
                            >
                                <FeatherIcon icon="plus" size={16} color="white" />
                                Đăng ký VPS mới
                            </Link>
                        </div>
                    </div>
                    {/* Background Detail */}
                    <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-[#00BA4A]/10 to-transparent opacity-50"></div>
                    <FeatherIcon icon="server" size={200} className="absolute -right-20 -bottom-20 text-white/5 rotate-12" />
                </div>

                <div className="max-w-7xl mx-auto px-4 py-12">

                    <div className="bg-white dark:bg-[#0d1412] rounded-[10px] border border-gray-100 dark:border-white/5 shadow-sm overflow-hidden">
                        {/* Tabs Navigation */}
                        <div className="flex items-center border-b border-gray-100 dark:border-white/5 px-6">
                            {tabs.map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-2 py-5 px-6 text-[11px] font-black uppercase tracking-widest transition-all relative ${activeTab === tab.id ? 'text-[#00BA4A]' : 'text-gray-400 hover:text-gray-600 dark:hover:text-white'}`}
                                >
                                    <FeatherIcon icon={tab.icon} size={14} />
                                    {tab.label}
                                    {activeTab === tab.id && (
                                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#00BA4A]" />
                                    )}
                                </button>
                            ))}
                        </div>

                        {/* List Content */}
                        <div className="p-0">
                            {loading ? (
                                <div className="py-24 flex flex-col items-center justify-center gap-4 opacity-50">
                                    <div className="w-12 h-12 border-4 border-[#00BA4A] border-t-transparent rounded-full animate-spin"></div>
                                    <p className="text-xs font-black uppercase tracking-widest">Đang tải dữ liệu...</p>
                                </div>
                            ) : filteredVps.length === 0 ? (
                                <div className="py-32 flex flex-col items-center justify-center gap-6 opacity-40 text-center">
                                    <div className="w-20 h-20 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center">
                                        <FeatherIcon icon="inbox" size={40} />
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-[13px] font-black uppercase tracking-[2px]">Không tìm thấy dịch vụ nào</p>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Bạn chưa có vps nào trong danh mục này</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead>
                                            <tr className="bg-gray-50/50 dark:bg-white/5 text-[10px] font-black text-gray-400 uppercase tracking-[2px]">
                                                <th className="p-6">Thông tin VPS</th>
                                                <th className="p-6">Địa chỉ IP</th>
                                                <th className="p-6 text-center">Cấu hình</th>
                                                <th className="p-6 text-center">Trạng thái</th>
                                                <th className="p-6 text-center">Ngày hết hạn</th>
                                                <th className="p-6 text-right">Thao tác</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                                            {paginatedVps.map((vps) => (
                                                <tr key={vps.id} className="hover:bg-gray-50/50 dark:hover:bg-white/[0.02] transition-colors group">
                                                    <td className="p-6">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-10 h-10 bg-gray-100 dark:bg-white/5 rounded-[10px] flex items-center justify-center text-gray-400 group-hover:bg-[#00BA4A]/10 group-hover:text-[#00BA4A] transition-all">
                                                                <FeatherIcon icon="server" size={18} />
                                                            </div>
                                                            <div>
                                                                <span className="text-[14px] font-black dark:text-white uppercase tracking-tight block leading-none mb-1">{vps.name}</span>
                                                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{vps.os}</span>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="p-6">
                                                        <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-white/5 rounded-lg border border-gray-100 dark:border-white/5 w-fit">
                                                            <span className="text-[12px] font-black text-gray-700 dark:text-gray-300 font-mono tracking-tight">{vps.ip}</span>
                                                            <button className="text-gray-400 hover:text-[#00BA4A]" title="Copy IP">
                                                                <FeatherIcon icon="copy" size={12} />
                                                            </button>
                                                        </div>
                                                    </td>
                                                    <td className="p-6 text-center">
                                                        <span className="text-[11px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-tight">{vps.config}</span>
                                                    </td>
                                                    <td className="p-6 text-center">
                                                        {getStatusBadge(vps.status)}
                                                    </td>
                                                    <td className="p-6 text-center">
                                                        <div className="flex flex-col items-center gap-1">
                                                            <span className={`text-[12px] font-black tracking-tight ${vps.isExpiring ? 'text-red-500 animate-pulse' : 'dark:text-white'}`}>{vps.expiry}</span>
                                                            <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">{vps.isExpiring ? 'Sắp hết hạn' : 'Ổn định'}</span>
                                                        </div>
                                                    </td>
                                                    <td className="p-6 text-right">
                                                        <div className="flex items-center justify-end gap-3">
                                                            <Link to={`/landing-vps-detail/${vps.id}`} className="p-2.5 rounded-[8px] border border-gray-100 dark:border-white/5 hover:bg-gray-100 dark:hover:bg-white/5 transition-all text-gray-400 hover:text-[#00BA4A]" title="Xem chi tiết">
                                                                <FeatherIcon icon="eye" size={16} />
                                                            </Link>
                                                            <button 
                                                                className="p-2.5 rounded-[8px] transition-all text-[10px] font-black uppercase tracking-widest px-4 shadow-lg shadow-[#00BA4A]/20 hover:scale-105 active:scale-95"
                                                                style={{ backgroundColor: '#00BA4A', color: '#FFFFFF' }}
                                                            >
                                                                GIA HẠN DỊCH VỤ
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>

                                    {totalPages > 1 && (
                                        <div className="flex flex-col md:flex-row items-center justify-between p-6 border-t border-gray-100 dark:border-white/5 bg-gray-50/30 dark:bg-white/[0.01] gap-4">
                                            <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                                Hiển thị { (currentPage - 1) * itemsPerPage + 1 } - { Math.min(currentPage * itemsPerPage, filteredVps.length) } / { filteredVps.length } máy chủ
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <button 
                                                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                                    disabled={currentPage === 1}
                                                    className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-100 dark:border-white/5 hover:bg-white dark:hover:bg-white/5 disabled:opacity-30 disabled:pointer-events-none transition-all text-gray-400"
                                                >
                                                    <FeatherIcon icon="chevron-left" size={16} />
                                                </button>
                                                {[...Array(totalPages)].map((_, i) => (
                                                    <button
                                                        key={i}
                                                        onClick={() => setCurrentPage(i + 1)}
                                                        className={`w-10 h-10 rounded-lg text-[11px] font-black transition-all ${currentPage === i + 1 ? 'bg-[#00BA4A] text-white shadow-lg shadow-[#00BA4A]/20' : 'border border-gray-100 dark:border-white/5 hover:bg-white dark:hover:bg-white/5 text-gray-400'}`}
                                                    >
                                                        {i + 1}
                                                    </button>
                                                ))}
                                                <button 
                                                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                                    disabled={currentPage === totalPages}
                                                    className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-100 dark:border-white/5 hover:bg-white dark:hover:bg-white/5 disabled:opacity-30 disabled:pointer-events-none transition-all text-gray-400"
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

                    {/* Stats Section */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-10">
                         {[
                            { label: 'Tổng dịch vụ', value: vpsList.length, icon: 'server', color: 'blue' },
                            { label: 'Đang hoạt động', value: vpsList.filter(v => v.status === 'running').length, icon: 'activity', color: 'emerald' },
                            { label: 'Sắp hết hạn', value: vpsList.filter(v => v.isExpiring).length, icon: 'alert-circle', color: 'amber' },
                            { label: 'Ngân sách t.tháng', value: fmt(vpsList.reduce((acc, v) => acc + v.price, 0)), icon: 'credit-card', color: 'indigo' },
                         ].map((stat, i) => (
                             <div key={i} className="bg-white dark:bg-[#0d1412] p-6 rounded-[10px] border border-gray-100 dark:border-white/5 flex items-center gap-5 shadow-sm">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-${stat.color}-500/10 text-${stat.color}-500`}>
                                    <FeatherIcon icon={stat.icon} size={24} />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">{stat.label}</p>
                                    <p className="text-xl font-black dark:text-white uppercase tracking-tight leading-none">{stat.value}</p>
                                </div>
                             </div>
                         ))}
                    </div>
                </div>
            </div>
        </HostingLayout>
    );
};

export default VpsManagementPage;
