import "server-only";

import { demoData } from "@/lib/demo-data";
import type { DashboardData } from "@/lib/types";
import { getAdminAccessToken, requireAdmin } from "@/lib/admin-auth";

export type DataMode = "demo" | "supabase";

export function getDataMode(): DataMode {
  return process.env.CAPO_DEMO_MODE === "true" ? "demo" : "supabase";
}

async function adminFetch<T>(path: string, init?: RequestInit): Promise<T> {
  await requireAdmin();
  const apiUrl = process.env.BAIYER_ADMIN_API_URL;
  if (!apiUrl) throw new Error("BAIYER_ADMIN_API_URL no está configurada.");
  const token = await getAdminAccessToken();
  const response = await fetch(`${apiUrl.replace(/\/$/, "")}/api/admin-control-plane${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}`, ...(init?.headers ?? {}) },
    cache: "no-store",
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({})) as { detail?: string };
    throw new Error(error.detail ?? `Baiyer respondió ${response.status}`);
  }
  return response.json() as Promise<T>;
}

export async function getDashboardData(): Promise<DashboardData> {
  await requireAdmin();
  if (getDataMode() === "demo") return demoData;

  const apiUrl = process.env.BAIYER_ADMIN_API_URL;
  if (!apiUrl) throw new Error("BAIYER_ADMIN_API_URL no está configurada.");
  const token = await getAdminAccessToken();
  const response = await fetch(`${apiUrl.replace(/\/$/, "")}/api/admin-control-plane/dashboard`, {
    headers: { Authorization: `Bearer ${token}` }, cache: "no-store",
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({})) as { detail?: string };
    throw new Error(error.detail ?? `Baiyer respondió ${response.status}`);
  }
  return mapDashboard(await response.json() as RawDashboard);
}

export interface PageResult<T> { items: T[]; total: number | null; limit: number; offset: number }

export interface SearchRecord {
  id: string; created_at: string; user_id: string; user_name: string; user_email?: string;
  organization_id?: string; organization: string; item_nombre?: string; categoria_predicha?: string;
  categorias_usadas: string[]; terminos: string[]; modo: string; n_resultados: number; estado: string;
  cotizacion_id?: string; lista_proyecto_id?: string;
  project_id?: string; project_name?: string;
}

export interface EmailRecord {
  id: string; created_at: string; last_message_at?: string; user_id: string; user_name: string;
  user_email?: string; organization_id?: string; organization: string; proveedor_nombre?: string;
  proveedor_email?: string; subject?: string; estado: string;
  project_id?: string; project_name?: string;
  messages: { total: number; inbound: number; outbound: number; pending: number };
}

export interface ProjectDetail {
  id: string; name: string; status?: string; total?: number; created_at: string;
  organization_id?: string; organization: string; actor: string; actor_email?: string; summary?: string;
  items: Array<{ cotizacion_id?: string; name: string; quantity: number; compared: boolean; category?: string; status?: string }>;
}

export interface EmailDetail extends Omit<EmailRecord, "messages"> {
  messages: Array<{
    id: string; direction: string; from_email?: string; to_email?: string; subject?: string;
    body_preview?: string; received_at?: string; created_at?: string; procesado?: boolean;
    attachments: Array<{ id: string; filename?: string; mime_type?: string }>;
  }>;
}

export interface DatabaseResource { key: string; table: string; count: number; available: boolean; error?: string }
export interface DatabaseSummary { resources: DatabaseResource[] }
export interface DatabaseRows extends PageResult<Record<string, unknown>> { resource: string }

export interface PlanCatalogEntry {
  label: string; price: number; limits: { users: number | null; searches_month: number | null; ai_calls_month: number | null };
}
export interface PlansData {
  catalog: Record<string, PlanCatalogEntry>;
  organizations: Array<Record<string, unknown>>;
  billing_enabled: boolean;
}

export interface OrganizationAdminDetail {
  organization: Record<string, unknown>;
  members: Array<Record<string, unknown>>;
}

