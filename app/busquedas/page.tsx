import { Search, Telescope, TriangleAlert } from "lucide-react";
import { MetricCard } from "@/components/metric-card";
import { SectionHeading } from "@/components/section-heading";
import { StatusPill } from "@/components/status-pill";
import { getSearches } from "@/lib/repository";

export default async function SearchesPage() {
  const page = await getSearches();
  const expanded = page.items.filter(row => row.modo === "expanded").length;
  const empty = page.items.filter(row => row.n_resultados === 0).length;
  const totalResults = page.items.reduce((sum, row) => sum + Number(row.n_resultados || 0), 0);
  return <main className="page">
    <SectionHeading eyebrow="SEARCH INTELLIGENCE" title="Búsquedas" description="Sesiones, términos, expansión, resultados y trazabilidad por usuario y organización." />
    <section className="metrics-grid metrics-grid--four">
      <MetricCard label="Sesiones visibles" value={String(page.total ?? page.items.length)} detail="Últimas 250" icon={Search} />
      <MetricCard label="Resultados" value={totalResults.toLocaleString("es-CL")} detail="En la muestra" icon={Telescope} />
      <MetricCard label="Expandidas" value={String(expanded)} detail="Búsqueda complementaria" icon={Telescope} />
      <MetricCard label="Sin resultados" value={String(empty)} detail="Requieren revisión" icon={TriangleAlert} tone="warning" />
    </section>
    <section className="panel"><div className="table-wrap"><table><thead><tr><th>Fecha</th><th>Organización / usuario</th><th>Ítem</th><th>Categoría</th><th>Términos</th><th>Modo</th><th>Resultados</th><th>Estado</th></tr></thead><tbody>
      {page.items.map(row => <tr key={row.id}><td>{new Date(row.created_at).toLocaleString("es-CL")}</td><td><strong>{row.organization}</strong><small>{row.user_name} · {row.user_email}</small></td><td><strong>{row.item_nombre || "Sin nombre"}</strong><small>{row.cotizacion_id || row.lista_proyecto_id || row.id}</small></td><td>{row.categoria_predicha || row.categorias_usadas?.join(", ") || "—"}</td><td>{row.terminos?.slice(0, 3).join(" · ") || "—"}</td><td><StatusPill tone={row.modo === "expanded" ? "amber" : "neutral"}>{row.modo}</StatusPill></td><td>{row.n_resultados}</td><td><StatusPill tone={row.estado === "satisfactoria" ? "green" : row.estado === "insatisfactoria" ? "red" : "neutral"}>{row.estado}</StatusPill></td></tr>)}
      {!page.items.length && <tr><td colSpan={8}>Todavía no hay sesiones registradas.</td></tr>}
    </tbody></table></div></section>
  </main>;
}
