import Link from "next/link";
import { Database, Rows3, ShieldCheck, Table2 } from "lucide-react";
import { MetricCard } from "@/components/metric-card";
import { SectionHeading } from "@/components/section-heading";
import { StatusPill } from "@/components/status-pill";
import { getDatabaseRows, getDatabaseSummary } from "@/lib/repository";

const labels: Record<string, string> = { organizations: "Organizaciones", users: "Usuarios", searches: "Búsquedas", projects: "Proyectos", quotes: "Cotizaciones", suppliers: "Proveedores", email_conversations: "Correos", product_events: "Eventos", ai_usage: "Consumo IA" };
const display = (value: unknown) => value == null ? "—" : typeof value === "object" ? JSON.stringify(value).slice(0, 120) : String(value);

export default async function DatabasePage({ searchParams }: { searchParams: Promise<{ resource?: string }> }) {
  const summary = await getDatabaseSummary();
  const requested = (await searchParams).resource;
  const selected = summary.resources.find(row => row.key === requested && row.available)?.key ?? summary.resources.find(row => row.available)?.key;
  let rows = null;
  let loadError = "";
  try {
    rows = selected ? await getDatabaseRows(selected) : null;
  } catch (error) {
    loadError = error instanceof Error ? error.message : "No fue posible consultar este recurso.";
  }
  const columns = rows?.items[0] ? Object.keys(rows.items[0]).slice(0, 9) : [];
  const total = summary.resources.reduce((sum, row) => sum + row.count, 0);
  return <main className="page">
    <SectionHeading eyebrow="DATA EXPLORER" title="Base de datos" description="Explorador administrativo de solo lectura, limitado a recursos permitidos y segmentados." />
    <section className="metrics-grid metrics-grid--four">
      <MetricCard label="Recursos" value={String(summary.resources.length)} detail="Allowlist administrativa" icon={Database} />
      <MetricCard label="Disponibles" value={String(summary.resources.filter(row => row.available).length)} detail="Consultables ahora" icon={ShieldCheck} />
      <MetricCard label="Registros" value={total.toLocaleString("es-CL")} detail="Suma de recursos" icon={Rows3} />
      <MetricCard label="Modo" value="Solo lectura" detail="Sin editor SQL" icon={Table2} />
    </section>
    <section className="resource-grid">{summary.resources.map(resource => <Link key={resource.key} href={`/base-de-datos?resource=${resource.key}`} className={`resource-card ${selected === resource.key ? "resource-card--active" : ""}`}><div><strong>{labels[resource.key] || resource.key}</strong><small>{resource.table}</small></div><span>{resource.count.toLocaleString("es-CL")}</span><StatusPill tone={resource.available ? "green" : "red"}>{resource.available ? "disponible" : "no disponible"}</StatusPill></Link>)}</section>
    <section className="panel"><div className="panel__heading"><div><span className="eyebrow">RECURSO SELECCIONADO</span><h2>{selected ? labels[selected] || selected : "Sin recurso"}</h2></div><span className="eyebrow">{rows?.total ?? 0} registros</span></div>{loadError && <div className="inline-notice inline-notice--error">{loadError}</div>}<div className="table-wrap"><table><thead><tr>{columns.map(column => <th key={column}>{column.replaceAll("_", " ")}</th>)}</tr></thead><tbody>{rows?.items.map((row, index) => <tr key={String(row.id ?? index)}>{columns.map(column => <td key={column}>{display(row[column])}</td>)}</tr>)}{!rows?.items.length && <tr><td colSpan={Math.max(columns.length, 1)}>{loadError ? "El resto de Capo continúa disponible." : "No hay registros para mostrar."}</td></tr>}</tbody></table></div></section>
  </main>;
}
