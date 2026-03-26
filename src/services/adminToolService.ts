import config from "../config";

const API_URL = `${config.API_URL}/api/admin/tool-packages`;

// Hàm lấy token linh hoạt từ nhiều nguồn (localStorage / sessionStorage)
const getToken = (): string | null => {
  try {
    // 1. Thử lấy từ sessionStorage (phổ biến trong Konrix Admin)
    const konrixRaw = sessionStorage.getItem('konrix_user');
    if (konrixRaw) {
      const parsed = JSON.parse(konrixRaw);
      const t = parsed?.token || parsed?.data?.token || parsed?.user?.token;
      if (t) return t;
    }

    // 2. Thử lấy từ localStorage (Common usage in AuthService)
    const fromLocal = localStorage.getItem('auth_token') || localStorage.getItem('authToken');
    if (fromLocal) return fromLocal;

    // 3. Dự phòng các phím khác
    const fromSession = sessionStorage.getItem('auth_token') || sessionStorage.getItem('authToken');
    if (fromSession) return fromSession;
    
  } catch (error) {
    console.error('Error getting token:', error);
  }
  return null;
};

const request = async (url: string, options: any = {}) => {
  const token = getToken();
  const headers: any = {
    'Content-Type': 'application/json',
    ...options.headers
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  } else {
    console.warn('⚠️ No token found for request to:', url);
  }

  const res = await fetch(url, { ...options, headers });
  const body = await res.json();
  
  if (!res.ok) {
    throw new Error(body?.message || `API Error: ${res.status}`);
  }
  return body;
};

const adminToolService = {
  getToolPackages: async () => {
    return await request(API_URL);
  },

  createToolPackage: async (data: any) => {
    return await request(API_URL, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  updateToolPackage: async (id: number, data: any) => {
    return await request(`${API_URL}/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data)
    });
  },

  deleteToolPackage: async (id: number) => {
    return await request(`${API_URL}/${id}`, {
      method: 'DELETE'
    });
  },

  getAllToolKeys: async () => {
    return await request(`${API_URL}/keys`);
  },

  updateToolKeyStatus: async (id: number, status: string) => {
    return await request(`${API_URL}/keys/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status })
    });
  },

  // Admin: Pricing options management
  addPackagePrice: async (packageId: number, data: { label: string, duration_days: number, price: number }) => {
    return await request(`${API_URL}/${packageId}/prices`, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  deletePackagePrice: async (id: number) => {
    return await request(`${API_URL}/prices/${id}`, {
      method: 'DELETE'
    });
  },
};

export default adminToolService;
