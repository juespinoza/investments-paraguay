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

async function main() {
  await seedPropertyTypes();
  console.log(`Seed completado: ${propertyTypes.length} tipos de propiedad.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
