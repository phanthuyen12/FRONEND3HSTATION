export interface ContactRequest {
  id: string;
  name: string;
  phone: string;
  interest: string;
  status: 'pending' | 'contacted' | 'resolved';
  created_at: string;
  updated_at: string;
}

class AdminContactService {
  private api: string;

  constructor(apiUrl: string = "") {
    this.api = apiUrl;
  }

  private async request(url: string, options?: RequestInit): Promise<any> {
    try {
      const token = localStorage.getItem('auth_token') 
        || localStorage.getItem('authToken')
        || sessionStorage.getItem('auth_token')
        || sessionStorage.getItem('authToken') || '';

      const res = await fetch(this.api + url, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        ...options,
      });

      const body = await res.json();

      if (!res.ok) {
        console.error("❌ API error:", body);
        throw new Error(body?.message || "API Error");
      }

      return body;
    } catch (error) {
      console.error("❌ Fetch failed:", error);
      throw error;
    }
  }

  async fetchContacts(params?: {
    page?: number;
    limit?: number;
    status?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<{ data: ContactRequest[]; pagination: { page: number; limit: number; total: number; totalPages: number } }> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.status) queryParams.append("status", params.status);
    if (params?.startDate) queryParams.append("startDate", params.startDate);
    if (params?.endDate) queryParams.append("endDate", params.endDate);

    const queryString = queryParams.toString();
    const url = `/api/admin/contacts${queryString ? `?${queryString}` : ""}`;
    
    const response = await this.request(url);
    
    return {
      data: response.data || [],
      pagination: {
        page: Number(response.page) || params?.page || 1,
        limit: Number(response.limit) || params?.limit || 20,
        total: Number(response.total) || 0,
        totalPages: Number(response.totalPages) || 0,
      },
    };
  }

  async updateContactStatus(id: string, status: 'pending' | 'contacted' | 'resolved'): Promise<ContactRequest> {
    const response = await this.request(`/api/admin/contacts/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
    return response.data;
  }
}

export default AdminContactService;
