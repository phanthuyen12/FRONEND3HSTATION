import { Workflow } from "./workflows";
import { UserProfile, mockUsers } from "./user";
import { workflows } from "./workflows";

export type WorkflowRegistrationStatus =
  | "cho-duyet"
  | "da-duyet"
  | "da-huy";

export interface WorkflowRegistration {
  id: string;
  userId: string;
  workflowId: string;
  status: WorkflowRegistrationStatus;
  createdAt: string;
}

export interface WorkflowRegistrationExpanded extends WorkflowRegistration {
  user?: UserProfile;
  workflow?: Workflow;
}

export const workflowRegistrations: WorkflowRegistration[] = [
  {
    id: "wf-reg-001",
    userId: "u-001",
    workflowId: "onboarding-course",
    status: "da-duyet",
    createdAt: "05/12/2025 10:15:20",
  },
  {
    id: "wf-reg-002",
    userId: "u-001",
    workflowId: "up-sell-course",
    status: "cho-duyet",
    createdAt: "06/12/2025 09:03:10",
  },
  {
    id: "wf-reg-003",
    userId: "u-002",
    workflowId: "payment-reminder",
    status: "da-duyet",
    createdAt: "04/12/2025 16:45:00",
  },
  {
    id: "wf-reg-004",
    userId: "u-003",
    workflowId: "onboarding-course",
    status: "cho-duyet",
    createdAt: "03/12/2025 14:12:33",
  },
];

export const expandWorkflowRegistrations = (): WorkflowRegistrationExpanded[] =>
  workflowRegistrations.map((reg) => ({
    ...reg,
    user: mockUsers.find((u) => u.id === reg.userId),
    workflow: workflows.find((w) => w.id === reg.workflowId),
  }));















