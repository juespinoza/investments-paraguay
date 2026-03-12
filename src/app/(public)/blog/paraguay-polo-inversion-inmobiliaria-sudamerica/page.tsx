import Link from "next/link";
import { StructuredData } from "@/components/seo/StructuredData";
import { SITE_URL } from "@/lib/seo";

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Investments Paraguay",
  url: SITE_URL,
  logo: `${SITE_URL}/images/logo.png`,
  sameAs: ["https://www.instagram.com/investmentsparaguay"],
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "sales",
    telephone: "+595985444801",
    availableLanguage: ["English", "Spanish", "Portuguese", "German"],
  },
};

const articleJsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline:
    "Por qué Paraguay se está convirtiendo en el nuevo polo de inversión inmobiliaria en Sudamérica",
  description:
    "Paraguay viene ganando atención como destino de inversión inmobiliaria por su estabilidad macro relativa, una inflación controlada dentro de una meta oficial, incentivos a la inversión y un ciclo de expansión urbana en Asunción y Gran Asunción.",
  image: `${SITE_URL}/images/logo.png`,
  datePublished: "2026-01-27",
  dateModified: "2026-01-27",
  author: {
    "@type": "Person",
    name: "Julia Espinoza",
  },
  publisher: {
    "@type": "Organization",
    name: "Investments Paraguay",
    logo: {
      "@type": "ImageObject",
      url: `${SITE_URL}/images/logo.png`,
    },
  },
  mainEntityOfPage: `${SITE_URL}/blog/paraguay-polo-inversion-inmobiliaria-sudamerica`,
};

