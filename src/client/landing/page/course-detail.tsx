import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import FeatherIcon from 'feather-icons-react';
import HostingLayout from '../layouts/HostingLayout';
import { useTheme } from '../context/ThemeContext';
import { elearningService } from '../../../config';
import { Course, CourseSection, CourseVideo } from '../../../services/elearningService';
import Plyr from "plyr-react";
import "plyr-react/plyr.css";
import Swal from 'sweetalert2';

const CourseDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isDark } = useTheme();

    const [course, setCourse] = useState<Course | null>(null);
    const [sections, setSections] = useState<CourseSection[]>([]);
    const [videos, setVideos] = useState<CourseVideo[]>([]);
    const [loading, setLoading] = useState(true);
    const [accessDenied, setAccessDenied] = useState(false);
    const [selectedVideo, setSelectedVideo] = useState<CourseVideo | null>(null);
    const [isEnrolled, setIsEnrolled] = useState(false);
    const [enrolling, setEnrolling] = useState(false);
    const [detailTab, setDetailTab] = useState<'content' | 'about'>('content');
    const [expandedSections, setExpandedSections] = useState<string[]>([]);

    const fetchData = async () => {
        if (!id) return;
        try {
            setLoading(true);
            setAccessDenied(false);
            const [courseData, sectionsData, videosData, enrollmentData] = await Promise.all([
                elearningService.getClientCourse(id),
                elearningService.getClientCourseSections(id),
                elearningService.getClientCourseVideos(id),
                elearningService.checkEnrollment(id).catch(() => ({ isEnrolled: false })),
            ]);

            setCourse(courseData);
            setSections(sectionsData || []);
            setVideos(videosData || []);
            setIsEnrolled(enrollmentData?.isEnrolled || false);

            if (sectionsData && sectionsData.length > 0) {
                setExpandedSections(sectionsData.map(s => String(s.id)));
            }

            if (videosData && videosData.length > 0) {
                const firstVideo = videosData.find(v => v.preview) || videosData[0];
                setSelectedVideo(firstVideo);
            }
        } catch (err) {
            console.error(err);
            const message = (err as any)?.message || '';
            if ((err as any)?.status === 403 || /quyền|forbidden/i.test(message)) {
                setAccessDenied(true);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [id]);

    const toggleSection = (sectionId: string) => {
        setExpandedSections(prev => 
            prev.includes(sectionId) 
                ? prev.filter(id => id !== sectionId)
                : [...prev, sectionId]
        );
    };

    const handleEnroll = async () => {
        const token = localStorage.getItem('auth_token') || localStorage.getItem('authToken');
        if (!token) {
            const loginRes = await Swal.fire({
                title: 'Bạn chưa đăng nhập',
                text: 'Vui lòng đăng nhập để đăng ký và bắt đầu học tập.',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Đăng nhập ngay',
                cancelButtonText: 'Để sau'
            });
            if (loginRes.isConfirmed) navigate('/landing-login');
            return;
        }

        if (!id || !course) return;

        const isFree = [true, 1, '1'].includes(course.is_free as any);
        const priceValue = typeof course.price === 'number' ? course.price : parseFloat(course.price as any) || 0;

        const result = await Swal.fire({
            title: 'Xác nhận đăng ký?',
            text: isFree || priceValue === 0 ? 'Bạn sẽ tham gia khóa học này miễn phí.' : `Bạn sẽ đăng ký khóa học "${course.title}" với giá ${priceValue.toLocaleString('vi-VN')}₫. Tiền sẽ được trừ trực tiếp vào tài khoản của bạn.`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Xác nhận thanh toán',
            cancelButtonText: 'Hủy'
        });

        if (result.isConfirmed) {
            try {
                setEnrolling(true);
                await elearningService.enrollCourse(id);
                
                await Swal.fire({
                    title: 'Thành công!',
                    text: 'Giao dịch hoàn tất. Nội dung đã được mở khóa!',
                    icon: 'success',
                    timer: 2000
                });
                
                fetchData();
            } catch (error: any) {
                console.error('Enroll error:', error);
                if (error.message?.toLowerCase().includes('balance') || error.message?.toLowerCase().includes('số dư')) {
                    Swal.fire({
                        title: 'Số dư không đủ',
                        text: 'Vui lòng nạp thêm tiền vào tài khoản để mở khóa khóa học này.',
                        icon: 'error',
                        showCancelButton: true,
                        confirmButtonText: 'Nạp tiền ngay',
                        cancelButtonText: 'Để sau'
                    }).then((r) => {
                        if (r.isConfirmed) navigate('/landing-profile?tab=deposit');
                    });
                } else {
                    Swal.fire('Lỗi', error.message || 'Có lỗi xảy ra khi xử lý thanh toán.', 'error');
                }
            } finally {
                setEnrolling(false);
            }
        }
    };

    const fmt = (n: any) => {
        if (n === 0 || n === '0' || n === 'Miễn phí') return 'Miễn phí';
        const num = typeof n === 'string' ? parseFloat(n) : n;
        if (isNaN(num)) return 'Liên hệ';
        return num.toLocaleString('vi-VN') + 'đ';
    };

    if (loading) {
        return (
            <HostingLayout>
                <div className="min-h-screen bg-[#060a09] flex items-center justify-center">
                    <div className="animate-pulse flex flex-col items-center gap-4">
                        <FeatherIcon icon="loader" className="animate-spin text-[#FBBF24]" />
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Đang tải dữ liệu...</span>
                    </div>
                </div>
            </HostingLayout>
        );
    }

    if (!course && !accessDenied) return null;
    const currentCourse = course as Course;

    return (
        <HostingLayout>
            <style>{`
                .animate-in { animation: fade-in 0.8s ease-out forwards; }
                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
            {accessDenied ? (
                <div className="min-h-screen bg-[#060b0a] flex items-center justify-center px-4">
                    <div className="w-full max-w-xl rounded-[10px] border border-red-400/20 bg-[#0d1412] p-8 text-center shadow-2xl">
                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-red-400/20 bg-red-500/10 text-red-300">
                            <FeatherIcon icon="lock" size={28} />
                        </div>
                        <h1 className="text-2xl font-black text-white">Khóa học đang bị khóa theo Rank</h1>
                        <p className="mt-3 text-sm leading-7 text-gray-400">
                            Tài khoản hiện tại chưa được cấp quyền truy cập khóa học này. Vui lòng liên hệ Admin để được gán Rank phù hợp.
                        </p>
                        <div className="mt-6 flex items-center justify-center gap-3">
                            <Link to="/landing-courses" className="rounded-[10px] border border-white/10 px-5 py-3 text-[11px] font-black uppercase tracking-widest text-white transition-all hover:border-[#FBBF24]/50 hover:text-[#FBBF24]">
                                Quay lại danh sách
                            </Link>
                            <Link to="/landing-profile?tab=info" className="rounded-[10px] bg-[#FBBF24] px-5 py-3 text-[11px] font-black uppercase tracking-widest text-black transition-all hover:bg-[#FDE047]">
                                Xem hồ sơ
                            </Link>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="min-h-screen bg-[#060b0a] pt-0 pb-24 overflow-x-hidden">
                    {/* ── BREADCRUMBS ── */}
                    <div className="w-full bg-[#0d1513] border-b border-white/[0.03] mb-6">
                        <div className="max-w-7xl mx-auto px-4 py-3">
                            <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[2px] text-gray-400">
                                <Link to="/" className="hover:text-[#FBBF24] transition-colors flex items-center gap-1.5">
                                    <FeatherIcon icon="home" size={12} /> Trang chủ
                                </Link>
                                <FeatherIcon icon="chevron-right" size={10} className="opacity-40" />
                                <Link to="/landing-courses" className="hover:text-[#FBBF24]">Khóa học</Link>
                                <FeatherIcon icon="chevron-right" size={10} className="opacity-40" />
                                <span className="text-white">{currentCourse.title}</span>
                            </div>
                        </div>
                    </div>

                    <div className="max-w-7xl mx-auto px-4">
                        {isEnrolled ? (
                        /* =========================================================================
                           ENROLLED VIEW
                           ========================================================================= */
                        <div className="space-y-8 animate-in fade-in duration-700">
                            <div className="relative w-full bg-black rounded-[10px] overflow-hidden shadow-2xl">
                                <div className="aspect-video w-full" key={selectedVideo?.id}>
                                    {selectedVideo ? (
                                        <Plyr
                                            source={{
                                                type: "video",
                                                sources: [{ src: selectedVideo.url, provider: selectedVideo.url.includes('youtube') || selectedVideo.url.includes('youtu.be') ? 'youtube' : 'html5' }],
                                            }}
                                        />
                                    ) : (
                                        <div className="w-full h-full flex flex-col items-center justify-center gap-4 text-white/50 bg-slate-900">
                                            <FeatherIcon icon="play-circle" size={48} className="animate-pulse" />
                                            <p className="font-bold uppercase tracking-widest text-[10px]">Tài liệu đang nạp...</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="bg-[#0d1513] rounded-[10px] border border-white/[0.03] p-8 shadow-sm">
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                                    <div className="space-y-2">
                                        <span className="px-3 py-1 rounded-[10px] bg-[#FBBF24]/10 text-[#FBBF24] text-[10px] font-bold uppercase">ĐÃ SỞ HỮU</span>
                                        <h1 className="text-3xl font-black dark:text-white tracking-tight">{currentCourse.title}</h1>
                                    </div>
                                    <Link to={`/courses/${currentCourse.id}`} className="px-8 py-4 bg-[#FBBF24] hover:bg-[#F59E0B] text-black rounded-[10px] font-black text-[12px] uppercase tracking-widest transition-all">
                                        VÀO HỌC CHUYÊN SÂU
                                    </Link>
                                </div>

                                <div className="flex items-center gap-4 mt-8 border-t border-white/[0.03] pt-8">
                                    <button onClick={() => setDetailTab('content')} className={`px-6 py-3 rounded-[10px] text-[11px] font-bold uppercase transition-all ${detailTab === 'content' ? 'bg-[#FBBF24] text-black' : 'text-gray-400 hover:text-white dark:hover:text-white'}`}>Bài học</button>
                                    <button onClick={() => setDetailTab('about')} className={`px-6 py-3 rounded-[10px] text-[11px] font-bold uppercase transition-all ${detailTab === 'about' ? 'bg-[#FBBF24] text-black' : 'text-gray-400 hover:text-white dark:hover:text-white'}`}>Giới thiệu</button>
                                </div>
                            </div>

                            <div className="bg-[#0d1513] rounded-[10px] border border-white/[0.03] shadow-sm p-8">
                                {detailTab === 'content' ? (
                                    <div className="space-y-4">
                                        {sections.map(section => {
                                            const sectionVideos = videos.filter(v => v.sectionId === section.id);
                                            const isExpanded = expandedSections.includes(String(section.id));
                                            return (
                                                <div key={section.id} className="border border-white/[0.03] rounded-[10px] overflow-hidden">
                                                    <div onClick={() => toggleSection(String(section.id))} className="p-4 bg-[#0d1412]/[0.02] flex items-center justify-between cursor-pointer">
                                                        <span className="text-[13px] font-bold dark:text-white">{section.title}</span>
                                                        <FeatherIcon icon="chevron-down" size={14} className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                                                    </div>
                                                    {isExpanded && (
                                                        <div className="p-2 space-y-1">
                                                            {sectionVideos.map(video => (
                                                                <button key={video.id} onClick={() => setSelectedVideo(video)} className={`w-full flex items-center justify-between p-3 rounded-[10px] transition-all ${selectedVideo?.id === video.id ? 'bg-[#FBBF24]/10 text-[#FBBF24]' : 'hover:bg-white/5 dark:hover:bg-[#0d1412]/5 text-gray-400'}`}>
                                                                    <div className="flex items-center gap-3">
                                                                        <FeatherIcon icon="play-circle" size={14} />
                                                                        <span className="text-[13px] font-medium">{video.title}</span>
                                                                    </div>
                                                                    <span className="text-[11px] opacity-40">{video.duration || '5:00'}</span>
                                                                </button>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <div className="prose prose-invert max-w-none text-gray-300 text-[15px] whitespace-pre-wrap">
                                        {currentCourse.description || currentCourse.content}
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        /* =========================================================================
                           GUEST VIEW
                           ========================================================================= */
                        <div className="flex flex-col lg:flex-row gap-12 items-start relative animate-in fade-in slide-in-from-bottom-4 duration-700">
                            
                            {/* LEFT COLUMN - 70% */}
                            <div className="w-full lg:flex-1 space-y-10">
                                <div className="space-y-4">
                                    <h1 className="text-3xl md:text-4xl font-black text-white leading-[1.2] tracking-tight">
                                        {currentCourse.title}
                                    </h1>
                                    <p className="text-gray-400 font-medium text-[15px] max-w-2xl leading-relaxed">
                                        Khóa học thực chiến giúp bạn nắm vững mọi quy trình từ cơ bản đến nâng cao. Tối ưu hiệu quả và tiết kiệm tài nguyên tối đa.
                                    </p>
                                    <div className="flex flex-wrap gap-6 pt-2">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-amber-400/10 flex items-center justify-center text-amber-500">
                                                <FeatherIcon icon="star" size={14} fill="currentColor" />
                                            </div>
                                            <span className="text-[14px] font-black underline">{currentCourse.rating || '5.0'}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-gray-400">
                                            <FeatherIcon icon="users" size={14} />
                                            <span className="text-[14px] font-bold">{currentCourse.students || 128} học viên</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="relative w-full bg-[#0d1110] rounded-[10px] overflow-hidden shadow-2xl aspect-video border border-white/[0.03]">
                                    {selectedVideo && selectedVideo.preview ? (
                                        <div className="w-full h-full" key={selectedVideo.id}>
                                            <Plyr
                                                source={{
                                                    type: "video",
                                                    sources: [{ src: selectedVideo.url, provider: "youtube" }],
                                                }}
                                            />
                                        </div>
                                    ) : (
                                        <div className="relative w-full h-full group cursor-pointer" onClick={() => {
                                             const preview = videos.find(v => v.preview);
                                             if (preview) setSelectedVideo(preview);
                                        }}>
                                            <img src={currentCourse.thumbnail || currentCourse.thumbnail_url || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=1200'} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="Thumb" />
                                            <div className="absolute inset-0 bg-black/40"></div>
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <div className="w-20 h-20 rounded-full bg-[#FBBF24] flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                                                    <FeatherIcon icon="play" fill="black" size={28} className="ml-1 text-black" />
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-6 pt-6">
                                    <h2 className="text-2xl font-black text-white tracking-tight">Nội dung đào tạo</h2>
                                    <div className="space-y-4">
                                        {sections.map(section => {
                                            const sectionVideos = videos.filter(v => v.sectionId === section.id);
                                            const isExpanded = expandedSections.includes(String(section.id));
                                            return (
                                                <div key={section.id} className="bg-[#0d1412]/[0.02] border border-white/[0.03] rounded-[10px] overflow-hidden">
                                                    <div onClick={() => toggleSection(String(section.id))} className="p-5 flex items-center justify-between cursor-pointer hover:bg-white/5">
                                                        <span className="text-[14px] font-black text-white">{section.title}</span>
                                                        <FeatherIcon icon="chevron-down" size={16} className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                                                    </div>
                                                    {isExpanded && (
                                                        <div className="p-3 border-t border-gray-50 space-y-1">
                                                            {sectionVideos.map(video => (
                                                                <div key={video.id} onClick={() => video.preview && setSelectedVideo(video)} className={`flex items-center justify-between p-4 rounded-[10px] transition-all ${video.preview ? 'bg-[#FBBF24]/5 hover:bg-[#FBBF24]/10 text-[#FBBF24] cursor-pointer' : 'text-gray-400 select-none'}`}>
                                                                    <div className="flex items-center gap-4">
                                                                        <FeatherIcon icon={video.preview ? "play-circle" : "lock"} size={14} />
                                                                        <span className="text-[14px] font-bold">{video.title}</span>
                                                                    </div>
                                                                    {video.preview && <span className="text-[9px] font-black uppercase text-[#FBBF24] bg-[#FBBF24]/10 px-3 py-1 rounded-full">Xem thử</span>}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>

                            {/* RIGHT COLUMN - Refined Checkout Card */}
                            <div className="w-full lg:w-[360px] shrink-0 lg:sticky lg:top-24">
                                <div className="bg-[#0d1513] rounded-[10px] p-6 border border-white/[0.03] shadow-[0_15px_40px_-5px_rgba(0,0,0,0.08)] space-y-7">
                                    
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Giá trọn gói</p>
                                        <div className="flex flex-col">
                                            <div className="text-4xl font-black text-[#FBBF24] tracking-tighter leading-none">
                                                {fmt(currentCourse.price)}
                                            </div>
                                            <p className="text-[10px] font-medium text-gray-400 mt-2 italic opacity-60">* Thanh toán một lần, sở hữu vĩnh viễn</p>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="space-y-2.5">
                                            <button 
                                                onClick={handleEnroll}
                                                disabled={enrolling}
                                                className="w-full h-14 bg-gradient-to-r from-[#FBBF24] to-[#F59E0B] hover:brightness-105 active:scale-[0.98] text-black rounded-[10px] font-bold text-[15px] transition-all flex flex-col items-center justify-center leading-tight shadow-lg shadow-[#FBBF24]/20 disabled:opacity-50"
                                            >
                                                <span>{enrolling ? 'Đang xử lý...' : 'Đăng ký học ngay'}</span>
                                                {!enrolling && <span className="text-[10px] font-medium opacity-70">Kích hoạt tài khoản tức thì</span>}
                                            </button>
                                            
                                            <button className="w-full h-12 bg-transparent border border-white/10 hover:bg-white/5 dark:hover:bg-[#0d1412]/5 text-white rounded-[10px] font-bold text-[13px] transition-all">
                                                Thêm vào giỏ hàng
                                            </button>
                                        </div>

                                        <div className="pt-6 border-t border-white/[0.03] space-y-3">
                                            <div className="flex items-center gap-3 text-gray-300">
                                                <div className="w-5 h-5 rounded-full bg-[#FBBF24]/10 flex items-center justify-center text-[#FBBF24]">
                                                    <FeatherIcon icon="check" size={10} strokeWidth={4} />
                                                </div>
                                                <span className="text-[12px] font-medium tracking-tight">Thanh toán bảo mật 100%</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-gray-300">
                                                <div className="w-5 h-5 rounded-full bg-[#FBBF24]/10 flex items-center justify-center text-[#FBBF24]">
                                                    <FeatherIcon icon="check" size={10} strokeWidth={4} />
                                                </div>
                                                <span className="text-[12px] font-medium tracking-tight">Kích hoạt học ngay tức thì</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-gray-300">
                                                <div className="w-5 h-5 rounded-full bg-[#FBBF24]/10 flex items-center justify-center text-[#FBBF24]">
                                                    <FeatherIcon icon="check" size={10} strokeWidth={4} />
                                                </div>
                                                <span className="text-[12px] font-medium tracking-tight">Cập nhật nội dung vĩnh viễn</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        )}
                    </div>
                </div>
            )}
        </HostingLayout>
    );
};

export default CourseDetailPage;
