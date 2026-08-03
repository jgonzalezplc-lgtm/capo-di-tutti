import "server-only";

import { demoData } from "@/lib/demo-data";
import type { DashboardData } from "@/lib/types";
import { getAdminAccessToken, requireAdmin } from "@/lib/admin-auth";

export type DataMode = "demo" | "supabase";

export function getDataMode(): DataMode {
  return process.env.CAPO_DEMO_MODE === "true" ? "demo" : "supabase";
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
