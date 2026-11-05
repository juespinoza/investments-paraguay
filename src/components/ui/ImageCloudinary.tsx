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
  return (
    <Image
      src={imageUrl}
      alt={alt}
      fill={!(width && height)}
      loader={({ src, width, quality }) => propertyImageUrl(src, width, quality)}
      sizes="(min-width: 768px) 300px, 100vw"
      width={width ?? undefined}
      height={height ?? undefined}
      className="object-cover"
    />
  );
}
