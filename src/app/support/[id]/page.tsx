import { requireUser } from "@/lib/session";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { ReplyForm } from "./reply";

export const dynamic = "force-dynamic";

export default async function TicketDetail({ params }: { params: { id: string } }) {
  const user = await requireUser();
  const t = await db.supportTicket.findUnique({
    where: { id: params.id },
    include: { messages: { orderBy: { createdAt: "asc" } } },
  });
  if (!t || t.userId !== user.id) notFound();
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div>
        <div style={{ fontFamily: "monospace", fontSize: 12, color: "var(--muted)" }}>{t.ticketNumber}</div>
        <h1 style={{ fontSize: 22, fontWeight: 600, marginTop: 4 }}>{t.subject}</h1>
        <div style={{ fontSize: 12, color: "var(--primary)", marginTop: 4 }}>{t.status.replace(/_/g, " ")}</div>
      </div>
      <div className="card" style={{ padding: 8 }}>
        {t.messages.map((m) => (
          <div key={m.id} style={{ padding: 14, borderBottom: "1px solid var(--border)" }}>
            <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 6 }}>
              {m.senderRole === "USER" ? "You" : "Support"} · {new Date(m.createdAt).toLocaleString()}
            </div>
            <div style={{ whiteSpace: "pre-wrap" }}>{m.body}</div>
          </div>
        ))}
      </div>
      {t.status !== "CLOSED" && <ReplyForm ticketId={t.id} />}
    </div>
  );
      }
