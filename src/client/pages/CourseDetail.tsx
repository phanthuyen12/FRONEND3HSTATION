import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Plyr from "plyr-react";
import "plyr-react/plyr.css";

import { PageBreadcrumb } from "../../components";
import { elearningService } from "../../config";
import { Course, CourseSection, CourseVideo } from "../../services/elearningService";

interface CourseLesson {
  id: number;
  title: string;
  duration?: string;
  videoId?: string;
  source?: string;
  isPreview?: boolean;
}

const CourseDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [sections, setSections] = useState<CourseSection[]>([]);
  const [videos, setVideos] = useState<CourseVideo[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [accessDenied, setAccessDenied] = useState<boolean>(false);
  const [selectedVideo, setSelectedVideo] = useState<CourseVideo | null>(null);

  useEffect(() => {
    if (!id) return;

    const loadCourse = async () => {
      try {
        setLoading(true);
        setAccessDenied(false);
        const [courseData, sectionsData, videosData] = await Promise.all([
          elearningService.getClientCourse(id),
          elearningService.getClientCourseSections(id),
          elearningService.getClientCourseVideos(id),
        ]);

        if (courseData) {
          setCourse(courseData);
        }
        if (sectionsData) {
          setSections(sectionsData);
        }
        if (videosData && videosData.length > 0) {
          setVideos(videosData);
          // Set first video as selected
          const firstVideo = videosData.find(v => v.preview) || videosData[0];
          setSelectedVideo(firstVideo);
        }
      } catch (error) {
        const message = (error as any)?.message || '';
        if ((error as any)?.status === 403 || /quyền|forbidden/i.test(message)) {
          setAccessDenied(true);
        }
        // eslint-disable-next-line no-console
        console.error("Không thể tải khóa học", error);
      } finally {
        setLoading(false);
      }
    };

    loadCourse();
  }, [id]);

  const currentVideo = selectedVideo || videos[0];
  const canViewFull = course?.can_view_full !== false;
  const currentBanner = currentVideo?.imgBanner || currentVideo?.img_banner || course?.thumbnail || course?.thumbnail_url;

  if (loading) {
    return (
      <>
        <PageBreadcrumb
          name="Đang tải..."
          title="Chi tiết khóa học"
          breadCrumbItems={["Client", "Khóa học"]}
        />
        <div className="card">
          <div className="p-6 text-center text-slate-600">
            Đang tải thông tin khóa học...
          </div>
        </div>
      </>
    );
  }

  if (!course) {
    if (accessDenied) {
      return (
        <>
          <PageBreadcrumb
            name="Không có quyền"
            title="Chi tiết khóa học"
            breadCrumbItems={["Client", "Khóa học"]}
          />
          <div className="text-center py-10">
            <h4 className="text-lg font-semibold mb-2">Khóa học bị khóa theo Rank</h4>
            <p className="text-slate-500 mb-4">
              Tài khoản hiện tại chưa được cấp quyền truy cập khóa học này.
            </p>
            <Link to="/landing-courses" className="btn bg-primary text-white">
              Quay lại danh sách
            </Link>
          </div>
        </>
      );
    }
    return (
      <>
        <PageBreadcrumb
          name="Không tìm thấy"
          title="Chi tiết khóa học"
          breadCrumbItems={["Client", "Khóa học"]}
        />
        <div className="text-center py-10">
          <h4 className="text-lg font-semibold mb-2">Không tìm thấy khoá học</h4>
          <p className="text-slate-500 mb-4">
            Vui lòng quay lại trang danh sách khoá học để chọn lại.
          </p>
          <Link to="/courses" className="btn bg-primary text-white">
            Quay lại danh sách
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <PageBreadcrumb
        name={course.title}
        title="Chi tiết khóa học"
        breadCrumbItems={["Client", "Khóa học", course.title]}
      />

      <div className="grid lg:grid-cols-3 grid-cols-1 gap-6">
        <div className="lg:col-span-2">
          <div className="card mb-6">
            <div className="card-header">
              <h4 className="card-title mb-0">
                {currentVideo ? currentVideo.title : "Video khóa học"}
              </h4>
            </div>
            <div className="p-6">
              {currentBanner && (
                <div className="mb-4 overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                  <img
                    src={currentBanner}
                    alt={currentVideo?.title || course.title}
                    className="h-64 w-full object-cover"
                  />
                </div>
              )}
              {currentVideo ? (
                <div className="rounded-xl overflow-hidden">
                  <Plyr
                    source={{
                      type: "video",
                      sources: [
                        {
                          src: currentVideo.url,
                          provider: currentVideo.url.includes('youtube') || currentVideo.url.includes('youtu.be') ? 'youtube' : 'html5',
                        },
                      ],
                    }}
                  />
                </div>
              ) : (
                <div className="rounded-xl bg-slate-100 h-64 flex items-center justify-center text-slate-500">
                  Chưa có video
                </div>
              )}
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h4 className="card-title mb-0">Mô tả khóa học</h4>
            </div>
            <div className="p-6">
              <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">
                {course.description || course.content || "Chưa có mô tả."}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="card">
            <div className="card-header">
              <h4 className="card-title mb-0">Nội dung khóa học</h4>
            </div>
            <div className="p-0">
              <div className="max-h-[420px] overflow-y-auto divide-y divide-slate-100">
                {sections.length > 0 ? (
                  sections.map((section) => {
                    const sectionVideos = videos.filter(v => v.sectionId === section.id);
                    return (
                      <div key={section.id} className="p-4">
                        <h5 className="text-sm font-semibold mb-3">
                          {section.title}
                        </h5>
                        <div className="space-y-2">
                          {sectionVideos.map((video) => {
                            const active = currentVideo?.id === video.id;
                            const locked = !canViewFull && !video.preview;
                            return (
                              <button
                                key={video.id}
                                type="button"
                                className={`w-full flex items-center justify-between rounded-md px-3 py-2 text-xs text-left transition ${active
                                    ? "bg-amber-50 text-amber-700 border border-amber-200"
                                    : "bg-slate-50/60 text-slate-600 hover:bg-slate-100 border border-transparent"
                                  } ${locked ? "opacity-60 cursor-not-allowed" : ""}`}
                                onClick={() => {
                                  if (locked) return;
                                  setSelectedVideo(video);
                                }}
                              >
                                <div className="flex items-center gap-2">
                                  {(video.imgBanner || video.img_banner) && (
                                    <img
                                      src={video.imgBanner || video.img_banner || ""}
                                      alt={video.title}
                                      className="h-10 w-16 rounded object-cover"
                                    />
                                  )}
                                  <span
                                    className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] ${active
                                        ? "bg-amber-500 text-white"
                                        : "bg-slate-200 text-slate-700"
                                      }`}
                                  >
                                    ▶
                                  </span>
                                  <div className="flex flex-col">
                                    <span className="font-medium line-clamp-1">
                                      {video.title}
                                    </span>
                                    {video.duration && (
                                      <span className="text-[11px] text-slate-400">
                                        {video.duration}
                                        {video.preview && " · Xem thử miễn phí"}
                                      </span>
                                    )}
                                  </div>
                                </div>
                                {locked && (
                                  <span className="text-[10px] font-medium text-amber-500">
                                    Khoá
                                  </span>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="p-4 text-center text-slate-500 text-sm">
                    Chưa có nội dung
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h4 className="card-title mb-0">Thông tin chung</h4>
            </div>
            <div className="p-6 space-y-3">
              <div className="flex justify-between">
                <span className="text-slate-500">Trình độ:</span>
                <span className="font-medium">
                  {course.level === 'beginner' ? 'Cơ bản' : course.level === 'intermediate' ? 'Trung cấp' : course.level === 'advanced' ? 'Nâng cao' : course.level || 'N/A'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Quyền xem:</span>
                <span className="font-semibold text-primary">
                  {course.can_view_full !== false ? 'Được phép' : 'Bị khóa'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Thời lượng:</span>
                <span className="font-medium">{course.duration || "N/A"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Số bài học:</span>
                <span className="font-medium">{course.lessons || 0} bài</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Học viên:</span>
                <span className="font-medium">
                  {(course.students || 0).toLocaleString()}+
                </span>
              </div>
              {course.rating && (
                <div className="flex justify-between">
                  <span className="text-slate-500">Đánh giá:</span>
                  <span className="flex items-center gap-1 font-medium">
                    <i className="mgc_star_fill text-amber-400" />
                    {typeof course.rating === 'number' ? course.rating.toFixed(1) : course.rating}/5.0
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="card">
            <div className="card-header">
                <h4 className="card-title mb-0">Hành động</h4>
            </div>
            <div className="p-6 space-y-3">
              <div className="rounded-lg border border-amber-100 bg-amber-50/60 px-4 py-3 text-xs text-amber-700">
                Khóa học này được mở theo quyền role/rank của tài khoản.
              </div>
              <Link
                to="/courses"
                className="btn border-slate-200 text-slate-700 w-full bg-white"
              >
                Quay lại danh sách khoá học
              </Link>
            </div>
          </div>
        </div>
      </div>

    </>
  );
};

export default CourseDetail;
