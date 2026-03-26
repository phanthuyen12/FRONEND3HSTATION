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
    this.api = apiUrl; // ví dụ: 'http://api.3hstation.com'
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
    autoRenew: boolean = false,
    extraParams?: {
      osVersion?: string | null;
      nodeverseDeviceId?: string | null;
      nodeverseAgencyId?: string | null;
    }
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
        body: JSON.stringify({
          planId,
          paymentMethod,
          billingTermCode,
          autoRenew,
          ...extraParams
        }),
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

  // Hybrid Nodeverse Order
  async createNodeverseHybridVpsOrder(
    planId: string,
    paymentMethod: string = 'balance',
    billingTermCode: string = '1m',
    autoRenew: boolean = false,
    extraParams?: {
      osVersion?: string | null;
      nodeverseDeviceId?: string | null;
      nodeverseAgencyId?: string | null;
    }
  ): Promise<{ order: any; instance: any }> {
    try {
      const token = localStorage.getItem('auth_token')
        || localStorage.getItem('authToken')
        || sessionStorage.getItem('auth_token')
        || sessionStorage.getItem('authToken');

      if (!token) throw new Error('Authorization token not found.');

      // Hit the nodeverse specific order endpoint
      const url = `${this.api}/api/client/vps/nodeverse-plans/order`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          planId,
          paymentMethod,
          billingTermCode,
          autoRenew,
          ...extraParams
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Tạo đơn hàng Hybrid thất bại');
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

  // ========== NODEVERSE THIRD-PARTY API ==========

  private getToken(): string {
    // 1. Client authService lưu vào localStorage['auth_token']
    const fromLocal = localStorage.getItem('auth_token')
      || localStorage.getItem('authToken');
    if (fromLocal) return fromLocal;

    // 2. Admin template (APICore) lưu vào sessionStorage['konrix_user'] dạng JSON { token, ... }
    const konrixRaw = sessionStorage.getItem('konrix_user');
    if (konrixRaw) {
      try {
        const parsed = JSON.parse(konrixRaw);
        const t = parsed?.token || parsed?.data?.token;
        if (t) return t;
      } catch { /* ignore */ }
    }

    // 3. Fallback sessionStorage keys khác
    const fromSession = sessionStorage.getItem('auth_token')
      || sessionStorage.getItem('authToken');
    if (fromSession) return fromSession;

    throw new Error('Authorization token not found. Please login again.');
  }

  /**
   * Lấy danh sách tất cả VPS devices từ Nodeverse bên thứ 3
   */
  async getNodeverseDevices(): Promise<{ total: number; devices: NodeverseDevice[] }> {
    const token = this.getToken();
    const url = `${this.api}/api/client/vps/nodeverse/devices`;
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    const body = await response.json();
    if (!response.ok) {
      throw new Error(body?.message || 'Không thể tải danh sách VPS Nodeverse');
    }
    return body.data || { total: 0, devices: [] };
  }

  /**
   * Lấy chi tiết 1 VPS device từ Nodeverse
   */
  async getNodeverseDeviceById(deviceId: string): Promise<NodeverseDevice> {
    const token = this.getToken();
    const url = `${this.api}/api/client/vps/nodeverse/devices/${deviceId}`;
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    const body = await response.json();
    if (!response.ok) {
      throw new Error(body?.message || 'Không thể tải chi tiết VPS device');
    }
    return body.data;
  }

  /**
   * Lấy thống kê VPS devices từ Nodeverse
   */
  async getNodeverseStats(): Promise<NodeverseStats> {
    const token = this.getToken();
    const url = `${this.api}/api/client/vps/nodeverse/stats`;
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    const body = await response.json();
    if (!response.ok) {
      throw new Error(body?.message || 'Không thể tải thống kê VPS Nodeverse');
    }
    return body.data;
  }

  // ========== NODEVERSE VPS PLANS (DB-backed, admin cài giá + user đặt hàng) ==========

  async getNodeverseVpsPlans(): Promise<{ total: number; plans: NodeverseVpsPlan[] }> {
    const token = this.getToken();
    const res = await fetch(`${this.api}/api/client/vps/nodeverse-plans`, {
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
    });
    const body = await res.json();
    if (!res.ok) throw new Error(body?.message || 'Không thể tải danh sách VPS plans');
    return body.data || { total: 0, plans: [] };
  }

  async getNodeverseVpsPlanPricing(planId: string): Promise<{ plan: NodeverseVpsPlan; terms: any[] }> {
    const token = this.getToken();
    const res = await fetch(`${this.api}/api/client/vps/nodeverse-plans/${planId}/pricing`, {
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
    });
    const body = await res.json();
    if (!res.ok) throw new Error(body?.message || 'Không thể tải bảng giá');
    return body.data;
  }

  async createNodeverseVpsOrder(planId: string, billingTermCode: string = '1m', autoRenew: boolean = false): Promise<any> {
    const token = this.getToken();
    const res = await fetch(`${this.api}/api/client/vps/nodeverse-plans/order`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ planId, paymentMethod: 'balance', billingTermCode, autoRenew })
    });
    const body = await res.json();
    if (!res.ok) throw new Error(body?.message || 'Đặt hàng thất bại');
    return body.data;
  }

  async getMyNodeverseVpsOrders(): Promise<any[]> {
    const token = this.getToken();
    const res = await fetch(`${this.api}/api/client/vps/nodeverse-plans/my-orders`, {
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
    });
    const body = await res.json();
    if (!res.ok) throw new Error(body?.message || 'Không thể tải đơn hàng');
    return Array.isArray(body.data) ? body.data : [];
  }

  async getMyNodeverseVpsOrder(id: string): Promise<any> {
    const token = this.getToken();
    const res = await fetch(`${this.api}/api/client/vps/nodeverse-plans/my-orders/${id}`, {
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
    });
    const body = await res.json();
    if (!res.ok) throw new Error(body?.message || 'Không thể tải chi tiết đơn hàng');
    return body.data;
  }

  async changeNodeverseVpsContainerState(id: string, action: 'start' | 'stop' | 'restart'): Promise<{ message: string, status: string, containerStatus: string }> {
    const token = this.getToken();
    const res = await fetch(`${this.api}/api/client/vps/nodeverse-plans/my-orders/${id}/${action}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
    });
    const body = await res.json();
    if (!res.ok) throw new Error(body?.message || `Thao tác ${action} thất bại`);
    return body.data;
  }

  async renewNodeverseVps(id: string, billingTermCode: string = '1m', paymentMethod: string = 'balance'): Promise<any> {
    const token = this.getToken();
    const res = await fetch(`${this.api}/api/client/vps/nodeverse-plans/my-orders/${id}/renew`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ billingTermCode, paymentMethod })
    });
    const body = await res.json();
    if (!res.ok) throw new Error(body?.message || 'Gia hạn thất bại');
    return body.data;
  }

  // ADMIN methods
  async adminGetNodeversePlans(search?: string): Promise<{ total: number; plans: NodeverseVpsPlan[] }> {
    const token = this.getToken();
    const qs = search ? `?search=${encodeURIComponent(search)}` : '';
    const res = await fetch(`${this.api}/api/vps/nodeverse-plans${qs}`, {
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
    });
    const body = await res.json();
    if (!res.ok) throw new Error(body?.message || 'Không thể tải plans');
    return body.data || { total: 0, plans: [] };
  }

  async syncNodeversePlans(): Promise<{ synced: number }> {
    const token = this.getToken();
    const res = await fetch(`${this.api}/api/vps/nodeverse-plans/sync`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
    });
    const body = await res.json();
    if (!res.ok) throw new Error(body?.message || 'Sync thất bại');
    return body.data;
  }

  async adminUpdateNodeversePlan(id: string, payload: Partial<NodeverseVpsPlan>): Promise<NodeverseVpsPlan> {
    const token = this.getToken();
    const res = await fetch(`${this.api}/api/vps/nodeverse-plans/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(payload)
    });
    const body = await res.json();
    if (!res.ok) throw new Error(body?.message || 'Cập nhật thất bại');
    return body.data;
  }

  async adminGetNodeverseInstances(params?: { status?: string; limit?: number; offset?: number }): Promise<{ total: number; data: any[] }> {
    const token = this.getToken();
    const qp = new URLSearchParams();
    if (params?.status) qp.append('status', params.status);
    if (params?.limit) qp.append('limit', String(params.limit));
    if (params?.offset) qp.append('offset', String(params.offset));
    const qs = qp.toString() ? `?${qp.toString()}` : '';
    const res = await fetch(`${this.api}/api/vps/nodeverse-plans/instances${qs}`, {
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
    });
    const body = await res.json();
    if (!res.ok) throw new Error(body?.message || 'Không thể tải instances');
    return body.data || { total: 0, data: [] };
  }

  async updateNodeverseInstance(id: string, payload: {
    status?: string;
    ipAddress?: string;
    hostname?: string;
    expiresAt?: string | null;
    notes?: string;
    configuration?: any;
  }): Promise<any> {
    const token = this.getToken();
    const res = await fetch(`${this.api}/api/vps/nodeverse-plans/instances/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(payload)
    });
    const body = await res.json();
    if (!res.ok) throw new Error(body?.message || 'Cập nhật VPS instance thất bại');
    return body.data;
  }

  async adminGetNodeverseInstanceDetail(id: string): Promise<any> {
    const token = this.getToken();
    const res = await fetch(`${this.api}/api/vps/nodeverse-plans/instances/${id}`, {
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
    });
    const body = await res.json();
    if (!res.ok) throw new Error(body?.message || 'Không thể tải chi tiết VPS');
    return body.data;
  }

  async adminGetNodeverseInstanceHistory(id: string): Promise<any[]> {
    const token = this.getToken();
    const res = await fetch(`${this.api}/api/vps/nodeverse-plans/instances/${id}/history`, {
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
    });
    const body = await res.json();
    if (!res.ok) throw new Error(body?.message || 'Không thể tải lịch sử gia hạn');
    return Array.isArray(body.data) ? body.data : [];
  }
}

export interface NodeverseDevice {
  id: string;
  agencyId: string;
  name: string;
  ipAddress: string;
  hostname: string;
  status: 'online' | 'offline' | string;
  operatingSystem: string;
  cpuInfo: string;
  totalMemory: number;
  diskSpace: number;
  isActive: boolean;
  tag: string | null;
  socketId: string | null;
  lastConnectedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface NodeverseStats {
  total: number;
  online: number;
  offline: number;
  totalMemoryGB: number;
  totalDiskGB: number;
}

export interface NodeverseVpsPlan {
  id: string;
  nodeverseDeviceId: string | null;
  nodeverseAgencyId: string | null;
  name: string;
  ipAddress: string | null;
  hostname: string | null;
  operatingSystem: string | null;
  cpuInfo: string | null;
  totalMemory: number | null;
  diskSpace: number | null;
  price: string;
  unit: string;
  discountLabel: string | null;
  popular: boolean;
  isActive: boolean;
  tag: string | null;
  nodeverseStatus: string | null;
  nodeverseSyncedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export default VpsService;

