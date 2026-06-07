import React, { useState, useEffect } from 'react';
import FeatherIcon from 'feather-icons-react';
import HostingLayout from '../layouts/HostingLayout';
import { workflowsService } from '../../../config';
import { Workflow, WorkflowCategory } from '../../../services/workflowsService';

const fmt = (n: any) => {
  const num = typeof n === 'string' ? parseFloat(n) : n;
  if (isNaN(num) || num === 0) return 'Miễn phí';
  return num.toLocaleString('vi-VN') + 'đ';
};

// ─── PRODUCT CARD (PREMIUM) ──────────────────────────────────────────────────
const ProductCard = ({ p, categories }: { p: Workflow, categories: WorkflowCategory[] }) => {
  const categoryName = categories.find(c => String(c.id) === String(p.category_id || p.categoryId))?.name || 'Workflow';

  return (
    <div
      onClick={() => window.location.href = `/landing-workflows/${p.id}`}
      className="group relative flex flex-col rounded-[20px] overflow-hidden border border-white/[0.07] hover:border-white/20 transition-all duration-500 shadow-[0_0_0_1px_rgba(255,255,255,0.02)] hover:-translate-y-1.5  cursor-pointer"
    >
      {/* Cover image */}
      <div className="relative h-44 overflow-hidden">
        <img
          src={p.image || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&auto=format&fit=crop&q=80'}
          alt={p.name}
          className="w-full h-full object-cover opacity-50 group-hover:opacity-75 group-hover:scale-105 transition-all duration-700"
        />
        {/* Gradient overlay */}
        <div
          className="absolute inset-0"
          style={{ background: `linear-gradient(180deg, transparent 30%, #000 100%)` }}
        />
        {/* Category pill */}
        <div
          className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-[#FBBF24] text-white"
        >
          {categoryName}
        </div>
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col flex-grow gap-3">
        <h3 className="font-black text-white text-sm leading-snug group-hover:text-[#FDE047] transition-colors duration-300 line-clamp-2">
          {p.name}
        </h3>
        <p className="text-[11px] text-gray-400 leading-relaxed line-clamp-2 flex-grow">{p.description}</p>

        {/* Stars + sold */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <svg key={i} className="w-3 h-3" viewBox="0 0 20 20" fill={i < 5 ? '#FACC15' : '#374151'}>
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
            <span className="text-[10px] text-gray-400 ml-0.5">5.0</span>
          </div>
          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">
            Premium Solution
          </span>
        </div>

        {/* Price */}
        <div>
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-black ">{fmt(p.price)}</span>
          </div>
        </div>

        {/* CTA */}
        <button
          className="mt-1 w-full py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest flex items-center justify-center transition-all duration-300 border border-[#FBBF24]/40 text-[#FBBF24] bg-[#FBBF24]/10 hover:bg-[#FBBF24] hover:text-black"
        >
          Chi tiết
        </button>
      </div>
    </div>
  );
};

// ─── PAGE ─────────────────────────────────────────────────────────────────────
const LandingWorkflowsPage = () => {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [categories, setCategories] = useState<WorkflowCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('Tất cả');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [catsData, wfData] = await Promise.all([
          workflowsService.fetchCategories(),
          workflowsService.fetchClientWorkflows({
            category: selectedCategory !== 'Tất cả' ? selectedCategory : undefined,
            search: search.trim() || undefined
          })
        ]);
        setCategories(catsData);
        setWorkflows(wfData.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [selectedCategory, search]);

  return (
    <HostingLayout>
      <div className="min-h-screen">

        {/* ── Hero ─────────────────────────────────────────── */}
        <div className="relative bg-gradient-to-r from-[#032030] via-[#04333b] to-[#014e3b] border-y border-white/[0.03]">
          <div className="max-w-7xl mx-auto px-4 py-12 md:py-16">
            <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-tight !text-white">
              N8N <span className="text-[#FBBF24]">WORKFLOWS</span>
            </h1>
            <p className="text-sm md:text-base !text-white font-black uppercase tracking-[2px] border-l-4 border-[#FBBF24] pl-4 mt-4">
              Tự động hóa quy trình, tối ưu hóa lợi nhuận.
            </p>
          </div>
        </div>

        {/* ── Filters ─────────────────────────────────── */}
        <div className="container mx-auto px-4 md:px-6 py-6 border-b border-white/[0.03]">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory('Tất cả')}
                className={`px-4 py-2 rounded-[7px] text-[10px] font-black uppercase tracking-wider transition-all ${selectedCategory === 'Tất cả'
                  ? 'bg-[#FBBF24] text-[#000000] shadow-[0_4px_20px_rgba(251,191,36,0.3)]'
                  : 'bg-[#0d1412]/5 text-gray-400 border border-white/10 hover:border-white/20 hover:bg-[#FBBF24]/5'
                  }`}
              >
                Tất cả
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(String(cat.id))}
                  className={`px-4 py-2 rounded-[7px] text-[10px] font-black uppercase tracking-wider transition-all ${selectedCategory === String(cat.id)
                    ? 'bg-[#FBBF24] text-[#000000] shadow-[0_4px_20px_rgba(251,191,36,0.3)]'
                    : 'bg-[#0d1412]/5 text-gray-400 border border-white/10 hover:border-white/20 hover:bg-[#FBBF24]/5'
                    }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
            <div className="relative w-full md:w-72">
              <FeatherIcon icon="search" size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Tìm workflow..."
                className="w-full bg-[#0d1412]/5 border border-white/10 rounded-full pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#FDE047]/50 transition-all"
              />
            </div>
          </div>
        </div>
        {/* ── Results ─────────────────────────────────── */}
        <div className="container mx-auto px-4 md:px-6 py-8">
          {/* Result header */}
          <div className="flex items-center justify-between mb-5">
            <p className="text-sm text-gray-400">
              Tìm thấy <span className="text-white font-black">{workflows.length}</span> giải pháp tự động hóa
            </p>
          </div>

          {/* Grid */}
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-5">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-64 rounded-[20px] bg-[#0d1412]/5 animate-pulse" />
              ))}
            </div>
          ) : workflows.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-5">
              {workflows.map((p) => <ProductCard key={p.id} p={p} categories={categories} />)}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 gap-5">
              <div className="w-16 h-16 rounded-2xl bg-[#0d1412]/[0.04] border border-white/10 flex items-center justify-center">
                <FeatherIcon icon="search" size={26} className="text-gray-400" />
              </div>
              <div className="text-center">
                <p className="text-gray-400 font-black text-lg">Không tìm thấy workflow</p>
                <p className="text-gray-400 text-sm mt-1">Thử thay đổi bộ lọc hoặc từ khoá tìm kiếm</p>
              </div>
            </div>
          )}
        </div>

      </div>
    </HostingLayout>
  );
};

export default LandingWorkflowsPage;
