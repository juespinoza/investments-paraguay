import AdminShell from "@/components/virtualoffice/AdminShell";
import { requireSession } from "@/lib/auth/require-session";

export default async function VirtualOfficeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireSession();

  return <AdminShell>{children}</AdminShell>;
}
