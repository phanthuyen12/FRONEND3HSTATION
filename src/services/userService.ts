export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  balance?: number;
  status?: 'active' | 'locked';
  role?: string;
  permissions?: string[];
  rankId?: string | number | null;
  rank_id?: string | number | null;
  rank_code?: string | null;
  rank_name?: string | null;
  rank_description?: string | null;
  rank_status?: string | null;
  createdAt?: string;
  updatedAt?: string;
  joinedAt?: string;
}

export interface UserDetail extends User {
  total?: number;
  courses?: number;
  workflows?: number;
  vps?: number;
  rank?: {
    id?: string | number | null;
    code?: string | null;
    name?: string | null;
    description?: string | null;
    status?: string | null;
  } | null;
}

export interface ReferralUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  balance?: number;
  status?: string;
  createdAt?: string;
}

export interface MyReferralResponse {
  refCode?: string | null;
  refCount?: number;
  refCommission?: number;
  registerPath?: string | null;
  referrals: ReferralUser[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
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

class UserService {
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

      return body.data;
    } catch (error) {
      console.error("❌ Fetch failed:", error);
      throw error;
    }
  }

  private getAuthToken(): string | null {
    return localStorage.getItem('auth_token')
      || localStorage.getItem('authToken')
      || sessionStorage.getItem('auth_token')
      || sessionStorage.getItem('authToken');
  }

  // ADMIN - Users
  async fetchUsers(params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
  }): Promise<{ data: User[]; pagination: { page: number; limit: number; total: number; totalPages: number } }> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.search) queryParams.append("search", params.search);
    if (params?.status) queryParams.append("status", params.status);

    const queryString = queryParams.toString();
    const url = `/api/users${queryString ? `?${queryString}` : ""}`;
    
    const response = await this.request<{ data: User[]; pagination: { page: number; limit: number; total: number; totalPages: number } } | { data: User[]; pagination?: { page: number; limit: number; total: number; totalPages: number } }>(url);
    
    if (response.pagination) {
      return response as { data: User[]; pagination: { page: number; limit: number; total: number; totalPages: number } };
    }
    
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

  async getUser(id: string): Promise<UserDetail> {
    return await this.request<UserDetail>(`/api/users/${id}`);
  }

  async createUser(payload: {
    name: string;
    email: string;
    phone?: string;
    password: string;
    status?: string;
    role?: string;
    permissions?: string[];
    rankId?: string | number | null;
  }): Promise<User> {
    return await this.request<User>("/api/users", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }

  async updateUser(id: string, payload: Partial<{
    name?: string;
    email?: string;
    phone?: string;
    status?: string;
    role?: string;
    permissions?: string[];
    rankId?: string | number | null;
  }>): Promise<User> {
    return await this.request<User>(`/api/users/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  }

  async deleteUser(id: string): Promise<void> {
    await this.request<void>(`/api/users/${id}`, {
      method: "DELETE",
    });
  }

  async toggleLockUser(id: string, status: 'active' | 'locked'): Promise<User> {
    return await this.request<User>(`/api/users/${id}/toggle-lock`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
  }

  async adjustBalance(id: string, payload: {
    amount: number;
    type: 'add' | 'subtract' | 'set';
    note?: string;
  }): Promise<User> {
    return await this.request<User>(`/api/users/${id}/balance`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
  }

  async getStats(): Promise<{ totalUsers: number; totalActive: number; totalLocked: number }> {
    return await this.request<{ totalUsers: number; totalActive: number; totalLocked: number }>("/api/users/stats");
  }

  async getMyOrders(params?: {
    type?: string;
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<{ data: any[]; pagination?: { page: number; limit: number; total: number; totalPages: number } }> {
    try {
      const token = this.getAuthToken();
      
      if (!token) {
        console.warn('No token found for getMyOrders');
        return { data: [] };
      }
      
      const queryParams = new URLSearchParams();
      if (params?.type) queryParams.append('type', params.type);
      if (params?.status) queryParams.append('status', params.status);
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.limit) queryParams.append('limit', params.limit.toString());

      const queryString = queryParams.toString();
      const url = `${this.api}/api/client/users/me/orders${queryString ? `?${queryString}` : ''}`;
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          console.warn('Unauthorized, returning empty orders list');
          return { data: [] };
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      if (data.success && data.data) {
        // Handle nested data structure
        if (Array.isArray(data.data)) {
          return {
            data: data.data,
            pagination: data.pagination || data.data.pagination
          };
        }
        // If data.data is an object with data property
        if (data.data.data && Array.isArray(data.data.data)) {
          return {
            data: data.data.data,
            pagination: data.data.pagination || data.pagination
          };
        }
      }
      return { data: [] };
    } catch (error: any) {
      console.error('Get my orders error:', error);
      return { data: [] };
    }
  }

  // CLIENT - Get order by ID
  async getOrderById(id: string): Promise<any> {
    try {
      const token = this.getAuthToken();
      
      if (!token) {
        throw new Error('Authorization token not found. Please login again.');
      }

      const url = `${this.api}/api/client/orders/${id}`;
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Unauthorized');
        }
        if (response.status === 404) {
          throw new Error('Order not found');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      if (data.success && data.data) {
        return data.data;
      }
      throw new Error(data.message || 'Failed to get order details');
    } catch (error: any) {
      console.error('Get order by id error:', error);
      throw error;
    }
  }

  // CLIENT - Get current user info
  async getUserInfo(): Promise<User | null> {
    try {
      const token = this.getAuthToken();
      const url = `${this.api}/api/client/users/me`;
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

  async getMyReferrals(params?: {
    page?: number;
    limit?: number;
  }): Promise<MyReferralResponse> {
    try {
      const token = this.getAuthToken();
      if (!token) {
        return {
          refCode: null,
          refCount: 0,
          refCommission: 0,
          registerPath: null,
          referrals: [],
        };
      }

      const queryParams = new URLSearchParams();
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.limit) queryParams.append('limit', params.limit.toString());

      const queryString = queryParams.toString();
      const url = `${this.api}/api/client/users/me/referrals${queryString ? `?${queryString}` : ''}`;
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          return {
            refCode: null,
            refCount: 0,
            refCommission: 0,
            registerPath: null,
            referrals: [],
          };
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const payload = data?.data?.data || data?.data;
      if (data.success && payload) {
        return {
          refCode: payload.refCode || null,
          refCount: Number(payload.refCount || 0),
          refCommission: Number(payload.refCommission || 0),
          registerPath: payload.registerPath || null,
          referrals: Array.isArray(payload.referrals) ? payload.referrals : [],
          pagination: payload.pagination,
        };
      }

      return {
        refCode: null,
        refCount: 0,
        refCommission: 0,
        registerPath: null,
        referrals: [],
      };
    } catch (error: any) {
      console.error('Get my referrals error:', error);
      return {
        refCode: null,
        refCount: 0,
        refCommission: 0,
        registerPath: null,
        referrals: [],
      };
    }
  }
}

export default UserService;
