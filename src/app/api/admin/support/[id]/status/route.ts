import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/session";
import { db } from "@/lib/db";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  await requireAdmin();
  const { status } = await req.json();
  await db.supportTicket.update({ where: { id: params.id }, data: { status } });
  return NextResponse.json({ ok: true });
}
