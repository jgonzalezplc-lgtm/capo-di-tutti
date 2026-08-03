import { Download, Search } from "lucide-react";
import { SectionHeading } from "@/components/section-heading";
import { StatusPill } from "@/components/status-pill";
import { getDashboardData } from "@/lib/repository";

export default async function UsersPage() {
  const { users } = await getDashboardData();
  return <main className="page"><SectionHeading eyebrow="IDENTIDAD Y ACCESO" title="Usuarios" description="Actividad individual, organización, roles y consumo atribuible." action={<button className="secondary-button"><Download size={16} />Exportar</button>} /><section className="panel"><div className="toolbar"><div className="search-box"><Search size={15} />Buscar nombre o correo</div><span>{users.length} resultados</span></div><div className="table-wrap"><table><thead><tr><th>Usuario</th><th>Organización</th><th>Roles</th><th>Plan</th><th>Última actividad</th><th>Búsquedas</th><th>IA 30d</th><th>Estado</th></tr></thead><tbody>{users.map(user => <tr key={user.id}><td><strong>{user.name}</strong><small>{user.email}</small></td><td>{user.organization}</td><td>{user.roles.join(" · ")}</td><td className="capitalize">{user.plan}</td><td>{user.lastSeenAt}</td><td>{user.searches30d}</td><td>${user.aiCost30d.toFixed(2)}</td><td><StatusPill tone={user.status === "active" ? "green" : "amber"}>{user.status}</StatusPill></td></tr>)}</tbody></table></div></section></main>;
}
