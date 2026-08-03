import { SectionHeading } from "@/components/section-heading";
import { EmptyModule } from "@/components/empty-module";
export default function Page() { return <main className="page"><SectionHeading eyebrow="IMMUTABLE ADMIN LOG" title="Auditoría" description="Toda lectura sensible y futura acción administrativa quedará registrada." /><EmptyModule title="Fase 1 en modo de solo lectura" detail="El esquema append-only se conectará antes de habilitar cualquier mutación." /></main>; }
