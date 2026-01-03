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

export interface Bank {
  id: string;
  name: string;
  accountNumber: string;
  accountName: string;
  branch?: string;
  status: 'active' | 'inactive';
  createdAt?: string;
  updatedAt?: string;
}

class BankService {
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

  // GET /api/banks - Lấy danh sách tài khoản ngân hàng
  async getBanks(params?: {
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
  }): Promise<{ data: Bank[]; pagination?: any }> {
    const token = this.getToken();
    if (!token) {
      throw new Error('Authorization token not found. Please login again.');
    }

    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.status) queryParams.append("status", params.status);
    if (params?.search) queryParams.append("search", params.search);

    const queryString = queryParams.toString();
    const url = `${this.api}/api/banks${queryString ? `?${queryString}` : ""}`;
    
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    
    const data: ApiResponse<{ data: Bank[]; pagination?: any }> = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Không thể lấy danh sách tài khoản ngân hàng');
    }
    
    if (data.success && data.data) {
      if (Array.isArray(data.data)) {
        return {
          data: data.data,
          pagination: data.pagination || data.data.pagination
        };
      }
      if (data.data.data && Array.isArray(data.data.data)) {
        return {
          data: data.data.data,
          pagination: data.data.pagination || data.pagination
        };
      }
    }
    
    return { data: [] };
  }

  // GET /api/banks/:id - Lấy chi tiết tài khoản ngân hàng
  async getBankById(id: string): Promise<Bank> {
    const token = this.getToken();
    if (!token) {
      throw new Error('Authorization token not found. Please login again.');
    }

    const url = `${this.api}/api/banks/${id}`;
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    
    const data: ApiResponse<Bank> = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Không thể lấy chi tiết tài khoản ngân hàng');
    }
    
    return data.data;
  }

  // POST /api/banks - Tạo tài khoản ngân hàng mới
  async createBank(payload: {
    name: string;
    accountNumber: string;
    accountName: string;
    branch?: string;
    status?: 'active' | 'inactive';
  }): Promise<Bank> {
    const token = this.getToken();
    if (!token) {
      throw new Error('Authorization token not found. Please login again.');
    }

    const url = `${this.api}/api/banks`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
    
    const data: ApiResponse<Bank> = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Không thể tạo tài khoản ngân hàng');
    }
    
    return data.data;
  }

  // PUT /api/banks/:id - Cập nhật tài khoản ngân hàng
  async updateBank(id: string, payload: {
    name?: string;
    accountNumber?: string;
    accountName?: string;
    branch?: string;
    status?: 'active' | 'inactive';
  }): Promise<Bank> {
    const token = this.getToken();
    if (!token) {
      throw new Error('Authorization token not found. Please login again.');
    }

    const url = `${this.api}/api/banks/${id}`;
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
    
    const data: ApiResponse<Bank> = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Không thể cập nhật tài khoản ngân hàng');
    }
    
    return data.data;
  }

  // DELETE /api/banks/:id - Xóa tài khoản ngân hàng
  async deleteBank(id: string): Promise<void> {
    const token = this.getToken();
    if (!token) {
      throw new Error('Authorization token not found. Please login again.');
    }

    const url = `${this.api}/api/banks/${id}`;
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      const data: ApiResponse<any> = await response.json();
      throw new Error(data.message || 'Không thể xóa tài khoản ngân hàng');
    }
  }
}

export default BankService;






