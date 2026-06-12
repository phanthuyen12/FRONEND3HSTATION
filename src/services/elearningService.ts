// services/ElearningService.ts

export interface Category {
  id: string | number;
  name: string;
  courseCount?: number;
}

export interface Course {
  id?: number | string;
  title: string;
  short_description?: string | null;
  description?: string | null;
  category_id?: number | string;
  categoryId?: string;
  category?: string;
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
  can_view_full?: boolean;
  is_locked?: boolean;
}

// API Payload interface - matches backend validation
export interface CourseCreatePayload {
  title: string;
  shortDescription?: string;
  description: string;
  categoryId: string;
  thumbnail?: string | null;
  price?: string;
  level?: 'beginner' | 'intermediate' | 'advanced';
  duration?: string;
  lessons?: number;
  content?: string | null;
  status?: 'active' | 'inactive';
}

export interface CourseSection {
  id?: number;
  sectionId?: number;
  course_id: number;
  title: string;
  duration?: string | null;
  type?: string | null;
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
  duration?: string | null;
  order?: number;
  preview?: boolean | number;
  created_at?: string;
  updated_at?: string;
}

class ElearningService {
  private api: string;

  constructor(apiUrl: string = 'https://api.aetrading.vn') {
    this.api = apiUrl;
  }

  private getAuthToken(): string | null {
    if (typeof window === 'undefined') return null;

    return localStorage.getItem('auth_token')
      || localStorage.getItem('authToken')
      || sessionStorage.getItem('auth_token')
      || sessionStorage.getItem('authToken');
  }

  // Helper fetch wrapper
  private async request<T>(url: string, options?: RequestInit): Promise<T> {
    try {
      const token = this.getAuthToken();
      const requestHeaders: HeadersInit = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options?.headers || {}),
      };

      const { headers: _ignoredHeaders, ...restOptions } = options || {};

      const res = await fetch(url, {
        headers: requestHeaders,
        ...restOptions,
      });

      const data = await res.json();

      if (!res.ok) {
        console.error('❌ API error:', data);
        throw new Error(data?.message || 'API Error');
      }

