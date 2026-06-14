import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import FeatherIcon from 'feather-icons-react';
import parse from 'html-react-parser';
import HostingLayout from '../layouts/HostingLayout';
import { elearningService } from '../../../config';
import { Course, CourseSection, CourseVideo } from '../../../services/elearningService';
import Plyr from "plyr-react";
import "plyr-react/plyr.css";

const fallbackPoster = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=1200';

const getYoutubeVideoId = (url?: string | null) => {
    if (!url) return null;
    const value = url.trim();
    const matchers = [
        /(?:youtube\.com\/watch\?v=|youtube\.com\/embed\/|youtu\.be\/)([^&?/]+)/i,
        /youtube\.com\/shorts\/([^&?/]+)/i,
    ];

    for (const matcher of matchers) {
        const match = value.match(matcher);
        if (match?.[1]) return match[1];
    }

    return null;
};

const isYoutubeUrl = (url?: string | null) => Boolean(getYoutubeVideoId(url));
const isHlsStreamUrl = (url?: string | null) => Boolean(url && /\.m3u8($|\?)/i.test(url));
const isCloudflareStreamUrl = (url?: string | null) =>
    Boolean(url && /cloudflarestream\.com/i.test(url));

/**
 * Trích xuất video UID từ Cloudflare Stream URL.
 * Ví dụ:
 *   https://customer-xxx.cloudflarestream.com/<UID>/manifest/video.m3u8
 *   https://customer-xxx.cloudflarestream.com/<UID>/watch
 *   https://customer-xxx.cloudflarestream.com/<UID>
 */
const getCloudflareStreamEmbedUrl = (url: string): string => {
    // Lấy pathname sau domain
    const match = url.match(/cloudflarestream\.com\/([a-f0-9]+)/i);
    if (match?.[1]) {
        return `https://iframe.cloudflarestream.com/${match[1]}?autoplay=1&defaultTextTrack=vi&letterboxColor=transparent`;
    }
    // Fallback: dùng luôn URL gốc làm src iframe
    return url;
};

