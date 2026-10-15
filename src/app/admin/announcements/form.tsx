"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function AnnouncementForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setMsg("");
    const res = await fetch("/api/admin/announcements", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, body, audience: "ALL" }),
    });
    setLoading(false);
    if (res.ok) { setTitle(""); setBody(""); setMsg("Published"); router.refresh(); }
  }

  return (
    <form onSubmit={submit} className="card" style={{ padding: 20, display: "flex", flexDirection: "column", gap: 12 }}>
      <h2 style={{ fontWeight: 600 }}>Publish announcement</h2>
      <div><label>Title</label><input required value={title} onChange={(e) => setTitle(e.target.value)} /></div>
      <div><label>Body</label><textarea rows={4} required value={body} onChange={(e) => setBody(e.target.value)} /></div>
      {msg && <div style={{ color: "var(--primary)", fontSize: 14 }}>{msg}</div>}
      <button disabled={loading} className="btn" style={{ opacity: loading ? 0.6 : 1 }}>{loading ? "Publishing..." : "Publish to all users"}</button>
    </form>
  );
      }
