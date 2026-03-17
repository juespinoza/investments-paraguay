import "server-only";

import { Prisma } from "@/generated/prisma";
import { prisma } from "@/lib/prisma";

type DbClient = Prisma.TransactionClient | typeof prisma;

export async function syncAdvisorTenantAssignments(
  db: DbClient,
  advisorId: string,
  inmobiliariaId: string | null,
) {
  await Promise.all([
    db.user.updateMany({
      where: { advisorId, deletedAt: null },
      data: { inmobiliariaId },
    }),
    db.property.updateMany({
      where: { advisorId, deletedAt: null },
      data: { inmobiliariaId },
    }),
    db.blogPost.updateMany({
      where: { advisorId, deletedAt: null },
      data: { inmobiliariaId },
    }),
  ]);
}

export async function countInmobiliariaDependencies(
  db: DbClient,
  inmobiliariaId: string,
) {
  const [users, advisors, properties, blogs] = await Promise.all([
    db.user.count({
      where: { inmobiliariaId, deletedAt: null },
    }),
    db.advisor.count({
      where: { inmobiliariaId, deletedAt: null },
    }),
    db.property.count({
      where: { inmobiliariaId, deletedAt: null },
    }),
    db.blogPost.count({
      where: { inmobiliariaId, deletedAt: null },
    }),
  ]);

  return { users, advisors, properties, blogs };
}
