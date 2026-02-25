// src/app/api/virtualoffice/advisors/repo.ts
export type Advisor = {
  id: string;
  fullName: string;
  slug: string;
  phone?: string | null;
  whatsapp?: string | null;
  instagram?: string | null;
  headline?: string | null;
  createdAt?: Date | string;
};

export async function listAdvisors(): Promise<Advisor[]> {
  // TODO: Reemplazar por tu capa real (Prisma / fetch / service)
  // return prisma.advisor.findMany({ orderBy: { createdAt: "desc" } });

  return [];
}

export async function getAdvisorById(id: string): Promise<Advisor | null> {
  // TODO
  return null;
}

export async function upsertAdvisor(input: {
  id?: string;
  fullName: string;
  slug: string;
  phone?: string | null;
  whatsapp?: string | null;
  instagram?: string | null;
  headline?: string | null;
}): Promise<{ ok: true; id: string } | { ok: false; error: string }> {
  // TODO: validaciones/DB
  // if (input.id) update else create

  return { ok: true, id: input.id ?? "new-id" };
}

export async function deleteAdvisorById(
  id: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  // TODO
  return { ok: true };
}

export async function softDeleteAdvisor(id: string): Promise<void> {
  // TODO: implement soft delete logic
}

export async function createAdvisor(
  data: Omit<Advisor, "id" | "createdAt">,
): Promise<Advisor> {
  // TODO: implement create advisor logic
  return { ...data, id: "new-id", createdAt: new Date() };
}

export async function updateAdvisor(
  id: string,
  data: Omit<Advisor, "id" | "createdAt">,
): Promise<Advisor> {
  // TODO: implement update advisor logic
  return { ...data, id, createdAt: new Date() };
}
