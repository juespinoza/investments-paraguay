import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { readBearerToken, tokensMatch } from "@/lib/publisher/core";

// Catálogo de tipos para que el publicador mapee los suyos a propertyTypeCode.
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const expected = process.env.PUBLISHER_API_KEY?.trim();
  if (!expected) {
    return NextResponse.json(
      { error: { code: "not_configured", message: "La API del publicador no está configurada." } },
      { status: 503 },
    );
  }
  if (!tokensMatch(readBearerToken(req.headers.get("authorization")), expected)) {
    return NextResponse.json(
      { error: { code: "unauthorized", message: "Token inválido o ausente." } },
      { status: 401 },
    );
  }

  const types = await prisma.propertyType.findMany({
    where: { isActive: true },
    select: { code: true, label: true, isProject: true, hasResidentialDetails: true },
    orderBy: { label: "asc" },
  });

  return NextResponse.json({ propertyTypes: types });
}
