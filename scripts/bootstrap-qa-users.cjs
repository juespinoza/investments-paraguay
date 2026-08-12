/* eslint-disable @typescript-eslint/no-require-imports */
const bcrypt = require("bcryptjs");
const { PrismaClient, Role } = require("../src/generated/prisma");
const { PrismaNeon } = require("@prisma/adapter-neon");

const DEFAULTS = {
  admin: {
    email: "qa.admin@investments.local",
    password: "QaAdmin123!",
    name: "QA Admin",
  },
  inmobiliaria: {
    email: "qa.inmobiliaria@investments.local",
    password: "QaInmo123!",
    name: "QA Inmobiliaria",
    inmobiliariaName: "QA Inmobiliaria",
    inmobiliariaSlug: "qa-inmobiliaria",
  },
  asesor: {
    email: "qa.asesor@investments.local",
    password: "QaAsesor123!",
    name: "QA Asesor",
    advisorName: "QA Asesor",
    advisorSlug: "qa-asesor",
  },
  bloguero: {
    email: "qa.bloguero@investments.local",
    password: "QaBlog123!",
    name: "QA Bloguero",
  },
};

function envValue(name, fallback) {
  const value = process.env[name];
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : fallback;
}

async function upsertUser(prisma, input) {
  const passwordHash = await bcrypt.hash(input.password, 12);

  return prisma.user.upsert({
    where: { email: input.email.toLowerCase() },
    update: {
      name: input.name || null,
      password: passwordHash,
      role: input.role,
      inmobiliariaId: input.inmobiliariaId ?? null,
      advisorId: input.advisorId ?? null,
      deletedAt: null,
    },
    create: {
      email: input.email.toLowerCase(),
      name: input.name || null,
      password: passwordHash,
      role: input.role,
      inmobiliariaId: input.inmobiliariaId ?? null,
      advisorId: input.advisorId ?? null,
    },
    select: {
      id: true,
      email: true,
      role: true,
    },
  });
}

async function main() {
  const prisma = new PrismaClient({
    adapter: new PrismaNeon({
      connectionString: process.env.DATABASE_URL,
    }),
  });

  try {
    const inmobiliariaSlug = envValue(
      "QA_INMOBILIARIA_SLUG",
      DEFAULTS.inmobiliaria.inmobiliariaSlug,
    );
    const advisorSlug = envValue("QA_ASESOR_SLUG", DEFAULTS.asesor.advisorSlug);

    const inmobiliaria = await prisma.inmobiliaria.upsert({
      where: { slug: inmobiliariaSlug },
      update: {
        name: envValue(
          "QA_INMOBILIARIA_NAME",
          DEFAULTS.inmobiliaria.inmobiliariaName,
        ),
        deletedAt: null,
      },
      create: {
        slug: inmobiliariaSlug,
        name: envValue(
          "QA_INMOBILIARIA_NAME",
          DEFAULTS.inmobiliaria.inmobiliariaName,
        ),
      },
      select: {
        id: true,
        slug: true,
      },
    });

    const advisor = await prisma.advisor.upsert({
      where: { slug: advisorSlug },
      update: {
        fullName: envValue("QA_ASESOR_NAME", DEFAULTS.asesor.advisorName),
        inmobiliariaId: inmobiliaria.id,
        deletedAt: null,
      },
      create: {
        slug: advisorSlug,
        fullName: envValue("QA_ASESOR_NAME", DEFAULTS.asesor.advisorName),
        inmobiliariaId: inmobiliaria.id,
      },
      select: {
        id: true,
        slug: true,
      },
    });

    const admin = await upsertUser(prisma, {
      email: envValue("QA_ADMIN_EMAIL", DEFAULTS.admin.email),
      password: envValue("QA_ADMIN_PASSWORD", DEFAULTS.admin.password),
      name: envValue("QA_ADMIN_NAME", DEFAULTS.admin.name),
      role: Role.ADMIN,
    });

    const inmobiliariaUser = await upsertUser(prisma, {
      email: envValue("QA_INMOBILIARIA_EMAIL", DEFAULTS.inmobiliaria.email),
      password: envValue("QA_INMOBILIARIA_PASSWORD", DEFAULTS.inmobiliaria.password),
      name: envValue("QA_INMOBILIARIA_USER_NAME", DEFAULTS.inmobiliaria.name),
      role: Role.INMOBILIARIA,
      inmobiliariaId: inmobiliaria.id,
    });

    const asesorUser = await upsertUser(prisma, {
      email: envValue("QA_ASESOR_EMAIL", DEFAULTS.asesor.email),
      password: envValue("QA_ASESOR_PASSWORD", DEFAULTS.asesor.password),
      name: envValue("QA_ASESOR_USER_NAME", DEFAULTS.asesor.name),
      role: Role.ASESOR,
      inmobiliariaId: inmobiliaria.id,
      advisorId: advisor.id,
    });

    const bloguero = await upsertUser(prisma, {
      email: envValue("QA_BLOGUERO_EMAIL", DEFAULTS.bloguero.email),
      password: envValue("QA_BLOGUERO_PASSWORD", DEFAULTS.bloguero.password),
      name: envValue("QA_BLOGUERO_NAME", DEFAULTS.bloguero.name),
      role: Role.BLOGUERO,
    });

    console.log("QA bootstrap ready");
    console.log(`ADMIN: ${admin.email}`);
    console.log(`INMOBILIARIA: ${inmobiliariaUser.email} -> ${inmobiliaria.slug}`);
    console.log(`ASESOR: ${asesorUser.email} -> ${advisor.slug}`);
    console.log(`BLOGUERO: ${bloguero.email}`);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
