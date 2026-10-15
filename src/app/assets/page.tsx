import { requireUser } from "@/lib/session";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";
function fmt(v: string, d: number) { return parseFloat(v).toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d }); }

export default async function AssetsPage() {
  const user = await requireUser();
  const wallets = await db.wallet.findMany({ where: { userId: user.id }, include: { asset: true } });
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <h1 style={{ fontSize: 24, fontWeight: 600 }}>Assets</h1>
      {wallets.map((w) => (
        <div key={w.id} className="card" style={{ padding: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
            <div>
              <div style={{ fontSize: 18, fontWeight: 600 }}>{w.asset.symbol}</div>
              <div style={{ fontSize: 12, color: "var(--muted)" }}>{w.asset.name} · {w.asset.type}</div>
            </div>
            <div style={{ fontFamily: "monospace", fontSize: 18 }}>{fmt(w.balance.toString(), w.asset.decimals)}</div>
          </div>
          <div style={{ marginTop: 16, padding: 14, background: "#0e1320", borderRadius: 8, fontSize: 13, color: "var(--muted)" }}>
            <strong style={{ color: "var(--text)" }}>Receive {w.asset.symbol}</strong>
            <p style={{ marginTop: 6 }}>Deposits are managed through the internal ledger. Network-based receiving addresses are enabled once a verified deposit integration is configured.</p>
          </div>
        </div>
      ))}
    </div>
  );
                                                                        }
