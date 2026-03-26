// services/adminElearningService.ts
// Service cho các API admin elearning: courses, categories, sections, lessons và videos

export interface Category {
  id: string | number;
  name: string;
  courseCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Course {
  id?: number | string;
  title: string;
  short_description?: string | null;
  description?: string | null;
  category_id?: number | string;
  categoryId?: string;
  category?: string | Category;
  is_free?: boolean | number;
  price: number | string;
  level?: 'beginner' | 'intermediate' | 'advanced';
  students?: number;
  rating?: number | string;
  duration?: string | null;
  lessons?: number;
  status?: 'active' | 'inactive';
  content?: string | null;
  thumbnail_url?: string | null;
  thumbnail?: string | null;
  created_at?: string;
  updated_at?: string;
  createdAt?: string;
  updatedAt?: string;
  sections?: CourseSection[];
}

export interface CourseSection {
  id?: number;
  sectionId?: number;
  course_id: number;
  title: string;
  order?: number;
  created_at?: string;
  updated_at?: string;
  lessons?: CourseLesson[];
}

export interface CourseLesson {
  id?: number;
  sectionId: number;
  course_id: number;
  title: string;
  duration?: string | null;
  type?: 'video' | 'text' | 'quiz';
  content?: string | null;
  order?: number;
  created_at?: string;
  updated_at?: string;
}

export interface CourseVideo {
  id?: number;
  course_id: number;
  sectionId?: number;
  title: string;
  url: string;
  duration?: number | string | null;
  order?: number;
  preview?: boolean | number;
  created_at?: string;
  updated_at?: string;
}

export interface CourseCreatePayload {
  title: string;
  shortDescription?: string;
  description: string;
  categoryId: string;
  thumbnail?: string | null;
  price: string;
  level?: 'beginner' | 'intermediate' | 'advanced';
  duration?: string;
  lessons?: number;
  content?: string | null;
  status?: 'active' | 'inactive';
}

export interface VideoCreatePayload {
  title: string;
  url: string;
  duration: number;
  order: number;
  preview: boolean;
  sectionId?: number;
}

export interface VideoUpdatePayload {
  title?: string;
  url?: string;
  duration?: number;
  order?: number;
  preview?: boolean;
  sectionId?: number;
}

export interface SectionCreatePayload {
  title: string;
  order?: number;
}

export interface SectionUpdatePayload {
  title?: string;
  order?: number;
}

export interface LessonCreatePayload {
  course_id: number;
  sectionId: number;
  title: string;
  duration?: string;
  type?: 'video' | 'text' | 'quiz';
  content?: string;
  order?: number;
}

export interface LessonUpdatePayload {
  title?: string;
  duration?: string;
  type?: 'video' | 'text' | 'quiz';
  content?: string;
  order?: number;
}

export interface CourseListParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
}

export interface CourseStats {
  totalCourses: number;
  totalStudents: number;
}

export interface PaginationResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

class AdminElearningService {
  private api: string;
  private AUTH_SESSION_KEY = 'konrix_user';

  constructor() {
    this.api = 'http://api.3hstation.com';
  }

  // Helper để lấy token từ sessionStorage
  private getToken(): string | null {
    try {
      const userStr = sessionStorage.getItem(this.AUTH_SESSION_KEY);
      if (userStr) {
        const user = JSON.parse(userStr);
        return user?.token || null;
      }
    } catch (error) {
      console.error('Error getting token:', error);
    }
    return null;
  }

  // Helper fetch wrapper với authentication
  private async request<T>(url: string, options?: RequestInit): Promise<T> {
    try {
      const token = this.getToken();
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(options?.headers as Record<string, string>),
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const res = await fetch(url, {
        ...options,
        headers,
      });

      const data = await res.json();

      if (!res.ok) {
        console.error('❌ API error:', {
          status: res.status,
          statusText: res.statusText,
          url,
          data,
        });
        throw new Error(data?.message || `API Error: ${res.status}`);
      }

      return data;
    } catch (error: any) {
      console.error('❌ Fetch failed:', {
        url,
        error: error?.message || error,
        stack: error?.stack,
      });
      throw error;
    }
  }

  // ==================== COURSE APIs ====================

