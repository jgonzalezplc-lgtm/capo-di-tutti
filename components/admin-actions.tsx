"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { KeyRound, Plus, Trash2, UserPlus } from "lucide-react";

async function mutate(path: string, method: string, body?: unknown) {
  const response = await fetch(`/api/admin/${path}`, { method, headers: { "Content-Type": "application/json" }, body: body ? JSON.stringify(body) : undefined });
  const data = await response.json().catch(() => ({})) as { detail?: string; error?: string };
  if (!response.ok) throw new Error(data.detail || data.error || "No se pudo completar la acción");
  return data as { detail?: string; error?: string; organization_deleted?: boolean };
}

export function CreateOrganizationForm() {
  const router = useRouter(); const [message, setMessage] = useState(""); const [busy, setBusy] = useState(false);
  return <form className="admin-form" onSubmit={async event => { event.preventDefault(); setBusy(true); setMessage(""); const form = new FormData(event.currentTarget); try { await mutate("organizations", "POST", { name: form.get("name"), owner_email: form.get("email") }); setMessage("Organización creada. Si el propietario era nuevo, recibirá una invitación."); event.currentTarget.reset(); router.refresh(); } catch (error) { setMessage(error instanceof Error ? error.message : "Error"); } finally { setBusy(false); } }}>
    <label>Nombre<input name="name" required minLength={2} /></label><label>Correo del propietario<input name="email" type="email" required /></label><button disabled={busy}><Plus size={15} />{busy ? "Creando…" : "Crear organización"}</button>{message && <p>{message}</p>}
  </form>;
}

export function AddMemberForm({ organizationId }: { organizationId: string }) {
  const router = useRouter(); const [message, setMessage] = useState(""); const [busy, setBusy] = useState(false);
  return <form className="admin-form" onSubmit={async event => { event.preventDefault(); setBusy(true); setMessage(""); const form = new FormData(event.currentTarget); try { await mutate(`organizations/${organizationId}/members`, "POST", { email: form.get("email"), role: form.get("role") }); setMessage("Miembro añadido o invitado."); event.currentTarget.reset(); router.refresh(); } catch (error) { setMessage(error instanceof Error ? error.message : "Error"); } finally { setBusy(false); } }}>
    <label>Correo<input name="email" type="email" required /></label><label>Rol<select name="role" defaultValue="member"><option value="member">Miembro</option><option value="admin">Administrador</option><option value="billing">Facturación</option></select></label><button disabled={busy}><UserPlus size={15} />{busy ? "Añadiendo…" : "Añadir miembro"}</button>{message && <p>{message}</p>}
  </form>;
}

export function MemberActions({ organizationId, userId, isOwner }: { organizationId: string; userId: string; isOwner: boolean }) {
  const router = useRouter(); const [message, setMessage] = useState("");
  return <div className="row-actions"><button onClick={async () => { try { await mutate(`users/${userId}/password-recovery`, "POST"); setMessage("Recuperación enviada"); } catch (error) { setMessage(error instanceof Error ? error.message : "Error"); } }}><KeyRound size={14} /> Recuperar clave</button><button className="danger-button" onClick={async () => { const prompt = isOwner ? "Motivo para separar al propietario y eliminar esta organización" : "Motivo para remover al miembro"; const warning = isOwner ? "El propietario es el único miembro. Se eliminará esta organización y su usuario conservará una cuenta individual. ¿Continuar?" : "¿Remover este miembro de la organización?"; const reason = window.prompt(prompt); if (!reason || !window.confirm(warning)) return; try { const result = await mutate(`organizations/${organizationId}/members/${userId}`, "DELETE", { reason }); if (result.organization_deleted) { router.push("/organizaciones"); } router.refresh(); } catch (error) { setMessage(error instanceof Error ? error.message : "Error"); } }}><Trash2 size={14} /> {isOwner ? "Separar y eliminar organización" : "Remover"}</button>{message && <small>{message}</small>}</div>;
}

export function DeleteOrganizationButton({ organizationId }: { organizationId: string }) {
  const router = useRouter(); const [message, setMessage] = useState("");
  return <div><button className="danger-button secondary-button" onClick={async () => { const reason = window.prompt("Motivo de eliminación (quedará auditado)"); if (!reason || !window.confirm("Esta acción elimina la organización. El propietario conservará una cuenta individual. ¿Continuar?")) return; try { await mutate(`organizations/${organizationId}`, "DELETE", { reason }); router.push("/organizaciones"); router.refresh(); } catch (error) { setMessage(error instanceof Error ? error.message : "Error"); } }}><Trash2 size={15} /> Eliminar organización</button>{message && <p className="action-error">{message}</p>}</div>;
}

export function PasswordRecoveryButton({ userId }: { userId: string }) {
  const [message, setMessage] = useState(""); return <div className="row-actions"><button onClick={async () => { try { await mutate(`users/${userId}/password-recovery`, "POST"); setMessage("Enviado"); } catch (error) { setMessage(error instanceof Error ? error.message : "Error"); } }}><KeyRound size={14} /> Recuperar clave</button>{message && <small>{message}</small>}</div>;
}
