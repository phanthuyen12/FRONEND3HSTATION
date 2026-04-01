import React, { useState } from 'react';
import FeatherIcon from 'feather-icons-react';
import HostingLayout from '../layouts/HostingLayout';

// ─── BRANDS ─────────────────────────────────────────────────────────────────
const brands = [
  { name: 'Duolingo',      logo: 'https://logo.clearbit.com/duolingo.com',      accent: '#58CC02' },
  { name: 'Grammarly',     logo: 'https://logo.clearbit.com/grammarly.com',     accent: '#15c39a' },
  { name: 'Quizlet',       logo: 'https://logo.clearbit.com/quizlet.com',       accent: '#4255FF' },
  { name: 'Datacamp',      logo: 'https://logo.clearbit.com/datacamp.com',      accent: '#03EF62' },
  { name: 'QuillBot',      logo: 'https://logo.clearbit.com/quillbot.com',      accent: '#00A67E' },
  { name: 'Mate',          logo: 'https://logo.clearbit.com/gikken.co',         accent: '#FF6B35' },
  { name: 'HelloChinese',  logo: 'https://logo.clearbit.com/hellochinese.cc',   accent: '#E84B3A' },
  { name: 'Busuu',         logo: 'https://logo.clearbit.com/busuu.com',         accent: '#00B4D8' },
  { name: 'Coursera',      logo: 'https://logo.clearbit.com/coursera.org',      accent: '#0056D2' },
  { name: 'Turnitin',      logo: 'https://logo.clearbit.com/turnitin.com',      accent: '#E9002D' },
  { name: 'Mathway',       logo: 'https://logo.clearbit.com/mathway.com',       accent: '#A020F0' },
  { name: 'LinkedIn',      logo: 'https://logo.clearbit.com/linkedin.com',      accent: '#0A66C2' },
  { name: 'JetBrains',     logo: 'https://logo.clearbit.com/jetbrains.com',     accent: '#FF318C' },
  { name: 'Ginger',        logo: 'https://logo.clearbit.com/gingersoftware.com',accent: '#FF7A00' },
  { name: 'Monkey',        logo: 'https://logo.clearbit.com/monkey.edu.vn',     accent: '#F5A623' },
];

// ─── CATEGORIES ─────────────────────────────────────────────────────────────
const categories = [
  { label: 'Tất cả' },
  { label: 'Học ngoại ngữ' },
  { label: 'Lập trình' },
  { label: 'Thiết kế' },
  { label: 'Marketing' },
  { label: 'Văn phòng' },
];

