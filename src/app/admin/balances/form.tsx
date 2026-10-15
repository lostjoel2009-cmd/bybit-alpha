"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function BalanceForm({ users, assets }: { users: { id: string; name: string; email: string; accountId: string }[]; assets: { id: string; symbol: string }[] }) {
  const router = useRouter();
  const [userId, setUserId] = useState(users[0]?.id || "");
  const [assetId, setAssetId] = useState(assets[0]?.id || "");
  const [amount, setAmount] = useState("");
  const [direction, setDirection] = useState<"credit" | "debit">("credit");
  const [reason, setReason] = useState("");
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError(""); setMsg("");
    const res = await fetch("/api/admin/balance", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, assetId, amount, direction, reason }),
    });
    setLoading(false);
    const data = await res.json();
    if (!res.ok) return setError(data.error || "Failed");
    setMsg(`Done. New balance: ${data.newBalance}`);
    setAmount(""); setReason("");
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="card" style={{ padding: 20, display: "flex", flexDirection: "column", gap: 12, maxWidth: 560 }}>
      <div>
        <label>User</label>
        <select value={userId} onChange={(e) => setUserId(e.target.value)}>
          {users.map((u) => <option key={u.id} value={u.id}>{u.name} · {u.email} · {u.accountId}</option>)}
        </select>
      </div>
      <div>
        <label>Currency</label>
        <select value={assetId} onChange={(e) => setAssetId(e.target.value)}>
          {assets.map((a) => <option key={a.id} value={a.id}>{a.symbol}</option>)}
        </select>
      </div>
      <div>
        <label>Direction</label>
        <select value={direction} onChange={(e) => setDirection(e.target.value as any)}>
          <option value="credit">Credit (add)</option>
          <option value="debit">Debit (subtract)</option>
        </select>
      </div>
      <div><label>Amount</label><input required value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.00" /></div>
      <div><label>Reason</label><input required value={reason} onChange={(e) => setReason(e.target.value)} /></div>
      {error && <div style={{ color: "#f87171", fontSize: 14 }}>{error}</div>}
      {msg && <div style={{ color: "var(--primary)", fontSize: 14 }}>{msg}</div>}
      <button disabled={loading} className="btn" style={{ opacity: loading ? 0.6 : 1 }}>{loading ? "Processing..." : "Apply adjustment"}</button>
    </form>
  );
}
