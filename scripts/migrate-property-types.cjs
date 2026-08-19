/* eslint-disable @typescript-eslint/no-require-imports */
const { PrismaClient } = require("../src/generated/prisma");
const { PrismaNeon } = require("@prisma/adapter-neon");

const PROPERTY_TYPES = [
  ["CASA_DUPLEX", "Casa/Dúplex", false, true],
  ["DEPARTAMENTO", "Departamento", false, true],
  ["TERRENO_LOTE", "Terreno/Lote", false, false],
  ["RURAL_CHACRA", "Rural/Chacra", false, false],
  ["QUINTA", "Quinta", false, true],
  ["LOCAL_COMERCIAL", "Local comercial", false, true],
  ["DEPOSITO", "Depósito", false, true],
  ["OFICINA", "Oficina", false, true],
  ["GALPON_INDUSTRIAL", "Galpón industrial", false, false],
  ["EDIFICIO_DEPARTAMENTOS", "Edificio de departamentos", true, false],
  ["EDIFICIO_OFICINAS", "Edificio de oficinas", true, false],
  ["EDIFICIO_COMERCIAL", "Edificio comercial", true, false],
  ["LOTEAMIENTO", "Loteamiento", true, false],
  ["COMPLEJO_CASAS_DUPLEX", "Complejo de casas/dúplex", true, false],
];

const APPLY = process.argv.includes("--apply");

function normalize(value) {
  return (value || "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function includesAny(value, candidates) {
  return candidates.some((candidate) => value.includes(candidate));
}

function inferPropertyTypeCode(value) {
  const normalized = normalize(value);
  if (!normalized) return null;

  if (
    normalized.includes("complejo") &&
    includesAny(normalized, ["casa", "duplex"])
  ) {
    return "COMPLEJO_CASAS_DUPLEX";
  }
  if (
    normalized.includes("edificio") &&
    includesAny(normalized, ["departamento", "depto", "apartamento"])
  ) {
    return "EDIFICIO_DEPARTAMENTOS";
  }
  if (normalized.includes("edificio") && normalized.includes("oficina")) {
    return "EDIFICIO_OFICINAS";
  }
  if (normalized.includes("edificio") && normalized.includes("comercial")) {
    return "EDIFICIO_COMERCIAL";
  }
  if (normalized.includes("loteamiento")) return "LOTEAMIENTO";
  if (includesAny(normalized, ["galpon", "industrial"])) {
    return "GALPON_INDUSTRIAL";
  }
  if (normalized.includes("local")) return "LOCAL_COMERCIAL";
  if (normalized.includes("oficina")) return "OFICINA";
  if (normalized.includes("proyecto")) return "EDIFICIO_DEPARTAMENTOS";
  if (includesAny(normalized, ["quinta"])) return "QUINTA";
  if (includesAny(normalized, ["rural", "campo", "estancia", "chacra"]))
    return "RURAL_CHACRA";
  if (includesAny(normalized, ["terreno", "lote"])) return "TERRENO_LOTE";
  if (includesAny(normalized, ["casa", "duplex"])) return "CASA_DUPLEX";
  if (
    includesAny(normalized, [
      "departamento",
      "depto",
      "apartamento",
      "loft",
      "apart-hotel",
      "aparthotel",
    ])
  ) {
    return "DEPARTAMENTO";
  }

  return null;
}

function propertyTypeIdFromCode(code) {
  return `pt_${code.toLowerCase()}`;
}

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

async function tableExists(prisma, tableName) {
  const rows = await prisma.$queryRawUnsafe(
    `
      SELECT 1
      FROM information_schema.tables
      WHERE table_schema = 'public'
        AND table_name = $1
      LIMIT 1
    `,
    tableName,
  );

  return rows.length > 0;
}

async function seedCatalog(tx) {
  for (const [
    code,
    label,
    isProject,
    hasResidentialDetails,
  ] of PROPERTY_TYPES) {
    await tx.$executeRawUnsafe(
      `
        INSERT INTO "PropertyType" (
          "id",
          "code",
          "label",
          "isProject",
          "hasResidentialDetails",
          "isActive",
          "createdAt",
          "updatedAt"
        )
        VALUES ($1, $2, $3, $4, $5, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        ON CONFLICT ("code") DO UPDATE SET
          "label" = EXCLUDED."label",
          "isProject" = EXCLUDED."isProject",
          "hasResidentialDetails" = EXCLUDED."hasResidentialDetails",
          "isActive" = true,
          "updatedAt" = CURRENT_TIMESTAMP
      `,
      propertyTypeIdFromCode(code),
      code,
      label,
      isProject,
      hasResidentialDetails,
    );
  }
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
    const hasLegacyColumn = await columnExists(
      prisma,
      "Property",
      "propertyType",
    );
    if (!hasLegacyColumn) {
      throw new Error('Legacy column "Property"."propertyType" was not found.');
    }

    const properties = await prisma.$queryRawUnsafe(`
      SELECT "id", "slug", "title", "propertyType"
      FROM "Property"
      ORDER BY "createdAt" ASC
    `);

    const mapped = [];
    const unmatched = [];

    for (const property of properties) {
      const code = inferPropertyTypeCode(property.propertyType);
      if (!code) {
        unmatched.push(property);
        continue;
      }

      mapped.push({
        ...property,
        code,
        propertyTypeId: propertyTypeIdFromCode(code),
      });
    }

    console.log(`Propiedades analizadas: ${properties.length}`);
    console.log(`Matcheadas: ${mapped.length}`);
    console.log(`Sin match: ${unmatched.length}`);

    if (mapped.length) {
      console.table(
        mapped.map((property) => ({
          slug: property.slug,
          propertyType: property.propertyType,
          code: property.code,
        })),
      );
    }

    if (unmatched.length) {
      console.table(
        unmatched.map((property) => ({
          id: property.id,
          slug: property.slug,
          title: property.title,
          propertyType: property.propertyType,
        })),
      );
      throw new Error(
        "Hay Property.propertyType sin match. Agregá mappings explícitos antes de aplicar.",
      );
    }

    if (!APPLY) {
      console.log(
        "Dry run completo. Para escribir propertyTypeId, ejecutá con --apply.",
      );
      return;
    }

    const hasCatalogTable = await tableExists(prisma, "PropertyType");
    const hasNewColumn = await columnExists(
      prisma,
      "Property",
      "propertyTypeId",
    );
    if (!hasCatalogTable || !hasNewColumn) {
      throw new Error(
        'Para --apply deben existir la tabla "PropertyType" y la columna "Property"."propertyTypeId".',
      );
    }

    await prisma.$transaction(async (tx) => {
      await seedCatalog(tx);

      for (const property of mapped) {
        await tx.$executeRawUnsafe(
          'UPDATE "Property" SET "propertyTypeId" = $1 WHERE "id" = $2',
          property.propertyTypeId,
          property.id,
        );
      }
    });

    console.log(
      `Migración de datos completada: ${mapped.length} propiedades actualizadas.`,
    );
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
