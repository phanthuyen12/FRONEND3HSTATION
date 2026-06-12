import { API_URL } from './constants/api';

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
import adminRankService from './services/adminRankService';
import configService from './services/configService';
import toolKeyService from './services/toolKeyService';


// Tạo instance ElearningService
export const elearningService = new ElearningService(API_URL);

// Tạo instance AdminElearningService
export const adminElearningService = new AdminElearningService(API_URL);
export const vpsService = new VpsService(API_URL);
export const workflowsService = new WorkflowsService(API_URL);
export const userService = new UserService(API_URL);
export const authService = new AuthService(API_URL);
export const documentService = new DocumentService(API_URL);
export const adminOrderService = new AdminOrderService(API_URL);
export const topupService = new TopupService(API_URL);
export const bankService = new BankService(API_URL);
export const rankService = adminRankService;
export const toolKeyServiceInstance = toolKeyService;
export { configService, toolKeyService, API_URL };
export type { Bank };

const config = {
  API_URL,
};

export default config;
