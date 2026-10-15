import { NextResponse } from "next/server";
import { requireUser } from "@/lib/session";
import { db } from "@/lib/db";

function ref() {
  const n = Math.floor(Math.random() * 9000 + 1000);
  return `WD-${new Date().getFullYear()}-${n}`;
}

export async function POST(req: Request) {
  const user = await requireUser();
  const { assetId, amount, destination } = await req.json();
  const amt = Number(amount);
  if (!assetId || !amt || amt <= 0 || !destination) return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  const wallet = await db.wallet.findUnique({ where: { userId_assetId: { userId: user.id, assetId } } });
  if (!wallet) return NextResponse.json({ error: "Wallet not found" }, { status: 404 });
  if (Number(wallet.balance) < amt) return NextResponse.json({ error: "Insufficient balance" }, { status: 400 });

  const w = await db.withdrawal.create({
    data: { reference: ref(), userId: user.id, assetId, amount: amt.toString(), destination, status: "SUBMITTED" },
  });
  await db.activityLog.create({
    data: { userId: user.id, event: "WITHDRAWAL_SUBMITTED", description: `Submitted withdrawal ${w.reference}`, reference: w.reference, amount: amt.toString(), status: "SUBMITTED" },
  });
  return NextResponse.json({ ok: true, reference: w.reference });
    }
