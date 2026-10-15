"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError("");
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) return setError(data.error || "Registration failed");
    router.push("/login");
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div className="card" style={{ padding: 32, width: "100%", maxWidth: 420 }}>
        <h1 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>Create your account</h1>
        <p style={{ color: "var(--muted)", fontSize: 12, marginBottom: 20 }}>Get started in seconds</p>
        <form onSubmit={onSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div><label>Full name</label><input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
          <div><label>Email</label><input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
          <div><label>Password</label><input type="password" required minLength={8} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /></div>
          {error && <div style={{ color: "#f87171", fontSize: 14 }}>{error}</div>}
          <button disabled={loading} className="btn" style={{ opacity: loading ? 0.6 : 1 }}>
            {loading ? "Creating..." : "Create account"}
          </button>
        </form>
        <div style={{ marginTop: 16, fontSize: 14, textAlign: "center", color: "var(--muted)" }}>
          Already registered? <Link href="/login" style={{ color: "var(--primary)" }}>Sign in</Link>
        </div>
      </div>
    </div>
  );
          }
