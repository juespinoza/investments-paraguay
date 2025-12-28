import { PrismaClient } from "../src/generated/prisma";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // 1️⃣ Advisor
  const advisor = await prisma.advisor.upsert({
    where: { slug: "julia-espinoza" },
    update: {},
    create: {
      slug: "julia-espinoza",
      fullName: "Julia Espinoza",
      headline: "Asesora inmobiliaria & ingeniera informática",
      ctaLabel: "Contactar",
      ctaHref: "https://wa.me/595xxxxxxxx",
    },
  });

  // 2️⃣ LandingAdvisor
  const landing = await prisma.landingAdvisor.upsert({
    where: { advisorId: advisor.id },
    update: {},
    create: {
      advisorId: advisor.id,

      aboutTitle: "Sobre mí",
      aboutDescription:
        "Acompaño procesos de inversión inmobiliaria con foco en análisis, estrategia y visión a largo plazo.",
      aboutParagraph1:
        "Soy ingeniera informática y asesora inmobiliaria, especializada en inversiones conscientes en Paraguay.",
      aboutParagraph2:
        "Trabajo con personas que buscan seguridad, rentabilidad y claridad al invertir.",

      servicesParagraph1:
        "Asesoramiento integral para compra, venta e inversión inmobiliaria.",
      servicesParagraph2:
        "Análisis de rentabilidad, proyección y acompañamiento personalizado.",
    },
  });

  // 3️⃣ Propiedades a destacar (deben existir)
  const properties = await prisma.property.findMany({
    where: {
      slug: {
        in: ["campus-2", "terraza-hit", "hit-1-dormitorio"],
      },
    },
  });

  if (properties.length === 0) {
    console.warn("⚠️ No se encontraron propiedades para destacar");
    return;
  }

  // 4️⃣ Limpiar featured previas
  await prisma.landingAdvisorFeaturedProperty.deleteMany({
    where: { landingId: landing.id },
  });

  // 5️⃣ Insertar featured (máx 3)
  await prisma.landingAdvisorFeaturedProperty.createMany({
    data: properties.slice(0, 3).map((property, index) => ({
      landingId: landing.id,
      propertyId: property.id,
      order: index + 1,
    })),
  });

  console.log("✅ Seed completado correctamente");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
