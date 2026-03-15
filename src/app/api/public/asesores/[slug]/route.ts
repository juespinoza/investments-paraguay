// src/app/api/public/asesores/[slug]/route.ts
import { NextResponse } from "next/server";
import { getPublicAdvisorBySlug } from "@/app/api/virtualoffice/advisors/repo";

type Params = {
  params: Promise<{ slug: string }>;
};

export async function GET(_req: Request, { params }: Params) {
  const { slug } = await params;

  if (!slug || typeof slug !== "string") {
    return NextResponse.json({ error: "Missing slug" }, { status: 400 });
  }

  const advisor = await getPublicAdvisorBySlug(slug);

  if (!advisor) {
    return NextResponse.json(
      { message: "Asesor no encontrado" },
      { status: 404 }
    );
  }

  return NextResponse.json(advisor, {
    headers: {
      "Cache-Control": "public, s-maxage=300, stale-while-revalidate=3600",
    },
  });
}
