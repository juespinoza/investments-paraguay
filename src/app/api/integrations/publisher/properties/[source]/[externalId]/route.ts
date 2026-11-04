import { NextResponse } from "next/server";
import {
  isValidExternalId,
  isValidSource,
  readBearerToken,
  tokensMatch,
} from "@/lib/publisher/core";
import { PublisherPropertySchema } from "@/lib/publisher/schema";
import {
  findPublisherProperty,
  describeProperty,
  PublisherError,
  retirePublisherProperty,
  upsertPublisherProperty,
} from "@/lib/publisher/service";
import { CloudinaryConfigError } from "@/lib/publisher/images";

// API para el publicador de propiedades. Contrato en src/lib/publisher/README.md.
export const dynamic = "force-dynamic";
export const maxDuration = 60;

type Params = { params: Promise<{ source: string; externalId: string }> };

function errorResponse(status: number, code: string, message: string, details?: unknown) {
  return NextResponse.json(
    { error: { code, message, ...(details !== undefined ? { details } : {}) } },
    { status },
  );
}

function authorize(req: Request) {
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

async function readTarget(params: Params["params"]) {
  const { source, externalId } = await params;
  const decodedId = decodeURIComponent(externalId);
  if (!isValidSource(source) || !isValidExternalId(decodedId)) {
    return {
      error: errorResponse(
        400,
        "invalid_target",
        "source debe ser [a-z0-9-] (2–40) y externalId [A-Za-z0-9._-] (1–100).",
      ),
    };
  }
  return { source, externalId: decodedId };
}

function handleError(error: unknown) {
  if (error instanceof PublisherError) {
    return errorResponse(error.status, error.code, error.message, error.details);
  }
  if (error instanceof CloudinaryConfigError) {
    return errorResponse(503, "images_not_configured", error.message);
  }
  console.error("[publisher-api]", error);
  return errorResponse(500, "internal_error", "Error inesperado al procesar la propiedad.");
}

export async function GET(req: Request, { params }: Params) {
  const denied = authorize(req);
  if (denied) return denied;
  const target = await readTarget(params);
  if (target.error) return target.error;

  const property = await findPublisherProperty(target.source, target.externalId);
  if (!property) {
    return errorResponse(404, "not_found", "No existe una propiedad con ese origen e id.");
  }
  return NextResponse.json({ property: describeProperty(property) });
}

export async function PUT(req: Request, { params }: Params) {
  const denied = authorize(req);
  if (denied) return denied;
  const target = await readTarget(params);
  if (target.error) return target.error;

  const body = await req.json().catch(() => null);
  const parsed = PublisherPropertySchema.safeParse(body);
  if (!parsed.success) {
    return errorResponse(422, "invalid_payload", "El cuerpo no cumple el contrato.", parsed.error.flatten());
  }

  try {
    const result = await upsertPublisherProperty(target.source, target.externalId, parsed.data);
    return NextResponse.json(
      { created: result.created, property: result.property, warnings: result.warnings },
      { status: result.created ? 201 : 200 },
    );
  } catch (error) {
    return handleError(error);
  }
}

export async function DELETE(req: Request, { params }: Params) {
  const denied = authorize(req);
  if (denied) return denied;
  const target = await readTarget(params);
  if (target.error) return target.error;

  try {
    const property = await retirePublisherProperty(target.source, target.externalId);
    return NextResponse.json({ property });
  } catch (error) {
    return handleError(error);
  }
}
