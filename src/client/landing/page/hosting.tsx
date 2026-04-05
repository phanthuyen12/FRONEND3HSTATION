
import React, { useEffect, useState, useMemo } from 'react';
import FeatherIcon from 'feather-icons-react';
import HostingLayout from '../layouts/HostingLayout';
import { useTheme } from '../context/ThemeContext';
import { authService, vpsService } from '../../../config';
import { VpsPlan } from '../../../services/vpsService';
import { useNavigate, Link } from 'react-router-dom';
import Swal from 'sweetalert2';

const LandingHostingPage = () => {
    const { isDark } = useTheme();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [hostingPlans, setHostingPlans] = useState<VpsPlan[]>([]);
    const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
    const [billingTerm, setBillingTerm] = useState("1m");
    const [ordering, setOrdering] = useState(false);

    const fmt = (n: any) => {
        const num = typeof n === 'string' ? parseFloat(n) : n;
        return (num || 0).toLocaleString('vi-VN') + 'đ';
    };

    useEffect(() => {
        const loadPlans = async () => {
            setLoading(true);
            try {
                const stdData = await vpsService.fetchClientPlans();
                // Lọc các gói có tên chứa "Hosting" (từ seeder)
                const hList = (stdData || []).filter(p =>
                    p.name.toLowerCase().includes('hosting') ||
                    p.id.toLowerCase().includes('hosting')
                );
                setHostingPlans(hList);
                if (hList.length > 0) setSelectedPlanId(hList[0].id);
            } catch (err) {
                console.error("Load hosting plans error", err);
            } finally {
                setLoading(false);
            }
        };
        loadPlans();
    }, []);

    const billingDetails = useMemo(() => {
        if (!selectedPlanId) return null;
        const plan = hostingPlans.find(p => p.id === selectedPlanId);
        if (!plan) return null;

        const basePrice = parseFloat(plan.price);
        let multiplier = 1;
        let discountPercent = 0;
        if (billingTerm === '3m') { multiplier = 3; discountPercent = 5; }
        else if (billingTerm === '6m') { multiplier = 6; discountPercent = 10; }
        else if (billingTerm === '12m') { multiplier = 12; discountPercent = 20; }

        const subtotal = (basePrice * multiplier);
        const discountAmount = Math.round(subtotal * (discountPercent / 100));
        const total = (subtotal - discountAmount);

        return {
            planPrice: basePrice,
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
    }, [selectedPlanId, hostingPlans, billingTerm]);

    const handleOrder = async () => {
        if (!authService.isAuthenticated()) {
            Swal.fire('Yêu cầu đăng nhập', 'Vui lòng đăng nhập để thực hiện mua hàng', 'warning').then(() => navigate('/landing-login'));
            return;
        }
        if (!selectedPlanId || !billingDetails) return;

        setOrdering(true);
        try {
            // Hosting cũng sử dụng chung logic thanh toán với VPS hoặc một dịch vụ tương tự
            // Ở đây tôi giả định dùng vpsService.createNodeverseHybridVpsOrder hoặc tương đương
            // Thực tế có thể có service riêng cho hosting
            Swal.fire('Tính năng đang hoàn thiện', 'Cổng thanh toán riêng cho Hosting đang được tích hợp.', 'info');
        } catch (err: any) {
            Swal.fire('Thất bại', err.message || 'Có lỗi xảy ra', 'error');
        } finally {
            setOrdering(false);
        }
    };

    return (
        <HostingLayout>
            <div className="bg-gray-50 dark:bg-[#060a09] min-h-screen pb-24">
                {/* Breadcrumb */}
                <div className="max-w-7xl mx-auto px-4 py-2">
                    <nav className="flex items-center gap-3 text-[10px] md:text-[11px] font-black uppercase tracking-[2px]">
                        <Link to="/" className="text-gray-400 hover:text-[#00BA4A] flex items-center gap-1.5">
                            <FeatherIcon icon="home" size={12} /> Trang chủ
                        </Link>
                        <FeatherIcon icon="chevron-right" size={10} className="text-gray-300" />
                        <span className="text-white">Cloud Hosting Premium</span>
                    </nav>
                </div>

                {/* Hero */}
                <div className="relative bg-gradient-to-r from-[#032030] via-[#04333b] to-[#014e3b] border-y border-white/5">
                    <div className="max-w-7xl mx-auto px-4 py-12 md:py-16">
                        <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-tight !text-white">
                            CLOUD <span className="text-[#00BA4A]">HOSTING</span>
                        </h1>
                        <p className="text-sm md:text-base !text-white font-black uppercase tracking-[2px] border-l-4 border-[#00BA4A] pl-4 mt-4">
                            Linh hồn cho website của bạn. Tốc độ vượt trội, bảo mật tối đa.
                        </p>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 pt-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        {loading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {[1, 2, 3, 4].map(n => <div key={n} className="h-40 bg-white/5 animate-pulse rounded-xl"></div>)}
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {hostingPlans.map(plan => (
                                    <button
                                        key={plan.id}
                                        onClick={() => setSelectedPlanId(plan.id)}
                                        className={`p-6 rounded-[12px] border-2 text-left transition-all ${selectedPlanId === plan.id ? 'border-[#00BA4A] bg-[#00BA4A]/5' : 'border-white/5 hover:border-[#00BA4A]/20'}`}
                                    >
                                        <div className="flex items-center gap-4 mb-4">
                                            <div className="w-12 h-12 bg-[#00BA4A]/10 text-[#00BA4A] rounded-xl flex items-center justify-center">
                                                <FeatherIcon icon="globe" size={24} />
                                            </div>
                                            <div>
                                                <span className="text-lg font-black ">{plan.name}</span>
                                                <span className="text-[10px] text-[#00BA4A] block uppercase font-bold tracking-widest">{plan.ssd} Storage</span>
                                            </div>
                                        </div>
                                        <div className="flex justify-between items-center pt-4 border-t border-white/5 mt-auto">
                                            <span className="text-sm text-gray-400">Chỉ từ</span>
                                            <span className="text-lg font-black ">{fmt(plan.price)}</span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="space-y-6">
                        <div className="bg-white dark:bg-[#0d1412] p-6 rounded-xl border border-white/5">
                            <h4 className="text-sm font-black uppercase tracking-widest border-b border-white/5 pb-4 mb-6">Thanh toán Hosting</h4>
                            {billingDetails ? (
                                <div className="space-y-6">
                                    <div className="flex justify-between items-center text-xs font-bold text-gray-400 uppercase">
                                        <span>Gói đã chọn</span>
                                        <span className="text-white">{hostingPlans.find(p => p.id === selectedPlanId)?.name}</span>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Thời hạn</label>
                                        <select value={billingTerm} onChange={e => setBillingTerm(e.target.value)} className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-xs font-black uppercase outline-none">
                                            {billingDetails.availableTerms.map(t => <option key={t.code} value={t.code}>{t.label}</option>)}
                                        </select>
                                    </div>
                                    <div className="pt-4 border-t border-dashed border-white/10 flex justify-between items-center">
                                        <span className="text-lg font-black ">Tổng tiền</span>
                                        <span className="text-3xl font-black text-[#00BA4A]">{fmt(billingDetails.total)}</span>
                                    </div>
                                    <button onClick={handleOrder} className="w-full bg-[#00BA4A] text-white py-4 rounded-xl font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all">
                                        THANH TOÁN NGAY
                                    </button>
                                </div>
                            ) : (
                                <div className="py-10 text-center text-gray-500 text-xs uppercase font-black tracking-widest">Vui lòng chọn 1 gói</div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </HostingLayout>
    );
};

export default LandingHostingPage;