// ─── PRODUCTS ────────────────────────────────────────────────────────────────
const products = [
  {
    id: 1, name: 'Duolingo Super', brand: 'Duolingo', category: 'Học ngoại ngữ',
    logo: 'https://logo.clearbit.com/duolingo.com',
    cover: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=600&auto=format&fit=crop&q=80',
    accent: '#58CC02', dark: '#0d1f05',
    discount: 84, originalPrice: 1200000, price: 19000,
    tag: 'HOT', tagColor: '#58CC02', sold: 2841, rating: 4.9,
    desc: 'Học ngôn ngữ mới hiệu quả với phương pháp gamification hàng đầu thế giới.',
  },
  {
    id: 2, name: 'Grammarly Premium', brand: 'Grammarly', category: 'Văn phòng',
    logo: 'https://logo.clearbit.com/grammarly.com',
    cover: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=600&auto=format&fit=crop&q=80',
    accent: '#15c39a', dark: '#051a14',
    discount: 73, originalPrice: 3200000, price: 89000,
    tag: 'BÁN CHẠY', tagColor: '#15c39a', sold: 1920, rating: 4.8,
    desc: 'Trợ lý viết AI mạnh mẽ, sửa ngữ pháp và nâng cao văn phong tức thì.',
  },
  {
    id: 3, name: 'Quizlet Plus', brand: 'Quizlet', category: 'Học ngoại ngữ',
    logo: 'https://logo.clearbit.com/quizlet.com',
    cover: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&auto=format&fit=crop&q=80',
    accent: '#4255FF', dark: '#060818',
    discount: 62, originalPrice: 1050000, price: 399000,
    tag: 'PHỔ BIẾN', tagColor: '#4255FF', sold: 3102, rating: 4.7,
    desc: 'Flashcard thông minh, học hiệu quả với AI và các bộ thẻ khổng lồ.',
  },
  {
    id: 4, name: 'Datacamp Premium', brand: 'Datacamp', category: 'Lập trình',
    logo: 'https://logo.clearbit.com/datacamp.com',
    cover: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&auto=format&fit=crop&q=80',
    accent: '#03EF62', dark: '#041a0d',
    discount: 77, originalPrice: 8800000, price: 199000,
    tag: 'GIÁ TỐT', tagColor: '#03EF62', sold: 876, rating: 4.9,
    desc: 'Học Data Science, Python, SQL với hơn 380+ khóa học thực hành chuyên sâu.',
  },
  {
    id: 5, name: 'QuillBot Premium', brand: 'QuillBot', category: 'Văn phòng',
    logo: 'https://logo.clearbit.com/quillbot.com',
    cover: 'https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?w=600&auto=format&fit=crop&q=80',
    accent: '#00A67E', dark: '#041410',
    discount: 68, originalPrice: 2400000, price: 79000,
    tag: 'HOT', tagColor: '#00A67E', sold: 2210, rating: 4.8,
    desc: 'Paraphrase và tóm tắt văn bản thông minh với AI tiên tiến nhất.',
  },
  {
    id: 6, name: 'Coursera Plus', brand: 'Coursera', category: 'Lập trình',
    logo: 'https://logo.clearbit.com/coursera.org',
    cover: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80',
    accent: '#0056D2', dark: '#04081a',
    discount: 55, originalPrice: 12000000, price: 549000,
    tag: 'CAO CẤP', tagColor: '#0056D2', sold: 432, rating: 4.6,
    desc: 'Truy cập không giới hạn 7000+ khóa học từ các ĐH hàng đầu thế giới.',
  },
  {
    id: 7, name: 'JetBrains All Products', brand: 'JetBrains', category: 'Lập trình',
    logo: 'https://logo.clearbit.com/jetbrains.com',
    cover: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=80',
    accent: '#FF318C', dark: '#1a040e',
    discount: 90, originalPrice: 14000000, price: 149000,
    tag: 'SỐC', tagColor: '#FF318C', sold: 1650, rating: 4.9,
    desc: 'Trọn bộ IDE chuyên nghiệp cho mọi ngôn ngữ: IntelliJ, WebStorm, PyCharm…',
  },
  {
    id: 8, name: 'LinkedIn Premium', brand: 'LinkedIn', category: 'Marketing',
    logo: 'https://logo.clearbit.com/linkedin.com',
    cover: 'https://images.unsplash.com/photo-1611944212129-29977ae1398c?w=600&auto=format&fit=crop&q=80',
    accent: '#0A66C2', dark: '#040c18',
    discount: 60, originalPrice: 5500000, price: 219000,
    tag: 'TRENDING', tagColor: '#0A66C2', sold: 987, rating: 4.7,
    desc: 'Mở khóa InMail, xem ai đã xem profile và các công cụ networking cao cấp.',
  },
];

const fmt = (n: number) => n.toLocaleString('vi-VN') + 'đ';

