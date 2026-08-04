import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { SectionHeading } from "@/components/section-heading";
import { StatusPill } from "@/components/status-pill";
import { getEmailDetail } from "@/lib/repository";

export default async function EmailDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const conversation = await getEmailDetail(id);
  return <main className="page">
    <Link className="detail-back" href="/correos"><ArrowLeft size={15} /> Volver a correos</Link>
    <SectionHeading eyebrow="EMAIL TRACE" title={conversation.subject || "Conversación sin asunto"} description={`Historial con ${conversation.proveedor_nombre || conversation.proveedor_email || "proveedor"}.`} />
    <section className="detail-grid">
      <div className="detail-field"><span>Organización</span><strong>{conversation.organization}</strong></div>
      <div className="detail-field"><span>Responsable</span><strong>{conversation.user_name}<small>{conversation.user_email}</small></strong></div>
      <div className="detail-field"><span>Proyecto</span><strong>{conversation.project_id ? <Link className="table-link" href={`/proyectos/${conversation.project_id}`}>{conversation.project_name || "Abrir proyecto"}</Link> : "Sin asociación"}</strong></div>
      <div className="detail-field"><span>Estado</span><strong><StatusPill tone={conversation.estado === "complete" || conversation.estado === "closed" ? "green" : "amber"}>{conversation.estado}</StatusPill></strong></div>
    </section>
    <section className="panel"><div className="panel__heading"><div><span className="eyebrow">HISTORIAL</span><h2>{conversation.messages.length} mensajes</h2></div></div>
      {conversation.messages.map(message => <article className="timeline-message" key={message.id}><div className="timeline-message__head"><div><StatusPill tone={message.direction === "inbound" ? "green" : "neutral"}>{message.direction === "inbound" ? "Recibido" : "Enviado"}</StatusPill><strong>{message.subject || conversation.subject || "Sin asunto"}</strong><small>{message.from_email || "—"} → {message.to_email || "—"}</small></div><small>{new Date(message.received_at || message.created_at || conversation.created_at).toLocaleString("es-CL")}</small></div><pre>{message.body_preview || "Sin cuerpo de texto."}</pre>{message.attachments.map(file => <span className="attachment-chip" key={file.id}>{file.filename || "Adjunto"} · {file.mime_type || "archivo"}</span>)}</article>)}
      {!conversation.messages.length && <div style={{ padding: 20 }}>No hay mensajes registrados.</div>}
    </section>
  </main>;
}
