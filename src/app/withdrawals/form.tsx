"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function WithdrawalForm({ assets }: { assets: { id: string; symbol: string; balance: string; decimals: number }[] }) {
  const router = useRouter();
  const [assetId, setAssetId] = useState(assets[0]?.id || "");
  const [amount, setAmount] = useState("");
  const [destination, setDestination] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError("");
    const res = await fetch("/api/withdrawals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ assetId, amount, destination }),
    });
    setLoading(false);
    const data = await res.json();
    if (!res.ok) return setError(data.error || "Failed");
    setAmount(""); setDestination("");
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="card" style={{ padding: 20, display: "flex", flexDirection: "column", gap: 12 }}>
      <h2 style={{ fontWeight: 600 }}>New withdrawal request</h2>
      <div>
        <label>Currency</label>
        <select value={assetId} onChange={(e) => setAssetId(e.target.value)}>
          {assets.map((a) => <option key={a.id} value={a.id}>{a.symbol} — balance {parseFloat(a.balance).toFixed(a.decimals)}</option>)}
        </select>
      </div>
      <div><label>Amount</label><input required value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.00" /></div>
      <div><label>Destination (address or account)</label><input required value={destination} onChange={(e) => setDestination(e.target.value)} /></div>
      {error && <div style={{ color: "#f87171", fontSize: 14 }}>{error}</div>}
      <button disabled={loading} className="btn" style={{ opacity: loading ? 0.6 : 1 }}>{loading ? "Submitting..." : "Submit request"}</button>
    </form>
  );
}
