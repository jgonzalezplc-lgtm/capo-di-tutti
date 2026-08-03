export type Plan = "free" | "starter" | "pro" | "business" | "enterprise";
export type Health = "healthy" | "warning" | "critical";

export interface Organization {
  id: string;
  name: string;
  slug: string;
  plan: Plan;
  members: number;
  activeMembers: number;
  searches30d: number;
  aiCost30d: number;
  status: "active" | "trial" | "suspended";
}

export interface AdminUserSummary {
  id: string;
  name: string;
  email: string;
  organizationId: string;
  organization: string;
  roles: string[];
  plan: Plan;
  lastSeenAt: string;
  searches30d: number;
  aiCost30d: number;
  status: "active" | "invited" | "suspended";
}

export interface UsageEvent {
  id: string;
  occurredAt: string;
  organization: string;
  user: string;
  feature: string;
  provider: string;
  model: string;
  inputTokens: number;
  outputTokens: number;
  latencyMs: number;
  estimatedCost: number;
  status: "success" | "fallback" | "error";
}

export interface ProductEvent {
  id: string;
  occurredAt: string;
  organization: string;
  user: string;
  type: string;
  entity: string;
  detail: string;
  status: Health;
}

export interface DashboardData {
  organizations: Organization[];
  users: AdminUserSummary[];
  usage: UsageEvent[];
  activity: ProductEvent[];
  metrics: {
    activeOrganizations: number;
    activeUsers30d: number;
    searches30d: number;
    aiCost30d: number;
    aiCalls30d: number;
    errorRate: number;
  };
}
