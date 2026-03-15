/* eslint-disable @typescript-eslint/no-require-imports */
const bcrypt = require("bcryptjs");
const { PrismaClient, Role } = require("../src/generated/prisma");
const { PrismaNeon } = require("@prisma/adapter-neon");

function parseArgs(argv) {
  const args = {};

  for (let index = 0; index < argv.length; index += 1) {
    const current = argv[index];
    const next = argv[index + 1];

    if (current === "--email" && next) {
      args.email = next;
      index += 1;
      continue;
    }

    if (current === "--password" && next) {
      args.password = next;
      index += 1;
      continue;
    }

    if (current === "--name" && next) {
      args.name = next;
      index += 1;
    }
  }

  return args;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const email = (args.email || process.env.BOOTSTRAP_ADMIN_EMAIL || "").trim().toLowerCase();
  const password = args.password || process.env.BOOTSTRAP_ADMIN_PASSWORD || "";
  const name = (args.name || process.env.BOOTSTRAP_ADMIN_NAME || "Admin").trim();

  if (!email || !password) {
    throw new Error(
      "Usage: yarn bootstrap:admin --email admin@example.com --password your-password [--name \"Admin\"]",
    );
  }

  if (password.trim().length < 8) {
    throw new Error("Bootstrap admin password must be at least 8 characters.");
  }

  const prisma = new PrismaClient({
    adapter: new PrismaNeon({
      connectionString: process.env.DATABASE_URL,
    }),
  });

  try {
    const passwordHash = await bcrypt.hash(password, 12);

    const user = await prisma.user.upsert({
      where: { email },
      update: {
        name: name || null,
        password: passwordHash,
        role: Role.ADMIN,
        inmobiliariaId: null,
        advisorId: null,
        deletedAt: null,
      },
      create: {
        email,
        name: name || null,
        password: passwordHash,
        role: Role.ADMIN,
      },
      select: {
        id: true,
        email: true,
        role: true,
      },
    });

    console.log(`Bootstrap admin ready: ${user.email} (${user.id})`);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
