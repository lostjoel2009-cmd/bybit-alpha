export const dynamic = "force-dynamic";
import { requireAdmin } from "@/lib/session";
import { db } from "@/lib/db";
import { AnnouncementForm } from "./form";

export const dynamic = "force-dynamic";

export default async function AdminAnnouncements() {
  await requireAdmin();
  const list = await db.announcement.findMany({ orderBy: { createdAt: "desc" } });
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <h1 style={{ fontSize: 24, fontWeight: 600 }}>Announcements</h1>
      <AnnouncementForm />
      <div className="card" style={{ padding: 8 }}>
        <h2 style={{ padding: 14, fontWeight: 600 }}>Published</h2>
        {list.map((a) => (
          <div key={a.id} style={{ padding: 14, borderTop: "1px solid var(--border)" }}>
            <div style={{ fontWeight: 500 }}>{a.title}</div>
            <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 3 }}>{a.publishedAt ? new Date(a.publishedAt).toLocaleString() : "Draft"} · {a.archived ? "ARCHIVED" : "ACTIVE"}</div>
            <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 6, whiteSpace: "pre-wrap" }}>{a.body}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
