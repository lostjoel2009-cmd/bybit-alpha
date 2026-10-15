import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/session";
import { db } from "@/lib/db";
import { notify } from "@/lib/notify";

export async function POST(req: Request) {
  const admin = await requireAdmin();
  const { userId, assetId, amount, direction, reason } = await req.json();
  const amt = Number(amount);
  if (!userId || !assetId || !amt || amt <= 0 || !reason || !["credit", "debit"].includes(direction)) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }
  const delta = direction === "credit" ? amt : -amt;

  try {
    const result = await db.$transaction(async (tx) => {
      const wallet = await tx.wallet.findUnique({ where: { userId_assetId: { userId, assetId } } });
      if (!wallet) throw new Error("WALLET_NOT_FOUND");
      const newBalance = Number(wallet.balance) + delta;
      if (newBalance < 0) throw new Error("INSUFFICIENT_BALANCE");

      await tx.wallet.update({ where: { id: wallet.id }, data: { balance: newBalance.toString() } });
      await tx.ledgerEntry.create({
        data: {
          walletId: wallet.id, assetId, type: direction === "credit" ? "CREDIT" : "DEBIT",
          amount: amt.toString(), balanceAfter: newBalance.toString(), reason,
          reference: `adj-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, createdById: admin.id,
        },
      });
      await tx.activityLog.create({
        data: {
          userId, event: direction === "credit" ? "BALANCE_CREDITED" : "BALANCE_DEBITED",
          description: reason, amount: amt.toString(), status: "COMPLETED",
        },
      });
      await tx.auditLog.create({
        data: {
          adminId: admin.id, targetUserId: userId,
          action: direction === "credit" ? "CREDIT_BALANCE" : "DEBIT_BALANCE",
          resourceType: "Wallet", resourceId: wallet.id,
          details: { amount: amt, reason, newBalance },
        },
      });
      return { newBalance };
    });
    await notify(userId, "BALANCE_ADJUSTED", "Balance updated", `${direction === "credit" ? "Credited" : "Debited"} ${amt}. Reason: ${reason}`, "/activity");
    return NextResponse.json({ ok: true, newBalance: result.newBalance });
  } catch (e: any) {
    const msg = e.message === "INSUFFICIENT_BALANCE" ? "Insufficient balance" : e.message === "WALLET_NOT_FOUND" ? "Wallet not found" : "Failed";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
                                          }
