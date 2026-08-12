"use client";

import { useMemo, useState } from "react";
import { ImageCloudinary } from "@/components/ui/ImageCloudinary";

function uniqueImages(images: Array<string | null | undefined>) {
  return Array.from(
    new Set(images.map((image) => image?.trim()).filter(Boolean) as string[]),
  );
}

export function PropertyImageGallery({
  title,
  coverImageUrl,
  gallery,
}: {
  title: string;
  coverImageUrl: string | null;
  gallery: string[];
}) {
  const images = useMemo(
    () => uniqueImages([coverImageUrl, ...gallery]),
    [coverImageUrl, gallery],
  );
  const [expanded, setExpanded] = useState(false);

  if (!images.length) return null;

  const visibleImages = expanded ? images : images.slice(0, 4);
  const remaining = Math.max(images.length - 4, 0);

  return (
    <section className="px-4 py-8 md:py-10">
      <div className="container-page">
        <div className="grid auto-rows-[180px] gap-3 overflow-hidden rounded-[1.75rem] md:grid-cols-4 md:auto-rows-[210px]">
          {visibleImages.map((image, index) => (
            <div
              key={image}
              className={`surface-card relative overflow-hidden ${
                index === 0 ? "md:col-span-2 md:row-span-2" : ""
              }`}
            >
              <ImageCloudinary imageUrl={image} alt={`${title} ${index + 1}`} />
              {!expanded && index === 3 && remaining > 0 ? (
                <button
                  type="button"
                  onClick={() => setExpanded(true)}
                  className="absolute bottom-4 right-4 rounded-full bg-[rgba(10,10,10,0.82)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--ivory)] backdrop-blur transition hover:bg-[var(--gold)] hover:text-[var(--carbon)]"
                >
                  Ver {remaining} fotos más
                </button>
              ) : null}
            </div>
          ))}
        </div>

        {expanded && remaining > 0 ? (
          <button
            type="button"
            onClick={() => setExpanded(false)}
            className="btn-secondary mt-4"
          >
            Mostrar menos
          </button>
        ) : null}
      </div>
    </section>
  );
}
