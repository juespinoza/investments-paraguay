import ContactPage, {
  generateMetadata,
} from "@/app/[locale]/(public)/contacto/page";
import { PublicShell } from "@/components/landing/PublicShell";

export { generateMetadata };

export default async function ContactRoute() {
  return (
    <PublicShell>
      <ContactPage />
    </PublicShell>
  );
}
