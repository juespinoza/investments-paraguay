"use client";
import { CldImage } from "next-cloudinary";

export function ImageCloudinary({
  imageUrl,
  width,
  height,
  alt,
  className,
}: {
  imageUrl: string;
  width: number;
  height: number;
  alt: string;
  className?: string;
}) {
  return (
    <CldImage
      src={imageUrl}
      width={width}
      height={height}
      alt={alt}
      className={className ?? "h-auto w-full object-cover"}
      priority
    />
  );
}
