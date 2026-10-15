import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/session";
import { db } from "@/lib/db";
import { notify } from "@/lib/notify";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const admin = await requireAdmin();
  const { body, status } = await req.json();
  if (!body) return NextResponse.json({ error: "Empty" }, { status: 400 });
  const t = await db.supportTicket.findUnique({ where: { id: params.id } });
  if (!t) return NextResponse.json({ error: "Not found" }, { status: 404 });
  await db.supportMessage.create({ data: { ticketId: t.id, senderId: admin.id, senderRole: "ADMIN", body } });
  await db.supportTicket.update({ where: { id: t.id }, data: { status: status || "IN_PROGRESS" } });
  await notify(t.userId, "SUPPORT_REPLY", "New support reply", `${t.ticketNumber} has a new reply`, `/support/${t.id}`);
  return NextResponse.json({ ok: true });
                                  }
