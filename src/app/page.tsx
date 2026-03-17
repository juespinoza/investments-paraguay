import { HomePageContent } from "@/components/landing/HomePageContent";
import { PublicShell } from "@/components/landing/PublicShell";

export default async function RootHomePage() {
  return (
    <PublicShell>
      <main className="pb-8">
        <HomePageContent />
      </main>
    </PublicShell>
  );
}
