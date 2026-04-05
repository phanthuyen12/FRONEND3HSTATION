import React, { useState, useEffect } from 'react';
import FeatherIcon from 'feather-icons-react';
import HostingLayout from '../layouts/HostingLayout';
import { elearningService } from '../../../config';
import { Course, Category } from '../../../services/elearningService';
import { Link } from 'react-router-dom';

const fmt = (n: any) => {
  if (n === 0 || n === '0' || n === 'Miễn phí') return 'Miễn phí';
  const num = typeof n === 'string' ? parseFloat(n) : n;
  if (isNaN(num)) return 'Liên hệ';
  return num.toLocaleString('vi-VN') + 'đ';
};

// ─── PRODUCT CARD (PREMIUM) ──────────────────────────────────────────────────
const CourseCard = ({ p, categories }: { p: Course, categories: Category[] }) => {
  const categoryName = categories.find(c => String(c.id) === String(p.category_id || p.categoryId))?.name || 'Khóa học';

  return (
    <Link
      to={`/landing-courses/${p.id}`}
      className="group relative flex flex-col rounded-[20px] overflow-hidden border border-white/[0.07] hover:border-white/20 transition-all duration-500 shadow-lg hover:shadow-2xl hover:-translate-y-1.5 "
    >
      {/* Cover image */}
      <div className="relative h-44 overflow-hidden">
        <img
          src={p.thumbnail || p.thumbnail_url || 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=600&auto=format&fit=crop&q=80'}
          alt={p.title}
          className="w-full h-full object-cover opacity-50 group-hover:opacity-75 group-hover:scale-105 transition-all duration-700"
        />
        {/* Gradient overlay */}
        <div
          className="absolute inset-0"
          style={{ background: `linear-gradient(180deg, transparent 30%, #000 100%)` }}
        />
        <div
          className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-[#00BA4A] text-white"
        >
          {categoryName}
        </div>
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col flex-grow gap-3">
        <h3 className="font-black text-white text-sm leading-snug group-hover:text-[#00ff9d] transition-colors duration-300 line-clamp-2">
          {p.title}
        </h3>
        <p className="text-[11px] text-gray-500 leading-relaxed line-clamp-2 flex-grow">{p.short_description || p.description}</p>

        {/* Stars + sold */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <FeatherIcon icon="star" size={12} className="text-amber-400" fill="currentColor" />
            <span className="text-[10px] text-gray-500 ml-0.5">{p.rating || '5.0'}</span>
          </div>
          <span className="text-[10px] text-gray-600 font-bold">
            {p.lessons || 0} Bài học
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
          className="mt-1 w-full py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest flex items-center justify-center transition-all duration-300 border border-[#00BA4A]/40 text-[#00BA4A] bg-[#00BA4A]/10 hover:bg-[#00BA4A] hover:text-black"
        >
          Học ngay
        </button>
      </div>
    </Link>
  );
};

// ─── PAGE ─────────────────────────────────────────────────────────────────────
const LandingCoursesPage = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('Tất cả');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [catsData, coursesData] = await Promise.all([
          elearningService.getClientCategories(),
          elearningService.getClientCourses({
            category: selectedCategory !== 'Tất cả' ? selectedCategory : undefined,
            search: search.trim() || undefined
          })
        ]);
        setCategories(catsData);
        setCourses(coursesData.data || []);
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
        <div className="relative bg-gradient-to-r from-[#032030] via-[#04333b] to-[#014e3b] border-y border-white/5">
          <div className="max-w-7xl mx-auto px-4 py-12 md:py-16">
            <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-tight !text-white">
              MMO <span className="text-[#00BA4A]">ACADEMY</span>
            </h1>
            <p className="text-sm md:text-base !text-white font-black uppercase tracking-[2px] border-l-4 border-[#00BA4A] pl-4 mt-4">
              Học tập thực chiến, kiến tạo tương lai số.
            </p>
          </div>
        </div>

        {/* ── Filters ─────────────────────────────────── */}
        <div className="container mx-auto px-4 md:px-6 py-6 border-b border-white/5">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory('Tất cả')}
                className={`px-4 py-2 rounded-[7px] text-[10px] font-black uppercase tracking-wider transition-all ${selectedCategory === 'Tất cả'
                  ? 'bg-[#00BA4A] text-[#000000] shadow-[0_4px_20px_rgba(0,186,74,0.3)]'
                  : 'bg-white/5 text-gray-400 border border-white/10 hover:border-white/20 hover:bg-[#00BA4A]/5'
                  }`}
              >
                Tất cả
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(String(cat.id))}
                  className={`px-4 py-2 rounded-[7px] text-[10px] font-black uppercase tracking-wider transition-all ${selectedCategory === String(cat.id)
                    ? 'bg-[#00BA4A] text-[#000000] shadow-[0_4px_20px_rgba(0,186,74,0.3)]'
                    : 'bg-white/5 text-gray-400 border border-white/10 hover:border-white/20 hover:bg-[#00BA4A]/5'
                    }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
            <div className="relative w-full md:w-72">
              <FeatherIcon icon="search" size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Tìm khóa học..."
                className="w-full bg-white/5 border border-white/10 rounded-full pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#00ff9d]/50 transition-all"
              />
            </div>
          </div>
        </div>

        {/* ── All Courses ─────────────────────────────────── */}
        <div className="container mx-auto px-4 md:px-6 py-12">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <div className="w-2 h-8 bg-[#00ff9d] rounded-full" />
              <h2 className="text-lg font-black ">Khám phá nội dung</h2>
            </div>
            <p className="text-sm text-gray-500">
              Hiển thị <span className="text-white font-black">{courses.length}</span> khóa học
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-64 rounded-[20px] bg-white/5 animate-pulse" />
              ))}
            </div>
          ) : courses.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
              {courses.map((p) => <CourseCard key={p.id} p={p} categories={categories} />)}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 gap-5">
              <div className="w-16 h-16 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center">
                <FeatherIcon icon="layers" size={26} className="text-gray-600" />
              </div>
              <p className="text-gray-400 font-black text-lg">Bạn chưa có khóa học nào trong danh mục này</p>
            </div>
          )}
        </div>

      </div>
    </HostingLayout>
  );
};

export default LandingCoursesPage;
