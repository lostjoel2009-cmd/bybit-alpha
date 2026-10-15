export const dynamic = "force-dynamic";
import { requireUser } from "@/lib/session";
import { db } from "@/lib/db";


export default async function NotificationsPage() {
  const user = await requireUser();
  const items = await db.notification.findMany({ where: { userId: user.id }, orderBy: { createdAt: "desc" }, take: 100 });
  await db.notification.updateMany({ where: { userId: user.id, readAt: null }, data: { readAt: new Date() } });
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <h1 style={{ fontSize: 24, fontWeight: 600 }}>Notifications</h1>
      {items.length === 0 && <div className="card" style={{ padding: 20, color: "var(--muted)", fontSize: 14 }}>Nothing yet.</div>}
      {items.map((n) => (
        <div key={n.id} className="card" style={{ padding: 16 }}>
          <div style={{ fontWeight: 500 }}>{n.title}</div>
          <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 4 }}>{n.body}</div>
          {n.link && <a href={n.link} style={{ color: "var(--primary)", fontSize: 12, marginTop: 8, display: "inline-block" }}>Open →</a>}
          <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 6 }}>{new Date(n.createdAt).toLocaleString()}</div>
        </div>
      ))}
    </div>
  );
}
