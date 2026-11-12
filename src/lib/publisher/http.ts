import { NextResponse } from "next/server";
import { readBearerToken, tokensMatch } from "@/lib/publisher/core";

// Respuestas y autenticación compartidas por los endpoints del publicador.

export function errorResponse(
  status: number,
  code: string,
  message: string,
  details?: unknown,
) {
  return NextResponse.json(
    { error: { code, message, ...(details !== undefined ? { details } : {}) } },
    { status },
  );
}

export function authorize(req: Request) {
  const expected = process.env.PUBLISHER_API_KEY?.trim();
  // Sin clave configurada la API queda cerrada, nunca abierta.
  if (!expected) {
    return errorResponse(503, "not_configured", "La API del publicador no está configurada.");
  }
  if (!tokensMatch(readBearerToken(req.headers.get("authorization")), expected)) {
    return errorResponse(401, "unauthorized", "Token inválido o ausente.");
  }
  return null;
}
