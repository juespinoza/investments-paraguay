export type SocialIconKey = "whatsapp" | "instagram" | "facebook" | "tiktok";

export type Testimonial = {
  name: string;
  text: string;
};

export type Property = {
  slug: string;
  title: string;
  subtitle: string;
  location?: string;
  price?: number;
  priceType?: "USD" | "GS";
  coverImageUrl: string;
  gallery?: string[];
  descriptionParagraphs: string[];
  advisorSlug: string; // dueño (asesor)
};

export type Advisor = {
  slug: string;
  fullName: string;
  headline: string;
  heroBg: string;
  heroCtaLabel: string;
  heroCtaHref: string;

  about: {
    imageUrl: string;
    title: string;
    startDate: Date;
    company: string;
    description: string;
    paragraphs: string[];
  };

  services: {
    propertyTypes: string[];
    clientTypes: string[];
    areas: string[];
    servicesList: string[];
    paragraphs: string[];
  };

  featuredPropertySlugs: string[]; // referencia a propiedades

  testimonies: Testimonial[];
  socialLinks: SocialLink[];
};

export type SocialPlatform =
  | "WHATSAPP"
  | "EMAIL"
  | "BLOG"
  | "WEB"
  | "INSTAGRAM"
  | "FACEBOOK"
  | "X"
  | "TIKTOK";

export type SocialItem = {
  label: string;
  value: string;
  href: string;
  platform: SocialPlatform;
};

export type SocialLink = {
  label: string;
  value: string;
  href: string;
  icon: SocialIconKey;
  platform: SocialPlatform;
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
    startDate: string;
    companyName: string;
    description: string | null;
    paragraphs: [string, string];
    yearsExperience?: number;
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

  testimonies: Array<Testimonial>;

  socialMedia: Array<SocialItem>;
};

export type PublicAdvisorLandingV2 = {
  slug: string;
  fullName: string;
  hero: {
    title: string;
    subtitle: string | null;
    imageUrl: string | null;
    ctaLabel: string | null;
    ctaHref: string | null;
  };
  about: {
    title: string | null;
    body: string | null;
  };
  services: {
    title: string | null;
    body: string | null;
  };
  featuredProperties: Array<{
    slug: string;
    title: string;
    coverImageUrl: string | null;
    priceUsd: number | null;
    city: string | null;
  }>;
  socialLinks: Array<{
    platform: SocialPlatform;
    url: string;
  }>;
};

export type PublicInmobiliariaLandingV2 = {
  slug: string;
  name: string;
  logoUrl: string | null;
  hero: {
    title: string;
    subtitle: string | null;
    imageUrl: string | null;
    ctaLabel: string | null;
    ctaHref: string | null;
  };
  about: {
    title: string | null;
    body: string | null;
  };
  contact: {
    email: string | null;
    phone: string | null;
    whatsapp: string | null;
    website: string | null;
    address: string | null;
  };
  advisorsIntro: string | null;
  propertiesIntro: string | null;
  featuredPropertyIds: string[];
};

export type SessionPayload = {
  sub: string; // userId
  id: string;
  email: string;
  role: "ADMIN" | "INMOBILIARIA" | "ASESOR" | "BLOGUERO";
  inmobiliariaId?: string | null;
  advisorId?: string | null;
};
