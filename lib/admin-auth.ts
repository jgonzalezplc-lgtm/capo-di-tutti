import "server-only";

import { cookies } from "next/headers";

const ACCESS_COOKIE = "capo_access_token";
const REFRESH_COOKIE = "capo_refresh_token";

export function configuredAdminEmails(): string[] {
  return (process.env.CAPO_ADMIN_EMAILS ?? "")
    .split(",")
    .map(email => email.trim().toLowerCase())
    .filter(Boolean);
}

export function isAdminEmail(email: string | undefined): boolean {
  return Boolean(email && configuredAdminEmails().includes(email.toLowerCase()));
}

export async function requireAdmin(): Promise<{ id: string; email: string }> {
  if (process.env.CAPO_DEMO_MODE === "true") return { id: "demo-admin", email: "demo@capo.local" };

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const accessToken = (await cookies()).get(ACCESS_COOKIE)?.value;
  if (!supabaseUrl || !anonKey || !accessToken) throw new Error("Acceso administrativo no autorizado.");

  const response = await fetch(`${supabaseUrl}/auth/v1/user`, {
    headers: { apikey: anonKey, Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  });
  if (!response.ok) throw new Error("La sesión administrativa expiró.");
  const user = await response.json() as { id?: string; email?: string };
  if (!user.id || !user.email || !isAdminEmail(user.email)) throw new Error("El usuario no pertenece a la allowlist de Capo.");
  return { id: user.id, email: user.email };
}

export const adminCookieNames = { access: ACCESS_COOKIE, refresh: REFRESH_COOKIE };
