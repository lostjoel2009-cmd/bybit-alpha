import { requireUser } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const user = await requireUser();
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <h1 style={{ fontSize: 24, fontWeight: 600 }}>Profile</h1>
      <div className="card" style={{ padding: 24, display: "flex", flexDirection: "column", gap: 14 }}>
        <Row label="Name" value={user.name} />
        <Row label="Email" value={user.email} />
        <Row label="Account ID" value={user.accountId} />
        <Row label="Role" value={user.role} />
        <Row label="Status" value={user.status} />
        <Row label="Member since" value={new Date(user.createdAt).toLocaleDateString()} />
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid var(--border)" }}>
      <span style={{ color: "var(--muted)", fontSize: 13 }}>{label}</span>
      <span style={{ fontSize: 14 }}>{value}</span>
    </div>
  );
      }
