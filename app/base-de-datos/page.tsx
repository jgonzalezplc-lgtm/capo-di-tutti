import { SectionHeading } from "@/components/section-heading";
import { EmptyModule } from "@/components/empty-module";
export default function Page() { return <main className="page"><SectionHeading eyebrow="DATA EXPLORER" title="Base de datos" description="Vistas administrativas segmentadas por organización y usuario." /><EmptyModule title="Sin acceso directo configurado" detail="Capo usará vistas y RPC protegidas; no habrá un editor SQL libre en esta fase." /></main>; }
