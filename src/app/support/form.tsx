"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const CATS = ["BILLING", "PAYMENT_PROBLEM", "ACCOUNT_ACCESS", "BALANCE_QUESTION", "WITHDRAWAL", "CARD_SHIPMENT", "GENERAL"];

export function TicketForm() {
  const router = useRouter();
  const [subject, setSubject] = useState("");
  const [category, setCategory] = useState(CATS[0]);
  const [body, setBody] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError("");
    const res = await fetch("/api/support", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subject, category, body }),
    });
    setLoading(false);
    const data = await res.json();
    if (!res.ok) return setError(data.error || "Failed");
    setSubject(""); setBody("");
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="card" style={{ padding: 20, display: "flex", flexDirection: "column", gap: 12 }}>
      <h2 style={{ fontWeight: 600 }}>Open a new ticket</h2>
      <div><label>Subject</label><input required value={subject} onChange={(e) => setSubject(e.target.value)} /></div>
      <div>
        <label>Category</label>
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          {CATS.map((c) => <option key={c} value={c}>{c.replace(/_/g, " ")}</option>)}
        </select>
      </div>
      <div><label>Message</label><textarea required rows={4} value={body} onChange={(e) => setBody(e.target.value)} /></div>
      {error && <div style={{ color: "#f87171", fontSize: 14 }}>{error}</div>}
      <button disabled={loading} className="btn" style={{ opacity: loading ? 0.6 : 1 }}>{loading ? "Sending..." : "Create ticket"}</button>
    </form>
  );
}
