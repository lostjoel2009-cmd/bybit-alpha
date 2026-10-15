import Link from "next/link";
import { requireAdmin } from "@/lib/session";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function AdminSupport() {
  await requireAdmin();
  const tickets = await db.supportTicket.findMany({ include: { user: true }, orderBy: { createdAt: "desc" }, take: 200 });
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <h1 style={{ fontSize: 24, fontWeight: 600 }}>Support tickets</h1>
      <div className="card" style={{ padding: 8 }}>
        {tickets.length === 0 && <p style={{ padding: 20, color: "var(--muted)", fontSize: 14 }}>No tickets.</p>}
        {tickets.map((t) => (
          <Link key={t.id} href={`/admin/support/${t.id}`} style={{ display: "block", padding: "12px 14px", borderBottom: "1px solid var(--border)", textDecoration: "none", color: "inherit" }}>
            <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 6 }}>
              <div>
                <div style={{ fontFamily: "monospace", fontSize: 12, color: "var(--muted)" }}>{t.ticketNumber}</div>
                <div style={{ marginTop: 4 }}>{t.subject}</div>
                <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>{t.user.name} · {t.user.email}</div>
              </div>
              <div style={{ fontSize: 12, color: "var(--primary)" }}>{t.status.replace(/_/g, " ")}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
                         }
