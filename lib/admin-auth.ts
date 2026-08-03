import "server-only";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

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
  if (!supabaseUrl || !anonKey) throw new Error("Supabase no está configurado para Capo.");

  const accessToken = (await cookies()).get(ACCESS_COOKIE)?.value;
  if (!accessToken) redirect("/login");

  const response = await fetch(`${supabaseUrl}/auth/v1/user`, {
    headers: { apikey: anonKey, Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  });
  if (!response.ok) redirect("/login?reason=expired");

  const user = await response.json() as { id?: string; email?: string };
  if (!user.id || !user.email || !isAdminEmail(user.email)) redirect("/login?reason=unauthorized");

  return { id: user.id, email: user.email };
}

export async function getAdminAccessToken(): Promise<string> {
  const token = (await cookies()).get(ACCESS_COOKIE)?.value;
  if (!token) throw new Error("No existe una sesión administrativa activa.");
  return token;
}

export const adminCookieNames = { access: ACCESS_COOKIE, refresh: REFRESH_COOKIE };
