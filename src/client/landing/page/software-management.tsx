import React, { useState, useEffect } from 'react';
import HostingLayout from '../layouts/HostingLayout';
import FeatherIcon from 'feather-icons-react';
import { useTheme } from '../context/ThemeContext';
import { toolKeyService, authService } from '../../../config';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';

const SoftwareManagementPage = () => {
    const { isDark } = useTheme();
    const [keyList, setKeyList] = useState<any[]>([]);
    const [activeTab, setActiveTab] = useState('all');
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [renewing, setRenewing] = useState<number | null>(null);
    const [copiedId, setCopiedId] = useState<number | null>(null);
    const itemsPerPage = 3;

    const handleCopy = (id: number, text: string) => {
        navigator.clipboard.writeText(text).then(() => {
            setCopiedId(id);
            setTimeout(() => setCopiedId(null), 2000);
        }).catch(() => {
            // Fallback for older browsers
            const el = document.createElement('textarea');
            el.value = text;
            document.body.appendChild(el);
            el.select();
            document.execCommand('copy');
            document.body.removeChild(el);
            setCopiedId(id);
            setTimeout(() => setCopiedId(null), 2000);
        });
    };

    const fetchKeys = async () => {
        try {
            setLoading(true);
            const res = await toolKeyService.getMyKeys();
            let data = res;
            if (res.success) data = res.data;
            
            // Map the API data to our UI structure
            const items = (data || []).map((item: any) => ({
                id: item.id,
                packageId: item.package_id,
                name: item.package?.name || item.package_name || 'Phần mềm không xác định',
                key: item.keyToken || item.key_token || '****************',
                machineId: item.machine_id || 'Chưa kích hoạt',
                expiry: item.expires_at ? new Date(item.expires_at).toISOString().split('T')[0] : 'Vô thời hạn',
                rawExpiry: item.expires_at,
                status: item.status === 'active' ? 'active' : item.status === 'expired' ? 'expired' : 'inactive',
                isExpiring: item.expires_at ? (new Date(item.expires_at).getTime() - new Date().getTime() < 3 * 24 * 60 * 60 * 1000) : false,
                price: item.price || 0,
                version: item.package?.version || '1.0.0'
            }));
            setKeyList(items);
        } catch (error) {
            console.error('Error fetching keys:', error);
            // Fallback for demo
            setKeyList([
                { id: 1, packageId: 101, name: 'Tool Facebook Auto', key: 'FB-XXXX-YYYY-ZZZZ', machineId: 'DESKTOP-ABC123', expiry: '2026-05-10', status: 'active', isExpiring: false, price: 99000, version: '2.4.1' },
                { id: 2, packageId: 102, name: 'Proxy Manager Pro', key: 'PX-AAAA-BBBB-CCCC', machineId: 'SERVER-XYZ987', expiry: '2026-04-12', status: 'active', isExpiring: true, price: 150000, version: '1.2.0' },
                { id: 3, packageId: 103, name: 'Antidetect Browser 3H', key: 'AD-1111-2222-3333', machineId: 'Chưa kích hoạt', expiry: '2026-06-20', status: 'inactive', isExpiring: false, price: 500000, version: '3.0.0' },
                { id: 4, packageId: 104, name: 'TikTok Reuploader', key: 'TT-6666-7777-8888', machineId: 'DESKTOP-555', expiry: '2026-08-30', status: 'active', isExpiring: false, price: 299000, version: '1.5.2' },
                { id: 5, packageId: 105, name: 'Gmail Creator v3', key: 'GM-9999-0000-1111', machineId: 'Chưa kích hoạt', expiry: '2026-10-15', status: 'inactive', isExpiring: false, price: 790000, version: '3.1.0' },
            ]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchKeys();
    }, []);

    const handleRenew = async (item: any) => {
        try {
            setRenewing(item.id);
            
            // 1. Fetch available prices for this package
            const packagesRes = await toolKeyService.listPackages();
            let packages = packagesRes;
            if (packagesRes.success) packages = packagesRes.data;
            
            const pkg = packages.find((p: any) => p.id === item.packageId);
            
            if (!pkg || !pkg.prices || pkg.prices.length === 0) {
                Swal.fire('Lỗi', 'Gói phần mềm này hiện không có bảng giá gia hạn.', 'error');
                return;
            }
    
            // 2. Prepare HTML for Selection
            const optionsHtml = pkg.prices.map((p: any) => 
                `<option value="${p.id}">${p.label} - ${Number(p.price).toLocaleString()} VNĐ</option>`
            ).join('');
    
            // 3. Show Swal with custom styling
            const { value: priceId } = await Swal.fire({
                title: 'GIA HẠN PHẦN MỀM',
                html: `
                    <div style="text-align: left; margin-bottom: 20px; font-family: 'Inter', sans-serif;">
                        <div style="font-size: 12px; font-weight: 800; color: #94a3b8; text-transform: uppercase; margin-bottom: 5px;">Phần mềm</div>
                        <div style="font-size: 16px; font-weight: 900; color: #0f172a; text-transform: uppercase;">${item.name}</div>
                    </div>
                    <div style="text-align: left;">
                        <label style="font-size: 11px; font-weight: 800; color: #64748b; text-transform: uppercase; display: block; margin-bottom: 8px;">Chọn thời gian gia hạn:</label>
                        <select id="swal-price-select" style="width: 100%; height: 50px; border-radius: 12px; border: 2px solid #f1f5f9; padding: 0 15px; font-weight: 800; font-size: 13px; outline: none; appearance: none; background: #f8fafc;">
                            ${optionsHtml}
                        </select>
                    </div>
                `,
                focusConfirm: false,
                showCancelButton: true,
                confirmButtonText: 'XÁC NHẬN GIA HẠN',
                cancelButtonText: 'HỦY',
                confirmButtonColor: '#FBBF24',
                cancelButtonColor: '#ff4d4f',
                showLoaderOnConfirm: true,
                preConfirm: () => {
                    return (document.getElementById('swal-price-select') as HTMLSelectElement).value;
                }
            });
    
            if (priceId) {
                const res = await toolKeyService.renewKey(item.id, parseInt(priceId));
                if (res.success || res.id) {
                    await Swal.fire({
                        icon: 'success',
                        title: 'THÀNH CÔNG',
                        text: 'Bản quyền của bạn đã được gia hạn thành công.',
                        confirmButtonColor: '#FBBF24'
                    });
                    fetchKeys();
                }
            }
        } catch (error: any) {
            Swal.fire('Lỗi', error.response?.data?.message || error.message || 'Không thể gia hạn', 'error');
        } finally {
            setRenewing(null);
        }
    };

    const fmt = (n: number) => (n || 0).toLocaleString('vi-VN') + 'đ';

    const tabs = [
        { id: 'all', label: 'Tất cả Key', icon: 'key' },
        { id: 'active', label: 'Đang dùng', icon: 'zap' },
        { id: 'expiring', label: 'Sắp hết hạn', icon: 'clock' },
    ];

    const filteredKeys = keyList.filter(key => {
        if (activeTab === 'all') return true;
        if (activeTab === 'active') return key.status === 'active';
        if (activeTab === 'expiring') return key.isExpiring;
        return true;
    });

    const totalPages = Math.ceil(filteredKeys.length / itemsPerPage);
    const paginatedKeys = filteredKeys.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    useEffect(() => {
        setCurrentPage(1);
    }, [activeTab]);

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'active': return <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 text-[10px] font-black uppercase rounded-full">Đang hoạt động</span>;
            case 'expired': return <span className="px-3 py-1 bg-red-500/10 text-red-500 text-[10px] font-black uppercase rounded-full">Hết hạn</span>;
            case 'inactive': return <span className="px-3 py-1 bg-gray-500/10 text-gray-400 text-[10px] font-black uppercase rounded-full">Chưa kích hoạt</span>;
            default: return <span className="px-3 py-1 bg-gray-500/10 text-gray-400 text-[10px] font-black uppercase rounded-full">{status}</span>;
        }
    };

    return (
        <HostingLayout>
            <div className="bg-[#060a09] min-h-screen pb-24 overflow-x-hidden">
                {/* Breadcrumb Navigation */}
                <div className="max-w-7xl mx-auto px-4 py-3">
                    <nav className="flex items-center gap-3 text-[10px] md:text-[11px] font-black uppercase tracking-[2px] transition-all duration-300">
                        <Link to="/" className="text-gray-400 hover:text-[#FBBF24] flex items-center gap-1.5 transition-colors group">
                            <FeatherIcon icon="home" size={12} />
                            Trang chủ
                        </Link>
                        <FeatherIcon icon="chevron-right" size={10} className="text-gray-300" />
                        <Link to="/landing-vps" className="text-gray-400 hover:text-[#FBBF24] transition-colors">Dịch vụ</Link>
                        <FeatherIcon icon="chevron-right" size={10} className="text-gray-300" />
                        <span className="text-white">Quản lý Key Phần mềm</span>
                    </nav>
                </div>

                {/* Hero Banner Section */}
                <div className="relative bg-gradient-to-r from-[#032030] via-[#04333b] to-[#032030] border-b border-white/[0.03] overflow-hidden">
                    <div className="max-w-7xl mx-auto px-4 py-10 relative z-10">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <h1 className="text-4xl md:text-6xl font-black !text-white uppercase tracking-tighter leading-none">
                                        QUẢN LÝ <span className="text-[#FBBF24]">KEY PHẦN MỀM</span>
                                    </h1>
                                    <p className="text-[11px] font-bold !text-white/50 uppercase tracking-[2px]">
                                        Theo dõi bản quyền, máy chủ kích hoạt và gia hạn dịch vụ
                                    </p>
                                </div>
                            </div>
                            <Link 
                                to="/landing-vps" 
                                className="px-8 py-4 rounded-[10px] font-black uppercase tracking-[2px] hover:scale-105 active:scale-95 transition-all shadow-xl shadow-[#FBBF24]/20 text-[11px] flex items-center gap-3 mb-2"
                                style={{ backgroundColor: '#FBBF24', color: '#FFFFFF' }}
                            >
                                <FeatherIcon icon="shopping-cart" size={16} color="white" />
                                Mua Key mới
                            </Link>
                        </div>
                    </div>
                    {/* Background Detail */}
                    <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-[#FBBF24]/10 to-transparent opacity-50"></div>
                    <FeatherIcon icon="key" size={200} className="absolute -right-20 -bottom-20 text-white/5 rotate-12" />
                </div>

                <div className="max-w-7xl mx-auto px-4 py-12">
                    <div className="bg-[#0d1412] rounded-[10px] border border-white/[0.03] shadow-sm overflow-hidden">
                        {/* Tabs Navigation */}
                        <div className="flex items-center border-b border-white/[0.03] px-6">
                            {tabs.map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-2 py-5 px-6 text-[11px] font-black uppercase tracking-widest transition-all relative ${activeTab === tab.id ? 'text-[#FBBF24]' : 'text-gray-400 hover:text-gray-400 dark:hover:text-white'}`}
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
                                    <p className="text-xs font-black uppercase tracking-widest">Đang tải dữ liệu...</p>
                                </div>
                            ) : filteredKeys.length === 0 ? (
                                <div className="py-32 flex flex-col items-center justify-center gap-6 opacity-40 text-center">
                                    <div className="w-20 h-20 bg-[#0d1412]/5 rounded-full flex items-center justify-center">
                                        <FeatherIcon icon="inbox" size={40} />
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-[13px] font-black uppercase tracking-[2px]">Không tìm thấy Key nào</p>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Bạn chưa sở hữu Key phần mềm nào</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead>
                                            <tr className="bg-[#0d1412]/5 text-[10px] font-black text-gray-400 uppercase tracking-[2px]">
                                                <th className="p-6">Phần mềm</th>
                                                <th className="p-6">License Key</th>
                                                <th className="p-6">Machine ID</th>
                                                <th className="p-6 text-center">Trạng thái</th>
                                                <th className="p-6 text-center">Hết hạn</th>
                                                <th className="p-6 text-right">Thao tác</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                                            {paginatedKeys.map((item) => (
                                                <tr key={item.id} className="hover:bg-white/5/50 dark:hover:bg-[#0d1412]/[0.02] transition-colors group">
                                                    <td className="p-6">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-10 h-10 bg-[#0d1412]/5 rounded-[10px] flex items-center justify-center text-gray-400 group-hover:bg-[#FBBF24]/10 group-hover:text-[#FBBF24] transition-all">
                                                                <FeatherIcon icon="package" size={18} />
                                                            </div>
                                                            <div>
                                                                <span className="text-[14px] font-black dark:text-white uppercase tracking-tight block leading-none mb-1">{item.name}</span>
                                                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Phiên bản {item.version}</span>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="p-6">
                                                        <div className="flex items-center gap-2 px-3 py-1.5 bg-[#0d1412]/5 rounded-lg border border-white/[0.03] w-fit">
                                                            <span className="text-[12px] font-black text-gray-300 font-mono tracking-tight">{item.key}</span>
                                                            <button
                                                                onClick={() => handleCopy(item.id, item.key)}
                                                                className={`transition-all ${copiedId === item.id ? 'text-emerald-400' : 'text-gray-400 hover:text-[#FBBF24]'}`}
                                                                title={copiedId === item.id ? 'Đã sao chép!' : 'Copy Key'}
                                                            >
                                                                <FeatherIcon icon={copiedId === item.id ? 'check' : 'copy'} size={12} />
                                                            </button>
                                                        </div>
                                                    </td>
                                                    <td className="p-6">
                                                        <span className="text-[11px] font-black text-gray-400 uppercase tracking-tight">{item.machineId}</span>
                                                    </td>
                                                    <td className="p-6 text-center">
                                                        {getStatusBadge(item.status)}
                                                    </td>
                                                    <td className="p-6 text-center">
                                                        <div className="flex flex-col items-center gap-1">
                                                            <span className={`text-[12px] font-black tracking-tight ${item.isExpiring ? 'text-red-500 animate-pulse' : 'dark:text-white'}`}>{item.expiry}</span>
                                                            <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">{item.isExpiring ? 'Sắp hết hạn' : 'Hợp lệ'}</span>
                                                        </div>
                                                    </td>
                                                    <td className="p-6 text-right">
                                                        <div className="flex items-center justify-end gap-3">
                                                            <button className="p-2.5 rounded-[8px] border border-white/[0.03] hover:bg-gray-100 dark:hover:bg-[#0d1412]/5 transition-all text-gray-400 hover:text-[#FBBF24]" title="Xem chi tiết">
                                                                <FeatherIcon icon="file-text" size={16} />
                                                            </button>
                                                            <button 
                                                                onClick={() => handleRenew(item)}
                                                                disabled={renewing !== null}
                                                                className="p-2.5 rounded-[8px] transition-all text-[10px] font-black uppercase tracking-widest px-4 shadow-lg shadow-[#FBBF24]/20 hover:scale-105 active:scale-95 flex items-center gap-2"
                                                                style={{ backgroundColor: '#FBBF24', color: '#FFFFFF' }}
                                                            >
                                                                {renewing === item.id && (
                                                                    <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                                                )}
                                                                {renewing === item.id ? 'ĐANG XỬ LÝ' : 'GIA HẠN'}
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>

                                    {totalPages > 1 && (
                                        <div className="flex flex-col md:flex-row items-center justify-between p-6 border-t border-white/[0.03] bg-[#0d1412]/[0.01] gap-4">
                                            <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                                Hiển thị { (currentPage - 1) * itemsPerPage + 1 } - { Math.min(currentPage * itemsPerPage, filteredKeys.length) } / { filteredKeys.length } Key
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <button 
                                                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                                    disabled={currentPage === 1}
                                                    className="w-10 h-10 flex items-center justify-center rounded-lg border border-white/[0.03] hover:bg-[#0d1412] dark:hover:bg-[#0d1412]/5 disabled:opacity-30 disabled:pointer-events-none transition-all text-gray-400"
                                                >
                                                    <FeatherIcon icon="chevron-left" size={16} />
                                                </button>
                                                {[...Array(totalPages)].map((_, i) => (
                                                    <button
                                                        key={i}
                                                        onClick={() => setCurrentPage(i + 1)}
                                                        className={`w-10 h-10 rounded-lg text-[11px] font-black transition-all ${currentPage === i + 1 ? 'bg-[#FBBF24] text-white shadow-lg shadow-[#FBBF24]/20' : 'border border-white/[0.03] hover:bg-[#0d1412] dark:hover:bg-[#0d1412]/5 text-gray-400'}`}
                                                    >
                                                        {i + 1}
                                                    </button>
                                                ))}
                                                <button 
                                                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                                    disabled={currentPage === totalPages}
                                                    className="w-10 h-10 flex items-center justify-center rounded-lg border border-white/[0.03] hover:bg-[#0d1412] dark:hover:bg-[#0d1412]/5 disabled:opacity-30 disabled:pointer-events-none transition-all text-gray-400"
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

                    {/* Footer Guide Section */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
                        <div className="bg-[#FBBF24]/5 border border-[#FBBF24]/20 p-8 rounded-[20px] space-y-4">
                            <div className="w-12 h-12 bg-[#FBBF24] text-white rounded-xl flex items-center justify-center">
                                <FeatherIcon icon="info" size={24} />
                            </div>
                            <h4 className="text-lg font-black dark:text-white uppercase tracking-tighter">Hướng dẫn kích hoạt</h4>
                            <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest leading-relaxed">
                                Copy Key và nhập vào phần mềm tại mục "Bản quyền". Một số Key yêu cầu Hardware ID để được phê duyệt.
                            </p>
                        </div>
                        <div className="bg-[#032030]/5 border border-[#032030]/20 p-8 rounded-[20px] space-y-4">
                            <div className="w-12 h-12 bg-[#032030] text-white rounded-xl flex items-center justify-center">
                                <FeatherIcon icon="shield" size={24} />
                            </div>
                            <h4 className="text-lg font-black dark:text-white uppercase tracking-tighter">Chính sách bảo hành</h4>
                            <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest leading-relaxed">
                                Key lỗi sẽ được đổi mới ngay lập tức. Chúng tôi cam kết Uptime 99.9% cho các hệ thống License Server.
                            </p>
                        </div>
                        <div className="bg-[#FBBF24] p-8 rounded-[20px] space-y-4 text-white shadow-xl shadow-[#FBBF24]/20">
                            <div className="w-12 h-12 bg-[#0d1412] text-[#FBBF24] rounded-xl flex items-center justify-center">
                                <FeatherIcon icon="help-circle" size={24} />
                            </div>
                            <h4 className="text-lg font-black uppercase tracking-tighter text-white">Hỗ trợ kỹ thuật</h4>
                            <p className="text-[11px] text-white/80 font-bold uppercase tracking-widest leading-relaxed">
                                Gặp khó khăn khi sử dụng phần mềm? Liên hệ ngay với đội ngũ Support 24/7 của 3HSTATION.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </HostingLayout>
    );
};

export default SoftwareManagementPage;
