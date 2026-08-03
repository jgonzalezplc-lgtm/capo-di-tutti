"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Activity, Bot, Building2, CreditCard, Database, Gauge, Mail, Search, Settings, ShieldCheck, Users } from "lucide-react";

const links = [
  { href: "/", label: "Command Center", icon: Gauge },
  { href: "/organizaciones", label: "Organizaciones", icon: Building2 },
  { href: "/usuarios", label: "Usuarios", icon: Users },
  { href: "/actividad", label: "Actividad", icon: Activity },
  { href: "/ia", label: "Consumo IA", icon: Bot },
  { href: "/busquedas", label: "Búsquedas", icon: Search },
  { href: "/base-de-datos", label: "Base de datos", icon: Database },
  { href: "/correos", label: "Correos", icon: Mail },
  { href: "/planes", label: "Planes y pagos", icon: CreditCard },
];

export function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="sidebar">
      <div className="brand"><div className="brand__mark">C</div><div><strong>CAPO DI TUTTI</strong><span>BAIYER CONTROL PLANE</span></div></div>
      <nav>{links.map(({ href, label, icon: Icon }) => <Link key={href} href={href} className={pathname === href ? "nav-link nav-link--active" : "nav-link"}><Icon size={17} />{label}</Link>)}</nav>
      <div className="sidebar__footer">
        <Link href="/auditoria" className="nav-link"><ShieldCheck size={17} />Auditoría</Link>
        <Link href="/configuracion" className="nav-link"><Settings size={17} />Configuración</Link>
        <div className="admin-chip"><span>JG</span><div><strong>Superadmin</strong><small>Acceso interno</small></div></div>
      </div>
    </aside>
  );
}
