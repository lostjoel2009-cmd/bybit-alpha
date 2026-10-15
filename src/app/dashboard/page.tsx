export const dynamic = "force-dynamic";
import Link from "next/link";
import { requireUser } from "@/lib/session";
import { db } from "@/lib/db";


function fmt(v: string | number, d = 2) {
  const n = typeof v === "string" ? parseFloat(v) : v;
  return n.toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d });
}

export default async function DashboardPage() {
  const user = await requireUser();
  const wallets = await db.wallet.findMany({ where: { userId: user.id }, include: { asset: true } });
  const usdTotal = wallets.filter((w) => ["USDT", "USD"].includes(w.asset.symbol)).reduce((s, w) => s + Number(w.balance), 0);
  const recent = await db.activityLog.findMany({ where: { userId: user.id }, orderBy: { createdAt: "desc" }, take: 8 });
  const notifications = await db.notification.count({ where: { userId: user.id, readAt: null } });
  const announcements = await db.announcement.count({ where: { archived: false } });
  const openTickets = await db.supportTicket.count({ where: { userId: user.id, status: { not: "CLOSED" } } });
  const openWithdrawals = await db.withdrawal.count({ where: { userId: user.id, status: { not: "COMPLETED" } } });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div>
        <div style={{ fontSize: 12, color: "var(--muted)" }}>Total portfolio value</div>
        <div style={{ fontSize: 42, fontWeight: 600, marginTop: 4 }}>${fmt(usdTotal)}</div>
        <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 6 }}>Account {user.accountId}</div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 12 }}>
        <Link href="/announcements" className="card" style={{ padding: 16, textDecoration: "none", color: "inherit" }}>
          <div style={{ fontSize: 12, color: "var(--muted)" }}>Announcements</div>
          <div style={{ fontSize: 24, fontWeight: 600, marginTop: 4 }}>{announcements}</div>
        </Link>
        <Link href="/notifications" className="card" style={{ padding: 16, textDecoration: "none", color: "inherit" }}>
          <div style={{ fontSize: 12, color: "var(--muted)" }}>Notifications</div>
          <div style={{ fontSize: 24, fontWeight: 600, marginTop: 4 }}>{notifications}</div>
        </Link>
        <Link href="/support" className="card" style={{ padding: 16, textDecoration: "none", color: "inherit" }}>
          <div style={{ fontSize: 12, color: "var(--muted)" }}>Open tickets</div>
          <div style={{ fontSize: 24, fontWeight: 600, marginTop: 4 }}>{openTickets}</div>
        </Link>
        <Link href="/withdrawals" className="card" style={{ padding: 16, textDecoration: "none", color: "inherit" }}>
          <div style={{ fontSize: 12, color: "var(--muted)" }}>Withdrawals</div>
          <div style={{ fontSize: 24, fontWeight: 600, marginTop: 4 }}>{openWithdrawals}</div>
        </Link>
      </div>

      <div className="card" style={{ padding: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
          <h2 style={{ fontWeight: 600 }}>Balances</h2>
          <Link href="/assets" style={{ color: "var(--primary)", fontSize: 14, textDecoration: "none" }}>View all →</Link>
        </div>
        {wallets.length === 0 && <p style={{ color: "var(--muted)", fontSize: 14 }}>No wallets yet.</p>}
        {wallets.slice(0, 6).map((w) => (
          <div key={w.id} style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", borderBottom: "1px solid var(--border)" }}>
            <div>
              <div style={{ fontWeight: 500 }}>{w.asset.symbol}</div>
              <div style={{ fontSize: 12, color: "var(--muted)" }}>{w.asset.name}</div>
            </div>
            <div style={{ fontFamily: "monospace" }}>{fmt(w.balance.toString(), w.asset.decimals)}</div>
          </div>
        ))}
      </div>

      <div className="card" style={{ padding: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
          <h2 style={{ fontWeight: 600 }}>Recent activity</h2>
          <Link href="/activity" style={{ color: "var(--primary)", fontSize: 14, textDecoration: "none" }}>View all →</Link>
        </div>
        {recent.length === 0 && <p style={{ color: "var(--muted)", fontSize: 14 }}>No activity yet.</p>}
        {recent.map((a) => (
          <div key={a.id} style={{ padding: "10px 0", borderBottom: "1px solid var(--border)", fontSize: 14 }}>
            <div>{a.description}</div>
            <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 2 }}>{a.event}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
