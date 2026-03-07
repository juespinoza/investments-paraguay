import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { listLeads } from "@/lib/leads/repo";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getSession();
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (session.role === "ADMIN") {
    const leads = await listLeads();
    return NextResponse.json({ items: leads });
  }

  const advisors = await prisma.advisor.findMany({
    where: {
      deletedAt: null,
      ...(session.role === "ASESOR"
        ? { id: session.advisorId ?? "__none__" }
        : { inmobiliariaId: session.inmobiliariaId ?? "__none__" }),
    },
    select: { slug: true },
  });

  const advisorSlugs = advisors.map((a) => a.slug);
  const leads = await listLeads({
    advisorSlugs,
  });
  return NextResponse.json({ items: leads });
}
