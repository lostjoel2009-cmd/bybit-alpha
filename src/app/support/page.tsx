import { requireUser } from "@/lib/session";
import { db } from "@/lib/db";
import { TicketForm } from "./form";

export const dynamic = "force-dynamic";

export default async function SupportPage() {
  const user = await requireUser();
  const tickets = await db.supportTicket.findMany({ where: { userId: user.id }, orderBy: { createdAt: "desc" }, include: { messages: true } });
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <h1 style={{ fontSize: 24, fontWeight: 600 }}>Support</h1>
      <TicketForm />
      <div className="card" style={{ padding: 8 }}>
        <h2 style={{ padding: 14, fontWeight: 600 }}>Your tickets</h2>
        {tickets.length === 0 && <p style={{ padding: 20, color: "var(--muted)", fontSize: 14 }}>No tickets yet.</p>}
        {tickets.map((t) => (
          <a key={t.id} href={`/support/${t.id}`} style={{ display: "block", padding: "12px 14px", borderTop: "1px solid var(--border)", textDecoration: "none", color: "inherit" }}>
            <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
              <div>
                <div style={{ fontFamily: "monospace", fontSize: 12, color: "var(--muted)" }}>{t.ticketNumber}</div>
                <div style={{ marginTop: 4 }}>{t.subject}</div>
              </div>
              <div style={{ fontSize: 12, color: "var(--primary)" }}>{t.status.replace(/_/g, " ")}</div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
                     }
