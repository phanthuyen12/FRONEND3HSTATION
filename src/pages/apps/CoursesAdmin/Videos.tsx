import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageBreadcrumb } from "../../../components";
import {
  CourseLesson,
  CourseSection,
  courses as initialCourses,
} from "../../../client/data/courses";

const VideosAdmin: React.FC = () => {
  const navigate = useNavigate();
  const [selectedCourseId, setSelectedCourseId] = useState<string>("");
  const [selectedSectionId, setSelectedSectionId] = useState<string>("");
  const [search, setSearch] = useState("");

  // Lấy tất cả videos từ tất cả courses
  const allVideos = useMemo(() => {
    const videos: Array<{
      id: string;
      title: string;
      duration: string;
      source: string;
      videoId: string;
      description?: string;
      courseId: string;
      courseTitle: string;
      sectionId: string;
      sectionTitle: string;
    }> = [];

    initialCourses.forEach((course) => {
      course.sections.forEach((section) => {
        section.lessons.forEach((lesson) => {
          videos.push({
            id: lesson.id,
            title: lesson.title,
            duration: lesson.duration,
            source: lesson.source,
            videoId: lesson.videoId,
            description: lesson.description,
            courseId: course.id,
            courseTitle: course.title,
            sectionId: section.id,
            sectionTitle: section.title,
          });
        });
      });
    });

    return videos;
  }, []);

  const filteredVideos = useMemo(() => {
    let filtered = allVideos;

    if (selectedCourseId) {
      filtered = filtered.filter((v) => v.courseId === selectedCourseId);
    }

    if (selectedSectionId) {
      filtered = filtered.filter((v) => v.sectionId === selectedSectionId);
    }

    if (search.trim()) {
      const keyword = search.toLowerCase();
      filtered = filtered.filter(
        (v) =>
          v.title.toLowerCase().includes(keyword) ||
          v.courseTitle.toLowerCase().includes(keyword) ||
          v.sectionTitle.toLowerCase().includes(keyword) ||
          v.videoId.toLowerCase().includes(keyword)
      );
    }

    return filtered;
  }, [allVideos, selectedCourseId, selectedSectionId, search]);

  const courses = useMemo(() => initialCourses, []);
  const sections = useMemo(() => {
    if (!selectedCourseId) return [];
    const course = courses.find((c) => c.id === selectedCourseId);
    return course?.sections || [];
  }, [selectedCourseId, courses]);

  const totalVideos = useMemo(() => allVideos.length, [allVideos]);
  const totalDuration = useMemo(() => {
    return filteredVideos.reduce((total, video) => {
      const [minutes, seconds] = video.duration.split(":").map(Number);
      return total + minutes * 60 + seconds;
    }, 0);
  }, [filteredVideos]);

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hours > 0) {
      return `${hours}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    }
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleDelete = (videoId: string) => {
    if (!window.confirm("Bạn có chắc chắn muốn xoá video này?")) return;
    // Demo: chỉ log ra console
    console.log("Delete video:", videoId);
    alert("Đã xóa video (demo front-end, chưa kết nối API).");
  };

  return (
    <>
      <PageBreadcrumb
        title="Quản lý video"
        name="Quản lý video"
        breadCrumbItems={["Konrix", "Apps", "Khoá học", "Video"]}
      />

      {/* Header + stats + filter */}
      <div className="card mb-4">
        <div className="p-4 md:p-5 flex flex-col gap-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
              <h3 className="text-lg md:text-xl font-semibold mb-1">
                Danh sách video
              </h3>
              <p className="text-xs md:text-sm text-slate-500">
                Quản lý tất cả các video trong các khoá học
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                className="btn bg-emerald-500 text-white text-sm"
                onClick={() => navigate("/admin/elearning/courses/new")}
              >
                <i className="mgc_add_circle_line mr-1" /> Thêm video mới
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="grid md:grid-cols-4 gap-3">
            <div className="relative">
              <span className="absolute inset-y-0 left-3 flex items-center text-slate-400 text-sm">
                <i className="mgc_search_3_line" />
              </span>
              <input
                className="form-input pl-9 pr-3 py-2 text-xs w-full"
                placeholder="Tìm kiếm video..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <select
              className="form-select text-xs"
              value={selectedCourseId}
              onChange={(e) => {
                setSelectedCourseId(e.target.value);
                setSelectedSectionId("");
              }}
            >
              <option value="">Tất cả khoá học</option>
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.title}
                </option>
              ))}
            </select>
            <select
              className="form-select text-xs"
              value={selectedSectionId}
              onChange={(e) => setSelectedSectionId(e.target.value)}
              disabled={!selectedCourseId}
            >
              <option value="">Tất cả chương</option>
              {sections.map((section) => (
                <option key={section.id} value={section.id}>
                  {section.title}
                </option>
              ))}
            </select>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="btn btn-sm border text-xs"
                onClick={() => {
                  setSearch("");
                  setSelectedCourseId("");
                  setSelectedSectionId("");
                }}
              >
                <i className="mgc_refresh_line mr-1" />
                Reset
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid sm:grid-cols-3 grid-cols-1 gap-3 text-xs md:text-sm">
            <div className="rounded-xl bg-amber-50 px-3 py-2.5 text-amber-700">
              <p className="uppercase tracking-wide text-[10px] font-semibold mb-1">
                Tổng video
              </p>
              <p className="text-xl font-semibold">{totalVideos}</p>
            </div>
            <div className="rounded-xl bg-sky-50 px-3 py-2.5 text-sky-700">
              <p className="uppercase tracking-wide text-[10px] font-semibold mb-1">
                Đang hiển thị
              </p>
              <p className="text-xl font-semibold">{filteredVideos.length}</p>
            </div>
            <div className="rounded-xl bg-emerald-50 px-3 py-2.5 text-emerald-700">
              <p className="uppercase tracking-wide text-[10px] font-semibold mb-1">
                Tổng thời lượng
              </p>
              <p className="text-xl font-semibold">
                {formatDuration(totalDuration)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Videos table */}
      <div className="card">
        <div className="relative overflow-x-auto">
          <table className="w-full divide-y divide-gray-200 dark:divide-gray-700 text-sm">
            <thead className="bg-slate-50 dark:bg-slate-700/60">
              <tr>
                <th className="px-3 py-2 text-left font-semibold text-slate-600">
                  Video
                </th>
                <th className="px-3 py-2 text-left font-semibold text-slate-600">
                  Khoá học
                </th>
                <th className="px-3 py-2 text-left font-semibold text-slate-600">
                  Chương
                </th>
                <th className="px-3 py-2 text-left font-semibold text-slate-600">
                  Nguồn
                </th>
                <th className="px-3 py-2 text-left font-semibold text-slate-600">
                  Video ID
                </th>
                <th className="px-3 py-2 text-right font-semibold text-slate-600">
                  Thời lượng
                </th>
                <th className="px-3 py-2 text-right font-semibold text-slate-600">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredVideos.map((video) => (
                <tr
                  key={video.id}
                  className="border-t border-slate-100 dark:border-slate-700/60"
                >
                  <td className="px-3 py-3">
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-slate-100 text-sm">
                        {video.title}
                      </p>
                      {video.description && (
                        <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                          {video.description}
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="px-3 py-3 text-sm text-slate-700">
                    <button
                      type="button"
                      className="text-primary hover:underline"
                      onClick={() =>
                        navigate(`/admin/elearning/courses/${video.courseId}`)
                      }
                    >
                      {video.courseTitle}
                    </button>
                  </td>
                  <td className="px-3 py-3 text-xs text-slate-600">
                    {video.sectionTitle}
                  </td>
                  <td className="px-3 py-3 text-xs text-slate-600">
                    <span className="inline-flex items-center gap-1 capitalize">
                      {video.source === "youtube" && (
                        <i className="mgc_youtube_line text-red-500" />
                      )}
                      {video.source === "vimeo" && (
                        <i className="mgc_video_line text-blue-500" />
                      )}
                      {video.source}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-xs text-slate-600 font-mono">
                    {video.videoId || "-"}
                  </td>
                  <td className="px-3 py-3 text-right text-xs text-slate-600">
                    {video.duration}
                  </td>
                  <td className="px-3 py-3 text-right whitespace-nowrap">
                    <button
                      type="button"
                      className="btn btn-xs bg-slate-100 text-xs mr-2"
                      onClick={() =>
                        navigate(`/admin/elearning/courses/${video.courseId}`)
                      }
                    >
                      <i className="mgc_edit_line mr-1" />
                      Sửa
                    </button>
                    <button
                      type="button"
                      className="btn btn-xs bg-rose-50 text-rose-600 text-xs"
                      onClick={() => handleDelete(video.id)}
                    >
                      <i className="mgc_delete_line mr-1" />
                      Xoá
                    </button>
                  </td>
                </tr>
              ))}
              {filteredVideos.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-3 py-6 text-center text-slate-500 text-sm"
                  >
                    Không tìm thấy video nào phù hợp.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default VideosAdmin;








