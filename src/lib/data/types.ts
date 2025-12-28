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

  testimonials: Testimonial[];
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
