export const dynamic = "force-dynamic";
"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ForgotPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setMsg("");
    const res = await fetch("/api/auth/forgot", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }) });
    setLoading(false);
    setMsg("If that email is registered, contact support to reset your password.");
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div className="card" style={{ padding: 32, width: "100%", maxWidth: 420 }}>
        <h1 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16 }}>Reset password</h1>
        <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div><label>Email</label><input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} /></div>
          <button disabled={loading} className="btn" style={{ opacity: loading ? 0.6 : 1 }}>{loading ? "..." : "Send"}</button>
        </form>
        {msg && <div style={{ marginTop: 14, fontSize: 13, color: "var(--muted)" }}>{msg}</div>}
        <div style={{ marginTop: 16, fontSize: 14, textAlign: "center" }}>
          <Link href="/login" style={{ color: "var(--primary)" }}>Back to sign in</Link>
        </div>
      </div>
    </div>
  );
      }
