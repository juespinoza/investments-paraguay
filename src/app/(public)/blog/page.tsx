import { SectionTitle } from "@/components/landing/SectionTitle";
import Link from "next/link";

export default function BlogPage() {
  return (
    <div className="container-page py-10">
      <SectionTitle
        title="Blog"
        subtitle="Ideas, mercado y guías para invertir mejor."
      />
      <p className="mt-8 text-secondary">
        <ul>
          <li className="border border-gray-100 rounded p-2">
            <Link href="/blog/paraguay-polo-inversion-inmobiliaria-sudamerica">
              Por qué Paraguay se está convirtiendo en el nuevo polo de inversión
              inmobiliaria en Sudamérica
            </Link>
          </li>
          <li>
            Inversión en departamentos en pozo en Paraguay: riesgos reales,
            ventajas y cómo evaluarlos
          </li>
          <li>
            Airbnb en Paraguay: números reales, zonas rentables y errores
            comunes al invertir
          </li>
          <li>
            Invertir en terrenos en Paraguay: cuándo conviene más que un
            departamento
          </li>
          <li>
            Guía para inversores extranjeros: cómo invertir legalmente en
            Paraguay paso a paso
          </li>
        </ul>
      </p>
    </div>
  );
}
