import { API_URL } from '../config';

export interface LandingPageDomain {
  id: number;
  domain: string;
  created_at: string;
}

export interface LandingPage {
  id: number;
  title: string;
  domain: string;
  path: string;
  status: 'draft' | 'published' | 'scheduled' | 'hidden' | 'expired' | 'trash';
  publish_start_at: string | null;
  publish_end_at: string | null;
  created_by: number | null;
  creator_name?: string;
  created_at: string;
  updated_at: string;
  views_count: number;
  submissions_count: number;
  active_version_id: number | null;
  draft_html: string | null;
  draft_css: string | null;
  draft_js: string | null;
  draft_assets_path: string | null;
  preview_token: string;
  google_sheet_id: string | null;
  google_sheet_tab_name: string | null;
}

export interface LandingPageVersion {
  id: number;
  landing_page_id: number;
  version_number: number;
  html: string;
  css: string | null;
  js: string | null;
  assets_path: string | null;
  created_by: number | null;
  creator_name?: string;
  created_at: string;
  description: string | null;
}

export interface LandingPageSubmission {
  id: number;
  landing_page_id: number;
  data: Record<string, any>;
  submitted_at: string;
  ip_address: string | null;
  user_agent: string | null;
}

export interface LandingPageLog {
  id: number;
  landing_page_id: number | null;
  user_id: number | null;
  user_name?: string;
  action: string;
  details: string | null;
  created_at: string;
}

interface ApiResponse<T> {
  success?: boolean;
  data: T;
  message?: string;
  pagination?: {
    total: number;
    limit: number;
    offset: number;
  };
}

class LandingPageService {
  private api: string;

  constructor(apiUrl: string = API_URL) {
    this.api = apiUrl;
  }

  private getToken(): string | null {
    return (
      localStorage.getItem('auth_token') ||
      localStorage.getItem('authToken') ||
      sessionStorage.getItem('auth_token') ||
      sessionStorage.getItem('authToken') ||
      null
    );
  }

  private async request<T>(url: string, options?: RequestInit): Promise<T> {
    const token = this.getToken();
    const headers = {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      ...(options?.headers || {})
    };

    try {
      const res = await fetch(this.api + url, {
        ...options,
        headers
      });

      const body: ApiResponse<T> = await res.json();

      if (!res.ok) {
        throw new Error(body?.message || 'API Error');
      }

      return body.data;
    } catch (error) {
      console.error(`❌ Request to ${url} failed:`, error);
      throw error;
    }
  }

  // ==========================================
  // DOMAINS API
  // ==========================================

  async getDomains(): Promise<LandingPageDomain[]> {
    return this.request<LandingPageDomain[]>('/api/admin/landing-pages/domains');
  }

  async createDomain(domain: string): Promise<LandingPageDomain> {
    return this.request<LandingPageDomain>('/api/admin/landing-pages/domains', {
      method: 'POST',
      body: JSON.stringify({ domain })
    });
  }

  async deleteDomain(id: number): Promise<void> {
    return this.request<void>(`/api/admin/landing-pages/domains/${id}`, {
      method: 'DELETE'
    });
  }

  // ==========================================
  // LANDING PAGES CRUD API
  // ==========================================

  async getLandingPages(params?: {
    search?: string;
    status?: string;
    limit?: number;
    offset?: number;
  }): Promise<{ data: LandingPage[]; total: number }> {
    const queryParams = new URLSearchParams();
    if (params?.search) queryParams.append('search', params.search);
    if (params?.status) queryParams.append('status', params.status);
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.offset) queryParams.append('offset', params.offset.toString());

    const queryString = queryParams.toString();
    const url = `/api/admin/landing-pages${queryString ? `?${queryString}` : ''}`;
    
