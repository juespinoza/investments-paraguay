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
  { category: "EQUIPMENT", code: "AIRE_ACONDICIONADO", label: "Aire acondicionado" },
  { category: "EQUIPMENT", code: "VENTILADOR", label: "Ventilador" },
  { category: "EQUIPMENT", code: "ANAFE", label: "Anafe" },
  { category: "EQUIPMENT", code: "EXTRACTOR_COCINA", label: "Extractor de cocina" },
  { category: "EQUIPMENT", code: "CALEFON", label: "Calefón" },
  { category: "EQUIPMENT", code: "HORNO", label: "Horno" },
  { category: "EQUIPMENT", code: "GRIFERIA", label: "Grifería" },
  { category: "EQUIPMENT", code: "PLACARES", label: "Placares" },
  { category: "EQUIPMENT", code: "MAMPARA_BANO", label: "Mampara de baño" },
  { category: "AMENITY", code: "PISCINA", label: "Piscina" },
  { category: "AMENITY", code: "COWORKING", label: "Coworking" },
  { category: "AMENITY", code: "LAVANDERIA", label: "Lavandería" },
  { category: "AMENITY", code: "GIMNASIO", label: "Gimnasio" },
  { category: "AMENITY", code: "SOLARIUM", label: "Solarium" },
  { category: "AMENITY", code: "QUINCHO_TECHADO", label: "Quincho techado" },
  { category: "AMENITY", code: "QUINCHO_AIRE_LIBRE", label: "Quincho al aire libre" },
  { category: "SECURITY", code: "CONSERJERIA_24_7", label: "Conserjería 24/7" },
  { category: "SECURITY", code: "CAMARAS", label: "Cámaras" },
  { category: "SECURITY", code: "CONTROL_ACCESO", label: "Control de acceso" },
  { category: "GENERAL_SERVICE", code: "FIBRA_OPTICA", label: "Fibra óptica" },
  { category: "GENERAL_SERVICE", code: "TIPO_ENERGIA", label: "Tipo de energía" },
  { category: "GENERAL_SERVICE", code: "GENERADOR_EMERGENCIA", label: "Generador de emergencia" },
  { category: "GENERAL_SERVICE", code: "ADMINISTRACION_PROPIA", label: "Administración propia" },
  { category: "PAYMENT_METHOD", code: "EFECTIVO", label: "Efectivo" },
  { category: "PAYMENT_METHOD", code: "TARJETA_DEBITO", label: "Tarjeta de débito" },
  { category: "PAYMENT_METHOD", code: "TARJETA_CREDITO", label: "Tarjeta de crédito" },
  { category: "PAYMENT_METHOD", code: "TRANSFERENCIA_NACIONAL", label: "Transferencia nacional" },
  { category: "PAYMENT_METHOD", code: "TRANSFERENCIA_INTERNACIONAL", label: "Transferencia internacional" },
  { category: "PAYMENT_METHOD", code: "BILLETERA_DIGITAL", label: "Billetera digital" },
  { category: "PAYMENT_METHOD", code: "CRIPTOMONEDA", label: "Criptomoneda" },
  { category: "FINANCING_TYPE", code: "PROPIA", label: "Propia" },
  { category: "FINANCING_TYPE", code: "VIA_BANCO", label: "Vía banco" },
  { category: "FINANCING_TYPE", code: "CHE_ROPA_PORA", label: "Che Róga Porã" },
  { category: "FINANCING_TYPE", code: "AFD", label: "AFD" },
  { category: "REQUIRED_DOCUMENT", code: "ID", label: "Documento de identidad" },
  { category: "REQUIRED_DOCUMENT", code: "COMPROBANTE_INGRESOS", label: "Comprobante de ingresos" },
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

async function seedFeatures() {
  await Promise.all(
    equipmentFeatures.map((feature) =>
      prisma.feature.upsert({
        where: {
          category_code: {
            category: feature.category,
            code: feature.code,
          },
        },
        update: {
          label: feature.label,
          isActive: true,
        },
        create: {
          category: feature.category,
          code: feature.code,
          label: feature.label,
        },
      }),
    ),
  );
}

async function main() {
  await seedPropertyTypes();
  await seedFeatures();
  console.log(
    `Seed completado: ${propertyTypes.length} tipos de propiedad y ${equipmentFeatures.length} features.`,
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
