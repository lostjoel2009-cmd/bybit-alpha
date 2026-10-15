export const dynamic = "force-dynamic";
import { requireUser } from "@/lib/session";
import { db } from "@/lib/db";


export default async function ActivityPage() {
  const user = await requireUser();
  const logs = await db.activityLog.findMany({ where: { userId: user.id }, orderBy: { createdAt: "desc" }, take: 200 });
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <h1 style={{ fontSize: 24, fontWeight: 600 }}>Activity</h1>
      <div className="card" style={{ padding: 8 }}>
        {logs.length === 0 && <p style={{ padding: 20, color: "var(--muted)", fontSize: 14 }}>No activity yet.</p>}
        {logs.map((l) => (
          <div key={l.id} style={{ padding: "12px 14px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
            <div>
              <div style={{ fontWeight: 500 }}>{l.description}</div>
              <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 3 }}>
                {l.event} · {new Date(l.createdAt).toLocaleString()}
                {l.amount ? ` · ${l.amount}` : ""}
              </div>
            </div>
            {l.status && <div style={{ fontSize: 12, color: "var(--primary)" }}>{l.status}</div>}
          </div>
        ))}
      </div>
    </div>
  );
      }
