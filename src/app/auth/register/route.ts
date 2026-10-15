import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";

function generateAccountId() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let s = "BA-";
  for (let i = 0; i < 6; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return s;
}

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();
    if (!name || !email || !password || password.length < 8) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }
    const lower = String(email).toLowerCase();
    const exists = await db.user.findUnique({ where: { email: lower } });
    if (exists) return NextResponse.json({ error: "Email already in use" }, { status: 409 });

    const passwordHash = await bcrypt.hash(password, 12);
    let accountId = generateAccountId();
    for (let i = 0; i < 5; i++) {
      const clash = await db.user.findUnique({ where: { accountId } });
      if (!clash) break;
      accountId = generateAccountId();
    }

    const user = await db.user.create({
      data: { name, email: lower, passwordHash, accountId, role: "USER", status: "ACTIVE" },
    });

    const assets = await db.asset.findMany({ where: { enabled: true } });
    if (assets.length > 0) {
      await db.wallet.createMany({
        data: assets.map((a) => ({ userId: user.id, assetId: a.id, balance: 0 })),
      });
    }

    await db.activityLog.create({
      data: { userId: user.id, event: "ACCOUNT_CREATED", description: "Account registered", status: "SUCCESS" },
    });

    return NextResponse.json({ ok: true, accountId: user.accountId }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
       }
