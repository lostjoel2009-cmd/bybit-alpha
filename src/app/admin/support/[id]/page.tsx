export const dynamic = "force-dynamic";
import { requireAdmin } from "@/lib/session";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { AdminTicket } from "./panel";


export default async function AdminTicketPage({ params }: { params: { id: string } }) {
  await requireAdmin();
  const t = await db.supportTicket.findUnique({
    where: { id: params.id },
    include: { messages: { orderBy: { createdAt: "asc" } }, user: true },
  });
  if (!t) notFound();
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div>
        <div style={{ fontFamily: "monospace", fontSize: 12, color: "var(--muted)" }}>{t.ticketNumber}</div>
        <h1 style={{ fontSize: 22, fontWeight: 600, marginTop: 4 }}>{t.subject}</h1>
        <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 4 }}>From: {t.user.name} ({t.user.email})</div>
      </div>
      <div className="card" style={{ padding: 8 }}>
        {t.messages.map((m) => (
          <div key={m.id} style={{ padding: 14, borderBottom: "1px solid var(--border)" }}>
            <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 6 }}>{m.senderRole} · {new Date(m.createdAt).toLocaleString()}</div>
            <div style={{ whiteSpace: "pre-wrap" }}>{m.body}</div>
          </div>
        ))}
      </div>
      <AdminTicket ticketId={t.id} status={t.status} userId={t.userId} />
    </div>
  );
                    }
