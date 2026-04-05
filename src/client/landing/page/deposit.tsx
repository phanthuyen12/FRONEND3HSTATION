import React from 'react';
import FeatherIcon from 'feather-icons-react';
import HostingLayout from '../layouts/HostingLayout';
import { useTheme } from '../context/ThemeContext';
import { Link } from 'react-router-dom';

const LandingDepositPage = () => {
   const { isDark } = useTheme();

   return (
      <HostingLayout>
         <div className="bg-gray-50 dark:bg-[#060a09] min-h-screen pb-24 overflow-x-hidden transition-colors duration-500">
            {/* Breadcrumb Navigation */}
            <div className="max-w-7xl mx-auto px-4 py-2">
               <nav className="flex items-center gap-3 text-[10px] md:text-[11px] font-black uppercase tracking-[2px] transition-all duration-300">
                  <Link to="/" className="text-gray-400 hover:text-[#00BA4A] flex items-center gap-1.5 transition-colors group">
                     <FeatherIcon icon="home" size={12} />
                     Trang chủ
                  </Link>
                  <FeatherIcon icon="chevron-right" size={10} className="text-gray-300" />
                  <span className="text-[#032030] dark:text-white">Nạp tiền vào ví</span>
               </nav>
            </div>

            {/* Hero Banner - Full Container Width */}
            <div className="relative bg-gradient-to-r from-[#032030] via-[#04333b] to-[#297c6d] border-y border-white/5 overflow-hidden mb-10">
               <div className="max-w-7xl mx-auto px-4 py-8 md:py-12 relative z-10">
                  <div className="max-w-2xl space-y-6">
                     <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-[0.85] !text-white">
                        NẠP TIỀN <br /><span className="text-[#00BA4A]">VÀO VÍ 3HSTATION</span>
                     </h1>
                     <p className="text-sm md:text-base !text-white font-black uppercase tracking-[2px] leading-relaxed max-w-xl border-l-4 border-[#00BA4A] pl-4">
                        Hệ thống nạp tiền tự động qua Ngân hàng & MoMo. <br />
                        <span className="!text-white">Tiền vào tài khoản chỉ sau 1-5 phút xử lý.</span>
                     </p>
                  </div>
                  <div className="absolute -right-20 -bottom-20 opacity-10 pointer-events-none text-white">
                     <FeatherIcon icon="database" size={400} className="rotate-12 hidden lg:block" />
                  </div>
               </div>
            </div>

            <div className="container mx-auto px-4 md:px-6 max-w-7xl">

               <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">

                  {/* ── LEFT: RECHARGE FORM ── */}
                  <div className="lg:col-span-8">
                     <div className="bg-white dark:bg-[#0d1412] rounded-[10px] border border-gray-100 dark:border-white/5 shadow-sm overflow-hidden h-full">
                        <div className="bg-[#00BA4A] px-6 py-4 flex items-center gap-3 text-white">
                           <div className="bg-white/20 p-2 rounded-lg">
                              <FeatherIcon icon="home" size={18} />
                           </div>
                           <span className="text-sm font-black uppercase tracking-widest">NẠP TIỀN QUA NGÂN HÀNG</span>
                        </div>

                        <div className="p-8 space-y-6">
                           <div className="space-y-3">
                              <label className="text-[11px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
                                 <FeatherIcon icon="database" size={12} className="text-[#00BA4A]" /> Số tiền nạp <span className="text-red-500">*</span>
                              </label>
                              <input type="text" placeholder="Nhập số tiền cần nạp" className="w-full h-14 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-[10px] px-5 text-base font-black focus:border-[#00BA4A] outline-none transition-all" />
                              <div className="bg-blue-50 dark:bg-blue-500/10 p-3 rounded-[10px] border border-blue-100 dark:border-blue-500/20 flex items-center gap-3">
                                 <div className="bg-blue-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-[10px] shrink-0 font-bold">i</div>
                                 <p className="text-blue-600 dark:text-blue-400 text-xs font-bold">Số tiền tối thiểu: <span className="font-black">1.000đ</span></p>
                              </div>
                           </div>

                           <div className="space-y-3">
                              <label className="text-[11px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
                                 <FeatherIcon icon="layers" size={12} className="text-[#00BA4A]" /> Chọn ngân hàng <span className="text-red-500">*</span>
                              </label>
                              <select className="w-full h-14 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-[10px] px-5 text-sm font-black focus:border-[#00BA4A] outline-none transition-all appearance-none cursor-pointer">
                                 <option>ACB</option>
                                 <option>MBBANK</option>
                                 <option>VIETCOMBANK</option>
                                 <option>MOMO</option>
                              </select>
                           </div>

                           <div className="bg-yellow-50 dark:bg-yellow-500/5 p-6 rounded-[10px] border-2 border-dashed border-yellow-200 dark:border-yellow-500/20 text-center space-y-2">
                              <p className="text-[10px] font-black text-yellow-600 dark:text-yellow-500 uppercase tracking-widest flex items-center justify-center gap-2">
                                 <FeatherIcon icon="calculator" size={12} /> Số tiền thực nhận ước tính
                              </p>
                              <h3 className="text-3xl font-black text-red-500">0đ</h3>
                           </div>

                           <button className="w-full h-16 bg-[#032030] hover:bg-black text-white rounded-[10px] text-sm font-black uppercase tracking-[2px] transition-all shadow-xl shadow-[#032030]/20 flex items-center justify-center gap-3 group">
                              <FeatherIcon icon="shield" size={18} className="group-hover:scale-110 transition-transform" />
                              Tạo hóa đơn nạp tiền
                           </button>
                        </div>
                     </div>
                  </div>

                  {/* ── RIGHT: PROMO & NOTICE ── */}
                  <div className="lg:col-span-4 space-y-8">
                     {/* Promotions */}
                     <div className="bg-white dark:bg-[#0d1412] rounded-[10px] border border-gray-100 dark:border-white/5 shadow-sm overflow-hidden">
                        <div className="bg-[#00BA4A] px-6 py-4 flex items-center gap-3 text-white">
                           <FeatherIcon icon="percent" size={18} />
                           <span className="text-[11px] font-black uppercase tracking-widest">KHUYẾN MÃI</span>
                        </div>
                        <div className="p-4">
                           <table className="w-full border-collapse">
                              <thead>
                                 <tr className="bg-gray-50 dark:bg-white/5 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                    <th className="p-3 text-left border border-gray-100 dark:border-white/10">Số tiền nạp</th>
                                    <th className="p-3 text-left border border-gray-100 dark:border-white/10">Khuyến mãi</th>
                                 </tr>
                              </thead>
                              <tbody className="text-xs font-black">
                                 {[
                                    { label: '≥ 100.000đ', value: '+5%' },
                                    { label: '≥ 1.000.000đ', value: '+10%' },
                                    { label: '≥ 10.000.000đ', value: '+15%' },
                                 ].map((p, i) => (
                                    <tr key={i}>
                                       <td className="p-3 border border-gray-100 dark:border-white/10 text-blue-600 dark:text-blue-400">{p.label}</td>
                                       <td className="p-3 border border-gray-100 dark:border-white/10 text-green-500">{p.value}</td>
                                    </tr>
                                 ))}
                              </tbody>
                           </table>
                        </div>
                     </div>

                     {/* Notices */}
                     <div className="bg-white dark:bg-[#0d1412] rounded-[10px] border border-gray-100 dark:border-white/5 shadow-sm overflow-hidden">
                        <div className="bg-red-500 px-6 py-4 flex items-center gap-3 text-white">
                           <FeatherIcon icon="alert-triangle" size={18} />
                           <span className="text-[11px] font-black uppercase tracking-widest">LƯU Ý</span>
                        </div>
                        <div className="p-6 space-y-4">
                           <div className="flex gap-4">
                              <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 shrink-0"></div>
                              <p className="text-xs font-bold text-gray-500 dark:text-gray-400 leading-relaxed">Vui lòng chuyển khoản đúng số tiền và nội dung để được cộng tiền tự động.</p>
                           </div>
                           <div className="flex gap-4">
                              <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 shrink-0"></div>
                              <p className="text-xs font-bold text-gray-500 dark:text-gray-400 leading-relaxed">Thời gian xử lý giao dịch có thể mất từ 1-5 phút sau khi chuyển khoản thành công.</p>
                           </div>
                           <div className="flex gap-4">
                              <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 shrink-0"></div>
                              <p className="text-xs font-bold text-gray-500 dark:text-gray-400 leading-relaxed">Nếu sau 5 phút vẫn chưa nhận được tiền, vui lòng liên hệ hỗ trợ qua Telegram @ntthanhz hoặc Zalo 0947838128</p>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>

               {/* ── BOTTOM: DEPOSIT HISTORY ── */}
               <div className="bg-white dark:bg-[#0d1412] rounded-[10px] border border-gray-100 dark:border-white/5 shadow-sm overflow-hidden">
                  <div className="bg-[#00BA4A] px-6 py-4 flex items-center gap-3 text-white">
                     <FeatherIcon icon="clock" size={18} />
                     <span className="text-sm font-black uppercase tracking-widest">LỊCH SỬ NẠP TIỀN</span>
                  </div>

                  {/* Filter Bar */}
                  <div className="p-6 bg-gray-50/50 dark:bg-white/5 border-b border-gray-100 dark:border-white/10 flex flex-wrap gap-4 items-end">
                     <div className="space-y-1.5 flex-1 min-w-[200px]">
                        <input type="text" placeholder="Mã giao dịch" className="w-full h-10 bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-[10px] px-4 text-xs font-bold outline-none" />
                     </div>
                     <div className="space-y-1.5 flex-1 min-w-[150px]">
                        <select className="w-full h-10 bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-[10px] px-4 text-xs font-bold outline-none">
                           <option>-- Trạng thái --</option>
                           <option>Chưa thanh toán</option>
                           <option>Hết hạn</option>
                        </select>
                     </div>
                     <div className="space-y-1.5 flex-1 min-w-[200px]">
                        <input type="text" placeholder="Chọn thời gian cần tìm" className="w-full h-10 bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-[10px] px-4 text-xs font-bold outline-none" />
                     </div>
                     <button className="h-10 px-6 bg-[#032030] text-white rounded-[10px] text-[11px] font-black uppercase flex items-center gap-2">
                        <FeatherIcon icon="search" size={14} /> Tìm kiếm
                     </button>
                     <button className="h-10 px-6 bg-gray-100 dark:bg-white/5 text-gray-400 rounded-[10px] text-[11px] font-black uppercase flex items-center gap-2 hover:bg-gray-200 transition-all">
                        <FeatherIcon icon="trash-2" size={14} /> Bỏ lọc
                     </button>
                  </div>

                  <div className="p-4 flex justify-between items-center bg-white dark:bg-[#0d1412] text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50 dark:border-white/5 px-8">
                     <div className="flex items-center gap-2">
                        SHOW :
                        <select className="bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-md p-1 outline-none">
                           <option>10</option>
                           <option>20</option>
                        </select>
                     </div>
                     <div className="flex items-center gap-2">
                        SHORT BY DATE:
                        <select className="bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-md p-1 outline-none">
                           <option>Tất cả</option>
                        </select>
                     </div>
                  </div>

                  {/* History Table */}
                  <div className="overflow-x-auto">
                     <table className="w-full text-left">
                        <thead className="bg-[#fcfdfe] dark:bg-white/5 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                           <tr>
                              <th className="px-8 py-5 border-b border-gray-100 dark:border-white/10">Mã giao dịch</th>
                              <th className="px-8 py-5 border-b border-gray-100 dark:border-white/10 text-center">Trạng thái</th>
                              <th className="px-8 py-5 border-b border-gray-100 dark:border-white/10">Ngân hàng</th>
                              <th className="px-8 py-5 border-b border-gray-100 dark:border-white/10 text-center">Số tiền cần thanh toán</th>
                              <th className="px-8 py-5 border-b border-gray-100 dark:border-white/10 text-center">Số tiền nhận được</th>
                              <th className="px-8 py-5 border-b border-gray-100 dark:border-white/10 whitespace-nowrap">Thời gian tạo hóa đơn</th>
                              <th className="px-8 py-5 border-b border-gray-100 dark:border-white/10">Cập nhật</th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 dark:divide-white/5">
                           {[
                              { id: '356487291', status: 'pending', bank: 'ACB', amount: 10000, received: 10000, date: '03/04/2026 17:44:49' },
                              { id: '914852367', status: 'pending', bank: 'ACB', amount: 123123, received: 129279, date: '31/03/2026 16:40:59' },
                              { id: '763582491', status: 'expired', bank: 'ACB', amount: 100000, received: 105000, date: '30/03/2026 09:51:23' },
                              { id: '563172984', status: 'expired', bank: 'ACB', amount: 2000000, received: 2200000, date: '28/03/2026 18:12:36' },
                           ].map((h, i) => (
                              <tr key={i} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors text-xs font-black">
                                 <td className="px-8 py-4 text-blue-500 select-all">{h.id}</td>
                                 <td className="px-8 py-4 text-center">
                                    <span className={`inline-flex px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-widest ${h.status === 'pending' ? 'bg-yellow-500 text-white' : 'bg-red-500 text-white'}`}>
                                       {h.status === 'pending' ? 'Chưa thanh toán' : 'Hết hạn'}
                                    </span>
                                 </td>
                                 <td className="px-8 py-4 text-gray-500">{h.bank}</td>
                                 <td className="px-8 py-4 text-center text-green-600">{(h.amount).toLocaleString()}đ</td>
                                 <td className="px-8 py-4 text-center text-red-500">{(h.received).toLocaleString()}đ</td>
                                 <td className="px-8 py-4 text-gray-400 whitespace-nowrap">{h.date}</td>
                                 <td className="px-8 py-4 text-gray-400 whitespace-nowrap">{h.date}</td>
                              </tr>
                           ))}
                        </tbody>
                     </table>
                  </div>

                  <div className="p-6 border-t border-gray-50 dark:border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
                     <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        Showing 10 of 116 Results
                     </div>
                     <div className="flex gap-2">
                        {[1, 2, 3, '...', 12].map((p, i) => (
                           <button key={i} className={`w-8 h-8 rounded-full text-xs font-black transition-all ${p === 1 ? 'bg-[#032030] text-white' : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5'}`}>
                              {p}
                           </button>
                        ))}
                     </div>
                  </div>
               </div>

            </div>
         </div>
      </HostingLayout>
   );
};

export default LandingDepositPage;