export const getSearches = () => adminFetch<PageResult<SearchRecord>>("/searches?limit=250");
export const getEmails = () => adminFetch<PageResult<EmailRecord>>("/emails?limit=250");
export const getProjectDetail = (id: string) => adminFetch<ProjectDetail>(`/projects/${encodeURIComponent(id)}`);
export const getEmailDetail = (id: string) => adminFetch<EmailDetail>(`/emails/${encodeURIComponent(id)}`);
export const getDatabaseSummary = () => adminFetch<DatabaseSummary>("/database");
export const getDatabaseRows = (resource: string) => adminFetch<DatabaseRows>(`/database/${encodeURIComponent(resource)}?limit=100`);
export const getPlans = () => adminFetch<PlansData>("/plans");
export const getOrganizationDetail = (id: string) => adminFetch<OrganizationAdminDetail>(`/organizations/${encodeURIComponent(id)}`);

interface RawDashboard {
  metrics: DashboardData["metrics"];
  organizations: Array<Record<string, unknown>>;
  users: Array<Record<string, unknown>>;
  usage: Array<Record<string, unknown>>;
  activity: Array<Record<string, unknown>>;
}

const s = (value: unknown, fallback = "") => typeof value === "string" ? value : fallback;
const n = (value: unknown) => typeof value === "number" ? value : Number(value ?? 0);

function mapDashboard(raw: RawDashboard): DashboardData {
  const organizations = raw.organizations.map(row => ({
    id: s(row.id), name: s(row.nombre), slug: s(row.slug),
    plan: s(row.plan, "free") as DashboardData["organizations"][number]["plan"],
    members: n(row.members), activeMembers: n(row.active_members), searches30d: n(row.searches_30d), aiCost30d: n(row.ai_cost_30d),
    status: s(row.estado, "active") as DashboardData["organizations"][number]["status"],
  }));
  const users = raw.users.map(row => ({
    id: s(row.id), name: s(row.name, "Usuario"), email: s(row.email), organizationId: s(row.organization_id), organization: s(row.organization, "Sin organización"),
    roles: [s(row.membership_role, "member")], plan: s(row.plan, "free") as DashboardData["users"][number]["plan"],
    lastSeenAt: row.last_sign_in_at ? new Date(s(row.last_sign_in_at)).toLocaleString("es-CL") : "Nunca",
    searches30d: n(row.searches_30d), aiCost30d: n(row.ai_cost_30d), status: s(row.status, "active") as DashboardData["users"][number]["status"],
  }));
  const orgNames = new Map(organizations.map(org => [org.id, org.name]));
  const userNames = new Map(users.map(user => [user.id, user.name]));
  const usage = raw.usage.map(row => ({
    id: s(row.id), occurredAt: new Date(s(row.occurred_at)).toLocaleString("es-CL"), organization: orgNames.get(s(row.organization_id)) ?? "Sin organización",
    user: userNames.get(s(row.user_id)) ?? "Sistema", feature: s(row.feature), provider: s(row.provider), model: s(row.effective_model),
    inputTokens: n(row.input_tokens), outputTokens: n(row.output_tokens), latencyMs: n(row.latency_ms), estimatedCost: n(row.estimated_cost_usd),
    status: s(row.status) === "fallback" ? "fallback" as const : s(row.status) === "success" ? "success" as const : "error" as const,
  }));
  const activity = raw.activity.map(row => {
    const metadata = (row.metadata && typeof row.metadata === "object" ? row.metadata : {}) as Record<string, unknown>;
    const status = s(row.status);
    return {
      id: s(row.id), occurredAt: new Date(s(row.occurred_at)).toLocaleString("es-CL"), organization: orgNames.get(s(row.organization_id)) ?? "Sin organización",
      user: userNames.get(s(row.user_id)) ?? "Sistema", type: s(row.event_type), entity: s(row.entity_id, s(row.entity_type, "Evento")),
      detail: s(metadata.detail, s(row.entity_type)), status: status === "warning" ? "warning" as const : status === "error" ? "critical" as const : "healthy" as const,
    };
  });
  return { metrics: raw.metrics, organizations, users, usage, activity };
}
