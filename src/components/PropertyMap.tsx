"use client";

import Script from "next/script";
import { useEffect, useMemo, useRef, useState } from "react";

export type PropertyMapItem = {
  slug: string;
  title: string;
  coverImageUrl: string | null;
  price: number | null;
  priceUsd: number | null;
  currency: "GS" | "USD";
  latitude: number;
  longitude: number;
};

type PropertyMapProps = {
  properties: PropertyMapItem[];
};

type GoogleMapInstance = any;
type GoogleMarkerInstance = any;
type GoogleOverlayInstance = any;

declare global {
  interface Window {
    google?: any;
  }
}

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

const MONOCHROME_MAP_STYLES = [
  { elementType: "geometry", stylers: [{ color: "#f5f3ef" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#f5f3ef" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#0a0a0a" }] },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#ffffff" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#d4cfc8" }],
  },
  { featureType: "poi", stylers: [{ visibility: "off" }] },
  { featureType: "transit", stylers: [{ visibility: "off" }] },
];

const DEFAULT_CENTER = { lat: -23.4425, lng: -58.4438 };
const MARKER_SVG = `
  <svg width="28" height="28" viewBox="0 0 28 28" xmlns="http://www.w3.org/2000/svg">
    <circle cx="14" cy="14" r="9" fill="#BFA882" stroke="#0a0a0a" stroke-width="2"/>
  </svg>
`;

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function formatPrice(price: number | null, currency: "GS" | "USD") {
  if (price === null) return "Precio a consultar";

  return `${currency} ${price.toLocaleString(currency === "USD" ? "en-US" : "es-PY", {
    maximumFractionDigits: currency === "USD" ? 2 : 0,
  })}`;
}

function resolveImageUrl(imageUrl: string | null) {
  if (!imageUrl) return null;
  if (imageUrl.startsWith("http") || imageUrl.startsWith("/")) return imageUrl;
  if (!CLOUDINARY_CLOUD_NAME) return null;

  return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/c_fill,w_100,h_100,g_center/${imageUrl}`;
}

function getPropertyHref(slug: string) {
  if (typeof window === "undefined") {
    return `/bienes-raices/propiedades/${slug}`;
  }

  const localePrefix = window.location.pathname.match(/^\/[^/]+/)?.[0] ?? "";
  return `${localePrefix}/bienes-raices/propiedades/${slug}`;
}

function getFallbackMapSrc(properties: PropertyMapItem[]) {
  const first = properties[0];
  const query = first ? `${first.latitude},${first.longitude}` : "Paraguay";

  return `https://maps.google.com/maps?q=${encodeURIComponent(
    query,
  )}&t=&z=12&ie=UTF8&iwloc=&output=embed`;
}

function createMarkerIcon() {
  const google = window.google;

  return {
    url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(MARKER_SVG)}`,
    scaledSize: new google.maps.Size(28, 28),
    anchor: new google.maps.Point(14, 14),
  };
}

function createInfoOverlay(
  property: PropertyMapItem,
  map: GoogleMapInstance,
): GoogleOverlayInstance {
  const google = window.google;
  const position = new google.maps.LatLng(
    property.latitude,
    property.longitude,
  );
  const imageUrl = resolveImageUrl(property.coverImageUrl);
  const href = getPropertyHref(property.slug);
  const title = escapeHtml(property.title);
  const price = escapeHtml(
    formatPrice(property.price ?? property.priceUsd, property.currency),
  );

  class PropertyInfoOverlay extends google.maps.OverlayView {
    private element: HTMLDivElement | null = null;

    onAdd() {
      const element = document.createElement("div");
      element.style.position = "absolute";
      element.style.transform = "translate(-50%, calc(-100% - 18px))";
      element.style.zIndex = "5";
      element.innerHTML = `
        <div style="width: 260px; display: flex; gap: 12px; align-items: center; border-radius: 8px; background: #fafaf8; padding: 10px; box-shadow: 0 18px 48px rgba(10,10,10,0.18); color: #0a0a0a;">
          ${
            imageUrl
              ? `<img src="${escapeHtml(imageUrl)}" alt="${title}" width="50" height="50" loading="lazy" style="width: 50px; height: 50px; object-fit: cover; border-radius: 4px; flex: 0 0 auto;" />`
              : `<div aria-hidden="true" style="width: 50px; height: 50px; border-radius: 4px; background: #f5f3ef; flex: 0 0 auto;"></div>`
          }
          <div style="min-width: 0;">
            <p style="margin: 0; font-size: 13px; font-weight: 600; line-height: 1.35; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${title}</p>
            <p style="margin: 3px 0 0; font-size: 12px; color: #8b7355; line-height: 1.35;">${price}</p>
            <a href="${escapeHtml(href)}" style="display: inline-flex; margin-top: 6px; font-size: 11px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: #0a0a0a; text-decoration: none;">Ver propiedad</a>
          </div>
        </div>
      `;

      this.element = element;
      this.getPanes()?.floatPane.appendChild(element);
    }

    draw() {
      if (!this.element) return;

      const point = this.getProjection()?.fromLatLngToDivPixel(position);
      if (!point) return;

      this.element.style.left = `${point.x}px`;
      this.element.style.top = `${point.y}px`;
    }

    onRemove() {
      this.element?.remove();
      this.element = null;
    }
  }

  const overlay = new PropertyInfoOverlay();
  overlay.setMap(map);

  return overlay;
}

