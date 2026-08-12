/* eslint-disable @typescript-eslint/no-require-imports */
const { PrismaClient, Role } = require("../src/generated/prisma");
const { PrismaNeon } = require("@prisma/adapter-neon");

function resolveBlogOwnership(post) {
  switch (post.authorRole) {
    case Role.ADMIN:
      return { ownerType: "ADMIN", ownerId: null };
    case Role.INMOBILIARIA:
      return {
        ownerType: "INMOBILIARIA",
        ownerId: post.inmobiliariaId ?? null,
      };
    case Role.ASESOR:
      return {
        ownerType: "ADVISOR",
        ownerId: post.advisorId ?? null,
      };
    case Role.BLOGUERO:
      return { ownerType: "BLOGGER", ownerId: null };
    default:
      return { ownerType: null, ownerId: null };
  }
}

async function main() {
  const prisma = new PrismaClient({
    adapter: new PrismaNeon({
      connectionString: process.env.DATABASE_URL,
    }),
  });

  try {
    const inmobiliarias = await prisma.inmobiliaria.findMany({
      where: { deletedAt: null },
      select: {
        id: true,
        themeJson: true,
        landing: {
          select: { id: true, themeJson: true, deletedAt: true },
        },
      },
    });

    let createdLandings = 0;
    let updatedLandings = 0;

    for (const inmobiliaria of inmobiliarias) {
      if (!inmobiliaria.themeJson) continue;

      if (!inmobiliaria.landing) {
        await prisma.inmobiliariaLanding.create({
          data: {
            inmobiliariaId: inmobiliaria.id,
            themeJson: inmobiliaria.themeJson,
          },
        });
        createdLandings += 1;
        continue;
      }

      if (
        inmobiliaria.landing.deletedAt ||
        JSON.stringify(inmobiliaria.landing.themeJson) !==
          JSON.stringify(inmobiliaria.themeJson)
      ) {
        await prisma.inmobiliariaLanding.update({
          where: { inmobiliariaId: inmobiliaria.id },
          data: {
            themeJson: inmobiliaria.themeJson,
            deletedAt: null,
          },
        });
        updatedLandings += 1;
      }
    }

    const posts = await prisma.blogPost.findMany({
      where: {
        OR: [{ ownerType: null }, { ownerId: null }],
        deletedAt: null,
      },
      select: {
        id: true,
        authorRole: true,
        advisorId: true,
        inmobiliariaId: true,
        ownerType: true,
        ownerId: true,
      },
    });

    let updatedPosts = 0;
    let unresolvedAdminOrBloggerPosts = 0;

    for (const post of posts) {
      const ownership = resolveBlogOwnership(post);
      if (!ownership.ownerType) continue;

      if (
        (ownership.ownerType === "ADMIN" || ownership.ownerType === "BLOGGER") &&
        ownership.ownerId === null
      ) {
        unresolvedAdminOrBloggerPosts += 1;
      }

      await prisma.blogPost.update({
        where: { id: post.id },
        data: {
          ownerType: ownership.ownerType,
          ownerId: ownership.ownerId,
        },
      });
      updatedPosts += 1;
    }

    console.log("Phase 9 backfill complete");
    console.log(`Inmobiliaria landings created: ${createdLandings}`);
    console.log(`Inmobiliaria landings updated: ${updatedLandings}`);
    console.log(`Blog posts updated: ${updatedPosts}`);
    if (unresolvedAdminOrBloggerPosts > 0) {
      console.log(
        `Blog posts with ADMIN/BLOGGER ownership and ownerId unresolved: ${unresolvedAdminOrBloggerPosts}`,
      );
    }
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
