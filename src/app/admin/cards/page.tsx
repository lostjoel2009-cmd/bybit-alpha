export const dynamic = "force-dynamic";
import { requireAdmin } from "@/lib/session";
import { db } from "@/lib/db";


export default async function AdminCards() {
  await requireAdmin();
  const cards = await db.cardOrder.findMany({ include: { user: true, events: { orderBy: { occurredAt: "asc" } } }, orderBy: { createdAt: "desc" } });
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <h1 style={{ fontSize: 24, fontWeight: 600 }}>Card orders</h1>
      {cards.length === 0 && <div className="card" style={{ padding: 20, color: "var(--muted)", fontSize: 14 }}>No card orders.</div>}
      {cards.map((c) => (
        <div key={c.id} className="card" style={{ padding: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
            <div>
              <div style={{ fontFamily: "monospace", fontSize: 12, color: "var(--muted)" }}>{c.reference}</div>
              <div style={{ marginTop: 4 }}>{c.user.name} · {c.user.email}</div>
              <div style={{ fontSize: 13, marginTop: 4 }}>{c.cardType} card</div>
            </div>
            <div style={{ fontSize: 12, color: "var(--primary)" }}>{c.status.replace(/_/g, " ")}</div>
          </div>
          <div style={{ marginTop: 12, fontSize: 13, color: "var(--muted)" }}>
            {c.carrier && <div>Carrier: {c.carrier}</div>}
            {c.trackingNumber && <div>Tracking: {c.trackingNumber}</div>}
          </div>
          {c.events.length > 0 && (
            <div style={{ marginTop: 14, paddingLeft: 14, borderLeft: "2px solid var(--border)" }}>
              {c.events.map((e) => (
                <div key={e.id} style={{ marginBottom: 8 }}>
                  <div style={{ fontSize: 13 }}>{e.description}</div>
                  <div style={{ fontSize: 11, color: "var(--muted)" }}>{new Date(e.occurredAt).toLocaleString()}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
                 }
