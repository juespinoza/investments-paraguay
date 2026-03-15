import bcrypt from "bcryptjs";
import { Role } from "@/generated/prisma";
import { prisma } from "@/lib/prisma";

export function normalizeEmail(email: string) {
  return email.toLowerCase().trim();
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 12);
}

export async function ensureBootstrapAdmin(input: {
  email: string;
  password: string;
  name?: string | null;
}) {
  const email = normalizeEmail(input.email);
  if (!email) {
    throw new Error("Bootstrap admin email is required.");
  }
  if (input.password.trim().length < 8) {
    throw new Error("Bootstrap admin password must be at least 8 characters.");
  }

  const password = await hashPassword(input.password);

  return prisma.user.upsert({
    where: { email },
    update: {
      name: input.name?.trim() || null,
      password,
      role: Role.ADMIN,
      inmobiliariaId: null,
      advisorId: null,
      deletedAt: null,
    },
    create: {
      email,
      name: input.name?.trim() || null,
      password,
      role: Role.ADMIN,
    },
    select: {
      id: true,
      email: true,
      role: true,
    },
  });
}
