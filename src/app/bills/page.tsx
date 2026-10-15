export const dynamic = "force-dynamic";
import { requireUser } from "@/lib/session";
import { db } from "@/lib/db";

function fmt(v: string, d: number) { return parseFloat(v).toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d }); }

export default async function BillsPage() {
  const user = await requireUser();
  const invoices = await db.invoice.findMany({ where: { userId: user.id }, include: { asset: true }, orderBy: { createdAt: "desc" } });
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <h1 style={{ fontSize: 24, fontWeight: 600 }}>Bills & Payments</h1>
      {invoices.length === 0 && <div className="card" style={{ padding: 20, color: "var(--muted)", fontSize: 14 }}>No invoices yet.</div>}
      {invoices.map((inv) => (
        <div key={inv.id} className="card" style={{ padding: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
            <div>
              <div style={{ fontFamily: "monospace", fontSize: 13, color: "var(--muted)" }}>{inv.invoiceNumber}</div>
              <div style={{ fontSize: 18, fontWeight: 600, marginTop: 4 }}>{inv.description}</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontFamily: "monospace", fontSize: 20 }}>{fmt(inv.amount.toString(), inv.asset.decimals)} {inv.asset.symbol}</div>
              <div style={{ fontSize: 12, color: "var(--primary)", marginTop: 4 }}>{inv.status.replace(/_/g, " ")}</div>
            </div>
          </div>
          <div style={{ marginTop: 16, padding: 14, background: "#0e1320", borderRadius: 8, fontSize: 13 }}>
            <div style={{ color: "var(--muted)" }}>Pay to: <span style={{ color: "var(--text)" }}>{inv.payeeName}</span></div>
            <div style={{ color: "var(--muted)", marginTop: 4 }}>Method: <span style={{ color: "var(--text)" }}>{inv.paymentMethod}</span></div>
            {inv.dueDate && <div style={{ color: "var(--muted)", marginTop: 4 }}>Due: <span style={{ color: "var(--text)" }}>{new Date(inv.dueDate).toLocaleDateString()}</span></div>}
          </div>
        </div>
      ))}
    </div>
  );
                    }
