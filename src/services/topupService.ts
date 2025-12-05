export interface Bank {
  id: string;
  name: string;
  accountNumber: string;
  accountName: string;
  branch?: string | null;
}

export interface Topup {
  code: string;
  userId: string;
  amount: number;
  bank: string;
  accountNumber?: string;
  accountName?: string;
  topupStatus: 'da-thanh-cong' | 'chua-thanh-toan' | 'het-han';
  status: 'cho-duyet' | 'da-duyet' | 'da-huy';
  paymentProof?: string;
  note?: string;
  reason?: string;
  expiresAt?: string;
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

class TopupService {
  private api: string;

  constructor(apiUrl: string = "") {
    this.api = apiUrl;
  }

  private getToken(): string | null {
    return localStorage.getItem('auth_token') 
      || localStorage.getItem('authToken')
      || sessionStorage.getItem('auth_token')
      || sessionStorage.getItem('authToken');
  }

  private async request<T>(url: string, options?: RequestInit): Promise<T> {
    try {
      const token = this.getToken();
      const res = await fetch(this.api + url, {
        headers: {
          "Content-Type": "application/json",
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
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

  async getBanks(): Promise<Bank[]> {
    const response = await this.request<{ data: Bank[] }>("/api/client/topups/banks");
    return response.data || [];
  }

  async createTopup(amount: number, bankId: string): Promise<Topup> {
    const token = this.getToken();
    if (!token) {
      throw new Error('Authorization token not found. Please login again.');
    }

    const url = `${this.api}/api/client/topups/create`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ amount, bankId }),
    });

    const data: ApiResponse<{ data: Topup }> = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Không thể tạo yêu cầu nạp tiền');
    }

    return data.data.data;
  }

  async getTopupByCode(code: string): Promise<Topup> {
    const token = this.getToken();
    if (!token) {
      throw new Error('Authorization token not found. Please login again.');
    }

    const url = `${this.api}/api/client/topups/${code}`;
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${token}`,
      },
    });

    const data: ApiResponse<{ data: Topup }> = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Không thể lấy thông tin nạp tiền');
    }

    return data.data.data;
  }

  async getHistory(params?: {
    page?: number;
    limit?: number;
    status?: string;
  }): Promise<{ data: Topup[]; pagination?: any }> {
    const token = this.getToken();
    if (!token) {
      console.warn('No token found for getHistory');
      return { data: [] };
    }

    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    // Backend accepts 'status' and maps to topupStatus
    if (params?.status) queryParams.append("status", params.status);

    const queryString = queryParams.toString();
    const url = `${this.api}/api/client/topups/history${queryString ? `?${queryString}` : ""}`;
    
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        console.warn('Unauthorized, returning empty history');
        return { data: [] };
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: ApiResponse<{ data: Topup[]; pagination?: any }> = await response.json();
    
    if (data.success && data.data) {
      // Backend returns: { success: true, data: { data: [...], pagination: {...} } }
      if (data.data.data && Array.isArray(data.data.data)) {
        return {
          data: data.data.data,
          pagination: data.data.pagination
        };
      }
      // Fallback: if data.data is array directly
      if (Array.isArray(data.data)) {
        return {
          data: data.data,
          pagination: data.pagination
        };
      }
    }
    
    return { data: [] };
  }

  async uploadProof(code: string, paymentProof: string): Promise<Topup> {
    const response = await this.request<{ data: Topup }>(`/api/client/topups/${code}/upload-proof`, {
      method: "POST",
      body: JSON.stringify({ paymentProof }),
    });
    return response.data;
  }
}

export default TopupService;

