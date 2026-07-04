import React, { useState, useEffect } from 'react';
import HostingLayout from '../layouts/HostingLayout';
import FeatherIcon from 'feather-icons-react';
import { useTheme } from '../context/ThemeContext';
import { elearningService, API_URL } from '../../../config';
import { Link } from 'react-router-dom';

const MyCoursesPage = () => {
    const { isDark } = useTheme();
    const [courses, setCourses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    useEffect(() => {
        const fetchMyCourses = async () => {
            try {
                const data = await elearningService.getMyCourses();
                // Map the API data to our UI structure
                const items = (data || []).map((item: any) => ({
                    id: item.course_id || item.course?.id || item.id,
                    title: item.course?.title || item.title || 'Khóa học không tên',
                    thumbnail: item.course?.thumbnail_url || item.course?.thumbnail || item.thumbnail_url || item.thumbnail || null,
                    lessons: item.total_lessons || item.course?.lessons || item.lessons || 0,
                    progress: Number(item.progress ?? item.completion_percent ?? 0),
                    category: item.course?.category_name || item.course?.category?.name || item.category_name || item.category || 'Học tập',
                    instructor: item.course?.instructor?.name || item.instructor || '3H Station',
                    lastAccessed: (item.last_watched_at || item.updated_at) ? new Date(item.last_watched_at || item.updated_at).toLocaleDateString() : 'Vừa mới đây'
                }));
                setCourses(items);
            } catch (error) {
                console.error('Error fetching my courses:', error);
                // Fallback for demo
                setCourses([
                    { id: 10, title: 'Làm chủ VPS và Server Linux cho người mới', thumbnail: null, lessons: 24, progress: 65, category: 'Hệ thống', instructor: 'Phan Thuyên', lastAccessed: '01/04/2026' },
                    { id: 11, title: 'Auto Facebook Marketing Masterclass', thumbnail: null, lessons: 15, progress: 10, category: 'Marketing', instructor: 'Admin 3H', lastAccessed: '03/04/2026' },
                    { id: 12, title: 'Xây dựng hệ thống Proxy dân cư riêng biệt', thumbnail: null, lessons: 8, progress: 100, category: 'Kỹ thuật', instructor: 'Tech Team', lastAccessed: '20/03/2026' },
                    { id: 13, title: 'Hướng dẫn chạy Ads Facebook từ A-Z', thumbnail: null, lessons: 32, progress: 73, category: 'Marketing', instructor: 'Admin 3H', lastAccessed: '04/04/2026' },
                    { id: 14, title: 'Tối ưu hóa Windows cho MMO', thumbnail: null, lessons: 12, progress: 45, category: 'Cơ bản', instructor: '3H Support', lastAccessed: '05/04/2026' },
                    { id: 15, title: 'Python cho dân Kỹ thuật', thumbnail: null, lessons: 28, progress: 0, category: 'Lập trình', instructor: 'Tech Expert', lastAccessed: 'Mới đăng ký' }
                ]);
            } finally {
                setLoading(false);
            }
        };
        fetchMyCourses();
    }, []);

    const filteredCourses = courses.filter(c => {
        if (activeTab === 'all') return true;
        if (activeTab === 'learning') return c.progress < 100;
        if (activeTab === 'completed') return c.progress === 100;
        return true;
    });

    const totalPages = Math.ceil(filteredCourses.length / itemsPerPage);
    const paginatedCourses = filteredCourses.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    useEffect(() => {
        setCurrentPage(1);
    }, [activeTab]);

    return (
        <HostingLayout>
            <div className="bg-[#060b0a] min-h-screen pb-24 overflow-x-hidden pt-12 md:pt-14">
                {/* Breadcrumb Navigation */}
                <div className="max-w-7xl mx-auto px-4 py-3">
                    <nav className="flex items-center gap-3 text-[10px] md:text-[11px] font-black uppercase tracking-[2px]">
                        <Link to="/" className="text-gray-400 hover:text-[#FBBF24] flex items-center gap-1.5 transition-colors">
                            <FeatherIcon icon="home" size={12} />
                            Trang chủ
                        </Link>
                        <FeatherIcon icon="chevron-right" size={10} className="text-gray-300" />
                        <Link to="/landing-courses" className="text-gray-400 hover:text-[#FBBF24] transition-colors">Khóa học</Link>
                        <FeatherIcon icon="chevron-right" size={10} className="text-gray-300" />
                        <span className="text-white">Khóa học của tôi</span>
                    </nav>
                </div>

                {/* Hero section */}
                <div className="relative bg-gradient-to-r from-[#0d1412] to-[#1a2624] border-b border-white/[0.03] py-12">
                    <div className="max-w-7xl mx-auto px-4 relative z-10">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div className="space-y-2">
                                <h1 className="text-4xl md:text-5xl font-black !text-white uppercase tracking-tighter leading-none">
                                    KHÓA HỌC <span className="text-[#FBBF24]">CỦA TÔI</span>
                                </h1>
                                <p className="text-[11px] font-bold !text-white/50 uppercase tracking-[2px]">
                                    Nâng cao kỹ năng mỗi ngày cùng đội ngũ chuyên gia 3HSTATION
                                </p>
                            </div>
                        </div>
                    </div>
                    {/* Decorative element */}
                    <div className="absolute top-0 right-0 h-full w-1/3 bg-gradient-to-l from-[#FBBF24]/10 to-transparent"></div>
                    <FeatherIcon icon="book-open" size={160} className="absolute -right-10 -bottom-10 text-white/5 rotate-12" />
                </div>

                <div className="max-w-7xl mx-auto px-4 py-12">
                    {/* Tabs */}
                    <div className="flex items-center gap-2 mb-10 overflow-x-auto pb-2 scrollbar-hide">
                        {[
                            { id: 'all', label: 'Tất cả', icon: 'grid' },
                            { id: 'learning', label: 'Đang học', icon: 'clock' },
                            { id: 'completed', label: 'Hoàn thành', icon: 'check-circle' }
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-6 py-3 rounded-[10px] text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-[#FBBF24] text-white shadow-lg shadow-[#FBBF24]/20' : 'bg-[#0d1412]/5 text-gray-400 hover:text-white dark:hover:text-white border border-white/[0.03]'}`}
                            >
                                <FeatherIcon icon={tab.icon} size={12} />
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {loading ? (
                        <div className="py-24 flex flex-col items-center justify-center gap-4 opacity-50">
                            <div className="w-12 h-12 border-4 border-[#FBBF24] border-t-transparent rounded-full animate-spin"></div>
                            <p className="text-xs font-black uppercase tracking-widest">Đang tải danh sách...</p>
                        </div>
                    ) : paginatedCourses.length === 0 ? (
                        <div className="py-32 flex flex-col items-center justify-center text-center bg-[#0d1412] rounded-[10px] border border-dashed border-white/10">
                            <div className="w-20 h-20 bg-[#0d1412]/5 rounded-full flex items-center justify-center mb-6 text-gray-300">
                                <FeatherIcon icon="layers" size={40} />
                            </div>
                            <h3 className="text-xl font-black dark:text-white uppercase mb-2">Chưa có khóa học nào</h3>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-8">Bạn chưa đăng ký khóa học nào trong mục này</p>
                            <Link to="/landing-courses" className="px-8 py-4 bg-[#FBBF24] text-white rounded-[10px] font-black uppercase text-[11px] tracking-widest hover:scale-105 transition-all shadow-lg shadow-[#FBBF24]/20">
                                Xem tất cả khóa học
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {paginatedCourses.map(course => (
                                <div key={course.id} className="bg-[#0d1412] rounded-[10px] overflow-hidden border border-white/[0.03] shadow-sm group hover:shadow-xl hover:shadow-[#FBBF24]/5 transition-all duration-500 flex flex-col">
                                    {/* Thumbnail on Top */}
                                    <div className="aspect-video relative overflow-hidden flex-shrink-0">
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                        {course.thumbnail ? (
                                            <img 
                                                src={course.thumbnail.startsWith('http') ? course.thumbnail : `${API_URL}${course.thumbnail}`} 
                                                alt={course.title}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-[#0d1412]/5 flex items-center justify-center">
                                                <FeatherIcon icon="image" size={32} className="text-gray-300" />
                                            </div>
                                        )}
                                        <div className="absolute top-4 left-4 z-20 px-3 py-1 bg-[#FBBF24] text-white text-[9px] font-black uppercase rounded-full shadow-lg">
                                            {course.category}
                                        </div>
                                    </div>

                                    {/* Info Content */}
                                    <div className="p-6 flex flex-col flex-grow">
                                        <div className="flex-grow space-y-4">
                                            <div className="flex items-center gap-2 text-[8px] font-black text-gray-400 uppercase tracking-[2px]">
                                                <FeatherIcon icon="user" size={10} />
                                                GIẢNG VIÊN: {course.instructor}
                                            </div>
                                            <h3 className="text-[14px] font-black dark:text-white uppercase leading-tight group-hover:text-[#FBBF24] transition-colors line-clamp-2 h-10">
                                                {course.title}
                                            </h3>
                                            
                                            <div className="flex items-center justify-between py-2 border-y border-white/[0.03]">
                                                <div className="flex items-center gap-1.5 text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                                                    <FeatherIcon icon="play-circle" size={12} className="text-[#FBBF24]" />
                                                    {course.lessons} Bài học
                                                </div>
                                                <div className="flex items-center gap-1.5 text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                                                    <FeatherIcon icon="clock" size={12} className="text-[#FBBF24]" />
                                                    {course.lastAccessed}
                                                </div>
                                            </div>

                                            {/* Progress bar */}
                                            <div className="space-y-2">
                                                <div className="flex justify-between items-end">
                                                    <span className="text-[9px] font-black uppercase tracking-widest dark:text-gray-400">Tiến độ</span>
                                                    <span className="text-[11px] font-black text-[#FBBF24]">{course.progress}%</span>
                                                </div>
                                                <div className="h-1.5 bg-[#0d1412]/5 rounded-full overflow-hidden">
                                                    <div 
                                                        className="h-full bg-[#FBBF24] rounded-full transition-all duration-1000" 
                                                        style={{ width: `${course.progress}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-8 flex items-center gap-3">
                                            <Link 
                                                to={`/landing-courses/${course.id}`}
                                                className="flex-grow py-3 bg-[#FBBF24] hover:bg-[#F59E0B] text-white text-center rounded-[10px] font-black text-[10px] uppercase tracking-widest transition-all shadow-lg shadow-[#FBBF24]/20 active:scale-95"
                                            >
                                                VÀO HỌC NGAY
                                            </Link>
                                            <button className="p-3 bg-[#0d1412]/5 rounded-[10px] text-gray-400 hover:text-[#FBBF24] transition-all hover:bg-[#FBBF24]/10 border border-white/[0.03]">
                                                <FeatherIcon icon="settings" size={16} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="mt-12 flex justify-center gap-2">
                            <button 
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className="w-10 h-10 flex items-center justify-center rounded-[10px] bg-[#0d1412] border border-white/[0.03] text-gray-400 disabled:opacity-30 hover:text-[#FBBF24] hover:border-[#FBBF24] transition-all"
                            >
                                <FeatherIcon icon="chevron-left" size={16} />
                            </button>
                            {[...Array(totalPages)].map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setCurrentPage(i + 1)}
                                    className={`w-10 h-10 flex items-center justify-center rounded-[10px] text-[11px] font-black transition-all ${currentPage === i + 1 ? 'bg-[#FBBF24] text-white shadow-lg shadow-[#FBBF24]/20' : 'bg-[#0d1412] border border-white/[0.03] text-gray-400 hover:bg-white/5'}`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                            <button 
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                                className="w-10 h-10 flex items-center justify-center rounded-[10px] bg-[#0d1412] border border-white/[0.03] text-gray-400 disabled:opacity-30 hover:text-[#FBBF24] hover:border-[#FBBF24] transition-all"
                            >
                                <FeatherIcon icon="chevron-right" size={16} />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </HostingLayout>
    );
};


export default MyCoursesPage;
