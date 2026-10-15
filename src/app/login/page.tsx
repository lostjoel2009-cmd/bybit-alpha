export const dynamic = "force-dynamic";
"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError("");
    const res = await signIn("credentials", { email, password, redirect: false });
    setLoading(false);
    if (res?.error) return setError("Invalid credentials or account suspended.");
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div className="card" style={{ padding: 32, width: "100%", maxWidth: 420 }}>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: 1 }}>
            BYBIT <span style={{ color: "var(--primary)" }}>ALPHA</span>
          </div>
          <p style={{ color: "var(--muted)", fontSize: 12, marginTop: 6 }}>Sign in to your account</p>
        </div>
        <form onSubmit={onSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div><label>Email</label><input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} /></div>
          <div><label>Password</label><input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} /></div>
          {error && <div style={{ color: "#f87171", fontSize: 14 }}>{error}</div>}
          <button disabled={loading} className="btn" style={{ opacity: loading ? 0.6 : 1 }}>
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
        <div style={{ marginTop: 16, fontSize: 14, textAlign: "center", color: "var(--muted)" }}>
          No account? <Link href="/register" style={{ color: "var(--primary)" }}>Register</Link>
        </div>
      </div>
    </div>
  );
}
