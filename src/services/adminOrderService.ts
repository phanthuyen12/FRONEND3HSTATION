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

interface Order {
  id: string;
  user_id: string;
  type: 'vps' | 'workflow' | 'course';
  item_id: string;
  amount: string;
  payment_method: string;
  status: string;
  created_at: string;
  updated_at: string;
  user?: {
    id: string;
    name: string;
    email: string;
    phone?: string;
  };
  instance?: any;
  plan?: any;
  workflow?: any;
}

class AdminOrderService {
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

  // GET /api/orders/admin/vps - Lấy danh sách đơn hàng VPS
  async getVpsOrders(params?: {
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
  }): Promise<{ data: Order[]; pagination?: any }> {
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
    const url = `${this.api}/api/orders/admin/vps${queryString ? `?${queryString}` : ""}`;

    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    const data: ApiResponse<{ data: Order[]; pagination?: any }> = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Không thể lấy danh sách đơn hàng VPS');
    }

    // Handle nested data structure
    if (data.success && data.data) {
      // If data.data is an array directly
      if (Array.isArray(data.data)) {
        return {
          data: data.data,
          pagination: data.pagination
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
  }

  // GET /api/orders/admin/workflows - Lấy danh sách đơn hàng workflows
  async getWorkflowOrders(params?: {
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
  }): Promise<{ data: Order[]; pagination?: any }> {
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
    const url = `${this.api}/api/orders/admin/workflows${queryString ? `?${queryString}` : ""}`;

    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    const data: ApiResponse<{ data: Order[]; pagination?: any }> = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Không thể lấy danh sách đơn hàng workflows');
    }

    if (data.success && data.data) {
      return {
        data: Array.isArray(data.data) ? data.data : data.data.data || [],
        pagination: data.pagination || data.data.pagination
      };
    }

    return { data: [] };
  }

  // GET /api/orders/admin/:id - Lấy chi tiết đơn hàng
  async getOrderById(id: string): Promise<Order> {
    const token = this.getToken();
    if (!token) {
      throw new Error('Authorization token not found. Please login again.');
    }

    const url = `${this.api}/api/orders/admin/${id}`;
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    const data: ApiResponse<Order> = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Không thể lấy chi tiết đơn hàng');
    }

    return data.data;
  }

  // PATCH /api/orders/admin/:id/status - Cập nhật trạng thái đơn hàng
  async updateOrderStatus(id: string, status: string): Promise<Order> {
    const token = this.getToken();
    if (!token) {
      throw new Error('Authorization token not found. Please login again.');
    }

    const url = `${this.api}/api/orders/admin/${id}/status`;
    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    });

    const data: ApiResponse<Order> = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Không thể cập nhật trạng thái đơn hàng');
    }

    return data.data;
  }

  // PATCH /api/orders/admin/:id/notes - Cập nhật ghi chú/description
  async updateOrderNotes(id: string, notes: string, description?: string): Promise<Order> {
    const token = this.getToken();
    if (!token) {
      throw new Error('Authorization token not found. Please login again.');
    }

    const url = `${this.api}/api/orders/admin/${id}/notes`;
    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ notes, description }),
    });

    const data: ApiResponse<Order> = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Không thể cập nhật ghi chú đơn hàng');
    }

    return data.data;
  }

  // POST /api/orders/admin/:id/attachment - Thêm file/link đính kèm
  async addOrderAttachment(
    id: string,
    attachmentUrl: string,
    attachmentName?: string,
    attachmentType: 'link' | 'file' = 'link'
  ): Promise<any> {
    const token = this.getToken();
    if (!token) {
      throw new Error('Authorization token not found. Please login again.');
    }

    const url = `${this.api}/api/orders/admin/${id}/attachment`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ attachmentUrl, attachmentName, attachmentType }),
    });

    const data: ApiResponse<any> = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Không thể thêm file/link đính kèm');
    }

    return data.data;
  }

  // POST /api/orders/admin/:id/auto-provision - Tự động khởi tạo VPS qua Nodeverse API
  async autoProvisionOrder(id: string): Promise<any> {
    const token = this.getToken();
    if (!token) {
      throw new Error('Authorization token not found. Please login again.');
    }

    const url = `${this.api}/api/orders/admin/${id}/auto-provision`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    const data: ApiResponse<any> = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Không thể tự động khởi tạo VPS qua Nodeverse');
    }

    return data.data;
  }

  // DELETE /api/orders/admin/clear-all - Xoá toàn bộ lịch sử đơn hàng
  async clearAllHistory(): Promise<any> {
    const token = this.getToken();
    if (!token) {
      throw new Error('Authorization token not found. Please login again.');
    }

    const url = `${this.api}/api/orders/admin/clear-all`;
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    const data: ApiResponse<any> = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Không thể xoá lịch sử đơn hàng');
    }

    return data;
  }
}

export default AdminOrderService;

