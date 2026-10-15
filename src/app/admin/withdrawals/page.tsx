import { requireAdmin } from "@/lib/session";
import { db } from "@/lib/db";
import { WithdrawalRow } from "./row";

export const dynamic = "force-dynamic";

export default async function AdminWithdrawals() {
  await requireAdmin();
  const list = await db.withdrawal.findMany({ include: { user: true }, orderBy: { createdAt: "desc" }, take: 200 });
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <h1 style={{ fontSize: 24, fontWeight: 600 }}>Withdrawal requests</h1>
      <div className="card" style={{ padding: 8 }}>
        {list.length === 0 && <p style={{ padding: 20, color: "var(--muted)", fontSize: 14 }}>No requests.</p>}
        {list.map((w) => (
          <div key={w.id} style={{ padding: 14, borderBottom: "1px solid var(--border)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
              <div>
                <div style={{ fontFamily: "monospace", fontSize: 12, color: "var(--muted)" }}>{w.reference}</div>
                <div style={{ marginTop: 4 }}>{w.user.name} · {w.user.email}</div>
                <div style={{ fontSize: 13, marginTop: 4 }}>{w.amount.toString()} → {w.destination}</div>
              </div>
              <WithdrawalRow id={w.id} status={w.status} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
        }
