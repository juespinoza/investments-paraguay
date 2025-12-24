import { SectionTitle } from "@/components/landing/SectionTitle";

export default function BlogPage() {
  return (
    <div className="container-page py-10">
      <SectionTitle
        title="Blog"
        subtitle="Ideas, mercado y guías para invertir mejor."
      />
      <p className="mt-8 text-secondary">
        Listado de posts (pendiente de integrar con DB).
      </p>
    </div>
  );
}
