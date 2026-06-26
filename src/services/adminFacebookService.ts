import { API_URL } from "../constants/api";

const getToken = (): string | null => {
  try {
    const konrixRaw = sessionStorage.getItem("konrix_user") || localStorage.getItem("konrix_user");
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

class AdminFacebookService {
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

    const body = await res.json();

    if (!res.ok) {
      throw new Error(body?.message || body?.error?.message || `API Error: ${res.status}`);
    }

    return (body.data as T) ?? (body as T);
  }

  async getPages() {
    return await this.request<any[]>(`${this.api}/api/admin/facebook/pages`);
  }

  async getPageDetails(pageId: string) {
    return await this.request<any>(`${this.api}/api/admin/facebook/pages/${pageId}`);
  }

  async connectPage(code?: string, redirectUri?: string) {
    return await this.request<any>(`${this.api}/api/admin/facebook/pages/connect`, {
      method: "POST",
      body: JSON.stringify({ code, redirectUri }),
    });
  }

  async disconnectPage(pageId: string) {
    return await this.request<any>(`${this.api}/api/admin/facebook/pages/${pageId}`, {
      method: "DELETE",
    });
  }

  async getPosts(pageId: string, query?: string) {
    return await this.request<any[]>(`${this.api}/api/admin/facebook/pages/${pageId}/posts${query ? query : ''}`);
  }

  async getLeads(query?: string) {
    return await this.request<any[]>(`${this.api}/api/admin/facebook/leads${query ? query : ''}`);
  }

  async updateLead(leadId: string | number, updates: any) {
    return await this.request<any>(`${this.api}/api/admin/facebook/leads/${leadId}`, {
      method: "PUT",
      body: JSON.stringify(updates),
    });
  }

  async getLeadChatHistory(leadId: string | number) {
    return await this.request<any[]>(`${this.api}/api/admin/facebook/leads/${leadId}/chat`);
  }

  async sendManualMessage(leadId: string | number, message: string) {
    return await this.request<any>(`${this.api}/api/admin/facebook/leads/${leadId}/message`, {
      method: "POST",
      body: JSON.stringify({ message }),
    });
  }

  async updatePageAiConfig(pageId: string, config: any) {
    return await this.request<any>(`${this.api}/api/admin/facebook/pages/${pageId}/ai-config`, {
      method: "PUT",
      body: JSON.stringify(config),
    });
  }

  async getFacebookConversations(pageId: string) {
    return await this.request<any[]>(`${this.api}/api/admin/facebook/pages/${pageId}/conversations`);
  }

  async getFacebookMessages(pageId: string, conversationId: string) {
    return await this.request<any[]>(`${this.api}/api/admin/facebook/pages/${pageId}/conversations/${conversationId}/messages`);
  }

  async getTags() {
    return await this.request<any[]>(`${this.api}/api/admin/facebook/tags`);
  }

  async createTag(tag: { name: string; color: string }) {
    return await this.request<any>(`${this.api}/api/admin/facebook/tags`, {
      method: "POST",
      body: JSON.stringify(tag),
    });
  }

  async deleteTag(tagId: number | string) {
    return await this.request<any>(`${this.api}/api/admin/facebook/tags/${tagId}`, {
      method: "DELETE",
    });
  }

  async getAgents() {
    return await this.request<any[]>(`${this.api}/api/admin/facebook/agents`);
  }

  async createAgent(agent: { name: string; color: string }) {
    return await this.request<any>(`${this.api}/api/admin/facebook/agents`, {
      method: "POST",
      body: JSON.stringify(agent),
    });
  }

  async deleteAgent(agentId: number | string) {
    return await this.request<any>(`${this.api}/api/admin/facebook/agents/${agentId}`, {
      method: "DELETE",
    });
  }
}

const adminFacebookService = new AdminFacebookService();

export default adminFacebookService;
