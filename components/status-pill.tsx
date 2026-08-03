import type { ReactNode } from "react";

export function StatusPill({ tone, children }: { tone: "green" | "amber" | "red" | "neutral"; children: ReactNode }) {
  return <span className={`status status--${tone}`}><span className="status__dot" />{children}</span>;
}
