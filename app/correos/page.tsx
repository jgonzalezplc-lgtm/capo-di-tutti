import Link from "next/link";
import { Inbox, MailCheck, MailWarning, Send } from "lucide-react";
import { MetricCard } from "@/components/metric-card";
import { SectionHeading } from "@/components/section-heading";
import { StatusPill } from "@/components/status-pill";
import { getEmails } from "@/lib/repository";

export default async function EmailsPage() {
  const page = await getEmails();
  const inbound = page.items.reduce((sum, row) => sum + row.messages.inbound, 0);
  const outbound = page.items.reduce((sum, row) => sum + row.messages.outbound, 0);
  const pending = page.items.reduce((sum, row) => sum + row.messages.pending, 0);
  return <main className="page">
    <SectionHeading eyebrow="EMAIL OPERATIONS" title="Correos" description="RFQ, respuestas, estados de conversación y sincronización sin exponer tokens ni cuerpos completos." />
    <section className="metrics-grid metrics-grid--four">
      <MetricCard label="Conversaciones" value={String(page.total ?? page.items.length)} detail="Últimas 250" icon={Inbox} />
      <MetricCard label="Enviados" value={String(outbound)} detail="Mensajes registrados" icon={Send} />
      <MetricCard label="Recibidos" value={String(inbound)} detail="Respuestas de proveedores" icon={MailCheck} />
      <MetricCard label="Sin procesar" value={String(pending)} detail="Requieren sincronización" icon={MailWarning} tone="warning" />
    </section>
    <section className="panel"><div className="table-wrap"><table><thead><tr><th>Última actividad</th><th>Organización / usuario</th><th>Proyecto</th><th>Proveedor</th><th>Asunto</th><th>Enviados</th><th>Recibidos</th><th>Pendientes</th><th>Estado</th></tr></thead><tbody>
      {page.items.map(row => <tr key={row.id}><td>{new Date(row.last_message_at || row.created_at).toLocaleString("es-CL")}</td><td><strong>{row.organization}</strong><small>{row.user_name} · {row.user_email}</small></td><td>{row.project_id ? <Link className="table-link" href={`/proyectos/${row.project_id}`}>{row.project_name || "Ver proyecto"}</Link> : "—"}</td><td><Link className="table-link" href={`/correos/${row.id}`}><strong>{row.proveedor_nombre || "Sin proveedor"}</strong><small>{row.proveedor_email || "Sin email"}</small></Link></td><td><Link className="table-link" href={`/correos/${row.id}`}>{row.subject || "Sin asunto"}</Link></td><td>{row.messages.outbound}</td><td>{row.messages.inbound}</td><td>{row.messages.pending}</td><td><StatusPill tone={row.estado === "complete" || row.estado === "closed" ? "green" : row.estado === "failed" ? "red" : "amber"}>{row.estado}</StatusPill></td></tr>)}
      {!page.items.length && <tr><td colSpan={9}>Todavía no hay conversaciones registradas.</td></tr>}
    </tbody></table></div></section>
  </main>;
}