function FallbackMap({
  properties,
  reason,
}: {
  properties: PropertyMapItem[];
  reason: "missing-key" | "script-error";
}) {
  useEffect(() => {
    if (reason === "missing-key") {
      console.warn(
        "NEXT_PUBLIC_GOOGLE_MAPS_API_KEY no está definida. Se muestra el iframe fallback de Google Maps.",
      );
      return;
    }

    console.warn(
      "No se pudo cargar Google Maps JavaScript API. Se muestra el iframe fallback de Google Maps.",
    );
  }, [reason]);

  return (
    <iframe
      title="Mapa de propiedades"
      className="h-100 w-full rounded-lg border-0"
      src={getFallbackMapSrc(properties)}
      loading="lazy"
    />
  );
}

export function PropertyMap({ properties }: PropertyMapProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<GoogleMapInstance | null>(null);
  const markersRef = useRef<GoogleMarkerInstance[]>([]);
  const overlayRef = useRef<GoogleOverlayInstance | null>(null);
  const [apiReady, setApiReady] = useState(false);
  const [scriptFailed, setScriptFailed] = useState(false);

  const firstPosition = useMemo(() => {
    const first = properties[0];
    if (!first) return DEFAULT_CENTER;

    return { lat: first.latitude, lng: first.longitude };
  }, [properties]);

  useEffect(() => {
    if (window.google?.maps) setApiReady(true);
  }, []);

  useEffect(() => {
    if (!apiReady || !containerRef.current || mapRef.current) return;

    mapRef.current = new window.google.maps.Map(containerRef.current, {
      center: firstPosition,
      zoom: properties.length > 0 ? 13 : 6,
      styles: MONOCHROME_MAP_STYLES,
      disableDefaultUI: true,
      zoomControl: true,
      gestureHandling: "cooperative",
      clickableIcons: false,
      backgroundColor: "#f5f3ef",
    });
  }, [apiReady, firstPosition, properties.length]);

  useEffect(() => {
    const map = mapRef.current;
    if (!apiReady || !map) return;

    overlayRef.current?.setMap(null);
    overlayRef.current = null;

    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = [];

    if (properties.length === 0) {
      map.setCenter(DEFAULT_CENTER);
      map.setZoom(6);
      return;
    }

    const bounds = new window.google.maps.LatLngBounds();
    const markerIcon = createMarkerIcon();

    properties.forEach((property) => {
      const position = {
        lat: property.latitude,
        lng: property.longitude,
      };

      const marker = new window.google.maps.Marker({
        position,
        map,
        title: property.title,
        icon: markerIcon,
      });

      marker.addListener("click", () => {
        overlayRef.current?.setMap(null);
        overlayRef.current = createInfoOverlay(property, map);
      });

      markersRef.current.push(marker);
      bounds.extend(position);
    });

    if (properties.length === 1) {
      map.setCenter(bounds.getCenter());
      map.setZoom(15);
      return;
    }

    map.fitBounds(bounds, 56);
  }, [apiReady, properties]);

  useEffect(() => {
    return () => {
      overlayRef.current?.setMap(null);
      markersRef.current.forEach((marker) => marker.setMap(null));
    };
  }, []);

  if (!GOOGLE_MAPS_API_KEY || scriptFailed) {
    return (
      <FallbackMap
        properties={properties}
        reason={GOOGLE_MAPS_API_KEY ? "script-error" : "missing-key"}
      />
    );
  }

  return (
    <>
      <Script
        id="google-maps-js"
        src={`https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}`}
        strategy="lazyOnload"
        onLoad={() => setApiReady(true)}
        onError={() => setScriptFailed(true)}
      />
      <div
        ref={containerRef}
        className="h-100 w-full overflow-hidden rounded-lg bg-(--stone)"
        aria-label="Mapa de propiedades"
      >
        {!apiReady ? (
          <div className="flex h-full items-center justify-center text-[12px] font-semibold uppercase tracking-[0.12em] text-muted">
            Cargando mapa
          </div>
        ) : null}
      </div>
    </>
  );
}
