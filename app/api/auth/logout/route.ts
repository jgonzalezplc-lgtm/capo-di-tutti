import { NextResponse } from "next/server";
import { adminCookieNames } from "@/lib/admin-auth";

export async function POST() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(adminCookieNames.access, "", { httpOnly: true, maxAge: 0, path: "/" });
  response.cookies.set(adminCookieNames.refresh, "", { httpOnly: true, maxAge: 0, path: "/api/auth" });
  return response;
}
