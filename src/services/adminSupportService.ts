import config from "../config";

export interface SupportRequestItem {
  id: number;
  name: string;
  email: string;
  topic: string;
  message: string;
  source_page: string;
  status: "new" | "reviewing" | "resolved";
  created_at: string;
  updated_at: string;
}

export interface SupportRequestStats {
  total: number;
  totalNew: number;
  totalReviewing: number;
  totalResolved: number;
}

export interface SupportRequestPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

const API_URL = `${config.API_URL}/api/support`;

const getToken = (): string | null => {
  try {
    const konrixRaw = sessionStorage.getItem("konrix_user");
    if (konrixRaw) {
      const parsed = JSON.parse(konrixRaw);
      const token = parsed?.token || parsed?.data?.token || parsed?.user?.token;
      if (token) return token;
    }

    return (
      localStorage.getItem("auth_token") ||
      localStorage.getItem("authToken") ||
      sessionStorage.getItem("auth_token") ||
      sessionStorage.getItem("authToken")
    );
  } catch (error) {
    console.error("Error getting support admin token:", error);
    return null;
  }
};

const request = async (url: string, options: RequestInit = {}) => {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string> | undefined),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });
  const body = await response.json().catch(() => null);

  if (!response.ok || !body?.success) {
    throw new Error(body?.message || "Không thể xử lý yêu cầu hỗ trợ");
  }

  return body.data;
};

const adminSupportService = {
  async getRequests(params?: {
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
    sourcePage?: string;
  }): Promise<{ data: SupportRequestItem[]; pagination: SupportRequestPagination }> {
    const query = new URLSearchParams();
    if (params?.page) query.append("page", String(params.page));
    if (params?.limit) query.append("limit", String(params.limit));
    if (params?.status) query.append("status", params.status);
    if (params?.search) query.append("search", params.search);
    if (params?.sourcePage) query.append("sourcePage", params.sourcePage);

    const data = await request(`${API_URL}/requests${query.toString() ? `?${query.toString()}` : ""}`);
    return {
      data: data?.data || [],
      pagination: data?.pagination || { page: 1, limit: 10, total: 0, totalPages: 0 },
    };
  },

  async getStats(): Promise<SupportRequestStats> {
    return request(`${API_URL}/requests/stats`);
  },

  async updateStatus(id: number, status: SupportRequestItem["status"]): Promise<SupportRequestItem> {
    return request(`${API_URL}/requests/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
  },
};

export default adminSupportService;
