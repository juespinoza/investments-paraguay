import { AdvisorForm } from "@/components/virtualoffice/advisors/AdvisorForm";

export default function NewAdvisorPage() {
  return (
    <div className="container-page container-narrow py-8">
      <AdvisorForm mode="create" />
    </div>
  );
}