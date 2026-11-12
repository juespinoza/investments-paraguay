import "server-only";
import { NextResponse } from "next/server";
import { StrategyInputSchema } from "@/lib/properties/strategy";
import {
  getStrategy,
  StrategyError,
  upsertStrategy,
} from "@/lib/properties/strategy-service";
import { errorResponse } from "@/lib/publisher/http";

// Lógica común de GET/PUT de estrategias, una vez resuelta la propiedad
// (por origen + id externo o por slug).

export async function strategyGet(propertyId: string) {
  const strategy = await getStrategy(propertyId);
  return NextResponse.json({ strategy });
}

export async function strategyPut(req: Request, propertyId: string) {
  const body = await req.json().catch(() => null);
  const parsed = StrategyInputSchema.safeParse(body);
  if (!parsed.success) {
    return errorResponse(
      422,
      "invalid_payload",
      "El cuerpo no cumple el contrato de estrategia.",
      parsed.error.flatten(),
    );
  }

  try {
    const strategy = await upsertStrategy(propertyId, parsed.data);
    return NextResponse.json({ strategy });
  } catch (error) {
    if (error instanceof StrategyError) {
      return errorResponse(error.status, error.code, error.message, error.details);
    }
    console.error("[publisher-api:strategy]", error);
    return errorResponse(500, "internal_error", "Error inesperado al guardar la estrategia.");
  }
}
