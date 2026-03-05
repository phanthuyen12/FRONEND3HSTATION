import { API_URL } from '../config';

export interface SystemConfig {
    support_phone: string;
    domain_name: string;
    logo: string;
    header_description: string;
    notification: string;
    commission_rate: string;
}

const getToken = (): string | null => {
    return (
        localStorage.getItem('auth_token') ||
        localStorage.getItem('authToken') ||
        sessionStorage.getItem('auth_token') ||
        sessionStorage.getItem('authToken') ||
        null
    );
};

const configService = {
    async getConfigs(): Promise<SystemConfig> {
        const res = await fetch(`${API_URL}/api/configs`);
        const body = await res.json();
        if (!res.ok) throw new Error(body?.message || 'Không thể tải cấu hình');
        return body.data as SystemConfig;
    },

    async updateConfigs(configs: Partial<SystemConfig>): Promise<SystemConfig> {
        const token = getToken();
        const res = await fetch(`${API_URL}/api/configs`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            body: JSON.stringify(configs),
        });
        const body = await res.json();
        if (!res.ok) throw new Error(body?.message || 'Cập nhật cấu hình thất bại');
        return body.data as SystemConfig;
    },
};

export default configService;
