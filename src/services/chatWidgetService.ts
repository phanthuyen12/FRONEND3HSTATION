import config from "../config";

export interface ChatWidgetTopic {
  id: string;
  label: string;
  description: string;
  starterQuestion: string;
  openingMessage: string;
  enabled: boolean;
}

export interface ChatWidgetAdminTopic extends ChatWidgetTopic {
  difyInputs: Record<string, any>;
}

export interface ChatWidgetPublicConfig {
  enabled: boolean;
  assistantName: string;
  assistantSubtitle: string;
  avatarEmoji: string;
  welcomeMessage: string;
  inputPlaceholder: string;
  sendButtonLabel: string;
  leadButtonLabel: string;
  leadTitle: string;
  leadDescription: string;
  leadSuccessMessage: string;
  topics: ChatWidgetTopic[];
}

export interface ChatWidgetAdminConfig extends ChatWidgetPublicConfig {
  difyApiUrl: string;
  difyApiKey: string;
  enableNativeUserContext: boolean;
  topics: ChatWidgetAdminTopic[];
}

export interface ChatWidgetHistoryItem {
  id: number;
  sessionId: string;
  topicId: string | null;
  topicLabel: string | null;
  sourcePage: string | null;
  role: "user" | "assistant" | "system" | "lead";
  eventType: "message" | "lead_capture" | "status";
  message: string | null;
  difyConversationId: string | null;
  contactName: string | null;
  contactPhone: string | null;
  contactEmail: string | null;
  metadata: Record<string, any> | null;
  createdAt: string;
}

export interface ChatWidgetHistoryStats {
  totalMessages: number;
  totalSessions: number;
  totalUserMessages: number;
  totalAssistantMessages: number;
  totalLeads: number;
}

export interface ChatWidgetHistoryResponse {
  data: ChatWidgetHistoryItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

const API_URL = `${config.API_URL}/api/web-chat`;
const SESSION_STORAGE_KEY = "ai_chat_widget_session_id";

const getToken = (): string | null => {
  return (
    localStorage.getItem("auth_token") ||
    localStorage.getItem("authToken") ||
    sessionStorage.getItem("auth_token") ||
    sessionStorage.getItem("authToken") ||
    null
  );
};

const request = async <T>(url: string, options?: RequestInit): Promise<T> => {
  const token = getToken();
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(options?.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  const body = await response.json().catch(() => null);
  if (!response.ok || !body?.success) {
    throw new Error(body?.message || "Khong the xu ly AI chat widget");
  }

  return body.data as T;
};

const chatWidgetService = {
  async getPublicConfig(): Promise<ChatWidgetPublicConfig> {
    return request<ChatWidgetPublicConfig>(`${API_URL}/widget`);
  },

  async getAdminConfig(): Promise<ChatWidgetAdminConfig> {
    return request<ChatWidgetAdminConfig>(`${API_URL}/admin-config`);
  },

  async updateAdminConfig(payload: ChatWidgetAdminConfig): Promise<ChatWidgetAdminConfig> {
    return request<ChatWidgetAdminConfig>(`${API_URL}/admin-config`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  async getHistory(params?: {
    page?: number;
    limit?: number;
    topicId?: string;
    sessionId?: string;
    role?: string;
    eventType?: string;
    search?: string;
    sourcePage?: string;
  }): Promise<ChatWidgetHistoryResponse> {
    const query = new URLSearchParams();
    if (params?.page) query.set("page", String(params.page));
    if (params?.limit) query.set("limit", String(params.limit));
    if (params?.topicId) query.set("topicId", params.topicId);
    if (params?.sessionId) query.set("sessionId", params.sessionId);
    if (params?.role) query.set("role", params.role);
    if (params?.eventType) query.set("eventType", params.eventType);
    if (params?.search) query.set("search", params.search);
    if (params?.sourcePage) query.set("sourcePage", params.sourcePage);

    return request<ChatWidgetHistoryResponse>(
      `${API_URL}/admin-history${query.toString() ? `?${query.toString()}` : ""}`
    );
  },

  async getHistoryStats(): Promise<ChatWidgetHistoryStats> {
    return request<ChatWidgetHistoryStats>(`${API_URL}/admin-history/stats`);
  },

  getStoredSessionId(): string {
    return localStorage.getItem(SESSION_STORAGE_KEY) || "";
  },

  saveSessionId(sessionId: string) {
    if (!sessionId) return;
    localStorage.setItem(SESSION_STORAGE_KEY, sessionId);
  },

  buildSocketUrl(pagePath?: string, sessionId?: string) {
    const wsBase = (config.API_URL || window.location.origin)
      .replace(/^http/i, "ws")
      .replace(/\/$/, "");

    const params = new URLSearchParams();
    if (pagePath) params.set("page", pagePath);
    if (sessionId) params.set("sessionId", sessionId);
    const token = getToken();
    if (token) params.set("token", token);

    return `${wsBase}/ws/chat-widget${params.toString() ? `?${params.toString()}` : ""}`;
  },
};

export default chatWidgetService;
