import "server-only";

import { Prisma, SocialPlatform } from "@/generated/prisma";
import type { PublicAdvisorLanding } from "@/lib/data/types";

export type AdvisorLandingInput = {
  aboutImageUrl?: string | null;
  aboutTitle: string;
  startDate: string;
  company: string;
  aboutDescription?: string | null;
  aboutParagraph1: string;
  aboutParagraph2: string;
  servicesParagraph1: string;
  servicesParagraph2: string;
  propertyTypes: string[];
  clientTypes: string[];
  areas: string[];
  serviceList: string[];
  testimonies: Array<{ name: string; text: string }>;
  socialMedia: Array<{
    platform: string;
    label: string;
    value: string;
    href: string;
  }>;
  featuredPropertyIds: string[];
};

type AdvisorWithDetail = Prisma.AdvisorGetPayload<{
  include: {
    landing: {
      include: {
        propertyTypes: true;
        clientTypes: true;
        areas: true;
        serviceList: true;
        testimonies: true;
        socialMedia: true;
        featuredProperties: true;
      };
    };
  };
}>;

type AdvisorWithPublicLanding = Prisma.AdvisorGetPayload<{
  include: {
    landing: {
      include: {
        propertyTypes: true;
        clientTypes: true;
        areas: true;
        serviceList: true;
        testimonies: true;
        socialMedia: true;
        featuredProperties: {
          include: {
            property: true;
          };
        };
      };
    };
  };
}>;

export function buildAdvisorLandingCreateData(input: AdvisorLandingInput) {
  return {
    aboutImageUrl: input.aboutImageUrl ?? "",
    aboutTitle: input.aboutTitle,
    startDate: new Date(input.startDate),
    company: input.company,
    aboutDescription: input.aboutDescription ?? null,
    aboutParagraph1: input.aboutParagraph1,
    aboutParagraph2: input.aboutParagraph2,
    servicesParagraph1: input.servicesParagraph1,
    servicesParagraph2: input.servicesParagraph2,
  };
}

export function buildAdvisorLandingUpdateData(input: AdvisorLandingInput) {
  return buildAdvisorLandingCreateData(input);
}

export async function replaceAdvisorLandingCollections(
  tx: Prisma.TransactionClient,
  landingId: string,
  data: AdvisorLandingInput,
) {
  await tx.landingAdvisorPropertyType.deleteMany({ where: { landingId } });
  await tx.landingAdvisorClientType.deleteMany({ where: { landingId } });
  await tx.landingAdvisorArea.deleteMany({ where: { landingId } });
  await tx.landingAdvisorServiceItem.deleteMany({ where: { landingId } });
  await tx.advisorTestimonial.deleteMany({ where: { landingId } });
  await tx.advisorSocialLink.deleteMany({ where: { landingId } });
  await tx.landingAdvisorFeaturedProperty.deleteMany({ where: { landingId } });

  if (data.propertyTypes.length) {
    await tx.landingAdvisorPropertyType.createMany({
      data: data.propertyTypes.map((value) => ({ landingId, value })),
    });
  }
  if (data.clientTypes.length) {
    await tx.landingAdvisorClientType.createMany({
      data: data.clientTypes.map((value) => ({ landingId, value })),
    });
  }
  if (data.areas.length) {
    await tx.landingAdvisorArea.createMany({
      data: data.areas.map((value) => ({ landingId, value })),
    });
  }
  if (data.serviceList.length) {
    await tx.landingAdvisorServiceItem.createMany({
      data: data.serviceList.map((value) => ({ landingId, value })),
    });
  }
  if (data.testimonies.length) {
    await tx.advisorTestimonial.createMany({
      data: data.testimonies.map((item) => ({
        landingId,
        name: item.name,
        text: item.text,
      })),
    });
  }
  if (data.socialMedia.length) {
    await tx.advisorSocialLink.createMany({
      data: data.socialMedia.map((item) => ({
        landingId,
        platform: item.platform as SocialPlatform,
        label: item.label,
        value: item.value,
        href: item.href,
      })),
    });
  }
}

