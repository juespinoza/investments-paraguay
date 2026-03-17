import LegalPage, {
  generateMetadata,
} from "@/app/[locale]/(public)/legales/page";
import { PublicShell } from "@/components/landing/PublicShell";

export { generateMetadata };

export default async function LegalRoute() {
  return (
    <PublicShell>
      <LegalPage />
    </PublicShell>
  );
}
