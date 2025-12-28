import { ADVISORS } from "./advisors";
import { PROPERTIES } from "./properties";

export function getAdvisorBySlug(slug: string) {
  return ADVISORS.find((a) => a.slug === slug) ?? null;
}

export function getPropertyBySlug(slug: string) {
  return PROPERTIES.find((p) => p.slug === slug) ?? null;
}

export function listProperties() {
  return PROPERTIES;
}

export function listPropertiesByAdvisorSlug(advisorSlug: string) {
  return PROPERTIES.filter((p) => p.advisorSlug === advisorSlug);
}
