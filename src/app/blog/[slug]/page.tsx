import PublicBlogPostPage, {
  generateMetadata,
} from "@/app/[locale]/(public)/blog/[slug]/page";
import { PublicShell } from "@/components/landing/PublicShell";

export { generateMetadata };

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function BlogPostRoute({ params }: PageProps) {
  return (
    <PublicShell>
      <PublicBlogPostPage params={params} />
    </PublicShell>
  );
}
