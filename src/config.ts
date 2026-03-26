// Cấu hình chung cho frontend
// - API_URL: base URL của backend (ví dụ: http://api.3hstation.com)
// - Có thể override bằng biến môi trường Vite: VITE_API_URL

import ElearningService from './services/elearningService';
import AdminElearningService from './services/adminElearningService';
import VpsService from './services/vpsService';
import WorkflowsService from './services/workflowsService';
import UserService from './services/userService';
import AuthService from './services/authService';
import DocumentService from './services/documentService';
import AdminOrderService from './services/adminOrderService';
import TopupService from './services/topupService';
import BankService, { Bank } from './services/bankService';
import configService from './services/configService';
// Base URL cho backend
export const API_URL: string = 'http://api.3hstation.com';

// Tạo instance ElearningService
export const elearningService = new ElearningService();

// Tạo instance AdminElearningService
export const adminElearningService = new AdminElearningService();
export const vpsService = new VpsService(API_URL);
export const workflowsService = new WorkflowsService(API_URL);
export const userService = new UserService(API_URL);
export const authService = new AuthService(API_URL);
export const documentService = new DocumentService(API_URL);
export const adminOrderService = new AdminOrderService(API_URL);
export const topupService = new TopupService(API_URL);
export const bankService = new BankService(API_URL);
export { configService };
export type { Bank };

const config = {
  API_URL,
};

export default config;
