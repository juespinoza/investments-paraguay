import BienesRaicesPage, {
  metadata,
} from "@/app/[locale]/(public)/bienes-raices/page";
import { PublicShell } from "@/components/landing/PublicShell";

export { metadata };
export const revalidate = 60;

type PageProps = {
  searchParams: Promise<{
    q?: string;
    min?: string;
    max?: string;
  }>;
};

export default async function RealEstateRoute({ searchParams }: PageProps) {
  return (
    <PublicShell>
      <BienesRaicesPage searchParams={searchParams} />
    </PublicShell>
  );
}
