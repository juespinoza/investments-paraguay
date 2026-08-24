import { PrismaClient } from "../src/generated/prisma";
import { PrismaNeon } from "@prisma/adapter-neon";

const propertyTypes = [
  {
    code: "CASA_DUPLEX",
    label: "Casa/Dúplex",
    isProject: false,
    hasResidentialDetails: true,
  },
  {
    code: "DEPARTAMENTO",
    label: "Departamento",
    isProject: false,
    hasResidentialDetails: true,
  },
  {
    code: "TERRENO_LOTE",
    label: "Terreno/Lote",
    isProject: false,
    hasResidentialDetails: false,
  },
  {
    code: "RURAL_CHACRA",
    label: "Rural/Chacra",
    isProject: false,
    hasResidentialDetails: false,
  },
  {
    code: "QUINTA",
    label: "Quinta",
    isProject: false,
    hasResidentialDetails: true,
  },
  {
    code: "LOCAL_COMERCIAL",
    label: "Local comercial",
    isProject: false,
    hasResidentialDetails: true,
  },
  {
    code: "DEPOSITO",
    label: "Depósito",
    isProject: false,
    hasResidentialDetails: true,
  },
  {
    code: "OFICINA",
    label: "Oficina",
    isProject: false,
    hasResidentialDetails: true,
  },
  {
    code: "GALPON_INDUSTRIAL",
    label: "Galpón industrial",
    isProject: false,
    hasResidentialDetails: false,
  },
  {
    code: "EDIFICIO_DEPARTAMENTOS",
    label: "Edificio de departamentos",
    isProject: true,
    hasResidentialDetails: false,
  },
  {
    code: "EDIFICIO_OFICINAS",
    label: "Edificio de oficinas",
    isProject: true,
    hasResidentialDetails: false,
  },
  {
    code: "EDIFICIO_COMERCIAL",
    label: "Edificio comercial",
    isProject: true,
    hasResidentialDetails: false,
  },
  {
    code: "LOTEAMIENTO",
    label: "Loteamiento",
    isProject: true,
    hasResidentialDetails: false,
  },
  {
    code: "COMPLEJO_CASAS_DUPLEX",
    label: "Complejo de casas/dúplex",
    isProject: true,
    hasResidentialDetails: false,
  },
] as const;

const equipmentFeatures = [
  { code: "AIRE_ACONDICIONADO", label: "Aire acondicionado" },
  { code: "VENTILADOR", label: "Ventilador" },
  { code: "ANAFE", label: "Anafe" },
  { code: "EXTRACTOR_COCINA", label: "Extractor de cocina" },
  { code: "CALEFON", label: "Calefón" },
  { code: "HORNO", label: "Horno" },
  { code: "GRIFERIA", label: "Grifería" },
  { code: "PLACARES", label: "Placares" },
  { code: "MAMPARA_BANO", label: "Mampara de baño" },
] as const;

const prisma = new PrismaClient({
  adapter: new PrismaNeon({
    connectionString: process.env.DATABASE_URL!,
  }),
});

async function seedPropertyTypes() {
  await Promise.all(
    propertyTypes.map((propertyType) =>
      prisma.propertyType.upsert({
        where: { code: propertyType.code },
        update: {
          label: propertyType.label,
          isProject: propertyType.isProject,
          hasResidentialDetails: propertyType.hasResidentialDetails,
          isActive: true,
        },
        create: {
          code: propertyType.code,
          label: propertyType.label,
          isProject: propertyType.isProject,
          hasResidentialDetails: propertyType.hasResidentialDetails,
        },
      }),
    ),
  );
}

async function seedEquipmentFeatures() {
  await Promise.all(
    equipmentFeatures.map((feature) =>
      prisma.feature.upsert({
        where: {
          category_code: {
            category: "EQUIPMENT",
            code: feature.code,
          },
        },
        update: {
          label: feature.label,
          isActive: true,
        },
        create: {
          category: "EQUIPMENT",
          code: feature.code,
          label: feature.label,
        },
      }),
    ),
  );
}

async function main() {
  await seedPropertyTypes();
  await seedEquipmentFeatures();
  console.log(
    `Seed completado: ${propertyTypes.length} tipos de propiedad y ${equipmentFeatures.length} equipamientos.`,
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