// ─── PRODUCT CARD (PREMIUM) ──────────────────────────────────────────────────
const ProductCard = ({ p }: { p: typeof products[0] }) => (
  <div
    className="group relative flex flex-col rounded-[20px] overflow-hidden border border-white/[0.07] hover:border-white/20 transition-all duration-500 shadow-lg hover:shadow-2xl hover:-translate-y-1.5 bg-[#060a09]"
  >
    {/* Cover image */}
    <div className="relative h-44 overflow-hidden">
      <img
        src={p.cover}
        alt={p.name}
        className="w-full h-full object-cover opacity-50 group-hover:opacity-75 group-hover:scale-105 transition-all duration-700"
      />
      {/* Gradient overlay */}
      <div
        className="absolute inset-0"
        style={{ background: `linear-gradient(180deg, transparent 30%, ${p.dark} 100%)` }}
      />
      {/* Discount pill */}
      <div
        className="absolute top-3 right-3 flex items-center justify-center px-2.5 py-1 rounded-full text-[10px] font-black shadow-lg backdrop-blur-md"
        style={{ background: `${p.accent}22`, border: `1px solid ${p.accent}60`, color: p.accent }}
      >
        -{p.discount}%
      </div>
      {/* Tag pill */}
      <div
        className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest"
        style={{ background: p.tagColor, color: '#fff' }}
      >
        {p.tag}
      </div>
      {/* Brand logo floating */}
      <div className="absolute bottom-3 left-3 flex items-center gap-2">
        <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center shadow-xl overflow-hidden border-2 border-white/20 flex-shrink-0">
          <img
            src={p.logo}
            alt={p.brand}
            className="w-7 h-7 object-contain"
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
          />
        </div>
        <span className="text-xs font-black text-white/90 drop-shadow">{p.brand}</span>
      </div>
    </div>

    {/* Body */}
    <div className="p-4 flex flex-col flex-grow gap-3">
      <h3 className="font-black text-white text-sm leading-snug group-hover:text-[#00ff9d] transition-colors duration-300 line-clamp-1">
        {p.name}
      </h3>
      <p className="text-[11px] text-gray-500 leading-relaxed line-clamp-2 flex-grow">{p.desc}</p>

      {/* Stars + sold */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <svg key={i} className="w-3 h-3" viewBox="0 0 20 20" fill={i < Math.floor(p.rating) ? '#FACC15' : '#374151'}>
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
            </svg>
          ))}
          <span className="text-[10px] text-gray-500 ml-0.5">{p.rating}</span>
        </div>
        <span className="text-[10px] text-gray-600 font-bold">
          Đã bán {p.sold.toLocaleString()}
        </span>
      </div>

      {/* Price */}
      <div>
        <p className="text-[10px] font-bold mb-0.5" style={{ color: p.accent }}>
          Giảm đến {p.discount}%
        </p>
        <div className="flex items-baseline gap-2">
          <span className="text-xl font-black text-white">{fmt(p.price)}</span>
          <span className="text-xs text-gray-600 line-through">{fmt(p.originalPrice)}</span>
        </div>
      </div>

      {/* CTA */}
      <button
        className="mt-1 w-full py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest flex items-center justify-center transition-all duration-300 border"
        style={{
          border: `1px solid ${p.accent}40`,
          color: p.accent,
          background: `${p.accent}0d`,
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.background = p.accent;
          (e.currentTarget as HTMLButtonElement).style.color = '#060a09';
          (e.currentTarget as HTMLButtonElement).style.boxShadow = `0 0 24px ${p.accent}50`;
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.background = `${p.accent}0d`;
          (e.currentTarget as HTMLButtonElement).style.color = p.accent;
          (e.currentTarget as HTMLButtonElement).style.boxShadow = 'none';
        }}
      >
        Mua ngay
      </button>
    </div>
  </div>
);

