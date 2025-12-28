export type PublicPropertyListItem = {
  slug: string;
  title: string;
  subtitle: string | null;
  coverImageUrl: string | null;
  priceUsd: number | null;
  city: string | null;
  advisor: { slug: string; fullName: string } | null;
};

export type PublicPropertyDetail = {
  slug: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  coverImageUrl: string | null;
  gallery: string[];
  priceUsd: number | null;
  city: string | null;
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
