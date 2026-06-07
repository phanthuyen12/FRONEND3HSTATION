import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import FeatherIcon from 'feather-icons-react';
import HostingLayout from '../layouts/HostingLayout';
import { useTheme } from '../context/ThemeContext';

const MOCK_PRODUCT = {
  id: 1,
  name: 'Sản phẩm ChatGPT Plus',
  brand: 'OpenAI',
  category: 'Học tập',
  logo: 'https://logo.clearbit.com/openai.com',
  cover: 'https://images.unsplash.com/photo-1673173054454-e053a992e854?w=800&auto=format&fit=crop&q=80',
  accent: '#FBBF24',
  dark: '#0d1f05',
  discount: 71,
  originalPrice: 510000,
  price: 150000,
  tag: 'TÀI KHOẢN RIÊNG',
  sold: 43,
  rating: 4.0,
  reviewsCount: 2,
  tags: [
    { icon: 'book-open', label: 'Học tập' },
    { icon: 'briefcase', label: 'Làm việc' },
    { icon: 'cpu', label: 'Tài khoản AI' },
  ],
  variations: [
    { id: 1, name: 'ChatGPT Plus 20$ 1 tháng - dùng chung', price: 150000, originalPrice: 510000, discount: 71, status: 'Còn hàng' },
    { id: 2, name: 'ChatGPT Plus 20$ 1 tháng', price: 560000, originalPrice: null, discount: null, status: 'Hết hàng' },
    { id: 3, name: 'ChatGPT Plus 20$ - Tài khoản dùng riêng', price: 50.000, originalPrice: null, discount: null, status: 'Đặt trước' },
  ],
  notes: [
    'Đây là tài khoản dùng chung, khách hàng sẽ được sử dụng chung tài khoản với người khác. Khách hàng sử dụng tối đa trên 1 thiết bị cùng lúc với dạng tài khoản dùng chung này.',
    'Tài khoản hiện KHÔNG sử dụng được các tính năng Ảnh, Upload File, Advanced Voice. Nếu quý khách muốn tham khảo gói nâng cấp cá nhân. Sản phẩm này không đảm bảo số lượt sử dụng tính năng Agent Mode.',
    'Model GPT-4 mới nhất có giới hạn thời gian sử dụng, có thể bị hạn chế và không truy cập được.',
    'Khách hàng vui lòng KHÔNG thay đổi thông tin tài khoản. KHÔNG thay đổi mật khẩu hoặc share tài khoản cho người khác sử dụng chung. Divine Shop có quyền từ chối bảo hành với các khách hàng vi phạm chính sách.',
    'Có thể sử dụng tính năng "Đoạn chat tạm thời" để không lưu lại lịch sử chat với người khác.',
    'Một số hành vi vi phạm chính sách của GPT có thể bao gồm việc sử dụng nó để sản xuất nội dung vi phạm bản quyền, kích động, phân biệt chủng tộc, quấy rối hoặc xúc phạm người khác, hoặc sử dụng nó để thực hiện các hoạt động lừa đảo hoặc gian lận.',
    'Tài khoản không hỗ trợ login trang web từ bên thứ 3 (third-party login) và API.'
  ],
  reviews: [
    { user: 'ad***n', rating: 3, date: '31/01/2026', content: 'cũng cũng được', status: 'Đã mua hàng' },
    { user: 'ad***n', rating: 5, date: '31/01/2026', content: 'sản phẩm tuyệt vời cà là vời', status: 'Đã mua hàng' },
  ],
  relatedProducts: [
    { id: 101, name: 'SuperGrok', price: 99000, image: 'https://images.unsplash.com/photo-1614741118887-7a4ee193a5fa?w=400' },
    { id: 102, name: 'Adobe Creative Cloud', price: 150000, image: 'https://images.unsplash.com/photo-1542744094-24638eff58bb?w=400' },
    { id: 103, name: 'Figma Edu', price: 50000, image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400' },
    { id: 104, name: 'LastPass Premium', price: 79000, image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=400' },
  ]
};

const fmt = (n: number) => n.toLocaleString('vi-VN') + 'đ';

const ProductMMODetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isDark } = useTheme();

  const p = MOCK_PRODUCT;
  const [selectedVariation, setSelectedVariation] = useState(p.variations[0].id);
  const [quantity, setQuantity] = useState(1);

  return (
    <HostingLayout>
      <div className="min-h-screen bg-[#060a09] pt-0 pb-12">

        {/* ── BREADCRUMBS ── */}
        <div className="hidden md:block container mx-auto px-4 md:px-6 pt-1 pb-2">
          <div className="flex items-center gap-2 text-[13px] text-gray-400 font-medium">
            <Link to="/" className="hover:text-[#FBBF24] transition-colors flex items-center gap-1">
              <FeatherIcon icon="home" size={14} /> Trang chủ
            </Link>
            <FeatherIcon icon="chevron-right" size={12} />
            <Link to="/product-mmo" className="hover:text-[#FBBF24]">Sản phẩm</Link>
            <FeatherIcon icon="chevron-right" size={12} />
            <span className="text-gray-400">Học tập</span>
            <FeatherIcon icon="chevron-right" size={12} />
            <span className="text-white font-bold">{p.name}</span>
          </div>
        </div>

        {/* ── HERO SECTION ── */}
        <div className="bg-gradient-to-r from-[#FBBF24] to-[#032030] dark:from-[#0a1411] dark:to-[#080d0c] py-10 mb-8 border-b border-white/[0.03] text-white">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">

              {/* Product Visual */}
              <div className="relative group shrink-0">
                <div className="absolute -inset-1 bg-gradient-to-r from-[#FBBF24] to-blue-500 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
                <div className="relative w-full md:w-[280px] h-[190px] bg-gradient-to-br from-gray-100 to-gray-300 dark:from-gray-800 dark:to-gray-900 rounded-xl overflow-hidden shadow-2xl flex flex-col justify-between p-4 border border-white/10">
                  <div className="flex justify-between items-start">
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg"
                      alt="Logo"
                      className="w-10 h-10 opacity-80"
                    />
                    <span className="text-[10px] font-bold bg-[#FBBF24] px-2 py-0.5 rounded text-white uppercase shadow-lg">Premium</span>
                  </div>
                  <div>
                    <h3 className="text-white font-black text-xl mb-1">{MOCK_PRODUCT.name}</h3>
                    <div className="bg-[#0d1412]/10 px-2 py-0.5 rounded text-[10px] font-bold w-fit uppercase tracking-wider text-white">1 THÁNG</div>
                  </div>
                  {/* Glass highlight effect */}
                  <div className="absolute top-0 -left-full w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:left-full transition-all duration-1000 ease-in-out" />
                </div>
              </div>

              {/* Product Info */}
              <div className="flex-grow">
                <h1 className="text-2xl md:text-3xl font-black mb-3 tracking-tight !text-white">{MOCK_PRODUCT.name}</h1>

                <div className="flex flex-wrap items-center gap-4 mb-5">
                  <div className="flex items-center gap-1.5 bg-black/20 px-2.5 py-1 rounded-lg border border-white/[0.03]">
                    <div className="flex text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <FeatherIcon key={i} icon="star" size={14} fill={i < 4 ? "currentColor" : "none"} />
                      ))}
                    </div>
                    <span className="text-sm font-bold">4.0</span>
                    <span className="text-[11px] text-white/50">(2 đánh giá)</span>
                  </div>

                  <div className="flex gap-2">
                    <button className="w-8 h-8 rounded-lg bg-[#0d1412]/10 flex items-center justify-center hover:bg-[#FBBF24] transition-all border border-white/[0.03] group">
                      <FeatherIcon icon="share-2" size={14} className="group-hover:scale-110" />
                    </button>
                    <button className="w-8 h-8 rounded-lg bg-[#0d1412]/10 flex items-center justify-center hover:bg-[#FBBF24] transition-all border border-white/[0.03] group">
                      <FeatherIcon icon="code" size={14} className="group-hover:scale-110" />
                    </button>
                    <button className="w-8 h-8 rounded-lg bg-[#0d1412]/10 flex items-center justify-center hover:bg-pink-500 transition-all border border-white/[0.03] group">
                      <FeatherIcon icon="heart" size={14} className="group-hover:scale-110" />
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-3 py-1.5 rounded-lg bg-[#0d1412]/5 border border-white/10 text-[11px] font-bold text-[#FBBF24] flex items-center gap-1.5">
                    <FeatherIcon icon="package" size={12} /> Học tập
                  </span>
                  <span className="px-3 py-1.5 rounded-lg bg-[#0d1412]/5 border border-white/10 text-[11px] font-bold text-[#FBBF24] flex items-center gap-1.5">
                    <FeatherIcon icon="briefcase" size={12} /> Làm việc
                  </span>
                  <span className="px-3 py-1.5 rounded-lg bg-[#0d1412]/5 border border-white/10 text-[11px] font-bold text-[#FBBF24] flex items-center gap-1.5">
                    <FeatherIcon icon="cpu" size={12} /> Tài khoản AI
                  </span>
                  <div className="px-3 py-1.5 rounded-lg bg-[#FBBF24] text-[11px] font-bold text-white flex items-center gap-1.5 shadow-lg shadow-[#FBBF24]/20">
                    <FeatherIcon icon="zap" size={12} fill="white" /> Đã bán 43
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── MAIN CONTENT ── */}
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col lg:flex-row gap-8 items-start">

            {/* LEFT COLUMN */}
            <div className="w-full lg:flex-1 space-y-6">

              {/* Variation Selection */}
              <div className="bg-[#050807] rounded-xl border border-white/[0.03] overflow-hidden shadow-sm">
                <div className="p-4 flex flex-col divide-y divide-gray-50 dark:divide-white/5">
                  {p.variations.map((v) => (
                    <div
                      key={v.id}
                      onClick={() => setSelectedVariation(v.id)}
                      className={`flex items-center justify-between p-4 cursor-pointer transition-all ${selectedVariation === v.id ? 'bg-[#FBBF24]/5' : 'hover:bg-white/5 dark:hover:bg-[#0d1412]/5'}`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${selectedVariation === v.id ? 'border-[#FBBF24] bg-[#FBBF24]' : 'border-gray-700'}`}>
                          {selectedVariation === v.id && <div className="w-2 h-2 rounded-full bg-[#0d1412]" />}
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-black flex items-center justify-center p-1.5 shadow-sm">
                            <img src={p.logo} alt="v" className="w-full h-full object-contain" />
                          </div>
                          <div>
                            <div className="text-sm font-bold text-white">{v.name}</div>
                            {v.id === 1 && <div className="text-[10px] text-[#FBBF24] font-bold flex items-center gap-1 mt-0.5"><FeatherIcon icon="zap" size={10} /> Đang bảo trì</div>}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-black text-white">{v.price > 0 ? fmt(v.price) : 'Liên hệ'}</div>
                        {v.originalPrice && (
                          <div className="flex items-center justify-end gap-1.5 mt-0.5">
                            <span className="text-[10px] text-gray-400 line-through">{fmt(v.originalPrice)}</span>
                            <span className="text-[10px] font-black text-[#FF3B30] bg-[#FF3B30]/10 px-1 rounded">-{v.discount}%</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Package Detail Accordion */}
              <div className="bg-[#050807] rounded-xl border border-white/[0.03] p-4 flex items-center justify-between shadow-sm border-l-4 border-l-[#7C3AED]">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#7C3AED]/10 text-[#7C3AED] flex items-center justify-center">
                    <FeatherIcon icon="box" size={18} />
                  </div>
                  <div className="text-sm font-black text-white uppercase tracking-wide">CHI TIẾT GÓI <br /><span className="text-xs font-bold text-gray-400 normal-case tracking-normal">ChatGPT Plus 20$ 1 tháng - dùng chung</span></div>
                </div>
                <FeatherIcon icon="chevron-down" size={20} className="text-gray-400" />
              </div>

              {/* Notes */}
              <div className="bg-[#050807] rounded-xl border border-white/[0.03] p-6 shadow-sm">
                <h3 className="text-lg font-black text-white mb-4 flex items-center gap-2">
                  Lưu ý:
                </h3>
                <ul className="space-y-4">
                  {p.notes.map((note, i) => (
                    <li key={i} className="flex items-start gap-3 text-[13px] text-gray-400 leading-relaxed">
                      <div className="w-1.5 h-1.5 rounded-full bg-gray-300 mt-2 shrink-0" />
                      {note}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Description Expandable */}
              <div className="bg-[#050807] rounded-xl border border-white/[0.03] p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#10B981]/10 text-[#10B981] flex items-center justify-center">
                      <FeatherIcon icon="file-text" size={18} />
                    </div>
                    <div>
                      <div className="text-[10px] font-bold text-[#10B981] uppercase">GIỚI THIỆU</div>
                      <div className="text-sm font-black text-white">Mô tả sản phẩm</div>
                    </div>
                  </div>
                  <button className="text-xs font-bold text-gray-400 flex items-center gap-1 hover:text-[#FBBF24]">
                    Xem chi tiết <FeatherIcon icon="chevron-right" size={14} />
                  </button>
                </div>
              </div>

              {/* Reviews Section */}
              <div className="bg-[#050807] rounded-xl border border-white/[0.03] p-6 shadow-sm">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-lg font-black text-white flex items-center gap-2">
                    <FeatherIcon icon="star" size={18} className="text-amber-400" fill="currentColor" /> Đánh giá sản phẩm
                  </h3>
                  <div className="px-3 py-1 rounded bg-[#0d1412]/5 text-[11px] font-bold text-gray-400">2 đánh giá</div>
                </div>

                <div className="flex flex-col md:flex-row gap-10 mb-10 pb-10 border-b border-white/[0.03]">
                  <div className="flex flex-col items-center justify-center text-center">
                    <div className="text-5xl font-black text-white mb-2">4.0</div>
                    <div className="flex text-amber-400 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <FeatherIcon key={i} icon="star" size={20} fill={i < 4 ? 'currentColor' : 'none'} />
                      ))}
                    </div>
                    <div className="text-xs text-gray-400 font-bold">2 đánh giá</div>
                  </div>
                  <div className="flex-1 space-y-2">
                    {[5, 4, 3, 2, 1].map((star) => (
                      <div key={star} className="flex items-center gap-3">
                        <span className="text-xs font-bold text-gray-400 w-2">{star}</span>
                        <FeatherIcon icon="star" size={12} className="text-gray-300" />
                        <div className="flex-1 h-2 bg-[#0d1412]/5 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-amber-400"
                            style={{
                              width: star === 5 || star === 3 ? '50%' : '0%',
                              background: star === 3 ? '#FFB020' : star === 5 ? '#FFB020' : '#E5E7EB'
                            }}
                          />
                        </div>
                        <span className="text-xs font-bold text-gray-400 w-2">{star === 5 || star === 3 ? 1 : 0}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Review Items */}
                <div className="space-y-6">
                  {p.reviews.map((rev, i) => (
                    <div key={i} className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-[#0d1412]/5 flex items-center justify-center">
                            <FeatherIcon icon="user" size={18} className="text-gray-400" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-bold text-white">{rev.user}</span>
                              <span className="text-[10px] font-bold text-[#FBBF24] flex items-center gap-1">
                                <FeatherIcon icon="check-circle" size={10} fill="currentColor" /> {rev.status}
                              </span>
                            </div>
                            <div className="flex text-amber-400 mt-0.5">
                              {[...Array(5)].map((_, si) => (
                                <FeatherIcon key={si} icon="star" size={10} fill={si < rev.rating ? 'currentColor' : 'none'} />
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="text-xs text-gray-400 font-bold">{rev.date}</div>
                      </div>
                      <div className="pl-13">
                        <div className="px-3 py-1.5 rounded-lg bg-[#0d1412]/5 text-[10px] font-bold text-gray-400 w-fit mb-2">
                          {p.variations.find(v => v.id === 3)?.name}
                        </div>
                        <p className="text-sm text-gray-300 leading-relaxed italic">
                          "{rev.content}"
                        </p>
                        <button className="mt-4 flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 text-xs font-bold text-gray-400 hover:bg-white/5 dark:hover:bg-[#0d1412]/5">
                          <FeatherIcon icon="thumbs-up" size={14} /> Hữu ích
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN (SIDEBAR) */}
            <div className="w-full lg:w-80 shrink-0 space-y-6 lg:sticky lg:top-24">

              <div className="bg-[#050807] rounded-xl border border-white/[0.03] p-6 shadow-sm space-y-6">

                {/* Quantity */}
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-gray-300">Số lượng</span>
                  <div className="flex items-center bg-[#0d1412]/5 rounded-lg p-1">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white"
                    >-</button>
                    <div className="w-10 text-center text-sm font-black dark:text-white">{quantity}</div>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-10 h-full flex items-center justify-center bg-[#0d1412]/5 hover:bg-gray-100 dark:hover:bg-[#0d1412]/10 transition-colors border-l border-white/10"
                    >
                      <FeatherIcon icon="plus" size={14} />
                    </button>
                  </div>
                </div>

                {/* Order Info */}
                <div className="space-y-3">
                  <h3 className="text-sm font-bold text-white">Thông tin Order</h3>
                  <div className="italic text-[13px] text-gray-400 py-2">
                    Không có trường thông tin nào cần điền
                  </div>
                </div>

                {/* Promo Code */}
                <div className="relative group cursor-pointer border border-white/10 rounded-xl p-3 flex items-center justify-between hover:bg-white/5 dark:hover:bg-[#0d1412]/5 transition-all">
                  <div className="flex items-center gap-2 text-gray-300">
                    <FeatherIcon icon="credit-card" size={16} className="text-[#FBBF24]" />
                    <span className="text-sm font-bold">Bạn có mã giảm giá?</span>
                  </div>
                  <FeatherIcon icon="chevron-down" size={16} className="text-gray-400" />
                </div>

                {/* Summary */}
                <div className="flex flex-col gap-3 sticky bottom-0">
                  <div className="flex gap-2">
                    <button className="flex-[9] py-4 rounded-xl bg-gradient-to-r from-[#032030] to-[#FBBF24] dark:from-[#080d0c] dark:to-[#0a1411] !text-white text-sm font-black uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-[#253982] transition-all shadow-lg shadow-blue-900/10 active:scale-[0.98]">
                      <FeatherIcon icon="shopping-cart" size={18} fill="currentColor" />
                      Đặt hàng ngay
                    </button>

                    <button className="flex-[2] py-3.5 rounded-xl border border-white/10 text-gray-400 flex items-center justify-center hover:bg-white/5 active:scale-[0.98]">
                      <FeatherIcon icon="shopping-bag" size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── RELATED PRODUCTS ── */}
          <div className="mt-16 space-y-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gray-900 text-white flex items-center justify-center">
                  <FeatherIcon icon="layer" size={20} />
                </div>
                <h3 className="text-xl font-black text-white">Sản phẩm liên quan</h3>
              </div>
              <button className="px-5 py-2.5 rounded-lg bg-[#2D459D] text-white text-[11px] font-black uppercase tracking-widest flex items-center gap-2 hover:opacity-90">
                Xem tất cả <FeatherIcon icon="chevron-right" size={14} />
              </button>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {p.relatedProducts.map((rp) => (
                <div key={rp.id} className="group bg-[#050807] rounded-2xl border border-white/[0.03] overflow-hidden hover:shadow-xl transition-all cursor-pointer">
                  <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
                    <img src={rp.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={rp.name} />
                    <div className="absolute inset-0 bg-black/20" />
                    <div className="absolute bottom-3 left-3 right-3 flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-[#0d1412] p-1.5 shadow-lg">
                        <img src="https://logo.clearbit.com/openai.com" className="w-full h-full object-contain" alt="" />
                      </div>
                      <span className="text-[10px] font-black text-white drop-shadow truncate uppercase tracking-widest">{rp.name}</span>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="text-sm font-bold text-white mb-2 line-clamp-1">{rp.name}</div>
                    <div className="text-base font-black text-[#FF3B30]">{fmt(rp.price)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Mobile Sticky CTA */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#050807] border-t border-white/[0.03] p-4 py-3 flex items-center gap-3 shadow-2xl">
        <div className="flex-1">
          <div className="text-[10px] text-gray-400 font-bold uppercase">Tổng cộng</div>
          <div className="text-lg font-black text-[#FF3B30]">{fmt(p.price * quantity)}</div>
        </div>
        <button className="flex-[2] h-12 rounded-xl bg-gradient-to-r from-[#032030] to-[#FBBF24] dark:from-[#080d0c] dark:to-[#0a1411] text-white text-sm font-black uppercase tracking-wider flex items-center justify-center gap-2 active:scale-95">
          Đặt hàng ngay
        </button>
      </div>

    </HostingLayout>
  );
};

export default ProductMMODetailPage;
