import LeadMagnetPage, {
  generateMetadata,
} from "@/app/[locale]/(public)/bienes-raices/asesores/[slug]/lead-magnet/page";
import { PublicShell } from "@/components/landing/PublicShell";

export { generateMetadata };

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function LeadMagnetRoute({ params }: PageProps) {
  return (
    <PublicShell>
      <LeadMagnetPage params={params} />
    </PublicShell>
  );
}
