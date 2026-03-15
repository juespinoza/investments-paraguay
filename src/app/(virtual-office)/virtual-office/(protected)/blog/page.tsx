import { requireVirtualOfficeRoles } from "@/lib/auth/virtual-office";

export default async function Page() {
  const access = await requireVirtualOfficeRoles(["ADMIN", "BLOGUERO"]);

  if (!access.allowed) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-semibold">Blog</h1>
        <p className="mt-2 text-secondary">
          No tienes permisos para ver esta sección.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold">Blog</h1>
      <p className="mt-2 text-secondary">
        Página en construcción (virtual office).
      </p>
    </div>
  );
}
