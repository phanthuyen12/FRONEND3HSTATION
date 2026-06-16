import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import FeatherIcon from 'feather-icons-react';
import parse from 'html-react-parser';
import HostingLayout from '../layouts/HostingLayout';
import { elearningService } from '../../../config';
import { Course, CourseSection, CourseVideo } from '../../../services/elearningService';
import Plyr from "plyr-react";
import "plyr-react/plyr.css";

const LESSON_PREVIEW_LIMIT = 6;

type CurriculumSectionEntry = {
    id: string;
    title: string;
    duration?: string | null;
    videos: CourseVideo[];
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

const getVideoProvider = (url?: string | null) => {
    const safeUrl = typeof url === 'string' ? url : '';
    return safeUrl.includes('youtube') || safeUrl.includes('youtu.be') ? 'youtube' : 'html5';
};

const getYoutubeVideoId = (url?: string | null) => {
    if (!url) return null;

    const match = url.match(
        /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([^?&/]+)/
    );

    return match?.[1] || null;
};

const getVideoThumbnail = (video: CourseVideo, courseThumbnail?: string | null) => {
    const customBanner = video.imgBanner || video.img_banner;
    if (customBanner) {
        return customBanner;
    }

    const youtubeId = getYoutubeVideoId(video.url);
    if (youtubeId) {
        return `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`;
    }

    return courseThumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=1200';
};

const CourseCurriculum = ({
    sections,
    selectedVideo,
    isEnrolled,
    courseThumbnail,
    expandedSections,
    onToggleSection,
    onSelectVideo,
    previewLessonsCount,
}: {
    sections: CurriculumSectionEntry[];
    selectedVideo: CourseVideo | null;
    isEnrolled: boolean;
    courseThumbnail?: string | null;
    expandedSections: string[];
    onToggleSection: (sectionId: string) => void;
    onSelectVideo: (video: CourseVideo) => void;
    previewLessonsCount: number;
}) => {
    const totalLessons = sections.reduce((total, section) => total + section.videos.length, 0);
    const proLessonsCount = Math.max(0, totalLessons - previewLessonsCount);

    if (!sections.length) {
        return (
            <div className="rounded-[10px] border border-white/[0.03] bg-[#0d1513] p-6 text-gray-400">
                Chưa có danh sách bài học cho khóa này.
            </div>
        );
    }

    return (
        <section className="space-y-8">
            <div className="space-y-3">
                <span className="text-[10px] font-black uppercase tracking-[3px] text-[#FBBF24]">
                    Nội dung khóa học
                </span>
                <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <h2 className="text-2xl font-black text-white tracking-tight md:text-3xl">
                            Nội Dung Khóa Học
                        </h2>
                        <p className="mt-2 text-sm text-gray-400">
                            {totalLessons} bài học · {sections.length} phần · {previewLessonsCount} bài miễn phí · {proLessonsCount} bài PRO
                        </p>
                    </div>
                    <p className="max-w-xl text-sm leading-7 text-gray-500">
                        Chọn bài bên dưới để phát ngay trong khung video phía trên.
                    </p>
                </div>
            </div>

            <div className="space-y-8">
                {sections.map((section, sectionIndex) => {
                    const isExpanded = expandedSections.includes(section.id);
                    const visibleVideos = isExpanded
                        ? section.videos
                        : section.videos.slice(0, LESSON_PREVIEW_LIMIT);
                    const hasMoreVideos = section.videos.length > LESSON_PREVIEW_LIMIT;

                    return (
                        <div key={section.id} className="space-y-4">
                            <div className="flex flex-col gap-2 border-l-2 border-[#FBBF24] pl-4">
                                <div className="flex flex-wrap items-center gap-3">
                                    <h3 className="text-lg font-black text-white md:text-xl">
                                        {section.title || `Module ${sectionIndex + 1}`}
                                    </h3>
                                    <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                                        {section.videos.length} bài
                                    </span>
                                </div>
                                {section.duration ? (
                                    <p className="text-sm text-gray-500">Tổng thời lượng: {section.duration}</p>
                                ) : null}
                            </div>

                            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                                {visibleVideos.map((video, videoIndex) => {
                                    const canPlayVideo = isEnrolled || Boolean(video.preview);
                                    const isActive = selectedVideo?.id === video.id;
                                    const thumbnail = getVideoThumbnail(video, courseThumbnail);

                                    return (
                                        <button
                                            key={video.id ?? `${section.id}-${videoIndex}`}
                                            type="button"
                                            disabled={!canPlayVideo}
                                            onClick={() => canPlayVideo && onSelectVideo(video)}
                                            className={`overflow-hidden rounded-[10px] border text-left transition-all ${
                                                isActive
                                                    ? 'border-[#FBBF24]/80 bg-[#111a17] shadow-[0_0_0_1px_rgba(251,191,36,0.2)]'
                                                    : 'border-white/[0.06] bg-[#0d1513] hover:border-white/15 hover:bg-[#111917]'
                                            } ${canPlayVideo ? 'cursor-pointer' : 'cursor-not-allowed opacity-75'}`}
                                        >
                                            <div className="relative aspect-video overflow-hidden bg-[#09100f]">
                                                <img
                                                    src={thumbnail}
                                                    alt={video.title}
                                                    className="h-full w-full object-cover transition-transform duration-500 hover:scale-[1.03]"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-black/5" />
                                                <div className="absolute left-3 top-3 flex items-center gap-2">
                                                    <span className="rounded bg-black/65 px-2 py-1 text-[10px] font-black text-white">
                                                        #{video.order || videoIndex + 1}
                                                    </span>
                                                    {!isEnrolled && video.preview ? (
                                                        <span className="rounded bg-emerald-500/85 px-2 py-1 text-[10px] font-black text-white">
                                                            Miễn phí
                                                        </span>
                                                    ) : null}
                                                    {!canPlayVideo ? (
                                                        <span className="rounded bg-amber-500/85 px-2 py-1 text-[10px] font-black text-black">
                                                            PRO
                                                        </span>
                                                    ) : null}
                                                </div>
                                                <div className="absolute bottom-3 left-3 flex items-center gap-2 text-white">
                                                    <div className={`flex h-10 w-10 items-center justify-center rounded-full ${isActive ? 'bg-[#FBBF24] text-black' : 'bg-white/15 text-white backdrop-blur'}`}>
                                                        <FeatherIcon icon={canPlayVideo ? 'play' : 'lock'} size={16} />
                                                    </div>
                                                    {isActive ? (
                                                        <span className="rounded-full bg-[#FBBF24] px-3 py-1 text-[10px] font-black uppercase tracking-wider text-black">
                                                            Đang xem
                                                        </span>
                                                    ) : null}
                                                </div>
                                                <span className="absolute bottom-3 right-3 rounded bg-black/75 px-2 py-1 text-[11px] font-bold text-white">
                                                    {video.duration || 'Video'}
                                                </span>
                                            </div>

                                            <div className="space-y-3 p-4">
                                                <p className={`line-clamp-2 text-sm font-bold leading-6 ${isActive ? 'text-white' : 'text-gray-100'}`}>
                                                    {video.title}
                                                </p>
                                                <div className="flex items-center justify-between text-xs">
                                                    <span className={canPlayVideo ? 'text-gray-400' : 'text-amber-400'}>
                                                        {canPlayVideo ? 'Nhấn để phát bài học' : 'Mua khóa học để mở bài này'}
                                                    </span>
                                                    <span className={isActive ? 'text-[#FBBF24]' : 'text-gray-500'}>
                                                        {canPlayVideo ? 'Phát' : 'Khóa'}
                                                    </span>
                                                </div>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>

                            {hasMoreVideos ? (
                                <div className="flex justify-center pt-2">
                                    <button
                                        type="button"
                                        onClick={() => onToggleSection(section.id)}
                                        className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.02] px-5 py-2.5 text-xs font-black uppercase tracking-[2px] text-white transition-all hover:border-[#FBBF24]/40 hover:text-[#FBBF24]"
                                    >
                                        {isExpanded ? 'Thu gọn' : `Xem thêm ${section.videos.length - LESSON_PREVIEW_LIMIT} bài`}
                                        <FeatherIcon icon={isExpanded ? 'chevron-up' : 'chevron-down'} size={14} />
                                    </button>
                                </div>
                            ) : null}
                        </div>
                    );
                })}
            </div>
        </section>
    );
};

const CourseDetailPage = () => {
    const { id } = useParams();

    const [course, setCourse] = useState<Course | null>(null);
    const [sections, setSections] = useState<CourseSection[]>([]);
    const [videos, setVideos] = useState<CourseVideo[]>([]);
    const [loading, setLoading] = useState(true);
    const [accessDenied, setAccessDenied] = useState(false);
    const [selectedVideo, setSelectedVideo] = useState<CourseVideo | null>(null);
    const [expandedSections, setExpandedSections] = useState<string[]>([]);
    const playerRef = useRef<HTMLDivElement | null>(null);

    const courseOverview = useMemo(() => {
        const primary = currentCourseContent(course);
        if (primary) return primary;
        return '';
    }, [course]);

    const previewLessonsCount = useMemo(
        () => videos.filter((video) => Boolean(video.preview)).length,
        [videos]
    );

    const curriculumSections = useMemo<CurriculumSectionEntry[]>(() => {
        const sortedVideos = [...videos].sort((left, right) => Number(left.order || 0) - Number(right.order || 0));
        const matchedSectionIds = new Set<string>();

        const entries = sections
            .map((section) => {
                const sectionId = String(section.id);
                const sectionVideos = sortedVideos.filter((video) => String(video.sectionId) === sectionId);

                if (sectionVideos.length) {
                    matchedSectionIds.add(sectionId);
                }

                return {
                    id: sectionId,
                    title: section.title,
                    duration: section.duration,
                    videos: sectionVideos,
                };
            })
            .filter((section) => section.videos.length > 0);

        const ungroupedVideos = sortedVideos.filter((video) => !matchedSectionIds.has(String(video.sectionId)));
        if (ungroupedVideos.length) {
            entries.push({
                id: 'ungrouped',
                title: 'Bài học khác',
                duration: null,
                videos: ungroupedVideos,
            });
        }

        return entries;
    }, [sections, videos]);

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
            setExpandedSections([]);

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

    const scrollToPlayer = () => {
        playerRef.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
        });
    };

    const handleSelectVideo = (video: CourseVideo) => {
        setSelectedVideo(video);
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
    const selectedVideoBanner = selectedVideo
        ? getVideoThumbnail(selectedVideo, currentCourse.thumbnail || currentCourse.thumbnail_url)
        : (currentCourse.thumbnail || currentCourse.thumbnail_url || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=1200');

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
                                <div className="aspect-video w-full" key={selectedVideo?.id}>
                                    {selectedVideo ? (
                                        <Plyr
                                            source={{
                                                type: "video",
                                                sources: [{ src: selectedVideo.url, provider: getVideoProvider(selectedVideo.url) }],
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
                                        <span className="px-3 py-1 rounded-[10px] bg-[#FBBF24]/10 text-[#FBBF24] text-[10px] font-bold uppercase">ĐÃ CẤP QUYỀN</span>
                                        <h1 className="text-3xl font-black dark:text-white tracking-tight">{currentCourse.title}</h1>
                                        {selectedVideo ? (
                                            <p className="text-sm text-gray-400">
                                                Đang phát: <span className="font-semibold text-white">{selectedVideo.title}</span>
                                            </p>
                                        ) : null}
                                    </div>
                                    <div className="rounded-[10px] border border-emerald-400/10 bg-emerald-500/5 px-5 py-4 text-sm text-emerald-200">
                                        Tất cả bài học đã được mở cho tài khoản của bạn.
                                    </div>
                                </div>
                            </div>

                            <CourseCurriculum
                                sections={curriculumSections}
                                selectedVideo={selectedVideo}
                                isEnrolled={isEnrolled}
                                courseThumbnail={currentCourse.thumbnail || currentCourse.thumbnail_url}
                                expandedSections={expandedSections}
                                onToggleSection={toggleSection}
                                onSelectVideo={handleSelectVideo}
                                previewLessonsCount={previewLessonsCount}
                            />

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
                                        <div className="w-full h-full" key={selectedVideo.id}>
                                            <Plyr
                                                source={{
                                                    type: "video",
                                                    sources: [{ src: selectedVideo.url, provider: getVideoProvider(selectedVideo.url) }],
                                                }}
                                            />
                                        </div>
                                    ) : (
                                        <div className="relative w-full h-full group cursor-pointer" onClick={() => {
                                             const preview = videos.find(v => v.preview);
                                             if (preview) handleSelectVideo(preview);
                                        }}>
                                            <img src={selectedVideoBanner} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt={selectedVideo?.title || currentCourse.title} />
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
                                    <CourseCurriculum
                                        sections={curriculumSections}
                                        selectedVideo={selectedVideo}
                                        isEnrolled={isEnrolled}
                                        courseThumbnail={currentCourse.thumbnail || currentCourse.thumbnail_url}
                                        expandedSections={expandedSections}
                                        onToggleSection={toggleSection}
                                        onSelectVideo={handleSelectVideo}
                                        previewLessonsCount={previewLessonsCount}
                                    />
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
