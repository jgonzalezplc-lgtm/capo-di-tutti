import type { DashboardData } from "@/lib/types";

export const demoData: DashboardData = {
  metrics: {
    activeOrganizations: 18,
    activeUsers30d: 74,
    searches30d: 1284,
    aiCost30d: 183.42,
    aiCalls30d: 3921,
    errorRate: 1.8,
  },
  organizations: [
    { id: "org-1", name: "Constructora Monico", slug: "monico", plan: "business", members: 12, activeMembers: 9, searches30d: 438, aiCost30d: 72.18, status: "active" },
    { id: "org-2", name: "Solar Andes", slug: "solar-andes", plan: "enterprise", members: 28, activeMembers: 21, searches30d: 517, aiCost30d: 83.62, status: "active" },
    { id: "org-3", name: "Ferretería Norte", slug: "ferreteria-norte", plan: "pro", members: 4, activeMembers: 3, searches30d: 116, aiCost30d: 12.93, status: "trial" },
    { id: "org-4", name: "Cuenta individual · Daniela", slug: "daniela", plan: "starter", members: 1, activeMembers: 1, searches30d: 42, aiCost30d: 4.38, status: "active" },
  ],
  users: [
    { id: "usr-1", name: "María González", email: "maria@monico.cl", organizationId: "org-1", organization: "Constructora Monico", roles: ["Propietaria", "Autorizadora"], plan: "business", lastSeenAt: "Hace 8 min", searches30d: 139, aiCost30d: 21.17, status: "active" },
    { id: "usr-2", name: "Sebastián Rojas", email: "srojas@solarandes.cl", organizationId: "org-2", organization: "Solar Andes", roles: ["Cotizador", "Comprador"], plan: "enterprise", lastSeenAt: "Hace 24 min", searches30d: 281, aiCost30d: 36.42, status: "active" },
    { id: "usr-3", name: "Camila Soto", email: "camila@monico.cl", organizationId: "org-1", organization: "Constructora Monico", roles: ["Revisora"], plan: "business", lastSeenAt: "Ayer", searches30d: 76, aiCost30d: 8.91, status: "active" },
    { id: "usr-4", name: "Daniela Pérez", email: "daniela@gmail.com", organizationId: "org-4", organization: "Cuenta individual · Daniela", roles: ["Propietaria"], plan: "starter", lastSeenAt: "Hace 3 días", searches30d: 42, aiCost30d: 4.38, status: "active" },
  ],
  usage: [
    { id: "use-1", occurredAt: "11:42:08", organization: "Solar Andes", user: "Sebastián Rojas", feature: "Cubicación", provider: "Google", model: "gemini-3.5-flash-lite", inputTokens: 6842, outputTokens: 1840, latencyMs: 4320, estimatedCost: 0.084, status: "success" },
    { id: "use-2", occurredAt: "11:39:51", organization: "Constructora Monico", user: "María González", feature: "Identificación", provider: "Google", model: "gemini-2.5-flash", inputTokens: 2281, outputTokens: 614, latencyMs: 1950, estimatedCost: 0.031, status: "fallback" },
    { id: "use-3", occurredAt: "11:35:17", organization: "Ferretería Norte", user: "Felipe Díaz", feature: "Filtro de búsqueda", provider: "Google", model: "gemini-2.5-flash", inputTokens: 1738, outputTokens: 298, latencyMs: 1172, estimatedCost: 0.017, status: "success" },
    { id: "use-4", occurredAt: "11:28:03", organization: "Solar Andes", user: "Ana Muñoz", feature: "Lectura de correo", provider: "Google", model: "gemini-2.5-flash", inputTokens: 3901, outputTokens: 0, latencyMs: 45000, estimatedCost: 0.022, status: "error" },
  ],
  activity: [
    { id: "evt-1", occurredAt: "Hace 2 min", organization: "Solar Andes", user: "Sebastián Rojas", type: "quote.created", entity: "Parque solar 3 MWp", detail: "Lista de 6 materiales creada", status: "healthy" },
    { id: "evt-2", occurredAt: "Hace 7 min", organization: "Constructora Monico", user: "María González", type: "approval.requested", entity: "Bodega metálica 20 m²", detail: "Esperando autorización de Finanzas", status: "warning" },
    { id: "evt-3", occurredAt: "Hace 14 min", organization: "Ferretería Norte", user: "Felipe Díaz", type: "search.completed", entity: "Cable THHN 12 AWG", detail: "34 resultados · 8 relevantes", status: "healthy" },
    { id: "evt-4", occurredAt: "Hace 21 min", organization: "Solar Andes", user: "Ana Muñoz", type: "gmail.sync.failed", entity: "Conversación RFQ-1082", detail: "Timeout del proveedor de IA", status: "critical" },
  ],
};
