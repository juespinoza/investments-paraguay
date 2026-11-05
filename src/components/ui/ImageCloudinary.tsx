"use client";
import Image from "next/image";
import { propertyImageUrl } from "@/lib/image-source";

export function ImageCloudinary({
  imageUrl,
  width,
  height,
  alt,
}: {
  imageUrl: string;
  width?: number;
  height?: number;
  alt: string;
}) {
  // next/image no acepta fill junto con width/height: si falta alguno de
  // los dos, la imagen ocupa el contenedor.
  const hasSize = Boolean(width && height);
  return (
    <Image
      src={imageUrl}
      alt={alt}
      fill={!hasSize}
      loader={({ src, width, quality }) => propertyImageUrl(src, width, quality)}
      sizes="(min-width: 768px) 300px, 100vw"
      width={hasSize ? width : undefined}
      height={hasSize ? height : undefined}
      className="object-cover"
    />
  );
}
