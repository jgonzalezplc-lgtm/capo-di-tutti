import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { SectionHeading } from "@/components/section-heading";
import { StatusPill } from "@/components/status-pill";
import { getProjectDetail } from "@/lib/repository";

export default async function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = await getProjectDetail(id);
  return <main className="page">
    <Link className="detail-back" href="/base-de-datos?resource=projects"><ArrowLeft size={15} /> Volver a proyectos</Link>
    <SectionHeading eyebrow="PROJECT TRACE" title={project.name} description="Contexto, responsable e ítems que formaron la lista de cotización." />
    <section className="detail-grid">
      <div className="detail-field"><span>Organización</span><strong>{project.organization}</strong></div>
      <div className="detail-field"><span>Creado por</span><strong>{project.actor}<small>{project.actor_email}</small></strong></div>
      <div className="detail-field"><span>Fecha</span><strong>{new Date(project.created_at).toLocaleString("es-CL")}</strong></div>
      <div className="detail-field"><span>Estado</span><strong><StatusPill tone={project.status === "completado" ? "green" : "neutral"}>{project.status || "sin estado"}</StatusPill></strong></div>
    </section>
    {project.summary && <section className="panel" style={{ marginBottom: 12 }}><div className="panel__heading"><h2>De qué se trató</h2></div><div style={{ padding: 20 }}>{project.summary}</div></section>}
    <section className="panel"><div className="panel__heading"><div><span className="eyebrow">LISTA ASOCIADA</span><h2>{project.items.length} ítems</h2></div></div><div className="table-wrap"><table><thead><tr><th>Ítem</th><th>Cantidad</th><th>Categoría</th><th>Estado</th><th>Comparado</th></tr></thead><tbody>
      {project.items.map((item, index) => <tr key={item.cotizacion_id || index}><td><strong>{item.name}</strong><small>{item.cotizacion_id}</small></td><td>{item.quantity}</td><td>{item.category || "—"}</td><td>{item.status || "—"}</td><td>{item.compared ? "Sí" : "No"}</td></tr>)}
      {!project.items.length && <tr><td colSpan={5}>Este proyecto no contiene una lista estructurada.</td></tr>}
    </tbody></table></div></section>
  </main>;
}
