import type { LucideIcon } from "lucide-react";

export function MetricCard({ label, value, detail, icon: Icon, tone = "default" }: { label: string; value: string; detail: string; icon: LucideIcon; tone?: "default" | "warning" }) {
  return (
    <article className={`metric-card ${tone === "warning" ? "metric-card--warning" : ""}`}>
      <div className="metric-card__top"><span>{label}</span><Icon size={17} strokeWidth={1.7} /></div>
      <strong>{value}</strong>
      <small>{detail}</small>
    </article>
  );
}
