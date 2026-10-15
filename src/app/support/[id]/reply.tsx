"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function ReplyForm({ ticketId }: { ticketId: string }) {
  const router = useRouter();
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await fetch(`/api/support/${ticketId}/reply`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ body }),
    });
    setBody(""); setLoading(false);
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="card" style={{ padding: 20, display: "flex", flexDirection: "column", gap: 12 }}>
      <textarea required rows={4} value={body} onChange={(e) => setBody(e.target.value)} placeholder="Type a reply..." />
      <button disabled={loading} className="btn" style={{ opacity: loading ? 0.6 : 1 }}>{loading ? "Sending..." : "Send reply"}</button>
    </form>
  );
}
