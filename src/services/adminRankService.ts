import { API_URL } from "../constants/api";

export interface RankCourseAssignment {
  id: number;
  rank_id: number;
  course_id: number;
  status: "active" | "inactive";
  created_at?: string;
  updated_at?: string;
  course_title?: string;
  thumbnail_url?: string | null;
  course_status?: string;
  rank_code?: string;
  rank_name?: string;
}

export interface Rank {
  id: number;
  code: string;
  name: string;
  description?: string | null;
  status: "active" | "inactive";
  created_at?: string;
  updated_at?: string;
  courses?: RankCourseAssignment[];
}

export interface RankCourse {
  id: number;
  title: string;
  thumbnail_url?: string | null;
  status?: string;
}

export interface RankListParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}

export interface RankPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface RankListResponse {
  data: Rank[];
  pagination?: RankPagination;
}

interface ApiResponse<T> {
  success?: boolean;
  data?: T;
  message?: string;
  pagination?: RankPagination;
}

const getToken = (): string | null => {
  try {
    const konrixRaw = sessionStorage.getItem("konrix_user");
    if (konrixRaw) {
      const parsed = JSON.parse(konrixRaw);
      const token = parsed?.token || parsed?.data?.token || parsed?.user?.token;
      if (token) return token;
    }

    const fromLocal =
      localStorage.getItem("auth_token") || localStorage.getItem("authToken");
    if (fromLocal) return fromLocal;

    const fromSession =
      sessionStorage.getItem("auth_token") || sessionStorage.getItem("authToken");
    if (fromSession) return fromSession;
  } catch (error) {
    console.error("Error getting token:", error);
  }

  return null;
};

class AdminRankService {
  private api: string;

  constructor() {
    this.api = API_URL;
  }

  private async request<T>(url: string, options: RequestInit = {}): Promise<T> {
    const token = getToken();
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(options.headers as Record<string, string>),
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const res = await fetch(url, {
      ...options,
      headers,
    });

    const body: ApiResponse<T> = await res.json();

    if (!res.ok) {
      throw new Error(body?.message || `API Error: ${res.status}`);
    }

    return (body.data as T) ?? (body as T);
  }

  async getRanks(params?: RankListParams): Promise<RankListResponse> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append("page", String(params.page));
    if (params?.limit) queryParams.append("limit", String(params.limit));
    if (params?.search) queryParams.append("search", params.search);
    if (params?.status) queryParams.append("status", params.status);

    const url = `${this.api}/api/ranks${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
    const response = await this.request<RankListResponse | { success?: boolean; data?: Rank[]; pagination?: RankPagination }>(url);

    if (Array.isArray(response)) {
      return { data: response };
    }

    if ("data" in response && Array.isArray(response.data)) {
      return {
        data: response.data,
        pagination: response.pagination,
      };
    }

    return { data: [] };
  }

  async getRank(id: number | string): Promise<Rank & { courses?: RankCourseAssignment[] }> {
    const response = await this.request<Rank & { courses?: RankCourseAssignment[] } | { success?: boolean; data?: Rank & { courses?: RankCourseAssignment[] } }>(
      `${this.api}/api/ranks/${id}`
    );

    if (response && "courses" in response) {
      return response as Rank & { courses?: RankCourseAssignment[] };
    }

    const wrapped = response as { data?: Rank & { courses?: RankCourseAssignment[] } };
    return wrapped.data || (response as Rank & { courses?: RankCourseAssignment[] });
  }

  async createRank(payload: {
    code: string;
    name: string;
    description?: string;
    status?: "active" | "inactive";
  }): Promise<Rank> {
    return await this.request<Rank>(`${this.api}/api/ranks`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }

  async updateRank(
    id: number | string,
    payload: Partial<{
      code: string;
      name: string;
      description?: string;
      status: "active" | "inactive";
    }>
  ): Promise<Rank> {
    return await this.request<Rank>(`${this.api}/api/ranks/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  }

  async deleteRank(id: number | string): Promise<void> {
    await this.request<void>(`${this.api}/api/ranks/${id}`, {
      method: "DELETE",
    });
  }

  async setRankCourses(id: number | string, courseIds: number[]): Promise<RankCourseAssignment[]> {
    return await this.request<RankCourseAssignment[]>(`${this.api}/api/ranks/${id}/courses`, {
      method: "PUT",
      body: JSON.stringify({ courseIds }),
    });
  }

  async addRankCourse(
    id: number | string,
    courseId: number,
    status: "active" | "inactive" = "active"
  ): Promise<RankCourseAssignment[]> {
    return await this.request<RankCourseAssignment[]>(`${this.api}/api/ranks/${id}/courses`, {
      method: "POST",
      body: JSON.stringify({ courseId, status }),
    });
  }

  async removeRankCourse(id: number | string, courseId: number): Promise<void> {
    await this.request<void>(`${this.api}/api/ranks/${id}/courses/${courseId}`, {
      method: "DELETE",
    });
  }

  async getCourses(params?: { page?: number; limit?: number; search?: string }): Promise<RankCourse[]> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append("page", String(params.page));
    if (params?.limit) queryParams.append("limit", String(params.limit));
    if (params?.search) queryParams.append("search", params.search);

    const url = `${this.api}/api/elearning/courses${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
    const response = await this.request<
      { success?: boolean; data?: RankCourse[]; pagination?: unknown } | RankCourse[]
    >(url);

    if (Array.isArray(response)) {
      return response;
    }

    if ("data" in response && Array.isArray(response.data)) {
      return response.data;
    }

    return [];
  }
}

const adminRankService = new AdminRankService();

export default adminRankService;
