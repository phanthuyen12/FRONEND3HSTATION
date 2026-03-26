import config from "../config";

const API_URL = `${config.API_URL}/api/client/tool-keys`;

const getToken = (): string | null => {
    return localStorage.getItem('auth_token')
      || localStorage.getItem('authToken')
      || sessionStorage.getItem('auth_token')
      || sessionStorage.getItem('authToken');
};

const request = async (url: string, options: any = {}) => {
  const token = getToken();
  const headers: any = {
    'Content-Type': 'application/json',
    ...options.headers
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(url, { ...options, headers });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || `API Error: ${res.status}`);
  }
  return data;
};

const toolKeyService = {
  // Client: Get all active packages to buy
  listPackages: async () => {
    return await request(`${API_URL}/packages`);
  },

  // Client: Buy a package
  buyPackage: async (packageId: number, priceId: number, paymentMethod: string = "balance") => {
    return await request(`${API_URL}/buy`, {
      method: 'POST',
      body: JSON.stringify({ packageId, priceId, paymentMethod })
    });
  },

  // Client: List my keys
  getMyKeys: async () => {
    return await request(`${API_URL}/my-keys`);
  },

  // Client: Renew a key
  renewKey: async (id: number, priceId: number) => {
    return await request(`${API_URL}/keys/${id}/renew`, {
      method: 'POST',
      body: JSON.stringify({ priceId })
    });
  },

  // Public/Internal: Activate key
  activateKey: async (keyToken: string, machineId: string, machineInfo?: any) => {
    return await request(`${API_URL}/activate`, {
      method: 'POST',
      body: JSON.stringify({ keyToken, machineId, machineInfo })
    });
  },

  // Public/Internal: Check status
  checkKeyStatus: async (keyToken: string, machineId: string) => {
    return await request(`${API_URL}/check-status`, {
      method: 'POST',
      body: JSON.stringify({ keyToken, machineId })
    });
  },
};

export default toolKeyService;
