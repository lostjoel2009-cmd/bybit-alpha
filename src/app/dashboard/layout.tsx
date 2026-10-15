import { requireUser } from "@/lib/session";
import { Shell } from "@/components/Sidebar";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();
  return <Shell user={{ name: user.name, email: user.email, role: user.role, accountId: user.accountId }}>{children}</Shell>;
}
