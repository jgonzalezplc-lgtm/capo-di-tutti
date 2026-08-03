import { SectionHeading } from "@/components/section-heading";
import { EmptyModule } from "@/components/empty-module";
export default function Page() { return <main className="page"><SectionHeading eyebrow="CONTROL PLANE" title="Configuración" description="Entorno, administradores, alertas y conectores internos." /><EmptyModule title="Configuración bloqueada" detail="Define CAPO_ADMIN_EMAILS y conecta Supabase antes de habilitar controles de producción." /></main>; }
