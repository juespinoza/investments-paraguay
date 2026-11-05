/** Preserve each image's cloud. Only historical SkyOne imports need a fallback. */
export function resolveImageSource(src: string): string {
  const value = src.trim();
  if (!value.startsWith("publisher/skyone/")) return value;
  const publicId = value.split("/").map(encodeURIComponent).join("/");
  return `https://res.cloudinary.com/dxpewhtgu/image/upload/${publicId}`;
}

/** Absolute URLs keep their account; legacy IDs use the site's existing cloud. */
export function propertyImageUrl(src: string, width: number, quality = 80): string {
  const value = resolveImageSource(src);
  if (value.startsWith("/")) return value;
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    const cloud = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "din9bhvas";
    const publicId = value.split("/").map(encodeURIComponent).join("/");
    url = new URL(`https://res.cloudinary.com/${cloud}/image/upload/${publicId}`);
  }
  if (url.hostname === "res.cloudinary.com" && url.pathname.includes("/image/upload/")) {
    url.pathname = url.pathname.replace("/image/upload/", `/image/upload/f_auto,q_${quality},w_${width}/`);
  }
  return url.toString();
}
