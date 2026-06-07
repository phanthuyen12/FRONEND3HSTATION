import React, { useState, useEffect } from 'react';
import FeatherIcon from 'feather-icons-react';
import HostingLayout from '../layouts/HostingLayout';
import toolKeyService from '../../../services/toolKeyService';
import { Link } from 'react-router-dom';

interface ToolPrice {
  id: number;
  label: string;
  duration_days: number;
  price: number;
}

interface ToolPackage {
  id: number;
  name: string;
  description: string;
  status: 'active' | 'inactive';
  prices: ToolPrice[];
}

const fmt = (n: any) => {
  const num = typeof n === 'string' ? parseFloat(n) : n;
  if (isNaN(num)) return '0đ';
  return num.toLocaleString('vi-VN') + 'đ';
};

// ─── PRODUCT CARD (PREMIUM) ──────────────────────────────────────────────────
const ToolCard = ({ p }: { p: ToolPackage }) => {
  const minPrice = p.prices && p.prices.length > 0 ? Math.min(...p.prices.map(pr => pr.price)) : 0;

  return (
    <Link
      to={`/landing-tool-detail/${p.id}`}
      className="group relative flex flex-col rounded-[20px] overflow-hidden border border-white/[0.07] hover:border-white/20 transition-all duration-500 shadow-[0_0_0_1px_rgba(255,255,255,0.02)] hover:-translate-y-1.5 "
    >
      {/* Cover image (Placeholder or generic tool icon) */}
      <div className="relative h-44 overflow-hidden bg-gradient-to-br from-gray-900 to-[#FBBF24]/20 flex items-center justify-center">
        <FeatherIcon icon="tool" size={48} className="text-[#FBBF24] opacity-50 group-hover:opacity-80 transition-all" />
        <div
          className="absolute inset-0"
          style={{ background: `linear-gradient(180deg, transparent 30%, #000 100%)` }}
        />
        <div
          className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-[#FBBF24] text-white"
        >
          LICENSE KEY
        </div>
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col flex-grow gap-3">
        <h3 className="font-black text-white text-sm leading-snug group-hover:text-[#FDE047] transition-colors duration-300 line-clamp-1">
          {p.name}
        </h3>
        <p className="text-[11px] text-gray-400 leading-relaxed line-clamp-2 flex-grow">{p.description}</p>

        {/* Info */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <span className="text-[10px] text-[#FBBF24] font-bold">● Tự động kích hoạt</span>
          </div>
          <span className="text-[10px] text-gray-400 font-bold">
            {p.prices?.length || 0} Gói sử dụng
          </span>
        </div>

        {/* Price */}
        <div>
          <p className="text-[10px] font-bold mb-0.5 text-gray-400">
            Khởi điểm từ
          </p>
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-black ">{fmt(minPrice)}</span>
          </div>
        </div>

        {/* CTA */}
        <button
          className="mt-1 w-full py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest flex items-center justify-center transition-all duration-300 border border-[#FBBF24]/40 text-[#FBBF24] bg-[#FBBF24]/10 hover:bg-[#FBBF24] hover:text-black"
        >
          Xem chi tiết
        </button>
      </div>
    </Link>
  );
};

// ─── PAGE ─────────────────────────────────────────────────────────────────────
const LandingToolsPage = () => {
  const [packages, setPackages] = useState<ToolPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const loadPackages = async () => {
      try {
        setLoading(true);
        const res = await toolKeyService.listPackages();
        if (res.success) {
          setPackages(res.data);
        }
      } catch (error) {
        console.error("Lỗi tải danh sách tools", error);
      } finally {
        setLoading(false);
      }
    };
    loadPackages();
  }, []);

  const filtered = packages.filter((p) => {
    return !search || p.name.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <HostingLayout>
      <div className="min-h-screen">

        {/* ── Hero ─────────────────────────────────────────── */}
        <div className="relative bg-gradient-to-r from-[#032030] via-[#04333b] to-[#014e3b] border-y border-white/[0.03]">
          <div className="max-w-7xl mx-auto px-4 py-12 md:py-16">
            <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-tight !text-white">
              MARKETING <span className="text-[#FBBF24]">TOOLS</span>
            </h1>
            <p className="text-sm md:text-base !text-white font-black uppercase tracking-[2px] border-l-4 border-[#FBBF24] pl-4 mt-4">
              Công cụ đỉnh cao, đột phá doanh thu MMO.
            </p>
          </div>
        </div>

        {/* ── Search Bar ─────────────────────────────────── */}
        <div className="container mx-auto px-4 md:px-6 py-4">
          <div className="flex flex-col sm:flex-row gap-3 bg-[#060a09]/80 backdrop-blur-xl p-3 rounded-2xl border border-white/[0.06] shadow-2xl">
            <div className="relative flex-1">
              <FeatherIcon icon="search" size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Tìm kiếm tools, phần mềm..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0d1412]/[0.04] border border-white/[0.07] text-white text-sm placeholder:text-gray-400 focus:outline-none focus:border-[#FDE047]/40 focus:bg-[#0d1412]/[0.06] transition-all"
              />
            </div>
          </div>
        </div>

        {/* ── All Tools ─────────────────────────────────── */}
        <div className="container mx-auto px-4 md:px-6 py-8">
          <div className="flex items-center justify-between mb-5">
            <p className="text-sm text-gray-400">
              Tìm thấy <span className="text-white font-black">{filtered.length}</span> công cụ phần mềm
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-5">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-64 rounded-[20px] bg-[#0d1412]/5 animate-pulse" />
              ))}
            </div>
          ) : filtered.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-5">
              {filtered.map((p) => <ToolCard key={p.id} p={p} />)}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 gap-5">
              <div className="w-16 h-16 rounded-2xl bg-[#0d1412]/[0.04] border border-white/10 flex items-center justify-center">
                <FeatherIcon icon="search" size={26} className="text-gray-400" />
              </div>
              <div className="text-center">
                <p className="text-gray-400 font-black text-lg">Không tìm thấy công cụ phù hợp</p>
              </div>
            </div>
          )}
        </div>

      </div>
    </HostingLayout>
  );
};

export default LandingToolsPage;
