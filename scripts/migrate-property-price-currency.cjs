/* eslint-disable @typescript-eslint/no-require-imports */
const { PrismaClient } = require("../src/generated/prisma");
const { PrismaNeon } = require("@prisma/adapter-neon");

const APPLY = process.argv.includes("--apply");

async function columnExists(prisma, tableName, columnName) {
  const rows = await prisma.$queryRawUnsafe(
    `
      SELECT 1
      FROM information_schema.columns
      WHERE table_schema = 'public'
        AND table_name = $1
        AND column_name = $2
      LIMIT 1
    `,
    tableName,
    columnName,
  );

  return rows.length > 0;
}

async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is required.");
  }

  const prisma = new PrismaClient({
    adapter: new PrismaNeon({
      connectionString: process.env.DATABASE_URL,
    }),
  });

  try {
    const hasPriceUsd = await columnExists(prisma, "Property", "priceUsd");
    const hasPrice = await columnExists(prisma, "Property", "price");
    const hasCurrency = await columnExists(prisma, "Property", "currency");

    if (!hasPriceUsd && !hasPrice) {
      throw new Error('Neither "Property"."priceUsd" nor "Property"."price" exists.');
    }

    if (hasPriceUsd) {
      const rows = await prisma.$queryRawUnsafe(`
        SELECT "id", "slug", "title", "priceUsd"
        FROM "Property"
        ORDER BY "createdAt" ASC
      `);

      console.log(`Propiedades analizadas: ${rows.length}`);
      console.table(
        rows.map((property) => ({
          id: property.id,
          slug: property.slug,
          priceUsd: property.priceUsd,
          nextPrice: property.priceUsd,
          nextCurrency: "USD",
        })),
      );

      if (!APPLY) {
        console.log(
          "Dry run completo. La migración SQL renombra priceUsd a price y agrega currency=USD.",
        );
        return;
      }

      if (!hasPrice || !hasCurrency) {
        throw new Error(
          'Para --apply deben existir las columnas "Property"."price" y "Property"."currency".',
        );
      }

      await prisma.$executeRawUnsafe(`
        UPDATE "Property"
        SET "price" = "priceUsd"::DECIMAL(14, 2),
            "currency" = 'USD'
      `);
      console.log(`Migración de price/currency completada: ${rows.length} propiedades.`);
      return;
    }

    const rows = await prisma.$queryRawUnsafe(`
      SELECT "id", "slug", "title", "price", "currency"
      FROM "Property"
      ORDER BY "createdAt" ASC
    `);

    console.log(`La columna priceUsd ya no existe. Estado actual: ${rows.length} propiedades.`);
    console.table(
      rows.map((property) => ({
        id: property.id,
        slug: property.slug,
        price: property.price,
        currency: property.currency,
      })),
    );
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
