export interface User {
  id: string;
  name: string;
  email: string;
  role?: string;
  phone?: string;
  balance?: number;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface RefreshTokenResponse {
  token: string;
  refreshToken?: string;
}

interface ApiResponse<T> {
  success?: boolean;
  data: T;
  message?: string;
}

class AuthService {
  private api: string;
  private tokenKey = 'auth_token';
  private refreshTokenKey = 'refresh_token';
  private userKey = 'auth_user';

  constructor(apiUrl: string = "") {
    this.api = apiUrl;
  }

  private async request<T>(url: string, options?: RequestInit, retry = true): Promise<T> {
    try {
      const headers: HeadersInit = {
        "Content-Type": "application/json",
      };

      // Thêm token vào header nếu có
      const token = this.getToken();
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const res = await fetch(this.api + url, {
        headers,
        ...options,
      });

      const body: ApiResponse<T> = await res.json();

      // Nếu token hết hạn (401), thử refresh token
      if (res.status === 401 && retry) {
        const refreshToken = this.getRefreshToken();
        if (refreshToken) {
          try {
            await this.refreshToken();
            // Retry request với token mới
            return this.request<T>(url, options, false);
          } catch (refreshError) {
            // Refresh token thất bại, đăng xuất
            this.clearAuth();
            window.location.href = '/login';
            throw new Error("Session expired. Please login again.");
          }
        } else {
          // Không có refresh token, đăng xuất
          this.clearAuth();
          window.location.href = '/login';
          throw new Error("Session expired. Please login again.");
        }
      }

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

  // Lưu token và user vào localStorage
  private saveAuth(token: string, user: User, refreshToken?: string) {
    localStorage.setItem(this.tokenKey, token);
    localStorage.setItem(this.userKey, JSON.stringify(user));
    if (refreshToken) {
      localStorage.setItem(this.refreshTokenKey, refreshToken);
    }
  }

  // Xóa token và user khỏi localStorage
  private clearAuth() {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    localStorage.removeItem(this.refreshTokenKey);
  }

  // Lấy token từ localStorage
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  // Lấy refresh token từ localStorage
  getRefreshToken(): string | null {
    return localStorage.getItem(this.refreshTokenKey);
  }

  // Lấy user từ localStorage
  getUser(): User | null {
    const userStr = localStorage.getItem(this.userKey);
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  }

  // Kiểm tra đã đăng nhập chưa
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  // Đăng ký
  async register(payload: {
    name: string;
    email: string;
    password: string;
    phone?: string;
  }): Promise<AuthResponse> {
    const response = await this.request<any>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    // API trả về format: { data: { token, user } }
    const authData = response?.data || response;
    const token = authData?.token;
    const user = authData?.user;

    // Lưu token và user
    if (token && user) {
      this.saveAuth(token, user);
      
      // Trả về format chuẩn
      return {
        token,
        user,
      };
    } else {
      throw new Error("Response không hợp lệ từ server");
    }
  }

  // Đăng nhập
  async login(payload: {
    email: string;
    password: string;
  }): Promise<AuthResponse> {
    const response = await this.request<any>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    console.log("Login API response:", response);

    // API trả về format: { data: { token, user } }
    const authData = response?.data || response;
    const token = authData?.token;
    const user = authData?.user;

    // Lưu token và user
    if (token && user) {
      this.saveAuth(token, user);
      console.log("Token và user đã được lưu vào localStorage");
      
      // Trả về format chuẩn
      return {
        token,
        user,
      };
    } else {
      console.error("Response không có token hoặc user:", response);
      throw new Error("Response không hợp lệ từ server");
    }
  }

  // Đăng xuất
  async logout(): Promise<void> {
    try {
      await this.request<void>("/api/auth/logout", {
        method: "POST",
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Logout error:", error);
    } finally {
      // Luôn xóa token dù API có lỗi
      this.clearAuth();
    }
  }

  // Refresh token
  async refreshToken(): Promise<RefreshTokenResponse> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    const response = await this.request<RefreshTokenResponse>("/api/auth/refresh-token", {
      method: "POST",
      body: JSON.stringify({ refreshToken }),
    });

    // Cập nhật token mới
    if (response.token) {
      const user = this.getUser();
      if (user) {
        this.saveAuth(response.token, user, response.refreshToken);
      } else {
        localStorage.setItem(this.tokenKey, response.token);
        if (response.refreshToken) {
          localStorage.setItem(this.refreshTokenKey, response.refreshToken);
        }
      }
    }

    return response;
  }

  // Quên mật khẩu
  async forgotPassword(email: string): Promise<void> {
    await this.request<void>("/api/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  }

  // Đặt lại mật khẩu
  async resetPassword(payload: {
    token: string;
    newPassword: string;
  }): Promise<void> {
    await this.request<void>("/api/auth/reset-password", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }

  // Lấy thông tin profile
  async getProfile(): Promise<User> {
    const response = await this.request<{ data: User } | User>("/api/client/users/me");
    
    // Xử lý response có thể là { data: User } hoặc User trực tiếp
    if (response && typeof response === 'object' && 'data' in response) {
      return (response as any).data;
    }
    
    return response as User;
  }

  // Cập nhật profile
  async updateProfile(payload: Partial<User>): Promise<User> {
    const response = await this.request<{ data: User } | User>("/api/client/users/me", {
      method: "PUT",
      body: JSON.stringify(payload),
    });
    
    // Cập nhật user trong localStorage
    if (response) {
      const updatedUser = (typeof response === 'object' && 'data' in response) ? (response as any).data : response;
      this.saveAuth(this.getToken() || '', updatedUser as User);
    }
    
    // Xử lý response có thể là { data: User } hoặc User trực tiếp
    if (response && typeof response === 'object' && 'data' in response) {
      return (response as any).data;
    }
    
    return response as User;
  }

  // Đổi mật khẩu (khi đã đăng nhập)
  async changePassword(payload: {
    currentPassword: string;
    newPassword: string;
  }): Promise<void> {
    await this.request<void>("/api/client/users/change-password", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }
}

export default AuthService;

