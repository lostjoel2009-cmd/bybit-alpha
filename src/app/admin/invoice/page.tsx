import { requireAdmin } from "@/lib/session";
import { db } from "@/lib/db";
import { InvoiceForm } from "./form";

export const dynamic = "force-dynamic";

export default async function AdminInvoices() {
  await requireAdmin();
  const users = await db.user.findMany({ orderBy: { name: "asc" } });
  const assets = await db.asset.findMany({ where: { enabled: true } });
  const invoices = await db.invoice.findMany({ include: { user: true, asset: true }, orderBy: { createdAt: "desc" }, take: 200 });
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <h1 style={{ fontSize: 24, fontWeight: 600 }}>Invoices</h1>
      <InvoiceForm users={users.map((u) => ({ id: u.id, name: u.name, email: u.email }))} assets={assets.map((a) => ({ id: a.id, symbol: a.symbol }))} />
      <div className="card" style={{ padding: 8 }}>
        <h2 style={{ padding: 14, fontWeight: 600 }}>All invoices</h2>
        {invoices.map((inv) => (
          <div key={inv.id} style={{ padding: "12px 14px", borderTop: "1px solid var(--border)", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 6 }}>
            <div>
              <div style={{ fontFamily: "monospace", fontSize: 12, color: "var(--muted)" }}>{inv.invoiceNumber}</div>
              <div style={{ marginTop: 4 }}>{inv.user.name} · {inv.description}</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontFamily: "monospace" }}>{inv.amount.toString()} {inv.asset.symbol}</div>
              <div style={{ fontSize: 12, color: "var(--primary)", marginTop: 2 }}>{inv.status.replace(/_/g, " ")}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
                    }
