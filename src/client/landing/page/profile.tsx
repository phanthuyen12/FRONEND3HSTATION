import React, { useEffect, useState } from 'react';
import FeatherIcon from 'feather-icons-react';
import HostingLayout from '../layouts/HostingLayout';
import { useTheme } from '../context/ThemeContext';
import { authService, userService, vpsService, workflowsService, elearningService } from '../../../config';
import { NodeverseVpsPlan, VpsPlan, VpsBillingTerm } from '../../../services/vpsService';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import Swal from 'sweetalert2';

const LandingProfilePage = () => {
   const { isDark } = useTheme();
   const navigate = useNavigate();
   const [searchParams, setSearchParams] = useSearchParams();
   const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'info');

   // Sync tab with URL
   useEffect(() => {
      const tab = searchParams.get('tab');
      if (tab && tab !== activeTab) {
         setActiveTab(tab);
      }
   }, [searchParams]);

   const handleTabChange = (tabId: string) => {
      setActiveTab(tabId);
      setSearchParams({ tab: tabId });
   };
   const [selectedOrder, setSelectedOrder] = useState<any>(null);
   const [loading, setLoading] = useState(true);
   const [saving, setSaving] = useState(false);
   const [user, setUser] = useState<any>(null);
   const [orders, setOrders] = useState<any[]>([]);
   const [myVps, setMyVps] = useState<any[]>([]);
   const [myWorkflows, setMyWorkflows] = useState<any[]>([]);
   const [myCourses, setMyCourses] = useState<any[]>([]);
   const [referralData, setReferralData] = useState<any>({
      refCode: null,
      refCount: 0,
      refCommission: 0,
      registerPath: null,
      referrals: [],
   });

   // VPS States
   const [nvPlans, setNvPlans] = useState<NodeverseVpsPlan[]>([]);
   const [stdPlans, setStdPlans] = useState<VpsPlan[]>([]);
   const [selectedNvPlanId, setSelectedNvPlanId] = useState<string | null>(null);
   const [selectedOsVersion, setSelectedOsVersion] = useState<string | null>(null);
   const [selectedOsDeviceId, setSelectedOsDeviceId] = useState<string | null>(null);
   const [selectedOsAgencyId, setSelectedOsAgencyId] = useState<string | null>(null);
   const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
   const [pricingMap, setPricingMap] = useState<Record<string, VpsBillingTerm[]>>({});
   const [vpsBillingTerm, setVpsBillingTerm] = useState("1m");
   const [vpsQuantity, setVpsQuantity] = useState(1);
   const [vpsAutoRenew, setVpsAutoRenew] = useState(false);
   const [vpsAcceptedTerms, setVpsAcceptedTerms] = useState(false);
   const [vpsOrdering, setVpsOrdering] = useState(false);

   // Pagination & Filter States
   const [orderSearch, setOrderSearch] = useState('');
   const [orderStatusFilter, setOrderStatusFilter] = useState('tat-ca');
   const [orderCurrentPage, setOrderCurrentPage] = useState(1);
   const orderPageSize = 5;

   // States for forms
   const [formData, setFormData] = useState({ name: '', phone: '', email: '' });
   const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });

   useEffect(() => {
      if (!authService.isAuthenticated()) {
         navigate('/landing-login');
         return;
      }
      loadAllData();
   }, [navigate]);

   const loadAllData = async () => {
      setLoading(true);
      try {
         const [profile, ordersData, vpsData, workflowsData, coursesData, referralRes] = await Promise.all([
            authService.getProfile().catch(() => null),
            userService.getMyOrders({ limit: 100 }).catch(() => ({ data: [] })),
            vpsService.getMyNodeverseVpsOrders().catch(() => []),
            workflowsService.getMyWorkflows().catch(() => ({ data: [] })),
            elearningService.getMyCourses().catch(() => []),
            userService.getMyReferrals({ limit: 50 }).catch(() => ({ refCode: null, refCount: 0, refCommission: 0, registerPath: null, referrals: [] }))
         ]);

         if (profile) {
            setUser(profile);
            setFormData({
               name: profile.name || '',
               phone: profile.phone || '',
               email: profile.email || ''
            });
         }

         setOrders(ordersData?.data || []);
         setMyVps(vpsData || []);
         setMyWorkflows(workflowsData?.data || []);
         setMyCourses(coursesData || []);
         setReferralData(referralRes || { refCode: null, refCount: 0, refCommission: 0, registerPath: null, referrals: [] });
      } catch (err) {
         console.error("Failed to load profile data", err);
      } finally {
         setLoading(false);
      }
   };

   const handleEditProfile = () => {
      Swal.fire({
         title: 'Chỉnh sửa hồ sơ',
         text: 'Tính năng tự động cập nhật thông tin đang được đồng bộ hóa. Vui lòng liên hệ quản trị viên nếu cần thay đổi gấp.',
         icon: 'info',
         confirmButtonText: 'Đã hiểu',
         confirmButtonColor: '#FBBF24'
      });
   };

   // Load VPS Plans
   useEffect(() => {
      if (activeTab === 'vps-register') {
         const loadVpsPlans = async () => {
            try {
               const nvData = await vpsService.getNodeverseVpsPlans();
               let nvList: NodeverseVpsPlan[] = [];
               if (Array.isArray(nvData)) nvList = nvData; else if (nvData?.plans) nvList = nvData.plans;
               setNvPlans(nvList.filter(p => p.isActive));

               const stdData = await vpsService.fetchClientPlans();
               setStdPlans(stdData || []);
            } catch (err) {
               console.error("Load VPS plans error", err);
            }
         };
         loadVpsPlans();
      }
      if (activeTab === 'vps-manage') {
         vpsService.getMyNodeverseVpsOrders().then(setMyVps).catch(console.error);
      }
   }, [activeTab]);

   // Load Pricing for selected VPS plan
   useEffect(() => {
      if (selectedPlanId && !pricingMap[selectedPlanId]) {
         vpsService.fetchPlanPricing(selectedPlanId)
            .then(res => setPricingMap(prev => ({ ...prev, [selectedPlanId]: res.terms || [] })))
            .catch(console.error);
      }
   }, [selectedPlanId, pricingMap]);

   const vpsBillingDetails = React.useMemo(() => {
      const plan = stdPlans.find(p => p.id === selectedPlanId);
      if (!plan) return null;
      const terms = pricingMap[plan.id] || [];
      const termNode = terms.find(t => t.code === vpsBillingTerm) || terms[0];
      const isWindows = selectedOsVersion?.toLowerCase().includes("windows");
      const osSurcharge = isWindows ? 120000 : 0;

      if (!termNode) return { planPrice: parseFloat(plan.price || '0'), osSurcharge, total: (parseFloat(plan.price || '0') + osSurcharge) * vpsQuantity, availableTerms: [] };

      const totalSurcharge = osSurcharge * termNode.months * vpsQuantity;
      const subtotal = termNode.subtotal * vpsQuantity + totalSurcharge;
      const discountAmount = (termNode.subtotal * termNode.discountPercent / 100) * vpsQuantity;
      return {
         planPrice: termNode.baseMonthlyPrice,
         osSurcharge,
         subtotal,
         discountPercent: termNode.discountPercent,
         discountAmount,
         total: subtotal - discountAmount,
         termLabel: termNode.label,
         availableTerms: terms
      };
   }, [stdPlans, selectedPlanId, selectedOsVersion, vpsBillingTerm, vpsQuantity, pricingMap]);

   const filteredOrders = React.useMemo(() => {
      let result = orders;
      if (orderStatusFilter !== 'tat-ca') {
         result = result.filter(o => {
            if (orderStatusFilter === 'cho-xu-ly') return ['pending', 'dang-cho-xu-ly', 'cho-duyet'].includes(o.status);
            if (orderStatusFilter === 'dang-xu-ly') return ['processing', 'dang-tao'].includes(o.status);
            if (orderStatusFilter === 'hoan-thanh') return ['paid', 'completed', 'tao-thanh-cong', 'tao-vps-thanh-cong'].includes(o.status);
            if (orderStatusFilter === 'da-huy') return ['cancelled', 'da-huy'].includes(o.status);
            return true;
         });
      }
      if (orderSearch.trim()) {
         const kw = orderSearch.toLowerCase();
         result = result.filter(o => String(o.id).toLowerCase().includes(kw) || (o.type && o.type.toLowerCase().includes(kw)) || String(o.item_id).toLowerCase().includes(kw));
      }
      return result;
   }, [orders, orderStatusFilter, orderSearch]);

   const totalOrderPages = Math.ceil(filteredOrders.length / orderPageSize);
   const paginatedOrders = filteredOrders.slice((orderCurrentPage - 1) * orderPageSize, orderCurrentPage * orderPageSize);

   const handleUpdateProfile = async () => {
      if (!formData.name.trim()) {
         Swal.fire('Lỗi', 'Vui lòng nhập tên của bạn', 'error');
         return;
      }
      setSaving(true);
      try {
         await authService.updateProfile({
            name: formData.name,
            phone: formData.phone
         });
         await loadAllData();
         Swal.fire({ icon: 'success', title: 'Thành công', text: 'Cập nhật thông tin thành công', timer: 2000, showConfirmButton: false });
      } catch (err: any) {
         Swal.fire('Lỗi', err.message || 'Không thể cập nhật thông tin', 'error');
      } finally {
         setSaving(false);
      }
   };

   const handleChangePassword = async () => {
      if (passwordData.newPassword !== passwordData.confirmPassword) {
         Swal.fire('Lỗi', 'Mật khẩu xác nhận không khớp', 'error');
         return;
      }
      if (passwordData.newPassword.length < 6) {
         Swal.fire('Lỗi', 'Mật khẩu phải từ 6 ký tự', 'error');
         return;
      }
      setSaving(true);
      try {
         await authService.changePassword({
            currentPassword: passwordData.currentPassword,
            newPassword: passwordData.newPassword
         });
         Swal.fire({ icon: 'success', title: 'Thành công', text: 'Đổi mật khẩu thành công', timer: 2000, showConfirmButton: false });
         setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } catch (err: any) {
         Swal.fire('Lỗi', err.message || 'Không thể đổi mật khẩu', 'error');
      } finally {
         setSaving(false);
      }
   };

   const handleVpsAction = async (id: string, action: 'start' | 'stop' | 'restart') => {
      try {
         const res = await vpsService.changeNodeverseVpsContainerState(id, action);
         Swal.fire({ icon: 'success', title: 'Thành công', text: res.message, timer: 2000, showConfirmButton: false });
         vpsService.getMyNodeverseVpsOrders().then(setMyVps);
      } catch (err: any) {
         Swal.fire('Lỗi', err.message || 'Không thể thực hiện thao tác', 'error');
      }
   };

   const handleOrderVps = async () => {
      if (!selectedPlanId || !vpsBillingDetails) return;
      setVpsOrdering(true);
      try {
         await vpsService.createNodeverseHybridVpsOrder(
            selectedPlanId, "balance", vpsBillingTerm, vpsAutoRenew,
            { osVersion: selectedOsVersion, nodeverseDeviceId: selectedOsDeviceId, nodeverseAgencyId: selectedOsAgencyId }
         );
         Swal.fire({ icon: 'success', title: 'Thành công', text: 'VPS đang được tạo, vui lòng đợi trong giây lát', timer: 3000 });
         handleTabChange('vps-manage');
      } catch (err: any) {
         Swal.fire('Lỗi', err.message || 'Không thể đặt hàng', 'error');
      } finally {
         setVpsOrdering(false);
      }
   };

   const handleViewOrderDetail = async (id: string) => {
      setLoading(true);
      try {
         const detail = await userService.getOrderById(id);
         setSelectedOrder(detail);
         handleTabChange('order-detail');
      } catch (err) {
         Swal.fire('Lỗi', 'Không thể tải chi tiết đơn hàng', 'error');
      } finally {
         setLoading(false);
      }
   };

   const handleLogout = async () => {
      const result = await Swal.fire({
         title: 'Đăng xuất?',
         text: "Bạn có chắc chắn muốn thoát phiên làm việc?",
         icon: 'question',
         showCancelButton: true,
         confirmButtonColor: '#FBBF24',
         cancelButtonColor: '#d33',
         confirmButtonText: 'Đăng xuất ngay',
         cancelButtonText: 'Hủy'
      });
      if (result.isConfirmed) {
         await authService.logout();
         navigate('/landing-login');
      }
   };

   const fmt = (n: any) => {
      const num = typeof n === 'string' ? parseFloat(n) : n;
      return (num || 0).toLocaleString('vi-VN') + 'đ';
   };

   const menuGroups = [
      {
         items: [
            { id: 'info', icon: 'user', label: 'Thông tin cá nhân' },
            { id: 'password', icon: 'lock', label: 'Mật khẩu & Bảo mật' },
            { id: 'orders', icon: 'shopping-bag', label: 'Đơn hàng của tôi' },
            { id: 'referral', icon: 'share-2', label: 'Link giới thiệu' },
         ]
      }
   ];

   const referralLink = referralData?.refCode
      ? `${window.location.origin}/landing-register?ref=${encodeURIComponent(referralData.refCode)}`
      : '';

   const handleCopyReferralLink = async () => {
      if (!referralLink) return;

      try {
         await navigator.clipboard.writeText(referralLink);
         Swal.fire({ toast: true, position: 'bottom-end', icon: 'success', title: 'Đã sao chép link giới thiệu', showConfirmButton: false, timer: 1800 });
      } catch (error) {
         Swal.fire('Lỗi', 'Không thể sao chép link lúc này', 'error');
      }
   };

   const InfoItem = ({ label, value, icon, copy, status, action }: any) => (
      <div className="flex items-center justify-between p-6 hover:bg-white/5/50 dark:hover:bg-[#0d1412]/[0.02] transition-colors group">
         <div className="flex items-center gap-5">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${status === 'warning' ? 'bg-amber-500/10 text-amber-500' : 'bg-[#0d1412]/5 text-gray-400 group-hover:bg-[#FBBF24]/10 group-hover:text-[#FBBF24]'}`}>
               <FeatherIcon icon={icon} size={18} />
            </div>
            <div className="space-y-0.5">
               <p className="text-[10px] font-black text-gray-400 uppercase tracking-[2px]">{label}</p>
               <div className="flex items-center gap-2">
                  <span className={`text-[15px] font-black tracking-tight ${status === 'warning' ? 'text-amber-500' : 'text-white'}`}>
                     {value}
                  </span>
                  {copy && (
                     <button onClick={() => { navigator.clipboard.writeText(value); Swal.fire({ toast: true, position: 'bottom-end', icon: 'success', title: 'Đã sao chép!', showConfirmButton: false, timer: 1500 }); }} className="text-gray-300 hover:text-[#FBBF24] transition-colors p-1">
                        <FeatherIcon icon="copy" size={12} />
                     </button>
                  )}
               </div>
            </div>
         </div>
         {action}
      </div>
   );

   const getStatusStyle = (status: string) => {
      if (['paid', 'completed', 'tao-thanh-cong', 'tao-vps-thanh-cong'].includes(status)) return { bg: 'rgba(251,191,36,0.1)', text: '#FBBF24', icon: 'check-circle' };
      if (['pending', 'dang-cho-xu-ly', 'cho-duyet'].includes(status)) return { bg: 'rgba(245,158,11,0.1)', text: '#F59E0B', icon: 'clock' };
      if (['cancelled', 'da-huy'].includes(status)) return { bg: 'rgba(239,68,68,0.1)', text: '#EF4444', icon: 'x-circle' };
      return { bg: 'rgba(107,114,128,0.1)', text: '#6B7280', icon: 'info' };
   };

   const renderContent = () => {
      if (loading && !user) return <div className="text-center p-20 animate-pulse font-black dark:text-white uppercase tracking-widest text-xs">Đang nạp dữ liệu hệ thống...</div>;

      switch (activeTab) {
         case 'info':
            return (
               <div className="space-y-6 animate-in fade-in slide-in-from-bottom-6 duration-700">

                  <div className="bg-gradient-to-br from-[#032030] to-[#245853] p-10 rounded-[16px] text-white shadow-xl relative overflow-hidden group">
                     <div className="absolute -right-16 -bottom-16 opacity-[0.03] group-hover:scale-110 group-hover:rotate-6 transition-all duration-1000">
                        <FeatherIcon icon="pocket" size={300} />
                     </div>
                     <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-10">
                        <div className="space-y-4">
                           <div className="flex items-center gap-2 text-white/60">
                              <FeatherIcon icon="credit-card" size={14} />
                              <span className="text-[10px] font-black uppercase tracking-[3px]">Số dư tài khoản hiện tại</span>
                           </div>
                           <div className="flex items-baseline gap-3">
                              <h1 className="text-5xl font-black tracking-tighter">{fmt(user?.balance || 0)}</h1>
                              <span className="text-white/40 font-bold uppercase tracking-widest text-[13px]">VNĐ</span>
                           </div>
                           <div className="flex gap-4 pt-2">
                              <button onClick={() => Swal.fire({ title: 'Rút tiền', text: 'Chức năng rút tiền về ngân hàng đang trong quá trình bảo trì nâng cấp.', icon: 'info', confirmButtonText: 'Đã hiểu' })} className="bg-[#0d1412]/10 hover:bg-[#0d1412]/20 text-white px-8 py-4 rounded-[12px] text-[12px] font-black uppercase tracking-widest transition-all border border-white/20 flex items-center gap-3 backdrop-blur-md">
                                 <FeatherIcon icon="arrow-up-right" size={18} /> Rút tiền
                              </button>
                           </div>
                        </div>
                     </div>
                  </div>

                  <div className="bg-[#0d1412] rounded-[16px] shadow-sm border border-white/[0.03] overflow-hidden">
                     <div className="px-8 py-6 border-b border-white/[0.03] flex items-center justify-between bg-black/20">
                        <div className="flex items-center gap-4">
                           <div className="w-12 h-12 bg-[#0d1412]/5 shadow-sm rounded-[12px] flex items-center justify-center border border-white/10">
                              <FeatherIcon icon="file-text" size={20} className="text-[#FBBF24]" />
                           </div>
                           <div>
                              <h3 className="text-sm font-black uppercase tracking-[2px] dark:text-white">Chi tiết hồ sơ</h3>
                              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">Thông tin định danh tài khoản hệ thống</p>
                           </div>
                        </div>
                     </div>
                     <div className="p-0 divide-y divide-gray-100 dark:divide-white/5">
                        <InfoItem label="Tên đăng nhập" value={user?.name} icon="user" />
                        <InfoItem label="Địa chỉ Email" value={user?.email} icon="mail" copy />
                        <InfoItem label="Số điện thoại" value={user?.phone || 'Chưa cập nhật'} icon="phone" copy={!!user?.phone} status={!user?.phone ? 'warning' : ''} />
                        <InfoItem label="Ngày tham gia" value={new Date(user?.createdAt || '').toLocaleString('vi-VN')} icon="calendar" />
                     </div>
                  </div>
               </div>
            );
         case 'password':
            return (
               <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="bg-[#0d1412] rounded-[16px] shadow-sm border border-white/[0.03] overflow-hidden">
                     <div className="bg-black/40 px-6 py-4 flex items-center gap-3 text-white">
                        <div className="bg-[#FBBF24] w-7 h-7 rounded-full flex items-center justify-center">
                           <FeatherIcon icon="lock" size={14} />
                        </div>
                        <span className="text-xs font-black uppercase tracking-widest">Thay đổi mật khẩu hệ thống</span>
                     </div>
                     <div className="p-10 space-y-8">
                        <div className="space-y-2">
                           <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest pl-1">Mật khẩu hiện tại</label>
                           <input
                              type="password"
                              className="w-full h-14 bg-[#0d1412]/5 border border-white/10 rounded-[12px] px-6 text-sm font-bold outline-none dark:text-white focus:border-[#FBBF24] transition-all"
                              placeholder="••••••••"
                              value={passwordData.currentPassword}
                              onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                           />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest pl-1">Mật khẩu mới</label>
                           <input
                              type="password"
                              className="w-full h-14 bg-[#0d1412]/5 border border-white/10 rounded-[12px] px-6 text-sm font-bold outline-none dark:text-white focus:border-[#FBBF24] transition-all"
                              placeholder="Tối thiểu 6 ký tự"
                              value={passwordData.newPassword}
                              onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                           />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest pl-1">Xác nhận mật khẩu mới</label>
                           <input
                              type="password"
                              className="w-full h-14 bg-[#0d1412]/5 border border-white/10 rounded-[12px] px-6 text-sm font-bold outline-none dark:text-white focus:border-[#FBBF24] transition-all"
                              placeholder="Nhập lại mật khẩu mới"
                              value={passwordData.confirmPassword}
                              onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                           />
                        </div>
                        <button
                           onClick={handleChangePassword}
                           disabled={saving}
                           className="w-full h-14 bg-[#FBBF24] text-white rounded-[12px] font-black text-xs uppercase tracking-widest shadow-xl shadow-[#FBBF24]/20 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50"
                        >
                           {saving ? 'ĐANG CẬP NHẬT...' : 'XÁC NHẬN ĐỔI MẬT KHẨU'}
                        </button>
                     </div>
                  </div>
               </div>
            );
         case 'orders':
            return (
               <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="bg-[#0d1412] rounded-[16px] shadow-sm border border-white/[0.03] p-5 flex flex-col md:flex-row items-center justify-between gap-4">
                     <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-[#FBBF24]/10 text-[#FBBF24] rounded-xl flex items-center justify-center shadow-sm"><FeatherIcon icon="file-text" size={16} /></div>
                        <div>
                           <h2 className="text-[15px] font-black dark:text-white uppercase tracking-tight">Đơn hàng của tôi</h2>
                           <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">Tổng cộng {orders.length} đơn hàng</p>
                        </div>
                     </div>
                     <div className="flex w-full md:w-[320px] items-center gap-3 h-10 px-4 bg-[#0d1412]/5 rounded-xl border border-white/[0.03] focus-within:border-[#FBBF24]/30 transition-all">
                        <FeatherIcon icon="search" size={13} className="text-gray-400" />
                        <input type="text" placeholder="Tìm theo mã hoặc loại sản phẩm..." value={orderSearch} onChange={(e) => { setOrderSearch(e.target.value); setOrderCurrentPage(1); }} className="bg-transparent flex-1 text-[10px] font-bold outline-none dark:text-white placeholder:text-gray-400/50" />
                     </div>
                  </div>

                  <div className="flex items-center gap-4 overflow-x-auto pb-2 scrollbar-hide">
                     <div className="flex gap-1.5 p-1 bg-[#0d1412] border border-white/[0.03] rounded-2xl w-full md:w-auto">
                        {[
                           { id: 'tat-ca', label: 'Tất cả', count: orders.length },
                           { id: 'cho-xu-ly', label: 'Chờ thanh toán', count: orders.filter(o => ['pending', 'dang-cho-xu-ly', 'cho-duyet'].includes(o.status)).length },
                           { id: 'dang-xu-ly', label: 'Đang xử lý', count: orders.filter(o => ['processing', 'dang-tao'].includes(o.status)).length },
                           { id: 'hoan-thanh', label: 'Hoàn thành', count: orders.filter(o => ['paid', 'completed', 'tao-thanh-cong', 'tao-vps-thanh-cong'].includes(o.status)).length },
                           { id: 'da-huy', label: 'Đã hủy', count: orders.filter(o => ['cancelled', 'da-huy'].includes(o.status)).length },
                        ].map((tab) => (
                           <button
                              key={tab.id}
                              onClick={() => { setOrderStatusFilter(tab.id); setOrderCurrentPage(1); }}
                              className={`relative group px-4 py-2 rounded-xl text-[8.5px] font-black uppercase tracking-[2px] flex items-center justify-center text-center gap-2 transition-all min-h-[48px] ${orderStatusFilter === tab.id
                                    ? 'bg-[#032030] text-white shadow-xl shadow-[#032030]/20'
                                    : 'text-gray-400 hover:bg-white/5 dark:hover:bg-[#0d1412]/5'
                                 }`}
                              style={{ color: orderStatusFilter === tab.id ? '#ffffff' : undefined }}
                           >
                              <span className="max-w-[80px] leading-tight">{tab.label}</span>
                              <span className={`px-1.5 py-0.5 rounded-lg text-[8px] font-black transition-colors ${orderStatusFilter === tab.id
                                    ? 'bg-[#FBBF24] text-white'
                                    : 'bg-[#0d1412]/10 text-gray-400'
                                 }`}>
                                 {tab.count}
                              </span>
                           </button>
                        ))}
                     </div>
                  </div>

                  <div className="bg-[#0d1412] rounded-[16px] shadow-sm border border-white/[0.03] overflow-hidden">
                     <div className="overflow-x-auto overflow-y-hidden">
                        <table className="w-full text-left border-collapse min-w-[800px]">
                           <thead>
                              <tr className="bg-[#0d1412]/5 border-b border-white/[0.03] text-[8px] font-black text-gray-400 uppercase tracking-[2px]">
                                 <th className="px-6 py-3.5">CHI TIẾT</th>
                                 <th className="px-6 py-3.5">SẢN PHẨM / DỊCH VỤ</th>
                                 <th className="px-6 py-3.5 text-center">TỔNG TIỀN</th>
                                 <th className="px-6 py-3.5 text-center">TRẠNG THÁI</th>
                                 <th className="px-6 py-3.5">MÃ ĐƠN</th>
                                 <th className="px-6 py-3.5">NGÀY ĐẶT</th>
                              </tr>
                           </thead>
                           <tbody className="divide-y divide-gray-50 dark:divide-white/5">
                              {paginatedOrders.length === 0 ? (
                                 <tr><td colSpan={6} className="p-20 text-center text-gray-400/60 font-black uppercase tracking-widest text-[9px]">Không tìm thấy đơn hàng nào</td></tr>
                              ) : paginatedOrders.map((order: any, i: number) => {
                                 const status = getStatusStyle(order.status);
                                 return (
                                    <tr key={i} className="hover:bg-white/5/50 dark:hover:bg-[#0d1412]/5 transition-colors group">
                                       <td className="px-6 py-4">
                                          <button
                                             onClick={() => handleViewOrderDetail(order.id)}
                                             className="flex items-center gap-1.5 text-[9px] font-black text-[#FBBF24] hover:bg-[#FBBF24]/10 px-2.5 py-1.5 rounded-lg transition-all uppercase tracking-widest"
                                          >
                                             <FeatherIcon icon="eye" size={11} /> View
                                          </button>
                                       </td>
                                       <td className="px-6 py-4">
                                          <div className="flex flex-col gap-0.5">
                                             <span className="text-[12px] font-black text-white uppercase tracking-tight truncate max-w-[200px]">{order.type.replace(/_/g, ' ')}</span>
                                             <div className="flex items-center gap-2">
                                                <span className="text-[8.5px] font-black text-[#FBBF24] uppercase tracking-wider bg-[#FBBF24]/10 px-1.5 py-0.5 rounded">ID: #{order.item_id || 'N/A'}</span>
                                             </div>
                                          </div>
                                       </td>
                                       <td className="px-6 py-4 text-center text-[12.5px] font-black text-white">{fmt(order.amount)}</td>
                                       <td className="px-6 py-4 text-center">
                                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl border border-white/[0.03]" style={{ background: status.bg, color: status.text }}>
                                             <div className="w-1 h-1 rounded-full" style={{ backgroundColor: status.text }}></div>
                                             <span className="text-[8.5px] font-black uppercase tracking-widest">{order.status}</span>
                                          </div>
                                       </td>
                                       <td className="px-6 py-4 text-[11px] font-black text-gray-400 font-mono">PO{String(order.id).padStart(7, '0')}</td>
                                       <td className="px-6 py-4">
                                          <div className="flex flex-col">
                                             <span className="text-[10px] font-black text-white">{new Date(order.created_at).toLocaleDateString('vi-VN')}</span>
                                             <span className="text-[8.5px] font-bold text-gray-400 uppercase">{new Date(order.created_at).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</span>
                                          </div>
                                       </td>
                                    </tr>
                                 );
                              })}
                           </tbody>
                        </table>
                     </div>

                     {totalOrderPages > 1 && (
                        <div className="px-6 py-5 border-t border-white/[0.03] bg-black/10 flex items-center justify-between">
                           <div className="text-[10px] text-gray-400 font-black uppercase tracking-widest hidden md:block">
                              Trang {orderCurrentPage} / {totalOrderPages}
                           </div>
                           <div className="flex gap-2 w-full md:w-auto justify-center">
                              <button
                                 disabled={orderCurrentPage === 1}
                                 onClick={() => { setOrderCurrentPage(p => p - 1); window.scrollTo({ top: 400, behavior: 'smooth' }); }}
                                 className="w-10 h-10 rounded-xl border border-white/10 flex items-center justify-center text-gray-400 hover:bg-[#0d1412] dark:hover:bg-[#0d1412]/5 hover:text-[#FBBF24] transition-all disabled:opacity-30 disabled:pointer-events-none shadow-sm"
                              >
                                 <FeatherIcon icon="chevron-left" size={16} />
                              </button>

                              {[...Array(totalOrderPages)].map((_, idx) => {
                                 const page = idx + 1;
                                 if (totalOrderPages > 5) {
                                    if (page !== 1 && page !== totalOrderPages && (page < orderCurrentPage - 1 || page > orderCurrentPage + 1)) {
                                       if (page === orderCurrentPage - 2 || page === orderCurrentPage + 2) return <span key={idx} className="w-10 h-10 flex items-center justify-center text-gray-300">...</span>;
                                       return null;
                                    }
                                 }
                                 return (
                                    <button
                                       key={idx}
                                       onClick={() => { setOrderCurrentPage(page); window.scrollTo({ top: 400, behavior: 'smooth' }); }}
                                       className={`w-10 h-10 rounded-xl text-[11px] font-black transition-all ${orderCurrentPage === page
                                             ? 'bg-[#FBBF24] text-white shadow-lg shadow-[#FBBF24]/30 scale-110'
                                             : 'bg-[#0d1412]/5 border border-white/10 text-gray-400 hover:border-[#FBBF24]/50 hover:text-[#FBBF24]'
                                          }`}
                                    >
                                       {page}
                                    </button>
                                 );
                              })}

                              <button
                                 disabled={orderCurrentPage === totalOrderPages}
                                 onClick={() => { setOrderCurrentPage(p => p + 1); window.scrollTo({ top: 400, behavior: 'smooth' }); }}
                                 className="w-10 h-10 rounded-xl border border-white/10 flex items-center justify-center text-gray-400 hover:bg-[#0d1412] dark:hover:bg-[#0d1412]/5 hover:text-[#FBBF24] transition-all disabled:opacity-30 disabled:pointer-events-none shadow-sm"
                              >
                                 <FeatherIcon icon="chevron-right" size={16} />
                              </button>
                           </div>
                        </div>
                     )}
                  </div>
               </div>
            );
         case 'referral':
            return (
               <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="rounded-[18px] border border-[#FBBF24]/15 bg-gradient-to-br from-[#1a1200] via-[#111111] to-[#032030] p-8 text-white shadow-xl">
                     <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                        <div className="space-y-3">
                           <div className="inline-flex items-center gap-2 rounded-full border border-[#FBBF24]/25 bg-[#FBBF24]/10 px-3 py-1 text-[10px] font-black uppercase tracking-[2px] text-[#FCD34D]">
                              <FeatherIcon icon="gift" size={12} />
                              Link đăng ký mã giới thiệu
                           </div>
                           <h2 className="text-3xl font-black uppercase tracking-tight">Mời bạn bè, theo dõi ref của bạn tại một chỗ</h2>
                           <p className="max-w-2xl text-sm text-gray-300">
                              Mỗi tài khoản có một link đăng ký riêng. Khi người dùng đăng ký qua link này, bạn có thể xem số lượng ref, danh sách tài khoản đã vào và tổng hoa hồng đã nhận.
                           </p>
                        </div>
                        <button
                           onClick={handleCopyReferralLink}
                           disabled={!referralLink}
                           className="inline-flex h-12 items-center justify-center gap-3 rounded-xl bg-[#FBBF24] px-6 text-[11px] font-black uppercase tracking-[2px] text-black transition-all hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50"
                        >
                           <FeatherIcon icon="copy" size={15} />
                           Sao chép link ref
                        </button>
                     </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-3">
                     <div className="rounded-[16px] border border-white/[0.05] bg-[#0d1412] p-6">
                        <p className="text-[10px] font-black uppercase tracking-[2px] text-gray-400">Mã giới thiệu</p>
                        <h3 className="mt-3 break-all text-xl font-black text-white">{referralData?.refCode || 'Đang tạo...'}</h3>
                     </div>
                     <div className="rounded-[16px] border border-white/[0.05] bg-[#0d1412] p-6">
                        <p className="text-[10px] font-black uppercase tracking-[2px] text-gray-400">Số người đăng ký</p>
                        <h3 className="mt-3 text-3xl font-black text-[#FBBF24]">{referralData?.refCount || 0}</h3>
                     </div>
                     <div className="rounded-[16px] border border-white/[0.05] bg-[#0d1412] p-6">
                        <p className="text-[10px] font-black uppercase tracking-[2px] text-gray-400">Hoa hồng đã nhận</p>
                        <h3 className="mt-3 text-3xl font-black text-[#34d399]">{fmt(referralData?.refCommission || 0)}</h3>
                     </div>
                  </div>

                  <div className="rounded-[16px] border border-white/[0.05] bg-[#0d1412] p-6">
                     <div className="mb-3 flex items-center justify-between gap-4">
                        <div>
                           <p className="text-[10px] font-black uppercase tracking-[2px] text-gray-400">Link đăng ký của bạn</p>
                           <h3 className="mt-1 text-sm font-black uppercase tracking-tight text-white">Dùng link này để mời user mới đăng ký</h3>
                        </div>
                        <button
                           onClick={handleCopyReferralLink}
                           disabled={!referralLink}
                           className="hidden rounded-xl border border-[#FBBF24]/20 px-4 py-2 text-[10px] font-black uppercase tracking-[2px] text-[#FBBF24] transition-all hover:bg-[#FBBF24]/10 md:inline-flex"
                        >
                           Copy link
                        </button>
                     </div>
                     <div className="rounded-[14px] border border-white/10 bg-black/20 p-4">
                        <p className="break-all font-mono text-sm text-gray-200">{referralLink || 'Đang tạo link đăng ký...'}</p>
                     </div>
                  </div>

                  <div className="rounded-[16px] border border-white/[0.05] bg-[#0d1412] overflow-hidden">
                     <div className="flex items-center justify-between border-b border-white/[0.05] px-6 py-4">
                        <div>
                           <p className="text-[10px] font-black uppercase tracking-[2px] text-gray-400">Danh sách ref</p>
                           <h3 className="mt-1 text-sm font-black uppercase tracking-tight text-white">Các tài khoản đã đăng ký từ link của bạn</h3>
                        </div>
                        <div className="rounded-full bg-[#FBBF24]/10 px-3 py-1 text-[10px] font-black uppercase tracking-[2px] text-[#FBBF24]">
                           {referralData?.referrals?.length || 0} tài khoản
                        </div>
                     </div>
                     <div className="overflow-x-auto">
                        <table className="w-full min-w-[720px] text-left">
                           <thead>
                              <tr className="border-b border-white/[0.05] bg-black/10 text-[9px] font-black uppercase tracking-[2px] text-gray-400">
                                 <th className="px-6 py-3">Người đăng ký</th>
                                 <th className="px-6 py-3">Email</th>
                                 <th className="px-6 py-3">Số điện thoại</th>
                                 <th className="px-6 py-3">Trạng thái</th>
                                 <th className="px-6 py-3">Ngày tham gia</th>
                              </tr>
                           </thead>
                           <tbody>
                              {!referralData?.referrals?.length ? (
                                 <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-[11px] font-black uppercase tracking-[2px] text-gray-500">
                                       Chưa có ai đăng ký từ link giới thiệu của bạn
                                    </td>
                                 </tr>
                              ) : referralData.referrals.map((refUser: any) => (
                                 <tr key={refUser.id} className="border-b border-white/[0.05] text-sm text-gray-200">
                                    <td className="px-6 py-4 font-bold text-white">{refUser.name || 'Người dùng mới'}</td>
                                    <td className="px-6 py-4">{refUser.email}</td>
                                    <td className="px-6 py-4">{refUser.phone || 'Chưa cập nhật'}</td>
                                    <td className="px-6 py-4">
                                       <span className={`rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-[2px] ${refUser.status === 'active' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-gray-500/10 text-gray-300'}`}>
                                          {refUser.status || 'active'}
                                       </span>
                                    </td>
                                    <td className="px-6 py-4">{refUser.createdAt ? new Date(refUser.createdAt).toLocaleString('vi-VN') : '--'}</td>
                                 </tr>
                              ))}
                           </tbody>
                        </table>
                     </div>
                  </div>
               </div>
            );
      }
   };

   if (!user && !loading) return null;

   return (
      <HostingLayout>
         <div className="min-h-screen bg-[#060a09] pt-0 pb-24">

            {/* ── BREADCRUMBS ── */}
            <div className="hidden md:block max-w-[1200px] mx-auto px-4 md:px-6 lg:px-8 mb-6">
               <div className="flex items-center gap-2 text-[13px] text-gray-400 font-medium">
                  <Link to="/landing1" className="hover:text-[#FBBF24] transition-colors flex items-center gap-1.5 grayscale opacity-70 hover:opacity-100 hover:grayscale-0">
                     <FeatherIcon icon="home" size={14} /> Trang chủ
                  </Link>
                  <FeatherIcon icon="chevron-right" size={12} className="opacity-30" />
                  <span className="opacity-70">Tài khoản</span>
                  <FeatherIcon icon="chevron-right" size={12} className="opacity-30" />
                  <span className="text-white font-bold uppercase tracking-tight">{user?.name || 'Hồ sơ cá nhân'}</span>
               </div>
            </div>

            <div className="max-w-[1200px] mx-auto px-4 md:px-6 lg:px-8">
               <div className="flex flex-col lg:flex-row gap-10">

                  <div className="lg:w-[320px] shrink-0 space-y-6">
                     {/* ── ACCOUNT CARD ── */}
                     <div className="bg-[#0d1412] p-6 rounded-[16px] shadow-sm border border-white/[0.03] flex items-center gap-5 transition-all hover:shadow-md">
                        <div className="relative shrink-0">
                           <img src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.name}&background=00BA4A&color=fff`} className="w-16 h-16 rounded-full border-2 border-white/10 object-cover p-0.5" alt="Avatar" />
                           <span className="absolute bottom-1 right-1 w-4 h-4 bg-[#FBBF24] border-4 border-[#0d1412] rounded-full"></span>
                        </div>
                        <div className="min-w-0 flex-1">
                           <h3 className="text-[17px] font-black text-white uppercase tracking-tight truncate leading-tight">{user?.name || '---'}</h3>
                           <div className="mt-2 space-y-0.5">
                              <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none">Số dư hiện tại</p>
                              <p className="text-[15px] font-black text-[#FBBF24] tracking-tight">{fmt(user?.balance || 0)}</p>
                           </div>
                        </div>
                     </div>

                     {/* ── MENU CARD LIST ── */}
                     <div className="space-y-3">
                        {menuGroups.map((group, groupIdx) => (
                           <div key={groupIdx} className="space-y-2">
                              {group.items.map((item, i) => {
                                 const accountIds = ['info', 'password'];
                                 const serviceIds = ['vps-register', 'vps-manage', 'workflows', 'courses'];
                                 const utilityIds = ['favorites', 'support', 'referral', 'api'];

                                 const isCurrent = (item.id === 'info' && accountIds.includes(activeTab)) ||
                                    (item.id === 'vps-manage' && serviceIds.includes(activeTab)) ||
                                    (item.id === 'favorites' && utilityIds.includes(activeTab)) ||
                                    activeTab === item.id;

                                 return (
                                    <button
                                       key={i}
                                       onClick={() => { handleTabChange(item.id); setSelectedOrder(null); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                                       className={`w-full flex items-center justify-between p-4 rounded-[16px] transition-all group border ${isCurrent
                                             ? 'bg-[#FBBF24] border-[#FBBF24] shadow-lg shadow-[#FBBF24]/20'
                                             : 'bg-[#0d1412] border-white/[0.03] hover:bg-white/5 dark:hover:bg-[#0d1412]/10 hover:border-white/10 dark:hover:border-white/20'
                                          }`}
                                    >
                                       <div className="flex items-center gap-4">
                                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${isCurrent ? 'bg-[#0d1412] text-[#FBBF24] shadow-lg' : 'bg-[#0d1412]/5 text-gray-400 group-hover:text-[#FBBF24]'
                                             }`}>
                                             <FeatherIcon icon={item.icon} size={18} />
                                          </div>
                                          <span className={`text-[13px] font-bold tracking-tight transition-colors ${isCurrent ? 'text-white' : 'text-gray-400 group-hover:text-white dark:group-hover:text-white'
                                             }`}>
                                             {item.label}
                                          </span>
                                       </div>
                                       <FeatherIcon
                                          icon="chevron-right"
                                          size={14}
                                          className={`transition-all ${isCurrent ? 'text-[#FBBF24] translate-x-0.5' : 'text-gray-300 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5'}`}
                                       />
                                    </button>
                                 );
                              })}
                           </div>
                        ))}

                        {/* ── LOGOUT CARD ── */}
                        <div className="pt-3 mt-3 border-t border-white/[0.03]">
                           <button
                              onClick={handleLogout}
                              className="w-full flex items-center justify-between p-3.5 rounded-[14px] bg-[#0d1412] border border-white/[0.03] hover:bg-red-50 dark:hover:bg-red-500/10 hover:border-red-100 dark:hover:border-red-500/20 transition-all group"
                           >
                              <div className="flex items-center gap-4">
                                 <div className="w-10 h-10 rounded-xl bg-red-500/5 text-red-500 flex items-center justify-center group-hover:bg-red-500 group-hover:text-white transition-all shadow-sm">
                                    <FeatherIcon icon="log-out" size={18} />
                                 </div>
                                 <span className="text-[13px] font-bold text-gray-400 group-hover:text-red-600 dark:group-hover:text-red-400">Đăng xuất hệ thống</span>
                              </div>
                              <FeatherIcon icon="chevron-right" size={14} className="text-gray-300 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5" />
                           </button>
                        </div>
                     </div>
                  </div>

                  <div className="flex-1 min-w-0">
                     {renderContent()}
                  </div>
               </div>
            </div>
         </div>
      </HostingLayout>
   );
};

export default LandingProfilePage;
