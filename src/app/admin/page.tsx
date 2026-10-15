import Link from "next/link";
import { requireAdmin } from "@/lib/session";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function AdminHome() {
  await requireAdmin();
  const totalUsers = await db.user.count();
  const pendingWithdrawals = await db.withdrawal.count({ where: { status: { in: ["SUBMITTED", "UNDER_REVIEW"] } } });
  const openTickets = await db.supportTicket.count({ where: { status: { in: ["OPEN", "IN_PROGRESS"] } } });
  const wallets = await db.wallet.findMany();
  const totalBalance = wallets.reduce((s, w) => s + Number(w.balance), 0);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <h1 style={{ fontSize: 24, fontWeight: 600 }}>Admin overview</h1>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 12 }}>
        <Stat label="Total users" value={totalUsers} href="/admin/users" />
        <Stat label="Pending withdrawals" value={pendingWithdrawals} href="/admin/withdrawals" />
        <Stat label="Open tickets" value={openTickets} href="/admin/support" />
        <Stat label="Ledger total" value={`$${totalBalance.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} href="/admin/balances" />
      </div>
      <div className="card" style={{ padding: 20 }}>
        <h2 style={{ fontWeight: 600, marginBottom: 12 }}>Quick actions</h2>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
          <Link href="/admin/balances" className="btn" style={{ textDecoration: "none" }}>Adjust balance</Link>
          <Link href="/admin/invoices" className="btn-outline" style={{ textDecoration: "none" }}>Create invoice</Link>
          <Link href="/admin/announcements" className="btn-outline" style={{ textDecoration: "none" }}>Publish announcement</Link>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, href }: { label: string; value: string | number; href: string }) {
  return (
    <Link href={href} className="card" style={{ padding: 16, textDecoration: "none", color: "inherit" }}>
      <div style={{ fontSize: 12, color: "var(--muted)" }}>{label}</div>
      <div style={{ fontSize: 22, fontWeight: 600, marginTop: 4 }}>{value}</div>
    </Link>
  );
      }