export default function BlogPostPage() {
  return (
    <div className="px-4 py-10">
      <StructuredData data={[organizationJsonLd, articleJsonLd]} />
      <div className="container-page">
        <article className="mx-auto max-w-4xl">
          <div className="section-shell bg-[linear-gradient(135deg,#0f1726_0%,#18253d_55%,#243653_100%)] px-6 py-10 text-white shadow-[0_24px_80px_rgba(15,23,38,0.18)] md:px-10 md:py-14">
            <div className="eyebrow border-white/16 text-white">
              Artículo
            </div>
            <h1 className="mt-6 text-4xl font-semibold tracking-tight md:text-6xl">
              Por qué Paraguay se está convirtiendo en el nuevo polo de inversión
              inmobiliaria en Sudamérica
            </h1>
            <div className="mt-8 flex flex-col gap-3 text-sm text-white/72 sm:flex-row sm:gap-4">
              <span className="rounded-full border border-white/10 bg-white/8 px-4 py-2">
                Actualizado: 27 Ene 2026
              </span>
              <span className="rounded-full border border-white/10 bg-white/8 px-4 py-2">
                Autor: Investments Paraguay
              </span>
            </div>
            <p className="mt-8 max-w-3xl text-lg leading-8 text-white/76">
              Paraguay viene ganando atención como destino de inversión inmobiliaria
              por su estabilidad macro relativa, una inflación controlada dentro de
              una meta oficial, incentivos a la inversión y un ciclo de expansión
              urbana en Asunción y Gran Asunción. En este artículo te explico los
              factores clave y qué mirar antes de invertir.
            </p>
          </div>

          <div className="surface-card mt-8 rounded-[2rem] px-6 py-8 md:px-10 md:py-10">
      <h2 className="mb-4 text-2xl font-semibold text-primary md:text-3xl">
        Paraguay empezó a aparecer en el radar regional
      </h2>
      <p className="mb-6 mt-4 text-justify text-secondary">
        Durante años, Paraguay fue un mercado “silencioso” para muchos
        inversores. Hoy, esa percepción está cambiando: se combina una economía
        con desempeño resiliente, un marco institucional de política monetaria
        más predecible y un crecimiento urbano que empuja la demanda
        inmobiliaria, especialmente en Asunción y Gran Asunción.
      </p>
      <h2 className="mb-4 text-2xl font-semibold text-primary md:text-3xl">
        Inflación más estable = decisiones de inversión más claras
      </h2>
      <p className="mb-6 mt-4 text-justify text-secondary">
        Uno de los diferenciales importantes es la gestión de la inflación. El
        Banco Central del Paraguay (BCP) define una meta de inflación (y rango
        de tolerancia) y publica informes periódicos con datos y análisis. Eso
        reduce incertidumbre y ayuda a proyectar costos, alquileres y retornos
        con más consistencia.
      </p>
      <h2 className="mb-4 text-2xl font-semibold text-primary md:text-3xl">
        Un 2025 con inflación anual moderada (datos oficiales)
      </h2>
      <p className="mb-6 mt-4 text-justify text-secondary">
        Según el BCP, la inflación de 2025 cerró en 3,1%. Para el inversor, esto
        importa porque impacta el poder adquisitivo del inquilino, el ajuste de
        alquileres, el costo de mantenimiento y el ritmo de suba de precios del
        mercado.
      </p>
      <h2 className="mb-4 text-2xl font-semibold text-primary md:text-3xl">
        Señales de confianza externa: perspectiva crediticia positiva
      </h2>
      <p className="mb-6 mt-4 text-justify text-secondary">
        En octubre de 2025, Fitch revisó la perspectiva de Paraguay a “Positiva”
        y mantuvo la calificación en BB+. No es un detalle menor: este tipo de
        reportes suele ser leído por inversores institucionales y fondos para
        entender riesgo país, trayectoria fiscal y estabilidad.
      </p>
      <h2 className="mb-4 text-2xl font-semibold text-primary md:text-3xl">
        Incentivos para invertir: el rol de la Ley 60/90
      </h2>
      <p className="mb-6 mt-4 text-justify text-secondary">
        Paraguay cuenta con un régimen de incentivos a la inversión conocido
        como Ley 60/90, orientado a promover inversiones de capital (nacionales
        y extranjeras). Aunque no es un beneficio “inmobiliario” directo para
        cualquier operación, sí forma parte del atractivo país para el capital y
        para proyectos que dinamizan empleo, infraestructura y actividad
        económica.{" "}
      </p>
      <h2 className="mb-4 text-2xl font-semibold text-primary md:text-3xl">
        Cuando el capital llega, la ciudad se transforma (y el real estate lo
        siente)
      </h2>
      <p className="mb-6 mt-4 text-justify text-secondary">
        En ciclos de inversión y desarrollo, la construcción y los servicios
        asociados suelen acelerar. Esto se refleja en nuevas zonas con demanda
        (por cercanía a centros corporativos, servicios, conectividad), y
        también en la profesionalización de edificios: amenities, seguridad,
        estacionamientos, y formatos pensados para renta.
      </p>
      <h2 className="mb-4 text-2xl font-semibold text-primary md:text-3xl">
        El “efecto Asunción”: demanda por ubicación, estilo de vida y servicios
      </h2>
      <p className="mb-6 mt-4 text-justify text-secondary">
        En la práctica, gran parte de la atracción inmobiliaria se concentra en
        Asunción (y anillos cercanos). El comprador/inversor busca:
      </p>
      <ul className="mb-6 list-disc space-y-2 pl-5 text-secondary">
        <li>ubicación (cercanía a ejes comerciales y corporativos)</li>
        <li>servicios (restaurantes, supermercados, gimnasios, hospitales)</li>
        <li>accesos (avenidas rápidas)</li>
        <li>seguridad y amenities</li>
      </ul>
      <h2 className="mb-4 text-2xl font-semibold text-primary md:text-3xl">
        Paraguay también compite por su costo de entrada
      </h2>
      <p className="mb-6 mt-4 text-justify text-secondary">
        Comparado con otros mercados sudamericanos, Paraguay suele percibirse
        como un punto de entrada más accesible para comprar m² en zonas buenas
        (esto varía mucho por barrio y tipo de edificio). Para inversores
        extranjeros o regionales, esa “barrera de entrada” más baja puede ser un
        incentivo fuerte.
      </p>
      <h2 className="mb-4 text-2xl font-semibold text-primary md:text-3xl">
        Interés internacional: qué dicen las estadísticas globales
      </h2>
      <p className="mb-6 mt-4 text-justify text-secondary">
        El comportamiento de la inversión extranjera directa (IED/FDI) se sigue
        en bases internacionales como el Banco Mundial (con fuentes IMF/UNCTAD y
        nacionales). No todo FDI va a real estate, pero sí es un termómetro de
        interés inversor y de proyectos que mueven economía y empleo, lo cual
        termina impactando demanda habitacional y comercial.
      </p>
      <h2 className="mb-4 text-2xl font-semibold text-primary md:text-3xl">
        La pregunta clave: ¿qué tipo de inversión inmobiliaria conviene hoy?
      </h2>
      <p className="mt-4 text-justify text-secondary">
        No hay una sola respuesta. Depende del objetivo:
      </p>
      <ul className="mb-6 mt-4 list-disc space-y-2 pl-5 text-secondary">
        <li>Renta tradicional (estabilidad, menor rotación)</li>
        <li>Renta temporaria (potencial mayor, más gestión)</li>
        <li>Plusvalía (barrios emergentes, etapas tempranas)</li>
        <li>Mixto (renta + apreciación)</li>
      </ul>
      <h2 className="mb-4 text-2xl font-semibold text-primary md:text-3xl">
        Checklist rápido recomendado antes de invertir en Paraguay
      </h2>
      <ul className="mb-6 mt-4 list-disc space-y-2 pl-5 text-secondary">
        <li>
          Estudiar barrio y microubicación (ruido, tráfico, seguridad, cercanía
          a polos)
        </li>
        <li>
          Validar desarrollador y calidad constructiva (historial, entregas,
          garantías)
        </li>
        <li>
          Calcular gastos reales: expensas, mantenimiento, vacancia, mejoras
        </li>
        <li>
          Definir estrategia (renta o reventa) y horizonte (12, 24, 60 meses)
        </li>
        <li>Revisar documentación con asesoría local</li>
      </ul>

      <h2 className="mb-4 text-2xl font-semibold text-primary md:text-3xl">Conclusión</h2>
      <p className="mb-16 mt-4 text-justify text-secondary">
        Paraguay está ganando fuerza como destino inmobiliario por una
        combinación de estabilidad relativa, marco monetario con meta de
        inflación, señales de confianza externa y atracción de capital e
        inversiones. El potencial existe, pero el diferencial real está en
        elegir bien la zona, entender el producto y hacer números con criterio.
      </p>
      <hr className="border-soft" />
      <h4 className="my-6 text-xl font-semibold text-primary">Fuentes y referencias</h4>
      <ul className="mb-6 mt-4 list-disc space-y-3 pl-5 text-secondary">
        <li>
          Banco Central del Paraguay [
          <Link
            className="text-highlight hover:text-secondary hover:underline"
            href="https://www.bcp.gov.py/meta-de-inflacion"
          >
            Meta de inflación y marco de política monetaria
          </Link>
          ].
        </li>
        <li>
          Banco Central del Paraguay [
          <Link
            className="text-highlight hover:text-secondary hover:underline"
            href="https://www.bcp.gov.py/web/institucional/w/informe-de-inflaci%C3%B3n-diciembre-2025"
          >
            Informe de Inflación (Diciembre 2025): inflación anual 2025 (3,1%)
          </Link>
          ].
        </li>
        <li>
          Fitch Ratings [
          <Link
            className="text-highlight hover:text-secondary hover:underline"
            href="https://www.mef.gov.py/sites/default/files/2025-10/Fitch%20Revises%20Paraguay%27s%20Outlook%20to%20Positive%3B%20Affirms%20at%20%27BB%2B%27.pdf"
          >
            Acción de rating: Outlook Positivo / BB+ (Oct 2025)
          </Link>
          ].
        </li>
        <li>
          Ministerio de Industria y Comercio [
          <Link
            className="text-highlight hover:text-secondary hover:underline"
            href="https://www.mic.gov.py/ley-60-90/"
          >
            Ley 60/90 (régimen de incentivos)
          </Link>
          ].
        </li>
        <li>
          Banco Mundial (World Bank Data) [
          <Link
            className="text-highlight hover:text-secondary hover:underline"
            href="https://data.worldbank.org/indicator/BX.KLT.DINV.CD.WD?locations=PY"
          >
            Indicador de FDI net inflows (Paraguay) (fuentes IMF/UNCTAD +
            nacionales)
          </Link>
          ].
        </li>
        <li>
          UNCTAD [
          <Link
            className="text-highlight hover:text-secondary hover:underline"
            href="https://unctad.org/system/files/official-document/wir2024_en.pdf"
          >
            World Investment Report 2024 (contexto global de IED)
          </Link>
          ].
        </li>
      </ul>
          </div>
        </article>
      </div>
    </div>
  );
}
