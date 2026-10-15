export const dynamic = "force-dynamic";
import { requireUser } from "@/lib/session";
import { db } from "@/lib/db";


export default async function CardsPage() {
  const user = await requireUser();
  const cards = await db.cardOrder.findMany({
    where: { userId: user.id },
    include: { events: { orderBy: { occurredAt: "asc" } } },
    orderBy: { createdAt: "desc" },
  });
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <h1 style={{ fontSize: 24, fontWeight: 600 }}>Card & Shipment</h1>
      {cards.length === 0 && <div className="card" style={{ padding: 20, color: "var(--muted)", fontSize: 14 }}>No card orders yet.</div>}
      {cards.map((c) => (
        <div key={c.id} className="card" style={{ padding: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
            <div>
              <div style={{ fontFamily: "monospace", fontSize: 12, color: "var(--muted)" }}>{c.reference}</div>
              <div style={{ fontSize: 18, fontWeight: 600, marginTop: 4 }}>{c.cardType} card</div>
            </div>
            <div style={{ fontSize: 12, color: "var(--primary)" }}>{c.status.replace(/_/g, " ")}</div>
          </div>
          <div style={{ marginTop: 14, fontSize: 13, color: "var(--muted)", display: "flex", flexDirection: "column", gap: 4 }}>
            {c.carrier && <div>Carrier: <span style={{ color: "var(--text)" }}>{c.carrier}</span></div>}
            {c.trackingNumber && <div>Tracking: <span style={{ color: "var(--text)", fontFamily: "monospace" }}>{c.trackingNumber}</span></div>}
            {c.estimatedDelivery && <div>Estimated delivery: <span style={{ color: "var(--text)" }}>{new Date(c.estimatedDelivery).toLocaleDateString()}</span></div>}
          </div>
          {c.events.length > 0 && (
            <div style={{ marginTop: 18, paddingLeft: 14, borderLeft: "2px solid var(--border)" }}>
              {c.events.map((e) => (
                <div key={e.id} style={{ marginBottom: 14 }}>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>{e.description}</div>
                  <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 2 }}>{new Date(e.occurredAt).toLocaleString()}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
          }
