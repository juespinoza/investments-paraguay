import { SectionTitle } from "@/components/landing/SectionTitle";
import { Button } from "@/components/ui/Button";

export default function LeadMagnetPage() {
  return (
    <div className="container-page py-14">
      <SectionTitle
        title="Guía gratuita para inversores"
        subtitle="Dejá tu WhatsApp o correo y te la envío."
      />

      <div className="mt-10 max-w-xl rounded-sm border bg-white p-6">
        <form className="grid gap-4">
          <input className="h-11 rounded-sm border px-3" placeholder="Nombre" />
          <input className="h-11 rounded-sm border px-3" placeholder="Email" />
          <input
            className="h-11 rounded-sm border px-3"
            placeholder="WhatsApp"
          />
          <Button>Recibir guía</Button>
        </form>
      </div>
    </div>
  );
}
