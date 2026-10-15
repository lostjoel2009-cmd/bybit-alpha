"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function InvoiceForm({ users, assets }: { users: { id: string; name: string; email: string }[]; assets: { id: string; symbol: string }[] }) {
  const router = useRouter();
  const [userId, setUserId] = useState(users[0]?.id || "");
  const [assetId, setAssetId] = useState(assets[0]?.id || "");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [method, setMethod] = useState("Internal ledger transfer");
  const [dueDate, setDueDate] = useState("");
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError(""); setMsg("");
    const res = await fetch("/api/admin/invoices", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, assetId, amount, description, method, dueDate: dueDate || null }),
    });
    setLoading(false);
    const data = await res.json();
    if (!res.ok) return setError(data.error || "Failed");
    setMsg(`Created ${data.invoiceNumber}`);
    setAmount(""); setDescription("");
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="card" style={{ padding: 20, display: "flex", flexDirection: "column", gap: 12, maxWidth: 560 }}>
      <h2 style={{ fontWeight: 600 }}>Create invoice</h2>
      <div><label>User</label>
        <select value={userId} onChange={(e) => setUserId(e.target.value)}>
          {users.map((u) => <option key={u.id} value={u.id}>{u.name} · {u.email}</option>)}
        </select>
      </div>
      <div><label>Currency</label>
        <select value={assetId} onChange={(e) => setAssetId(e.target.value)}>
          {assets.map((a) => <option key={a.id} value={a.id}>{a.symbol}</option>)}
        </select>
      </div>
      <div><label>Amount</label><input required value={amount} onChange={(e) => setAmount(e.target.value)} /></div>
      <div><label>Description</label><input required value={description} onChange={(e) => setDescription(e.target.value)} /></div>
      <div><label>Payment method</label><input value={method} onChange={(e) => setMethod(e.target.value)} /></div>
      <div><label>Due date</label><input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} /></div>
      {error && <div style={{ color: "#f87171", fontSize: 14 }}>{error}</div>}
      {msg && <div style={{ color: "var(--primary)", fontSize: 14 }}>{msg}</div>}
      <button disabled={loading} className="btn" style={{ opacity: loading ? 0.6 : 1 }}>{loading ? "Creating..." : "Create invoice"}</button>
    </form>
  );
                     }
