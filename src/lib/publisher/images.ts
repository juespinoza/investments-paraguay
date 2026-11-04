import "server-only";

import {
  cloudinarySignature,
  imagePublicId,
  isHttpUrl,
  ownCloudinaryPublicId,
} from "@/lib/publisher/core";

const UPLOAD_CONCURRENCY = 4;
const UPLOAD_TIMEOUT_MS = 30_000;

export type ImageSyncResult = {
  publicIds: string[];
  warnings: string[];
};

export class CloudinaryConfigError extends Error {}

function cloudinaryConfig() {
  const cloudName =
    process.env.CLOUDINARY_CLOUD_NAME ||
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ||
    "";
  const apiKey = process.env.CLOUDINARY_API_KEY || "";
  const apiSecret = process.env.CLOUDINARY_API_SECRET || "";

  if (!cloudName || !apiKey || !apiSecret) {
    throw new CloudinaryConfigError(
      "Faltan CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET o el cloud name para subir fotos.",
    );
  }

  return { cloudName, apiKey, apiSecret };
}

// Cloudinary descarga la foto desde la URL de origen (no pasa por nuestro
// servidor). Con overwrite=false y un public_id fijo, reenviar la misma
// URL devuelve la imagen ya subida en vez de duplicarla.
async function uploadOne(
  imageUrl: string,
  publicId: string,
  config: ReturnType<typeof cloudinaryConfig>,
) {
  const timestamp = Math.floor(Date.now() / 1000);
  const params = { overwrite: "false", public_id: publicId, timestamp };
  const body = new URLSearchParams({
    file: imageUrl,
    api_key: config.apiKey,
    public_id: publicId,
    overwrite: "false",
    timestamp: String(timestamp),
    signature: cloudinarySignature(params, config.apiSecret),
  });

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), UPLOAD_TIMEOUT_MS);

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${config.cloudName}/image/upload`,
      { method: "POST", body, signal: controller.signal },
    );
    const data = (await response.json().catch(() => ({}))) as {
      public_id?: string;
      error?: { message?: string };
    };

    if (!response.ok || !data.public_id) {
      throw new Error(data.error?.message ?? `HTTP ${response.status}`);
    }

    return data.public_id;
  } finally {
    clearTimeout(timer);
  }
}

// Devuelve los public_id en el mismo orden recibido (la primera es la
// portada). Las fotos que fallan se informan como advertencias.
export async function syncPublisherImages(
  source: string,
  externalId: string,
  imageUrls: string[],
): Promise<ImageSyncResult> {
  const urls = Array.from(new Set(imageUrls.filter(isHttpUrl)));
  if (!urls.length) return { publicIds: [], warnings: [] };

  const config = cloudinaryConfig();
  const results: Array<string | null> = new Array(urls.length).fill(null);
  const warnings: string[] = [];
  let next = 0;

  async function worker() {
    while (next < urls.length) {
      const index = next++;
      const url = urls[index];
      const existing = ownCloudinaryPublicId(url, config.cloudName);

      if (existing) {
        results[index] = existing;
        continue;
      }

      try {
        results[index] = await uploadOne(
          url,
          imagePublicId(source, externalId, url),
          config,
        );
      } catch (error) {
        const reason = error instanceof Error ? error.message : "error desconocido";
        warnings.push(`No se pudo subir la foto ${index + 1} (${url}): ${reason}`);
      }
    }
  }

  await Promise.all(
    Array.from({ length: Math.min(UPLOAD_CONCURRENCY, urls.length) }, worker),
  );

  return {
    publicIds: results.filter((id): id is string => Boolean(id)),
    warnings,
  };
}
