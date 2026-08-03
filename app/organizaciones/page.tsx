import { Building2, Download, Search } from "lucide-react";
import { SectionHeading } from "@/components/section-heading";
import { StatusPill } from "@/components/status-pill";
import { getDashboardData } from "@/lib/repository";

export default async function OrganizationsPage() {
  const { organizations } = await getDashboardData();
  return <main className="page"><SectionHeading eyebrow="TENANCY" title="Organizaciones" description="Empresas, cuentas individuales, membresías y consumo agregado." action={<button className="secondary-button"><Download size={16} />Exportar</button>} /><section className="panel"><div className="toolbar"><div className="search-box"><Search size={15} />Buscar organización</div><span>{organizations.length} resultados</span></div><div className="table-wrap"><table><thead><tr><th>Organización</th><th>Plan</th><th>Miembros</th><th>Activos</th><th>Búsquedas 30d</th><th>IA 30d</th><th>Estado</th></tr></thead><tbody>{organizations.map(org => <tr key={org.id}><td><strong>{org.name}</strong><small>{org.slug} · {org.id}</small></td><td className="capitalize">{org.plan}</td><td>{org.members}</td><td>{org.activeMembers}</td><td>{org.searches30d}</td><td>${org.aiCost30d.toFixed(2)}</td><td><StatusPill tone={org.status === "active" ? "green" : "amber"}>{org.status}</StatusPill></td></tr>)}</tbody></table></div></section></main>;
}
