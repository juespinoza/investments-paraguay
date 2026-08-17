"use client";

import Image, { type ImageLoaderProps } from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/cn";

const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const SWIPE_THRESHOLD_PX = 48;

function uniqueImages(images: Array<string | null | undefined>) {
  return Array.from(
    new Set(images.map((image) => image?.trim()).filter(Boolean) as string[]),
  );
}

function isRemoteUrl(src: string) {
  return src.startsWith("http://") || src.startsWith("https://");
}

function isCloudinaryUrl(src: string) {
  return src.includes("res.cloudinary.com") && src.includes("/upload/");
}

function buildCloudinaryUrl(src: string, width: number) {
  if (isCloudinaryUrl(src)) {
    return src.replace("/upload/", `/upload/f_auto,q_auto,w_${width}/`);
  }

  if (!isRemoteUrl(src) && !src.startsWith("/") && CLOUDINARY_CLOUD_NAME) {
    return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/f_auto,q_auto,w_${width}/${src}`;
  }

  return src;
}

function cloudinaryLoader({ src, width }: ImageLoaderProps) {
  return buildCloudinaryUrl(src, width);
}

function getImageProps(src: string) {
  if (src.startsWith("/") || isRemoteUrl(src) || CLOUDINARY_CLOUD_NAME) {
    return {
      src,
      loader: cloudinaryLoader,
      unoptimized: false,
    };
  }

  return {
    src: "/images/logo.png",
    unoptimized: true,
  };
}

function GalleryImage({
  src,
  alt,
  priority = false,
  className,
  sizes,
  objectFit = "cover",
}: {
  src: string;
  alt: string;
  priority?: boolean;
  className?: string;
  sizes: string;
  objectFit?: "cover" | "contain";
}) {
  const imageProps = getImageProps(src);

  return (
    <Image
      {...imageProps}
      alt={alt}
      fill
      priority={priority}
      loading={priority ? undefined : "lazy"}
      sizes={sizes}
      className={cn(
        objectFit === "contain" ? "object-contain" : "object-cover",
        className,
      )}
    />
  );
}

function GalleryDots({
  count,
  activeIndex,
}: {
  count: number;
  activeIndex: number;
}) {
  if (count <= 1) return null;

  return (
    <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-1.5 md:hidden">
      {Array.from({ length: count }).map((_, index) => (
        <span
          key={index}
          className={cn(
            "h-1.5 w-1.5 rounded-full transition-colors duration-200",
            index === activeIndex ? "bg-(--ivory)" : "bg-white/45",
          )}
        />
      ))}
    </div>
  );
}

function getDesktopThumbnailClass(index: number, count: number) {
  if (count === 1) {
    return "col-span-2 row-span-2 rounded-r-[8px]";
  }

  if (count === 2) {
    return cn(
      "col-span-2",
      index === 0 && "rounded-tr-[8px]",
      index === 1 && "rounded-br-[8px]",
    );
  }

  if (count === 3) {
    return cn(
      index === 0 && "row-span-2",
      index === 1 && "rounded-tr-[8px]",
      index === 2 && "rounded-br-[8px]",
    );
  }

  return cn(
    index === 1 && "rounded-tr-[8px]",
    index === 3 && "rounded-br-[8px]",
  );
}

function Lightbox({
  images,
  title,
  initialIndex,
  onClose,
}: {
  images: string[];
  title: string;
  initialIndex: number;
  onClose: () => void;
}) {
  const [index, setIndex] = useState(initialIndex);
  const touchStartX = useRef<number | null>(null);

  const goToPrevious = useCallback(() => {
    setIndex((current) => (current - 1 + images.length) % images.length);
  }, [images.length]);

  const goToNext = useCallback(() => {
    setIndex((current) => (current + 1) % images.length);
  }, [images.length]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowLeft") goToPrevious();
      if (event.key === "ArrowRight") goToNext();
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [goToNext, goToPrevious, onClose]);

  return (
    <div
      className="fixed inset-0 z-90 bg-[rgba(0,0,0,0.95)] text-(--ivory)"
      role="dialog"
      aria-modal="true"
      aria-label={`Galería de ${title}`}
      onTouchStart={(event) => {
        touchStartX.current = event.touches[0]?.clientX ?? null;
      }}
      onTouchEnd={(event) => {
        const startX = touchStartX.current;
        const endX = event.changedTouches[0]?.clientX;
        touchStartX.current = null;

        if (startX === null || endX === undefined) return;

        const deltaX = endX - startX;
        if (Math.abs(deltaX) < SWIPE_THRESHOLD_PX) return;

        if (deltaX > 0) goToPrevious();
        else goToNext();
      }}
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute right-4 top-4 z-20 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-(--ivory) transition-colors hover:bg-white/18 md:right-6 md:top-6"
        aria-label="Cerrar galería"
      >
        <X size={22} strokeWidth={1.8} />
      </button>

      <div className="absolute right-20 top-7 z-20 text-[13px] font-semibold tracking-[0.08em] md:right-24">
        {index + 1} / {images.length}
      </div>

      {images.length > 1 ? (
        <>
          <button
            type="button"
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 z-20 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-(--ivory) transition-colors hover:bg-white/18 md:inline-flex"
            aria-label="Imagen anterior"
          >
            <ChevronLeft size={28} strokeWidth={1.7} />
          </button>
          <button
            type="button"
            onClick={goToNext}
            className="absolute right-4 top-1/2 z-20 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-(--ivory) transition-colors hover:bg-white/18 md:inline-flex"
            aria-label="Imagen siguiente"
          >
            <ChevronRight size={28} strokeWidth={1.7} />
          </button>
        </>
      ) : null}

      <div className="flex h-full w-full items-center justify-center px-4 py-20 md:px-20">
        <div className="relative h-[85vh] w-full transition-opacity duration-200">
          <GalleryImage
            key={images[index]}
            src={images[index]}
            alt={`${title} ${index + 1}`}
            sizes="100vw"
            objectFit="contain"
          />
        </div>
      </div>
    </div>
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
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [mobileIndex, setMobileIndex] = useState(0);
  const mobileScrollerRef = useRef<HTMLDivElement | null>(null);

  if (!images.length) return null;

  const hasMultipleImages = images.length > 1;
  const desktopThumbnails = images.slice(1, 5);

  return (
    <section className="px-4 py-8 md:py-10">
      <div className="container-page">
        {!hasMultipleImages ? (
          <button
            type="button"
            onClick={() => setLightboxIndex(0)}
            className="relative block h-90 w-full overflow-hidden rounded-lg bg-(--stone) text-left md:h-120"
            aria-label={`Abrir imagen de ${title}`}
          >
            <GalleryImage src={images[0]} alt={title} priority sizes="100vw" />
          </button>
        ) : (
          <>
            <div className="hidden h-120 grid-cols-[minmax(0,3fr)_minmax(320px,2fr)] gap-2 md:grid">
              <button
                type="button"
                onClick={() => setLightboxIndex(0)}
                className="relative overflow-hidden rounded-l-lg bg-(--stone) text-left"
                aria-label={`Abrir imagen principal de ${title}`}
              >
                <GalleryImage
                  src={images[0]}
                  alt={`${title} 1`}
                  priority
                  sizes="60vw"
                />
              </button>

              <div className="grid grid-cols-2 grid-rows-2 gap-2">
                {desktopThumbnails.map((image, thumbnailIndex) => {
                  const imageIndex = thumbnailIndex + 1;
                  const isLastVisible = thumbnailIndex === 3;
                  const shouldShowOverlay = isLastVisible && images.length > 5;

                  return (
                    <button
                      key={image}
                      type="button"
                      onClick={() => setLightboxIndex(imageIndex)}
                      className={cn(
                        "relative overflow-hidden bg-(--stone) text-left",
                        getDesktopThumbnailClass(
                          thumbnailIndex,
                          desktopThumbnails.length,
                        ),
                      )}
                      aria-label={`Abrir imagen ${imageIndex + 1} de ${title}`}
                    >
                      <GalleryImage
                        src={image}
                        alt={`${title} ${imageIndex + 1}`}
                        sizes="20vw"
                      />
                      {shouldShowOverlay ? (
                        <span className="absolute inset-0 flex items-center justify-center bg-[rgba(10,10,10,0.62)] px-4 text-center text-[13px] font-semibold uppercase tracking-[0.08em] text-(--ivory)">
                          Ver todas ({images.length} fotos)
                        </span>
                      ) : null}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="relative md:hidden">
              <div
                ref={mobileScrollerRef}
                className="flex snap-x snap-mandatory overflow-x-auto rounded-lg bg-(--stone) [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                onScroll={(event) => {
                  const element = event.currentTarget;
                  const nextIndex = Math.round(
                    element.scrollLeft / element.clientWidth,
                  );
                  setMobileIndex(Math.min(nextIndex, images.length - 1));
                }}
              >
                {images.map((image, index) => (
                  <button
                    key={image}
                    type="button"
                    onClick={() => setLightboxIndex(index)}
                    className="relative h-90 w-full shrink-0 snap-center"
                    aria-label={`Abrir imagen ${index + 1} de ${title}`}
                  >
                    <GalleryImage
                      src={image}
                      alt={`${title} ${index + 1}`}
                      priority={index === 0}
                      sizes="100vw"
                    />
                  </button>
                ))}
              </div>
              <GalleryDots count={images.length} activeIndex={mobileIndex} />
            </div>
          </>
        )}
      </div>

      {lightboxIndex !== null ? (
        <Lightbox
          images={images}
          title={title}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      ) : null}
    </section>
  );
}
