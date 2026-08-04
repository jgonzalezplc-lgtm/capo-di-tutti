import { NextResponse } from "next/server";
import { getAdminAccessToken, requireAdmin } from "@/lib/admin-auth";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const apiUrl = process.env.BAIYER_ADMIN_API_URL;
  if (!apiUrl) return NextResponse.json({ error: "BAIYER_ADMIN_API_URL no está configurada." }, { status: 503 });
  const token = await getAdminAccessToken();
  const body = await request.text();
  const { id } = await params;
  const response = await fetch(`${apiUrl.replace(/\/$/, "")}/api/admin-control-plane/plans/organizations/${encodeURIComponent(id)}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body,
    cache: "no-store",
  });
  const text = await response.text();
  if (!response.ok) {
    const parsed = text ? JSON.parse(text) as { detail?: string } : {};
    return NextResponse.json({ error: parsed.detail || `Baiyer respondió ${response.status}` }, { status: response.status });
  }
  return new NextResponse(text, { status: 200, headers: { "Content-Type": "application/json" } });
}
