import { requireAdmin } from "@/lib/session";
import { db } from "@/lib/db";
import { BalanceForm } from "./form";

export const dynamic = "force-dynamic";

export default async function AdminBalances() {
  await requireAdmin();
  const users = await db.user.findMany({ orderBy: { name: "asc" }, take: 500 });
  const assets = await db.asset.findMany({ where: { enabled: true } });
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <h1 style={{ fontSize: 24, fontWeight: 600 }}>Balance management</h1>
      <BalanceForm users={users.map((u) => ({ id: u.id, name: u.name, email: u.email, accountId: u.accountId }))} assets={assets.map((a) => ({ id: a.id, symbol: a.symbol }))} />
    </div>
  );
                                                                                                                                     }
