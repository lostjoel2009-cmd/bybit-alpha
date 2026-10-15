"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const STATUSES = ["SUBMITTED", "UNDER_REVIEW", "ACTION_REQUIRED", "APPROVED", "REJECTED", "PROCESSING", "COMPLETED"];

export function WithdrawalRow({ id, status }: { id: string; status: string }) {
  const router = useRouter();
  const [val, setVal] = useState(status);
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);

  async function update() {
    setSaving(true);
    await fetch(`/api/admin/withdrawals/${id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: val, adminNote: note }),
    });
    setSaving(false);
    router.refresh();
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6, minWidth: 220 }}>
      <select value={val} onChange={(e) => setVal(e.target.value)}>
        {STATUSES.map((s) => <option key={s} value={s}>{s.replace(/_/g, " ")}</option>)}
      </select>
      <input placeholder="Admin note (optional)" value={note} onChange={(e) => setNote(e.target.value)} />
      <button onClick={update} disabled={saving} className="btn-outline" style={{ background: "none", color: "var(--text)", cursor: "pointer" }}>{saving ? "Saving..." : "Update"}</button>
    </div>
  );
      }
