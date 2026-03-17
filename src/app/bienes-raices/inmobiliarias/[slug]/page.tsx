import AgencyLandingPage, {
  generateMetadata,
} from "@/app/[locale]/(public)/bienes-raices/inmobiliarias/[slug]/page";
import { PublicShell } from "@/components/landing/PublicShell";

export { generateMetadata };
export const revalidate = 300;

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function InmobiliariaRoute({ params }: PageProps) {
  return (
    <PublicShell>
      <AgencyLandingPage params={params} />
    </PublicShell>
  );
}
