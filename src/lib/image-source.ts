// Fotos de dos cuentas de Cloudinary. Los nombres de cuenta salen solo de
// variables de entorno (nunca del código):
// - NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: cuenta histórica del sitio. Las fotos
//   viejas guardadas como public_id se muestran desde acá.
// - NEXT_PUBLIC_CLOUDINARY_PUBLISHER_CLOUD_NAME: cuenta donde sube el
//   publicador. Las primeras importaciones quedaron como public_id
//   "publisher/skyone/…"; las nuevas se guardan como URL completa.
// Las variables se leen dentro de las funciones para poder testearlas.

function legacyCloud() {
  return process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "";
}

function publisherCloud() {
  return process.env.NEXT_PUBLIC_CLOUDINARY_PUBLISHER_CLOUD_NAME || "";
}

function encodePublicId(value: string) {
  return value.split("/").map(encodeURIComponent).join("/");
}

/** Preserve each image's cloud. Only historical SkyOne imports need a fallback. */
export function resolveImageSource(src: string): string {
  const value = src.trim();
  if (!value.startsWith("publisher/skyone/")) return value;
  const cloud = publisherCloud();
  if (!cloud) return value;
  return `https://res.cloudinary.com/${cloud}/image/upload/${encodePublicId(value)}`;
}

/** Absolute URLs keep their account; legacy IDs use the site's existing cloud. */
export function propertyImageUrl(src: string, width: number, quality = 80): string {
  const value = resolveImageSource(src);
  if (value.startsWith("/")) return value;
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    const cloud = legacyCloud();
    // Sin cuenta configurada no hay de dónde servir el public_id.
    if (!cloud) return value;
    url = new URL(`https://res.cloudinary.com/${cloud}/image/upload/${encodePublicId(value)}`);
  }
  if (url.hostname === "res.cloudinary.com" && url.pathname.includes("/image/upload/")) {
    url.pathname = url.pathname.replace("/image/upload/", `/image/upload/f_auto,q_${quality},w_${width}/`);
  }
  return url.toString();
}
