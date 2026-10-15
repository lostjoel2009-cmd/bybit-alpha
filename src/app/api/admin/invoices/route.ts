import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/session";
import { db } from "@/lib/db";
import { notify } from "@/lib/notify";

export async function POST(req: Request) {
  const admin = await requireAdmin();
  const { userId, assetId, amount, description, method, dueDate } = await req.json();
  const amt = Number(amount);
  if (!userId || !assetId || !amt || amt <= 0 || !description) return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  const year = new Date().getFullYear();
  const count = await db.invoice.count();
  const invoiceNumber = `INV-${year}-${String(count + 1).padStart(4, "0")}`;
  const inv = await db.invoice.create({
    data: {
      invoiceNumber, userId, assetId, amount: amt.toString(), description,
      paymentMethod: method || "Internal ledger transfer", payeeName: "ALPHA VAULT",
      status: "AWAITING_PAYMENT", dueDate: dueDate ? new Date(dueDate) : null, createdById: admin.id,
    },
  });
  await notify(userId, "INVOICE_CREATED", "New invoice", `${description} — ${amt}`, "/bills");
  return NextResponse.json({ ok: true, invoiceNumber: inv.invoiceNumber });
      }
