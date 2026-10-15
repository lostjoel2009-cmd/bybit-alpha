import { NextResponse } from "next/server";
import { requireUser } from "@/lib/session";
import { db } from "@/lib/db";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const user = await requireUser();
  const { body } = await req.json();
  const t = await db.supportTicket.findUnique({ where: { id: params.id } });
  if (!t || t.userId !== user.id) return NextResponse.json({ error: "Not found" }, { status: 404 });
  await db.supportMessage.create({ data: { ticketId: t.id, senderId: user.id, senderRole: user.role, body } });
  await db.supportTicket.update({ where: { id: t.id }, data: { status: "AWAITING_USER" } });
  return NextResponse.json({ ok: true });
}
