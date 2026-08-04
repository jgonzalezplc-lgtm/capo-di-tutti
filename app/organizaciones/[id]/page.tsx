import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AddMemberForm, DeleteOrganizationButton, MemberActions } from "@/components/admin-actions";
import { SectionHeading } from "@/components/section-heading";
import { getOrganizationDetail } from "@/lib/repository";

export default async function OrganizationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; const data = await getOrganizationDetail(id); const org = data.organization;
  return <main className="page"><Link className="detail-back" href="/organizaciones"><ArrowLeft size={15} /> Volver a organizaciones</Link><SectionHeading eyebrow="TENANT ADMIN" title={String(org.nombre || "Organización")} description="Membresías, acceso y acciones administrativas auditadas." action={<DeleteOrganizationButton organizationId={id} />} />
    <section className="panel admin-create-panel"><div className="panel__heading"><h2>Añadir miembro</h2></div><AddMemberForm organizationId={id} /></section>
    <section className="panel"><div className="panel__heading"><h2>{data.members.length} miembros</h2></div><div className="table-wrap"><table><thead><tr><th>Persona</th><th>Rol</th><th>Estado</th><th>Último acceso</th><th>Acciones</th></tr></thead><tbody>{data.members.map(member => <tr key={String(member.id)}><td><strong>{String(member.name || "Usuario")}</strong><small>{String(member.email || "")}</small></td><td>{String(member.membership_role || "member")}</td><td>{String(member.status || "active")}</td><td>{member.last_sign_in_at ? new Date(String(member.last_sign_in_at)).toLocaleString("es-CL") : "Nunca"}</td><td><MemberActions organizationId={id} userId={String(member.id)} isOwner={member.membership_role === "owner"} /></td></tr>)}</tbody></table></div></section>
  </main>;
}
