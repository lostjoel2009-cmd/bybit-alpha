import { NextResponse } from "next/server";
import { requireUser } from "@/lib/session";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  const user = await requireUser();
  const { subject, category, body } = await req.json();
  if (!subject || !category || !body) return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  const num = Math.floor(Math.random() * 9000 + 1000);
  const ticketNumber = `TKT-${new Date().getFullYear()}-${num}`;
  const t = await db.supportTicket.create({
    data: { ticketNumber, userId: user.id, subject, category, status: "OPEN" },
  });
  await db.supportMessage.create({
    data: { ticketId: t.id, senderId: user.id, senderRole: user.role, body },
  });
  await db.activityLog.create({
    data: { userId: user.id, event: "TICKET_CREATED", description: `Created ticket ${ticketNumber}`, reference: ticketNumber, status: "OPEN" },
  });
  return NextResponse.json({ ok: true, ticketNumber });
      }
