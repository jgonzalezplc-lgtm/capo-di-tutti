"use client";

import { useState } from "react";
import type { PlansData } from "@/lib/repository";
import { StatusPill } from "@/components/status-pill";

export function PlanManager({ initial }: { initial: PlansData }) {
  const [organizations, setOrganizations] = useState(initial.organizations);
  const [saving, setSaving] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  async function changePlan(id: string, plan: string, organization: string) {
    const reason = window.prompt(`Motivo del cambio de plan para ${organization}:`);
    if (!reason || reason.trim().length < 3) return;
    setSaving(id); setMessage("");
    const response = await fetch(`/api/plans/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ plan, reason: reason.trim() }) });
    const result = await response.json().catch(() => ({})) as { error?: string };
    if (!response.ok) setMessage(result.error || "No fue posible cambiar el plan.");
    else { setOrganizations(current => current.map(org => String(org.id) === id ? { ...org, plan } : org)); setMessage("Plan actualizado y registrado en auditoría."); }
    setSaving(null);
  }

  return <section className="panel">
    <div className="panel__heading"><div><span className="eyebrow">CONTROL INTERNO</span><h2>Organizaciones y límites</h2></div><StatusPill tone="neutral">$0 durante beta</StatusPill></div>
    {message && <div className="inline-notice">{message}</div>}
    <div className="table-wrap"><table><thead><tr><th>Organización</th><th>Tipo</th><th>Miembros</th><th>Búsquedas 30d</th><th>IA 30d</th><th>Plan interno</th><th>Límites</th></tr></thead><tbody>{organizations.map(org => {
      const id = String(org.id); const plan = String(org.plan || "free"); const catalog = initial.catalog[plan];
      return <tr key={id}><td><strong>{String(org.nombre || "Sin nombre")}</strong><small>{String(org.slug || id)}</small></td><td>{String(org.tipo || "individual")}</td><td>{Number(org.members || 0)}</td><td>{Number(org.searches_30d || 0)}</td><td>${Number(org.ai_cost_30d || 0).toFixed(3)}</td><td><select className="admin-select" value={plan} disabled={saving === id} onChange={event => void changePlan(id, event.target.value, String(org.nombre || "organización"))}>{Object.entries(initial.catalog).map(([key, entry]) => <option key={key} value={key}>{entry.label}</option>)}</select></td><td><small>{catalog?.limits.users ?? "∞"} usuarios · {catalog?.limits.searches_month ?? "∞"} búsquedas/mes</small></td></tr>;
    })}</tbody></table></div>
  </section>;
}
