"use client";
import { CldImage } from "next-cloudinary";

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
    <CldImage
      src={imageUrl}
      alt={alt}
      fill
      crop="fill"
      gravity="center"
      sizes="(min-width: 768px) 300px, 100vw"
      width={width ?? undefined}
      height={height ?? undefined}
      className="object-cover"
    />
  );
}
