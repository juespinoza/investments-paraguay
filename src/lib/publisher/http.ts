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

// Alcances:
// - "publisher": crear, editar y retirar propiedades. Solo PUBLISHER_API_KEY.
// - "content": estrategias y traducciones. PUBLISHER_API_KEY o
//   CONTENT_API_KEY, una clave aparte para quien prepara contenido, que no
//   puede tocar las propiedades y se puede revocar sin afectar al publicador.
export type ApiScope = "publisher" | "content";

export function authorize(req: Request, scope: ApiScope = "publisher") {
  const publisherKey = process.env.PUBLISHER_API_KEY?.trim();
  const contentKey = process.env.CONTENT_API_KEY?.trim();
  const accepted = [publisherKey, scope === "content" ? contentKey : undefined]
    .filter((key): key is string => Boolean(key));

  // Sin claves configuradas la API queda cerrada, nunca abierta.
  if (!accepted.length) {
    return errorResponse(503, "not_configured", "La API del publicador no está configurada.");
  }

  const token = readBearerToken(req.headers.get("authorization"));
  if (!accepted.some((key) => tokensMatch(token, key))) {
    return errorResponse(401, "unauthorized", "Token inválido o ausente.");
  }
  return null;
}
