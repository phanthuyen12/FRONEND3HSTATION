export interface Document {
  id: string;
  title: string;
  description: string;
  fileUrl: string;
  courseId?: string | null;
  categoryId?: string | null;
  categoryName?: string | null;
  status?: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

interface ApiResponse<T> {
  success?: boolean;
  data: T;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

class DocumentService {
  private api: string;

  constructor(apiUrl: string = "") {
    this.api = apiUrl;
  }

  private async request<T>(url: string, options?: RequestInit): Promise<T> {
    try {
      const res = await fetch(this.api + url, {
        headers: {
          "Content-Type": "application/json",
        },
        ...options,
      });

      const body: ApiResponse<T> = await res.json();

      if (!res.ok) {
        console.error("❌ API error:", body);
        throw new Error(body?.message || "API Error");
      }

      // Handle nested data structure: {success: true, data: {data: {...}}}
      if (body.data && typeof body.data === 'object' && 'data' in body.data) {
        return (body.data as any).data;
      }
      
      return body.data;
    } catch (error) {
      console.error("❌ Fetch failed:", error);
      throw error;
    }
  }

  // CLIENT - Get documents (only active)
  async getClientDocuments(params?: {
    page?: number;
    limit?: number;
    categoryId?: string;
    search?: string;
  }): Promise<{ data: Document[]; pagination?: { page: number; limit: number; total: number; totalPages: number } }> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.categoryId) queryParams.append("category_id", params.categoryId);
    if (params?.search) queryParams.append("search", params.search);

    const queryString = queryParams.toString();
    const url = `/api/client/documents${queryString ? `?${queryString}` : ""}`;
    
    try {
      const res = await fetch(this.api + url, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      const body: ApiResponse<{ data: Document[]; pagination?: { page: number; limit: number; total: number; totalPages: number } }> = await res.json();

      if (!res.ok) {
        console.error("❌ API error:", body);
        throw new Error(body?.message || "API Error");
      }

      // Handle nested data structure: {success: true, data: {data: [...], pagination: {...}}}
      let responseData = body.data;
      if (responseData && typeof responseData === 'object' && 'data' in responseData) {
        // Already nested, use as is
        const nested = responseData as any;
        return {
          data: Array.isArray(nested.data) ? nested.data : [],
          pagination: nested.pagination
        };
      }
      
      // If data is array directly
      if (Array.isArray(responseData)) {
        return {
          data: responseData,
          pagination: {
            page: params?.page || 1,
            limit: params?.limit || 20,
            total: responseData.length,
            totalPages: Math.ceil(responseData.length / (params?.limit || 20)),
          },
        };
      }
      
      // Default fallback
      return {
        data: [],
        pagination: {
          page: params?.page || 1,
          limit: params?.limit || 20,
          total: 0,
          totalPages: 0,
        },
      };
    } catch (error) {
      console.error("❌ Fetch failed:", error);
      throw error;
    }
  }

  async getClientDocument(id: string): Promise<Document | null> {
    if (!id || id === 'undefined') {
      return null;
    }
    try {
      const data = await this.request<Document>(`/api/client/documents/${id}`);
      return data;
    } catch (error) {
      return null;
    }
  }

  // ADMIN - Get all documents
  async getDocuments(params?: {
    page?: number;
    limit?: number;
    categoryId?: string;
    status?: string;
    search?: string;
  }): Promise<{ data: Document[]; pagination?: { page: number; limit: number; total: number; totalPages: number } }> {
    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.categoryId) queryParams.append("category_id", params.categoryId);
    if (params?.status) queryParams.append("status", params.status);
    if (params?.search) queryParams.append("search", params.search);

    const queryString = queryParams.toString();
    const url = `${this.api}/api/documents${queryString ? `?${queryString}` : ""}`;
    
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
      },
    });
    
    const data = await response.json();
    if (data.success && data.data) {
      return {
        data: Array.isArray(data.data) ? data.data : data.data.data || [],
        pagination: data.data.pagination || data.pagination
      };
    }
    
    return { data: [] };
  }

  async getDocument(id: string): Promise<Document | null> {
    try {
      const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
      const url = `${this.api}/api/documents/${id}`;
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : '',
        },
      });
      const data = await response.json();
      if (data.success && data.data) {
        return data.data;
      }
      return null;
    } catch (error) {
      return null;
    }
  }

  async createDocument(payload: {
    title: string;
    description?: string;
    fileUrl: string;
    courseId?: string | null;
    categoryId?: string | null;
    status?: 'active' | 'inactive';
  }): Promise<Document | null> {
    try {
      const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
      const url = `${this.api}/api/documents`;
      console.log('Creating document at:', url, 'with payload:', payload);
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : '',
        },
        body: JSON.stringify({
          title: payload.title,
          description: payload.description || '',
          file_url: payload.fileUrl,
          course_id: payload.courseId,
          category_id: payload.categoryId,
          status: payload.status || 'active'
        }),
      });
      
      const data = await response.json();
      console.log('Create document response:', data);
      
      if (data.success && data.data) {
        return data.data;
      }
      throw new Error(data.message || 'Không thể tạo tài liệu');
    } catch (error: any) {
      console.error('Create document error:', error);
      throw error;
    }
  }

  async updateDocument(id: string, payload: {
    title?: string;
    description?: string;
    fileUrl?: string;
    courseId?: string | null;
    categoryId?: string | null;
    status?: 'active' | 'inactive';
  }): Promise<Document | null> {
    if (!id || id === 'undefined' || id === 'new') {
      console.error('Invalid document ID for update:', id);
      throw new Error('ID tài liệu không hợp lệ');
    }
    
    try {
      const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
      const url = `${this.api}/api/documents/${id}`;
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : '',
        },
        body: JSON.stringify({
          title: payload.title,
          description: payload.description,
          file_url: payload.fileUrl,
          course_id: payload.courseId,
          category_id: payload.categoryId,
          status: payload.status
        }),
      });
      const data = await response.json();
      if (data.success && data.data) {
        return data.data;
      }
      throw new Error(data.message || 'Không thể cập nhật tài liệu');
    } catch (error: any) {
      console.error('Update document error:', error);
      throw error;
    }
  }

  async deleteDocument(id: string): Promise<boolean> {
    try {
      const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
      const url = `${this.api}/api/documents/${id}`;
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : '',
        },
      });
      const data = await response.json();
      return data.success || response.ok;
    } catch (error) {
      return false;
    }
  }
}

export default DocumentService;

