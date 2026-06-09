import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PageBreadcrumb } from "../../../components";
import { elearningService, adminElearningService, API_URL } from "../../../config";
import { Category, Course, CourseSection, CourseVideo, CourseCreatePayload } from "../../../services/elearningService";
import { CourseLesson as AdminCourseLesson } from "../../../services/adminElearningService";
import Swal from 'sweetalert2';
import 'sweetalert2/src/sweetalert2.scss';

const emptyCourse: Course = {
  title: "",
  short_description: "",
  description: "",
  category_id: "",
  price: "",
  level: "beginner",
  duration: "",
  lessons: 0,
  status: "active",
  content: "",
  thumbnail: "",
};

const emptySection: Omit<CourseSection, 'course_id'> = {
  title: "",
  duration: "",
  type: "",
  content: "",
  order: 0,
};

const emptyVideo: CourseVideo = {
  course_id: 0,
  sectionId: undefined,
  title: "",
  url: "",
  duration: "",
  order: 0,
  preview: false,
};

const CourseDetailAdmin: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isNew = id === "new";

  const [course, setCourse] = useState<Course>(emptyCourse);
  const [categories, setCategories] = useState<Category[]>([]);
  const [sections, setSections] = useState<CourseSection[]>([]);
  const [videos, setVideos] = useState<CourseVideo[]>([]);
  const [lessons, setLessons] = useState<AdminCourseLesson[]>([]);
  const [selectedSectionId, setSelectedSectionId] = useState<number | null>(null);
  const [showAddVideoForm, setShowAddVideoForm] = useState(false);
  const [newVideo, setNewVideo] = useState<CourseVideo>(emptyVideo);
  const [savingVideo, setSavingVideo] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savingSectionIndex, setSavingSectionIndex] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [videoSearchTerm, setVideoSearchTerm] = useState<string>("");
  const [loadingVideos, setLoadingVideos] = useState(false);

  // Load categories
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const cats = await elearningService.getCategories();
        setCategories(cats);
      } catch (err) {
        console.error("Failed to load categories:", err);
      }
    };
    loadCategories();
  }, []);

  // Load course data if editing
  useEffect(() => {
    if (!isNew && id) {
      setLoading(true);
      Promise.all([
        elearningService.getCourse(id),
        adminElearningService.getSectionsByCourse(id),
        adminElearningService.getVideosByCourse(id),
        adminElearningService.getLessonsByCourse(id),
      ])
        .then(([courseData, sectionsData, videosData, lessonsData]) => {
          if (courseData) {
            setCourse(courseData);
          }
          if (sectionsData && sectionsData.length > 0) {
            // Convert AdminElearningService CourseSection to elearningService CourseSection
            const convertedSections: CourseSection[] = sectionsData.map((s) => ({
              id: s.id,
              course_id: s.course_id,
              title: s.title,
              duration: null,
              type: null,
              content: null,
              order: s.order || 0,
            }));
            setSections(convertedSections);
            // Set first section as selected
            if (convertedSections[0]?.id) {
              setSelectedSectionId(convertedSections[0].id);
            }
          }
          if (videosData && videosData.length > 0) {
            // Convert AdminElearningService CourseVideo to elearningService CourseVideo
            const convertedVideos: CourseVideo[] = videosData.map((v) => ({
              id: v.id,
              course_id: v.course_id,
              sectionId: v.sectionId,
              title: v.title,
              url: v.url,
              duration: typeof v.duration === 'number' ? String(v.duration) : (v.duration || null),
              order: v.order || 0,
              preview: v.preview ? 1 : 0,
            }));
            setVideos(convertedVideos);
          }
          if (lessonsData && lessonsData.length > 0) {
            setLessons(lessonsData);
          }
        })
        .catch((err) => {
          console.error("Failed to load course data:", err);
          setError("Không tải được thông tin khóa học");
        })
        .finally(() => setLoading(false));
    }
  }, [id, isNew]);

  // Load videos when section changes
  useEffect(() => {
    if (!isNew && course.id && selectedSectionId) {
      setLoadingVideos(true);
      adminElearningService.getVideosByCourse(Number(course.id), selectedSectionId)
        .then((videosData) => {
          if (videosData && videosData.length > 0) {
            const convertedVideos: CourseVideo[] = videosData.map((v) => ({
              id: v.id,
              course_id: v.course_id,
              sectionId: v.sectionId,
              title: v.title,
              url: v.url,
              duration: typeof v.duration === 'number' ? String(v.duration) : (v.duration || null),
              order: v.order || 0,
              preview: v.preview ? 1 : 0,
            }));
            setVideos(convertedVideos);
          } else {
            setVideos([]);
          }
        })
        .catch((err) => {
          console.error("Failed to load videos:", err);
        })
        .finally(() => setLoadingVideos(false));
    } else if (!isNew && course.id && !selectedSectionId) {
      // Load all videos if no section selected
      setLoadingVideos(true);
      adminElearningService.getVideosByCourse(Number(course.id))
        .then((videosData) => {
          if (videosData && videosData.length > 0) {
            const convertedVideos: CourseVideo[] = videosData.map((v) => ({
              id: v.id,
              course_id: v.course_id,
              sectionId: v.sectionId,
              title: v.title,
              url: v.url,
              duration: typeof v.duration === 'number' ? String(v.duration) : (v.duration || null),
              order: v.order || 0,
              preview: v.preview ? 1 : 0,
            }));
            setVideos(convertedVideos);
          } else {
            setVideos([]);
          }
        })
        .catch((err) => {
          console.error("Failed to load videos:", err);
        })
        .finally(() => setLoadingVideos(false));
    }
  }, [selectedSectionId, course.id, isNew]);

  const handleCourseChange = (field: keyof Course, value: any) => {
    setCourse((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddSection = () => {
    setSections((prev) => [
      ...prev,
      {
        ...emptySection,
        course_id: course.id ? Number(course.id) : 0,
        order: prev.length + 1,
      } as CourseSection,
    ]);
  };

  const handleSectionChange = (index: number, field: keyof CourseSection, value: any) => {
    setSections((prev) =>
      prev.map((s, i) => (i === index ? { ...s, [field]: value } : s))
    );
  };

  const handleDeleteSection = async (index: number) => {
    const section = sections[index];
    
    // Nếu section đã có id (đã lưu trên server), cần xóa qua API
    if (section.id && course.id) {
      const result = await Swal.fire({
        icon: 'warning',
        title: 'Xác nhận xóa',
        text: 'Bạn có chắc chắn muốn xóa danh mục này?',
        showCancelButton: true,
        confirmButtonText: 'Xóa',
        cancelButtonText: 'Hủy',
        confirmButtonColor: '#ef4444',
        cancelButtonColor: '#6b7280',
      });

      if (!result.isConfirmed) return;

      try {
        await elearningService.deleteSection(Number(course.id), section.id);
        setSections((prev) => prev.filter((_, i) => i !== index));
        
        Swal.fire({
          icon: 'success',
          title: 'Đã xóa!',
          text: 'Danh mục đã được xóa thành công',
          confirmButtonText: 'Đóng',
          timer: 2000,
        });
      } catch (err: any) {
        console.error("Failed to delete section:", err);
        Swal.fire({
          icon: 'error',
          title: 'Lỗi!',
          text: err?.response?.data?.message || err?.message || "Không xóa được danh mục",
          confirmButtonText: 'Đóng',
        });
      }
    } else {
      // Nếu chưa lưu, chỉ xóa khỏi state
      setSections((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const handleSaveSection = async (index: number) => {
    const section = sections[index];
    
    if (!section.title.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Cảnh báo',
        text: 'Vui lòng nhập tên danh mục',
        confirmButtonText: 'Đóng',
      });
      return;
    }

    if (!course.id) {
      Swal.fire({
        icon: 'warning',
        title: 'Cảnh báo',
        text: 'Vui lòng lưu khóa học trước khi thêm danh mục',
        confirmButtonText: 'Đóng',
      });
      return;
    }

    setSavingSectionIndex(index);
    try {
      let savedSection: CourseSection | null;

      if (section.id) {
        // Update existing section
        savedSection = await elearningService.updateSection(
          Number(course.id),
          section.id,
          {
            title: section.title,
            duration: section.duration || null,
            type: section.type || null,
            content: section.content || null,
            order: section.order || index + 1,
          }
        );
      } else {
        // Create new section
        savedSection = await elearningService.createSection({
          course_id: Number(course.id),
          title: section.title,
          duration: section.duration || null,
          type: section.type || null,
          content: section.content || null,
          order: section.order || index + 1,
        });
      }

      if (savedSection) {
        // Update section in state with saved data
        setSections((prev) =>
          prev.map((s, i) => (i === index ? { ...s, ...savedSection } : s))
        );

        Swal.fire({
          icon: 'success',
          title: 'Thành công!',
          text: 'Danh mục đã được lưu thành công',
          confirmButtonText: 'Đóng',
          timer: 2000,
        });
      }
    } catch (err: any) {
      console.error("Failed to save section:", err);
      Swal.fire({
        icon: 'error',
        title: 'Lỗi!',
        text: err?.response?.data?.message || err?.message || "Không lưu được danh mục",
        confirmButtonText: 'Đóng',
      });
    } finally {
      setSavingSectionIndex(null);
    }
  };

  const handleAddVideo = () => {
    if (!selectedSectionId) {
      Swal.fire({
        icon: 'warning',
        title: 'Cảnh báo',
        text: 'Vui lòng chọn danh mục trước khi thêm video',
        confirmButtonText: 'Đóng',
      });
      return;
    }
    if (!course.id) {
      Swal.fire({
        icon: 'warning',
        title: 'Cảnh báo',
        text: 'Vui lòng lưu khóa học trước khi thêm video',
        confirmButtonText: 'Đóng',
      });
      return;
    }
    setNewVideo({
      ...emptyVideo,
      course_id: Number(course.id),
      order: videos.length + 1,
    });
    setShowAddVideoForm(true);
  };

  const handleNewVideoChange = (field: keyof CourseVideo, value: any) => {
    setNewVideo((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveVideo = async () => {
    if (!newVideo.title.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Cảnh báo',
        text: 'Vui lòng nhập tên video',
        confirmButtonText: 'Đóng',
      });
      return;
    }

    if (!newVideo.url.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Cảnh báo',
        text: 'Vui lòng nhập URL video',
        confirmButtonText: 'Đóng',
      });
      return;
    }

    if (!course.id) {
      Swal.fire({
        icon: 'warning',
        title: 'Cảnh báo',
        text: 'Vui lòng lưu khóa học trước',
        confirmButtonText: 'Đóng',
      });
      return;
    }

    setSavingVideo(true);
    try {
      const savedVideo = await adminElearningService.createVideo(
        Number(course.id),
        {
          title: newVideo.title,
          url: newVideo.url,
          duration: typeof newVideo.duration === 'string' ? parseInt(newVideo.duration.replace(/[^0-9]/g, '')) || 0 : (typeof newVideo.duration === 'number' ? newVideo.duration : 0),
          order: newVideo.order || videos.length + 1,
          preview: !!newVideo.preview,
          sectionId: selectedSectionId || undefined,
        }
      );

      if (savedVideo) {
        // Reload videos for current section
        const videosData = await adminElearningService.getVideosByCourse(Number(course.id), selectedSectionId || undefined);
        if (videosData && videosData.length > 0) {
          const convertedVideos: CourseVideo[] = videosData.map((v) => ({
            id: v.id,
            course_id: v.course_id,
            sectionId: v.sectionId,
            title: v.title,
            url: v.url,
            duration: typeof v.duration === 'number' ? String(v.duration) : (v.duration || null),
            order: v.order || 0,
            preview: v.preview ? 1 : 0,
          }));
          setVideos(convertedVideos);
        } else {
          setVideos([]);
        }

        Swal.fire({
          icon: 'success',
          title: 'Thành công!',
          text: 'Video đã được thêm thành công',
          confirmButtonText: 'Đóng',
          timer: 2000,
        });

        setNewVideo(emptyVideo);
        setShowAddVideoForm(false);
      }
    } catch (err: any) {
      console.error("Failed to save video:", err);
      Swal.fire({
        icon: 'error',
        title: 'Lỗi!',
        text: err?.message || "Không lưu được video",
        confirmButtonText: 'Đóng',
      });
    } finally {
      setSavingVideo(false);
    }
  };

  const handleDeleteVideo = async (videoId: number) => {
    const result = await Swal.fire({
      icon: 'warning',
      title: 'Xác nhận xóa',
      text: 'Bạn có chắc chắn muốn xóa video này?',
      showCancelButton: true,
      confirmButtonText: 'Xóa',
      cancelButtonText: 'Hủy',
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
    });

    if (!result.isConfirmed) return;

    try {
      const success = await adminElearningService.deleteVideo(videoId);
      if (success) {
        // Reload videos for current section
        if (course.id) {
          const videosData = await adminElearningService.getVideosByCourse(Number(course.id), selectedSectionId || undefined);
          if (videosData && videosData.length > 0) {
            const convertedVideos: CourseVideo[] = videosData.map((v) => ({
              id: v.id,
              course_id: v.course_id,
              sectionId: v.sectionId,
              title: v.title,
              url: v.url,
              duration: typeof v.duration === 'number' ? String(v.duration) : (v.duration || null),
              order: v.order || 0,
              preview: v.preview ? 1 : 0,
            }));
            setVideos(convertedVideos);
          } else {
            setVideos([]);
          }
        }

        Swal.fire({
          icon: 'success',
          title: 'Đã xóa!',
          text: 'Video đã được xóa thành công',
          confirmButtonText: 'Đóng',
          timer: 2000,
        });
      }
    } catch (err: any) {
      console.error("Failed to delete video:", err);
      Swal.fire({
        icon: 'error',
        title: 'Lỗi!',
        text: err?.message || "Không xóa được video",
        confirmButtonText: 'Đóng',
      });
    }
  };

  const handleSave = async () => {
    // Validation theo API schema
    if (!course.title.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Cảnh báo',
        text: 'Vui lòng nhập tiêu đề khóa học',
        confirmButtonText: 'Đóng',
      });
      return;
    }

    if (!course.description || !course.description.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Cảnh báo',
        text: 'Vui lòng nhập mô tả chi tiết',
        confirmButtonText: 'Đóng',
      });
      return;
    }

    if (!course.category_id || course.category_id === "") {
      Swal.fire({
        icon: 'warning',
        title: 'Cảnh báo',
        text: 'Vui lòng chọn danh mục',
        confirmButtonText: 'Đóng',
      });
      return;
    }

    setSaving(true);
    setError(null);

    try {
      let savedCourse: Course | null;

      if (isNew) {
        // Convert Course to CourseCreatePayload format
        const payload: CourseCreatePayload = {
          title: course.title.trim(),
          shortDescription: course.short_description || undefined,
          description: course.description.trim(),
          categoryId: String(course.category_id),
          thumbnail: course.thumbnail || course.thumbnail_url || null,
          price: course.price ? String(course.price) : undefined,
          level: course.level,
          duration: course.duration || undefined,
          lessons: course.lessons || undefined,
          content: course.content || null,
          status: course.status,
        };

        // Create course
        savedCourse = await elearningService.createCourse(payload);

        console.log("Course created response:", savedCourse);

        if (!savedCourse) {
          throw new Error("Không tạo được khóa học - không có dữ liệu trả về");
        }

        // API trả về id là string, cần convert sang number nếu cần
        const courseId = savedCourse.id ? Number(savedCourse.id) : null;
        if (!courseId) {
          throw new Error("Không tạo được khóa học - thiếu ID");
        }

        // Create sections
        for (let i = 0; i < sections.length; i++) {
          const section = sections[i];
          await elearningService.createSection({
            ...section,
            course_id: courseId,
            order: i + 1,
          });
        }

        // Create videos
        for (let i = 0; i < videos.length; i++) {
          const video = videos[i];
          await elearningService.createVideo({
            ...video,
            course_id: courseId,
            preview: video.preview ? 1 : 0,
            order: i + 1,
          });
        }

        Swal.fire({
          icon: 'success',
          title: 'Thành công!',
          text: 'Khóa học đã được tạo thành công',
          confirmButtonText: 'Đóng',
          timer: 2000,
        }).then(() => {
          navigate("/admin/elearning/courses");
        });
      } else {
        // Update course - convert to API format
        const payload: Partial<CourseCreatePayload> = {
          title: course.title.trim(),
          shortDescription: course.short_description || undefined,
          description: course.description?.trim() || undefined,
          categoryId: course.category_id ? String(course.category_id) : undefined,
          thumbnail: course.thumbnail || course.thumbnail_url || null,
          price: course.price ? String(course.price) : undefined,
          level: course.level,
          duration: course.duration || undefined,
          lessons: course.lessons || undefined,
          content: course.content || null,
          status: course.status,
        };

        savedCourse = await elearningService.updateCourse(id!, payload);

        if (!savedCourse) {
          throw new Error("Không cập nhật được khóa học");
        }

        Swal.fire({
          icon: 'success',
          title: 'Thành công!',
          text: 'Khóa học đã được cập nhật thành công',
          confirmButtonText: 'Đóng',
          timer: 2000,
        });
      }
    } catch (err: any) {
      console.error("Failed to save course:", err);
      const errorMessage =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Không lưu được khóa học. Kiểm tra API.";
      setError(errorMessage);

      Swal.fire({
        icon: 'error',
        title: 'Lỗi!',
        text: errorMessage,
        confirmButtonText: 'Đóng',
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <>
        <PageBreadcrumb
          title="Đang tải..."
          name="Khóa học"
          breadCrumbItems={["Konrix", "Apps", "Khóa học"]}
        />
        <div className="card">
          <div className="p-6 text-center text-slate-600">
            Đang tải thông tin khóa học...
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <PageBreadcrumb
        title={isNew ? "Thêm khóa học" : "Chi tiết khóa học"}
        name="Khóa học"
        breadCrumbItems={[
          "Konrix",
          "Apps",
          "Khóa học",
          isNew ? "Thêm mới" : course.title,
        ]}
      />

      {error && (
        <div className="card mb-6">
          <div className="p-4 bg-rose-50 border border-rose-200 rounded text-rose-700 text-sm">
            {error}
          </div>
        </div>
      )}

      <div className="grid xl:grid-cols-3 grid-cols-1 gap-6 mb-6">
        {/* Main form */}
        <div className="xl:col-span-2 card">
          <div className="card-header flex items-center justify-between">
            <h4 className="card-title mb-0">Thông tin khóa học</h4>
          </div>
          <div className="p-6 space-y-4 text-sm">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-slate-500 mb-1 block">
                  Tiêu đề <span className="text-rose-500">*</span>
                </label>
                <input
                  className="form-input"
                  value={course.title}
                  onChange={(e) => handleCourseChange("title", e.target.value)}
                  placeholder="Nhập tiêu đề khóa học"
                />
              </div>
              <div>
                <label className="text-xs text-slate-500 mb-1 block">
                  Danh mục <span className="text-rose-500">*</span>
                </label>
                <select
                  className="form-select"
                  value={course.category_id || ""}
                  onChange={(e) =>
                    handleCourseChange("category_id", e.target.value)
                  }
                >
                  <option value="">Chọn danh mục</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={String(cat.id)}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs text-slate-500 mb-1 block">
                Mô tả ngắn
              </label>
              <textarea
                className="form-input"
                rows={2}
                value={course.short_description || ""}
                onChange={(e) =>
                  handleCourseChange("short_description", e.target.value)
                }
                placeholder="Mô tả ngắn về khóa học (tối đa 500 ký tự)"
                maxLength={500}
              />
            </div>

            <div>
              <label className="text-xs text-slate-500 mb-1 block">
                Mô tả chi tiết <span className="text-rose-500">*</span>
              </label>
              <textarea
                className="form-input"
                rows={4}
                value={course.description || ""}
                onChange={(e) =>
                  handleCourseChange("description", e.target.value)
                }
                placeholder="Mô tả chi tiết về khóa học"
                required
              />
            </div>

            <div>
              <label className="text-xs text-slate-500 mb-1 block">
                Nội dung khóa học
              </label>
              <textarea
                className="form-input"
                rows={6}
                value={course.content || ""}
                onChange={(e) => handleCourseChange("content", e.target.value)}
                placeholder="Nội dung chi tiết của khóa học (HTML hoặc text)"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-slate-500 mb-1 block">
                  Mức độ
                </label>
                <select
                  className="form-select"
                  value={course.level || "beginner"}
                  onChange={(e) =>
                    handleCourseChange(
                      "level",
                      e.target.value as "beginner" | "intermediate" | "advanced"
                    )
                  }
                >
                  <option value="beginner">Cơ bản</option>
                  <option value="intermediate">Trung cấp</option>
                  <option value="advanced">Nâng cao</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-slate-500 mb-1 block">
                  Trạng thái
                </label>
                <select
                  className="form-select"
                  value={course.status || "active"}
                  onChange={(e) =>
                    handleCourseChange(
                      "status",
                      e.target.value as "active" | "inactive"
                    )
                  }
                >
                  <option value="active">Hoạt động</option>
                  <option value="inactive">Không hoạt động</option>
                </select>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-slate-500 mb-1 block">
                  Thời lượng
                </label>
                <input
                  className="form-input"
                  value={course.duration || ""}
                  onChange={(e) => handleCourseChange("duration", e.target.value)}
                  placeholder="Ví dụ: 24 giờ, 30 phút"
                />
              </div>
              <div>
                <label className="text-xs text-slate-500 mb-1 block">
                  URL hình ảnh thumbnail
                </label>
                <input
                  className="form-input"
                  value={course.thumbnail || course.thumbnail_url || ""}
                  onChange={(e) =>
                    handleCourseChange("thumbnail", e.target.value)
                  }
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="card">
          <div className="card-header">
            <h4 className="card-title mb-0">Giá & thống kê</h4>
          </div>
          <div className="p-6 space-y-4 text-sm">
            <div>
                <label className="text-xs text-slate-500 mb-1 block">
                  Giá bán (VNĐ)
                </label>
              <input
                type="text"
                className="form-input"
                value={course.price || ""}
                onChange={(e) =>
                  handleCourseChange("price", e.target.value)
                }
                placeholder="Để trống nếu không muốn hiển thị giá"
              />
              <p className="text-xs text-slate-400 mt-1">
                Trường này không bắt buộc.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-slate-500 mb-1 block">Số bài học</label>
                <input
                  type="number"
                  className="form-input text-sm"
                  value={course.lessons || 0}
                  onChange={(e) =>
                    handleCourseChange("lessons", Number(e.target.value))
                  }
                  min={0}
                />
              </div>
              <div>
                <label className="text-slate-500 mb-1 block">Học viên</label>
                <input
                  type="number"
                  className="form-input text-sm"
                  value={course.students || 0}
                  onChange={(e) =>
                    handleCourseChange("students", Number(e.target.value))
                  }
                  min={0}
                />
              </div>
            </div>

            <div>
              <label className="text-slate-500 mb-1 block text-xs">
                Đánh giá (0-5)
              </label>
              <input
                type="number"
                className="form-input text-sm"
                value={course.rating || 0}
                onChange={(e) =>
                  handleCourseChange("rating", Number(e.target.value))
                }
                min={0}
                max={5}
                step={0.1}
              />
            </div>

            <button
              type="button"
              className="btn w-full bg-primary text-white text-sm mt-4"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? "Đang lưu..." : isNew ? "Tạo khóa học" : "Lưu thay đổi"}
            </button>
          </div>
        </div>
      </div>

      {/* Sections */}
      <div className="card mb-6">
        <div className="card-header flex items-center justify-between">
          <h4 className="card-title mb-0">Danh mục khóa học (Sections)</h4>
          <button
            type="button"
            className="btn btn-sm bg-emerald-500 text-white text-xs"
            onClick={handleAddSection}
          >
            <i className="mgc_add_circle_line mr-1" />
            Thêm danh mục
          </button>
        </div>
        <div className="p-6 space-y-4">
          {sections.map((section, index) => (
            <div
              key={index}
              className="border border-slate-200 dark:border-slate-700 rounded-lg p-4"
            >
              <div className="grid md:grid-cols-2 gap-4 mb-3">
                <div>
                  <label className="text-xs text-slate-500 mb-1 block">
                    Tên danh mục
                  </label>
                  <input
                    className="form-input text-sm"
                    value={section.title}
                    onChange={(e) =>
                      handleSectionChange(index, "title", e.target.value)
                    }
                    placeholder="Tên danh mục"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-500 mb-1 block">
                    Thời lượng
                  </label>
                  <input
                    className="form-input text-sm"
                    value={section.duration || ""}
                    onChange={(e) =>
                      handleSectionChange(index, "duration", e.target.value)
                    }
                    placeholder="Ví dụ: 2 giờ"
                  />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4 mb-3">
                <div>
                  <label className="text-xs text-slate-500 mb-1 block">
                    Loại
                  </label>
                  <input
                    className="form-input text-sm"
                    value={section.type || ""}
                    onChange={(e) =>
                      handleSectionChange(index, "type", e.target.value)
                    }
                    placeholder="Loại danh mục"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-500 mb-1 block">
                    Thứ tự
                  </label>
                  <input
                    type="number"
                    className="form-input text-sm"
                    value={section.order || 0}
                    onChange={(e) =>
                      handleSectionChange(index, "order", Number(e.target.value))
                    }
                    min={0}
                  />
                </div>
              </div>
              <div className="mb-3">
                <label className="text-xs text-slate-500 mb-1 block">
                  Nội dung
                </label>
                <textarea
                  className="form-input text-sm"
                  rows={2}
                  value={section.content || ""}
                  onChange={(e) =>
                    handleSectionChange(index, "content", e.target.value)
                  }
                  placeholder="Nội dung danh mục"
                />
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="btn btn-xs bg-primary text-white text-xs"
                  onClick={() => handleSaveSection(index)}
                  disabled={savingSectionIndex === index}
                >
                  {savingSectionIndex === index ? (
                    <>
                      <i className="mgc_loading_3_line animate-spin mr-1" />
                      Đang lưu...
                    </>
                  ) : (
                    <>
                      <i className="mgc_save_line mr-1" />
                      Lưu danh mục
                    </>
                  )}
                </button>
                <button
                  type="button"
                  className="btn btn-xs bg-rose-50 text-rose-600 text-xs"
                  onClick={() => handleDeleteSection(index)}
                  disabled={savingSectionIndex === index}
                >
                  <i className="mgc_delete_line mr-1" />
                  Xóa danh mục
                </button>
              </div>
            </div>
          ))}
          {sections.length === 0 && (
            <p className="text-sm text-slate-500 text-center py-4">
              Chưa có danh mục nào. Nhấn "Thêm danh mục" để bắt đầu.
            </p>
          )}
        </div>
      </div>

      {/* Sections Selector & Videos/Lessons */}
      <div className="card">
        <div className="card-header flex items-center justify-between">
          <h4 className="card-title mb-0">Video & Bài học theo danh mục</h4>
          <div className="flex items-center gap-2">
            {sections.length > 0 && (
              <select
                className="form-select text-sm"
                value={selectedSectionId || ""}
                onChange={(e) => {
                  const sectionId = e.target.value ? Number(e.target.value) : null;
                  setSelectedSectionId(sectionId);
                  setShowAddVideoForm(false);
                }}
              >
                <option value="">Chọn danh mục để xem videos/bài học</option>
                {sections.map((section) => (
                  <option key={section.id || `section-${section.title}`} value={section.id || ""}>
                    {section.title}
                  </option>
                ))}
              </select>
            )}
            {selectedSectionId && course.id && (
              <button
                type="button"
                className="btn btn-sm bg-emerald-500 text-white text-xs"
                onClick={handleAddVideo}
              >
                <i className="mgc_add_circle_line mr-1" />
                Thêm video
              </button>
            )}
          </div>
        </div>
        <div className="p-6">
          {!isNew && course.id && sections.length === 0 && (
            <div className="text-center py-8 text-slate-500">
              <p className="mb-2">Chưa có danh mục nào cho khóa học này.</p>
              <p className="text-sm">Vui lòng thêm danh mục ở phần trên để quản lý videos và bài học.</p>
            </div>
          )}
          
          {selectedSectionId && (
            <div className="space-y-6">
              {/* Bộ lọc và tìm kiếm videos */}
              <div className="flex items-center gap-3 mb-4">
                <div className="flex-1 relative">
                  <span className="absolute inset-y-0 left-3 flex items-center text-slate-400 text-sm">
                    <i className="mgc_search_3_line" />
                  </span>
                  <input
                    type="text"
                    className="form-input pl-9 pr-3 py-2 text-sm w-full"
                    placeholder="Tìm kiếm video theo tên hoặc URL..."
                    value={videoSearchTerm}
                    onChange={(e) => setVideoSearchTerm(e.target.value)}
                  />
                </div>
                {videoSearchTerm && (
                  <button
                    type="button"
                    className="btn btn-sm border text-xs"
                    onClick={() => setVideoSearchTerm("")}
                  >
                    <i className="mgc_close_line mr-1" />
                    Xóa
                  </button>
                )}
              </div>

              {/* Form thêm video mới */}
              {showAddVideoForm && (
                <div className="border-2 border-dashed border-emerald-300 rounded-lg p-4 bg-emerald-50/50">
                  <h5 className="text-sm font-semibold mb-3 text-slate-700">
                    <i className="mgc_add_circle_line mr-2" />
                    Thêm video mới vào danh mục này
                  </h5>
                  <div className="space-y-3">
                    <div className="grid md:grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-slate-500 mb-1 block">
                          Tên video <span className="text-rose-500">*</span>
                        </label>
                        <input
                          className="form-input text-sm"
                          value={newVideo.title}
                          onChange={(e) => handleNewVideoChange("title", e.target.value)}
                          placeholder="Tên video"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-slate-500 mb-1 block">
                          URL video <span className="text-rose-500">*</span>
                        </label>
                        <input
                          className="form-input text-sm"
                          value={newVideo.url}
                          onChange={(e) => handleNewVideoChange("url", e.target.value)}
                          placeholder="https://youtube.com/watch?v=..."
                        />
                      </div>
                    </div>
                    <div className="grid md:grid-cols-3 gap-3">
                      <div>
                        <label className="text-xs text-slate-500 mb-1 block">
                          Thời lượng (giây)
                        </label>
                        <input
                          type="number"
                          className="form-input text-sm"
                          value={typeof newVideo.duration === 'string' ? parseInt(newVideo.duration.replace(/[^0-9]/g, '')) || '' : (newVideo.duration || '')}
                          onChange={(e) => handleNewVideoChange("duration", e.target.value ? Number(e.target.value) : 0)}
                          placeholder="Ví dụ: 600"
                          min={0}
                        />
                      </div>
                      <div>
                        <label className="text-xs text-slate-500 mb-1 block">
                          Thứ tự
                        </label>
                        <input
                          type="number"
                          className="form-input text-sm"
                          value={newVideo.order || 0}
                          onChange={(e) => handleNewVideoChange("order", Number(e.target.value))}
                          min={0}
                        />
                      </div>
                      <div className="flex items-end">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={!!newVideo.preview}
                            onChange={(e) => handleNewVideoChange("preview", e.target.checked ? 1 : 0)}
                            className="form-checkbox"
                          />
                          <span className="text-xs text-slate-500">Xem trước</span>
                        </label>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        className="btn btn-xs bg-primary text-white text-xs"
                        onClick={handleSaveVideo}
                        disabled={savingVideo}
                      >
                        {savingVideo ? (
                          <>
                            <i className="mgc_loading_3_line animate-spin mr-1" />
                            Đang lưu...
                          </>
                        ) : (
                          <>
                            <i className="mgc_save_line mr-1" />
                            Lưu video
                          </>
                        )}
                      </button>
                      <button
                        type="button"
                        className="btn btn-xs bg-slate-100 text-slate-600 text-xs"
                        onClick={() => {
                          setShowAddVideoForm(false);
                          setNewVideo(emptyVideo);
                        }}
                        disabled={savingVideo}
                      >
                        <i className="mgc_close_line mr-1" />
                        Hủy
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Lessons của section được chọn */}
              {lessons.filter(l => l.sectionId === selectedSectionId).length > 0 && (
                <div>
                  <h5 className="text-sm font-semibold mb-3 text-slate-700">
                    <i className="mgc_book_2_line mr-2" />
                    Bài học trong danh mục này ({lessons.filter(l => l.sectionId === selectedSectionId).length})
                  </h5>
                  <div className="space-y-2">
                    {lessons
                      .filter(l => l.sectionId === selectedSectionId)
                      .sort((a, b) => (a.order || 0) - (b.order || 0))
                      .map((lesson) => (
                        <div
                          key={lesson.id}
                          className="border border-slate-200 rounded-lg p-3 bg-slate-50"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h6 className="text-sm font-medium text-slate-700 mb-1">
                                {lesson.title}
                              </h6>
                              <div className="flex items-center gap-3 text-xs text-slate-500">
                                {lesson.duration && (
                                  <span>
                                    <i className="mgc_time_line mr-1" />
                                    {lesson.duration}
                                  </span>
                                )}
                                {lesson.type && (
                                  <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded">
                                    {lesson.type}
                                  </span>
                                )}
                                {lesson.order !== undefined && (
                                  <span>Thứ tự: {lesson.order}</span>
                                )}
                              </div>
                              {lesson.content && (
                                <p className="text-xs text-slate-600 mt-2 line-clamp-2">
                                  {lesson.content}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* Videos của section được chọn */}
              {loadingVideos ? (
                <div className="text-center py-8 text-slate-500">
                  <i className="mgc_loading_3_line animate-spin text-2xl mb-2" />
                  <p className="text-sm">Đang tải videos...</p>
                </div>
              ) : (
                <>
                  {(() => {
                    // Filter videos by search term
                    const filteredVideos = videos.filter((video) => {
                      if (!videoSearchTerm.trim()) return true;
                      const searchLower = videoSearchTerm.toLowerCase();
                      return (
                        video.title.toLowerCase().includes(searchLower) ||
                        (video.url && video.url.toLowerCase().includes(searchLower))
                      );
                    });

                    if (filteredVideos.length > 0) {
                      return (
                        <div>
                          <h5 className="text-sm font-semibold mb-3 text-slate-700">
                            <i className="mgc_video_line mr-2" />
                            Videos trong danh mục này ({filteredVideos.length}
                            {videoSearchTerm && ` / ${videos.length} tổng`})
                          </h5>
                          <div className="space-y-3">
                            {filteredVideos
                              .sort((a, b) => (a.order || 0) - (b.order || 0))
                              .map((video, index) => (
                        <div
                          key={video.id || index}
                          className="border border-slate-200 rounded-lg p-3 bg-white"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <h6 className="text-sm font-medium text-slate-700 mb-1">
                                {video.title}
                              </h6>
                              <div className="flex items-center gap-3 text-xs text-slate-500 mb-2">
                                {video.duration && (
                                  <span>
                                    <i className="mgc_time_line mr-1" />
                                    {video.duration}
                                  </span>
                                )}
                                {video.order !== undefined && (
                                  <span>Thứ tự: {video.order}</span>
                                )}
                                {video.preview && (
                                  <span className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded">
                                    Xem trước
                                  </span>
                                )}
                              </div>
                              {video.url && (
                                <a
                                  href={video.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-xs text-blue-600 hover:underline"
                                >
                                  <i className="mgc_link_line mr-1" />
                                  {video.url}
                                </a>
                              )}
                            </div>
                            <div className="ml-2">
                              <button
                                type="button"
                                className="btn btn-xs bg-rose-50 text-rose-600 text-xs"
                                onClick={() => video.id && handleDeleteVideo(video.id)}
                              >
                                <i className="mgc_delete_line mr-1" />
                                Xóa
                              </button>
                            </div>
                          </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    } else if (videoSearchTerm) {
                      return (
                        <div className="text-center py-8 text-slate-500">
                          <p className="mb-2">Không tìm thấy video nào phù hợp với "{videoSearchTerm}".</p>
                          <button
                            type="button"
                            className="btn btn-xs border text-xs mt-2"
                            onClick={() => setVideoSearchTerm("")}
                          >
                            Xóa bộ lọc
                          </button>
                        </div>
                      );
                    } else {
                      return null;
                    }
                  })()}
                </>
              )}

              {lessons.filter(l => l.sectionId === selectedSectionId).length === 0 && 
               (!loadingVideos && videos.length === 0) && (
                <div className="text-center py-8 text-slate-500">
                  <p className="mb-2">Danh mục này chưa có bài học hoặc video nào.</p>
                  <p className="text-sm">Vui lòng thêm bài học hoặc video cho danh mục này.</p>
                </div>
              )}
            </div>
          )}

          {!selectedSectionId && sections.length > 0 && (
            <div className="text-center py-8 text-slate-500">
              <p>Vui lòng chọn một danh mục ở trên để xem videos và bài học.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CourseDetailAdmin;
