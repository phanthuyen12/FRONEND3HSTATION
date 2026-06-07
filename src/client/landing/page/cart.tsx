import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import FeatherIcon from 'feather-icons-react';
import HostingLayout from '../layouts/HostingLayout';
import { useTheme } from '../context/ThemeContext';

const MOCK_CART_ITEMS = [
  {
    id: 1,
    name: 'Sản phẩm ChatGPT Plus',
    variation: 'ChatGPT Plus 20$ 1 tháng - dùng chung',
    price: 150000,
    originalPrice: 510000,
    discount: 360000,
    quantity: 1,
    image: 'https://images.unsplash.com/photo-1673173054454-e053a992e854?w=200'
  }
];

const CartPage = () => {
  const [step, setStep] = useState(1); // 1: Cart, 2: Confirm, 3: Success
  const { isDark } = useTheme();
  const navigate = useNavigate();

  const fmt = (n: number) => n.toLocaleString('vi-VN') + 'đ';

  const total = MOCK_CART_ITEMS.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const originalTotal = MOCK_CART_ITEMS.reduce((sum, item) => sum + (item.originalPrice * item.quantity), 0);
  const totalDiscount = originalTotal - total;

  return (
    <HostingLayout>
      <div className="min-h-screen bg-[#060a09] py-10">
        <div className="container mx-auto px-4 md:px-6 max-w-6xl">
          
          {/* ── STEPPER ── */}
          <div className="bg-[#0d1412] rounded-[10px] p-6 mb-8 border border-white/[0.03] shadow-sm">
            <div className="flex items-center justify-center max-w-2xl mx-auto">
              {/* Step 1 */}
              <div className="flex flex-col items-center gap-2 relative z-10">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${step >= 1 ? 'bg-[#FBBF24] text-white shadow-lg shadow-[#FBBF24]/20' : 'bg-[#0d1412]/5 text-gray-400'}`}>
                  <FeatherIcon icon="shopping-cart" size={18} />
                </div>
                <span className={`text-[11px] font-black uppercase tracking-widest ${step >= 1 ? 'text-[#FBBF24]' : 'text-gray-400'}`}>Giỏ hàng</span>
              </div>
              
              <div className={`flex-1 h-0.5 mx-4 transition-all ${step >= 2 ? 'bg-[#FBBF24]' : 'bg-[#0d1412]/5'}`}></div>
              
              {/* Step 2 */}
              <div className="flex flex-col items-center gap-2 relative z-10">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${step >= 2 ? 'bg-[#FBBF24] text-white shadow-lg shadow-[#FBBF24]/20' : 'bg-[#0d1412]/5 text-gray-400'}`}>
                  <FeatherIcon icon="check-square" size={18} />
                </div>
                <span className={`text-[11px] font-black uppercase tracking-widest ${step >= 2 ? 'text-[#FBBF24]' : 'text-gray-400'}`}>Xác nhận</span>
              </div>

              <div className={`flex-1 h-0.5 mx-4 transition-all ${step >= 3 ? 'bg-[#FBBF24]' : 'bg-[#0d1412]/5'}`}></div>

              {/* Step 3 */}
              <div className="flex flex-col items-center gap-2 relative z-10">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${step >= 3 ? 'bg-[#FBBF24] text-white shadow-lg shadow-[#FBBF24]/20' : 'bg-[#0d1412]/5 text-gray-400'}`}>
                  <FeatherIcon icon="check" size={18} />
                </div>
                <span className={`text-[11px] font-black uppercase tracking-widest ${step >= 3 ? 'text-[#FBBF24]' : 'text-gray-400'}`}>Hoàn tất</span>
              </div>
            </div>
          </div>

          {step === 1 && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left: Cart Items */}
              <div className="lg:col-span-8 space-y-6">
                <div className="bg-[#0d1412] rounded-[10px] p-6 border border-white/[0.03] flex items-center justify-between shadow-sm">
                  <div className="flex items-center gap-5">
                    <div className="w-16 h-16 rounded-[10px] bg-[#0d1412]/5 flex items-center justify-center relative border border-white/10 group shadow-inner">
                      <FeatherIcon icon="shopping-cart" size={26} className="text-gray-400 group-hover:text-[#FBBF24] transition-colors" />
                      <span className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full text-[11px] flex items-center justify-center text-white font-black border-2 border-white shadow-md">1</span>
                    </div>
                    <div>
                      <h2 className="text-xl font-black dark:text-white">Giỏ hàng</h2>
                      <p className="text-sm text-gray-400 font-medium">Bạn có 1 sản phẩm đã chọn</p>
                    </div>
                  </div>
                  <Link to="/product-mmo" className="px-5 py-2.5 bg-[#0d1412]/5 rounded-[10px] text-[11px] font-black uppercase tracking-wider shadow-sm border border-white/[0.03] hover:translate-y-[-2px] transition-all flex items-center gap-2 group">
                    <FeatherIcon icon="arrow-left" size={14} className="group-hover:-translate-x-1 transition-transform" /> Tiếp tục mua sắm
                  </Link>
                </div>

                <div className="bg-[#0d1412] rounded-[10px] border border-white/[0.03] shadow-sm overflow-hidden">
                  <div className="px-6 py-4 border-b border-white/[0.03] bg-[#0d1412]/5 flex items-center gap-2.5">
                    <FeatherIcon icon="grid" size={16} className="text-gray-400" />
                    <span className="text-[13px] font-black text-gray-300 uppercase tracking-widest">Danh sách sản phẩm (1)</span>
                  </div>
                  <div className="p-8">
                    {MOCK_CART_ITEMS.map((item) => (
                      <div key={item.id} className="flex flex-col md:flex-row gap-8 items-center group">
                        <div className="relative shrink-0">
                           <div className="absolute inset-0 bg-[#FBBF24] blur-2xl opacity-0 group-hover:opacity-10 transition-all duration-500"></div>
                           <img src={item.image} className="relative w-32 h-32 md:w-40 md:h-28 object-cover rounded-[10px] border border-white/10 shadow-sm" alt={item.name} />
                        </div>
                        <div className="flex-1 space-y-3">
                          <h3 className="text-lg font-black text-white group-hover:text-[#FBBF24] transition-colors">{item.name}</h3>
                          <div className="flex items-center gap-3 text-xs text-gray-400 font-bold">
                            <FeatherIcon icon="layers" size={14} className="opacity-50" /> {item.variation}
                          </div>
                          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#FBBF24]/10 text-[#FBBF24] text-[10px] font-black rounded-lg border border-[#FBBF24]/10">
                            <FeatherIcon icon="zap" size={12} fill="currentColor" /> Giảm giá: -{fmt(item.discount)}
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="text-2xl font-black text-[#FF3B30]">{fmt(item.price)}</span>
                            <span className="text-sm text-gray-300 line-through font-medium">{fmt(item.originalPrice)}</span>
                          </div>
                        </div>
                        <div className="flex items-center bg-[#0d1412]/5 border border-white/10 rounded-[10px] h-12 overflow-hidden shadow-sm">
                          <button className="w-12 h-full flex items-center justify-center hover:bg-[#0d1412] dark:hover:bg-[#0d1412]/10 transition-colors"><FeatherIcon icon="minus" size={16} /></button>
                          <div className="w-12 flex items-center justify-center font-black text-white border-x border-white/10">
                            {item.quantity}
                          </div>
                          <button className="w-12 h-full flex items-center justify-center hover:bg-[#0d1412] dark:hover:bg-[#0d1412]/10 transition-colors"><FeatherIcon icon="plus" size={16} /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right: Summary */}
              <div className="lg:col-span-4 space-y-6">
                <div className="bg-[#0d1412] rounded-[10px] shadow-sm border border-white/[0.03] overflow-hidden">
                  <div className="px-6 py-4 border-b border-white/[0.03] bg-[#0d1412]/5 flex items-center gap-2.5">
                    <FeatherIcon icon="file-text" size={16} className="text-gray-400" />
                    <span className="text-[13px] font-black text-gray-300 uppercase tracking-widest">Tóm tắt đơn hàng</span>
                  </div>
                  <div className="p-8 space-y-5">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-400 font-bold">Tạm tính (1 sản phẩm)</span>
                      <span className="text-base font-black dark:text-white">{fmt(originalTotal)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-400 font-bold flex items-center gap-1.5"><FeatherIcon icon="tag" size={16} className="text-[#FBBF24]" /> Giảm giá sản phẩm</span>
                      <span className="text-base font-black text-[#FBBF24] opacity-80">-{fmt(totalDiscount)}</span>
                    </div>
                    <div className="pt-5 border-t border-dashed border-white/10 flex justify-between items-center">
                      <span className="text-lg font-black dark:text-white uppercase tracking-tighter">Tổng cộng</span>
                      <span className="text-2xl font-black text-[#FF3B30]">{fmt(total)}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-[#0d1412] px-6 py-4 rounded-[10px] border border-white/[0.03] flex items-center justify-between group cursor-pointer hover:border-[#FBBF24] transition-all shadow-sm">
                  <div className="flex items-center gap-3">
                    <FeatherIcon icon="gift" size={18} className="text-gray-400 group-hover:text-[#FBBF24]" />
                    <span className="text-sm font-bold text-gray-400 group-hover:text-white dark:group-hover:text-white">Bạn có mã giảm giá?</span>
                  </div>
                  <FeatherIcon icon="chevron-down" size={16} className="text-gray-300" />
                </div>

                <button 
                  onClick={() => setStep(2)}
                  className="w-full h-16 rounded-[10px] bg-gray-900 hover:bg-[#FBBF24] dark:hover:bg-[#00a140] text-white font-black text-lg transition-all shadow-xl shadow-[#FBBF24]/20 flex items-center justify-center gap-3"
                >
                   Thanh toán đơn hàng
                   <FeatherIcon icon="arrow-right" size={20} />
                </button>

                <div className="space-y-3">
                  <button className="w-full py-3.5 rounded-[10px] border border-white/[0.03] text-[11px] font-black text-gray-400 uppercase tracking-widest hover:bg-white/5 dark:hover:bg-[#0d1412]/5 transition-all flex items-center justify-center gap-2">
                    <FeatherIcon icon="shopping-bag" size={14} /> Xem đơn hàng đã đặt
                  </button>
                  <div className="grid grid-cols-2 gap-3">
                    <button className="py-3 rounded-[10px] border border-white/[0.03] text-[10px] font-black text-gray-400 uppercase tracking-widest hover:bg-white/5 dark:hover:bg-[#0d1412]/5 transition-all flex items-center justify-center gap-2">
                      <FeatherIcon icon="refresh-cw" size={12} /> Cập nhật
                    </button>
                    <button className="py-3 rounded-[10px] border border-white/[0.03] text-[10px] font-black text-gray-400 uppercase tracking-widest hover:bg-red-50 transition-all flex items-center justify-center gap-2">
                      <FeatherIcon icon="trash-2" size={12} /> Xóa hết
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left: Confirm Items */}
              <div className="lg:col-span-8 space-y-6">
                <div className="bg-[#0d1412] rounded-[10px] border border-white/[0.03] shadow-sm overflow-hidden">
                  <div className="p-4 border-b border-white/[0.03] bg-[#0d1412]/5 flex items-center gap-2">
                    <FeatherIcon icon="package" size={16} className="text-[#FBBF24]" />
                    <span className="text-sm font-black dark:text-white">Sản phẩm đặt mua</span>
                    <span className="ml-auto text-[10px] font-black bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full">1 sản phẩm</span>
                  </div>
                  <div className="p-6">
                    {MOCK_CART_ITEMS.map((item) => (
                      <div key={item.id} className="flex gap-4 items-center">
                        <img src={item.image} className="w-16 h-16 object-cover rounded-lg border border-white/[0.03]" alt={item.name} />
                        <div className="flex-1">
                          <h3 className="font-black text-sm text-white">{item.name} <span className="text-red-500 ml-1">x{item.quantity}</span></h3>
                          <p className="text-[11px] text-gray-400 font-medium mt-1">{item.variation}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-black text-white">{fmt(item.price)}</div>
                          <div className="text-[11px] text-gray-400 line-through">{fmt(item.originalPrice)}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right: Payment & Summary */}
              <div className="lg:col-span-4 space-y-6">
                <div className="bg-[#0d1412] rounded-[10px] shadow-sm border border-white/[0.03] overflow-hidden">
                  <div className="p-4 border-b border-white/[0.03] bg-[#0d1412]/5 flex items-center gap-2">
                    <FeatherIcon icon="credit-card" size={16} className="text-[#FBBF24]" />
                    <span className="text-sm font-black dark:text-white">Phương thức thanh toán</span>
                  </div>
                  <div className="p-4">
                    <div className="p-4 rounded-[10px] border-2 border-[#FBBF24] bg-[#FBBF24]/10 flex items-center gap-4 relative">
                      <div className="w-10 h-10 rounded-lg bg-[#FBBF24] text-white flex items-center justify-center shadow-lg">
                        <FeatherIcon icon="wallet" size={20} />
                      </div>
                      <div>
                        <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">Số dư tài khoản</div>
                        <div className="text-base font-black text-[#FBBF24]">93.014.000đ</div>
                      </div>
                      <div className="ml-auto">
                        <div className="w-5 h-5 rounded-full bg-[#FBBF24] text-white flex items-center justify-center">
                          <FeatherIcon icon="check" size={12} strokeWidth={4} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-[#0d1412] rounded-[10px] shadow-sm border border-white/[0.03] overflow-hidden">
                  <div className="p-4 border-b border-white/[0.03] bg-[#0d1412]/5 flex items-center gap-2">
                    <FeatherIcon icon="list" size={16} className="text-[#FBBF24]" />
                    <span className="text-sm font-black dark:text-white">Tóm tắt đơn hàng</span>
                  </div>
                  <div className="p-6 space-y-4">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-400 font-bold">Tạm tính</span>
                      <span className="font-black dark:text-white">{fmt(originalTotal)}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-400 font-bold flex items-center gap-1.5"><FeatherIcon icon="tag" size={14} className="text-[#FBBF24]" /> Giảm giá sản phẩm</span>
                      <span className="font-black text-[#FBBF24] opacity-80">-{fmt(totalDiscount)}</span>
                    </div>
                    <div className="bg-[#FBBF24]/5 p-4 rounded-[10px] flex justify-between items-center">
                      <span className="text-sm font-black text-[#FBBF24]">Tổng cộng</span>
                      <span className="text-2xl font-black text-red-500">{fmt(total)}</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <button 
                    onClick={() => setStep(1)}
                    className="h-14 rounded-[10px] bg-[#0d1412]/5 border border-white/[0.03] text-sm font-black text-gray-400 hover:bg-white/5 flex items-center justify-center gap-2"
                  >
                    <FeatherIcon icon="arrow-left" size={16} /> Quay lại
                  </button>
                  <button 
                    onClick={() => setStep(3)}
                    className="h-14 rounded-[10px] bg-[#FBBF24] hover:bg-[#00a140] text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#FBBF24]/20"
                  >
                    <FeatherIcon icon="check-circle" size={16} /> Xác nhận thanh toán
                  </button>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="max-w-2xl mx-auto text-center space-y-8 py-10 bg-[#0d1412] rounded-[10px] border border-white/[0.03] shadow-xl">
               <div className="w-24 h-24 bg-[#FBBF24]/10 rounded-full flex items-center justify-center mx-auto relative">
                  <div className="absolute inset-0 rounded-full border-4 border-[#FBBF24] border-t-transparent animate-spin opacity-20"></div>
                  <FeatherIcon icon="check" size={48} className="text-[#FBBF24]" strokeWidth={3} />
               </div>
               <div className="space-y-2">
                 <h2 className="text-3xl font-black dark:text-white">Thanh toán hoàn tất!</h2>
                 <p className="text-gray-400 font-medium">Đơn hàng của bạn đã được xử lý thành công. <br/>Mã đơn hàng: <span className="font-bold text-[#FBBF24]">#ORD-99218</span></p>
               </div>
               <div className="flex flex-col sm:flex-row gap-4 justify-center px-10">
                 <button onClick={() => navigate('/orders')} className="flex-1 h-14 rounded-[10px] bg-[#0d1412]/10 text-white font-black text-sm flex items-center justify-center gap-2">
                   Xem đơn hàng
                 </button>
                 <button onClick={() => navigate('/')} className="flex-1 h-14 rounded-[10px] bg-[#FBBF24] text-white font-black text-sm flex items-center justify-center gap-2">
                   Về trang chủ
                 </button>
               </div>
            </div>
          )}

        </div>
      </div>
    </HostingLayout>
  );
};

export default CartPage;
