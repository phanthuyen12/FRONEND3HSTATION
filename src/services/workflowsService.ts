export interface WorkflowCategory {
  id: string;
  name: string;
  workflowCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Workflow {
  id?: string;
  name: string;
  description?: string;
  category_id?: string;
  categoryId?: string;
  category?: string;
  image?: string;
  price?: string;
  tags?: string[] | string; // Có thể là array hoặc JSON string
  content?: string;
  status?: string;
  created_at?: string;
  updated_at?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface ApiResponse<T> {
  success?: boolean;
  data: T;
  message?: string;
  total?: number;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

class WorkflowsService {
  private api: string;

  constructor(apiUrl: string = "") {
    this.api = apiUrl; // ví dụ: 'https://api.3hstation.com'
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

      return body.data;
    } catch (error) {
      console.error("❌ Fetch failed:", error);
      throw error;
    }
  }

  // ADMIN - Categories
  async fetchCategories(): Promise<WorkflowCategory[]> {
    const response = await this.request<WorkflowCategory[] | { data: WorkflowCategory[]; total: number }>("/api/workflows/categories");
    // Xử lý cả 2 trường hợp: response là array hoặc object có data
    if (Array.isArray(response)) {
      return response;
    }
    return response.data || [];
  }

  async createCategory(payload: { name: string }): Promise<WorkflowCategory> {
    return await this.request<WorkflowCategory>("/api/workflows/categories", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }

  async updateCategory(id: string, payload: { name: string }): Promise<WorkflowCategory> {
    return await this.request<WorkflowCategory>(`/api/workflows/categories/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  }

  async deleteCategory(id: string): Promise<void> {
    await this.request<void>(`/api/workflows/categories/${id}`, {
      method: "DELETE",
    });
  }

  async getCategoryStats(): Promise<{ totalWorkflows: number; totalCategories: number; avgPerCategory: number }> {
    return await this.request<{ totalWorkflows: number; totalCategories: number; avgPerCategory: number }>("/api/workflows/categories/stats");
  }

  // ADMIN - Workflows
  async fetchAdminWorkflows(params?: {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
  }): Promise<{ data: Workflow[]; pagination: { page: number; limit: number; total: number; totalPages: number } }> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.search) queryParams.append("search", params.search);
    if (params?.category) queryParams.append("category", params.category);

    const queryString = queryParams.toString();
    const url = `/api/workflows${queryString ? `?${queryString}` : ""}`;

    const response = await this.request<{ data: Workflow[]; pagination: { page: number; limit: number; total: number; totalPages: number } } | { data: Workflow[]; pagination?: { page: number; limit: number; total: number; totalPages: number } }>(url);

    // Xử lý response có thể không có pagination (stub)
    if (response.pagination) {
      return response as { data: Workflow[]; pagination: { page: number; limit: number; total: number; totalPages: number } };
    }

    // Nếu không có pagination, tạo pagination mặc định
    const data = response.data || [];
    return {
      data,
      pagination: {
        page: params?.page || 1,
        limit: params?.limit || 20,
        total: data.length,
        totalPages: Math.ceil(data.length / (params?.limit || 20)),
      },
    };
  }

  async getWorkflow(id: string): Promise<Workflow> {
    return await this.request<Workflow>(`/api/workflows/${id}`);
  }

  async createWorkflow(payload: {
    name: string;
    description?: string;
    categoryId: string;
    image?: string;
    price: string;
    tags?: string[];
    content?: string;
    status?: string;
  }): Promise<Workflow> {
    // API backend yêu cầu categoryId và price là required
    const formattedPayload = {
      name: payload.name,
      description: payload.description || undefined,
      categoryId: payload.categoryId,
      image: payload.image || undefined,
      price: payload.price,
      tags: payload.tags || undefined,
      content: payload.content || undefined,
      status: payload.status || 'active',
    };
    return await this.request<Workflow>("/api/workflows", {
      method: "POST",
      body: JSON.stringify(formattedPayload),
    });
  }

  async updateWorkflow(id: string, payload: Partial<{
    name?: string;
    description?: string;
    categoryId?: string;
    image?: string;
    price?: string;
    tags?: string[];
    content?: string;
    status?: string;
  }>): Promise<Workflow> {
    // API backend dùng categoryId, không phải category_id
    const formattedPayload: any = {};
    if (payload.name !== undefined) formattedPayload.name = payload.name;
    if (payload.description !== undefined) formattedPayload.description = payload.description;
    if (payload.categoryId !== undefined) formattedPayload.categoryId = payload.categoryId;
    if (payload.image !== undefined) formattedPayload.image = payload.image;
    if (payload.price !== undefined) formattedPayload.price = payload.price;
    if (payload.tags !== undefined) formattedPayload.tags = payload.tags;
    if (payload.content !== undefined) formattedPayload.content = payload.content;
    if (payload.status !== undefined) formattedPayload.status = payload.status;

    return await this.request<Workflow>(`/api/workflows/${id}`, {
      method: "PUT",
      body: JSON.stringify(formattedPayload),
    });
  }

  async deleteWorkflow(id: string): Promise<void> {
    await this.request<void>(`/api/workflows/${id}`, {
      method: "DELETE",
    });
  }

  async getWorkflowStats(): Promise<{ totalWorkflows: number; totalActive: number; totalInactive: number }> {
    return await this.request<{ totalWorkflows: number; totalActive: number; totalInactive: number }>("/api/workflows/stats");
  }

  // CLIENT - Workflows
  async fetchClientWorkflows(params?: {
    category?: string;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<{ data: Workflow[]; pagination?: { page: number; limit: number; total: number; totalPages: number } }> {
    const queryParams = new URLSearchParams();
    if (params?.category) queryParams.append("category", params.category);
    if (params?.search) queryParams.append("search", params.search);
    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());

    const queryString = queryParams.toString();
    const url = `/api/client/workflows${queryString ? `?${queryString}` : ""}`;

    const response = await this.request<{ data: Workflow[]; pagination?: { page: number; limit: number; total: number; totalPages: number } } | Workflow[]>(url);

    if (Array.isArray(response)) {
      return {
        data: response,
        pagination: {
          page: params?.page || 1,
          limit: params?.limit || 20,
          total: response.length,
          totalPages: Math.ceil(response.length / (params?.limit || 20)),
        },
      };
    }

    return response as { data: Workflow[]; pagination?: { page: number; limit: number; total: number; totalPages: number } };
  }

  async getClientWorkflow(id: string): Promise<Workflow | null> {
    try {
      const data = await this.request<Workflow>(`/api/client/workflows/${id}`);
      return data;
    } catch (error) {
      return null;
    }
  }

  async registerWorkflow(id: string): Promise<{ registration: any; order: any; message: string }> {
    try {
      // Get token from localStorage - check all possible keys
      // authService uses 'auth_token' key
      const token = localStorage.getItem('auth_token')
        || localStorage.getItem('authToken')
        || sessionStorage.getItem('auth_token')
        || sessionStorage.getItem('authToken');

      if (!token) {
        throw new Error('Bạn cần đăng nhập để đăng ký workflow. Vui lòng đăng nhập lại.');
      }

      const url = `${this.api}/api/client/workflows/${id}/register`;
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
        throw new Error(data.message || 'Đăng ký workflow thất bại');
      }

      if (data.success && data.data) {
        return data.data;
      }
      return data;
    } catch (error: any) {
      console.error('Register workflow error:', error);
      throw error;
    }
  }

  async getMyWorkflows(params?: {
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<{ data: any[]; pagination?: { page: number; limit: number; total: number; totalPages: number } }> {
    try {
      // Try multiple token keys to find the correct one
      const token = localStorage.getItem('auth_token')
        || localStorage.getItem('authToken')
        || sessionStorage.getItem('auth_token')
        || sessionStorage.getItem('authToken');

      if (!token) {
        return { data: [] };
      }

      const queryParams = new URLSearchParams();
      if (params?.status) queryParams.append('status', params.status);
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.limit) queryParams.append('limit', params.limit.toString());

      const queryString = queryParams.toString();
      const url = `${this.api}/api/client/workflows/my-workflows${queryString ? `?${queryString}` : ''}`;
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.success && data.data) {
        return {
          data: Array.isArray(data.data) ? data.data : [],
          pagination: data.pagination
        };
      }
      return { data: [] };
    } catch (error) {
      return { data: [] };
    }
  }

  // Workflow Links Management
  async getWorkflowLinks(workflowId: string, status?: 'chua-ban' | 'da-ban'): Promise<any[]> {
    const params = status ? `?status=${status}` : '';
    const response = await this.request<{ data: any[] }>(`/api/workflows/${workflowId}/links${params}`);
    return response.data || [];
  }

  async addWorkflowLinksBulk(workflowId: string, links: string[]): Promise<any[]> {
    const response = await this.request<{ data: any[] }>(`/api/workflows/${workflowId}/links/bulk`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ links }),
    });
    return response.data || [];
  }

  async addWorkflowLink(workflowId: string, downloadLink: string): Promise<any> {
    const response = await this.request<{ data: any }>(`/api/workflows/${workflowId}/links`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ downloadLink }),
    });
    return response.data;
  }

  async updateWorkflowLink(linkId: string, data: { downloadLink?: string; status?: 'chua-ban' | 'da-ban' }): Promise<any> {
    const response = await this.request<{ data: any }>(`/api/workflows/links/${linkId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return response.data;
  }

  async deleteWorkflowLink(linkId: string): Promise<void> {
    await this.request(`/api/workflows/links/${linkId}`, {
      method: 'DELETE',
    });
  }
}

export default WorkflowsService;

