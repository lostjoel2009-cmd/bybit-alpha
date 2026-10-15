"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { useState } from "react";

type NavItem = { href: string; label: string };
const userNav: NavItem[] = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/assets", label: "Assets" },
  { href: "/bills", label: "Bills & Payments" },
  { href: "/withdrawals", label: "Withdrawals" },
  { href: "/cards", label: "Card & Shipment" },
  { href: "/support", label: "Support" },
  { href: "/announcements", label: "Announcements" },
  { href: "/activity", label: "Activity" },
  { href: "/profile", label: "Profile" },
];
const adminNav: NavItem[] = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/users", label: "Users" },
  { href: "/admin/balances", label: "Balances" },
  { href: "/admin/invoices", label: "Invoices" },
  { href: "/admin/withdrawals", label: "Withdrawals" },
  { href: "/admin/support", label: "Support" },
  { href: "/admin/announcements", label: "Announcements" },
  { href: "/admin/cards", label: "Cards" },
  { href: "/admin/audit", label: "Audit log" },
];

export function Shell({ children, user, area = "user" }: { children: React.ReactNode; user: { name: string; email: string; role: string; accountId: string }; area?: "user" | "admin" }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const nav = area === "admin" ? adminNav : userNav;

  return (
    <div style={{ minHeight: "100vh", display: "flex" }}>
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 40, background: "var(--card)", borderBottom: "1px solid var(--border)", padding: "12px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <button onClick={() => setOpen(!open)} style={{ fontSize: 20, background: "none", border: "none", color: "var(--text)", cursor: "pointer" }}>☰</button>
        <div style={{ fontWeight: 700, letterSpacing: 1 }}>BYBIT <span style={{ color: "var(--primary)" }}>ALPHA</span></div>
        <div style={{ width: 20 }} />
      </div>
      <aside style={{ position: "fixed", top: 0, bottom: 0, left: 0, width: 260, background: "var(--card)", borderRight: "1px solid var(--border)", transform: open ? "translateX(0)" : "translateX(-100%)", transition: "transform 0.2s", zIndex: 50, display: "flex", flexDirection: "column" }}>
        <div style={{ padding: 20, borderBottom: "1px solid var(--border)" }}>
          <div style={{ fontWeight: 700, letterSpacing: 1 }}>BYBIT <span style={{ color: "var(--primary)" }}>ALPHA</span></div>
          <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 4 }}>{user.accountId}</div>
        </div>
        <nav style={{ flex: 1, overflowY: "auto", padding: 12, paddingTop: 60 }}>
          {nav.map((item) => {
            const active = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link key={item.href} href={item.href} onClick={() => setOpen(false)} style={{
                display: "block", padding: "10px 12px", borderRadius: 6, fontSize: 14, marginBottom: 2,
                background: active ? "rgba(240,185,11,0.12)" : "transparent",
                color: active ? "var(--primary)" : "var(--text)", textDecoration: "none",
              }}>{item.label}</Link>
            );
          })}
        </nav>
        <div style={{ padding: 12, borderTop: "1px solid var(--border)" }}>
          <div style={{ fontSize: 12, marginBottom: 8 }}>
            <div style={{ fontWeight: 500 }}>{user.name}</div>
            <div style={{ color: "var(--muted)" }}>{user.email}</div>
            {user.role !== "USER" && <Link href="/admin" style={{ color: "var(--primary)", fontSize: 12 }}>→ Admin panel</Link>}
          </div>
          <button onClick={() => signOut({ callbackUrl: "/login" })} className="btn-outline" style={{ width: "100%", textAlign: "left", background: "none", color: "var(--text)", cursor: "pointer" }}>Sign out</button>
        </div>
      </aside>
      {open && <div onClick={() => setOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 45 }} />}
      <main style={{ flex: 1, minWidth: 0, paddingTop: 60 }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: 20 }}>{children}</div>
      </main>
    </div>
  );
  }
