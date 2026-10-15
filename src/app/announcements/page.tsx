export const dynamic = "force-dynamic";
import { requireUser } from "@/lib/session";
import { db } from "@/lib/db";


export default async function AnnouncementsPage() {
  const user = await requireUser();
  const items = await db.announcement.findMany({ where: { archived: false }, orderBy: { publishedAt: "desc" } });
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <h1 style={{ fontSize: 24, fontWeight: 600 }}>Announcements</h1>
      {items.length === 0 && <div className="card" style={{ padding: 20, color: "var(--muted)", fontSize: 14 }}>Nothing yet.</div>}
      {items.map((a) => (
        <div key={a.id} className="card" style={{ padding: 20 }}>
          <div style={{ fontSize: 18, fontWeight: 600 }}>{a.title}</div>
          <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 4 }}>{a.publishedAt ? new Date(a.publishedAt).toLocaleString() : "Draft"}</div>
          <div style={{ marginTop: 12, whiteSpace: "pre-wrap", fontSize: 14, lineHeight: 1.55 }}>{a.body}</div>
        </div>
      ))}
    </div>
  );
      }
