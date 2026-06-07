import React, { useState, useEffect } from 'react';
import HostingLayout from '../layouts/HostingLayout';
import FeatherIcon from 'feather-icons-react';
import { useTheme } from '../context/ThemeContext';
import { vpsService, authService } from '../../../config';
import { Link, useParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const VpsDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const { isDark } = useTheme();
    const navigate = useNavigate();
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    useEffect(() => {
        if (id) {
            loadVpsData(id);
        }
    }, [id]);

    const loadVpsData = async (instanceId: string) => {
        try {
            const result = await vpsService.getMyNodeverseVpsOrder(instanceId);
            if (result) {
                setData(result);
            }
        } catch (error: any) {
            console.error(error);
            Swal.fire({
                icon: 'error',
                title: 'Lỗi',
                text: 'Không thể tải thông tin VPS. Vui lòng thử lại sau.'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (action: 'start' | 'stop' | 'restart') => {
        if (!data || !data.id) return;
        
        const actionText = action === 'start' ? 'KHỞI ĐỘNG' : action === 'stop' ? 'TẮT' : 'KHỞI ĐỘNG LẠI';
        
        const result = await Swal.fire({
            title: `Xác nhận ${actionText}?`,
            text: `Bạn có chắc chắn muốn thực hiện hành động này trên VPS ${data.deviceIp || ''}?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#FCD34D',
            cancelButtonColor: '#ff4d4f',
            confirmButtonText: 'Đồng ý',
            cancelButtonText: 'Hủy'
        });

        if (result.isConfirmed) {
            setActionLoading(action);
            try {
                const res = await vpsService.changeNodeverseVpsContainerState(data.id, action);
                Swal.fire({
                    icon: 'success',
                    title: 'Thành công',
                    text: res.message || 'Lệnh đã được gửi đi thành công.',
                    confirmButtonColor: '#FCD34D'
                });
                // Optimistic UI update or reload
                setData({ ...data, status: res.status, containerStatus: res.containerStatus });
            } catch (error: any) {
                console.error(error);
                Swal.fire({
                    icon: 'error',
                    title: 'Lỗi',
                    text: error.message || `Không thể thực hiện hành động ${actionText}.`
                });
            } finally {
                setActionLoading(null);
            }
        }
    };

    const fmt = (n: any) => {
        const val = Number(n);
        if (isNaN(val)) return '0đ';
        return val.toLocaleString('vi-VN') + 'đ';
    };
    const isExpired = data && data.expiresAt ? new Date(data.expiresAt) < new Date() : false;

    if (loading) {
        return (
            <HostingLayout>
                <div className="min-h-screen bg-[#060a09] flex items-center justify-center">
                    <div className="flex flex-col items-center gap-4 opacity-50">
                        <div className="w-12 h-12 border-4 border-[#FCD34D] border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-xs font-black uppercase tracking-widest text-[#FCD34D]">\u0110ang đồng bộ hóa dữ liệu...</p>
                    </div>
                </div>
            </HostingLayout>
        );
    }

    if (!data) {
        return (
            <HostingLayout>
                <div className="min-h-screen bg-[#060a09] py-24 px-4 overflow-x-hidden text-center">
                     <div className="max-w-md mx-auto space-y-8">
                        <div className="w-24 h-24 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                            <FeatherIcon icon="alert-octagon" size={48} />
                        </div>
                        <h2 className="text-3xl font-black dark:text-white uppercase tracking-tighter">KHÔNG TÌM THẤY VPS</h2>
                        <p className="text-gray-400 font-bold uppercase tracking-widest text-sm">Máy chủ này không tồn tại hoặc bạn không có quyền truy cập.</p>
                        <Link to="/landing-vps-management" className="inline-block bg-[#FCD34D] text-black px-10 py-4 rounded-[10px] font-black uppercase tracking-[2px] transition-all hover:scale-105 active:scale-95 shadow-xl shadow-[#FCD34D]/20">
                            QUAY LẠI DANH SÁCH
                        </Link>
                     </div>
                </div>
            </HostingLayout>
        );
    }

    return (
        <HostingLayout>
            <div className="bg-[#060a09] min-h-screen pb-24 overflow-x-hidden">
                {/* Breadcrumb Navigation */}
                <div className="max-w-7xl mx-auto px-4 py-3">
                    <nav className="flex items-center gap-3 text-[10px] md:text-[11px] font-black uppercase tracking-[2px] transition-all duration-300">
                        <Link to="/" className="text-gray-400 hover:text-[#FCD34D] flex items-center gap-1.5 transition-colors group">
                            <FeatherIcon icon="home" size={12} />
                            Trang chủ
                        </Link>
                        <FeatherIcon icon="chevron-right" size={10} className="text-gray-300" />
                        <Link to="/landing-vps" className="text-gray-400 hover:text-[#FCD34D] transition-colors">Dịch vụ</Link>
                        <FeatherIcon icon="chevron-right" size={10} className="text-gray-300" />
                        <Link to="/landing-vps-management" className="text-gray-400 hover:text-[#FCD34D] transition-colors">Quản lý VPS</Link>
                        <FeatherIcon icon="chevron-right" size={10} className="text-gray-300" />
                        <span className="text-white uppercase tracking-widest">{data.deviceIp || 'CHI TIẾT'}</span>
                    </nav>
                </div>

                {/* Hero Banner Section */}
                <div className="relative bg-gradient-to-r from-[#032030] via-[#04333b] to-[#032030] border-b border-white/[0.03] overflow-hidden">
                    <div className="max-w-7xl mx-auto px-4 py-10 relative z-10">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <h1 className="text-4xl md:text-6xl font-black !text-white uppercase tracking-tighter leading-none">
                                        CHI TIẾT <span className="text-[#FCD34D]">MÁY CHỦ</span>
                                    </h1>
                                    <div className="flex flex-wrap items-center gap-4">
                                        <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 rounded-full text-[9px] font-black uppercase tracking-widest">
                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></div>
                                            {data.containerStatus === 'running' ? 'Trực tuyến' : 'Ngoại tuyến'}
                                        </div>
                                        <p className="text-[11px] font-bold !text-white/50 uppercase tracking-[2px]">
                                            {data.planName} | ID: {data.id}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 pb-2">
                                <button onClick={() => navigate(-1)} className="p-4 rounded-[10px] bg-[#0d1412]/5 border border-white/10 !text-white/60 hover:!text-white transition-all backdrop-blur-sm">
                                    <FeatherIcon icon="arrow-left" size={20} />
                                </button>
                                <button onClick={() => loadVpsData(id!)} className="p-4 rounded-[10px] bg-[#0d1412]/5 border border-white/10 !text-white/60 hover:text-[#FCD34D] transition-all backdrop-blur-sm">
                                    <FeatherIcon icon="refresh-cw" size={20} className={loading ? 'animate-spin' : ''} />
                                </button>
                            </div>
                        </div>
                    </div>
                    {/* Background Detail */}
                    <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-[#FCD34D]/10 to-transparent opacity-50"></div>
                    <FeatherIcon icon="cpu" size={200} className="absolute -right-20 -bottom-20 text-white/5 rotate-12" />
                </div>

                <div className="max-w-7xl mx-auto px-4 py-12">

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-8">
                            {/* Control Panel Card */}
                            <div className="bg-[#0d1412] p-8 rounded-[10px] border border-white/[0.03] shadow-sm space-y-8">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-[10px] bg-[#FCD34D]/10 text-[#FCD34D] flex items-center justify-center">
                                        <FeatherIcon icon="cpu" size={20} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-black dark:text-white uppercase tracking-tighter leading-none">Bảng điều khiển</h3>
                                        <p className="text-[9px] text-gray-400 font-bold uppercase tracking-[1px] mt-1 text-left">Thực thi lệnh trực tiếp tới máy chủ</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <button
                                        onClick={() => handleAction('start')}
                                        disabled={actionLoading === 'start' || data.containerStatus === 'running' || isExpired}
                                        className="p-6 rounded-[10px] bg-emerald-500 !text-white flex flex-col items-center gap-3 transition-all hover:scale-105 active:scale-95 disabled:opacity-30 shadow-xl shadow-emerald-500/20"
                                    >
                                        <FeatherIcon icon={actionLoading === 'start' ? 'loader' : 'play-circle'} className={actionLoading === 'start' ? 'animate-spin' : ''} size={32} color="white" />
                                        <span className="text-[10px] font-black uppercase tracking-widest !text-white">Khởi động</span>
                                    </button>

                                    <button
                                        onClick={() => handleAction('stop')}
                                        disabled={actionLoading === 'stop' || data.containerStatus !== 'running' || isExpired}
                                        className="p-6 rounded-[10px] bg-sky-600 !text-white flex flex-col items-center gap-3 transition-all hover:scale-105 active:scale-95 disabled:opacity-30 shadow-xl shadow-sky-600/20"
                                    >
                                        <FeatherIcon icon={actionLoading === 'stop' ? 'loader' : 'stop-circle'} className={actionLoading === 'stop' ? 'animate-spin' : ''} size={32} color="white" />
                                        <span className="text-[10px] font-black uppercase tracking-widest !text-white">Tắt máy</span>
                                    </button>

                                    <button
                                        onClick={() => handleAction('restart')}
                                        disabled={actionLoading === 'restart' || isExpired}
                                        className="p-6 rounded-[10px] bg-orange-500 !text-white flex flex-col items-center gap-3 transition-all hover:scale-105 active:scale-95 disabled:opacity-30 shadow-xl shadow-orange-500/20"
                                    >
                                        <FeatherIcon icon={actionLoading === 'restart' ? 'loader' : 'refresh-cw'} className={actionLoading === 'restart' ? 'animate-spin' : ''} size={32} color="white" />
                                        <span className="text-[10px] font-black uppercase tracking-widest !text-white">Khởi động lại</span>
                                    </button>

                                    <button
                                        onClick={() => Swal.fire('Thông báo', 'Tính năng tối ưu đang được phát triển', 'info')}
                                        className="p-6 rounded-[10px] bg-indigo-600 !text-white flex flex-col items-center gap-3 transition-all hover:scale-105 active:scale-95 shadow-xl shadow-indigo-600/20"
                                    >
                                        <FeatherIcon icon="zap" size={32} color="white" />
                                        <span className="text-[10px] font-black uppercase tracking-widest !text-white">Tối ưu CPU</span>
                                    </button>
                                </div>
                                <div className="p-4 bg-[#0d1412]/5 rounded-[10px] flex items-center gap-3 border border-white/[0.03]">
                                    <FeatherIcon icon="info" size={16} className="text-[#FBBF24]" />
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-relaxed text-left">
                                        Máy chủ của bạn đang chạy hệ điều hành <span className="text-[#FBBF24]">{data.operatingSystem || 'Windows/Linux'}</span> tối ưu hóa cho n8n Automation.
                                    </p>
                                </div>
                            </div>

                            {/* Detail Specs Card */}
                            <div className="bg-[#0d1412] p-8 rounded-[10px] border border-white/[0.03] shadow-sm space-y-6">
                                <div className="flex justify-between items-center pb-6 border-b border-white/[0.03]">
                                    <h3 className="text-xl font-black dark:text-white uppercase tracking-tighter leading-none">Cấu hình kỹ thuật</h3>
                                    <div className="flex items-center gap-2 px-3 py-1 bg-[#FBBF24]/10 text-[#FBBF24] rounded-lg">
                                        <FeatherIcon icon="shield" size={12} />
                                        <span className="text-[10px] font-black uppercase">Standard Protection</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
                                    <div className="flex items-center justify-between pb-4 border-b border-white/[0.03]">
                                         <span className="text-[12px] font-bold text-gray-400 uppercase tracking-widest">Địa chỉ IPv4</span>
                                         <span className="text-[14px] font-black dark:text-white font-mono">{data.deviceIp || 'Đang cập phát...'}</span>
                                    </div>
                                    <div className="flex items-center justify-between pb-4 border-b border-white/[0.03]">
                                         <span className="text-[12px] font-bold text-gray-400 uppercase tracking-widest">Hệ điều hành</span>
                                         <span className="text-[14px] font-black dark:text-white">{data.operatingSystem || 'Linux'}</span>
                                    </div>
                                    <div className="flex items-center justify-between pb-4 border-b border-white/[0.03]">
                                         <span className="text-[12px] font-bold text-gray-400 uppercase tracking-widest">vCPU Core(s)</span>
                                         <span className="text-[14px] font-black dark:text-white">{data.cpu || data.cpuInfo || '0'} Core</span>
                                    </div>
                                    <div className="flex items-center justify-between pb-4 border-b border-white/[0.03]">
                                         <span className="text-[12px] font-bold text-gray-400 uppercase tracking-widest">Memory RAM</span>
                                         <span className="text-[14px] font-black dark:text-white">{data.ram || (data as any).totalMemory || 0}GB</span>
                                    </div>
                                    <div className="flex items-center justify-between pb-4 border-b border-white/[0.03]">
                                         <span className="text-[12px] font-bold text-gray-400 uppercase tracking-widest">SSD Storage</span>
                                         <span className="text-[14px] font-black dark:text-white">{data.storage || (data as any).diskSpace || 0}GB SSD</span>
                                    </div>
                                    <div className="flex items-center justify-between pb-4 border-b border-white/[0.03]">
                                         <span className="text-[12px] font-bold text-gray-400 uppercase tracking-widest">Network Speed</span>
                                         <span className="text-[14px] font-black text-[#FBBF24]">1 Gbps / Unlimited</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-8">
                            {/* Billing Overview */}
                            <div className="bg-[#0d1412] p-8 rounded-[10px] border border-white/[0.03] shadow-sm space-y-6">
                                <h3 className="text-xl font-black dark:text-white uppercase tracking-tighter leading-none border-b border-white/[0.03] pb-6">Thanh toán</h3>
                                
                                <div className="space-y-5">
                                    <div className="flex flex-col gap-1">
                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Chu kỳ thanh toán</span>
                                        <span className="text-[14px] font-black dark:text-white uppercase">{data.billingMonths} Tháng / Lần</span>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Phí dịch vụ</span>
                                        <span className="text-[14px] font-black text-[#FBBF24]">{fmt(data.billingAmount)}</span>
                                    </div>
                                    <div className="h-px bg-[#0d1412]/5" />
                                    <div className="flex flex-col gap-1">
                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Ngày khởi tạo</span>
                                        <span className="text-[14px] font-black dark:text-white">{new Date(data.createdAt).toLocaleDateString('vi-VN')}</span>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Ngày hết hạn</span>
                                        <span className={`text-[14px] font-black ${isExpired ? 'text-red-500' : 'dark:text-white'}`}>
                                            {data.expiresAt ? new Date(data.expiresAt).toLocaleDateString('vi-VN') : 'N/A'}
                                        </span>
                                    </div>
                                </div>

                                <button 
                                    className="w-full py-5 rounded-[10px] font-black uppercase tracking-[3px] transition-all transform hover:scale-[1.02] active:scale-95 shadow-xl text-xs flex items-center justify-center gap-3"
                                    style={{ backgroundColor: isExpired ? '#EF4444' : '#FBBF24', color: '#FFFFFF' }}
                                >
                                    <FeatherIcon icon="refresh-cw" size={16} color="white" />
                                    {isExpired ? 'GIA HẠN NGAY' : 'GIA HẠN DỊCH VỤ'}
                                </button>
                            </div>

                            {/* Nodeverse Info */}
                            <div className="p-8 rounded-[12px] text-white shadow-2xl space-y-6" style={{ backgroundColor: '#000000', color: '#FFFFFF' }}>
                                <div className="flex items-center gap-4">
                                    <div className="w-9 h-9 rounded-xl flex items-center justify-center shadow-lg" style={{ backgroundColor: '#FBBF24' }}>
                                         <FeatherIcon icon="database" size={16} color="white" />
                                    </div>
                                    <span className="text-[11px] font-black uppercase tracking-[2px] !text-white">Nodeverse Provider</span>
                                </div>
                                <div className="space-y-3">
                                     <p className="text-[10px] font-bold uppercase tracking-widest pl-1 !text-white/70">Instance Remote ID</p>
                                     <div className="text-[11px] font-mono !text-white bg-[#0d1412]/10 p-4 rounded-xl break-all border border-white/[0.03] select-all font-black">
                                        {data.nodeverseDeviceId || '6984e76f9eea12dd953df671'}
                                     </div>
                                </div>
                                <div className="pt-6 border-t border-white/10">
                                     <div className="flex items-center gap-3">
                                         <div className="relative flex h-2 w-2">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: '#FBBF24' }}></span>
                                            <span className="relative inline-flex rounded-full h-2 w-2" style={{ backgroundColor: '#FBBF24' }}></span>
                                         </div>
                                         <span className="text-[10px] font-black uppercase tracking-[2px]" style={{ color: '#FBBF24' }}>Direct Link Active</span>
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

export default VpsDetailPage;
