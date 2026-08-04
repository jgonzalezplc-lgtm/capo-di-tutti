import { NextResponse } from "next/server";
import { getAdminAccessToken, requireAdmin } from "@/lib/admin-auth";

async function proxy(request: Request, path: string[]) {
  await requireAdmin();
  const apiUrl = process.env.BAIYER_ADMIN_API_URL;
  if (!apiUrl) return NextResponse.json({ error: "BAIYER_ADMIN_API_URL no está configurada." }, { status: 503 });
  const token = await getAdminAccessToken();
  const body = request.method === "GET" ? undefined : await request.text();
  const response = await fetch(`${apiUrl.replace(/\/$/, "")}/api/admin-control-plane/${path.map(encodeURIComponent).join("/")}`, {
    method: request.method,
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: body || undefined,
    cache: "no-store",
  });
  const text = await response.text();
  return new NextResponse(text, { status: response.status, headers: { "Content-Type": "application/json" } });
}

export async function POST(request: Request, { params }: { params: Promise<{ path: string[] }> }) { return proxy(request, (await params).path); }
export async function PATCH(request: Request, { params }: { params: Promise<{ path: string[] }> }) { return proxy(request, (await params).path); }
export async function DELETE(request: Request, { params }: { params: Promise<{ path: string[] }> }) { return proxy(request, (await params).path); }
