import { prisma } from "@/lib/prisma";
import { authorize, errorResponse } from "@/lib/publisher/http";
import { strategyGet, strategyPut } from "@/lib/publisher/strategy-handlers";

// Estrategia por slug: sirve también para propiedades cargadas a mano en la
// oficina virtual, que no tienen origen ni id externo.
export const dynamic = "force-dynamic";

type Params = { params: Promise<{ slug: string }> };

async function resolveProperty(params: Params["params"]) {
  const { slug } = await params;
  const property = await prisma.property.findFirst({
    where: { slug: decodeURIComponent(slug), deletedAt: null },
    select: { id: true },
  });
  if (!property) {
    return { error: errorResponse(404, "not_found", "No existe una propiedad con ese slug.") };
  }
  return { id: property.id };
}

export async function GET(req: Request, { params }: Params) {
  const denied = authorize(req);
  if (denied) return denied;
  const target = await resolveProperty(params);
  if (target.error) return target.error;
  return strategyGet(target.id);
}

export async function PUT(req: Request, { params }: Params) {
  const denied = authorize(req);
  if (denied) return denied;
  const target = await resolveProperty(params);
  if (target.error) return target.error;
  return strategyPut(req, target.id);
}
