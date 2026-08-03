import { Activity, Bot, Building2, CircleAlert, Clock3, Search, Users } from "lucide-react";
import { MetricCard } from "@/components/metric-card";
import { StatusPill } from "@/components/status-pill";
import { getDashboardData } from "@/lib/repository";

const clp = new Intl.NumberFormat("es-CL", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

export default async function DashboardPage() {
  const data = await getDashboardData();
  return (
    <main className="page">
      <div className="page-heading"><div><span className="eyebrow">VISIÓN GENERAL · ÚLTIMOS 30 DÍAS</span><h1>Command Center</h1><p>Operación, clientes y costo tecnológico de Baiyer en una sola vista.</p></div><button className="secondary-button"><Clock3 size={16} />Últimos 30 días</button></div>
      <section className="metrics-grid">
        <MetricCard label="Organizaciones activas" value={String(data.metrics.activeOrganizations)} detail="+3 durante el período" icon={Building2} />
        <MetricCard label="Usuarios activos" value={String(data.metrics.activeUsers30d)} detail="61% de usuarios registrados" icon={Users} />
        <MetricCard label="Búsquedas" value={data.metrics.searches30d.toLocaleString("es-CL")} detail="42,8 búsquedas por día" icon={Search} />
        <MetricCard label="Consumo de IA" value={clp.format(data.metrics.aiCost30d)} detail={`${data.metrics.aiCalls30d.toLocaleString("es-CL")} llamadas registradas`} icon={Bot} />
        <MetricCard label="Tasa de error" value={`${data.metrics.errorRate}%`} detail="Objetivo operacional < 1%" icon={CircleAlert} tone="warning" />
      </section>
      <div className="dashboard-grid">
        <section className="panel panel--wide">
          <div className="panel__heading"><div><span className="eyebrow">ACTIVIDAD EN VIVO</span><h2>Últimos eventos</h2></div><button className="text-button">Ver todo →</button></div>
          <div className="activity-list">{data.activity.map(event => <article className="activity-row" key={event.id}><div className={`event-icon event-icon--${event.status}`}><Activity size={16} /></div><div className="activity-main"><strong>{event.entity}</strong><span>{event.detail}</span><small>{event.type} · {event.organization} · {event.user}</small></div><time>{event.occurredAt}</time></article>)}</div>
        </section>
        <section className="panel">
          <div className="panel__heading"><div><span className="eyebrow">CARTERA</span><h2>Organizaciones</h2></div><button className="text-button">Explorar →</button></div>
          <div className="org-list">{data.organizations.map(org => <article key={org.id}><div className="org-avatar">{org.name.slice(0, 2).toUpperCase()}</div><div><strong>{org.name}</strong><span>{org.members} miembros · {org.plan}</span></div><StatusPill tone={org.status === "active" ? "green" : "amber"}>{org.status === "active" ? "Activa" : "Trial"}</StatusPill></article>)}</div>
        </section>
      </div>
      <section className="panel usage-panel">
        <div className="panel__heading"><div><span className="eyebrow">AI OBSERVATORY</span><h2>Consumo reciente de modelos</h2></div><button className="text-button">Abrir observatorio →</button></div>
        <div className="table-wrap"><table><thead><tr><th>Hora</th><th>Organización / usuario</th><th>Función</th><th>Modelo</th><th>Tokens</th><th>Latencia</th><th>Costo</th><th>Estado</th></tr></thead><tbody>{data.usage.map(row => <tr key={row.id}><td>{row.occurredAt}</td><td><strong>{row.organization}</strong><small>{row.user}</small></td><td>{row.feature}</td><td><code>{row.model}</code></td><td>{(row.inputTokens + row.outputTokens).toLocaleString("es-CL")}</td><td>{(row.latencyMs / 1000).toFixed(1)} s</td><td>${row.estimatedCost.toFixed(3)}</td><td><StatusPill tone={row.status === "success" ? "green" : row.status === "fallback" ? "amber" : "red"}>{row.status}</StatusPill></td></tr>)}</tbody></table></div>
      </section>
    </main>
  );
}
