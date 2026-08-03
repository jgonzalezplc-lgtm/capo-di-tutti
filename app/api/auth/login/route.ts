import { NextResponse } from "next/server";
import { adminCookieNames, isAdminEmail } from "@/lib/admin-auth";

export async function POST(request: Request) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !anonKey) return NextResponse.json({ error: "Supabase no está configurado." }, { status: 503 });

  try {
    const parsedUrl = new URL(supabaseUrl);
    if (parsedUrl.protocol !== "https:") throw new Error("invalid protocol");
  } catch {
    return NextResponse.json({ error: "La URL de Supabase configurada en Railway no es válida." }, { status: 503 });
  }

  const body = await request.json().catch(() => ({})) as { email?: string; password?: string };
  if (!body.email || !body.password) return NextResponse.json({ error: "Correo y contraseña son obligatorios." }, { status: 400 });
  if (!isAdminEmail(body.email)) return NextResponse.json({ error: "Este correo no tiene acceso administrativo." }, { status: 403 });

  let authResponse: Response;
  try {
    authResponse = await fetch(`${supabaseUrl}/auth/v1/token?grant_type=password`, {
      method: "POST",
      headers: { apikey: anonKey, "Content-Type": "application/json" },
      body: JSON.stringify({ email: body.email, password: body.password }),
      cache: "no-store",
    });
  } catch {
    return NextResponse.json({ error: "Capo no pudo conectarse con Supabase. Revisa las variables de Railway." }, { status: 502 });
  }

  const authText = await authResponse.text();
  let auth: { access_token?: string; refresh_token?: string; expires_in?: number; error_description?: string; msg?: string };
  try {
    auth = JSON.parse(authText) as typeof auth;
  } catch {
    return NextResponse.json({ error: "Supabase devolvió una respuesta inválida. Revisa la URL y la clave pública en Railway." }, { status: 502 });
  }
  if (!authResponse.ok || !auth.access_token || !auth.refresh_token) return NextResponse.json({ error: auth.error_description ?? auth.msg ?? "Credenciales inválidas." }, { status: 401 });

  const response = NextResponse.json({ ok: true });
  const secure = process.env.NODE_ENV === "production";
  response.cookies.set(adminCookieNames.access, auth.access_token, { httpOnly: true, secure, sameSite: "strict", path: "/", maxAge: auth.expires_in ?? 3600 });
  response.cookies.set(adminCookieNames.refresh, auth.refresh_token, { httpOnly: true, secure, sameSite: "strict", path: "/api/auth", maxAge: 60 * 60 * 24 * 30 });
  return response;
}
