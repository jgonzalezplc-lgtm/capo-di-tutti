import { BadgeDollarSign, Building2, CreditCard, Users } from "lucide-react";
import { MetricCard } from "@/components/metric-card";
import { PlanManager } from "@/components/plan-manager";
import { SectionHeading } from "@/components/section-heading";
import { getPlans } from "@/lib/repository";

export default async function PlansPage() {
  const data = await getPlans();
  const free = data.organizations.filter(org => String(org.plan) === "free").length;
  const members = data.organizations.reduce((sum, org) => sum + Number(org.members ?? 0), 0);
  return <main className="page">
    <SectionHeading eyebrow="ACCESS OPERATIONS" title="Planes y uso gratuito" description="Asignación interna de planes, límites operacionales y trazabilidad. Los cobros están deshabilitados." />
    <section className="metrics-grid metrics-grid--four">
      <MetricCard label="Organizaciones" value={String(data.organizations.length)} detail="Cuentas individuales y empresas" icon={Building2} />
      <MetricCard label="Usuarios" value={String(members)} detail="Miembros registrados" icon={Users} />
      <MetricCard label="Plan gratuito" value={String(free)} detail="Sin cobro durante beta" icon={BadgeDollarSign} />
      <MetricCard label="Facturación" value="Desactivada" detail="Sin proveedor de pagos" icon={CreditCard} />
    </section>
    <PlanManager initial={data} />
  </main>;
}
