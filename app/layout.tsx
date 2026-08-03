import type { Metadata } from "next";
import { IBM_Plex_Mono, Inter } from "next/font/google";
import { Sidebar } from "@/components/sidebar";
import { Topbar } from "@/components/topbar";
import { getDataMode } from "@/lib/repository";
import "./globals.css";

const mono = IBM_Plex_Mono({ subsets: ["latin"], variable: "--font-mono", weight: ["400", "500", "600"] });
const sans = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = { title: "Capo di Tutti · Baiyer", description: "Control plane privado de Baiyer" };
export const dynamic = "force-dynamic";

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="es"><body className={`${mono.variable} ${sans.variable}`}><div className="app-shell"><Sidebar /><div className="workspace"><Topbar mode={getDataMode()} />{children}</div></div></body></html>;
}
