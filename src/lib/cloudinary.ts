import { SITE_URL } from "@/lib/seo";

const DEFAULT_CLOUDINARY_CLOUD_NAME = "din9bhvas";

type CloudinaryTransformOptions = {
  width?: number;
  height?: number;
  crop?: "fill" | "fit" | "limit";
  gravity?: "center" | "auto";
  quality?: "auto" | number;
  format?: "auto";
  version?: string;
};

function cloudName() {
  return (
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ||
    DEFAULT_CLOUDINARY_CLOUD_NAME
  );
}

function isRemoteUrl(src: string) {
  return src.startsWith("http://") || src.startsWith("https://");
}

function isCloudinaryUrl(src: string) {
  return src.includes("res.cloudinary.com") && src.includes("/upload/");
}

function encodePublicId(publicId: string) {
  return publicId
    .split("/")
    .filter(Boolean)
    .map((segment) => encodeURIComponent(segment))
    .join("/");
}

function buildTransform(options: CloudinaryTransformOptions) {
  const crop = options.crop ?? "fill";
  const gravity = options.gravity ?? "center";
  const quality = options.quality ?? "auto";
  const format = options.format ?? "auto";
  const resize = [
    `c_${crop}`,
    options.width ? `w_${options.width}` : null,
    options.height ? `h_${options.height}` : null,
    `g_${gravity}`,
  ]
    .filter(Boolean)
    .join(",");

  return `${resize}/f_${format}/q_${quality}`;
}

export function buildCloudinaryImageUrl(
  src: string | null | undefined,
  options: CloudinaryTransformOptions = {},
) {
  const value = src?.trim();
  if (!value) return null;

  const transform = buildTransform(options);

  if (isCloudinaryUrl(value)) {
    return value.replace("/upload/", `/upload/${transform}/`);
  }

  if (isRemoteUrl(value)) {
    return value;
  }

  if (value.startsWith("/")) {
    return `${SITE_URL}${value}`;
  }

  const encodedPublicId = encodePublicId(value);
  const versionPrefix = /^v\d+\//.test(encodedPublicId)
    ? ""
    : `${options.version ?? "v1"}/`;

  return `https://res.cloudinary.com/${cloudName()}/image/upload/${transform}/${versionPrefix}${encodedPublicId}`;
}

export function buildCloudinaryOpenGraphImageUrl(
  src: string | null | undefined,
) {
  return buildCloudinaryImageUrl(src, {
    width: 1200,
    height: 630,
    crop: "fill",
    gravity: "center",
    format: "auto",
    quality: "auto",
    version: "v1",
  });
}
