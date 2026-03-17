import AdvisorLandingPage, {
  generateMetadata,
} from "@/app/[locale]/(public)/bienes-raices/asesores/[slug]/page";
import { PublicShell } from "@/components/landing/PublicShell";

export { generateMetadata };
export const revalidate = 300;

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function AdvisorRoute({ params }: PageProps) {
  return (
    <PublicShell>
      <AdvisorLandingPage params={params} />
    </PublicShell>
  );
}
