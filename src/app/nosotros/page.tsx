import AboutPage, {
  generateMetadata,
} from "@/app/[locale]/(public)/nosotros/page";
import { PublicShell } from "@/components/landing/PublicShell";

export { generateMetadata };

export default async function AboutRoute() {
  return (
    <PublicShell>
      <AboutPage />
    </PublicShell>
  );
}
