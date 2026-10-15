export const dynamic = "force-dynamic";
import { requireUser } from "@/lib/session";
import { db } from "@/lib/db";
import { WithdrawalForm } from "./form";

function fmt(v: string, d: number) { return parseFloat(v).toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d }); }

export default async function WithdrawalsPage() {
  const user = await requireUser();
  const wallets = await db.wallet.findMany({ where: { userId: user.id }, include: { asset: true } });
  const reqs = await db.withdrawal.findMany({ where: { userId: user.id }, orderBy: { createdAt: "desc" } });
  const assets = wallets.map((w) => ({ id: w.assetId, symbol: w.asset.symbol, balance: w.balance.toString(), decimals: w.asset.decimals }));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <h1 style={{ fontSize: 24, fontWeight: 600 }}>Withdrawals</h1>
      <WithdrawalForm assets={assets} />
      <div className="card" style={{ padding: 8 }}>
        <h2 style={{ padding: 14, fontWeight: 600 }}>Requests</h2>
        {reqs.length === 0 && <p style={{ padding: 20, color: "var(--muted)", fontSize: 14 }}>No requests yet.</p>}
        {reqs.map((r) => (
          <div key={r.id} style={{ padding: "12px 14px", borderTop: "1px solid var(--border)", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
            <div>
              <div style={{ fontFamily: "monospace", fontSize: 12, color: "var(--muted)" }}>{r.reference}</div>
              <div style={{ marginTop: 4, fontSize: 14 }}>{fmt(r.amount.toString(), 2)} · to {r.destination}</div>
              {r.adminNote && <div style={{ fontSize: 12, color: "var(--primary)", marginTop: 4 }}>Note: {r.adminNote}</div>}
            </div>
            <div style={{ fontSize: 12, color: "var(--primary)" }}>{r.status.replace(/_/g, " ")}</div>
          </div>
        ))}
      </div>
    </div>
  );
              }