// ─── PAGE ─────────────────────────────────────────────────────────────────────
const LandingCoursesPage = () => {
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('Tất cả');
  const [search, setSearch] = useState('');

  const filtered = products.filter((p) => {
    const matchBrand = !selectedBrand || p.brand === selectedBrand;
    const matchCat = selectedCategory === 'Tất cả' || p.category === selectedCategory;
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase());
    return matchBrand && matchCat && matchSearch;
  });

  return (
    <HostingLayout>
      <div className="min-h-screen">

        {/* ── Hero ─────────────────────────────────────────── */}
        <div className="relative pt-8 pb-12 overflow-hidden">
          <div className="absolute inset-0 -z-10 pointer-events-none">
            <div className="absolute top-0 left-1/4 w-[500px] h-[400px] bg-[#00ff9d]/8 rounded-full blur-[140px]" />
            <div className="absolute bottom-0 right-1/4 w-[400px] h-[300px] bg-blue-600/6 rounded-full blur-[120px]" />
          </div>
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
              <div className="space-y-4 max-w-xl">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#00ff9d]/10 border border-[#00ff9d]/20 text-[10px] font-black uppercase tracking-widest text-[#00ff9d]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00ff9d] animate-pulse" />
                  Thư viện Khoá học — giảm đến 90%
                </div>
                <h1 className="text-3xl md:text-5xl xl:text-6xl font-extrabold tracking-tight leading-[1.08]">
                  Khoá học{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00ff9d] to-blue-400">Premium</span>
                  <br />
                  <span className="text-white">chất lượng cao</span>
                </h1>
                <p className="text-gray-400 text-sm md:text-base leading-relaxed max-w-lg">
                  Hơn 50+ tài khoản &amp; phần mềm chính hãng được kiểm duyệt kỹ càng.
                  Bảo hành trọn đời, hỗ trợ 24/7.
                </p>
                <div className="flex flex-wrap gap-3 pt-2">
                  <button className="px-8 py-3.5 bg-gradient-to-r from-[#00ff9d] to-[#01c67c] text-[#060a09] font-black text-xs rounded-full uppercase tracking-wider hover:shadow-[0_0_30px_rgba(0,255,157,0.45)] hover:-translate-y-0.5 transition-all duration-300">
                    Xem tất cả sản phẩm
                  </button>
                  <button className="px-7 py-3.5 rounded-full border border-[rgba(255,255,255,0.1)] text-white/70 text-xs font-black uppercase tracking-wider hover:border-[#00ff9d]/40 hover:text-white hover:bg-[#00ff9d]/5 transition-all duration-300">
                    Chính sách bảo hành
                  </button>
                </div>
              </div>
              {/* Stats cards */}
              <div className="flex gap-4">
                {[
                  { value: '50+', label: 'Sản phẩm', color: '#00ff9d' },
                  { value: '18K+', label: 'Đã bán', color: '#60a5fa' },
                  { value: '5K+', label: 'Khách hàng', color: '#f472b6' },
                ].map((s) => (
                  <div
                    key={s.label}
                    className="flex flex-col items-center justify-center text-center bg-[#050807] border border-[rgba(255,255,255,0.06)] rounded-2xl w-24 h-24 gap-1 hover:border-[rgba(255,255,255,0.15)] transition-all duration-300"
                  >
                    <span className="text-2xl font-black leading-none" style={{ color: s.color }}>{s.value}</span>
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">{s.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Brand Picker ─────────────────────────────────── */}
        <div className="container mx-auto px-4 md:px-6 py-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-black text-white leading-none">Chọn sản phẩm bạn quan tâm</h2>
              <p className="text-[11px] text-gray-500 mt-1">Click vào thương hiệu để lọc sản phẩm</p>
            </div>
            {selectedBrand && (
              <button
                onClick={() => setSelectedBrand(null)}
                className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[11px] text-gray-400 hover:text-white hover:border-white/20 transition-all font-bold"
              >
                <FeatherIcon icon="x" size={11} />
                Bỏ lọc
              </button>
            )}
          </div>

          <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-15 gap-2.5"
            style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(88px, 1fr))' }}
          >
            {brands.map((b) => {
              const isActive = selectedBrand === b.name;
              return (
                <button
                  key={b.name}
                  onClick={() => setSelectedBrand(isActive ? null : b.name)}
                  className="group relative flex flex-col items-center justify-center gap-2.5 py-4 px-3 rounded-2xl border transition-all duration-300 hover:-translate-y-0.5"
                  style={{
                    background: isActive ? `${b.accent}12` : 'rgba(8,13,12,1)',
                    borderColor: isActive ? `${b.accent}60` : 'rgba(255,255,255,0.07)',
                    boxShadow: isActive ? `0 0 20px ${b.accent}25` : 'none',
                  }}
                >
                  {/* Logo */}
                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-md overflow-hidden flex-shrink-0">
                    <img
                      src={b.logo}
                      alt={b.name}
                      className="w-8 h-8 object-contain"
                      onError={(e) => {
                        const el = e.target as HTMLImageElement;
                        el.style.display = 'none';
                        const parent = el.parentElement;
                        if (parent) {
                          parent.style.background = b.accent;
                          parent.innerHTML = `<span style="color:white;font-weight:900;font-size:16px">${b.name[0]}</span>`;
                        }
                      }}
                    />
                  </div>
                  <span
                    className="text-[9px] font-bold text-center leading-tight line-clamp-1 transition-colors duration-200"
                    style={{ color: isActive ? b.accent : 'rgb(156,163,175)' }}
                  >
                    {b.name}
                  </span>
                  {/* Active dot */}
                  {isActive && (
                    <span
                      className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full"
                      style={{ background: b.accent }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Best Sellers ─────────────────────────────────── */}
        <div className="container mx-auto px-4 md:px-6 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-black text-white leading-none">Sản phẩm bán chạy</h2>
              <p className="text-[11px] text-gray-500 mt-1">Được hàng nghìn khách hàng tin dùng.</p>
            </div>
            <button className="hidden md:flex items-center text-[11px] font-black text-gray-500 hover:text-[#00ff9d] transition-colors uppercase tracking-widest">
              Xem tất cả
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {products.slice(0, 5).map((p) => <ProductCard key={p.id} p={p} />)}
          </div>
        </div>

        {/* ── All Products ─────────────────────────────────── */}
        <div className="container mx-auto px-4 md:px-6 py-8">
          {/* Sticky filter bar */}
          <div className="sticky top-4 z-10 flex flex-col sm:flex-row gap-3 mb-8 bg-[#060a09]/80 backdrop-blur-xl p-3 rounded-2xl border border-white/[0.06] shadow-2xl">
            {/* Search */}
            <div className="relative flex-1">
              <FeatherIcon icon="search" size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Tìm sản phẩm..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.07] text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-[#00ff9d]/40 focus:bg-white/[0.06] transition-all"
              />
            </div>
            {/* Category pills */}
            <div className="flex flex-wrap gap-2 items-center">
              {categories.map((cat) => (
                <button
                  key={cat.label}
                  onClick={() => setSelectedCategory(cat.label)}
                  className={`px-4 py-2 rounded-[10px] text-[10px] font-black uppercase tracking-wider transition-all duration-300 ${
                    selectedCategory === cat.label
                      ? 'bg-gradient-to-r from-[#00ff9d] to-[#01c67c] text-[#060a09] shadow-[0_4px_20px_rgba(0,255,157,0.25)]'
                      : 'text-gray-500 hover:text-white hover:bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.05)]'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Result header */}
          <div className="flex items-center justify-between mb-5">
            <p className="text-sm text-gray-500">
              Tìm thấy <span className="text-white font-black">{filtered.length}</span> sản phẩm
              {selectedBrand && <span className="text-[#00ff9d]"> · {selectedBrand}</span>}
            </p>
            <div className="flex items-center gap-2 text-[11px] text-gray-600 font-bold border border-white/[0.06] rounded-xl px-3 py-2 bg-[#080d0c] cursor-pointer hover:border-white/15 transition-all">
              <FeatherIcon icon="sliders" size={12} />
              Bán chạy nhất
            </div>
          </div>

          {/* Grid */}
          {filtered.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-5">
              {filtered.map((p) => <ProductCard key={p.id} p={p} />)}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 gap-5">
              <div className="w-16 h-16 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center">
                <FeatherIcon icon="search" size={26} className="text-gray-600" />
              </div>
              <div className="text-center">
                <p className="text-gray-400 font-black text-lg">Không tìm thấy sản phẩm</p>
                <p className="text-gray-600 text-sm mt-1">Thử thay đổi bộ lọc hoặc từ khoá tìm kiếm</p>
              </div>
              <button
                onClick={() => { setSearch(''); setSelectedCategory('Tất cả'); setSelectedBrand(null); }}
                className="px-6 py-2.5 rounded-full bg-[#00ff9d]/10 border border-[#00ff9d]/20 text-[#00ff9d] text-xs font-black uppercase tracking-widest hover:bg-[#00ff9d]/20 transition-all"
              >
                Xoá tất cả bộ lọc
              </button>
            </div>
          )}
        </div>

        {/* ── Trust / Guarantee Banner ─────────────────────── */}
        <div className="container mx-auto px-4 md:px-6 py-10 mb-8">
          <div className="relative rounded-[28px] border border-white/[0.07] overflow-hidden p-8 md:p-12 bg-[#060a09]">
            {/* Decorative bg */}
            <div className="absolute inset-0 -z-10 pointer-events-none">
              <div className="absolute -top-24 -right-24 w-72 h-72 bg-[#00ff9d]/8 rounded-full blur-[100px]" />
              <div className="absolute -bottom-16 -left-16 w-56 h-56 bg-blue-600/6 rounded-full blur-[80px]" />
              <div
                className="absolute inset-0 opacity-[0.03]"
                style={{
                  backgroundImage: 'linear-gradient(#00ff9d 1px, transparent 1px), linear-gradient(90deg, #00ff9d 1px, transparent 1px)',
                  backgroundSize: '40px 40px',
                }}
              />
            </div>

            <div className="relative flex flex-col md:flex-row items-center justify-between gap-12">
              <div className="space-y-4 max-w-md">
                <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-[#00ff9d]/10 border border-[#00ff9d]/20 text-[10px] font-black uppercase tracking-widest text-[#00ff9d]">
                  Cam kết chất lượng
                </div>
                <h3 className="text-3xl md:text-4xl font-extrabold text-white leading-tight mt-2">
                  Bảo hành{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00ff9d] to-blue-400">
                    trọn đời
                  </span>
                  <br />— không lo rủi ro
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed mt-2">
                  Mua một lần, dùng mãi mãi. Tất cả sản phẩm đều được bảo hành không giới hạn thời gian. Đội ngũ kỹ thuật hỗ trợ xuyên suốt.
                </p>
                <div className="pt-4">
                  <button className="px-8 py-3.5 bg-gradient-to-r from-[#00ff9d] to-[#01c67c] text-[#060a09] font-black text-xs rounded-full uppercase tracking-wider hover:shadow-[0_0_30px_rgba(0,255,157,0.4)] hover:-translate-y-0.5 transition-all duration-300">
                    Mua ngay — giảm đến 90%
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {[
                  { label: 'Bảo hành', value: 'Vĩnh viễn', color: '#00ff9d' },
                  { label: 'Hỗ trợ', value: '24/7', color: '#60a5fa' },
                  { label: 'Hoàn tiền', value: '100%', color: '#f472b6' },
                ].map((s) => (
                  <div
                    key={s.label}
                    className="flex flex-col items-center justify-center text-center p-6 rounded-3xl border bg-[#050807] transition-all hover:bg-[#060a09]"
                    style={{ borderColor: `${s.color}20` }}
                  >
                    <p className="text-2xl font-black mb-1 leading-none" style={{ color: s.color }}>{s.value}</p>
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>
    </HostingLayout>
  );
};

export default LandingCoursesPage;
