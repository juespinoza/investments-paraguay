import BlogPage, {
  metadata,
} from "@/app/[locale]/(public)/blog/page";
import { PublicShell } from "@/components/landing/PublicShell";

export { metadata };
export const revalidate = 60;

export default async function BlogRoute() {
  return (
    <PublicShell>
      <BlogPage />
    </PublicShell>
  );
}
