import { ImageResponse } from "next/og";
import { buildCloudinaryOpenGraphImageUrl } from "@/lib/cloudinary";
import { SITE_NAME, SITE_URL } from "@/lib/seo";
import type { PublicPropertyDetail } from "@/lib/api/types";

export const alt = "Investments Paraguay";
export const contentType = "image/png";
export const size = {
  width: 1200,
  height: 630,
};
export const revalidate = 120;

type ImageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

async function getProperty(slug: string) {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || SITE_URL;

  const response = await fetch(
    `${baseUrl}/api/public/bienes-raices/${encodeURIComponent(slug)}`,
    {
      cache: "force-cache",
      next: { revalidate },
    },
  );

  if (!response.ok) return null;
  return (await response.json()) as PublicPropertyDetail;
}

function formatPrice(
  value: number | null | undefined,
  currency: "GS" | "USD" = "USD",
) {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return "Consultar precio";
  }

  return `${currency} ${value.toLocaleString(currency === "USD" ? "en-US" : "es-PY", {
    maximumFractionDigits: currency === "USD" ? 2 : 0,
  })}`;
}

function formatLocation(property: PublicPropertyDetail | null) {
  return [property?.neighborhood, property?.city].filter(Boolean).join(", ");
}

export default async function OpenGraphImage({ params }: ImageProps) {
  const { slug } = await params;
  const property = await getProperty(slug);
  const imageUrl =
    buildCloudinaryOpenGraphImageUrl(property?.coverImageUrl) ??
    `${SITE_URL}/images/og-home.jpg`;
  const location = formatLocation(property);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "#F5F3EF",
          color: "#0A0A0A",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div
          style={{
            width: "50%",
            height: "100%",
            display: "flex",
            overflow: "hidden",
            background: "#1C1C1C",
          }}
        >
          <img
            alt=""
            src={imageUrl}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        </div>

        <div
          style={{
            width: "50%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            padding: "58px 62px 52px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              fontFamily: "Georgia, serif",
              fontSize: 28,
              fontWeight: 600,
              letterSpacing: "-0.01em",
            }}
          >
            Investments
            <span style={{ color: "#BFA882", marginLeft: 4 }}>Paraguay</span>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              marginTop: 78,
            }}
          >
            <div
              style={{
                display: "flex",
                fontFamily: "Georgia, serif",
                fontSize: property?.title && property.title.length > 48 ? 48 : 56,
                fontWeight: 400,
                lineHeight: 1.05,
                letterSpacing: "-0.01em",
              }}
            >
              {property?.title ?? "Propiedad en Paraguay"}
            </div>

            <div
              style={{
                display: "flex",
                marginTop: 26,
                fontSize: 32,
                fontWeight: 600,
                color: "#0A0A0A",
              }}
            >
              {formatPrice(property?.price ?? property?.priceUsd, property?.currency)}
            </div>

            {location ? (
              <div
                style={{
                  display: "flex",
                  marginTop: 16,
                  fontSize: 20,
                  color: "#8B7355",
                }}
              >
                {location}
              </div>
            ) : null}
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 18,
              marginTop: "auto",
            }}
          >
            <div
              style={{
                width: 82,
                height: 2,
                background: "#BFA882",
              }}
            />
            <div
              style={{
                display: "flex",
                fontSize: 15,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "#1C1C1C",
              }}
            >
              {SITE_NAME}
            </div>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
