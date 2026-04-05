import React, { useEffect, useState, useMemo } from 'react';
import FeatherIcon from 'feather-icons-react';
import HostingLayout from '../layouts/HostingLayout';
import { useTheme } from '../context/ThemeContext';
import { authService, vpsService } from '../../../config';
import { NodeverseVpsPlan, VpsPlan } from '../../../services/vpsService';
import { useNavigate, Link } from 'react-router-dom';
import Swal from 'sweetalert2';

const LandingVpsPage = () => {
    const { isDark } = useTheme();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [nvPlans, setNvPlans] = useState<NodeverseVpsPlan[]>([]);
    const [stdPlans, setStdPlans] = useState<VpsPlan[]>([]);
    const [selectedNvPlanId, setSelectedNvPlanId] = useState<string | null>(null);
    const [selectedOsVersion, setSelectedOsVersion] = useState<string | null>(null);
    const [selectedOsDeviceId, setSelectedOsDeviceId] = useState<string | null>(null);
    const [selectedOsAgencyId, setSelectedOsAgencyId] = useState<string | null>(null);
    const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
    const [vpsBillingTerm, setVpsBillingTerm] = useState("1m");
    const [vpsQuantity, setVpsQuantity] = useState(1);
    const [vpsAcceptedTerms, setVpsAcceptedTerms] = useState(false);
    const [vpsOrdering, setVpsOrdering] = useState(false);

    const fmt = (n: any) => {
        const num = typeof n === 'string' ? parseFloat(n) : n;
        return (num || 0).toLocaleString('vi-VN') + 'đ';
    };

    useEffect(() => {
        const loadVpsPlans = async () => {
            setLoading(true);
            try {
                const nvData = await vpsService.getNodeverseVpsPlans();
                let nvList: NodeverseVpsPlan[] = [];
                if (Array.isArray(nvData)) nvList = nvData;
                else if (nvData?.plans) nvList = nvData.plans;
                setNvPlans(nvList.filter(p => (p as any).isActive !== false));

                const stdData = await vpsService.fetchClientPlans();
                setStdPlans(stdData || []);
            } catch (err) {
                console.error("Load VPS plans error", err);
            } finally {
                setLoading(false);
            }
        };
        loadVpsPlans();
    }, []);

    const vpsBillingDetails = useMemo(() => {
        if (!selectedPlanId) return null;
        const plan = stdPlans.find(p => p.id === selectedPlanId);
        if (!plan) return null;

        const basePrice = parseFloat(plan.price);
        const osSurcharge = (selectedOsVersion?.toLowerCase().includes('windows')) ? 50000 : 0;

        let multiplier = 1;
        let discountPercent = 0;
        if (vpsBillingTerm === '3m') { multiplier = 3; discountPercent = 5; }
        else if (vpsBillingTerm === '6m') { multiplier = 6; discountPercent = 10; }
        else if (vpsBillingTerm === '12m') { multiplier = 12; discountPercent = 20; }

        const subtotal = (basePrice * multiplier) + osSurcharge;
        const discountAmount = Math.round(subtotal * (discountPercent / 100));
        const total = (subtotal - discountAmount) * vpsQuantity;

        return {
            planPrice: basePrice,
            osSurcharge,
            subtotal,
            discountPercent,
            discountAmount,
            total,
            availableTerms: [
                { code: '1m', label: '1 Tháng' },
                { code: '3m', label: '3 Tháng (Giảm 5%)' },
                { code: '6m', label: '6 Tháng (Giảm 10%)' },
                { code: '12m', label: '1 Năm (Giảm 20%)' },
            ]
        };
    }, [selectedPlanId, stdPlans, selectedOsVersion, vpsBillingTerm, vpsQuantity]);

    const handleOrderVps = async () => {
        if (!authService.isAuthenticated()) {
            Swal.fire('Yêu cầu đăng nhập', 'Vui lòng đăng nhập để thực hiện mua hàng', 'warning').then(() => navigate('/landing-login'));
            return;
        }
        if (!selectedPlanId || !vpsBillingDetails) return;

        setVpsOrdering(true);
        try {
            await vpsService.createNodeverseHybridVpsOrder(
                selectedPlanId,
                "balance",
                vpsBillingTerm,
                false,
                {
                    osVersion: selectedOsVersion || 'Linux',
                    nodeverseDeviceId: selectedOsDeviceId || '',
                    nodeverseAgencyId: selectedOsAgencyId || '',
                }
            );

            Swal.fire({
                title: 'Đăng ký thành công!',
                text: 'Hệ thống đang khởi tạo máy chủ của bạn. Vui lòng kiểm tra mục Quản lý VPS.',
                icon: 'success',
                showCancelButton: true,
                confirmButtonText: 'Đến trang quản lý',
                cancelButtonText: 'Tiếp tục xem'
            }).then((result) => {
                if (result.isConfirmed) navigate('/landing-vps-management');
            });
        } catch (err: any) {
            Swal.fire('Thất bại', err.message || 'Có lỗi xảy ra khi đặt hàng', 'error');
        } finally {
            setVpsOrdering(false);
        }
    };

    return (
        <HostingLayout>
            <div className="bg-gray-50 dark:bg-[#060a09] min-h-screen pb-24 overflow-x-hidden">
                {/* Breadcrumb Navigation */}
                <div className="max-w-7xl mx-auto px-4 py-2">
                    <nav className="flex items-center gap-3 text-[10px] md:text-[11px] font-black uppercase tracking-[2px] transition-all duration-300">
                        <Link to="/" className="text-gray-400 hover:text-[#00BA4A] flex items-center gap-1.5 transition-colors group">
                            <FeatherIcon icon="home" size={12} />
                            Trang chủ
                        </Link>
                        <FeatherIcon icon="chevron-right" size={10} className="text-gray-300" />
                        <Link to="/landing-tools" className="text-gray-400 hover:text-[#00BA4A] transition-colors">Dịch vụ</Link>
                        <FeatherIcon icon="chevron-right" size={10} className="text-gray-300" />
                        <span className="text-[#032030] dark:text-white">Cloud VPS High Performance</span>
                    </nav>
                </div>

                {/* Hero Banner - Full Container Width */}
                <div className="relative bg-gradient-to-r from-[#032030] via-[#04333b] to-[#297c6d] border-y border-white/5 overflow-hidden">
                    <div className="max-w-7xl mx-auto px-4 py-8 md:py-12 relative z-10">
                        <div className="max-w-2xl space-y-6">
                            <h1 className="text-2xl md:text-7xl font-black uppercase tracking-tighter leading-[0.85] !text-white">
                                CLOUD VPS <span className="text-[#00BA4A]">HIGH PERFORMANCE</span>
                            </h1>
                            <p className="text-sm md:text-base !text-white font-black uppercase tracking-[2px] leading-relaxed max-w-xl border-l-4 border-[#00BA4A] pl-4">
                                Nền tảng ảo hóa tối ưu cho VPS n8n Automation & MMO. <br />
                                <span className="!text-white">Hạ tầng băng thông 1Gbps - Uptime 99.9%.</span>
                            </p>
                            <div className="flex flex-wrap gap-4 pt-2">
                                <a href="#plans" className="bg-[#00BA4A] !text-white px-8 py-4 rounded-[10px] font-black uppercase tracking-[2px] hover:scale-105 active:scale-95 transition-all shadow-xl shadow-[#00BA4A]/20 text-[10px]">
                                    XEM BẢNG GIÁ NGAY
                                </a>
                            </div>
                        </div>
                        <div className="absolute -right-20 -bottom-20 opacity-10 pointer-events-none">
                            <FeatherIcon icon="rocket" size={400} className="rotate-12 hidden lg:block" />
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 pt-6 space-y-10">
                    <div id="plans" className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 space-y-6">
                            <div className="bg-white dark:bg-[#0d1412] p-6 rounded-[10px] shadow-sm border border-gray-100 dark:border-white/5 space-y-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-[10px] bg-[#00BA4A] text-white flex items-center justify-center text-lg font-black">01</div>
                                    <div>
                                        <h3 className="text-xl font-black dark:text-white uppercase tracking-tighter leading-none">Chọn hệ điều hành</h3>
                                        <p className="text-[9px] text-gray-400 font-bold uppercase tracking-[1px] mt-1">Nền tảng ảo hóa Nodeverse Hybrid</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {nvPlans.map((plan) => (
                                        <button
                                            key={plan.id}
                                            onClick={() => { setSelectedNvPlanId(plan.id); setSelectedOsVersion(plan.operatingSystem); setSelectedOsDeviceId((plan as any).nodeverseDeviceId || null); setSelectedOsAgencyId((plan as any).nodeverseAgencyId || null); }}
                                            className={`p-4 rounded-[10px] border-2 text-left transition-all group relative overflow-hidden ${selectedNvPlanId === plan.id ? 'border-[#00BA4A] bg-[#00BA4A]/5' : 'border-gray-50 dark:border-white/5 hover:border-[#00BA4A]/30'}`}
                                        >
                                            <div className="flex items-center gap-3 mb-3">
                                                <div className={`w-9 h-9 rounded-[8px] flex items-center justify-center transition-all ${selectedNvPlanId === plan.id ? 'bg-[#00BA4A] text-white shadow-lg' : 'bg-gray-100 dark:bg-white/5 text-gray-400'}`}>
                                                    <FeatherIcon icon={plan.operatingSystem?.toLowerCase().includes('win') ? 'monitor' : 'terminal'} size={18} />
                                                </div>
                                                <div>
                                                    <span className="text-[13px] font-black dark:text-white uppercase tracking-tight block leading-none">{plan.operatingSystem || 'LINUX'}</span>
                                                    <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest mt-1 block">Tối ưu hiệu năng</span>
                                                </div>
                                            </div>
                                            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest bg-gray-100 dark:bg-white/5 py-1.5 px-2.5 rounded-[6px] inline-block">{(plan as any).cpuInfo} | {(plan as any).totalMemory}GB RAM</p>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className={`bg-white dark:bg-[#0d1412] p-6 rounded-[10px] shadow-sm border border-gray-100 dark:border-white/5 space-y-6 transition-all duration-700 ${!selectedOsVersion ? 'opacity-30 blur-[1px] pointer-events-none' : ''}`}>
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-[10px] bg-[#00BA4A] text-white flex items-center justify-center text-lg font-black">02</div>
                                    <div>
                                        <h3 className="text-xl font-black dark:text-white uppercase tracking-tighter leading-none">Gói cấu hình tối ưu</h3>
                                        <p className="text-[9px] text-gray-400 font-bold uppercase tracking-[1px] mt-1">Băng thông không giới hạn</p>
                                    </div>
                                </div>
                                <div className="overflow-x-auto rounded-[10px] border border-gray-100 dark:border-white/5">
                                    <table className="w-full text-left">
                                        <thead>
                                            <tr className="bg-gray-50/50 dark:bg-white/5 text-[9px] font-black text-gray-400 uppercase tracking-[1px]">
                                                <th className="p-6">Gói cước</th>
                                                <th className="p-6 text-center border-l border-r border-gray-100 dark:border-white/5">vCPU / RAM</th>
                                                <th className="p-6 text-center">SSD Storage</th>
                                                <th className="p-6 text-right">Đơn giá</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                                            {stdPlans.map((plan) => (
                                                <tr key={plan.id} onClick={() => setSelectedPlanId(plan.id)} className={`group cursor-pointer transition-all hover:bg-gray-100/50 dark:hover:bg-white/[0.03] ${selectedPlanId === plan.id ? 'bg-[#00BA4A]/10' : ''}`}>
                                                    <td className="p-6">
                                                        <div className="flex items-center gap-3">
                                                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${selectedPlanId === plan.id ? 'border-[#00BA4A] bg-[#00BA4A] text-white' : 'border-gray-200'}`}>
                                                                {selectedPlanId === plan.id && <FeatherIcon icon="check" size={12} />}
                                                            </div>
                                                            <span className="text-[14px] font-black dark:text-white uppercase tracking-tight">{plan.name}</span>
                                                        </div>
                                                    </td>
                                                    <td className="p-6 text-center border-l border-r border-gray-100 dark:border-white/5">
                                                        <div className="flex items-center justify-center gap-2">
                                                            <span className="text-[12px] font-black text-gray-900 dark:text-white">{plan.cpu} vCPU</span>
                                                            <span className="text-[10px] font-bold text-[#00BA4A] uppercase">{plan.ram}</span>
                                                        </div>
                                                    </td>
                                                    <td className="p-6 text-center">
                                                        <span className="px-3 py-1 bg-orange-50 dark:bg-orange-500/10 text-orange-600 rounded-[6px] text-[10px] font-black uppercase">{plan.ssd}</span>
                                                    </td>
                                                    <td className="p-6 text-right">
                                                        <span className="text-[16px] font-black text-[#032030] dark:text-white tracking-tighter">{fmt(plan.price)}</span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="bg-white dark:bg-[#0d1412] p-6 rounded-[10px] border border-gray-100 dark:border-white/5 shadow-2xl sticky top-28 space-y-6">
                                <div className="flex items-center gap-4 border-b border-gray-100 dark:border-white/5 pb-6">
                                    <div className="w-10 h-10 bg-[#032030] text-white rounded-[8px] flex items-center justify-center">
                                        <FeatherIcon icon="shopping-bag" size={20} />
                                    </div>
                                    <div>
                                        <h4 className="text-[12px] font-black dark:text-white uppercase tracking-widest">Tóm tắt đơn hàng</h4>
                                        <p className="text-[8px] text-gray-400 font-bold uppercase tracking-wider mt-1">Hệ thống tính toán tự động</p>
                                    </div>
                                </div>

                                {!vpsBillingDetails ? (
                                    <div className="py-20 text-center space-y-6 opacity-40">
                                        <FeatherIcon icon="inbox" size={60} className="mx-auto" />
                                        <p className="text-[11px] font-black text-gray-400 uppercase tracking-[2px] leading-relaxed">
                                            Vui lòng hoàn tất Bước 1 & Bước 2 <br /> để xem chi tiết thanh toán
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-8 animate-in zoom-in-95 duration-500">
                                        <div className="space-y-6">
                                            <div className="flex justify-between items-start gap-4">
                                                <div className="min-w-0">
                                                    <h5 className="text-[13px] font-black dark:text-white uppercase tracking-tight truncate">{stdPlans.find(p => p.id === selectedPlanId)?.name}</h5>
                                                    <div className="flex items-center gap-2 mt-2">
                                                        <span className="px-2 py-0.5 bg-[#00BA4A]/10 text-[#00BA4A] text-[9px] font-black rounded uppercase">{selectedOsVersion}</span>
                                                    </div>
                                                </div>
                                                <span className="text-lg font-black text-[#00BA4A] shrink-0">{fmt((vpsBillingDetails as any).total)}</span>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Chu kỳ</label>
                                                    <select value={vpsBillingTerm} onChange={(e) => setVpsBillingTerm(e.target.value)} className="w-full h-12 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-xl px-4 text-[11px] font-black uppercase outline-none focus:border-[#00BA4A] transition-all">
                                                        {(vpsBillingDetails as any).availableTerms.map((t: any) => <option key={t.code} value={t.code}>{t.label}</option>)}
                                                    </select>
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Số lượng</label>
                                                    <input type="number" min={1} value={vpsQuantity} onChange={(e) => setVpsQuantity(Math.max(1, parseInt(e.target.value)))} className="w-full h-12 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-xl px-4 text-[13px] font-black outline-none focus:border-[#00BA4A] transition-all" />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="p-6 bg-gray-50 dark:bg-white/5 rounded-[20px] space-y-4 border border-gray-100 dark:border-white/5">
                                            <div className="flex justify-between text-[11px] font-black text-gray-500 uppercase">
                                                <span>Base Price</span>
                                                <span>{fmt((vpsBillingDetails as any).planPrice * vpsQuantity)}</span>
                                            </div>
                                            {(vpsBillingDetails as any).osSurcharge > 0 && (
                                                <div className="flex justify-between text-[11px] font-black text-sky-500 uppercase">
                                                    <span>Windows OS Fee</span>
                                                    <span>+{fmt((vpsBillingDetails as any).osSurcharge)}</span>
                                                </div>
                                            )}
                                            {(vpsBillingDetails as any).discountAmount > 0 && (
                                                <div className="flex justify-between text-[11px] font-black text-emerald-500 uppercase">
                                                    <span>Chiết khấu ({(vpsBillingDetails as any).discountPercent}%)</span>
                                                    <span>-{fmt((vpsBillingDetails as any).discountAmount)}</span>
                                                </div>
                                            )}
                                            <div className="pt-4 border-t border-dashed border-gray-300 dark:border-white/10 flex justify-between items-center">
                                                <span className="text-[12px] font-black dark:text-white uppercase tracking-widest">Tổng tiền</span>
                                                <div className="text-right">
                                                    <div className="text-2xl font-black text-[#00BA4A]">{fmt((vpsBillingDetails as any).total)}</div>
                                                    <div className="text-[9px] text-gray-400 font-bold uppercase mt-1">Đã bao gồm VAT</div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-5 pt-2">
                                            <label className="flex items-start gap-4 cursor-pointer group">
                                                <div className="relative flex items-center justify-center mt-0.5">
                                                    <input
                                                        type="checkbox"
                                                        checked={vpsAcceptedTerms}
                                                        onChange={(e) => setVpsAcceptedTerms(e.target.checked)}
                                                        className="w-5 h-5 rounded-[6px] border-2 border-gray-100 dark:border-white/10 transition-all appearance-none cursor-pointer"
                                                        style={{
                                                            backgroundColor: vpsAcceptedTerms ? '#00BA4A' : 'transparent',
                                                            borderColor: vpsAcceptedTerms ? '#00BA4A' : isDark ? 'rgba(255,255,255,0.1)' : '#eff2f6'
                                                        }}
                                                    />
                                                    {vpsAcceptedTerms && (
                                                        <FeatherIcon icon="check" size={12} className="absolute text-white pointer-events-none" />
                                                    )}
                                                </div>
                                                <span className="text-[11px] font-black text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors uppercase leading-tight mt-1 flex-1">
                                                    Tôi đồng ý với chính sách sử dụng dịch vụ tại 3HSTATION
                                                </span>
                                            </label>
                                            <button
                                                onClick={handleOrderVps}
                                                disabled={vpsOrdering || !vpsAcceptedTerms}
                                                className="w-full py-4 rounded-[12px] text-[13px] font-black uppercase tracking-[2px] shadow-2xl transition-all disabled:opacity-30 disabled:grayscale disabled:pointer-events-none hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2"
                                                style={{ backgroundColor: '#00BA4A', color: '#FFFFFF' }}
                                            >
                                                {vpsOrdering ? (
                                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                                ) : <FeatherIcon icon="shield" size={16} />}
                                                {vpsOrdering ? 'ĐANG KHỞI TẠO...' : 'THANH TOÁN NGAY'}
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </HostingLayout>
    );
};

export default LandingVpsPage;
