import PropertyPage, {
  generateMetadata,
} from "@/app/[locale]/(public)/bienes-raices/propiedades/[slug]/page";
import { PublicShell } from "@/components/landing/PublicShell";

export { generateMetadata };
export const revalidate = 120;

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function PropertyRoute({ params }: PageProps) {
  return (
    <PublicShell>
      <PropertyPage params={params} />
    </PublicShell>
  );
}
