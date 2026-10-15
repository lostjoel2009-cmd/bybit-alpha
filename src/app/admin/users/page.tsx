export const dynamic = "force-dynamic";
import Link from "next/link";
import { requireAdmin } from "@/lib/session";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function AdminUsers({ searchParams }: { searchParams: { q?: string } }) {
  await requireAdmin();
  const q = searchParams.q?.trim() || "";
  const users = await db.user.findMany({
    where: q ? { OR: [{ name: { contains: q, mode: "insensitive" } }, { email: { contains: q, mode: "insensitive" } }, { accountId: { contains: q, mode: "insensitive" } }] } : undefined,
    orderBy: { createdAt: "desc" },
    take: 200,
  });
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <h1 style={{ fontSize: 24, fontWeight: 600 }}>Users</h1>
      <form method="get" className="card" style={{ padding: 16, display: "flex", gap: 8 }}>
        <input name="q" defaultValue={q} placeholder="Search by name, email, or account ID" />
        <button className="btn" type="submit">Search</button>
      </form>
      <div className="card" style={{ padding: 8 }}>
        {users.map((u) => (
          <Link key={u.id} href={`/admin/users/${u.id}`} style={{ display: "block", padding: "12px 14px", borderBottom: "1px solid var(--border)", textDecoration: "none", color: "inherit" }}>
            <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 6 }}>
              <div>
                <div style={{ fontWeight: 500 }}>{u.name}</div>
                <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>{u.email} · {u.accountId}</div>
              </div>
              <div style={{ fontSize: 12, color: u.status === "ACTIVE" ? "var(--primary)" : "#f87171" }}>{u.status}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
