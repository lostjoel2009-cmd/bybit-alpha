import { requireAdmin } from "@/lib/session";
import { Shell } from "@/components/Sidebar";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await requireAdmin();
  return <Shell user={{ name: user.name, email: user.email, role: user.role, accountId: user.accountId }} area="admin">{children}</Shell>;
}