      return data;
    } catch (error: any) {
      console.error('❌ Fetch failed:', error);
      throw error;
    }
  }

  // Lấy danh sách category
  async getCategories(): Promise<Category[]> {
    const url = `${this.api}/api/elearning/categories`;
    console.log('🔵 Calling API:', url);

    const response = await this.request<{ success: boolean; data: any }>(url);

    // Backend có thể trả về { success: true, data: {data: [], total: 0} }
    if (response.success && response.data) {
      if (Array.isArray(response.data.data)) return response.data.data;
      if (Array.isArray(response.data)) return response.data;
    }
    return [];
  }

  // Lấy danh sách course
  async getCourses(): Promise<Course[]> {
    const url = `${this.api}/api/elearning/courses`;
    const response = await this.request<{ success: boolean; data: { data: Course[] } } | Course[]>(url);

    // Response structure có thể là: { success: true, data: { data: Course[] } }
    if (response && typeof response === 'object' && 'success' in response) {
      if (response.success && response.data?.data && Array.isArray(response.data.data)) {
        return response.data.data;
      }
      if (response.data && Array.isArray(response.data)) {
        return response.data as Course[];
      }
    }

    // Fallback: nếu response là array trực tiếp
    if (Array.isArray(response)) {
      return response;
    }

    return [];
  }

  // Lấy chi tiết course
  async getCourseDetail(id: string): Promise<Course | null> {
    try {
      const url = `${this.api}/api/elearning/courses/${id}`;
      const response = await this.request<Course>(url);
      return response;
    } catch (error) {
      return null;
    }
  }

  // Tạo category
  async createCategory(payload: { name: string }): Promise<Category | null> {
    const url = `${this.api}/api/elearning/categories`;
    const response = await this.request<Category>(url, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    return response || null;
  }

  // Cập nhật category
  async updateCategory(id: string, payload: { name: string }): Promise<Category | null> {
    const url = `${this.api}/api/elearning/categories/${id}`;
    const response = await this.request<Category>(url, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
    return response || null;
  }

  // Xóa category
  async deleteCategory(id: string): Promise<boolean> {
    try {
      const url = `${this.api}/api/elearning/categories/${id}`;
      await this.request(url, { method: 'DELETE' });
      return true;
    } catch (error) {
      return false;
    }
  }

  // Tạo course
  async createCourse(payload: CourseCreatePayload): Promise<Course | null> {
    const url = `${this.api}/api/elearning/courses`;
    const response = await this.request<{ success: boolean; data: { data: Course } }>(url, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    // Response structure: { success: true, data: { data: Course } }
    if (response?.success && response?.data?.data) {
      return response.data.data;
    }
    if (response?.data) {
      // Fallback: nếu response.data là Course trực tiếp
      return response.data as any;
    }
    return null;
  }

  // Cập nhật course
  async updateCourse(id: string | number, payload: Partial<CourseCreatePayload>): Promise<Course | null> {
    const url = `${this.api}/api/elearning/courses/${id}`;
    const response = await this.request<{ success: boolean; data: { data: Course } }>(url, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
    // Response structure: { success: true, data: { data: Course } }
    if (response?.success && response?.data?.data) {
      return response.data.data;
    }
    if (response?.data) {
      // Fallback: nếu response.data là Course trực tiếp
      return response.data as any;
    }
    return null;
  }

  // Lấy chi tiết course
  async getCourse(id: string | number): Promise<Course | null> {
    try {
      const url = `${this.api}/api/elearning/courses/${id}`;
      const response = await this.request<{ success: boolean; data: { data: Course } }>(url);
      // Response structure: { success: true, data: { data: Course } }
      if (response?.success && response?.data?.data) {
        return response.data.data;
      }
      if (response?.data) {
        // Fallback: nếu response.data là Course trực tiếp
        return response.data as any;
      }
      return null;
    } catch (error) {
      return null;
    }
  }

  // Xóa course
  async deleteCourse(id: string | number): Promise<boolean> {
    try {
      const url = `${this.api}/api/elearning/courses/${id}`;
      await this.request(url, { method: 'DELETE' });
      return true;
    } catch (error) {
      return false;
    }
  }

  // Tạo section
  async createSection(payload: CourseSection): Promise<CourseSection | null> {
    const url = `${this.api}/api/elearning/courses/${payload.course_id}/sections`;
    const response = await this.request<{ success: boolean; data: CourseSection }>(url, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    return response?.data || response || null;
  }

  // Cập nhật section
  async updateSection(courseId: number, sectionId: number, payload: Partial<CourseSection>): Promise<CourseSection | null> {
    const url = `${this.api}/api/elearning/courses/${courseId}/sections/${sectionId}`;
    const response = await this.request<{ success: boolean; data: CourseSection }>(url, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
    return response?.data || response || null;
  }

  // Xóa section
  async deleteSection(courseId: number, sectionId: number): Promise<boolean> {
    try {
      const url = `${this.api}/api/elearning/courses/${courseId}/sections/${sectionId}`;
      await this.request(url, { method: 'DELETE' });
      return true;
    } catch (error) {
      return false;
    }
  }

  // Tạo video
  async createVideo(payload: CourseVideo): Promise<CourseVideo | null> {
    const url = `${this.api}/api/elearning/courses/${payload.course_id}/videos`;
    // Convert camelCase to snake_case for API
    const apiPayload: any = { ...payload };
    if (payload.sectionId !== undefined) {
      apiPayload.section_id = payload.sectionId;
      delete apiPayload.sectionId;
    }
    const response = await this.request<{ success: boolean; data: CourseVideo }>(url, {
      method: 'POST',
      body: JSON.stringify(apiPayload),
    });
    // Convert snake_case to camelCase
    const video = response?.data || response;
    if (video && (video as any).section_id !== undefined) {
      (video as any).sectionId = (video as any).section_id;
      delete (video as any).section_id;
    }
    return video || null;
  }

  // Cập nhật video
  async updateVideo(courseId: number, videoId: number, payload: Partial<CourseVideo>): Promise<CourseVideo | null> {
    const url = `${this.api}/api/elearning/courses/${courseId}/videos/${videoId}`;
    // Convert camelCase to snake_case for API
    const apiPayload: any = { ...payload };
    if (payload.sectionId !== undefined) {
      apiPayload.section_id = payload.sectionId;
      delete apiPayload.sectionId;
    }
    const response = await this.request<{ success: boolean; data: CourseVideo }>(url, {
      method: 'PUT',
      body: JSON.stringify(apiPayload),
    });
    // Convert snake_case to camelCase
    const video = response?.data || response;
    if (video && (video as any).section_id !== undefined) {
      (video as any).sectionId = (video as any).section_id;
      delete (video as any).section_id;
    }
    return video || null;
  }

  // Xóa video
  async deleteVideo(courseId: number, videoId: number): Promise<boolean> {
    try {
      const url = `${this.api}/api/elearning/courses/${courseId}/videos/${videoId}`;
      await this.request(url, { method: 'DELETE' });
      return true;
    } catch (error) {
      return false;
    }
  }

  // CLIENT APIs
  async getClientCategories(): Promise<Category[]> {
    const url = `${this.api}/api/client/elearning/categories`;
    const response = await this.request<{ success: boolean; data: { data: Category[]; total?: number } | Category[] } | Category[]>(url);

    if (response && typeof response === 'object' && 'success' in response) {
      if (response.success) {
        // Xử lý nested data.data
        if (response.data && typeof response.data === 'object' && 'data' in response.data && Array.isArray((response.data as any).data)) {
          return (response.data as any).data;
        }
        // Xử lý data là array trực tiếp
        if (Array.isArray(response.data)) {
          return response.data;
        }
      }
    }

    if (Array.isArray(response)) {
      return response;
    }

    return [];
  }

  async getClientCourses(params?: {
    category?: string;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<{ data: Course[]; pagination?: { page: number; limit: number; total: number; totalPages: number } }> {
    const queryParams = new URLSearchParams();
    if (params?.category) queryParams.append("category", params.category);
    if (params?.search) queryParams.append("search", params.search);
    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());

    const queryString = queryParams.toString();
    const url = `${this.api}/api/client/elearning/courses${queryString ? `?${queryString}` : ""}`;

    const response = await this.request<{ success: boolean; data: { data: Course[]; total?: number; pagination?: { page: number; limit: number; total: number; totalPages: number } } | Course[]; pagination?: { page: number; limit: number; total: number; totalPages: number } } | { data: Course[]; pagination?: { page: number; limit: number; total: number; totalPages: number } }>(url);

    if (response && typeof response === 'object' && 'success' in response) {
      if (response.success) {
        // Xử lý nested data.data
        if (response.data && typeof response.data === 'object' && 'data' in response.data && Array.isArray((response.data as any).data)) {
          const nestedData = response.data as any;
          return {
            data: nestedData.data,
            pagination: nestedData.pagination || (nestedData.total ? {
              page: params?.page || 1,
              limit: params?.limit || 20,
              total: nestedData.total,
              totalPages: Math.ceil(nestedData.total / (params?.limit || 20)),
            } : undefined),
          };
        }
        // Xử lý data là array trực tiếp
        if (Array.isArray(response.data)) {
          return {
            data: response.data,
            pagination: response.pagination,
          };
        }
      }
    }

    if (Array.isArray((response as any).data)) {
      return response as { data: Course[]; pagination?: { page: number; limit: number; total: number; totalPages: number } };
    }

    return { data: [] };
  }

  async getClientCourse(id: string): Promise<Course | null> {
    try {
      const url = `${this.api}/api/client/elearning/courses/${id}`;
      const token = this.getAuthToken();
      const res = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      const body = await res.json();

      if (!res.ok) {
        console.error('❌ API error:', body);
        const error: any = new Error(body?.message || 'API Error');
        error.status = res.status;
        throw error;
      }

      // Handle nested data structure: {success: true, data: {data: {...}}}
      if (body.success && body.data) {
        // Check if data.data exists (nested structure)
        if (body.data.data && typeof body.data.data === 'object' && 'id' in body.data.data) {
          return body.data.data as Course;
        }
        // If data is Course directly
        if (body.data && typeof body.data === 'object' && 'id' in body.data) {
          return body.data as Course;
        }
      }

      // Fallback: if body is Course directly
      if (body && typeof body === 'object' && 'id' in body) {
        return body as Course;
      }

      return null;
    } catch (error) {
      if ((error as any)?.status === 403 || /quyền|forbidden/i.test((error as any)?.message || '')) {
        throw error;
      }
      console.error('❌ Fetch failed:', error);
      return null;
    }
  }

  async getClientCourseSections(courseId: string | number): Promise<CourseSection[]> {
    try {
      const url = `${this.api}/api/elearning/courses/${courseId}/sections`;
      const response = await this.request<{ success: boolean; data: CourseSection[] } | CourseSection[]>(url);

      if (response && typeof response === 'object' && 'success' in response) {
        if (response.success && Array.isArray(response.data)) {
          return response.data;
        }
      }

      if (Array.isArray(response)) {
        return response;
      }

      return [];
    } catch (error) {
      return [];
    }
  }

  async getClientCourseVideos(courseId: string | number): Promise<CourseVideo[]> {
    try {
      // Get token from localStorage để backend có thể kiểm tra enrollment
      const token = localStorage.getItem('auth_token')
        || localStorage.getItem('authToken')
        || sessionStorage.getItem('auth_token')
        || sessionStorage.getItem('authToken');

      const url = `${this.api}/api/elearning/courses/${courseId}/videos`;
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('❌ API error:', data);
        return [];
      }

      const normalize = (items: any[]): CourseVideo[] =>
        (items || []).map((item) => {
          const normalized: any = { ...item };
          if (item.section_id !== undefined) {
            normalized.sectionId = item.section_id;
          }
          if (item.preview !== undefined) {
            normalized.preview = item.preview === true || item.preview === 1;
          }
          return normalized as CourseVideo;
        });

      // Handle response structure
      if (data && typeof data === 'object' && 'success' in data) {
        if (data.success && Array.isArray(data.data)) {
          return normalize(data.data);
        }
      }

      if (Array.isArray(data)) {
        return normalize(data);
      }

      return [];
    } catch (error) {
      console.error('❌ Fetch failed:', error);
      return [];
    }
  }

  async checkEnrollment(courseId: string | number): Promise<{ isEnrolled: boolean }> {
    try {
      // Get token from localStorage - try both possible keys
      const token = localStorage.getItem('auth_token')
        || localStorage.getItem('authToken')
        || sessionStorage.getItem('auth_token')
        || sessionStorage.getItem('authToken');

      const url = `${this.api}/api/client/elearning/courses/${courseId}/enrollment`;
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
      });
      const data = await response.json();
      if (data.success && data.data) {
        return data.data;
      }
      return { isEnrolled: false };
    } catch (error) {
      return { isEnrolled: false };
    }
  }

  async enrollCourse(courseId: string | number): Promise<{ enrollment: any; order: any; payment: any; message: string }> {
    try {
      // Get token from localStorage - try both possible keys
      // authService uses 'auth_token' key
      const token = localStorage.getItem('auth_token')
        || localStorage.getItem('authToken')
        || sessionStorage.getItem('auth_token')
        || sessionStorage.getItem('authToken');

      if (!token) {
        throw new Error('Bạn cần đăng nhập để đăng ký khóa học. Vui lòng đăng nhập lại.');
      }

      const url = `${this.api}/api/client/elearning/courses/${courseId}/enroll`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
        }
        throw new Error(data.message || 'Đăng ký khóa học thất bại');
      }

      if (data.success && data.data) {
        return data.data;
      }
      return data;
    } catch (error: any) {
      console.error('Enroll course error:', error);
      throw error;
    }
  }

  async getMyCourses(): Promise<Course[]> {
    try {
      // Get token from localStorage - try both possible keys
      // authService uses 'auth_token' key
      const token = localStorage.getItem('auth_token')
        || localStorage.getItem('authToken')
        || sessionStorage.getItem('auth_token')
        || sessionStorage.getItem('authToken');

      if (!token) {
        console.warn('No token found, returning empty courses list');
        return [];
      }

      const url = `${this.api}/api/client/users/me/my-courses`;
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          console.warn('Unauthorized, returning empty courses list');
          return [];
        }
        throw new Error(data.message || 'Không thể lấy danh sách khóa học');
      }

      if (data.success && data.data) {
        // Handle nested structure: data.data.data or direct array
        if (Array.isArray(data.data)) {
          return data.data;
        }
        // If data.data is an object with a data property (nested structure)
        if (data.data.data && Array.isArray(data.data.data)) {
          return data.data.data;
        }
        return [];
      }

      // Fallback: if data is array directly
      if (Array.isArray(data)) {
        return data;
      }

      return [];
    } catch (error: any) {
      console.error('Get my courses error:', error);
      return [];
    }
  }
}

export default ElearningService;
