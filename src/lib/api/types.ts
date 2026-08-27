export type PublicPropertyListItem = {
  slug: string;
  title: string;
  subtitle: string | null;
  coverImageUrl: string | null;
  price: number | null;
  priceUsd: number | null;
  currency: "GS" | "USD";
  status:
    | "EN_VENTA"
    | "EN_ALQUILER"
    | "RESERVADA"
    | "BORRADOR"
    | "VENDIDA"
    | "ALQUILADA"
    | "RETIRADA";
  hasPropertyDocuments: boolean;
  city: string | null;
  neighborhood: string | null;
  locationUrl: string | null;
  latitude: number | null;
  longitude: number | null;
  propertyType: string | null;
  propertyTypeCode: string | null;
  isProject: boolean;
  hasResidentialDetails: boolean;
  isFeatured: boolean;
  featuredOrder: number | null;
  updatedAt: string;
  roiAnnualPct: number | null;
  appreciationAnnualPct: number | null;
  advisor: { slug: string; fullName: string } | null;
};

export type PublicPropertyDetail = {
  slug: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  coverImageUrl: string | null;
  gallery: string[];
  price: number | null;
  priceUsd: number | null;
  currency: "GS" | "USD";
  status:
    | "EN_VENTA"
    | "EN_ALQUILER"
    | "RESERVADA"
    | "BORRADOR"
    | "VENDIDA"
    | "ALQUILADA"
    | "RETIRADA";
  hasPropertyDocuments: boolean;
  propertyType: string | null;
  propertyTypeCode: string | null;
  isProject: boolean;
  hasResidentialDetails: boolean;
  city: string | null;
  neighborhood: string | null;
  address: string | null;
  locationUrl: string | null;
  latitude: number | null;
  longitude: number | null;
  roiAnnualPct: number | null;
  appreciationAnnualPct: number | null;
  advisor: {
    slug: string;
    fullName: string;
    headline: string | null;
    photoUrl: string | null;
    whatsapp: string | null;
  } | null;
};

export type PublicAdvisorLanding = {
  slug: string;
  fullName: string;
  headline: string | null;
  heroBgUrl: string | null;
  ctaLabel: string | null;
  ctaHref: string | null;

  about: {
    imageUrl: string;
    title: string;
    startDate: string; // Date serializado
    company: string;
    description: string | null;
    paragraphs: [string, string];
  };

  services: {
    propertyTypes: string[];
    clientTypes: string[];
    areas: string[];
    serviceList: string[];
    paragraphs: [string, string];
  };

  featuredProperties: Array<{
    slug: string;
    title: string;
    coverImageUrl: string | null;
    priceUsd: number | null;
    city: string | null;
  }>;

  testimonies: Array<{ name: string; text: string }>;

  socialMedia: Array<{
    label: string;
    value: string;
    href: string;
    platform: string;
  }>;
};
