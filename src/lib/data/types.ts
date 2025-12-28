export type SocialIconKey = "whatsapp" | "instagram" | "facebook" | "tiktok";

export type SocialLink = {
  label: string;
  value: string;
  href: string;
  icon: SocialIconKey;
};

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

  testimonies: Array<Testimonial>;

  socialMedia: Array<SocialItem>;
};