/** Component embed Cloudflare Stream bằng iframe chính thức */
const CloudflarePlayer: React.FC<{ url: string; title?: string }> = ({ url, title }) => {
    const embedUrl = getCloudflareStreamEmbedUrl(url);
    return (
        <div style={{ position: 'relative', width: '100%', paddingTop: '56.25%', background: '#000' }}>
            <iframe
                src={embedUrl}
                title={title || 'Video'}
                allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
                allowFullScreen
                style={{ border: 'none', position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
            />
        </div>
    );
};

const getVideoPoster = (video: CourseVideo | null, course: Course | null) => {
    const youtubeId = getYoutubeVideoId(video?.url);
    if (youtubeId) return `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`;
    return course?.thumbnail || course?.thumbnail_url || fallbackPoster;
};

const buildPlyrSource = (video: CourseVideo, courseId?: string | number) => {
    if (isHlsStreamUrl(video.url) && courseId && video.id) {
        return {
            type: "video" as const,
            sources: [{
                src: elearningService.getProtectedVideoStreamUrl(courseId, video.id),
                provider: "html5" as const,
            }],
        };
    }

    const youtubeId = getYoutubeVideoId(video.url);
    if (youtubeId) {
        return {
            type: "video" as const,
            sources: [{ src: youtubeId, provider: "youtube" as const }],
        };
    }

    return {
        type: "video" as const,
        sources: [{ src: video.url, provider: "html5" as const }],
    };
};

const currentCourseContent = (course: Course | null) => {
    if (!course) return '';
    const content = typeof course.content === 'string' ? course.content.trim() : '';
    const description = typeof course.description === 'string' ? course.description.trim() : '';
    const primary = content || description || '';
    return dedupeRepeatedContent(primary);
};

const dedupeRepeatedContent = (value: string) => {
    const normalized = value.trim();
    if (!normalized) return '';

    const collapsed = normalized.replace(/\s+/g, ' ').trim();
    const half = Math.floor(collapsed.length / 2);

    if (collapsed.length % 2 === 0) {
        const firstHalf = collapsed.slice(0, half).trim();
        const secondHalf = collapsed.slice(half).trim();
        if (firstHalf && firstHalf === secondHalf) {
            return firstHalf;
        }
    }

    return normalized;
};

/**
 * Chuyển đổi duration về dạng đọc được.
 * Backend có thể trả về: số giây (number/string), hoặc chuỗi "mm:ss" / "hh:mm:ss".
 */
const formatDuration = (raw?: string | number | null): string => {
    if (raw === undefined || raw === null || raw === '') return '';

    // Nếu là số (giây)
    const asNum = typeof raw === 'number' ? raw : Number(raw);
    if (!isNaN(asNum) && asNum > 0) {
        const h = Math.floor(asNum / 3600);
        const m = Math.floor((asNum % 3600) / 60);
        const s = Math.floor(asNum % 60);
        if (h > 0) return `${h} giờ ${m > 0 ? m + ' phút' : ''}`;
        if (m > 0) return `${m} phút ${s > 0 ? s + ' giây' : ''}`;
        return `${s} giây`;
    }

    // Nếu là chuỗi "hh:mm:ss" hoặc "mm:ss"
    const str = String(raw).trim();
    const parts = str.split(':').map(Number);
    if (parts.length === 3 && parts.every(p => !isNaN(p))) {
        const [h, m, s] = parts;
        if (h > 0) return `${h} giờ ${m > 0 ? m + ' phút' : ''}`;
        if (m > 0) return `${m} phút ${s > 0 ? s + ' giây' : ''}`;
        return `${s} giây`;
    }
    if (parts.length === 2 && parts.every(p => !isNaN(p))) {
        const [m, s] = parts;
        if (m > 0) return `${m} phút ${s > 0 ? s + ' giây' : ''}`;
        return `${s} giây`;
    }

    // Trả về nguyên bản nếu không parse được
    return str;
};

const CourseDetailPage = () => {
    const { id } = useParams();

    const [course, setCourse] = useState<Course | null>(null);
    const [sections, setSections] = useState<CourseSection[]>([]);
    const [videos, setVideos] = useState<CourseVideo[]>([]);
    const [loading, setLoading] = useState(true);
    const [accessDenied, setAccessDenied] = useState(false);
    const [selectedVideo, setSelectedVideo] = useState<CourseVideo | null>(null);
    const [detailTab, setDetailTab] = useState<'content' | 'about'>('content');
    const [expandedSections, setExpandedSections] = useState<string[]>([]);
    const [isPlayerVisible, setIsPlayerVisible] = useState(false);
    const [isPlayerReady, setIsPlayerReady] = useState(false);
    const playerRef = useRef<HTMLDivElement | null>(null);

    const courseOverview = useMemo(() => {
        const primary = currentCourseContent(course);
        if (primary) return primary;
        return '';
    }, [course]);

    const fetchData = async () => {
        if (!id) return;
        try {
            setLoading(true);
            setAccessDenied(false);
            const [courseData, sectionsData, videosData] = await Promise.all([
                elearningService.getClientCourse(id),
                elearningService.getClientCourseSections(id),
                elearningService.getClientCourseVideos(id),
            ]);

            setCourse(courseData);
            setSections(sectionsData || []);
            setVideos(videosData || []);

            if (sectionsData && sectionsData.length > 0) {
                setExpandedSections(sectionsData.map(s => String(s.id)));
            }

            if (videosData && videosData.length > 0) {
                const firstVideo = videosData.find(v => v.preview) || videosData[0];
                setSelectedVideo(firstVideo);
                // Auto-load player cho video đầu tiên
                setIsPlayerVisible(true);
                setIsPlayerReady(false);
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



    useEffect(() => {
        if (!isPlayerVisible) return;
        const timer = window.setTimeout(() => {
            setIsPlayerReady(true);
        }, 300);

        return () => {
            window.clearTimeout(timer);
        };
    }, [isPlayerVisible, selectedVideo?.id]);

    const scrollToPlayer = () => {
        playerRef.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
        });
    };

    const handleSelectVideo = (video: CourseVideo) => {
        setSelectedVideo(video);
        setIsPlayerVisible(true);
        setIsPlayerReady(false);
        window.requestAnimationFrame(() => {
            scrollToPlayer();
        });
    };

    const toggleSection = (sectionId: string) => {
        setExpandedSections(prev => 
            prev.includes(sectionId) 
                ? prev.filter(id => id !== sectionId)
                : [...prev, sectionId]
        );
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
    const isEnrolled = currentCourse?.can_view_full !== false;

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
                <div className="min-h-screen bg-[#060b0a] pb-24 overflow-x-hidden">
                    {/* ── BREADCRUMBS ── */}
                    <div className="w-full bg-[#0d1513] border-b border-white/[0.03] mb-6 mt-8 md:mt-10">
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
                            <div ref={playerRef} className="relative w-full scroll-mt-[130px] bg-black rounded-[10px] overflow-hidden shadow-2xl">
                                <div className="aspect-video w-full">
                                    {selectedVideo ? (
                                        <div className="relative h-full w-full bg-black">
                                            {isPlayerVisible ? (
                                                <>
                                                    <div className={`absolute inset-0 z-10 flex items-center justify-center bg-black/35 transition-opacity duration-300 ${isPlayerReady ? 'pointer-events-none opacity-0' : 'opacity-100'}`}>
                                                        <div className="flex flex-col items-center gap-3 rounded-[16px] border border-white/10 bg-black/45 px-6 py-5 text-white/90 backdrop-blur-md">
                                                            <FeatherIcon icon="loader" size={20} className="animate-spin text-[#FBBF24]" />
                                                            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-white/80">Đang tải video</span>
                                                        </div>
                                                    </div>
                                                    {isCloudflareStreamUrl(selectedVideo.url) ? (
                                                        <CloudflarePlayer url={selectedVideo.url} title={selectedVideo.title} />
                                                    ) : (
                                                        <Plyr
                                                            source={buildPlyrSource(selectedVideo, currentCourse.id)}
                                                            options={{
                                                                autoplay: true,
                                                                ratio: '16:9',
                                                                youtube: {
                                                                    noCookie: true,
                                                                    rel: 0,
                                                                    modestbranding: 1,
                                                                },
                                                            }}
                                                        />
                                                    )}
                                                </>
                                            ) : (
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setIsPlayerVisible(true);
                                                        setIsPlayerReady(false);
                                                    }}
                                                    className="group relative block h-full w-full cursor-pointer overflow-hidden"
                                                >
                                                    <img
                                                        src={getVideoPoster(selectedVideo, currentCourse)}
                                                        alt={selectedVideo.title}
                                                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                                                    />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/15" />
                                                    <div className="absolute inset-0 flex items-center justify-center">
                                                        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#FBBF24] text-black shadow-[0_24px_50px_rgba(251,191,36,0.28)] transition-transform duration-300 group-hover:scale-110">
                                                            <FeatherIcon icon="play" fill="currentColor" size={28} className="ml-1" />
                                                        </div>
                                                    </div>
                                                    <div className="absolute inset-x-4 bottom-4 flex items-end justify-between gap-4">
                                                        <div className="min-w-0">
                                                            <div className="text-[10px] font-black uppercase tracking-[0.24em] text-[#FBBF24]">
                                                                Bài học hiện tại
                                                            </div>
                                                            <div className="mt-2 line-clamp-2 text-left text-lg font-black text-white">
                                                                {selectedVideo.title}
                                                            </div>
                                                        </div>
                                                        <div className="shrink-0 rounded-full border border-white/15 bg-black/45 px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-white/90 backdrop-blur-md">
                                                            Phát video
                                                        </div>
                                                    </div>
                                                </button>
                                            )}
                                        </div>
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
                                        <span className="px-3 py-1 rounded-[10px] bg-[#FBBF24]/10 text-[#FBBF24] text-[10px] font-bold uppercase">ĐÃ CẤP QUYỀN</span>
                                        <h1 className="text-3xl font-black dark:text-white tracking-tight">{currentCourse.title}</h1>
                                    </div>
                                    {/* <Link to={`/courses/${currentCourse.id}`} className="px-8 py-4 bg-[#FBBF24] hover:bg-[#F59E0B] text-black rounded-[10px] font-black text-[12px] uppercase tracking-widest transition-all">
                                        VÀO HỌC CHUYÊN SÂU
                                    </Link> */}
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
                                                                <button key={video.id} onClick={() => handleSelectVideo(video)} className={`w-full flex items-center justify-between p-3 rounded-[10px] transition-all ${selectedVideo?.id === video.id ? 'bg-[#FBBF24]/10 text-[#FBBF24]' : 'hover:bg-white/5 dark:hover:bg-[#0d1412]/5 text-gray-400'}`}>
                                                                    <div className="flex items-center gap-3">
                                                                        <FeatherIcon icon="play-circle" size={14} />
                                                                        <span className="text-[13px] font-medium">{video.title}</span>
                                                                    </div>
                                                                    <span className="text-[11px] opacity-40">{formatDuration(video.duration) || '--'}</span>
                                                                </button>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <div className="rounded-[10px] border border-white/[0.03] bg-[#0b1210] p-6 md:p-8">
                                        <div className="mb-5 flex items-center gap-3 border-b border-white/[0.05] pb-4">
                                            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#FBBF24]/10 text-[#FBBF24]">
                                                <FeatherIcon icon="file-text" size={18} />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-black text-white">Giới thiệu khóa học</h3>
                                                <p className="text-[12px] text-gray-400">Tổng quan nội dung và mục tiêu bạn sẽ đạt được.</p>
                                            </div>
                                        </div>

                                        <div className="prose prose-invert max-w-none text-gray-300 text-[15px] leading-8 [&_*]:text-inherit [&_h1]:mb-4 [&_h1]:text-2xl [&_h1]:font-black [&_h2]:mb-4 [&_h2]:text-xl [&_h2]:font-black [&_h3]:mb-3 [&_h3]:text-lg [&_h3]:font-bold [&_p]:mb-4 [&_p]:leading-8 [&_strong]:font-bold [&_em]:italic [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:mb-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_li]:mb-2 [&_br]:block">
                                            {courseOverview ? parse(courseOverview) : (
                                                <p className="text-gray-400">Chưa có nội dung khóa học.</p>
                                            )}
                                        </div>
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
                                        {currentCourse.short_description || currentCourse.description || 'Khóa học thực chiến giúp bạn nắm vững mọi quy trình từ cơ bản đến nâng cao. Tối ưu hiệu quả và tiết kiệm tài nguyên tối đa.'}
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

                                <div ref={playerRef} className="relative w-full scroll-mt-[130px] bg-[#0d1110] rounded-[10px] overflow-hidden shadow-2xl aspect-video border border-white/[0.03]">
                                    {selectedVideo && selectedVideo.preview ? (
                                        <div className="relative h-full w-full">
                                            {isPlayerVisible ? (
                                                <>
                                                    <div className={`absolute inset-0 z-10 flex items-center justify-center bg-black/35 transition-opacity duration-300 ${isPlayerReady ? 'pointer-events-none opacity-0' : 'opacity-100'}`}>
                                                        <div className="flex flex-col items-center gap-3 rounded-[16px] border border-white/10 bg-black/45 px-6 py-5 text-white/90 backdrop-blur-md">
                                                            <FeatherIcon icon="loader" size={20} className="animate-spin text-[#FBBF24]" />
                                                            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-white/80">Đang tải video</span>
                                                        </div>
                                                    </div>
                                                    {isCloudflareStreamUrl(selectedVideo.url) ? (
                                                        <CloudflarePlayer url={selectedVideo.url} title={selectedVideo.title} />
                                                    ) : (
                                                        <Plyr
                                                            source={buildPlyrSource(selectedVideo, currentCourse.id)}
                                                            options={{
                                                                autoplay: true,
                                                                ratio: '16:9',
                                                                youtube: {
                                                                    noCookie: true,
                                                                    rel: 0,
                                                                    modestbranding: 1,
                                                                },
                                                            }}
                                                        />
                                                    )}
                                                </>
                                            ) : (
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setIsPlayerVisible(true);
                                                        setIsPlayerReady(false);
                                                    }}
                                                    className="group relative block h-full w-full cursor-pointer overflow-hidden"
                                                >
                                                    <img
                                                        src={getVideoPoster(selectedVideo, currentCourse)}
                                                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                                                        alt={selectedVideo.title}
                                                    />
                                                    <div className="absolute inset-0 bg-black/40" />
                                                    <div className="absolute inset-0 flex items-center justify-center">
                                                        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#FBBF24] shadow-2xl transition-transform group-hover:scale-110">
                                                            <FeatherIcon icon="play" fill="black" size={28} className="ml-1 text-black" />
                                                        </div>
                                                    </div>
                                                </button>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="relative w-full h-full group cursor-pointer" onClick={() => {
                                             const preview = videos.find(v => v.preview);
                                             if (preview) handleSelectVideo(preview);
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
                                                                <div key={video.id} onClick={() => video.preview && handleSelectVideo(video)} className={`flex items-center justify-between p-4 rounded-[10px] transition-all ${video.preview ? 'bg-[#FBBF24]/5 hover:bg-[#FBBF24]/10 text-[#FBBF24] cursor-pointer' : 'text-gray-400 select-none'}`}>
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

                                <div className="space-y-6">
                                    <h2 className="text-2xl font-black text-white tracking-tight">Chi tiết khóa học</h2>
                                    <div className="rounded-[10px] border border-white/[0.03] bg-[#0d1513] p-6 md:p-8 shadow-sm">
                                        <div className="prose prose-invert max-w-none text-gray-300 text-[15px] leading-7 [&_*]:text-inherit [&_strong]:font-bold [&_em]:italic [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6">
                                            {courseOverview ? parse(courseOverview) : (
                                                <p className="text-gray-400">Chưa có nội dung chi tiết khóa học.</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* RIGHT COLUMN - Access Card */}
                            <div className="w-full lg:w-[360px] shrink-0 lg:sticky lg:top-24">
                                <div className="bg-[#0d1513] rounded-[10px] p-6 border border-white/[0.03] shadow-[0_15px_40px_-5px_rgba(0,0,0,0.08)] space-y-7">
                                    
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Quyền truy cập</p>
                                        <div className="flex flex-col">
                                            <div className="text-2xl font-black text-[#FBBF24] tracking-tighter leading-none">
                                                {currentCourse.can_view_full ? 'Được phép xem' : 'Bị khóa theo rank'}
                                            </div>
                                            <p className="text-[10px] font-medium text-gray-400 mt-2 italic opacity-60">* Nội dung được mở theo role/rank tài khoản</p>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="space-y-2.5">
                                            <Link
                                                to="/landing-courses"
                                                className="w-full h-14 bg-gradient-to-r from-[#FBBF24] to-[#F59E0B] hover:brightness-105 active:scale-[0.98] text-black rounded-[10px] font-bold text-[15px] transition-all flex items-center justify-center leading-tight shadow-lg shadow-[#FBBF24]/20"
                                            >
                                                Quay lại danh sách khóa học
                                            </Link>
                                            <Link
                                                to={`/courses/${currentCourse.id}`}
                                                className="w-full h-12 bg-transparent border border-white/10 hover:bg-white/5 dark:hover:bg-[#0d1412]/5 text-white rounded-[10px] font-bold text-[13px] transition-all flex items-center justify-center"
                                            >
                                                Vào trang học chuyên sâu
                                            </Link>
                                        </div>

                                        <div className="pt-6 border-t border-white/[0.03] space-y-3">
                                            <div className="flex items-center gap-3 text-gray-300">
                                                <div className="w-5 h-5 rounded-full bg-[#FBBF24]/10 flex items-center justify-center text-[#FBBF24]">
                                                    <FeatherIcon icon="check" size={10} strokeWidth={4} />
                                                </div>
                                                <span className="text-[12px] font-medium tracking-tight">Kiểm tra quyền tự động</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-gray-300">
                                                <div className="w-5 h-5 rounded-full bg-[#FBBF24]/10 flex items-center justify-center text-[#FBBF24]">
                                                    <FeatherIcon icon="check" size={10} strokeWidth={4} />
                                                </div>
                                                <span className="text-[12px] font-medium tracking-tight">Kiểm tra quyền truy cập tự động</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-gray-300">
                                                <div className="w-5 h-5 rounded-full bg-[#FBBF24]/10 flex items-center justify-center text-[#FBBF24]">
                                                    <FeatherIcon icon="check" size={10} strokeWidth={4} />
                                                </div>
                                                <span className="text-[12px] font-medium tracking-tight">Mở nội dung theo role/rank</span>
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
