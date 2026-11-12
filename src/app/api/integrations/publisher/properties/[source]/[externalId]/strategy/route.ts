import { isValidExternalId, isValidSource } from "@/lib/publisher/core";
import { authorize, errorResponse } from "@/lib/publisher/http";
import { findPublisherProperty } from "@/lib/publisher/service";
import { strategyGet, strategyPut } from "@/lib/publisher/strategy-handlers";

// Estrategia de inversión de una propiedad del publicador.
// Contrato en src/lib/publisher/README.md.
export const dynamic = "force-dynamic";

type Params = { params: Promise<{ source: string; externalId: string }> };

async function resolveProperty(params: Params["params"]) {
  const { source, externalId } = await params;
  const decodedId = decodeURIComponent(externalId);
  if (!isValidSource(source) || !isValidExternalId(decodedId)) {
    return { error: errorResponse(400, "invalid_target", "Origen o id externo inválido.") };
  }
  const property = await findPublisherProperty(source, decodedId);
  if (!property) {
    return { error: errorResponse(404, "not_found", "No existe una propiedad con ese origen e id.") };
  }
  return { id: property.id };
}

export async function GET(req: Request, { params }: Params) {
  const denied = authorize(req, "content");
  if (denied) return denied;
  const target = await resolveProperty(params);
  if (target.error) return target.error;
  return strategyGet(target.id);
}

export async function PUT(req: Request, { params }: Params) {
  const denied = authorize(req, "content");
  if (denied) return denied;
  const target = await resolveProperty(params);
  if (target.error) return target.error;
  return strategyPut(req, target.id);
}
