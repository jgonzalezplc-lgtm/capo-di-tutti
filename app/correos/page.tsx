import { SectionHeading } from "@/components/section-heading";
import { EmptyModule } from "@/components/empty-module";
export default function Page() { return <main className="page"><SectionHeading eyebrow="EMAIL OPERATIONS" title="Correos" description="RFQ, autorizaciones, órdenes de compra, sincronización y entregabilidad." /><EmptyModule title="Conector de Gmail pendiente" detail="La siguiente integración leerá conversaciones y cron sin exponer refresh tokens." /></main>; }