export function mapAdvisorLandingToFormData(advisor: AdvisorWithDetail) {
  return {
    aboutImageUrl: advisor.landing?.aboutImageUrl ?? advisor.photoUrl ?? null,
    aboutTitle: advisor.landing?.aboutTitle ?? "",
    startDate: advisor.landing
      ? new Date(advisor.landing.startDate).toISOString().slice(0, 10)
      : "",
    company: advisor.landing?.company ?? "",
    aboutDescription: advisor.landing?.aboutDescription ?? null,
    aboutParagraph1: advisor.landing?.aboutParagraph1 ?? "",
    aboutParagraph2: advisor.landing?.aboutParagraph2 ?? "",
    servicesParagraph1: advisor.landing?.servicesParagraph1 ?? "",
    servicesParagraph2: advisor.landing?.servicesParagraph2 ?? "",
    propertyTypes: advisor.landing?.propertyTypes.map((item) => item.value) ?? [],
    clientTypes: advisor.landing?.clientTypes.map((item) => item.value) ?? [],
    areas: advisor.landing?.areas.map((item) => item.value) ?? [],
    serviceList: advisor.landing?.serviceList.map((item) => item.value) ?? [],
    testimonies:
      advisor.landing?.testimonies.map((item) => ({
        name: item.name,
        text: item.text,
      })) ?? [],
    socialMedia:
      advisor.landing?.socialMedia.map((item) => ({
        platform: item.platform,
        label: item.label,
        value: item.value,
        href: item.href,
      })) ?? [],
    featuredPropertyIds:
      advisor.landing?.featuredProperties.map((item) => item.propertyId) ?? [],
  };
}

function calculateYearsExperience(startDate: Date) {
  const now = new Date();
  let years = now.getUTCFullYear() - startDate.getUTCFullYear();
  const monthDelta = now.getUTCMonth() - startDate.getUTCMonth();
  const dayDelta = now.getUTCDate() - startDate.getUTCDate();

  if (monthDelta < 0 || (monthDelta === 0 && dayDelta < 0)) {
    years -= 1;
  }

  return Math.max(0, years);
}

export function mapAdvisorToPublicLanding(
  advisor: AdvisorWithPublicLanding,
): PublicAdvisorLanding {
  if (!advisor.landing) {
    throw new Error("Asesor no encontrado");
  }

  return {
    slug: advisor.slug,
    fullName: advisor.fullName,
    headline: advisor.headline ?? null,
    heroBgUrl: advisor.heroBgUrl ?? null,
    ctaLabel: advisor.ctaLabel ?? null,
    ctaHref: advisor.ctaHref ?? null,
    about: {
      imageUrl: advisor.landing.aboutImageUrl || advisor.photoUrl || "",
      title: advisor.landing.aboutTitle,
      startDate: advisor.landing.startDate.toISOString(),
      companyName: advisor.landing.company,
      description: advisor.landing.aboutDescription ?? null,
      paragraphs: [
        advisor.landing.aboutParagraph1,
        advisor.landing.aboutParagraph2,
      ],
      yearsExperience: calculateYearsExperience(advisor.landing.startDate),
    },
    services: {
      propertyTypes: advisor.landing.propertyTypes.map((item) => item.value),
      clientTypes: advisor.landing.clientTypes.map((item) => item.value),
      areas: advisor.landing.areas.map((item) => item.value),
      serviceList: advisor.landing.serviceList.map((item) => item.value),
      paragraphs: [
        advisor.landing.servicesParagraph1,
        advisor.landing.servicesParagraph2,
      ],
    },
    featuredProperties: advisor.landing.featuredProperties.map((item) => ({
      slug: item.property.slug,
      title: item.property.title,
      coverImageUrl: item.property.coverImageUrl ?? null,
      priceUsd: item.property.priceUsd ?? null,
      city: item.property.city ?? null,
    })),
    testimonies: advisor.landing.testimonies.map((item) => ({
      name: item.name,
      text: item.text,
    })),
    socialMedia: advisor.landing.socialMedia.map((item) => ({
      label: item.label,
      value: item.value,
      href: item.href,
      platform: item.platform,
    })),
  };
}