  /**
   * Lấy danh sách courses (admin)
   * GET /api/elearning/courses
   */
  async getCourses(params?: CourseListParams): Promise<PaginationResponse<Course>> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.search) queryParams.append('search', params.search);
    if (params?.category) queryParams.append('category', params.category);

    const url = `${this.api}/api/elearning/courses${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    console.log('🔵 Calling API:', url);

    const response = await this.request<{ success: boolean; data: Course[]; pagination: any }>(url);
    
    if (response.success && response.data) {
      return {
        data: Array.isArray(response.data) ? response.data : [],
        pagination: response.pagination || { page: 1, limit: 20, total: 0, totalPages: 0 },
      };
    }
    
    return {
      data: [],
      pagination: { page: 1, limit: 20, total: 0, totalPages: 0 },
    };
  }

  /**
   * Lấy chi tiết course (admin)
   * GET /api/elearning/courses/:id
   */
  async getCourseDetail(id: string | number): Promise<Course | null> {
    try {
      const url = `${this.api}/api/elearning/courses/${id}`;
      const response = await this.request<{ success: boolean; data: { data: Course } | Course }>(url);
      
      if (response.success && response.data) {
        if ('data' in response.data) {
          return response.data.data as Course;
        }
        return response.data as Course;
      }
      return null;
    } catch (error) {
      console.error('Error getting course detail:', error);
      return null;
    }
  }

  /**
   * Tạo course mới (admin)
   * POST /api/elearning/courses
   */
  async createCourse(payload: CourseCreatePayload): Promise<Course | null> {
    try {
      const url = `${this.api}/api/elearning/courses`;
      const response = await this.request<{ success: boolean; data: { data: Course } | Course; message?: string }>(url, {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      
      if (response.success && response.data) {
        if ('data' in response.data) {
          return response.data.data as Course;
        }
        return response.data as Course;
      }
      return null;
    } catch (error) {
      console.error('Error creating course:', error);
      throw error;
    }
  }

  /**
   * Cập nhật course (admin)
   * PUT /api/elearning/courses/:id
   */
  async updateCourse(id: string | number, payload: Partial<CourseCreatePayload>): Promise<Course | null> {
    try {
      const url = `${this.api}/api/elearning/courses/${id}`;
      const response = await this.request<{ success: boolean; data: { data: Course } | Course; message?: string }>(url, {
        method: 'PUT',
        body: JSON.stringify(payload),
      });
      
      if (response.success && response.data) {
        if ('data' in response.data) {
          return response.data.data as Course;
        }
        return response.data as Course;
      }
      return null;
    } catch (error) {
      console.error('Error updating course:', error);
      throw error;
    }
  }

  /**
   * Xóa course (admin)
   * DELETE /api/elearning/courses/:id
   */
  async deleteCourse(id: string | number): Promise<boolean> {
    try {
      const url = `${this.api}/api/elearning/courses/${id}`;
      await this.request<{ success: boolean; message?: string }>(url, {
        method: 'DELETE',
      });
      return true;
    } catch (error) {
      console.error('Error deleting course:', error);
      return false;
    }
  }

  /**
   * Lấy thống kê courses (admin)
   * GET /api/elearning/courses/stats
   */
  async getCourseStats(): Promise<CourseStats | null> {
    try {
      const url = `${this.api}/api/elearning/courses/stats`;
      const response = await this.request<{ success: boolean; data: CourseStats }>(url);
      
      if (response.success && response.data) {
        return response.data;
      }
      return null;
    } catch (error) {
      console.error('Error getting course stats:', error);
      return null;
    }
  }

  // ==================== CATEGORY APIs ====================

  /**
   * Lấy danh sách categories (có thể lọc theo course)
   * GET /api/elearning/categories
   */
  async getCategories(): Promise<Category[]> {
    try {
      const url = `${this.api}/api/elearning/categories`;
      const response = await this.request<{ success: boolean; data: Category[] | { data: Category[]; total: number } }>(url);
      
      if (response.success && response.data) {
        if (Array.isArray(response.data)) {
          return response.data;
        }
        if ('data' in response.data && Array.isArray(response.data.data)) {
          return response.data.data;
        }
      }
      return [];
    } catch (error) {
      console.error('Error getting categories:', error);
      return [];
    }
  }

  /**
   * Lấy danh mục theo khoá học (lấy category của một course cụ thể)
   */
  async getCategoryByCourse(courseId: string | number): Promise<Category | null> {
    try {
      const course = await this.getCourseDetail(courseId);
      if (course && course.categoryId) {
        const categories = await this.getCategories();
        return categories.find(cat => cat.id.toString() === course.categoryId?.toString()) || null;
      }
      return null;
    } catch (error) {
      console.error('Error getting category by course:', error);
      return null;
    }
  }

  /**
   * Tạo danh mục mới (admin)
   * POST /api/elearning/categories
   */
  async createCategory(payload: { name: string }): Promise<Category | null> {
    try {
      const url = `${this.api}/api/elearning/categories`;
      const response = await this.request<{ success: boolean; data: Category; message?: string }>(url, {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      
      if (response.success && response.data) {
        return response.data;
      }
      return null;
    } catch (error) {
      console.error('Error creating category:', error);
      throw error;
    }
  }

  /**
   * Cập nhật danh mục (admin)
   * PUT /api/elearning/categories/:id
   */
  async updateCategory(categoryId: string | number, payload: { name: string }): Promise<Category | null> {
    try {
      const url = `${this.api}/api/elearning/categories/${categoryId}`;
      const response = await this.request<{ success: boolean; data: Category; message?: string }>(url, {
        method: 'PUT',
        body: JSON.stringify(payload),
      });
      
      if (response.success && response.data) {
        return response.data;
      }
      return null;
    } catch (error) {
      console.error('Error updating category:', error);
      throw error;
    }
  }

  /**
   * Xóa danh mục (admin)
   * DELETE /api/elearning/categories/:id
   */
  async deleteCategory(categoryId: string | number): Promise<boolean> {
    try {
      const url = `${this.api}/api/elearning/categories/${categoryId}`;
      await this.request<{ success: boolean; message?: string }>(url, {
        method: 'DELETE',
      });
      return true;
    } catch (error) {
      console.error('Error deleting category:', error);
      return false;
    }
  }

  /**
   * Lấy thống kê danh mục (admin)
   * GET /api/elearning/categories/stats
   */
  async getCategoryStats(): Promise<{ totalCourses: number; totalCategories: number; avgPerCategory: number } | null> {
    try {
      const url = `${this.api}/api/elearning/categories/stats`;
      const response = await this.request<{ success: boolean; data: { totalCourses: number; totalCategories: number; avgPerCategory: number } }>(url);
      
      if (response.success && response.data) {
        return response.data;
      }
      return null;
    } catch (error) {
      console.error('Error getting category stats:', error);
      return null;
    }
  }

  // ==================== VIDEO APIs ====================

  /**
   * Lấy danh sách videos theo khoá học
   * GET /api/elearning/courses/:course_id/videos
   * @param courseId - ID của khoá học
   * @param sectionId - (Optional) ID của section để lọc videos
   */
  async getVideosByCourse(courseId: string | number, sectionId?: number): Promise<CourseVideo[]> {
    try {
      const queryParams = new URLSearchParams();
      if (sectionId !== undefined && sectionId !== null) {
        queryParams.append('sectionId', sectionId.toString());
      }
      const url = `${this.api}/api/elearning/courses/${courseId}/videos${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
      const response = await this.request<{ success: boolean; data: CourseVideo[] }>(url);
      
      if (response.success && response.data) {
        // Convert snake_case to camelCase
        return (Array.isArray(response.data) ? response.data : []).map((video: any) => {
          if (video.section_id !== undefined) {
            video.sectionId = video.section_id;
            delete video.section_id;
          }
          return video as CourseVideo;
        });
      }
      return [];
    } catch (error) {
      console.error('Error getting videos by course:', error);
      return [];
    }
  }

  /**
   * Tạo video mới cho khoá học (admin)
   * POST /api/elearning/courses/:course_id/videos
   */
  async createVideo(courseId: string | number, payload: VideoCreatePayload): Promise<CourseVideo | null> {
    try {
      const url = `${this.api}/api/elearning/courses/${courseId}/videos`;
      // Convert camelCase to snake_case for API
      const apiPayload: any = {
        title: payload.title,
        url: payload.url,
        duration: payload.duration,
        order: payload.order,
        preview: payload.preview,
      };
      if (payload.sectionId !== undefined) {
        apiPayload.sectionId = payload.sectionId;
      }
      
      const response = await this.request<{ success: boolean; data: CourseVideo; message?: string }>(url, {
        method: 'POST',
        body: JSON.stringify(apiPayload),
      });
      
      if (response.success && response.data) {
        // Convert snake_case to camelCase
        const video = response.data as any;
        if (video.section_id !== undefined) {
          video.sectionId = video.section_id;
          delete video.section_id;
        }
        return video as CourseVideo;
      }
      return null;
    } catch (error) {
      console.error('Error creating video:', error);
      throw error;
    }
  }

  /**
   * Cập nhật video (admin)
   * PUT /api/videos/:id
   */
  async updateVideo(videoId: string | number, payload: VideoUpdatePayload): Promise<CourseVideo | null> {
    try {
      const url = `${this.api}/api/videos/${videoId}`;
      // Convert camelCase to snake_case for API
      const apiPayload: any = { ...payload };
      if (payload.sectionId !== undefined) {
        apiPayload.section_id = payload.sectionId;
        delete apiPayload.sectionId;
      }
      
      const response = await this.request<{ success: boolean; data: CourseVideo; message?: string }>(url, {
        method: 'PUT',
        body: JSON.stringify(apiPayload),
      });
      
      if (response.success && response.data) {
        // Convert snake_case to camelCase
        const video = response.data as any;
        if (video.section_id !== undefined) {
          video.sectionId = video.section_id;
          delete video.section_id;
        }
        return video as CourseVideo;
      }
      return null;
    } catch (error) {
      console.error('Error updating video:', error);
      throw error;
    }
  }

  /**
   * Xóa video (admin)
   * DELETE /api/videos/:id
   */
  async deleteVideo(videoId: string | number): Promise<boolean> {
    try {
      const url = `${this.api}/api/videos/${videoId}`;
      await this.request<{ success: boolean; message?: string }>(url, {
        method: 'DELETE',
      });
      return true;
    } catch (error) {
      console.error('Error deleting video:', error);
      return false;
    }
  }

  // ==================== SECTION APIs ====================

  /**
   * Lấy danh sách sections theo khoá học
   * GET /api/elearning/courses/:course_id/sections
   * 
   * @param courseId - ID của khoá học (string hoặc number)
   * @returns Promise<CourseSection[]> - Danh sách sections kèm lessons
   * 
   * @example
   * ```typescript
   * const sections = await adminElearningService.getSectionsByCourse(1);
   * console.log('Sections:', sections);
   * ```
   */
  async getSectionsByCourse(courseId: string | number): Promise<CourseSection[]> {
    try {
      const url = `${this.api}/api/elearning/courses/${courseId}/sections`;
      console.log('🔵 [getSectionsByCourse] Calling API:', url);
      console.log('🔵 [getSectionsByCourse] Course ID:', courseId, 'Type:', typeof courseId);
      
      const response = await this.request<{ success: boolean; data: CourseSection[] }>(url);
      console.log('🔵 [getSectionsByCourse] Raw response:', JSON.stringify(response, null, 2));
      
      if (response && response.success !== undefined) {
        if (response.success && response.data) {
          let sections: any[] = [];
          if (Array.isArray(response.data)) {
            sections = response.data;
          } else if (typeof response.data === 'object' && 'data' in response.data) {
            const nestedData = (response.data as any).data;
            if (Array.isArray(nestedData)) {
              sections = nestedData;
            }
          }
          // Convert snake_case to camelCase
          return sections.map((section: any) => {
            if (section.section_id !== undefined) {
              section.sectionId = section.section_id;
              delete section.section_id;
            }
            // Also convert lessons if present
            if (section.lessons && Array.isArray(section.lessons)) {
              section.lessons = section.lessons.map((lesson: any) => {
                if (lesson.section_id !== undefined) {
                  lesson.sectionId = lesson.section_id;
                  delete lesson.section_id;
                }
                return lesson;
              });
            }
            return section as CourseSection;
          });
        } else if (response.success === false) {
          console.warn('⚠️ [getSectionsByCourse] API returned success: false');
        }
      }
      
      // Nếu response không có format chuẩn, thử parse trực tiếp
      if (Array.isArray(response)) {
        console.log('✅ [getSectionsByCourse] Response is direct array:', response.length);
        return (response as any[]).map((section: any) => {
          if (section.section_id !== undefined) {
            section.sectionId = section.section_id;
            delete section.section_id;
          }
          return section as CourseSection;
        });
      }
      
      console.warn('⚠️ [getSectionsByCourse] No sections found or invalid response format');
      console.warn('⚠️ [getSectionsByCourse] Response type:', typeof response);
      console.warn('⚠️ [getSectionsByCourse] Response keys:', response ? Object.keys(response) : 'null');
      return [];
    } catch (error: any) {
      console.error('❌ [getSectionsByCourse] Error getting sections by course:', error);
      console.error('❌ [getSectionsByCourse] Error message:', error?.message);
      console.error('❌ [getSectionsByCourse] Error stack:', error?.stack);
      return [];
    }
  }

  /**
   * Lấy chi tiết một section
   * GET /api/elearning/sections/:id
   */
  async getSectionDetail(sectionId: string | number): Promise<CourseSection | null> {
    try {
      const url = `${this.api}/api/elearning/sections/${sectionId}`;
      const response = await this.request<{ success: boolean; data: CourseSection }>(url);
      
      if (response.success && response.data) {
        // Convert snake_case to camelCase
        const section = response.data as any;
        if (section.section_id !== undefined) {
          section.sectionId = section.section_id;
          delete section.section_id;
        }
        // Also convert lessons if present
        if (section.lessons && Array.isArray(section.lessons)) {
          section.lessons = section.lessons.map((lesson: any) => {
            if (lesson.section_id !== undefined) {
              lesson.sectionId = lesson.section_id;
              delete lesson.section_id;
            }
            return lesson;
          });
        }
        return section as CourseSection;
      }
      return null;
    } catch (error) {
      console.error('Error getting section detail:', error);
      return null;
    }
  }

  /**
   * Tạo section mới cho khoá học (admin)
   * POST /api/elearning/courses/:course_id/sections
   */
  async createSection(courseId: string | number, payload: SectionCreatePayload): Promise<CourseSection | null> {
    try {
      const url = `${this.api}/api/elearning/courses/${courseId}/sections`;
      const response = await this.request<{ success: boolean; data: CourseSection; message?: string }>(url, {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      
      if (response.success && response.data) {
        return response.data;
      }
      return null;
    } catch (error) {
      console.error('Error creating section:', error);
      throw error;
    }
  }

  /**
   * Cập nhật section (admin)
   * PUT /api/elearning/sections/:id
   */
  async updateSection(sectionId: string | number, payload: SectionUpdatePayload): Promise<CourseSection | null> {
    try {
      const url = `${this.api}/api/elearning/sections/${sectionId}`;
      const response = await this.request<{ success: boolean; data: CourseSection; message?: string }>(url, {
        method: 'PUT',
        body: JSON.stringify(payload),
      });
      
      if (response.success && response.data) {
        return response.data;
      }
      return null;
    } catch (error) {
      console.error('Error updating section:', error);
      throw error;
    }
  }

  /**
   * Xóa section (admin)
   * DELETE /api/elearning/sections/:id
   */
  async deleteSection(sectionId: string | number): Promise<boolean> {
    try {
      const url = `${this.api}/api/elearning/sections/${sectionId}`;
      await this.request<{ success: boolean; message?: string }>(url, {
        method: 'DELETE',
      });
      return true;
    } catch (error) {
      console.error('Error deleting section:', error);
      return false;
    }
  }

  // ==================== LESSON APIs ====================

  /**
   * Lấy danh sách lessons theo section
   * GET /api/elearning/sections/:section_id/lessons
   */
  async getLessonsBySection(sectionId: string | number): Promise<CourseLesson[]> {
    try {
      const url = `${this.api}/api/elearning/sections/${sectionId}/lessons`;
      const response = await this.request<{ success: boolean; data: CourseLesson[] }>(url);
      
      if (response.success && response.data) {
        // Convert snake_case to camelCase
        return (Array.isArray(response.data) ? response.data : []).map((lesson: any) => {
          if (lesson.section_id !== undefined) {
            lesson.sectionId = lesson.section_id;
            delete lesson.section_id;
          }
          return lesson as CourseLesson;
        });
      }
      return [];
    } catch (error) {
      console.error('Error getting lessons by section:', error);
      return [];
    }
  }

  /**
   * Lấy danh sách lessons theo khoá học
   * GET /api/elearning/courses/:course_id/lessons
   */
  async getLessonsByCourse(courseId: string | number): Promise<CourseLesson[]> {
    try {
      const url = `${this.api}/api/elearning/courses/${courseId}/lessons`;
      const response = await this.request<{ success: boolean; data: CourseLesson[] }>(url);
      
      if (response.success && response.data) {
        // Convert snake_case to camelCase
        return (Array.isArray(response.data) ? response.data : []).map((lesson: any) => {
          if (lesson.section_id !== undefined) {
            lesson.sectionId = lesson.section_id;
            delete lesson.section_id;
          }
          return lesson as CourseLesson;
        });
      }
      return [];
    } catch (error) {
      console.error('Error getting lessons by course:', error);
      return [];
    }
  }

  /**
   * Lấy chi tiết một lesson
   * GET /api/elearning/lessons/:id
   */
  async getLessonDetail(lessonId: string | number): Promise<CourseLesson | null> {
    try {
      const url = `${this.api}/api/elearning/lessons/${lessonId}`;
      const response = await this.request<{ success: boolean; data: CourseLesson }>(url);
      
      if (response.success && response.data) {
        // Convert snake_case to camelCase
        const lesson = response.data as any;
        if (lesson.section_id !== undefined) {
          lesson.sectionId = lesson.section_id;
          delete lesson.section_id;
        }
        return lesson as CourseLesson;
      }
      return null;
    } catch (error) {
      console.error('Error getting lesson detail:', error);
      return null;
    }
  }

  /**
   * Tạo lesson mới cho section (admin)
   * POST /api/elearning/sections/:section_id/lessons
   */
  async createLesson(sectionId: string | number, payload: LessonCreatePayload): Promise<CourseLesson | null> {
    try {
      const url = `${this.api}/api/elearning/sections/${sectionId}/lessons`;
      // Convert camelCase to snake_case for API
      const apiPayload: any = { ...payload };
      if (payload.sectionId !== undefined) {
        apiPayload.section_id = payload.sectionId;
        delete apiPayload.sectionId;
      }
      
      const response = await this.request<{ success: boolean; data: CourseLesson; message?: string }>(url, {
        method: 'POST',
        body: JSON.stringify(apiPayload),
      });
      
      if (response.success && response.data) {
        // Convert snake_case to camelCase
        const lesson = response.data as any;
        if (lesson.section_id !== undefined) {
          lesson.sectionId = lesson.section_id;
          delete lesson.section_id;
        }
        return lesson as CourseLesson;
      }
      return null;
    } catch (error) {
      console.error('Error creating lesson:', error);
      throw error;
    }
  }

  /**
   * Cập nhật lesson (admin)
   * PUT /api/elearning/lessons/:id
   */
  async updateLesson(lessonId: string | number, payload: LessonUpdatePayload): Promise<CourseLesson | null> {
    try {
      const url = `${this.api}/api/elearning/lessons/${lessonId}`;
      const response = await this.request<{ success: boolean; data: CourseLesson; message?: string }>(url, {
        method: 'PUT',
        body: JSON.stringify(payload),
      });
      
      if (response.success && response.data) {
        return response.data;
      }
      return null;
    } catch (error) {
      console.error('Error updating lesson:', error);
      throw error;
    }
  }

  /**
   * Xóa lesson (admin)
   * DELETE /api/elearning/lessons/:id
   */
  async deleteLesson(lessonId: string | number): Promise<boolean> {
    try {
      const url = `${this.api}/api/elearning/lessons/${lessonId}`;
      await this.request<{ success: boolean; message?: string }>(url, {
        method: 'DELETE',
      });
      return true;
    } catch (error) {
      console.error('Error deleting lesson:', error);
      return false;
    }
  }
}

export default AdminElearningService;


