import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/session";
import { db } from "@/lib/db";
import { notify } from "@/lib/notify";

export async function POST(req: Request) {
  const admin = await requireAdmin();
  const { title, body, audience } = await req.json();
  if (!title || !body) return NextResponse.json({ error: "Invalid" }, { status: 400 });
  const a = await db.announcement.create({
    data: { title, body, audience: audience || "ALL", createdById: admin.id, publishedAt: new Date() },
  });
  const users = await db.user.findMany({ where: { status: "ACTIVE" }, select: { id: true } });
  await Promise.all(users.map((u) => notify(u.id, "ANNOUNCEMENT", title, body, "/announcements")));
  await db.auditLog.create({
    data: { adminId: admin.id, action: "PUBLISH_ANNOUNCEMENT", resourceType: "Announcement", resourceId: a.id, details: { title } },
  });
  return NextResponse.json({ ok: true });
                                                                                                                         }
