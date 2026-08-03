import { Bell, Command, Radio } from "lucide-react";
import { StatusPill } from "@/components/status-pill";

export function Topbar({ mode }: { mode: "demo" | "supabase" }) {
  return (
    <header className="topbar">
      <div className="environment"><Radio size={15} /><span>Producción</span><StatusPill tone={mode === "demo" ? "amber" : "green"}>{mode === "demo" ? "Datos demo" : "En vivo"}</StatusPill></div>
      <div className="topbar__actions"><button className="command-button"><Command size={15} />Buscar en Capo <kbd>⌘ K</kbd></button><button className="icon-button" aria-label="Notificaciones"><Bell size={18} /></button></div>
    </header>
  );
}
