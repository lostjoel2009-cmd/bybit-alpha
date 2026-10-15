import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
const db = new PrismaClient();

async function main() {
  const assets = [
    { symbol: "USDT", name: "Tether USD", type: "CRYPTO", decimals: 6 },
    { symbol: "BTC", name: "Bitcoin", type: "CRYPTO", decimals: 8 },
    { symbol: "ETH", name: "Ethereum", type: "CRYPTO", decimals: 8 },
    { symbol: "USD", name: "US Dollar", type: "FIAT", decimals: 2 },
    { symbol: "EUR", name: "Euro", type: "FIAT", decimals: 2 },
    { symbol: "GBP", name: "British Pound", type: "FIAT", decimals: 2 },
  ];
  for (const a of assets) {
    await db.asset.upsert({ where: { symbol: a.symbol }, update: {}, create: a });
  }
  const allAssets = await db.asset.findMany();

  const admin = await db.user.upsert({
    where: { email: "admin@bybitalpha.app" },
    update: {},
    create: {
      accountId: "BA-ADMIN1",
      email: "admin@bybitalpha.app",
      name: "Administrator",
      passwordHash: await bcrypt.hash("Admin123!", 12),
      role: "ADMIN",
      status: "ACTIVE",
    },
  });

  const u1 = await db.user.upsert({
    where: { email: "user1@bybitalpha.app" },
    update: {},
    create: {
      accountId: "BA-USER01",
      email: "user1@bybitalpha.app",
      name: "User One",
      passwordHash: await bcrypt.hash("User123!", 12),
      role: "USER",
      status: "ACTIVE",
    },
  });

  const u2 = await db.user.upsert({
    where: { email: "user2@bybitalpha.app" },
    update: {},
    create: {
      accountId: "BA-USER02",
      email: "user2@bybitalpha.app",
      name: "User Two",
      passwordHash: await bcrypt.hash("User123!", 12),
      role: "USER",
      status: "ACTIVE",
    },
  });

  for (const u of [admin, u1, u2]) {
    for (const a of allAssets) {
      await db.wallet.upsert({
        where: { userId_assetId: { userId: u.id, assetId: a.id } },
        update: {},
        create: { userId: u.id, assetId: a.id, balance: 0 },
      });
    }
  }

  const startBalances: Record<string, string> = { USDT: "12500.00", BTC: "0.45000000", ETH: "5.20000000", USD: "3200.00" };
  for (const [symbol, amt] of Object.entries(startBalances)) {
    const asset = allAssets.find((a) => a.symbol === symbol)!;
    const wallet = await db.wallet.findUnique({ where: { userId_assetId: { userId: u1.id, assetId: asset.id } } });
    if (wallet && Number(wallet.balance) === 0) {
      await db.wallet.update({ where: { id: wallet.id }, data: { balance: amt } });
      await db.ledgerEntry.create({
        data: {
          walletId: wallet.id, assetId: asset.id, type: "CREDIT",
          amount: amt, balanceAfter: amt, reason: "Opening balance",
          reference: `seed-${symbol}-${u1.id}`,
        },
      });
    }
  }

  const usdt = allAssets.find((a) => a.symbol === "USDT")!;
  const existingInv = await db.invoice.findUnique({ where: { invoiceNumber: "INV-2026-0001" } });
  if (!existingInv) {
    await db.invoice.create({
      data: {
        invoiceNumber: "INV-2026-0001", userId: u1.id, assetId: usdt.id,
        amount: "500.00", description: "Service fee invoice",
        paymentMethod: "Internal ledger transfer", payeeName: "BYBIT ALPHA",
        status: "AWAITING_PAYMENT", dueDate: new Date(Date.now() + 7 * 86400000),
        createdById: admin.id,
      },
    });
  }

  const existingCard = await db.cardOrder.findUnique({ where: { reference: "CARD-2026-0001" } });
  if (!existingCard) {
    const card = await db.cardOrder.create({
      data: {
        reference: "CARD-2026-0001", userId: u2.id, cardType: "Virtual",
        status: "IN_TRANSIT", shippingName: "User Two",
        carrier: "Standard Carrier", trackingNumber: "TRK000000001",
        estimatedDelivery: new Date(Date.now() + 3 * 86400000),
      },
    });
    await db.shipmentEvent.createMany({
      data: [
        { cardOrderId: card.id, status: "ORDER_RECEIVED", description: "Order received" },
        { cardOrderId: card.id, status: "PREPARING", description: "Preparing shipment" },
        { cardOrderId: card.id, status: "DISPATCHED", description: "Dispatched" },
        { cardOrderId: card.id, status: "IN_TRANSIT", description: "In transit" },
      ],
    });
  }

  const existingAnn = await db.announcement.findFirst({ where: { title: "Welcome" } });
  if (!existingAnn) {
    await db.announcement.create({
      data: {
        title: "Welcome to BYBIT ALPHA",
        body: "Your account is ready. Check your dashboard for balances and activity.",
        audience: "ALL", createdById: admin.id, publishedAt: new Date(),
      },
    });
  }

  console.log("Seed complete");
  console.log("Admin: admin@bybitalpha.app / Admin123!");
  console.log("User1: user1@bybitalpha.app / User123!");
  console.log("User2: user2@bybitalpha.app / User123!");
}

main().finally(() => db.$disconnect());
