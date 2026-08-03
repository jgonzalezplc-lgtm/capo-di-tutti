import { LockKeyhole } from "lucide-react";
export function EmptyModule({ title, detail }: { title: string; detail: string }) { return <section className="empty-module"><LockKeyhole size={24} /><h2>{title}</h2><p>{detail}</p><span>SOLO LECTURA · INTEGRACIÓN PENDIENTE</span></section>; }
