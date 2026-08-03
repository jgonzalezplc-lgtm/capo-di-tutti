import { Bot, CircleAlert, Clock3, Coins } from "lucide-react";
import { MetricCard } from "@/components/metric-card";
import { SectionHeading } from "@/components/section-heading";
import { StatusPill } from "@/components/status-pill";
import { getDashboardData } from "@/lib/repository";

export default async function AiPage() {
  const { usage, metrics } = await getDashboardData();
  const avgLatency = usage.reduce((sum, row) => sum + row.latencyMs, 0) / usage.length;
  const fallbacks = usage.filter(row => row.status === "fallback").length;
  return <main className="page"><SectionHeading eyebrow="MODEL TELEMETRY" title="AI Observatory" description="Costo, tokens, latencia, errores y fallbacks por cada llamada." /><section className="metrics-grid metrics-grid--four"><MetricCard label="Costo estimado 30d" value={`$${metrics.aiCost30d.toFixed(0)}`} detail="USD · todos los proveedores" icon={Coins} /><MetricCard label="Llamadas 30d" value={metrics.aiCalls30d.toLocaleString("es-CL")} detail="Intentos individuales" icon={Bot} /><MetricCard label="Latencia muestra" value={`${(avgLatency / 1000).toFixed(1)} s`} detail="Promedio de eventos visibles" icon={Clock3} /><MetricCard label="Fallbacks muestra" value={String(fallbacks)} detail="Cambio automático de modelo" icon={CircleAlert} tone="warning" /></section><section className="panel"><div className="table-wrap"><table><thead><tr><th>Hora</th><th>Organización / usuario</th><th>Función</th><th>Proveedor / modelo</th><th>Entrada</th><th>Salida</th><th>Latencia</th><th>Costo</th><th>Estado</th></tr></thead><tbody>{usage.map(row => <tr key={row.id}><td>{row.occurredAt}</td><td><strong>{row.organization}</strong><small>{row.user}</small></td><td>{row.feature}</td><td><strong>{row.provider}</strong><small>{row.model}</small></td><td>{row.inputTokens.toLocaleString("es-CL")}</td><td>{row.outputTokens.toLocaleString("es-CL")}</td><td>{(row.latencyMs / 1000).toFixed(1)} s</td><td>${row.estimatedCost.toFixed(3)}</td><td><StatusPill tone={row.status === "success" ? "green" : row.status === "fallback" ? "amber" : "red"}>{row.status}</StatusPill></td></tr>)}</tbody></table></div></section></main>;
}
