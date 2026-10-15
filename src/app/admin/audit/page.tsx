export const dynamic = "force-dynamic";
import { requireAdmin } from "@/lib/session";
import { db } from "@/lib/db";


export default async function AdminAudit() {
  await requireAdmin();
  const logs = await db.auditLog.findMany({ include: { admin: true, targetUser: true }, orderBy: { createdAt: "desc" }, take: 500 });
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <h1 style={{ fontSize: 24, fontWeight: 600 }}>Audit log</h1>
      <div className="card" style={{ padding: 8 }}>
        {logs.length === 0 && <p style={{ padding: 20, color: "var(--muted)", fontSize: 14 }}>No admin actions recorded yet.</p>}
        {logs.map((l) => (
          <div key={l.id} style={{ padding: "12px 14px", borderBottom: "1px solid var(--border)" }}>
            <div style={{ fontSize: 14, fontWeight: 500 }}>{l.action}</div>
            <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 4 }}>
              Admin: {l.admin.name} → Target: {l.targetUser?.name || "—"} · {new Date(l.createdAt).toLocaleString()}
            </div>
            {l.details && (
              <div style={{ fontSize: 11, fontFamily: "monospace", color: "var(--muted)", marginTop: 4 }}>
                {JSON.stringify(l.details)}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
              }
