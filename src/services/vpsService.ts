export interface VpsPlan {
  id: string;
  name: string;
  price: string;
  unit: string;
  discountLabel?: string;
  cpu: string;
  ram: string;
  ssd: string;
  bandwidth: string;
  popular?: boolean;
}

export interface VpsBillingTerm {
  code: string; // '1m', '3m', '6m', '12m', ...
  label: string; // '1 tháng', '3 tháng', ...
  months: number;
  discountPercent: number;
  baseMonthlyPrice: number;
  subtotal: number;
  discountAmount: number;
  finalAmount: number;
}

export interface VpsPlanPricingResponse {
  plan: {
    id: string;
    name: string;
    baseMonthlyPrice: number;
    unit: string;
  };
  terms: VpsBillingTerm[];
}

interface ApiResponse<T> {
  success?: boolean;
  data: T;
  message?: string;
}

class VpsService {
  private api: string;

  constructor(apiUrl: string = "") {
    this.api = apiUrl; // ví dụ: 'http://localhost:3000'
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

  // ADMIN
  async fetchAdminPlans(): Promise<VpsPlan[]> {
    const response = await this.request<{ data: VpsPlan[]; total: number }>("/api/vps/plans");
    return response.data || [];
  }

  async createPlan(payload: VpsPlan): Promise<VpsPlan> {
    return await this.request<VpsPlan>("/api/vps/plans", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }

  async updatePlan(id: string, payload: Partial<VpsPlan>): Promise<VpsPlan> {
    return await this.request<VpsPlan>(`/api/vps/plans/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  }

  async deletePlan(id: string): Promise<void> {
    await this.request<void>(`/api/vps/plans/${id}`, {
      method: "DELETE",
    });
  }

  async togglePopular(id: string, popular: boolean): Promise<VpsPlan> {
    return await this.request<VpsPlan>(`/api/vps/plans/${id}/toggle-popular`, {
      method: "PATCH",
      body: JSON.stringify({ popular }),
    });
  }

  // ADMIN - VPS Instances
  async getAdminInstances(params?: {
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
  }): Promise<{ data: any[]; pagination?: any }> {
    // Get token from localStorage - try both possible keys
    const token = localStorage.getItem('auth_token') 
      || localStorage.getItem('authToken')
      || sessionStorage.getItem('auth_token')
      || sessionStorage.getItem('authToken');
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.status) queryParams.append("status", params.status);
    if (params?.search) queryParams.append("search", params.search);

    const queryString = queryParams.toString();
    const url = `${this.api}/api/vps/instances${queryString ? `?${queryString}` : ""}`;
    
    if (!token) {
      throw new Error('Authorization token not found. Please login again.');
    }
    
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
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

  // ADMIN - VPS Orders (from /api/orders/admin/vps)
  async getAdminVpsOrders(params?: {
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
  }): Promise<{ data: any[]; pagination?: any }> {
    const token = localStorage.getItem('auth_token') 
      || localStorage.getItem('authToken')
      || sessionStorage.getItem('auth_token')
      || sessionStorage.getItem('authToken');
    if (!token) {
      throw new Error('Authorization token not found. Please login again.');
    }

    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', String(params.page));
    if (params?.limit) queryParams.append('limit', String(params.limit));
    if (params?.status) queryParams.append('status', params.status);
    if (params?.search) queryParams.append('search', params.search);
    const queryString = queryParams.toString();

    const res = await fetch(`${this.api}/api/orders/admin/vps${queryString ? `?${queryString}` : ''}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    const body = await res.json();
    if (!res.ok) {
      throw new Error(body?.message || 'Không thể tải đơn hàng VPS');
    }
    const payload = body.data || {};
    return {
      data: Array.isArray(payload.data) ? payload.data : Array.isArray(body.data) ? body.data : [],
      pagination: payload.pagination || body.pagination,
    };
  }

  async updateInstance(id: string, payload: {
    status?: string;
    ipAddress?: string;
    hostname?: string;
    expiresAt?: string | null;
    notes?: string;
    configuration?: any;
  }): Promise<any> {
    // Get token from localStorage - try both possible keys
    const token = localStorage.getItem('auth_token') 
      || localStorage.getItem('authToken')
      || sessionStorage.getItem('auth_token')
      || sessionStorage.getItem('authToken');
    
    if (!token) {
      throw new Error('Authorization token not found. Please login again.');
    }
    
    const url = `${this.api}/api/vps/instances/${id}`;
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    if (data.success && data.data) {
      return data.data;
    }
    throw new Error(data.message || 'Cập nhật VPS instance thất bại');
  }

  // CLIENT - Get my VPS orders
  async getMyVpsOrders(): Promise<any[]> {
    // Get token from localStorage - try both possible keys
    // authService uses 'auth_token' key
    const token = localStorage.getItem('auth_token') 
      || localStorage.getItem('authToken')
      || sessionStorage.getItem('auth_token')
      || sessionStorage.getItem('authToken');
    
    if (!token) {
      console.warn('No token found, returning empty orders list');
      return [];
    }
    
    const url = `${this.api}/api/client/vps/my-orders`;
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    const data = await response.json();
    if (data.success && data.data) {
      return Array.isArray(data.data) ? data.data : [];
    }
    return [];
  }

  // CLIENT
  async createVpsOrder(
    planId: string,
    paymentMethod: string = 'balance',
    billingTermCode: string = '1m',
    autoRenew: boolean = false
  ): Promise<{ order: any; instance: any }> {
    try {
      // Get token from localStorage - try both possible keys
      // authService uses 'auth_token' key
      const token = localStorage.getItem('auth_token') 
        || localStorage.getItem('authToken')
        || sessionStorage.getItem('auth_token')
        || sessionStorage.getItem('authToken');
      
      if (!token) {
        throw new Error('Authorization token not found. Please login again.');
      }
      
      const url = `${this.api}/api/client/vps/orders`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ planId, paymentMethod, billingTermCode, autoRenew }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Tạo đơn hàng VPS thất bại');
      }
      return data.data;
    } catch (error: any) {
      throw error;
    }
  }

  async fetchClientPlans(): Promise<VpsPlan[]> {
    try {
      const res = await fetch(this.api + "/api/client/vps/plans", {
        headers: {
          "Content-Type": "application/json",
        },
      });

      const body = await res.json();

      if (!res.ok) {
        console.error("❌ API error:", body);
        throw new Error(body?.message || "API Error");
      }

      // Handle nested data structure: {success: true, data: {data: [...], total: 1}}
      if (body.success && body.data) {
        if (body.data.data && Array.isArray(body.data.data)) {
          return body.data.data;
        }
        if (Array.isArray(body.data)) {
          return body.data;
        }
      }

      // Fallback: if data is array directly
      if (Array.isArray(body)) {
        return body;
      }

      return [];
    } catch (error) {
      console.error("❌ Fetch failed:", error);
      throw error;
    }
  }

  async fetchPlanPricing(planId: string): Promise<VpsPlanPricingResponse> {
    const res = await fetch(this.api + `/api/client/vps/plans/${planId}/pricing`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const body = await res.json();

    if (!res.ok) {
      console.error('❌ API error:', body);
      throw new Error(body?.message || 'API Error');
    }

    return body.data as VpsPlanPricingResponse;
  }
}
export default VpsService;

