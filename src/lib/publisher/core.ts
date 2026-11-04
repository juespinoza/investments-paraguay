// Lógica pura de la API del publicador (sin Prisma ni alias de Next), para
// poder probarla con `node --test` (ver tests/publisher-core.test.mjs).
import { createHash, timingSafeEqual } from "node:crypto";

// Estados que el publicador puede poner en una actualización. Nunca puede
// publicar (EN_VENTA / EN_ALQUILER): eso se decide en la oficina virtual.
export const PUBLISHER_ALLOWED_UPDATE_STATUSES = [
  "RESERVADA",
  "VENDIDA",
  "ALQUILADA",
  "RETIRADA",
] as const;

export type PublisherStatus = (typeof PUBLISHER_ALLOWED_UPDATE_STATUSES)[number];

// Toda propiedad nueva entra como borrador para revisarla antes de publicar.
export const PUBLISHER_CREATE_STATUS = "BORRADOR";

export const SOURCE_PATTERN = /^[a-z0-9][a-z0-9-]{1,39}$/;
export const EXTERNAL_ID_PATTERN = /^[A-Za-z0-9._-]{1,100}$/;

export function isValidSource(value: string) {
  return SOURCE_PATTERN.test(value);
}

export function isValidExternalId(value: string) {
  return EXTERNAL_ID_PATTERN.test(value);
}

// Compara el token sin filtrar información por tiempo de respuesta.
export function tokensMatch(received: string | null | undefined, expected: string) {
  if (!received || !expected) return false;
  const a = createHash("sha256").update(received).digest();
  const b = createHash("sha256").update(expected).digest();
  return timingSafeEqual(a, b);
}

export function readBearerToken(header: string | null | undefined) {
  const match = /^Bearer\s+(.+)$/i.exec(header?.trim() ?? "");
  return match ? match[1].trim() : null;
}

export function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80)
    .replace(/-+$/g, "");
}

// Slug estable y único: título + id externo. No cambia en actualizaciones
// para no romper enlaces ya compartidos.
export function buildPropertySlug(title: string, externalId: string) {
  const base = slugify(title) || "propiedad";
  const suffix = slugify(externalId).slice(0, 24) || "ext";
  return `${base}-${suffix}`;
}

// Decide el estado a guardar.
// - Alta: siempre BORRADOR.
// - Actualización: solo cambia si el publicador manda un estado permitido.
export function resolveStatus(
  isCreate: boolean,
  currentStatus: string | null,
  requested: string | null | undefined,
) {
  if (isCreate) return PUBLISHER_CREATE_STATUS;
  if (
    requested &&
    (PUBLISHER_ALLOWED_UPDATE_STATUSES as readonly string[]).includes(requested)
  ) {
    return requested;
  }
  return currentStatus;
}

// ---------- Cloudinary ----------

// Firma de la Upload API de Cloudinary: parámetros ordenados (sin file,
// api_key, resource_type ni cloud_name), unidos con "&", más el secreto, en SHA-1.
export function cloudinarySignature(
  params: Record<string, string | number | boolean>,
  apiSecret: string,
) {
  const excluded = new Set(["file", "api_key", "resource_type", "cloud_name"]);
  const toSign = Object.keys(params)
    .filter((key) => !excluded.has(key) && params[key] !== "" && params[key] !== undefined)
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join("&");
  return createHash("sha1").update(toSign + apiSecret).digest("hex");
}

// public_id determinístico por propiedad y URL de origen: reenviar la misma
// foto no la duplica en Cloudinary.
export function imagePublicId(source: string, externalId: string, imageUrl: string) {
  const hash = createHash("sha1").update(imageUrl).digest("hex").slice(0, 16);
  return `publisher/${source}/${slugify(externalId) || "ext"}/${hash}`;
}

// Si la URL ya es de nuestro Cloudinary, devuelve su public_id (sin
// transformaciones, versión ni extensión). Si no, null.
export function ownCloudinaryPublicId(imageUrl: string, cloudName: string) {
  let parsed: URL;
  try {
    parsed = new URL(imageUrl);
  } catch {
    return null;
  }
  if (parsed.hostname !== "res.cloudinary.com") return null;

  const parts = parsed.pathname.split("/").filter(Boolean);
  if (parts[0] !== cloudName || parts[1] !== "image" || parts[2] !== "upload") {
    return null;
  }

  const rest = parts.slice(3);
  const versionIndex = rest.findIndex((part) => /^v\d+$/.test(part));
  const idParts = versionIndex >= 0 ? rest.slice(versionIndex + 1) : rest.filter((part) => !part.includes(","));
  if (!idParts.length) return null;

  const last = idParts[idParts.length - 1].replace(/\.[a-z0-9]+$/i, "");
  return decodeURIComponent([...idParts.slice(0, -1), last].join("/"));
}

export function isHttpUrl(value: string) {
  try {
    const parsed = new URL(value);
    return parsed.protocol === "https:" || parsed.protocol === "http:";
  } catch {
    return false;
  }
}
