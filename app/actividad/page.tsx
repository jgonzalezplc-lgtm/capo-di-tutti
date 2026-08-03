import { Activity } from "lucide-react";
import { SectionHeading } from "@/components/section-heading";
import { StatusPill } from "@/components/status-pill";
import { getDashboardData } from "@/lib/repository";

export default async function ActivityPage() {
  const { activity } = await getDashboardData();
  return <main className="page"><SectionHeading eyebrow="PRODUCT EVENT LEDGER" title="Actividad" description="Cronología transversal de los procesos de Baiyer." /><section className="panel"><div className="activity-timeline">{activity.map(event => <article key={event.id}><div className={`event-icon event-icon--${event.status}`}><Activity size={16} /></div><div><span className="eyebrow">{event.type}</span><h3>{event.entity}</h3><p>{event.detail}</p><small>{event.organization} · {event.user} · {event.occurredAt}</small></div><StatusPill tone={event.status === "healthy" ? "green" : event.status === "warning" ? "amber" : "red"}>{event.status}</StatusPill></article>)}</div></section></main>;
}
