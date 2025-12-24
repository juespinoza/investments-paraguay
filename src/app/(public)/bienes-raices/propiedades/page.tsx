import { FeaturedGrid } from "@/components/landing/FeaturedGrid";
import { SectionTitle } from "@/components/landing/SectionTitle";
import { mockAdvisorLanding } from "@/lib/mock/data";

export default function PropertiesPage() {
  return (
    <div className="container-page py-10">
      <SectionTitle
        title="Propiedades"
        subtitle="Explorá oportunidades en Paraguay."
      />
      <div className="mt-8">
        <FeaturedGrid title="" items={mockAdvisorLanding.featuredProperties} />
      </div>
    </div>
  );
}
