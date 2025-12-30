import { VirtualOfficeMenu } from "@/components/virtualoffice/VirtualOfficeMenu";
import { requireSession } from "@/lib/auth/require-session";

export default async function VirtualOfficeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireSession();

  return (
    <div className="container-page py-6 grid md:grid-cols-[240px_1fr] gap-6">
      <aside className="rounded-xl bg-white p-4 border">
        <VirtualOfficeMenu />
      </aside>
      <main className="rounded-xl bg-white p-4 border">{children}</main>
    </div>
  );
}
