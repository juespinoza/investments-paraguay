import Link from "next/link";
import { Card, CardBody, PageHeader } from "@/components/virtualoffice/Page";

export default function AdminHome() {
  return (
    <div>
      <PageHeader title="Dashboard" description="Accesos rápidos del panel." />

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardBody>
            <div className="text-sm font-semibold">Asesores</div>
            <p className="mt-1 text-sm text-zinc-600">
              Crear, editar y borrar asesores.
            </p>
            <Link
              className="mt-3 inline-flex rounded-xl bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
              href="/virtual-office/asesores"
            >
              Ir a asesores
            </Link>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
