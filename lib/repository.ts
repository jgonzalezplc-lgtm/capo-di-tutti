import "server-only";

import { demoData } from "@/lib/demo-data";
import type { DashboardData } from "@/lib/types";
import { requireAdmin } from "@/lib/admin-auth";

export type DataMode = "demo" | "supabase";

export function getDataMode(): DataMode {
  return process.env.CAPO_DEMO_MODE === "true" ? "demo" : "supabase";
}

export async function getDashboardData(): Promise<DashboardData> {
  await requireAdmin();
  if (getDataMode() === "demo") return demoData;

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("CapoDiTutti requiere Supabase en producción; el modo demo está desactivado.");
  }

  // La conexión real se habilita cuando Baiyer aplique el ledger multiempresa.
  // Fallar explícitamente evita presentar datos ficticios como producción.
  throw new Error("El conector de Baiyer todavía no está habilitado.");
}