    const token = this.getToken();
    const res = await fetch(this.api + url, {
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      }
    });

    const body: ApiResponse<LandingPage[]> = await res.json();
    if (!res.ok) {
      throw new Error(body?.message || 'API Error');
    }

    return {
      data: body.data || [],
      total: body.pagination?.total || 0
    };
  }

  async getLandingPage(id: number): Promise<LandingPage> {
    return this.request<LandingPage>(`/api/admin/landing-pages/${id}`);
  }

  async createLandingPage(data: Partial<LandingPage>): Promise<LandingPage> {
    return this.request<LandingPage>('/api/admin/landing-pages', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async updateLandingPage(id: number, data: Partial<LandingPage>): Promise<LandingPage> {
    return this.request<LandingPage>(`/api/admin/landing-pages/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  async deleteLandingPage(id: number): Promise<void> {
    return this.request<void>(`/api/admin/landing-pages/${id}`, {
      method: 'DELETE'
    });
  }

  async destroyLandingPagePermanently(id: number): Promise<void> {
    return this.request<void>(`/api/admin/landing-pages/${id}/permanent`, {
      method: 'DELETE'
    });
  }

  async cloneLandingPage(id: number): Promise<LandingPage> {
    return this.request<LandingPage>(`/api/admin/landing-pages/${id}/clone`, {
      method: 'POST'
    });
  }

  async exportLandingPage(id: number): Promise<{ blob: Blob; filename: string }> {
    const token = this.getToken();
    const res = await fetch(`${this.api}/api/admin/landing-pages/${id}/export`, {
      headers: {
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      }
    });

    if (!res.ok) {
      let message = 'Export landing page thất bại';
      try {
        const body = await res.json();
        message = body?.message || message;
      } catch {
        // The server may return a non-JSON error response.
      }
      throw new Error(message);
    }

    const disposition = res.headers.get('Content-Disposition') || '';
    const filenameMatch = disposition.match(/filename="?([^";]+)"?/i);
    const contentType = res.headers.get('Content-Type') || '';
    const filename = filenameMatch?.[1]
      || `landing-page-${id}.${contentType.includes('zip') ? 'zip' : 'html'}`;

    return { blob: await res.blob(), filename };
  }

  // ==========================================
  // ZIP UPLOAD API
  // ==========================================

  async uploadZip(id: number, file: File): Promise<LandingPage> {
    const token = this.getToken();
    const formData = new FormData();
    formData.append('zipFile', file);

    const res = await fetch(`${this.api}/api/admin/landing-pages/${id}/upload`, {
      method: 'POST',
      headers: {
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      },
      body: formData
    });

    const body: ApiResponse<LandingPage> = await res.json();
    if (!res.ok) {
      throw new Error(body?.message || 'Upload thất bại');
    }

    return body.data;
  }

  // ==========================================
  // PUBLISHING AND VERSION CONTROL API
  // ==========================================

  async publishLandingPage(id: number, description?: string): Promise<LandingPage> {
    return this.request<LandingPage>(`/api/admin/landing-pages/${id}/publish`, {
      method: 'POST',
      body: JSON.stringify({ description })
    });
  }

  async getVersions(id: number): Promise<LandingPageVersion[]> {
    return this.request<LandingPageVersion[]>(`/api/admin/landing-pages/${id}/versions`);
  }

  async restoreVersion(id: number, versionId: number): Promise<LandingPage> {
    return this.request<LandingPage>(`/api/admin/landing-pages/${id}/versions/${versionId}/restore`, {
      method: 'POST'
    });
  }

  // ==========================================
  // LEADS & SUBMISSIONS API
  // ==========================================

  async getSubmissions(id: number): Promise<LandingPageSubmission[]> {
    return this.request<LandingPageSubmission[]>(`/api/admin/landing-pages/${id}/submissions`);
  }

  async deleteSubmission(submissionId: number): Promise<void> {
    return this.request<void>(`/api/admin/landing-pages/submissions/${submissionId}`, {
      method: 'DELETE'
    });
  }

  // ==========================================
  // AUDIT LOGS API
  // ==========================================

  async getLogs(id: number): Promise<LandingPageLog[]> {
    return this.request<LandingPageLog[]>(`/api/admin/landing-pages/${id}/logs`);
  }
}

export default LandingPageService;
