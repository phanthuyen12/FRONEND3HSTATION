import { API_URL } from '../config';
import { SupportContent, defaultSupportContent } from '../client/landing/data/supportContent';

export interface ContactRequestPayload {
  name: string;
  email: string;
  phone?: string;
  topic: string;
  message: string;
  sourcePage?: string;
  refCode?: string;
  redirectUrl?: string;
}

const supportService = {
  async getSupportContent(): Promise<SupportContent> {
    const res = await fetch(`${API_URL}/api/support/content`);
    const body = await res.json().catch(() => null);

    if (!res.ok || !body?.success) {
      throw new Error(body?.message || 'Không thể tải nội dung hỗ trợ');
    }

    return {
      ...defaultSupportContent,
      ...body.data,
    } as SupportContent;
  },

  async createContactRequest(payload: ContactRequestPayload) {
    const res = await fetch(`${API_URL}/api/support/contact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const body = await res.json().catch(() => null);

    if (!res.ok || !body?.success) {
      throw new Error(body?.message || 'Không thể gửi yêu cầu hỗ trợ');
    }

    return body.data;
  },
};

export default supportService;
