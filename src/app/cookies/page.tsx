import CookiesPage, {
  generateMetadata,
} from "@/app/[locale]/(public)/cookies/page";
import { PublicShell } from "@/components/landing/PublicShell";

export { generateMetadata };

export default async function CookiesRoute() {
  return (
    <PublicShell>
      <CookiesPage />
    </PublicShell>
  );
}
