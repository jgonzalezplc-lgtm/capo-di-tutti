"use client";

import { FormEvent, useState } from "react";
import { LockKeyhole } from "lucide-react";

export default function LoginPage() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setLoading(true); setError("");
    const form = new FormData(event.currentTarget);
    try {
      const response = await fetch("/api/auth/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: form.get("email"), password: form.get("password") }) });
      const text = await response.text();
      const result = text ? JSON.parse(text) as { error?: string } : {};
      if (!response.ok) { setError(result.error ?? "No fue posible iniciar sesión."); return; }
      window.location.assign("/");
    } catch {
      setError("No fue posible conectar con el servicio de acceso. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  }
  return <main className="login-page"><section className="login-card"><div className="brand__mark">C</div><span className="eyebrow">BAIYER CONTROL PLANE</span><h1>Acceso restringido</h1><p>Solo administradores internos incluidos en la allowlist.</p><form onSubmit={submit}><label>Correo administrativo<input name="email" type="email" autoComplete="email" required /></label><label>Contraseña<input name="password" type="password" autoComplete="current-password" required /></label>{error && <div className="login-error">{error}</div>}<button type="submit" disabled={loading}><LockKeyhole size={16} />{loading ? "Verificando…" : "Ingresar a Capo"}</button></form></section></main>;
}
