import React, { useState, useEffect } from 'react';
import HostingLayout from '../layouts/HostingLayout';
import FeatherIcon from 'feather-icons-react';
import { useTheme } from '../context/ThemeContext';
import { topupService, authService } from '../../../config';
import Swal from 'sweetalert2';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';

const RechargePage = () => {
    const { isDark } = useTheme();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [type, setType] = useState('recharge-bank');

    // Business States
    const [loading, setLoading] = useState(true);
    const [history, setHistory] = useState<any[]>([]);
    const [banks, setBanks] = useState<any[]>([]);
    const [selectedBank, setSelectedBank] = useState<any>(null);
    const [amount, setAmount] = useState<string>('');
    const [creating, setCreating] = useState(false);

    // Filter & Pagination States
    const [filterCode, setFilterCode] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Crypto
    const cryptoRate = 26000;
    const [usdtAmount, setUsdtAmount] = useState<string>('');

    useEffect(() => {
        const queryPay = searchParams.get('pay');
        const path = window.location.pathname;
        if (queryPay === 'recharge-crypto' || path.includes('recharge-crypto')) {
            setType('recharge-crypto');
        } else {
            setType('recharge-bank');
        }
    }, [searchParams, window.location.pathname]);

    useEffect(() => {
        loadData();
    }, [type]);

    const loadData = async () => {
        setLoading(true);
        try {
            const [historyRes, banksRes] = await Promise.all([
                topupService.getHistory({ limit: 100 }).catch(() => ({ data: [] })),
                topupService.getBanks().catch(() => [])
            ]);
            setHistory(historyRes?.data || []);
            setBanks(banksRes || []);
            if (banksRes?.length > 0) setSelectedBank(banksRes[0]);
        } catch (error) {
            console.error("Load recharge data error", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateBankTopup = async () => {
        if (!amount || parseInt(amount) < 1000) {
            Swal.fire('Lỗi', 'Số tiền tối thiểu là 1.000đ', 'error');
            return;
        }
        if (!selectedBank) return;

        setCreating(true);
        try {
            const res = await topupService.createTopup(parseInt(amount), selectedBank.id);
            Swal.fire({
                title: 'Thành công',
                text: 'Hóa đơn đã được tạo, đang chuyển hướng...',
                icon: 'success',
                timer: 1500,
                showConfirmButton: false
            });
            navigate(`/landing-topup/${res.code}`);
            setAmount('');
        } catch (error: any) {
            Swal.fire('Lỗi', error.message || 'Không thể tạo hóa đơn', 'error');
        } finally {
            setCreating(false);
        }
    };

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        Swal.fire({
            title: 'Đã sao chép!',
            text: text,
            icon: 'success',
            timer: 1000,
            showConfirmButton: false,
            toast: true,
            position: 'top-end'
        });
    };

    const fmt = (n: any) => {
        const num = typeof n === 'string' ? parseFloat(n) : n;
        return (num || 0).toLocaleString('vi-VN') + 'đ';
    };

    const renderBankForm = () => {
        return (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-500">
                {/* Main Recharge Form Block */}
                <div className="lg:col-span-2">
                    <div className="bg-white dark:bg-[#0d1412] rounded-[10px] shadow-sm border border-gray-100 dark:border-white/5 overflow-hidden h-full">
                        <div className="bg-gradient-to-r from-[#00BA4A] to-[#01c67c] px-6 py-4 flex items-center gap-3 text-force-white">
                            <FeatherIcon icon="home" size={18} />
                            <h2 className="text-[13px] font-black uppercase tracking-widest text-force-white">Nạp tiền qua ngân hàng</h2>
                        </div>
                        <div className="p-6 space-y-6">
                            {/* Input Amount */}
                            <div className="space-y-2">
                                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">Số tiền nạp <span className="text-red-500">*</span></label>
                                <div className="relative group">
                                    <input
                                        type="number"
                                        placeholder="Nhập số tiền VNĐ"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        className="w-full h-12 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-[8px] px-10 text-[15px] font-bold outline-none focus:border-[#00BA4A] focus:ring-1 focus:ring-[#00BA4A]/20 transition-all dark:text-white"
                                    />
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">₫</span>
                                </div>

                                {/* Quick Amounts */}
                                <div className="grid grid-cols-4 gap-2">
                                    {[50000, 100000, 200000, 500000, 1000000, 2000000, 5000000, 10000000].map((val) => (
                                        <button
                                            key={val}
                                            onClick={() => setAmount(val.toString())}
                                            className={`py-2 rounded-lg text-[10px] font-black uppercase transition-all ${amount === val.toString() ? 'bg-[#00BA4A] text-white shadow-md' : 'bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/10'}`}
                                        >
                                            {val / 1000}K
                                        </button>
                                    ))}
                                </div>

                                <div className="flex items-center gap-1.5 text-[10px] font-bold">
                                    <span className="text-gray-400 uppercase tracking-widest">Số tiền tối thiểu:</span>
                                    <span className="text-red-500">1.000đ</span>
                                </div>
                            </div>

                            {/* Bank Direct Dropdown */}
                            <div className="space-y-2">
                                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">Chọn ngân hàng <span className="text-red-500">*</span></label>
                                <div className="relative">
                                    <select
                                        value={selectedBank?.id}
                                        onChange={(e) => setSelectedBank(banks.find(b => b.id === e.target.value))}
                                        className="w-full h-12 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-[8px] px-4 text-[13px] font-bold outline-none cursor-pointer appearance-none dark:text-white focus:border-[#00BA4A]"
                                    >
                                        <option value="">-- Chọn ngân hàng --</option>
                                        {banks.map(bank => (
                                            <option key={bank.id} value={bank.id}>{bank.name}</option>
                                        ))}
                                    </select>
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                                        <FeatherIcon icon="chevron-down" size={14} />
                                    </div>
                                </div>
                            </div>

                            {/* Summary / Receive Amount */}
                            <div className="p-5 bg-gray-50/50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-[10px] flex flex-col items-center justify-center space-y-1">
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Số tiền nhận được</span>
                                <span className="text-3xl font-black text-[#00BA4A] tracking-tighter">{amount ? fmt(parseInt(amount)) : '0đ'}</span>
                            </div>

                            <button
                                onClick={handleCreateBankTopup}
                                disabled={creating}
                                className="bg-[#00BA4A] h-[52px] w-full rounded-[10px] shadow-lg shadow-[#00BA4A]/20 hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50 text-force-white font-black text-xs uppercase tracking-[2px] flex items-center justify-center gap-3"
                            >
                                {creating ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <FeatherIcon icon="file-plus" size={18} />}
                                {creating ? 'ĐANG XỬ LÝ...' : 'Tạo hóa đơn nạp tiền'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Sidebar: Promo & Note */}
                <div className="space-y-6">
                    {/* Promotions Table */}
                    <div className="bg-white dark:bg-[#0d1412] rounded-[10px] shadow-sm border border-gray-100 dark:border-white/5 overflow-hidden">
                        <div className="bg-gradient-to-r from-[#1a73e8] to-[#2563EB] px-6 py-4 flex items-center gap-3 text-force-white">
                            <FeatherIcon icon="grid" size={18} />
                            <h2 className="text-[13px] font-black uppercase tracking-widest text-force-white">Khuyến mãi</h2>
                        </div>
                        <div className="p-0">
                            <table className="w-full text-left text-[11px] font-bold">
                                <thead>
                                    <tr className="bg-gray-50/50 dark:bg-white/5 text-gray-400 uppercase tracking-widest">
                                        <th className="px-6 py-3">Số tiền nạp</th>
                                        <th className="px-6 py-3">Khuyến mãi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                                    <tr><td className="px-6 py-3 dark:text-white">≥ 100.000đ</td><td className="px-6 py-3 text-[#00BA4A]">+5%</td></tr>
                                    <tr><td className="px-6 py-3 dark:text-white">≥ 1.000.000đ</td><td className="px-6 py-3 text-[#00BA4A]">+10%</td></tr>
                                    <tr><td className="px-6 py-3 dark:text-white">≥ 10.000.000đ</td><td className="px-6 py-3 text-[#00BA4A]">+15%</td></tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Compact Notes */}
                    <div className="bg-orange-50/50 dark:bg-orange-500/5 border border-orange-200/50 dark:border-orange-500/10 p-6 rounded-[10px] space-y-4">
                        <div className="flex items-center gap-2 text-orange-600">
                            <FeatherIcon icon="alert-circle" size={18} />
                            <h3 className="text-[12px] font-black uppercase tracking-widest">Lưu ý quan trọng</h3>
                        </div>
                        <p className="text-[10px] font-bold text-gray-500 dark:text-gray-400 leading-relaxed uppercase tracking-wider">
                            - Vui lòng chuyển khoản đúng số tiền và nội dung.<br />
                            - Thời gian xử lý tự động từ 1-5 phút.<br />
                            - Nếu sau 5 phút vẫn chưa nhận được tiền, vui lòng liên hệ hỗ trợ telegram <span className="text-blue-500">@ntthanhz</span>.
                        </p>
                    </div>
                </div>
            </div>
        );
    };

    const renderCryptoForm = () => {
        return (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-500">
                <div className="lg:col-span-2">
                    <div className="bg-white dark:bg-[#0d1412] rounded-[10px] shadow-sm border border-gray-100 dark:border-white/5 overflow-hidden h-full">
                        <div className="bg-gradient-to-r from-[#26a17b] to-[#2d6c5a] px-6 py-4 flex items-center gap-3 text-force-white">
                            <FeatherIcon icon="zap" size={18} />
                            <h2 className="text-[13px] font-black uppercase tracking-widest text-force-white">Nạp tiền bằng Crypto (USDT)</h2>
                        </div>
                        <div className="p-8 flex flex-col items-center space-y-8">
                            <div className="w-16 h-16 bg-[#26a17b]/10 rounded-full flex items-center justify-center text-[#26a17b]">
                                <FeatherIcon icon="activity" size={32} />
                            </div>

                            <div className="w-full space-y-4">
                                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">Số tiền USDT nạp <span className="text-red-500">*</span></label>
                                <div className="relative group">
                                    <input
                                        type="number"
                                        placeholder="Nhập số USDT"
                                        value={usdtAmount}
                                        onChange={(e) => setUsdtAmount(e.target.value)}
                                        className="w-full h-14 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-[12px] px-12 text-xl font-black text-[#26a17b] outline-none focus:border-[#26a17b] transition-all"
                                    />
                                    <span className="absolute left-5 top-1/2 -translate-y-1/2 text-[#26a17b] font-black italic">T</span>
                                    <span className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 font-black text-sm uppercase">USDT</span>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-emerald-50/50 dark:bg-emerald-500/5 rounded-lg border border-emerald-100 dark:border-emerald-500/10">
                                    <div className="flex items-center gap-2">
                                        <FeatherIcon icon="repeat" size={14} className="text-emerald-500" />
                                        <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Tỷ giá: 1 USDT = {cryptoRate.toLocaleString()}đ</span>
                                    </div>
                                    <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Tối thiểu: 10 USDT</span>
                                </div>
                            </div>

                            <div className="w-full p-6 bg-gray-50 dark:bg-white/5 border border-dashed border-gray-200 dark:border-white/10 rounded-[12px] flex flex-col items-center justify-center space-y-1">
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Quy đổi sang VNĐ</span>
                                <span className="text-4xl font-black dark:text-white tracking-tight">{usdtAmount ? fmt(parseFloat(usdtAmount) * cryptoRate) : '0đ'}</span>
                            </div>

                            <button
                                onClick={() => Swal.fire({
                                    title: 'Thông báo',
                                    text: 'Tính năng nạp tiền bằng Crypto (USDT) đang được bảo trì để nâng cấp tỷ giá mới. Vui lòng quay lại sau!',
                                    icon: 'info',
                                    confirmButtonColor: '#26a17b'
                                })}
                                className="bg-[#032030] h-[60px] w-full rounded-[12px] shadow-xl text-force-white font-black text-xs uppercase tracking-[3px] flex items-center justify-center gap-3 hover:bg-[#26a17b] transition-all group"
                            >
                                <FeatherIcon icon="zap" size={18} className="group-hover:animate-bounce" />
                                TẠO HÓA ĐƠN CRYPTO
                            </button>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-gradient-to-br from-[#26a17b] to-[#04333b] p-8 rounded-[16px] text-white shadow-xl space-y-6">
                        <div className="flex items-center gap-3 border-b border-white/20 pb-5">
                            <FeatherIcon icon="alert-triangle" size={24} className="text-emerald-400" />
                            <h3 className="text-sm font-black uppercase tracking-tighter">Lưu ý Blockchain</h3>
                        </div>
                        <ul className="space-y-4 text-[10px] font-bold uppercase tracking-wider text-emerald-50/70 leading-relaxed">
                            <li className="flex gap-3"><FeatherIcon icon="check-circle" size={14} className="text-emerald-400 shrink-0" />Hệ thống chỉ hỗ trợ mạng lưới TRC20 (Binance, Trust...)</li>
                            <li className="flex gap-3"><FeatherIcon icon="check-circle" size={14} className="text-emerald-400 shrink-0" />Tỷ giá được cập nhật theo thời gian thực khi tạo hóa đơn</li>
                            <li className="flex gap-3"><FeatherIcon icon="check-circle" size={14} className="text-emerald-400 shrink-0" />Thời gian xác nhận từ 2-10 phút phụ thuộc vào mạng lưới</li>
                        </ul>
                    </div>
                    <div className="bg-white dark:bg-[#0d1412] p-6 rounded-[10px] border border-gray-100 dark:border-white/5 space-y-3">
                        <h4 className="text-[11px] font-black uppercase tracking-widest text-gray-400">Trạng thái mạng</h4>
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-gray-500 uppercase">Mạng TRC20</span>
                            <span className="flex items-center gap-1.5 text-[9px] font-black text-emerald-500">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Hoạt động
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const renderHistory = () => {
        const filtered = history.filter(t => {
            const matchCode = (t.code || '').toLowerCase().includes(filterCode.toLowerCase());
            const matchStatus = filterStatus ? t.status === filterStatus : true;
            return matchCode && matchStatus;
        });

        const totalItems = filtered.length;
        const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
        const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

        const getStatusBadge = (status: string) => {
            switch (status) {
                case 'da-duyet':
                case 'da-thanh-cong':
                    return <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-full text-[9px] font-black uppercase tracking-widest">Hoàn thành</span>;
                case 'da-huy':
                case 'het-han':
                case 'expired':
                    return <span className="px-3 py-1 bg-red-500/10 text-red-500 border border-red-500/20 rounded-full text-[9px] font-black uppercase tracking-widest">Hủy/Hết hạn</span>;
                default:
                    return <span className="px-3 py-1 bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded-full text-[9px] font-black uppercase tracking-widest">Chờ thanh toán</span>;
            }
        };

        return (
            <div className="mt-12 bg-white dark:bg-[#0d1412] rounded-[10px] border border-gray-100 dark:border-white/5 shadow-sm overflow-hidden animate-in fade-in duration-700">
                <div className="bg-gradient-to-r from-[#032030] to-[#04333b] px-6 py-4 flex items-center justify-between gap-3 text-force-white">
                    <div className="flex items-center gap-3">
                        <FeatherIcon icon="rotate-ccw" size={18} className="text-[#00BA4A]" />
                        <h2 className="text-[13px] font-black uppercase tracking-widest text-force-white">Lịch sử nạp tiền</h2>
                    </div>
                    <button onClick={loadData} className="text-[10px] font-black text-white/50 hover:text-white uppercase tracking-widest flex items-center gap-2 transition-all">
                        <FeatherIcon icon="refresh-cw" size={12} className={loading ? 'animate-spin' : ''} /> Làm mới
                    </button>
                </div>

                {/* Filter Bar */}
                <div className="p-6 border-b border-gray-100 dark:border-white/5 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-3">
                        <input
                            placeholder="Mã giao dịch..."
                            value={filterCode}
                            onChange={(e) => setFilterCode(e.target.value)}
                            className="bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-lg px-4 h-11 text-xs font-bold outline-none focus:border-[#00BA4A] dark:text-white"
                        />
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-lg px-4 h-11 text-xs font-bold outline-none cursor-pointer dark:text-white"
                        >
                            <option value="">-- Trạng thái --</option>
                            <option value="da-duyet">Hoàn thành</option>
                            <option value="pending">Chờ thanh toán</option>
                            <option value="expired">Hết hạn</option>
                        </select>
                        <div className="relative">
                            <input type="text" placeholder="Chọn ngày..." className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-lg px-4 h-11 text-xs font-bold dark:text-white" />
                            <FeatherIcon icon="calendar" size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        </div>
                        <button className="bg-gray-200 dark:bg-white/10 h-11 rounded-lg text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-[#00BA4A] hover:text-white transition-all dark:text-white">
                            <FeatherIcon icon="search" size={14} /> Tìm kiếm
                        </button>
                        <button onClick={() => { setFilterCode(''); setFilterStatus(''); }} className="bg-gray-100 dark:bg-white/5 h-11 rounded-lg text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-red-500 hover:text-white transition-all text-gray-400">
                            <FeatherIcon icon="trash-2" size={14} /> Bỏ lọc
                        </button>
                    </div>

                    <div className="flex items-center justify-between text-[10px] font-black text-gray-400 uppercase tracking-widest border-t border-gray-50 dark:border-white/5 pt-4">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 bg-gray-50 dark:bg-white/5 px-3 py-1.5 rounded-lg border border-gray-100 dark:border-white/10">
                                <span className="opacity-60">HIỂN THỊ: </span>
                                <select className="bg-transparent outline-none">
                                    <option>10 Dòng</option><option>20 Dòng</option><option>50 Dòng</option>
                                </select>
                            </div>
                            <div className="flex items-center gap-2 bg-gray-50 dark:bg-white/5 px-3 py-1.5 rounded-lg border border-gray-100 dark:border-white/10">
                                <span className="opacity-60">SẮP XẾP: </span>
                                <select className="bg-transparent outline-none">
                                    <option>Mới nhất</option><option>Cũ nhất</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-[11px] font-bold">
                        <thead>
                            <tr className="bg-gray-50/50 dark:bg-white/5 text-gray-400 uppercase tracking-widest border-b border-gray-100 dark:border-white/5">
                                <th className="px-6 py-5">Mã giao dịch</th>
                                <th className="px-6 py-5 text-center">Trạng thái</th>
                                <th className="px-6 py-5">Phương thức</th>
                                <th className="px-6 py-5 text-right">Số tiền nạp</th>
                                <th className="px-6 py-5 text-right">Số tiền nhận</th>
                                <th className="px-6 py-5 text-right">Ngày tạo</th>
                                <th className="px-6 py-5 text-right">Hành động</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                            {paginated.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-20 text-center">
                                        <div className="flex flex-col items-center gap-2 opacity-20">
                                            <FeatherIcon icon="inbox" size={48} />
                                            <span className="text-xs font-black uppercase tracking-widest">Không có dữ liệu</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : paginated.map((t, i) => (
                                <tr key={i} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group">
                                    <td className="px-6 py-5">
                                        <Link to={`/landing-topup/${t.code}`} className="text-blue-600 font-black hover:text-[#00BA4A] transition-colors flex items-center gap-2">
                                            {t.code} <FeatherIcon icon="external-link" size={10} className="opacity-0 group-hover:opacity-100 transition-all" />
                                        </Link>
                                    </td>
                                    <td className="px-6 py-5 text-center">{getStatusBadge(t.status)}</td>
                                    <td className="px-6 py-5 dark:text-white">
                                        <div className="flex items-center gap-2 uppercase">
                                            <FeatherIcon icon={t.bank ? "home" : "zap"} size={12} className="text-gray-400" />
                                            {t.bank || 'USDT TRC20'}
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-right dark:text-white">{fmt(t.amount)}</td>
                                    <td className="px-6 py-5 text-right text-[#00BA4A]">{fmt(t.amount)}</td>
                                    <td className="px-6 py-5 text-right text-gray-400">{new Date(t.createdAt).toLocaleDateString('vi-VN')}</td>
                                    <td className="px-6 py-5 text-right">
                                        <Link to={`/landing-topup/${t.code}`} className="p-2 bg-[#00BA4A]/5 text-[#00BA4A] hover:bg-[#00BA4A] hover:text-white rounded-lg transition-all inline-flex items-center">
                                            <FeatherIcon icon="eye" size={14} />
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Footer / Summary Info */}
                <div className="p-4 bg-gray-50/50 dark:bg-white/5 border-t border-gray-100 dark:border-white/5 flex items-center justify-center gap-8 text-[10px] font-black uppercase tracking-widest">
                    <div className="flex items-center gap-2">
                        <span className="text-gray-400">TỔNG ĐÃ NẠP:</span>
                        <span className="text-[#00BA4A]">{fmt(history.filter(t => t.status === 'da-duyet').reduce((acc, curr) => acc + (curr.amount || 0), 0))}</span>
                    </div>
                    <div className="w-1 h-3 bg-gray-200 dark:bg-white/10 rounded-full"></div>
                    <div className="flex items-center gap-2">
                        <span className="text-gray-400">CHỜ DUYỆT:</span>
                        <span className="text-amber-500">{fmt(history.filter(t => t.status !== 'da-duyet' && t.status !== 'expired').reduce((acc, curr) => acc + (curr.amount || 0), 0))}</span>
                    </div>
                </div>

                {/* Simplified Pagination */}
                <div className="p-6 border-t border-gray-100 dark:border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 bg-gray-50/30 dark:bg-white/[0.02]">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Hiển thị {paginated.length} / {totalItems} giao dịch</span>
                    <div className="flex items-center gap-1.5">
                        <button
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(prev => prev - 1)}
                            className="w-10 h-10 rounded-xl border border-gray-200 dark:border-white/10 flex items-center justify-center text-gray-400 hover:bg-[#00BA4A] hover:text-white hover:border-[#00BA4A] transition-all disabled:opacity-30"
                        >
                            <FeatherIcon icon="chevron-left" size={16} />
                        </button>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
                            if (p === 1 || p === totalPages || (p >= currentPage - 1 && p <= currentPage + 1)) {
                                return (
                                    <button
                                        key={p}
                                        onClick={() => setCurrentPage(p)}
                                        className={`w-10 h-10 rounded-xl flex items-center justify-center text-[12px] font-black transition-all ${currentPage === p ? 'bg-[#00BA4A] text-white shadow-lg' : 'bg-white dark:bg-white/5 text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10'}`}
                                    >
                                        {p}
                                    </button>
                                );
                            } else if (p === currentPage - 2 || p === currentPage + 2) {
                                return <span key={p} className="w-6 text-center text-gray-400">...</span>;
                            }
                            return null;
                        })}
                        <button
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage(prev => prev + 1)}
                            className="w-10 h-10 rounded-xl border border-gray-200 dark:border-white/10 flex items-center justify-center text-gray-400 hover:bg-[#00BA4A] hover:text-white hover:border-[#00BA4A] transition-all disabled:opacity-30"
                        >
                            <FeatherIcon icon="chevron-right" size={16} />
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <HostingLayout>
            <div className="bg-gray-50 dark:bg-[#060a09] min-h-screen pb-20 transition-colors duration-500 overflow-x-hidden">
                {/* Breadcrumb Navigation - Standardized to match VPS Management Dashboard */}
                <div className="max-w-7xl mx-auto px-4 py-3">
                    <nav className="flex items-center gap-3 text-[10px] md:text-[11px] font-black uppercase tracking-[2px] transition-all duration-300">
                        <Link to="/" className="text-gray-400 hover:text-[#00BA4A] flex items-center gap-1.5 transition-colors group">
                            <FeatherIcon icon="home" size={12} />
                            Trang chủ
                        </Link>
                        <FeatherIcon icon="chevron-right" size={10} className="text-gray-300" />
                        <span className="text-[#032030] dark:text-white">Nạp tiền vào ví</span>
                    </nav>
                </div>

                <div className="relative bg-gradient-to-r from-[#032030] via-[#04333b] to-[#032030] border-y border-white/5 overflow-hidden">
                    <div className="max-w-7xl mx-auto px-4 py-10 relative z-10">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                            <div className="space-y-3">
                                <h1 className="text-4xl md:text-6xl font-black !text-white uppercase tracking-tighter leading-none">
                                    NẠP TIỀN <span className="text-[#00BA4A]">VÀO VÍ</span>
                                </h1>
                                <p className="text-[11px] font-bold !text-white/50 uppercase tracking-[3px]">
                                    Hệ thống xử lý tự động 24/7 - Không gián đoạn dịch vụ
                                </p>
                            </div>
                            <div className="flex items-center gap-3">
                                <Link
                                    to="/landing-recharge?pay=recharge-bank"
                                    className={`px-8 h-12 rounded-xl font-black uppercase tracking-[2px] transition-all text-[10px] flex items-center gap-3 border shadow-lg ${type === 'recharge-bank' ? 'bg-[#00BA4A] text-white border-[#00BA4A] shadow-[#00BA4A]/20' : 'bg-white/5 text-white/40 hover:bg-white/10 border-white/5'}`}
                                >
                                    <FeatherIcon icon="home" size={14} /> BANK TRANSFER
                                </Link>
                                <Link
                                    to="/landing-recharge?pay=recharge-crypto"
                                    className={`px-8 h-12 rounded-xl font-black uppercase tracking-[2px] transition-all text-[10px] flex items-center gap-3 border shadow-lg ${type === 'recharge-crypto' ? 'bg-[#26a17b] text-white border-[#26a17b] shadow-emerald-500/20' : 'bg-white/5 text-white/40 hover:bg-white/10 border-white/5'}`}
                                >
                                    <FeatherIcon icon="zap" size={14} /> CRYPTO USDT
                                </Link>
                            </div>
                        </div>
                    </div>
                    {/* Abstract background element */}
                    <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[#00BA4A]/10 to-transparent skew-x-12 transform translate-x-1/2"></div>
                </div>

                <div className="max-w-7xl mx-auto px-4 py-6">
                    {type === 'recharge-bank' ? renderBankForm() : renderCryptoForm()}
                    {renderHistory()}
                </div>
            </div>
        </HostingLayout>
    );
};

export default RechargePage;
