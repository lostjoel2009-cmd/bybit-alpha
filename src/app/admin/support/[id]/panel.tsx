"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const STATUSES = ["OPEN", "IN_PROGRESS", "AWAITING_USER", "RESOLVED", "CLOSED"];

export function AdminTicket({ ticketId, status, userId }: { ticketId: string; status: string; userId: string }) {
  const router = useRouter();
  const [body, setBody] = useState("");
  const [statusVal, setStatusVal] = useState(status);
  const [loading, setLoading] = useState(false);

  async function send() {
    if (!body.trim()) return;
    setLoading(true);
    await fetch(`/api/admin/support/${ticketId}/reply`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ body, status: statusVal }),
    });
    setBody(""); setLoading(false);
    router.refresh();
  }

  async function changeStatus() {
    setLoading(true);
    await fetch(`/api/admin/support/${ticketId}/status`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: statusVal }),
    });
    setLoading(false);
    router.refresh();
  }

  return (
    <div className="card" style={{ padding: 20, display: "flex", flexDirection: "column", gap: 12 }}>
      <div><label>Status</label>
        <select value={statusVal} onChange={(e) => setStatusVal(e.target.value)}>
          {STATUSES.map((s) => <option key={s} value={s}>{s.replace(/_/g, " ")}</option>)}
        </select>
        <button onClick={changeStatus} className="btn-outline" style={{ marginTop: 8, background: "none", color: "var(--text)", cursor: "pointer" }}>Update status</button>
      </div>
      <div><label>Reply</label><textarea rows={4} value={body} onChange={(e) => setBody(e.target.value)} /></div>
      <button onClick={send} disabled={loading} className="btn" style={{ opacity: loading ? 0.6 : 1 }}>{loading ? "..." : "Send reply"}</button>
    </div>
  );
}
